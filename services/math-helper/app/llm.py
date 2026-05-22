import logging
import os

from langchain_openai import ChatOpenAI
from pydantic import BaseModel

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
except ImportError:  # pragma: no cover
    ChatGoogleGenerativeAI = None  # type: ignore[assignment]

_logger = logging.getLogger(__name__)

# Single-vendor stack — Gemini 2.5 Flash does OCR (multimodal), problem
# solving, and final-answer rendering. The Pro tier was tested 2026-05-22
# but the user's preference is "everything on Flash" for vendor unity,
# pricing predictability, and DPDP residency (Vertex AI Mumbai path).
#
# Pricing: $0.075 / $0.30 per 1M tokens → ~$0.0005 per math solve.
# Accuracy on AIME / NCERT word problems sits around 80-85%, lower than
# Pro's ~95% but high enough for the v1 launch — promote back to Pro only
# if Flash falters on a class of problems we can't fix with prompting.
# Primary: gpt-4o. Gemini 3.5 Flash kept falting on multi-step Korean
# sequence/series problems even with the token cap lifted — falling back
# to OpenAI's frontier mini-flagship gives ~90%+ accuracy on the same
# class. Pricing $2.50/$10 per 1M is roughly 30x Flash, justified while
# we're tuning the Solver for launch correctness over per-call cost.
_openai_primary = ChatOpenAI(
    model="gpt-4o",
    temperature=0,
    max_tokens=8192,
)

# Cross-cloud fallback — Gemini 3.5 Flash. Same multimodal model used for
# OCR in mathpix.service.ts, so a single key keeps both paths alive when
# OpenAI is rate-limited or auth-failing.
# Was gemini-1.5-flash until 2026-05-22 — Google deprecated that id and returns
# 404 NOT_FOUND on v1beta. 3.5-flash is the current stable multimodal tier.
_gemini_flash = (
    ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        temperature=0,
        max_output_tokens=8192,
    )
    if ChatGoogleGenerativeAI is not None and os.environ.get("GEMINI_API_KEY")
    else None
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call with cross-cloud failure fallback.

    Order: gpt-4o → Gemini 3.5 Flash (if configured) → re-raise.
    `with_structured_output(schema)` honoured by both sides so callers
    don't care which provider answered.
    """
    try:
        return await _openai_primary.with_structured_output(schema).ainvoke(prompt)
    except Exception as e:
        if _gemini_flash is None:
            raise
        _logger.warning(
            "gpt-4o structured() failed (%s) — falling back to Gemini 3.5 Flash",
            type(e).__name__,
        )
        return await _gemini_flash.with_structured_output(schema).ainvoke(prompt)


# Direct-invoke alias for legacy callers (graph.py imports `llm`).
llm = _openai_primary
