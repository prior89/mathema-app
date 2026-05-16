/* UploadsService — extract problem from a student-uploaded image/PDF (vision LLM)
 * and persist as a PENDING ContentDraft so a reviewer can promote it later.
 *
 * Why two LLM hops?
 *   1) Vision pass: photo/PDF page → structured analysis (text, concept, formula, steps, answer)
 *   2) Draft pass: that text → strict 3-step MC payload via LlmDraftService
 *
 * Vision-pass JSON is also returned to the client for immediate UX (analysis panel),
 * but the canonical Problem only materializes after a human approves the draft.
 */
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import { AiService } from '../../infrastructure/ai/ai.service';
import { LlmDraftService, DRAFT_PROMPT_VERSION } from '../content-ingest/llm-draft.service';
import { PDFParse } from 'pdf-parse';
import type { NcertClass, Prisma } from '@prisma/client';

export interface UploadAnalysis {
  concept: string;
  formula: string;
  solutionSteps: string[];
  answer: string;
}

export interface UploadResult {
  extractedText: string;
  analysis: UploadAnalysis;
  draftId: string;
  ncertClassGuess: NcertClass | null;
}

const VISION_SYSTEM_PROMPT = `You are an expert math educator. The user uploaded a photo or PDF scan of a single math problem (NCERT / CBSE / JEE level for an Indian student).

Return ONE JSON object — no markdown fence, no commentary. Schema:

{
  "extractedText": "<the problem statement transcribed verbatim, preserve LaTeX where present using $...$ inline or $$...$$ display. If the image is unreadable, set this to 'UNREADABLE'.>",
  "concept": "<one or two sentences naming the key idea / topic the problem tests>",
  "formula": "<the principal formula or identity needed, in LaTeX (e.g. $a^2 + b^2 = c^2$). Empty string if not formula-driven.>",
  "solutionSteps": ["<step 1>", "<step 2>", "..."],
  "answer": "<the final canonical answer, e.g. '$x = 5$' or '12 cm'>",
  "difficultyLevel": 1 | 2 | 3 | 4 | 5,
  "ncertClassGuess": "CLASS_7" | "CLASS_8" | "CLASS_9" | "CLASS_10" | "CLASS_11" | "CLASS_12" | null
}

Rules:
- All strings in English (Mathema's primary content language for Indian users).
- If multiple problems are visible, focus on the most prominent/centered one and note this in solutionSteps[0].
- Output JSON ONLY.`;

const VISION_USER_PROMPT = 'Analyze this math problem image and return the strict JSON described in the system prompt.';

const PDF_USER_PROMPT_PREFIX = 'Analyze the following math problem text and return the strict JSON described in the system prompt.\n\nProblem text:\n"""\n';
const PDF_USER_PROMPT_SUFFIX = '\n"""';

@Injectable()
export class UploadsService {
  private readonly logger = new Logger(UploadsService.name);

  constructor(
    private readonly ai: AiService,
    private readonly llmDraft: LlmDraftService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  async analyzeAndDraft(opts: {
    userId: string;
    buffer: Buffer;
    mimeType: string;
    originalName: string;
  }): Promise<UploadResult> {
    const { userId, buffer, mimeType, originalName } = opts;

    const isPdf = mimeType === 'application/pdf' || originalName.toLowerCase().endsWith('.pdf');
    const isImage = mimeType.startsWith('image/');
    if (!isPdf && !isImage) {
      throw new BadRequestException('Only image/* or PDF uploads are accepted');
    }

    // 1) Vision/text extraction
    let visionPayload: {
      extractedText: string;
      concept: string;
      formula: string;
      solutionSteps: string[];
      answer: string;
      difficultyLevel?: 1 | 2 | 3 | 4 | 5;
      ncertClassGuess?: NcertClass | null;
    };
    let visionTokensIn = 0;
    let visionTokensOut = 0;

    if (isImage) {
      const res = await this.ai.generateText(
        {
          prompt: VISION_USER_PROMPT,
          system: VISION_SYSTEM_PROMPT,
          imageBase64: buffer.toString('base64'),
          imageMimeType: mimeType,
          jsonObject: true,
          maxTokens: 1500,
          temperature: 0.1,
        },
        { userId, allowStale: false },
      );
      visionTokensIn = res.inputTokens;
      visionTokensOut = res.outputTokens;
      visionPayload = this.parseVisionJson(res.text);
    } else {
      // PDF: extract text from page 1 (or all pages if small) and feed it as text.
      const text = await this.extractPdfText(buffer);
      if (!text.trim()) {
        throw new BadRequestException('Could not extract text from the PDF (it may be a scan — try uploading as an image)');
      }
      const res = await this.ai.generateText(
        {
          prompt: PDF_USER_PROMPT_PREFIX + text.slice(0, 8000) + PDF_USER_PROMPT_SUFFIX,
          system: VISION_SYSTEM_PROMPT,
          jsonObject: true,
          maxTokens: 1500,
          temperature: 0.1,
        },
        { userId, allowStale: false },
      );
      visionTokensIn = res.inputTokens;
      visionTokensOut = res.outputTokens;
      visionPayload = this.parseVisionJson(res.text);
    }

    if (visionPayload.extractedText === 'UNREADABLE' || visionPayload.extractedText.length < 5) {
      throw new BadRequestException('Could not read the problem clearly. Try a sharper, well-lit photo.');
    }

    // 2) Strict 3-step MC draft
    const draftRes = await this.llmDraft.generate({
      ncertClass: visionPayload.ncertClassGuess ?? undefined,
      text: visionPayload.extractedText,
    });

    // 3) Persist as PENDING ContentDraft. sourceLabel "USER-UPLOAD..." prevents
    // automatic NCERT attribution matching — reviewer must add SOURCE: line before publish.
    const sourceLabel = `USER-UPLOAD · user${userId.slice(0, 8)} · ${new Date().toISOString().slice(0, 19).replace('T', ' ')}`;
    const totalTokensIn = visionTokensIn + draftRes.tokensIn;
    const totalTokensOut = visionTokensOut + draftRes.tokensOut;

    const draft = await this.prisma.contentDraft.create({
      data: {
        ingestJobId: null,
        conceptLessonId: null,
        sourceLabel,
        originalText: visionPayload.extractedText,
        aiModel: draftRes.model,
        aiPromptVer: DRAFT_PROMPT_VERSION,
        aiResponseJson: draftRes.payload as unknown as Prisma.InputJsonValue,
        aiTokensIn: totalTokensIn,
        aiTokensOut: totalTokensOut,
        proposedDifficulty: draftRes.payload.difficulty,
        proposedDifficultyLevel: draftRes.payload.difficultyLevel,
        reviewerNote: this.buildReviewerNote(visionPayload, originalName),
        status: 'PENDING',
      },
      select: { id: true },
    });

    return {
      extractedText: visionPayload.extractedText,
      analysis: {
        concept: visionPayload.concept,
        formula: visionPayload.formula,
        solutionSteps: visionPayload.solutionSteps,
        answer: visionPayload.answer,
      },
      draftId: draft.id,
      ncertClassGuess: visionPayload.ncertClassGuess ?? null,
    };
  }

  // ---------- helpers ----------

  private parseVisionJson(raw: string): {
    extractedText: string;
    concept: string;
    formula: string;
    solutionSteps: string[];
    answer: string;
    difficultyLevel?: 1 | 2 | 3 | 4 | 5;
    ncertClassGuess?: NcertClass | null;
  } {
    const stripped = this.stripFences(raw.trim());
    let parsed: unknown;
    try {
      parsed = JSON.parse(stripped);
    } catch (e) {
      throw new BadRequestException(`Vision LLM returned non-JSON: ${raw.slice(0, 160)}`);
    }
    const p = parsed as Record<string, unknown>;
    return {
      extractedText: typeof p.extractedText === 'string' ? p.extractedText : '',
      concept: typeof p.concept === 'string' ? p.concept : '',
      formula: typeof p.formula === 'string' ? p.formula : '',
      solutionSteps: Array.isArray(p.solutionSteps) ? p.solutionSteps.filter((s): s is string => typeof s === 'string') : [],
      answer: typeof p.answer === 'string' ? p.answer : '',
      difficultyLevel: typeof p.difficultyLevel === 'number' ? (p.difficultyLevel as 1 | 2 | 3 | 4 | 5) : undefined,
      ncertClassGuess: this.coerceNcertClass(p.ncertClassGuess),
    };
  }

  private coerceNcertClass(v: unknown): NcertClass | null {
    if (typeof v !== 'string') return null;
    const allowed: NcertClass[] = ['CLASS_7', 'CLASS_8', 'CLASS_9', 'CLASS_10', 'CLASS_11', 'CLASS_12'];
    return allowed.includes(v as NcertClass) ? (v as NcertClass) : null;
  }

  private stripFences(t: string): string {
    const m = t.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    return m ? m[1].trim() : t;
  }

  private buildReviewerNote(
    vision: { concept: string; formula: string; answer: string; ncertClassGuess?: NcertClass | null },
    fileName: string,
  ): string {
    return [
      `Source: student upload (${fileName})`,
      `AI-detected concept: ${vision.concept || '—'}`,
      `AI-detected formula: ${vision.formula || '—'}`,
      `AI-detected answer: ${vision.answer || '—'}`,
      vision.ncertClassGuess ? `Class guess: ${vision.ncertClassGuess}` : null,
      'License note: requires reviewer to supply SOURCE: line before publish.',
    ]
      .filter(Boolean)
      .join('\n');
  }

  private async extractPdfText(buf: Buffer): Promise<string> {
    const parser = new PDFParse({ data: new Uint8Array(buf) });
    try {
      const out = await parser.getText({});
      // Only the first page — student uploads a single problem.
      const first = out.pages?.[0]?.text ?? '';
      return first;
    } finally {
      await parser.destroy();
    }
  }
}
