import json
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
    response = await llm.ainvoke(prompt)
    text = response.content.strip()

    if text.startswith("```"):
        text = text.replace("```json", "").replace("```", "").strip()

    data = json.loads(text)
    return schema.model_validate(data)
