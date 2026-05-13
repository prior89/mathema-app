/**
 * Concept Lessons seed — seeds every NCERT 7~12 chapter as ConceptLesson + ConceptStep rows.
 *
 * Called at the end of main() in prisma/seed.ts:
 *   await seedConceptLessons(prisma, unitByName);
 *
 * Content sources:
 *   - Chapter metadata: src/common/curriculum/ncert-chapters.ts
 *   - Step content: src/common/curriculum/concept-content/*.ts
 *   - Sequencing policy: src/common/learning/concept-framework.ts (pickSequence)
 *
 * If a chapter has no matching content, a stub (HOOK + ABSTRACT + RETRIEVAL) is created
 * so the user can still navigate the full lesson tree.
 */

import { PrismaClient, ConceptStepKind } from '@prisma/client';
import { NCERT_CHAPTERS } from '../src/common/curriculum/ncert-chapters';
import { CHAPTER_CONTENT, ConceptChapterContent } from '../src/common/curriculum/concept-content';
import { pickSequence } from '../src/common/learning/concept-framework';

// NCERT textbook excerpts — auto-extracted from the PDFs by scripts/extract-ncert-excerpts.py.
// Each chapter's introduction (10-18 lines) is stored as chapterCode → { excerpt, sourceLine, ... }.
// Appended to the abstract step's bodyEn so students see the original NCERT prose too.
// 54 of 79 chapters have excerpts (Class 9's 12 chapters are missing from the PDFs; a few others
// fail the extraction pattern). Missing chapters fall back to our own content only.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const NCERT_EXCERPTS: Record<
  string,
  { ncertClass: string; chapterNumber: number; sourceLine: number; excerpt: string }
> = require('../src/common/curriculum/concept-content/ncert-excerpts.json');

export async function seedConceptLessons(
  prisma: PrismaClient,
  unitByName: Record<string, { id: string; subs: Record<string, string> }>,
): Promise<void> {
  let lessons = 0;
  let steps = 0;

  for (const ch of NCERT_CHAPTERS) {
    const content = CHAPTER_CONTENT[ch.chapterCode];
    // Unit = NCERT chapter, 1:1. unitByName is seeded from GRADE_TO_UNITS (Korean NCERT chapter names).
    // ch.koUnit is deprecated — prefer ch.titleKo if it exists in unitByName, else fall back to ch.koUnit.
    const unitKey = unitByName[ch.titleKo] ? ch.titleKo : (ch.koUnit ?? ch.titleKo);
    const unitId = unitByName[unitKey]?.id ?? null;
    const subUnitId = null; // Phase 1: sub-units disabled (unit = chapter)

    const lesson = await prisma.conceptLesson.upsert({
      where: { chapterCode: ch.chapterCode },
      update: {
        ncertClass: ch.ncertClass,
        chapterNumber: ch.chapterNumber,
        titleKo: ch.titleKo, titleEn: ch.titleEn,
        bigIdeaKo: ch.bigIdeaKo, bigIdeaEn: ch.bigIdeaEn,
        estimatedMin: ch.estimatedMin,
        cognitiveLoad: ch.cognitiveLoad,
        prerequisiteCodes: ch.prerequisites,
        unitId, subUnitId,
      },
      create: {
        ncertClass: ch.ncertClass,
        chapterNumber: ch.chapterNumber,
        chapterCode: ch.chapterCode,
        titleKo: ch.titleKo, titleEn: ch.titleEn,
        bigIdeaKo: ch.bigIdeaKo, bigIdeaEn: ch.bigIdeaEn,
        estimatedMin: ch.estimatedMin,
        cognitiveLoad: ch.cognitiveLoad,
        prerequisiteCodes: ch.prerequisites,
        unitId, subUnitId,
      },
    });
    lessons++;

    await prisma.conceptStep.deleteMany({ where: { lessonId: lesson.id } });

    const stepRecords = buildSteps(content, ch.cognitiveLoad, ch.chapterCode);
    for (let i = 0; i < stepRecords.length; i++) {
      const s = stepRecords[i];
      await prisma.conceptStep.create({
        data: {
          lessonId: lesson.id,
          stepIndex: i + 1,
          kind: s.kind,
          titleKo: s.titleKo,
          titleEn: s.titleEn,
          bodyKo: s.bodyKo,
          bodyEn: s.bodyEn,
          visualType: s.visualType ?? null,
          visualUrl: s.visualUrl ?? null,
          misconception: s.misconception ?? null,
          workedSteps: s.workedSteps ?? null,
          retrievalCheck: s.retrievalCheck ?? null,
          reflectPrompts: s.reflectPrompts ?? null,
        },
      });
      steps++;
    }
  }

  console.log(`📚 ConceptLessons: ${lessons} lessons, ${steps} steps seeded.`);
}

// ----- helpers -----

interface StepRecord {
  kind: ConceptStepKind;
  titleKo: string;
  titleEn: string;
  bodyKo: string;
  bodyEn: string;
  visualType?: string;
  visualUrl?: string;
  misconception?: any;
  workedSteps?: any;
  retrievalCheck?: any;
  reflectPrompts?: any;
}

function buildSteps(
  content: ConceptChapterContent | undefined,
  cognitiveLoad: 0 | 1 | 2 | 3,
  chapterCode: string,
): StepRecord[] {
  const ncert = NCERT_EXCERPTS[chapterCode];
  const seq = pickSequence(cognitiveLoad);
  const steps: StepRecord[] = [];

  for (const bp of seq) {
    const labelKo = bp.labelKo;
    const labelEn = bp.labelEn;

    switch (bp.kind) {
      case 'HOOK': {
        const h = content?.hook;
        if (h) steps.push(stepText(bp, h.ko, h.en));
        else  steps.push(stepText(bp, 'Motivation will be added soon.', 'Motivation will be added soon.'));
        break;
      }
      case 'CONCRETE': {
        const c = content?.concrete;
        if (c) {
          steps.push(stepText(bp, c.ko, c.en, c.visual));
        } else if (content?.worked) {
          // fallback: reuse the first line of the worked example as the concrete step,
          // so every chapter has the same number of steps.
          const first = content.worked.steps[0];
          steps.push(
            stepText(bp,
              `Example: ${content.worked.en}\n→ ${first?.math ?? ''} ${first?.narrationEn ?? ''}`,
              `Example: ${content.worked.en}\n→ ${first?.math ?? ''} ${first?.narrationEn ?? ''}`,
            ),
          );
        } else {
          steps.push(stepText(bp,
            'A concrete example will be added soon.',
            'A concrete example will be added soon.',
          ));
        }
        break;
      }
      case 'PICTORIAL': {
        const p = content?.pictorial;
        if (p) {
          steps.push(stepText(bp, p.ko, p.en, p.visual));
        } else {
          // Visualisation fallback — nudge the student to re-imagine abstract / worked content visually.
          steps.push(stepText(bp,
            'Picture this in your head — a diagram, number line, or graph. Sketching it makes the abstract step stick.',
            'Picture this in your head — a diagram, number line, or graph. Sketching it makes the abstract step stick.',
          ));
        }
        break;
      }
      case 'ABSTRACT': {
        const a = content?.abstract;
        // If a NCERT textbook excerpt exists, append it at the end of the abstract body so the
        // student sees the original alongside our explanation. Excerpts are English-only, so we
        // append the same English excerpt to the ko body too (labelled as the source text).
        const ncertBlock = ncert?.excerpt
          ? `\n\n📖 NCERT textbook · Class ${ncert.chapterNumber > 0 ? ncert.ncertClass.replace('CLASS_', '') : ''} · §${ncert.chapterNumber}.1 Introduction\n${ncert.excerpt}`
          : '';
        const koExtra = ncert?.excerpt
          ? `\n\n📖 NCERT textbook §${ncert.chapterNumber}.1 (source text)\n${ncert.excerpt}`
          : '';
        if (a) {
          steps.push(stepText(bp, a.ko + koExtra, a.en + ncertBlock));
        } else {
          steps.push(stepText(bp,
            'Formal definitions coming soon.' + koExtra,
            'Formal definitions coming soon.' + ncertBlock,
          ));
        }
        break;
      }
      case 'WORKED_EXAMPLE': {
        const w = content?.worked;
        if (w) {
          steps.push({
            kind: 'WORKED_EXAMPLE',
            titleKo: labelKo,
            titleEn: labelEn,
            bodyKo: w.ko,
            bodyEn: w.en,
            workedSteps: w.steps,
          });
        }
        break;
      }
      case 'MISCONCEPTION': {
        const m = content?.misconception;
        if (m) {
          steps.push({
            kind: 'MISCONCEPTION',
            titleKo: labelKo,
            titleEn: labelEn,
            bodyKo: `❌ ${m.wrongKo}\n\n💡 ${m.whyKo}\n\n✅ ${m.correctKo}`,
            bodyEn: `❌ ${m.wrongEn}\n\n💡 ${m.whyEn}\n\n✅ ${m.correctEn}`,
            misconception: m,
          });
        } else {
          // Fallback: generic meta-caution card. Keeps the step count consistent across chapters.
          steps.push({
            kind: 'MISCONCEPTION',
            titleKo: labelKo,
            titleEn: labelEn,
            bodyKo:
              '🔍 Common pitfalls in this chapter\n' +
              '\n' +
              'Two failure modes show up the most:\n' +
              '① memorising symbols without asking *why* they work,\n' +
              '② grabbing the nearest-looking formula without checking its preconditions.\n' +
              '\n' +
              '💡 Take 30 seconds before solving: "Does this formula actually apply here?"',
            bodyEn:
              '🔍 Common pitfalls in this chapter\n' +
              '\n' +
              'Two failure modes show up the most:\n' +
              '① memorising symbols without asking *why* they work,\n' +
              '② grabbing the nearest-looking formula without checking its preconditions.\n' +
              '\n' +
              '💡 Take 30 seconds before solving: "Does this formula actually apply here?"',
            misconception: null,
          });
        }
        break;
      }
      case 'RETRIEVAL': {
        const r = content?.retrieval;
        if (r) {
          steps.push({
            kind: 'RETRIEVAL',
            titleKo: labelKo,
            titleEn: labelEn,
            bodyKo: r.promptKo,
            bodyEn: r.promptEn,
            retrievalCheck: {
              prompt: { ko: r.promptKo, en: r.promptEn },
              accept: r.accept,
              hint: r.hintKo ? { ko: r.hintKo, en: r.hintEn ?? r.hintKo } : null,
              explain: r.explainKo
                ? { ko: r.explainKo, en: r.explainEn ?? r.explainKo }
                : null,
            },
          });
        } else {
          // Every lesson needs a RETRIEVAL step to be unlockable — fallback prompt.
          steps.push({
            kind: 'RETRIEVAL',
            titleKo: labelKo,
            titleEn: labelEn,
            bodyKo: 'Write the core idea of this chapter in your own words.',
            bodyEn: 'Write the core idea of this chapter in your own words.',
            retrievalCheck: { prompt: { ko: '', en: '' }, accept: [], explain: null },
          });
        }
        break;
      }
      case 'GUIDED_PRACTICE': {
        // Used only in DEEP_SEQUENCE. Fades a step out of the worked example as a fill-in.
        const w = content?.worked;
        if (w) {
          steps.push({
            kind: 'GUIDED_PRACTICE',
            titleKo: labelKo,
            titleEn: labelEn,
            bodyKo: 'Fill the missing step below.',
            bodyEn: 'Fill the missing step below.',
            workedSteps: w.steps,
          });
        }
        break;
      }
      case 'REFLECT': {
        const r = content?.reflect;
        steps.push({
          kind: 'REFLECT',
          titleKo: labelKo,
          titleEn: labelEn,
          bodyKo: 'Summarise today\'s big idea in one sentence.',
          bodyEn: 'Summarise today\'s big idea in one sentence.',
          reflectPrompts: r ?? {
            promptsKo: ['How would you explain this to a friend?'],
            promptsEn: ['How would you explain this to a friend?'],
          },
        });
        break;
      }
    }
  }

  return steps;
}

function stepText(
  bp: { kind: ConceptStepKind; labelKo: string; labelEn: string },
  ko: string,
  en: string,
  visual?: string,
): StepRecord {
  return {
    kind: bp.kind,
    titleKo: bp.labelKo,
    titleEn: bp.labelEn,
    bodyKo: ko,
    bodyEn: en,
    visualType: visual ? 'svg' : undefined,
    visualUrl: visual,
  };
}
