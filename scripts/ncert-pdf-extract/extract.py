#!/usr/bin/env python3
"""
NCERT Math PDF → NormalizedProblem JSON extractor.

Heuristic pipeline (no LLM in this stage — pure text extraction):
1. Open PDF via PyMuPDF (fitz).
2. Use the embedded ToC to locate chapter starts. If absent, fall back to "Chapter N" regex on page text.
3. For each chapter, slice text from chapter_start to next_chapter_start.
4. Detect sections via "N.M  Title" pattern at start of line.
5. Detect exercises via "EXERCISE N.M" marker (NCERT canonical convention).
6. Within each exercise block, split into numbered problems via "^\\d+\\." or "^\\(N\\)" or "^Q\\.\\s*N" patterns.
7. Detect worked examples via "Example N" pattern.
8. Emit one JSON file per grade with NormalizedProblem-compatible shape.

This stage does NOT call LLMs. The downstream LlmDraftService will take this JSON
through the standard ContentDraft pipeline (PENDING → reviewer → APPROVED → PUBLISHED).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from pathlib import Path

import fitz  # PyMuPDF


GRADE_TO_NCERT_CLASS = {
    7: "CLASS_7",
    8: "CLASS_8",
    9: "CLASS_9",
    10: "CLASS_10",
    11: "CLASS_11",
    12: "CLASS_12",
}


@dataclass
class ExtractedProblem:
    problemKey: str
    ncertClass: str
    chapterNumber: int
    chapterTitleHint: str
    exerciseId: str | None
    qIndex: int
    text: str
    sourceRef: str
    # Optional enrichments populated if pattern-matched in source text
    questionType: str | None = None


@dataclass
class ExtractedExample:
    exampleKey: str
    chapterNumber: int
    chapterTitleHint: str
    exampleNumber: int
    body: str
    solution: str
    sourceRef: str


@dataclass
class ExtractedChapter:
    chapterNumber: int
    title: str
    ncertClass: str
    pageStart: int
    pageEnd: int
    sections: list[dict] = field(default_factory=list)
    problems: list[ExtractedProblem] = field(default_factory=list)
    examples: list[ExtractedExample] = field(default_factory=list)
    rawCharCount: int = 0


@dataclass
class ExtractionReport:
    pdfPath: str
    grade: int
    ncertClass: str
    totalPages: int
    chaptersFound: int
    problemsFound: int
    examplesFound: int
    extractedAt: str


def detect_chapters_from_toc(doc: fitz.Document) -> list[tuple[int, str, int]]:
    """Return [(chapter_number, title, page_start_0indexed)].

    NCERT PDFs typically have ToC entries like:
        [level, 'Chapter 1', page]
        [level, 'Ch-1 Title', page]
        [level, 'Title alone', page]
    We pick entries that look like "Chapter N" anchors, then deduce title from the next sibling entry.
    """
    toc = doc.get_toc(simple=True)  # [[level, title, page1based], ...]
    chapters: list[tuple[int, str, int]] = []
    seen_numbers: set[int] = set()
    for entry in toc:
        level, title, page1 = entry
        page0 = max(0, page1 - 1)
        m = re.match(r"^\s*Chapter\s+(\d+)\b\s*[-:]?\s*(.*)$", title, re.IGNORECASE)
        if m:
            n = int(m.group(1))
            rest = m.group(2).strip()
            if n in seen_numbers:
                continue
            seen_numbers.add(n)
            chapters.append((n, rest, page0))
            continue
        m2 = re.match(r"^\s*Ch[-\s]*(\d+)\b\s*[:.\-]?\s*(.+)$", title, re.IGNORECASE)
        if m2:
            n = int(m2.group(1))
            rest = m2.group(2).strip()
            if n in seen_numbers:
                continue
            seen_numbers.add(n)
            chapters.append((n, rest, page0))
            continue
    chapters.sort(key=lambda x: (x[0], x[2]))
    return chapters


def detect_chapters_by_text(doc: fitz.Document) -> list[tuple[int, str, int]]:
    """Fallback: scan first ~80 chars of each page for 'Chapter N' marker."""
    chapters: list[tuple[int, str, int]] = []
    seen: set[int] = set()
    for i in range(len(doc)):
        head = doc[i].get_text()[:240]
        m = re.search(r"\bChapter\s+(\d+)\b", head, re.IGNORECASE)
        if m:
            n = int(m.group(1))
            if n in seen:
                continue
            seen.add(n)
            title_match = re.search(rf"Chapter\s+{n}\s*[-:]?\s*([A-Z][A-Za-z][^\n]{{0,80}})", head, re.IGNORECASE)
            title = title_match.group(1).strip() if title_match else ""
            chapters.append((n, title, i))
    chapters.sort(key=lambda x: x[0])
    return chapters


def page_text_clean(doc: fitz.Document, page_idx: int) -> str:
    """Extract page text with light cleanup."""
    txt = doc[page_idx].get_text()
    # collapse repeated whitespace, but preserve newlines for layout heuristics
    txt = re.sub(r"[ \t]+", " ", txt)
    txt = re.sub(r"\n{3,}", "\n\n", txt)
    return txt


def gather_chapter_text(doc: fitz.Document, page_start: int, page_end: int) -> tuple[str, dict[int, tuple[int, int]]]:
    """Concatenate pages [start, end] inclusive. Return (text, page_to_char_range_map)."""
    parts: list[str] = []
    page_ranges: dict[int, tuple[int, int]] = {}
    cursor = 0
    for p in range(page_start, page_end + 1):
        if p >= len(doc):
            break
        t = page_text_clean(doc, p)
        parts.append(t)
        new_cursor = cursor + len(t)
        page_ranges[p] = (cursor, new_cursor)
        cursor = new_cursor + 1  # +1 for joining newline
    text = "\n".join(parts)
    return text, page_ranges


def page_at_offset(page_ranges: dict[int, tuple[int, int]], offset: int) -> int:
    for p, (a, b) in page_ranges.items():
        if a <= offset <= b:
            return p
    return next(iter(page_ranges.keys()), 0)


_SECTION_RE = re.compile(r"^\s*(\d+)\.(\d+)\s+([A-Z][^\n]{1,100})$", re.MULTILINE)
_EXERCISE_RE = re.compile(r"\bEXERCISE\s+(\d+)\.(\d+)\b", re.IGNORECASE)
_EXAMPLE_RE = re.compile(r"\bExample\s+(\d+)\b\s*[:.\-]?\s*", re.IGNORECASE)
_WHAT_DISCUSSED_RE = re.compile(r"What\s+have\s+we\s+discussed", re.IGNORECASE)
_PROBLEM_NUM_RE = re.compile(r"(?:^|\n)\s*(\d{1,2})\s*\.\s+([^\n]+(?:\n(?!\s*\d{1,2}\s*\.|EXERCISE|Example)[^\n]+)*)", re.IGNORECASE)

# === NEP 2020 / NCF-SE new-style textbooks (Ganita Prakash / Ganita Manjari) ===
_FIGURE_IT_OUT_RE = re.compile(r"Figure\s+it\s+Out", re.IGNORECASE)
_TRY_THIS_RE = re.compile(r"Try\s+This", re.IGNORECASE)
_MATH_TALK_RE = re.compile(r"Math\s+Talk", re.IGNORECASE)
_NEW_BOX_NEXT_HEADER_RE = re.compile(r"\n\s*\n([A-Z][A-Za-z][^\n]{2,80})\n", re.MULTILINE)
# Bullet patterns for new-style: "1.\t", "1. ", "(a) ", "(i) "
_NEW_PROBLEM_NUM_RE = re.compile(
    r"(?:^|\n)\s*(\d{1,2})[\.\)]\s+([^\n]+(?:\n(?!\s*\d{1,2}[\.\)]\s|Figure\s+it\s+Out|Try\s+This|Math\s+Talk|EXERCISE|Example)[^\n]+){0,8})",
    re.IGNORECASE,
)


def extract_sections(chapter_text: str, chapter_number: int) -> list[dict]:
    out: list[dict] = []
    for m in _SECTION_RE.finditer(chapter_text):
        major = int(m.group(1))
        minor = int(m.group(2))
        if major != chapter_number:
            continue
        out.append({"code": f"{major}.{minor}", "title": m.group(3).strip()})
    seen = set()
    deduped = []
    for s in out:
        if s["code"] not in seen:
            seen.add(s["code"])
            deduped.append(s)
    return deduped


def extract_exercises_and_problems(
    chapter_text: str,
    page_ranges: dict[int, tuple[int, int]],
    chapter_number: int,
    chapter_title: str,
    ncert_class: str,
) -> list[ExtractedProblem]:
    """Find EXERCISE blocks and split into numbered problems."""
    problems: list[ExtractedProblem] = []
    # mark end-of-chapter at "What have we discussed" or end of text
    end_marker = _WHAT_DISCUSSED_RE.search(chapter_text)
    end_pos = end_marker.start() if end_marker else len(chapter_text)

    matches = list(_EXERCISE_RE.finditer(chapter_text[:end_pos]))
    for i, m in enumerate(matches):
        major = int(m.group(1))
        minor = int(m.group(2))
        if major != chapter_number:
            # skip cross-chapter mentions
            continue
        block_start = m.end()
        block_end = matches[i + 1].start() if i + 1 < len(matches) else end_pos
        block = chapter_text[block_start:block_end]
        # Split into numbered problems
        for pm in _PROBLEM_NUM_RE.finditer(block):
            q_idx = int(pm.group(1))
            body_raw = pm.group(2).strip()
            # filter out fragments shorter than 8 chars (likely false matches like "1. End")
            if len(body_raw) < 8:
                continue
            absolute_offset = block_start + pm.start()
            page = page_at_offset(page_ranges, absolute_offset)
            problems.append(
                ExtractedProblem(
                    problemKey=f"NCERT-C{chapter_number_to_class_int(ncert_class)}-CH{chapter_number:02d}-EX{major}.{minor}-Q{q_idx}",
                    ncertClass=ncert_class,
                    chapterNumber=chapter_number,
                    chapterTitleHint=chapter_title,
                    exerciseId=f"{major}.{minor}",
                    qIndex=q_idx,
                    text=normalize_problem_text(body_raw),
                    sourceRef=f"page={page + 1}",
                    questionType=infer_question_type(body_raw),
                )
            )
    return problems


def chapter_number_to_class_int(ncert_class: str) -> int:
    m = re.match(r"CLASS_(\d+)", ncert_class)
    return int(m.group(1)) if m else 0


def normalize_problem_text(t: str) -> str:
    t = re.sub(r"\s+", " ", t).strip()
    # remove trailing page-number debris
    t = re.sub(r"\s+\d{1,3}\s*$", "", t)
    return t


def infer_question_type(body: str) -> str | None:
    if re.search(r"\(\s*[abcd]\s*\)", body, re.IGNORECASE):
        return "MCQ"
    if re.search(r"assertion|reason", body, re.IGNORECASE):
        return "ASSERTION_REASON"
    if re.search(r"^\s*[+-]?\d+(\.\d+)?\s*$", body):
        return "NUMERICAL"
    return "FREE_RESPONSE"


def extract_new_textbook_problems(
    chapter_text: str,
    page_ranges: dict[int, tuple[int, int]],
    chapter_number: int,
    chapter_title: str,
    ncert_class: str,
) -> list[ExtractedProblem]:
    """Extract problems from NEP 2020 NCF-SE textbooks (Ganita Prakash / Ganita Manjari).

    These books replaced 'EXERCISE N.M' with 'Figure it Out', 'Try This', 'Math Talk' boxes
    interleaved with narrative content. A box runs from its marker until the next
    capitalized header line or the next box marker.
    """
    problems: list[ExtractedProblem] = []
    box_markers: list[tuple[int, str, int]] = []  # (start_pos, kind, ordinal)

    for kind, regex in (("FIO", _FIGURE_IT_OUT_RE), ("TRY", _TRY_THIS_RE), ("MT", _MATH_TALK_RE)):
        for ord_idx, m in enumerate(regex.finditer(chapter_text), 1):
            box_markers.append((m.end(), kind, ord_idx))
    box_markers.sort(key=lambda x: x[0])

    fio_count = 0
    for i, (start, kind, _ord) in enumerate(box_markers):
        if kind == "FIO":
            fio_count += 1
        next_box_start = box_markers[i + 1][0] if i + 1 < len(box_markers) else len(chapter_text)
        # cut at next capitalized header
        header_match = _NEW_BOX_NEXT_HEADER_RE.search(chapter_text, start, next_box_start)
        block_end = min(next_box_start, header_match.start() if header_match else next_box_start)
        block = chapter_text[start:block_end]
        if len(block) < 20:
            continue
        # split into numbered problems within this box
        for pm in _NEW_PROBLEM_NUM_RE.finditer(block):
            q_idx = int(pm.group(1))
            body_raw = pm.group(2).strip()
            if len(body_raw) < 8:
                continue
            absolute_offset = start + pm.start()
            page = page_at_offset(page_ranges, absolute_offset)
            box_id = f"FIO-{fio_count}" if kind == "FIO" else f"{kind}-{i + 1}"
            problems.append(
                ExtractedProblem(
                    problemKey=f"NCERT-C{chapter_number_to_class_int(ncert_class)}-CH{chapter_number:02d}-{box_id}-Q{q_idx}",
                    ncertClass=ncert_class,
                    chapterNumber=chapter_number,
                    chapterTitleHint=chapter_title,
                    exerciseId=box_id,
                    qIndex=q_idx,
                    text=normalize_problem_text(body_raw),
                    sourceRef=f"page={page + 1}",
                    questionType=infer_question_type(body_raw),
                )
            )
    return problems


def extract_examples(
    chapter_text: str,
    page_ranges: dict[int, tuple[int, int]],
    chapter_number: int,
    chapter_title: str,
) -> list[ExtractedExample]:
    """Detect 'Example N' worked examples. Body = up to next 'Example' or 'EXERCISE' or 'Solution' marker."""
    examples: list[ExtractedExample] = []
    end_marker = _WHAT_DISCUSSED_RE.search(chapter_text)
    end_pos = end_marker.start() if end_marker else len(chapter_text)
    matches = list(_EXAMPLE_RE.finditer(chapter_text[:end_pos]))
    for i, m in enumerate(matches):
        ex_num = int(m.group(1))
        start = m.end()
        next_marker_pos = end_pos
        if i + 1 < len(matches):
            next_marker_pos = min(next_marker_pos, matches[i + 1].start())
        exer_next = _EXERCISE_RE.search(chapter_text, start)
        if exer_next:
            next_marker_pos = min(next_marker_pos, exer_next.start())
        body_full = chapter_text[start:next_marker_pos].strip()
        # Split body vs solution if "Solution" keyword present
        sol_m = re.search(r"\bSolution\b\s*[:.\-]?", body_full, re.IGNORECASE)
        if sol_m:
            body = body_full[: sol_m.start()].strip()
            solution = body_full[sol_m.end() :].strip()
        else:
            body = body_full
            solution = ""
        if len(body) < 8:
            continue
        page = page_at_offset(page_ranges, start)
        examples.append(
            ExtractedExample(
                exampleKey=f"NCERT-CH{chapter_number:02d}-EX-{ex_num}",
                chapterNumber=chapter_number,
                chapterTitleHint=chapter_title,
                exampleNumber=ex_num,
                body=normalize_problem_text(body)[:1200],
                solution=normalize_problem_text(solution)[:1500],
                sourceRef=f"page={page + 1}",
            )
        )
    return examples


def detect_textbook_style(doc: fitz.Document, sample_pages: int = 60) -> str:
    """Return 'new' for NEP-2020 NCF-SE textbooks (Ganita Prakash/Manjari), 'old' for standard NCERT.

    Heuristic: count 'Figure it Out' vs 'EXERCISE N.M' markers in the first sample_pages.
    Equal counts (both zero / very few) default to 'new' since Ganita Manjari has neither.
    """
    sample = "".join(doc[i].get_text() for i in range(min(len(doc), sample_pages)))
    fio = len(_FIGURE_IT_OUT_RE.findall(sample))
    exr = len(_EXERCISE_RE.findall(sample))
    if exr > fio and exr >= 2:
        return "old"
    if fio > 0:
        return "new"
    # Fallback: check title page
    head = doc[0].get_text()[:300].upper()
    if "GANITA" in head:
        return "new"
    return "old"


def extract_pdf(pdf_path: Path, grade: int, output_dir: Path, style: str | None = None) -> tuple[ExtractionReport, list[ExtractedChapter]]:
    if grade not in GRADE_TO_NCERT_CLASS:
        raise ValueError(f"Unsupported grade {grade}; expected 7..12")
    ncert_class = GRADE_TO_NCERT_CLASS[grade]

    doc = fitz.open(str(pdf_path))
    try:
        if style is None:
            style = detect_textbook_style(doc)
        chapters = detect_chapters_from_toc(doc)
        if not chapters:
            chapters = detect_chapters_by_text(doc)
        if not chapters:
            raise RuntimeError(f"Could not detect any chapters in {pdf_path.name}")

        # Build chapter page ranges
        sorted_ch = sorted(chapters, key=lambda x: x[0])
        chapter_ranges: list[tuple[int, str, int, int]] = []
        for i, (n, title, pstart) in enumerate(sorted_ch):
            pend = sorted_ch[i + 1][2] - 1 if i + 1 < len(sorted_ch) else len(doc) - 1
            chapter_ranges.append((n, title, pstart, pend))

        extracted_chapters: list[ExtractedChapter] = []
        for n, title, pstart, pend in chapter_ranges:
            ch_text, page_ranges = gather_chapter_text(doc, pstart, pend)
            sections = extract_sections(ch_text, n)
            if style == "new":
                problems = extract_new_textbook_problems(ch_text, page_ranges, n, title, ncert_class)
            else:
                problems = extract_exercises_and_problems(ch_text, page_ranges, n, title, ncert_class)
            examples = extract_examples(ch_text, page_ranges, n, title)
            extracted_chapters.append(
                ExtractedChapter(
                    chapterNumber=n,
                    title=title or f"Chapter {n}",
                    ncertClass=ncert_class,
                    pageStart=pstart + 1,
                    pageEnd=pend + 1,
                    sections=sections,
                    problems=problems,
                    examples=examples,
                    rawCharCount=len(ch_text),
                )
            )

        report = ExtractionReport(
            pdfPath=str(pdf_path),
            grade=grade,
            ncertClass=ncert_class,
            totalPages=len(doc),
            chaptersFound=len(extracted_chapters),
            problemsFound=sum(len(c.problems) for c in extracted_chapters),
            examplesFound=sum(len(c.examples) for c in extracted_chapters),
            extractedAt=datetime.now(timezone.utc).isoformat(),
        )
        return report, extracted_chapters
    finally:
        doc.close()


def write_outputs(output_dir: Path, grade: int, report: ExtractionReport, chapters: list[ExtractedChapter]) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    # 1. report.json
    (output_dir / f"grade-{grade}.report.json").write_text(
        json.dumps(asdict(report), indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    # 2. chapters.json (taxonomy)
    chapters_min = []
    for c in chapters:
        chapters_min.append(
            {
                "chapterNumber": c.chapterNumber,
                "title": c.title,
                "ncertClass": c.ncertClass,
                "pageStart": c.pageStart,
                "pageEnd": c.pageEnd,
                "sections": c.sections,
                "problemCount": len(c.problems),
                "exampleCount": len(c.examples),
            }
        )
    (output_dir / f"grade-{grade}.chapters.json").write_text(
        json.dumps(
            {"version": f"ncert-grade-{grade}@{datetime.now(timezone.utc).strftime('%Y-%m')}", "chapters": chapters_min},
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    # 3. problems.json (NormalizedProblem array)
    all_problems = []
    for c in chapters:
        for p in c.problems:
            all_problems.append({k: v for k, v in asdict(p).items() if v is not None})
    (output_dir / f"grade-{grade}.problems.json").write_text(
        json.dumps(
            {
                "version": f"ncert-grade-{grade}-problems@{datetime.now(timezone.utc).strftime('%Y-%m')}",
                "ncertClass": GRADE_TO_NCERT_CLASS[grade],
                "problems": all_problems,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )
    # 4. examples.json (worked examples — separate; map to ConceptLesson WORKED_EXAMPLE step in importer)
    all_examples = []
    for c in chapters:
        for e in c.examples:
            all_examples.append(asdict(e))
    (output_dir / f"grade-{grade}.examples.json").write_text(
        json.dumps(
            {
                "version": f"ncert-grade-{grade}-examples@{datetime.now(timezone.utc).strftime('%Y-%m')}",
                "ncertClass": GRADE_TO_NCERT_CLASS[grade],
                "examples": all_examples,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pdf", required=True, type=Path)
    parser.add_argument("--grade", required=True, type=int)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--style", choices=["old", "new", "auto"], default="auto")
    args = parser.parse_args()

    if not args.pdf.exists():
        print(f"PDF not found: {args.pdf}", file=sys.stderr)
        return 1

    style = None if args.style == "auto" else args.style
    report, chapters = extract_pdf(args.pdf, args.grade, args.output, style)
    write_outputs(args.output, args.grade, report, chapters)
    print(json.dumps(asdict(report), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
