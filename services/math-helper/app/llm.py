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
_gemini_flash = (
    ChatGoogleGenerativeAI(
        model="gemini-3.5-flash",
        temperature=0,
        max_output_tokens=2000,
    )
    if ChatGoogleGenerativeAI is not None and os.environ.get("GEMINI_API_KEY")
    else None
)

# Cross-cloud fallback. Used only when Gemini is auth-fail / 429 / timeout
# / schema-decode-fail, so a Google-side outage doesn't take Solver down.
_openai = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=1500,
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call with single-cloud-failure fallback.

    Order: Gemini 2.5 Flash (if configured) → OpenAI gpt-4o-mini → re-raise.
    Same `with_structured_output(schema)` contract on both providers so
    callers don't care which side answered.
    """
    if _gemini_flash is not None:
        try:
            return await _gemini_flash.with_structured_output(schema).ainvoke(prompt)
        except Exception as e:
            _logger.warning(
                "Gemini 2.5 Flash structured() failed (%s) — falling back to gpt-4o-mini",
                type(e).__name__,
            )
    return await _openai.with_structured_output(schema).ainvoke(prompt)


# Direct-invoke alias for legacy callers (graph.py imports `llm`).
llm = _gemini_flash if _gemini_flash is not None else _openai
