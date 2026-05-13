/* DraftPublisher — publish an approved ContentDraft as a Problem (+ ProblemStep + ProblemChoice).
 *   Prefers editedJson when present; otherwise falls back to aiResponseJson.
 */
import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';
import type { DraftPayload } from './llm-draft.service';
import type { Prisma } from '@prisma/client';

@Injectable()
export class DraftPublisher {
  private readonly logger = new Logger(DraftPublisher.name);

  constructor(private readonly prisma: PrismaService) {}

  async publish(draftId: string): Promise<{ problemId: string }> {
    const d = await this.prisma.contentDraft.findUnique({
      where: { id: draftId },
      include: { conceptLesson: { select: { id: true, unitId: true, subUnitId: true, titleEn: true } } },
    });
    if (!d) throw new NotFoundException('draft not found');
    if (d.status !== 'APPROVED') throw new BadRequestException(`draft must be APPROVED (current: ${d.status})`);
    if (!d.conceptLessonId || !d.conceptLesson) throw new BadRequestException('conceptLessonId not set — reviewer must map first');
    if (!d.conceptLesson.unitId) throw new BadRequestException('conceptLesson.unitId missing — chapter not linked to Unit');
    if (d.publishedProblemId) {
      this.logger.warn(`draft ${draftId} already published as Problem ${d.publishedProblemId}`);
      return { problemId: d.publishedProblemId };
    }

    const payload = (d.editedJson ?? d.aiResponseJson) as DraftPayload | null;
    if (!payload) throw new BadRequestException('draft has no payload');

    // create Problem + 3 steps + 15 choices in one tx
    const problemId = await this.prisma.$transaction(async (tx) => {
      const p = await tx.problem.create({
        data: {
          source: d.sourceLabel,
          unitId: d.conceptLesson!.unitId!,
          subUnitId: d.conceptLesson!.subUnitId,
          conceptLessonId: d.conceptLessonId!,
          difficulty: payload.difficulty,
          difficultyLevel: payload.difficultyLevel,
          body: payload.problemBody,
          answer: payload.steps[2]?.choices.find((c) => c.isCorrect)?.text ?? 'See solution',
          concept: payload.concept,
          hint: payload.hint,
          expectedTimeSec: payload.expectedTimeSec,
          steps: {
            create: payload.steps.map((s, i) => ({
              stepIndex: i + 1,
              stepType: s.stepType,
              prompt: s.prompt,
              choices: {
                create: s.choices.map((c, ci) => ({
                  choiceIndex: ci + 1,
                  text: c.text,
                  isCorrect: c.isCorrect,
                  distractorType: c.distractorType ?? null,
                  rationale: c.rationale ?? null,
                })),
              },
            })),
          },
        } satisfies Prisma.ProblemUncheckedCreateInput,
        select: { id: true },
      });
      await tx.contentDraft.update({
        where: { id: draftId },
        data: { status: 'PUBLISHED', publishedProblemId: p.id },
      });
      return p.id;
    });

    this.logger.log(`Published draft ${draftId} → Problem ${problemId}`);
    return { problemId };
  }
}
