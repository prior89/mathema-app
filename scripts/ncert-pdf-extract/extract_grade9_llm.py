#!/usr/bin/env python3
"""
LLM-based problem extraction for narrative-style NCERT textbooks.

Targets Ganita Manjari (Grade 9, NCF-SE 2023 syllabus) which uses inline
activity-based questions instead of explicit EXERCISE blocks. Pattern
matching extracts only 6 problems across 8 chapters; this script uses
Claude Haiku 4.5 to identify student-evaluatable questions embedded in
chapter prose ("Do you see why...", "Find...", "Show that...", etc.).

Output: NormalizedProblem JSON identical in shape to extract.py /
extract_from_mmd.py output. Feeds the standard JSON_BULK -> ContentIngestJob
-> LLM Draft pipeline downstream.

Cost estimate: ~$0.30-0.60 for Grade 9 (8 chapters, ~95K input tokens,
~20K output tokens) on Anthropic Haiku 4.5 with no caching.

Run:
  set ANTHROPIC_API_KEY=<your_anthropic_key>
  python scripts/ncert-pdf-extract/extract_grade9_llm.py \\
    --mmd scripts/ncert-pdf-extract/output/mmd/Grade_9_Mathematics_Latest.mmd \\
    --grade 9 \\
    --output scripts/ncert-pdf-extract/output/from_mmd_llm
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path

from anthropic import Anthropic

sys.path.insert(0, str(Path(__file__).parent))
from extract import GRADE_TO_NCERT_CLASS, chapter_number_to_class_int  # type: ignore
from extract_from_mmd import detect_chapters_combined  # type: ignore


SYSTEM_PROMPT = """You are extracting student-evaluatable mathematics questions from an NCERT mathematics textbook (NCF-SE 2023 syllabus — Ganita Prakash / Ganita Manjari series).

This textbook uses a NARRATIVE STYLE: instead of clearly-labelled EXERCISE blocks, questions are embedded inline within the chapter prose. Students are expected to answer questions like these:

  - Direct imperatives:   "Find the slope of line AB.", "Show that triangles ABC and DEF are congruent.", "Calculate the area."
  - Inline prompts:       "Do you see why this works?", "Can you explain the pattern?", "Notice that... — what does this tell us?"
  - Activity tasks:       "Construct a parallelogram with sides 5 cm and 8 cm.", "Mark the midpoint of segment AB.", "Draw the locus."
  - Verification calls:   "Verify your answer using...", "Check whether the values you obtained are correct."

EXTRACT EVERY such question. Do NOT extract:

  - Pure narrative descriptions of mathematical concepts ("The coordinate system uses two axes...")
  - Definitions or theorem statements ("A polynomial of degree two is called a quadratic polynomial.")
  - Worked example solutions (these are extracted separately)
  - Storyline elements that do not ask the student anything ("Reiaan looked at the map.")

Preserve LaTeX math expressions exactly as encountered: \\(...\\) for inline, \\[...\\] for display.

Return STRICT JSON only. No markdown code fence, no surrounding commentary:

{
  "problems": [
    {
      "text": "the complete question text in English, LaTeX preserved",
      "conceptCodes": ["short_concept_tag_1", "short_concept_tag_2"],
      "difficultyLevel": 2,
      "questionType": "FREE_RESPONSE"
    }
  ]
}

Field rules:
  - difficultyLevel: integer 1-5.  1=recall, 2=routine application, 3=multi-step, 4=challenging, 5=very hard.  Default 2.
  - questionType:    one of  FREE_RESPONSE | MCQ | ASSERTION_REASON | NUMERICAL | SUBJECTIVE
  - conceptCodes:    1-3 short snake_case tags such as "cartesian_plane", "slope_formula", "midpoint_formula", "perimeter_rectangle"
  - text:            do NOT paraphrase — copy the question verbatim with LaTeX, keep the figure reference text if any
  - If a question references a figure / table not visible to you, still include the question; the human reviewer will resolve.

If the chapter contains ZERO student-facing questions (extremely unusual), return: {"problems": []}
"""


def call_llm(client: Anthropic, chapter_text: str, chapter_n: int, model: str) -> tuple[list[dict], int, int]:
    response = client.messages.create(
        model=model,
        max_tokens=8000,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": f"Chapter {chapter_n} text:\n\n{chapter_text}"}],
    )
    raw = response.content[0].text
    # Strip optional markdown code fence
    m = re.search(r"```(?:json)?\s*([\s\S]+?)\s*```", raw)
    if m:
        raw = m.group(1)
    try:
        parsed = json.loads(raw)
    except json.JSONDecodeError as e:
        # last-ditch — find first {...} block
        m2 = re.search(r"\{[\s\S]+\}", raw)
        if not m2:
            raise RuntimeError(f"LLM returned non-JSON: {raw[:300]}") from e
        parsed = json.loads(m2.group())
    problems = parsed.get("problems", []) if isinstance(parsed, dict) else []
    return problems, response.usage.input_tokens, response.usage.output_tokens


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--mmd", required=True, type=Path)
    parser.add_argument("--grade", required=True, type=int)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--model", default="claude-haiku-4-5-20251001")
    parser.add_argument("--max-chapter-chars", type=int, default=80_000, help="Cap per-chapter input to keep context bounded")
    args = parser.parse_args()

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("Missing ANTHROPIC_API_KEY env var.", file=sys.stderr)
        print('Set via:  set ANTHROPIC_API_KEY=sk-ant-...', file=sys.stderr)
        return 2

    if args.grade not in GRADE_TO_NCERT_CLASS:
        print(f"Unsupported grade {args.grade}", file=sys.stderr)
        return 2
    ncert_class = GRADE_TO_NCERT_CLASS[args.grade]
    class_int = chapter_number_to_class_int(ncert_class)

    if not args.mmd.exists():
        print(f"MMD not found: {args.mmd}", file=sys.stderr)
        return 1

    text = args.mmd.read_text(encoding="utf-8")
    chapters_meta = detect_chapters_combined(text)
    if not chapters_meta:
        print(f"No chapters detected in {args.mmd}", file=sys.stderr)
        return 1

    client = Anthropic(api_key=api_key)
    all_problems: list[dict] = []
    total_in = 0
    total_out = 0

    for i, (n, title, start) in enumerate(chapters_meta):
        end = chapters_meta[i + 1][2] if i + 1 < len(chapters_meta) else len(text)
        chapter_text = text[start:end]
        truncated = ""
        if len(chapter_text) > args.max_chapter_chars:
            chapter_text = chapter_text[: args.max_chapter_chars]
            truncated = f" [truncated to {args.max_chapter_chars}]"
        print(f"Ch {n} ({title[:40]}): {len(chapter_text):,} chars{truncated}", flush=True)
        t0 = time.time()
        try:
            problems, in_t, out_t = call_llm(client, chapter_text, n, args.model)
        except Exception as e:
            print(f"  FAIL: {type(e).__name__}: {str(e)[:200]}", file=sys.stderr)
            continue
        total_in += in_t
        total_out += out_t
        print(f"  -> {len(problems)} problems  (in={in_t:,}, out={out_t:,}, {time.time() - t0:.1f}s)", flush=True)
        for j, p in enumerate(problems, 1):
            p["problemKey"] = f"NCERT-C{class_int}-CH{n:02d}-LLM-Q{j}"
            p["ncertClass"] = ncert_class
            p["chapterNumber"] = n
            p["chapterTitleHint"] = title
            p["sourceRef"] = "mmd-llm"
            # Validate required fields, set defaults
            if "text" not in p or not isinstance(p["text"], str) or len(p["text"]) < 5:
                continue
            p.setdefault("difficultyLevel", 2)
            p.setdefault("questionType", "FREE_RESPONSE")
            p.setdefault("conceptCodes", [])
            all_problems.append(p)

    args.output.mkdir(parents=True, exist_ok=True)
    out_path = args.output / f"grade-{args.grade}.problems.json"
    out_path.write_text(
        json.dumps(
            {
                "version": f"ncert-grade-{args.grade}-llm@{time.strftime('%Y-%m')}",
                "ncertClass": ncert_class,
                "extractedBy": f"haiku-llm ({args.model})",
                "problems": all_problems,
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    cost_in = (total_in / 1_000_000) * 1.0
    cost_out = (total_out / 1_000_000) * 5.0
    total_cost = cost_in + cost_out
    print()
    print(f"Done. {len(all_problems)} problems written to {out_path}")
    print(f"Tokens: in={total_in:,}  out={total_out:,}")
    print(f"Cost:   ${total_cost:.4f}  (in=${cost_in:.4f}, out=${cost_out:.4f})  at Haiku 4.5 pricing")
    return 0


if __name__ == "__main__":
    sys.exit(main())
