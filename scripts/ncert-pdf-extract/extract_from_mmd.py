#!/usr/bin/env python3
"""
Extract NormalizedProblem JSON from Mathpix Markdown (.mmd) files.

MMD preserves LaTeX inline (\\(...\\)) and display (\\[...\\]) math, plus
\\section*{...} and \\subsection*{...} headers from the source PDF. This gives
us a much cleaner input than raw PDF text — we keep equations intact.

The chapter / EXERCISE / Figure it Out / Example markers are preserved as
either inside \\section*{...} braces or as raw text. We reuse the same
normalize/validate logic from extract.py to stay consistent.

Run:
  python scripts/ncert-pdf-extract/extract_from_mmd.py \\
    --mmd scripts/ncert-pdf-extract/output/mmd/Grade_8_Mathematics_Latest.mmd \\
    --grade 8 --output scripts/ncert-pdf-extract/output
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict
from datetime import datetime, timezone
from pathlib import Path

# Reuse normalize/validate + dataclasses from extract.py — same project
sys.path.insert(0, str(Path(__file__).parent))
from extract import (  # type: ignore
    ExtractedChapter,
    ExtractedExample,
    ExtractedProblem,
    ExtractionReport,
    GRADE_TO_NCERT_CLASS,
    chapter_number_to_class_int,
    infer_question_type,
    is_valid_problem_text,
    normalize_problem_text,
    write_outputs,
)

# === MMD-specific patterns ===
# \section*{EXERCISE 1.1}
_MMD_EXERCISE_SECTION_RE = re.compile(r"\\section\*\{\s*EXERCISE\s+(\d+)\.(\d+)\s*\}", re.IGNORECASE)
# \subsection*{1.2 Title} or \section*{1.2 Title}  — used to detect chapter/section bounds
_MMD_NUMBERED_SUBSECTION_RE = re.compile(r"\\(?:sub)?section\*\{\s*(\d+)\.(\d+)\s+([^}]+)\}")
# Ganita Prakash 'Figure it Out' often appears as inline header text rather than \section*
_MMD_FIGURE_IT_OUT_RE = re.compile(r"Figure\s+it\s+Out", re.IGNORECASE)
_MMD_TRY_THIS_RE = re.compile(r"Try\s+This", re.IGNORECASE)
_MMD_MATH_TALK_RE = re.compile(r"Math\s+Talk", re.IGNORECASE)
# Example marker — inside section header or as inline text
_MMD_EXAMPLE_RE = re.compile(r"\bExample\s+(\d+)\b\s*[:.\-]?\s*", re.IGNORECASE)
# Problem number at line start: '1. ' or '1)' (numbered enumeration)
_MMD_PROBLEM_NUM_RE = re.compile(
    r"(?:^|\n)\s*(\d{1,2})[\.\)]\s+([^\n]+(?:\n(?!\s*\d{1,2}[\.\)]\s|\\section|\\subsection|EXERCISE|Example|Figure\s+it\s+Out|Try\s+This|Math\s+Talk)[^\n]+){0,12})",
    re.IGNORECASE,
)
# Stop pattern for cutting problem blocks — any header
_MMD_HEADER_STOP_RE = re.compile(
    r"\\(?:sub)?section\*\{|EXERCISE\s+\d+\.\d+|Figure\s+it\s+Out|Try\s+This|Math\s+Talk|What\s+have\s+we\s+discussed",
    re.IGNORECASE,
)
_WHAT_DISCUSSED_RE = re.compile(r"What\s+have\s+we\s+discussed", re.IGNORECASE)


def detect_chapters_from_subsections(text: str) -> list[tuple[int, str, int]]:
    """Infer chapter starts from the first subsection that begins with each chapter number.

    Returns [(chapter_number, title, start_offset)] sorted by chapter number.
    """
    chapters: dict[int, tuple[str, int]] = {}
    for m in _MMD_NUMBERED_SUBSECTION_RE.finditer(text):
        major = int(m.group(1))
        minor = int(m.group(2))
        if major < 1 or major > 30:
            continue
        if major not in chapters:
            # Take the title from the first subsection — usually 'N.1 Introduction' or 'N.2 X'
            chapters[major] = (m.group(3).strip(), m.start())
    return [(n, chapters[n][0], chapters[n][1]) for n in sorted(chapters)]


def detect_chapters_fallback(text: str) -> list[tuple[int, str, int]]:
    """Fallback: use EXERCISE N.M offsets to deduce chapter boundaries."""
    chapters: dict[int, tuple[str, int]] = {}
    for m in _MMD_EXERCISE_SECTION_RE.finditer(text):
        major = int(m.group(1))
        if major not in chapters:
            chapters[major] = (f"Chapter {major}", m.start())
    return [(n, chapters[n][0], chapters[n][1]) for n in sorted(chapters)]


def extract_chapter_problems_old(
    chapter_text: str,
    chapter_number: int,
    chapter_title: str,
    ncert_class: str,
    reject_counters: dict[str, int],
) -> list[ExtractedProblem]:
    """Old-style NCERT (EXERCISE N.M) — Grades 8/10/11/12."""
    problems: list[ExtractedProblem] = []
    end_marker = _WHAT_DISCUSSED_RE.search(chapter_text)
    end_pos = end_marker.start() if end_marker else len(chapter_text)

    matches = list(_MMD_EXERCISE_SECTION_RE.finditer(chapter_text[:end_pos]))
    for i, m in enumerate(matches):
        major = int(m.group(1))
        minor = int(m.group(2))
        if major != chapter_number:
            continue
        block_start = m.end()
        block_end = matches[i + 1].start() if i + 1 < len(matches) else end_pos
        # also cut at next chapter/section header
        next_hdr = _MMD_HEADER_STOP_RE.search(chapter_text, block_start + 1, block_end)
        if next_hdr and next_hdr.start() < block_end:
            block_end = next_hdr.start()
        block = chapter_text[block_start:block_end]

        for pm in _MMD_PROBLEM_NUM_RE.finditer(block):
            q_idx = int(pm.group(1))
            body_raw = pm.group(2).strip()
            if len(body_raw) < 8:
                continue
            normalized = normalize_problem_text(body_raw)
            valid, reason = is_valid_problem_text(normalized)
            if not valid:
                if reason:
                    reject_counters[reason] = reject_counters.get(reason, 0) + 1
                continue
            problems.append(
                ExtractedProblem(
                    problemKey=f"NCERT-C{chapter_number_to_class_int(ncert_class)}-CH{chapter_number:02d}-EX{major}.{minor}-Q{q_idx}",
                    ncertClass=ncert_class,
                    chapterNumber=chapter_number,
                    chapterTitleHint=chapter_title,
                    exerciseId=f"{major}.{minor}",
                    qIndex=q_idx,
                    text=normalized,
                    sourceRef="mmd",
                    questionType=infer_question_type(normalized),
                )
            )
    return problems


def extract_chapter_problems_new(
    chapter_text: str,
    chapter_number: int,
    chapter_title: str,
    ncert_class: str,
    reject_counters: dict[str, int],
) -> list[ExtractedProblem]:
    """New-style NCF-SE textbooks (Ganita Prakash) — Grade 7."""
    problems: list[ExtractedProblem] = []
    box_markers: list[tuple[int, str]] = []
    for kind, rx in (("FIO", _MMD_FIGURE_IT_OUT_RE), ("TRY", _MMD_TRY_THIS_RE), ("MT", _MMD_MATH_TALK_RE)):
        for m in rx.finditer(chapter_text):
            box_markers.append((m.end(), kind))
    box_markers.sort(key=lambda x: x[0])

    fio_count = 0
    for i, (start, kind) in enumerate(box_markers):
        if kind == "FIO":
            fio_count += 1
        next_box_start = box_markers[i + 1][0] if i + 1 < len(box_markers) else len(chapter_text)
        # cut at next header (subsection / section / exercise)
        cutoff = _MMD_HEADER_STOP_RE.search(chapter_text, start + 1, next_box_start)
        block_end = min(next_box_start, cutoff.start() if cutoff else next_box_start)
        block = chapter_text[start:block_end]
        if len(block) < 20:
            continue

        for pm in _MMD_PROBLEM_NUM_RE.finditer(block):
            q_idx = int(pm.group(1))
            body_raw = pm.group(2).strip()
            if len(body_raw) < 8:
                continue
            normalized = normalize_problem_text(body_raw)
            valid, reason = is_valid_problem_text(normalized)
            if not valid:
                if reason:
                    reject_counters[reason] = reject_counters.get(reason, 0) + 1
                continue
            box_id = f"FIO-{fio_count}" if kind == "FIO" else f"{kind}-{i + 1}"
            problems.append(
                ExtractedProblem(
                    problemKey=f"NCERT-C{chapter_number_to_class_int(ncert_class)}-CH{chapter_number:02d}-{box_id}-Q{q_idx}",
                    ncertClass=ncert_class,
                    chapterNumber=chapter_number,
                    chapterTitleHint=chapter_title,
                    exerciseId=box_id,
                    qIndex=q_idx,
                    text=normalized,
                    sourceRef="mmd",
                    questionType=infer_question_type(normalized),
                )
            )
    return problems


def extract_chapter_examples(
    chapter_text: str,
    chapter_number: int,
    chapter_title: str,
) -> list[ExtractedExample]:
    examples: list[ExtractedExample] = []
    end_marker = _WHAT_DISCUSSED_RE.search(chapter_text)
    end_pos = end_marker.start() if end_marker else len(chapter_text)
    matches = list(_MMD_EXAMPLE_RE.finditer(chapter_text[:end_pos]))
    for i, m in enumerate(matches):
        ex_num = int(m.group(1))
        start = m.end()
        next_marker_pos = end_pos
        if i + 1 < len(matches):
            next_marker_pos = min(next_marker_pos, matches[i + 1].start())
        for stop_rx in (_MMD_EXERCISE_SECTION_RE, _MMD_HEADER_STOP_RE):
            cut = stop_rx.search(chapter_text, start, next_marker_pos)
            if cut:
                next_marker_pos = min(next_marker_pos, cut.start())
        body_full = chapter_text[start:next_marker_pos].strip()
        sol_m = re.search(r"\bSolution\b\s*[:.\-]?", body_full, re.IGNORECASE)
        if sol_m:
            body = body_full[: sol_m.start()].strip()
            solution = body_full[sol_m.end():].strip()
        else:
            body = body_full
            solution = ""
        if len(body) < 8:
            continue
        examples.append(
            ExtractedExample(
                exampleKey=f"NCERT-CH{chapter_number:02d}-EX-{ex_num}",
                chapterNumber=chapter_number,
                chapterTitleHint=chapter_title,
                exampleNumber=ex_num,
                body=normalize_problem_text(body)[:1500],
                solution=normalize_problem_text(solution)[:2000],
                sourceRef="mmd",
            )
        )
    return examples


def detect_style(text: str) -> str:
    fio = len(_MMD_FIGURE_IT_OUT_RE.findall(text))
    exr = len(_MMD_EXERCISE_SECTION_RE.findall(text))
    if exr >= 5:
        return "old"
    if fio >= 5:
        return "new"
    return "old"  # default — extracts fewer but not bogus


def extract_mmd(mmd_path: Path, grade: int, style: str | None = None) -> tuple[ExtractionReport, list[ExtractedChapter]]:
    if grade not in GRADE_TO_NCERT_CLASS:
        raise ValueError(f"Unsupported grade {grade}")
    ncert_class = GRADE_TO_NCERT_CLASS[grade]
    text = mmd_path.read_text(encoding="utf-8")
    if style is None:
        style = detect_style(text)

    chapters_meta = detect_chapters_from_subsections(text)
    if not chapters_meta:
        chapters_meta = detect_chapters_fallback(text)
    if not chapters_meta:
        raise RuntimeError(f"Could not detect chapters in {mmd_path.name}")

    chapter_ranges: list[tuple[int, str, int, int]] = []
    for i, (n, title, start) in enumerate(chapters_meta):
        end = chapters_meta[i + 1][2] if i + 1 < len(chapters_meta) else len(text)
        chapter_ranges.append((n, title, start, end))

    reject_counters: dict[str, int] = {}
    extracted: list[ExtractedChapter] = []
    for n, title, s, e in chapter_ranges:
        ch_text = text[s:e]
        if style == "new":
            problems = extract_chapter_problems_new(ch_text, n, title, ncert_class, reject_counters)
        else:
            problems = extract_chapter_problems_old(ch_text, n, title, ncert_class, reject_counters)
        examples = extract_chapter_examples(ch_text, n, title)
        extracted.append(
            ExtractedChapter(
                chapterNumber=n,
                title=title or f"Chapter {n}",
                ncertClass=ncert_class,
                pageStart=0,  # mmd has no page info
                pageEnd=0,
                sections=[],
                problems=problems,
                examples=examples,
                rawCharCount=len(ch_text),
            )
        )

    report = ExtractionReport(
        pdfPath=str(mmd_path),
        grade=grade,
        ncertClass=ncert_class,
        totalPages=0,
        chaptersFound=len(extracted),
        problemsFound=sum(len(c.problems) for c in extracted),
        examplesFound=sum(len(c.examples) for c in extracted),
        rejectedTooShort=reject_counters.get("too_short", 0),
        rejectedPureNoise=reject_counters.get("pure_noise", 0),
        rejectedNoLetters=reject_counters.get("no_letters", 0),
        extractedAt=datetime.now(timezone.utc).isoformat(),
    )
    return report, extracted


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mmd", required=True, type=Path)
    parser.add_argument("--grade", required=True, type=int)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--style", choices=["old", "new", "auto"], default="auto")
    args = parser.parse_args()

    if not args.mmd.exists():
        print(f"MMD not found: {args.mmd}", file=sys.stderr)
        return 1
    style = None if args.style == "auto" else args.style
    report, chapters = extract_mmd(args.mmd, args.grade, style)
    write_outputs(args.output, args.grade, report, chapters)
    print(json.dumps(asdict(report), indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
