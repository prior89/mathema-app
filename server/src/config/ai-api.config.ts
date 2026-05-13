import { registerAs } from '@nestjs/config';

/**
 * AI external API configuration — every key is injected from environment variables.
 * Fill the placeholders in `.env` with the keys issued by each provider.
 *
 *   ┌──────────────── set in .env ────────────────┐
 *   │  AI_LLM_API_KEY        = ...                │  text generation (Claude / GPT)
 *   │  AI_VISION_API_KEY     = ...                │  photo OCR / problem parsing
 *   │  AI_EMBEDDING_API_KEY  = ...                │  similar-problem retrieval
 *   └─────────────────────────────────────────────┘
 *
 * The literal `PLACEHOLDER_KEY` is treated by the providers as "not configured"
 * so the app boots even when keys are absent (AI features simply throw a
 * `LLM_PROVIDER_NOT_CONFIGURED` error if invoked).
 */
export default registerAs('ai', () => ({
  llm: {
    provider: process.env.AI_LLM_PROVIDER ?? 'anthropic',
    apiKey: process.env.AI_LLM_API_KEY ?? 'PLACEHOLDER_KEY',
    model: process.env.AI_LLM_MODEL ?? 'claude-opus-4-6',
  },
  vision: {
    provider: process.env.AI_VISION_PROVIDER ?? 'openai',
    apiKey: process.env.AI_VISION_API_KEY ?? 'PLACEHOLDER_KEY',
    model: process.env.AI_VISION_MODEL ?? 'gpt-4o',
  },
  embedding: {
    provider: process.env.AI_EMBEDDING_PROVIDER ?? 'openai',
    apiKey: process.env.AI_EMBEDDING_API_KEY ?? 'PLACEHOLDER_KEY',
    model: process.env.AI_EMBEDDING_MODEL ?? 'text-embedding-3-large',
  },
}));
