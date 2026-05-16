#!/usr/bin/env python3
"""
NCERT extraction dry-run statistics.

Standalone (no NestJS / no DB / no LLM). Reads the 6 grade-N.problems.json files
and reports schema validity, text quality heuristics, and estimated LLM cost.

Usage:
    python scripts/ncert-pdf-extract/dry-run-stats.py
"""
from __future__ import annotations

import json
import re
import sys
import io
from pathlib import Path

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

OUTPUT_DIR = Path(__file__).parent / "output" / "from_mmd"
GRADES = [7, 8, 9, 10, 11, 12]

# Anthropic Claude Haiku 4.5 (2026 pricing, verified via web search 2026-05-15).
HAIKU_INPUT_PER_MTOK_USD = 1.0
HAIKU_OUTPUT_PER_MTOK_USD = 5.0
USD_TO_INR = 84

SYSTEM_PROMPT_TOKENS = 1100
CACHED_SYSTEM_PROMPT_TOKENS = SYSTEM_PROMPT_TOKENS * 0.1
AVG_OUTPUT_TOKENS = 1400


def user_msg_tokens(text: str) -> float:
    return (len(text) / 4.0) + 30


def analyze(grade: int, problems: list[dict]) -> dict:
    stats = {
        "grade": grade,
        "total": len(problems),
        "validShape": 0,
        "withProblemKey": 0,
        "withNcertClass": 0,
        "withChapterNumber": 0,
        "withExerciseId": 0,
        "shortText": 0,
        "longText": 0,
        "noisy": 0,
        "avgTextLen": 0,
        "estInputTokens": 0.0,
        "estOutputTokens": 0.0,
        "estCostUsd": 0.0,
    }
    noise_re = re.compile(r"Reprint\s+202\d|Page\s*No\.", re.IGNORECASE)
    total_len = 0
    first_paid = False
    for p in problems:
        text = p.get("text") or ""
        if isinstance(text, str) and text:
            stats["validShape"] += 1
        if p.get("problemKey"):
            stats["withProblemKey"] += 1
        if p.get("ncertClass"):
            stats["withNcertClass"] += 1
        if p.get("chapterNumber"):
            stats["withChapterNumber"] += 1
        if p.get("exerciseId"):
            stats["withExerciseId"] += 1
        if len(text) < 20:
            stats["shortText"] += 1
        if len(text) > 800:
            stats["longText"] += 1
        if noise_re.search(text):
            stats["noisy"] += 1
        total_len += len(text)

        sys_t = CACHED_SYSTEM_PROMPT_TOKENS if first_paid else SYSTEM_PROMPT_TOKENS
        first_paid = True
        stats["estInputTokens"] += sys_t + user_msg_tokens(text)
        stats["estOutputTokens"] += AVG_OUTPUT_TOKENS

    if len(problems):
        stats["avgTextLen"] = round(total_len / len(problems))
    cost_in = (stats["estInputTokens"] / 1_000_000) * HAIKU_INPUT_PER_MTOK_USD
    cost_out = (stats["estOutputTokens"] / 1_000_000) * HAIKU_OUTPUT_PER_MTOK_USD
    stats["estCostUsd"] = round((cost_in + cost_out) * 1000) / 1000
    return stats


def load_grade(grade: int) -> list[dict]:
    file = OUTPUT_DIR / f"grade-{grade}.problems.json"
    if not file.exists():
        return []
    raw = json.loads(file.read_text(encoding="utf-8"))
    return raw.get("problems", [])


HEADER = ["Grade", "Total", "Valid", "PKey", "Class", "Ch#", "Ex", "Short", "Long", "Noise", "AvgLen", "InTok", "OutTok", "USD"]
WIDTHS = [6, 7, 7, 6, 6, 6, 6, 6, 6, 6, 7, 10, 10, 7]


def fmt_num(n) -> str:
    if isinstance(n, float):
        return f"{n:,.0f}"
    return f"{n:,}"


def pad(s: str, w: int) -> str:
    return s.rjust(w)


def main() -> int:
    all_stats = [analyze(g, load_grade(g)) for g in GRADES]
    print(" ".join(pad(h, w) for h, w in zip(HEADER, WIDTHS)))
    print(" ".join("-" * w for w in WIDTHS))
    total_problems = total_in = total_out = total_usd = 0
    for s in all_stats:
        row = [
            str(s["grade"]),
            fmt_num(s["total"]),
            fmt_num(s["validShape"]),
            fmt_num(s["withProblemKey"]),
            fmt_num(s["withNcertClass"]),
            fmt_num(s["withChapterNumber"]),
            fmt_num(s["withExerciseId"]),
            fmt_num(s["shortText"]),
            fmt_num(s["longText"]),
            fmt_num(s["noisy"]),
            fmt_num(s["avgTextLen"]),
            fmt_num(s["estInputTokens"]),
            fmt_num(s["estOutputTokens"]),
            f"{s['estCostUsd']:.3f}",
        ]
        print(" ".join(pad(v, w) for v, w in zip(row, WIDTHS)))
        total_problems += s["total"]
        total_in += s["estInputTokens"]
        total_out += s["estOutputTokens"]
        total_usd += s["estCostUsd"]
    print(" ".join("-" * w for w in WIDTHS))
    print(" ".join(pad(v, w) for v, w in zip(
        ["TOTAL", fmt_num(total_problems), "", "", "", "", "", "", "", "", "", fmt_num(total_in), fmt_num(total_out), f"{total_usd:.2f}"],
        WIDTHS,
    )))
    print()
    total_inr = round(total_usd * USD_TO_INR)
    print(f"Estimated LLM cost (Anthropic Haiku 4.5 with prompt-cache):  ${total_usd:.2f}  /  Rs.{total_inr:,}")
    print(f"(model: ${HAIKU_INPUT_PER_MTOK_USD}/Mtok in, ${HAIKU_OUTPUT_PER_MTOK_USD}/Mtok out, cache 90% off on repeated system prompt)")
    print()
    print("Legend:")
    print("  PKey/Class/Ch#/Ex - items with that field populated (out of Total)")
    print("  Short - text < 20 chars (likely extraction debris)")
    print("  Long  - text > 800 chars (may be entire exercise block merged)")
    print("  Noise - text contains Reprint/Page No. footer artifacts")
    return 0


if __name__ == "__main__":
    sys.exit(main())
