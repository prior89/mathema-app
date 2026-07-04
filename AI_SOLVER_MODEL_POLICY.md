# AI Solver Model Policy

Last updated: 2026-06-20

## Decision

AI Solver should optimize for math accuracy first, then keep launch economics compatible with the KRW 14,900 monthly plan.

| Layer | Default | Fallback | Why |
|---|---|---|---|
| Image OCR | Mathpix `/v3/text` | OpenAI OCR | Mathpix is purpose-built for printed/handwritten math OCR and is priced per image. |
| Graph / diagram repair | OpenAI `gpt-5.4-mini` vision | OpenAI `gpt-4o-mini` | Mathpix can miss coordinate geometry details; vision repair adds axes, points, intercepts, and labels only when graph/diagram keywords are detected. |
| Text solve | OpenAI `gpt-5.4-mini` | OpenAI `gpt-5.5` | `gpt-5.4-mini` is the default quality/cost balance. `gpt-5.5` is reserved for transient provider-failure fallback because it is much more expensive. |

## Pricing Basis

OpenAI standard short-context pricing as of 2026-06-20:

| Model | Input / 1M tokens | Cached input / 1M tokens | Output / 1M tokens |
|---|---:|---:|---:|
| `gpt-5.5` | $5.00 | $0.50 | $30.00 |
| `gpt-5.4` | $2.50 | $0.25 | $15.00 |
| `gpt-5.4-mini` | $0.75 | $0.075 | $4.50 |
| `gpt-5.4-nano` | $0.20 | $0.02 | $1.25 |

Mathpix Convert API pricing as of 2026-06-20:

| Endpoint | Tier | Price |
|---|---|---:|
| `/v3/text` image OCR | 0-1M images/month | $0.002 / image |
| `/v3/text` image OCR | 1M+ images/month | $0.0015 / image |
| `/v3/pdf` | 0-1M pages/month | $0.005 / page |
| `/v3/pdf` | 1M+ pages/month | $0.0035 / page |

Typical image solve estimate:

| Path | Approx cost |
|---|---:|
| Mathpix image OCR | $0.002 |
| `gpt-5.4-mini` solve, approx 3k input + 1.5k output | $0.009 |
| Typical total | ~$0.011 |

At an illustrative 1,500 KRW/USD exchange rate, a typical image solve is about 16 KRW. Graph/diagram repair adds one extra vision call only for flagged uploads, so it should be monitored separately in telemetry.

## Routing

1. If deterministic solving can answer safely, use it before any LLM path.
2. For image upload OCR, call Mathpix first when `MATHPIX_APP_ID` and `MATHPIX_APP_KEY` are configured.
3. If Mathpix text suggests a graph, coordinate plane, diagram, table, or figure, run OpenAI vision repair against the original image and the Mathpix text.
4. If Mathpix is not configured or fails, use OpenAI OCR.
5. Solve confirmed text with `MATH_HELPER_MODEL`, default `gpt-5.4-mini`.
6. Use `MATH_HELPER_FALLBACK_MODEL`, default `gpt-5.5`, only when the primary solve call has a transient provider failure such as timeout, connection failure, rate limit, or 5xx response. Do not fallback on schema/parser/prompt errors.

## Operational Notes

- `OCR_PRIMARY_PROVIDER=openai` bypasses Mathpix for emergency rollback.
- `OCR_GRAPH_ENHANCEMENT=false` disables vision repair if cost spikes.
- `gpt-5.5` solve fallback is intentionally narrow; monitor fallback logs because every fallback solve is materially more expensive than the default path.
- Mathpix requests set `metadata.improve_mathpix=false`; also enable Mathpix data retention opt-out in the Convert API dashboard for stricter handling of student images.
- Track OCR source in logs/UI as `mathpix`, `openai`, or `mathpix+openai`.

## Sources

- OpenAI API pricing: https://developers.openai.com/api/docs/pricing
- OpenAI GPT-5.5 model guidance: https://developers.openai.com/api/docs/guides/latest-model
- Mathpix Convert API pricing: https://mathpix.com/pricing/api
- Mathpix `/v3/text` image OCR reference: https://docs.mathpix.com/reference/post-v3-text
