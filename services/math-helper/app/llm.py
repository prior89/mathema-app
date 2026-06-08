import logging

from langchain_openai import ChatOpenAI
from pydantic import BaseModel

_logger = logging.getLogger(__name__)

# Primary: gpt-5-mini. Selected 2026-06-08 after a direct bench across
# OpenAI's available models on two hard in-scope problems:
#   1) NCERT Class 12 integral with x sin(x)/(1+cos^2(x))
#   2) Korean multi-part conditional sequence where a_10 = 11
#
#   model        integral  sequence  latency  in/out $/1M    cost/solve
#   gpt-5-mini   pass      pass      8.0 s    $0.25/$2.00   $0.0023
#   gpt-5-nano   pass      pass      9.3 s    $0.20/$0.40   $0.0006
#   o3-mini      pass      pass      5.1 s    $1.10/$4.40   $0.0050
#   gpt-4o-mini  pass      pass      9.9 s    $0.15/$0.60   $0.0004
#   gpt-4o       fail      -         7.6 s    $2.50/$10     $0.006
#
# gpt-5-mini balances reasoning capability (Korean sequence parsing) with
# acceptable latency and cost. gpt-4o was excluded after returning the
# wrong sign on the integral, the same failure mode that pushed an earlier
# revision off gpt-4o (commit eb8ff43).
#
# This file covers the math-helper reasoning model only. OCR is still served
# by the NestJS OcrService, which currently reports source='gemini'; keep those
# layers separate when evaluating compliance or provider migration work.
_primary = ChatOpenAI(
    model="gpt-5-mini",
    max_completion_tokens=8192,
)

# Fallback: gpt-4o-mini. Cheaper and faster than the primary, no reasoning
# tokens; used when gpt-5-mini errors out (rate-limit, transient API
# failure). Accuracy is lower on multi-part Korean problems, so this is a
# last-mile graceful degradation, not a co-equal.
_openai_fallback = ChatOpenAI(
    model="gpt-4o-mini",
    max_completion_tokens=4096,
    temperature=0,
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call with single-vendor failover.

    Order: gpt-5-mini -> gpt-4o-mini -> re-raise. `with_structured_output(schema)`
    works on both so callers don't care which model answered.
    """
    try:
        return await _primary.with_structured_output(schema).ainvoke(prompt)
    except Exception as e:
        _logger.warning(
            "gpt-5-mini structured() failed (%s); falling back to gpt-4o-mini",
            type(e).__name__,
        )
    return await _openai_fallback.with_structured_output(schema).ainvoke(prompt)


# Direct-invoke alias for legacy callers (graph.py imports `llm`).
llm = _primary
