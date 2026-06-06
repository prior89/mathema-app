import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';

export interface LlmRequest {
  prompt: string;
  system?: string;
  maxTokens?: number;
  temperature?: number;
  /**
   * Force JSON output. On OpenAI this maps to response_format={type:"json_object"}
   * (provider-side guarantee that completion is parseable JSON). On Anthropic
   * it's a hint only — the system prompt is still the primary contract.
   */
  jsonObject?: boolean;
  /**
   * Optional vision input. Base64-encoded image bytes (no data: prefix).
   * Supported on OpenAI gpt-4o family. On Anthropic providers the image is
   * dropped and only the textual prompt is sent.
   */
  imageBase64?: string;
  imageMimeType?: string;
}

export interface LlmResponse {
  text: string;
  inputTokens: number;
  outputTokens: number;
}

/**
 * 외부 LLM 호출 어댑터.
 *   AI_LLM_PROVIDER=anthropic | openai | gemini
 *
 * 도메인 코드(ai-coach, study-sessions, wrong-notes)는 이 클래스만 의존한다.
 *
 * gemini 분기는 직접 fetch (langchain-google-genai 의존 안 함) — ocr.service.ts
 * 의 Gemini OCR 호출 패턴과 일관. 키는 GEMINI_API_KEY (별도 env) 사용.
 */
@Injectable()
export class LlmProvider {
  private readonly logger = new Logger(LlmProvider.name);
  private readonly apiKey: string;
  private readonly provider: string;
  private readonly model: string;
  private readonly geminiApiKey: string;
  private anthropic: Anthropic | null = null;
  private openai: OpenAI | null = null;

  constructor(private readonly config: ConfigService) {
    this.apiKey = this.config.get<string>('ai.llm.apiKey') ?? '';
    this.provider = (this.config.get<string>('ai.llm.provider') ?? 'anthropic').toLowerCase();
    this.model = this.config.get<string>('ai.llm.model') ?? '';
    // GEMINI_API_KEY env is shared with the OCR path (ocr.service.ts).
    this.geminiApiKey = process.env.GEMINI_API_KEY ?? '';

    if (this.isConfigured()) {
      if (this.provider === 'anthropic') {
        this.anthropic = new Anthropic({ apiKey: this.apiKey });
      } else if (this.provider === 'openai') {
        this.openai = new OpenAI({ apiKey: this.apiKey });
      }
      // gemini path uses direct fetch — no client instance needed.
    }
  }

  private isConfigured(): boolean {
    if (this.provider === 'gemini') return !!this.geminiApiKey;
    return !!this.apiKey && this.apiKey !== 'PLACEHOLDER_KEY';
  }

  async generate(req: LlmRequest): Promise<LlmResponse> {
    if (!this.isConfigured()) {
      this.logger.error('AI_LLM_API_KEY not configured.');
      throw new Error('LLM_PROVIDER_NOT_CONFIGURED');
    }

    if (this.provider === 'anthropic' && this.anthropic) {
      const res = await this.anthropic.messages.create({
        model: this.model || 'claude-sonnet-4-6',
        max_tokens: req.maxTokens ?? 1024,
        temperature: req.temperature ?? 0.4,
        system: req.system,
        messages: [{ role: 'user', content: req.prompt }],
      });
      const textBlock = res.content.find((b) => b.type === 'text') as { type: 'text'; text: string } | undefined;
      return {
        text: textBlock?.text ?? '',
        inputTokens: res.usage?.input_tokens ?? 0,
        outputTokens: res.usage?.output_tokens ?? 0,
      };
    }

    if (this.provider === 'openai' && this.openai) {
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [];
      if (req.system) messages.push({ role: 'system', content: req.system });
      if (req.imageBase64) {
        const mime = req.imageMimeType ?? 'image/jpeg';
        messages.push({
          role: 'user',
          content: [
            { type: 'text', text: req.prompt },
            { type: 'image_url', image_url: { url: `data:${mime};base64,${req.imageBase64}` } },
          ],
        });
      } else {
        messages.push({ role: 'user', content: req.prompt });
      }
      const res = await this.openai.chat.completions.create({
        model: this.model || 'gpt-4o',
        max_completion_tokens: req.maxTokens ?? 1024,
        temperature: req.temperature ?? 0.4,
        messages,
        ...(req.jsonObject ? { response_format: { type: 'json_object' as const } } : {}),
      });
      const choice = res.choices?.[0];
      return {
        text: choice?.message?.content ?? '',
        inputTokens: res.usage?.prompt_tokens ?? 0,
        outputTokens: res.usage?.completion_tokens ?? 0,
      };
    }

    if (this.provider === 'gemini') {
      const model = this.model || 'gemini-3.5-flash';
      // Vision input — Gemini multimodal accepts inline_data with mime + base64.
      const parts: any[] = [];
      // Gemini doesn't have a separate `system` role on v1beta — prepend it.
      const userText = req.system ? `${req.system}\n\n${req.prompt}` : req.prompt;
      parts.push({ text: userText });
      if (req.imageBase64) {
        parts.push({
          inline_data: {
            mime_type: req.imageMimeType ?? 'image/jpeg',
            data: req.imageBase64,
          },
        });
      }
      const body: any = {
        contents: [{ parts }],
        generationConfig: {
          temperature: req.temperature ?? 0.4,
          maxOutputTokens: req.maxTokens ?? 1024,
          // Gemini 3.5 Flash defaults to thinking-mode-on, which silently
          // generates 5K-15K reasoning tokens billed at output rate. Our MC
          // distractor + content drafting workloads don't need extended
          // reasoning, so we cap thinking at 0 to keep per-call cost at the
          // published flat rate (~$0.003/call vs ~$0.025 with thinking).
          thinkingConfig: this.geminiThinkingConfig(model),
        },
      };
      if (req.jsonObject) {
        body.generationConfig.responseMimeType = 'application/json';
      }
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}` +
        `:generateContent?key=${encodeURIComponent(this.geminiApiKey)}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
      }
      const json: any = await res.json();
      const text: string =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const usage = json?.usageMetadata ?? {};
      return {
        text,
        inputTokens: usage.promptTokenCount ?? 0,
        outputTokens: usage.candidatesTokenCount ?? 0,
      };
    }

    throw new Error(`LlmProvider: provider=${this.provider} not wired (configured? ${this.isConfigured()}).`);
  }

  private geminiThinkingConfig(model: string): Record<string, unknown> {
    if (model.startsWith('gemini-3')) {
      return { thinkingLevel: model.includes('flash') ? 'minimal' : 'low' };
    }
    return { thinkingBudget: 0 };
  }
}
