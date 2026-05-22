import logging
import os

from langchain_openai import ChatOpenAI
from pydantic import BaseModel

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
except ImportError:  # pragma: no cover
    ChatGoogleGenerativeAI = None  # type: ignore[assignment]

_logger = logging.getLogger(__name__)

# Primary: OpenAI gpt-4o-mini — fast, cheap, well-tested for our structured-JSON
# workloads (classification, solution drafting, verification). Routes to US.
_openai = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=1500,
)

# Fallback: Gemini 2.5 Flash. Reachable from Vertex AI Mumbai (asia-south1),
# which is the DPDP-cleaner path for Indian student traffic if we ever route
# primary there. Pricing is comparable to gpt-4o-mini ($0.075 / $0.30 per 1M).
# Activated only when GEMINI_API_KEY is set in the environment — the chain
# silently no-ops without the key, so dev / CI runs without it still build.
_gemini = (
    ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0,
        max_output_tokens=1500,
    )
    if ChatGoogleGenerativeAI is not None and os.environ.get("GEMINI_API_KEY")
    else None
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call with provider fallback.

    `with_structured_output(schema)` makes the model emit a guaranteed-valid
    instance of `schema` — both OpenAI and Gemini honour the same LangChain
    contract, so callers don't have to care which provider answered.

    Order: OpenAI gpt-4o-mini → Gemini 2.5 Flash (if configured) → re-raise.
    The fallback fires on ANY OpenAI failure (auth, 429 rate limit, network
    timeout, schema-decode error) so a single-cloud outage stops being a
    100% Matheo outage. Pricing of the two providers is close enough that
    silent fallback doesn't blow the budget.
    """
    try:
        return await _openai.with_structured_output(schema).ainvoke(prompt)
    except Exception as e:
        if _gemini is None:
            raise
        _logger.warning(
            "OpenAI structured() failed (%s) — falling back to Gemini 2.5 Flash",
            type(e).__name__,
        )
        return await _gemini.with_structured_output(schema).ainvoke(prompt)


# Kept as a module attribute for legacy callers (graph.py imports `llm`).
llm = _openai
