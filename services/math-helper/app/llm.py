import logging
import os

from langchain_openai import ChatOpenAI
from pydantic import BaseModel

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
except ImportError:  # pragma: no cover
    ChatGoogleGenerativeAI = None  # type: ignore[assignment]

_logger = logging.getLogger(__name__)

# Primary: Gemini 3.5 Flash. Selected 2026-05-23 after a head-to-head
# benchmark on the hardest in-scope problem (the user's multi-part
# 수열·절대값합 question that had been returning 60000):
#
#   model                     latency   part1   part2
#   gemini-3.5-flash          13.5s     ✓       ✓     ← primary
#   gemini-flash-latest       13.8s     ✓       ✓     (alias)
#   o3-mini                   14.4s     ✓       ✓
#   gemini-2.5-pro            40.2s     ✓       ✓     (3x slower)
#   gpt-4o                     4.3s     ✗       ✗     (old primary, wrong)
#   gpt-4.1                   35.0s     ✗       ✗
#   gpt-5-* family            400/404   (API plan / Responses format gap)
#
# Flash matches Pro's accuracy on this hard test while being ~3x faster
# and ~10-15x cheaper ($0.075/$0.30 per 1M tokens vs $1.25/$5). Same model
# already powers the OCR path in mathpix.service.ts → one Gemini key, one
# model id, one DPDP residency story (Vertex AI Mumbai migration is a
# single config change).
#
# 2026-05-23 (afternoon): dropped from 3.5-flash → 2.5-flash. 3.5-flash
# advertises "thinking: true" and silently generates 5-15K reasoning tokens
# per call (billed at output rate) — ₩24K burnt in one Tier 2 sweep hour.
# Disabling thinking via langchain-google-genai's kwarg wasn't reliable
# across versions, so we use the older 2.5-flash which has no thinking
# branch. NestJS direct-fetch sites stay on 3.5-flash + thinkingBudget=0.
_primary = (
    ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        max_output_tokens=8192,
    )
    if ChatGoogleGenerativeAI is not None and os.environ.get("GEMINI_API_KEY")
    else None
)

# Same-vendor Pro fallback — different quota pool than Flash so a transient
# Flash rate-limit can be ridden out without dropping to a different cloud.
# `gemini-pro-latest` is the auto-rolling stable Pro alias; benchmark
# showed identical correctness on the test problem (30s latency).
_gemini_pro_fallback = (
    ChatGoogleGenerativeAI(
        model="gemini-pro-latest",
        temperature=0,
        max_output_tokens=8192,
    )
    if ChatGoogleGenerativeAI is not None and os.environ.get("GEMINI_API_KEY")
    else None
)

# Cross-cloud last-resort — o3-mini (OpenAI reasoning, 14s, ✓ on the test
# problem). Kept so a Gemini-wide incident doesn't take the Solver down.
# Note: o3-mini uses max_completion_tokens, not max_tokens, and refuses
# temperature ≠ 1 — defaults are fine.
# Cap output tokens explicitly: o3-mini bills reasoning tokens as output and
# defaults to a very high cap. Bounding to 8192 mirrors the Gemini side and
# prevents a Gemini-wide outage cascading into a runaway OpenAI bill.
_openai_fallback = ChatOpenAI(
    model="o3-mini",
    max_completion_tokens=8192,
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call with vendor + tier failover.

    Order: gemini-3.5-flash → gemini-pro-latest → o3-mini → re-raise.
    `with_structured_output(schema)` honoured by all three so callers
    don't care which provider answered.
    """
    if _primary is not None:
        try:
            return await _primary.with_structured_output(schema).ainvoke(prompt)
        except Exception as e:
            _logger.warning(
                "gemini-3.5-flash structured() failed (%s) — falling back to gemini-pro-latest",
                type(e).__name__,
            )
    if _gemini_pro_fallback is not None:
        try:
            return await _gemini_pro_fallback.with_structured_output(schema).ainvoke(prompt)
        except Exception as e:
            _logger.warning(
                "gemini-pro-latest structured() failed (%s) — falling back to o3-mini",
                type(e).__name__,
            )
    return await _openai_fallback.with_structured_output(schema).ainvoke(prompt)


# Direct-invoke alias for legacy callers (graph.py imports `llm`). Same
# resolution order — Flash if configured, then OpenAI as last resort.
llm = _primary if _primary is not None else _openai_fallback
