import logging
import os

from langchain_openai import ChatOpenAI
from pydantic import BaseModel

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
except ImportError:  # pragma: no cover
    ChatGoogleGenerativeAI = None  # type: ignore[assignment]

_logger = logging.getLogger(__name__)

# Primary: Gemini 2.5 Pro — frontier-tier accuracy on multi-step math
# (AIME 99.2% in Deep Think mode, ~95% in standard mode). gpt-4o-mini was
# faltering on Korean-curriculum sequence/series problems like
# Sn = 2n^3 + 3n^2 - 600n (returning 60000 vs the correct 1,977,400), so
# we promoted Gemini to primary 2026-05-22. Pricing is $1.25 / $10 per 1M
# tokens which lands at ~$0.006 per typical math solve.
_gemini_pro = (
    ChatGoogleGenerativeAI(
        model="gemini-2.5-pro",
        temperature=0,
        max_output_tokens=2000,
    )
    if ChatGoogleGenerativeAI is not None and os.environ.get("GEMINI_API_KEY")
    else None
)

# Fallback: OpenAI gpt-4o-mini. Cheaper ($0.15/$0.60 per 1M), fast, and a
# different cloud — so a Google-side outage doesn't take Solver down.
_openai = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=1500,
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call with provider fallback.

    `with_structured_output(schema)` makes the model emit a guaranteed-valid
    instance of `schema` — both Gemini and OpenAI honour the same LangChain
    contract, so callers don't have to care which provider answered.

    Order: Gemini 2.5 Pro (if configured) → OpenAI gpt-4o-mini → re-raise.
    The fallback fires on ANY Gemini failure (auth, 429 rate limit, network
    timeout, schema-decode error) so a single-cloud outage stops being a
    100% Matheo outage.
    """
    if _gemini_pro is not None:
        try:
            return await _gemini_pro.with_structured_output(schema).ainvoke(prompt)
        except Exception as e:
            _logger.warning(
                "Gemini 2.5 Pro structured() failed (%s) — falling back to gpt-4o-mini",
                type(e).__name__,
            )
    return await _openai.with_structured_output(schema).ainvoke(prompt)


# Kept as a module attribute for legacy callers (graph.py imports `llm`).
# Points at the primary so any direct `llm.invoke(...)` call also benefits
# from the upgrade.
llm = _gemini_pro if _gemini_pro is not None else _openai
