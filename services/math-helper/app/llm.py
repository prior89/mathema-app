import logging
import os

from openai import APIConnectionError, APIStatusError, APITimeoutError, RateLimitError
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

_logger = logging.getLogger(__name__)

PRIMARY_MODEL = os.getenv("MATH_HELPER_MODEL", "gpt-5.4-mini")
FALLBACK_MODEL = os.getenv("MATH_HELPER_FALLBACK_MODEL", "gpt-5.5")
PROVIDER_FAILURE_STATUS_CODES = {408, 409, 425, 429, 500, 502, 503, 504}


def _int_env(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except ValueError:
        return default


def _chat(model: str, max_completion_tokens: int) -> ChatOpenAI:
    kwargs = {
        "model": model,
        "max_completion_tokens": max_completion_tokens,
        # Student problem text + answers flow through here. store=False opts the
        # request out of OpenAI-side retention, matching the no-retention
        # disclosure for minor data.
        "model_kwargs": {"store": False},
    }
    if not model.lower().startswith("gpt-5"):
        kwargs["temperature"] = 0
    return ChatOpenAI(**kwargs)


def _is_provider_failure(exc: BaseException, seen: set[int] | None = None) -> bool:
    """Return true only for transient provider / network failures.

    Schema validation, prompt bugs, bad requests, and parser errors should not
    jump to the expensive fallback model; they need to fail loudly.
    """
    if isinstance(exc, (APIConnectionError, APITimeoutError, RateLimitError)):
        return True
    if isinstance(exc, APIStatusError):
        return exc.status_code in PROVIDER_FAILURE_STATUS_CODES

    status_code = getattr(exc, "status_code", None)
    if isinstance(status_code, int) and status_code in PROVIDER_FAILURE_STATUS_CODES:
        return True

    seen = seen or set()
    seen.add(id(exc))
    for nested in (getattr(exc, "__cause__", None), getattr(exc, "__context__", None)):
        if nested is not None and id(nested) not in seen and _is_provider_failure(nested, seen):
            return True
    return False


# Solver policy, 2026-06-20:
# - gpt-5.4-mini is the default because it is strong enough for multi-step math
#   at launch economics.
# - gpt-5.5 is reserved for provider failure fallback; it is higher quality but
#   much too expensive to run on every 14,900 KRW subscription solve.
# - OCR happens in NestJS OcrService: Mathpix first, OpenAI vision only for
#   graph/diagram repair or fallback.
_primary = _chat(
    PRIMARY_MODEL,
    _int_env("MATH_HELPER_MAX_COMPLETION_TOKENS", 8192),
)

_openai_fallback = _chat(
    FALLBACK_MODEL,
    _int_env("MATH_HELPER_FALLBACK_MAX_COMPLETION_TOKENS", 8192),
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call with single-vendor failover.

    Order: primary -> fallback. `with_structured_output(schema)`
    works on both so callers don't care which model answered.
    """
    try:
        return await _primary.with_structured_output(schema).ainvoke(prompt)
    except Exception as e:
        if not _is_provider_failure(e):
            _logger.warning(
                "%s structured() failed with non-provider error (%s); not falling back to %s",
                PRIMARY_MODEL,
                type(e).__name__,
                FALLBACK_MODEL,
            )
            raise
        _logger.warning(
            "%s structured() provider failure (%s); falling back to %s",
            PRIMARY_MODEL,
            type(e).__name__,
            FALLBACK_MODEL,
        )
    return await _openai_fallback.with_structured_output(schema).ainvoke(prompt)


# Direct-invoke alias for legacy callers (graph.py imports `llm`).
llm = _primary
