from langchain_openai import ChatOpenAI
from pydantic import BaseModel

# gpt-4o-mini is ~3x cheaper and noticeably faster than gpt-5-mini for our
# structured-JSON workloads (classification, solution drafting, verification).
# max_tokens caps the worst-case latency on rare verbose responses.
llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0,
    max_tokens=1500,
)


async def structured(prompt: str, schema: type[BaseModel]):
    """Schema-constrained LLM call.

    `with_structured_output()` makes the model use OpenAI's JSON schema
    enforced decoding — the response is guaranteed to be a valid `schema`
    instance, so we never have to hand-parse JSON or worry about gpt-4o-mini
    occasionally returning `null` where the schema expects a list. If the
    upstream model fails to satisfy the schema entirely (rare), the call
    raises and the caller handles it via LangGraph's normal error path.
    """
    constrained = llm.with_structured_output(schema)
    return await constrained.ainvoke(prompt)
