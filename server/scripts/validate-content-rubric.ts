#!/usr/bin/env ts-node
/**
 * Rubric Compliance Validator (data-only, practical for CI/pre-commit)
 * Run from server/: npx ts-node scripts/validate-content-rubric.ts [--strict]
 *
 * Enforces CONTENT_QUALITY_RUBRIC.md (2026-06-14):
 * - Every worked narration step MUST contain "because/때문에/this works because/모델링" (mandatory per Rubric for CPA/worked examples effect - Sweller/Renkl, Hattie feedback levels).
 * - Misconception 'why'/'correct': min length + 4-part structure (name misconception + why fails here + correct contrast + next-step; based on error analysis research: Große & Renkl 2007 "Finding and fixing errors...", Rubric 2-4 sentences, student-facing).
 * - ko: strings: NO unescaped inner single quotes (prevents TS syntax errors like class-8/9/10 quote bugs; regex from https://stackoverflow.com/questions/249791/regex-for-quoted-string-with-escaping-quotes and https://blog.stevenlevithan.com/archives/match-quoted-string).
 * - Abstract: must explain "why this holds/models the situation".
 * - STUDY errorReason: min depth + 4-part elements.
 *
 * Sources researched:
 * - Regex quoted strings: StackOverflow, Steven Levithan blog.
 * - Education validation: Große & Renkl (2007) on erroneous worked examples improving conceptual understanding; Rubric itself requires 3+ lines why, elaborated rationales.
 * - Static analysis: General best practices for linting string literals (ESLint-style, but lightweight regex for data files).
 *
 * Exit code 1 on any issues (CI-friendly). Use --strict for higher thresholds.
 */

import * as fs from 'fs';
import * as path from 'path';
import { CHAPTER_CONTENT } from '../src/common/curriculum/concept-content';
import { KOREAN_CHAPTER_CONTENT } from '../src/common/curriculum/concept-content-ko';
import {
  polishConceptChapterContent,
  polishKoreanConceptChapterContent,
} from '../src/common/curriculum/concept-content-polish';
import { KOREAN_STUDY_PROBLEMS } from '../src/common/curriculum/korean-problems';
import { polishKoreanRationale } from './seed-korean-study-problems';

const CURRICULUM_DIR = path.join(__dirname, '../src/common/curriculum');

const BECAUSE_PATTERNS = /because|때문에|this works because|모델|model|matters|이유는|필요한 이유|왜냐하면|정의에서|직접 따라/i;

// Improved quote detector: Match ko: '...' strings (handling basic escapes), then detect unescaped ' inside.
// Based on research: https://stackoverflow.com/questions/249791/regex-for-quoted-string-with-escaping-quotes
// and https://blog.stevenlevithan.com/archives/match-quoted-string
// Pattern for single-quoted string content allowing escaped quotes: ((?:[^'\\]|\\.)*)
const KO_STRING_REGEX = /ko\s*:\s*'((?:[^'\\]|\\.)*)'/g;
const UNESCAPED_INNER_QUOTE = /(?<!\\)'/;  // unescaped ' (negative lookbehind for \ )

// 4-part rationale depth: name misconception + why fails here + correct contrast + next-step.
// Each group must be present; a single keyword is not enough to count as an error-analysis explanation.
const KO_FOUR_PARTS = [
  /오답\s*이름|오개념|오류|착각|혼동/i,
  /왜\s*(실패|틀|혼동)|실패하나|맞지 않|때문에/i,
  /대신|올바른|정답 접근/i,
  /다음에는|다음\s*단계|확인|점검|힌트/i,
];
const EN_FOUR_PARTS = [
  /misconception\s*name|misconception|error|confusion/i,
  /why\s*this\s*fails|fails|because|does not|doesn't|not preserve/i,
  /correct\s*contrast|instead|correct|safer move/i,
  /next\s*step|next time|check|hint|repair|before choosing/i,
];

function checkFile(filePath: string, label: string, minWhyLen: number): number {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues: string[] = [];

  // Simple chapter code extractor (for reporting)
  const chapterMatch = content.match(/'([A-Z0-9-]+)':\s*\{/);
  const chapter = chapterMatch ? chapterMatch[1] : path.basename(filePath);

  let hasBecause = false;
  let narrationCount = 0;
  let deepMisconception = 0;
  let deepAbstract = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.includes('narrationKo') || line.includes('narrationEn') || line.includes('narration:')) {
      narrationCount++;
      if (BECAUSE_PATTERNS.test(line)) hasBecause = true;
      // Stronger: require "because" per narration line for depth (per Rubric "mandatory because")
      if (!BECAUSE_PATTERNS.test(line) && line.length > 20) {
        // flag weak ones later
      }
    }

    // Strengthened length + 4-part for misconceptions (research: Große & Renkl 2007 on error analysis requiring clear justification; Rubric requires 2-4 sentences, 4-part structure)
    if (line.includes('whyKo') || line.includes('whyEn') || line.includes('why:')) {
      const whyContent = line.replace(/.*why(Ko|En|):\s*['"]?/, '').replace(/['"]?,?\s*$/, '');
      if (whyContent.length < minWhyLen) {
        issues.push(`Line ${i+1}: Misconception 'why' too short (${whyContent.length} chars, need >=${minWhyLen}) — student-thinking + context + contrast (Rubric + Große & Renkl 2007).`);
      }
      if (!hasFourPartStructure(whyContent)) {
        issues.push(`Line ${i+1}: Misconception 'why' lacks 4-part elements (name misconception, why fails here, correct contrast, next-step hint).`);
      }
      deepMisconception++;
    }

    if (line.includes('correctKo') || line.includes('correctEn') || line.includes('correct:')) {
      const correctContent = line.replace(/.*correct(Ko|En|):\s*['"]?/, '').replace(/['"]?,?\s*$/, '');
      if (correctContent.length < 80) {
        issues.push(`Line ${i+1}: Misconception 'correct' too short (${correctContent.length} chars). Need contrast + why better.`);
      }
    }

    // Abstract must explain "why this holds / models" (Rubric)
    if (line.includes('abstract:') || (line.includes('ko:') && (line.includes('실수') || line.includes('유리수') || line.includes('산술')))) {
      if (BECAUSE_PATTERNS.test(line) || /this works because|모델을|완비성|유일성|왜냐하면/.test(line)) {
        deepAbstract = true;
      }
    }

    // Accurate unescaped single quote detection in ko: strings
    // Reset regex lastIndex for global
    KO_STRING_REGEX.lastIndex = 0;
    let match;
    while ((match = KO_STRING_REGEX.exec(line)) !== null) {
      const stringContent = match[1];
      if (UNESCAPED_INNER_QUOTE.test(stringContent)) {
        issues.push(`Line ${i+1}: Unescaped single quote inside ko: string (syntax risk for TS parser, e.g. class-8/9/10 errors). Use \\' or switch to double quotes for ko.`);
      }
    }
  }

  if (!hasBecause && narrationCount > 0) {
    issues.push('Missing explanatory "because/때문에/this works because/모델링" language in one or more narrations (Rubric mandatory for worked steps).');
  }

  if (!deepAbstract && content.includes('abstract:')) {
    issues.push('Abstract lacks "why this holds/models the situation" explanation (Rubric requirement; see also worked examples effect research).');
  }

  if (issues.length === 0) {
    console.log(`✅ ${label} ${chapter}: OK (${narrationCount} narrations, ${deepMisconception} deep misconceptions)`);
  } else {
    console.log(`❌ ${label} ${chapter}:`);
    issues.forEach(iss => console.log(`   - ${iss}`));
  }
  return issues.length;
}

function checkStudyReason(reason: string, problemCount: number, issues: string[]) {
  if (reason.length < 100) {
    issues.push(`STUDY reason #${problemCount} too short (${reason.length} chars). Require 4-part (name + why fails + contrast + hint).`);
  }
  if (!hasFourPartStructure(reason)) {
    issues.push(`STUDY reason #${problemCount} lacks 4-part structure keywords.`);
  }
}

function checkMisconceptionWhy(kind: string, text: string, minWhyLen: number, issues: string[]) {
  if (text.length < minWhyLen) {
    issues.push(`${kind} why too short (${text.length} chars, need >=${minWhyLen}) — student-thinking + context + contrast.`);
  }
  if (!hasFourPartStructure(text)) {
    issues.push(`${kind} why lacks 4-part elements (name misconception, why fails here, correct contrast, next-step hint).`);
  }
}

function checkMisconceptionCorrect(kind: string, text: string, issues: string[]) {
  if (text.length < 80) {
    issues.push(`${kind} correct too short (${text.length} chars). Need contrast + why better.`);
  }
  if (!BECAUSE_PATTERNS.test(text)) {
    issues.push(`${kind} correct lacks why/because language.`);
  }
}

function hasFourPartStructure(text: string): boolean {
  return hasAllParts(text, KO_FOUR_PARTS) || hasAllParts(text, EN_FOUR_PARTS);
}

function hasAllParts(text: string, patterns: RegExp[]): boolean {
  return patterns.every((pattern) => pattern.test(text));
}

function checkNarration(kind: string, text: string, issues: string[]) {
  if (text.length > 20 && !BECAUSE_PATTERNS.test(text)) {
    issues.push(`${kind} narration lacks because/때문에/이유 language.`);
  }
}

function checkAbstract(kind: string, text: string, issues: string[]) {
  if (!BECAUSE_PATTERNS.test(text)) {
    issues.push(`${kind} abstract lacks "why this holds/models the situation" explanation.`);
  }
}

function reportConcept(label: string, chapter: string, issues: string[], narrationCount: number, misconceptionCount: number) {
  if (issues.length === 0) {
    console.log(`✅ ${label} ${chapter}: OK (${narrationCount} narrations, ${misconceptionCount} deep misconceptions)`);
  } else {
    console.log(`❌ ${label} ${chapter}:`);
    issues.forEach(iss => console.log(`   - ${iss}`));
  }
}

function checkGeneratedNcertConcepts(minWhyLen: number): number {
  let total = 0;
  for (const [chapter, raw] of Object.entries(CHAPTER_CONTENT)) {
    const content = polishConceptChapterContent(raw);
    const issues: string[] = [];
    let narrationCount = 0;
    let misconceptionCount = 0;
    checkAbstract('abstract.ko', content.abstract.ko, issues);
    checkAbstract('abstract.en', content.abstract.en, issues);
    content.worked.steps.forEach((s, i) => {
      narrationCount += 2;
      checkNarration(`worked[${i + 1}].narrationKo`, s.narrationKo, issues);
      checkNarration(`worked[${i + 1}].narrationEn`, s.narrationEn, issues);
    });
    if (content.misconception) {
      misconceptionCount += 1;
      checkMisconceptionWhy('misconception.whyKo', content.misconception.whyKo, minWhyLen, issues);
      checkMisconceptionWhy('misconception.whyEn', content.misconception.whyEn, minWhyLen, issues);
      checkMisconceptionCorrect('misconception.correctKo', content.misconception.correctKo, issues);
      checkMisconceptionCorrect('misconception.correctEn', content.misconception.correctEn, issues);
    }
    reportConcept('NCERT', chapter, issues, narrationCount, misconceptionCount);
    total += issues.length;
  }
  return total;
}

function checkGeneratedKoreanConcepts(minWhyLen: number): number {
  let total = 0;
  for (const [chapter, raw] of Object.entries(KOREAN_CHAPTER_CONTENT)) {
    const content = polishKoreanConceptChapterContent(raw);
    const issues: string[] = [];
    let narrationCount = 0;
    let misconceptionCount = 0;
    checkAbstract('abstract', content.abstract, issues);
    content.worked.steps.forEach((s, i) => {
      narrationCount += 1;
      checkNarration(`worked[${i + 1}].narration`, s.narration, issues);
    });
    if (content.misconception) {
      misconceptionCount += 1;
      checkMisconceptionWhy('misconception.why', content.misconception.why, minWhyLen, issues);
      checkMisconceptionCorrect('misconception.correct', content.misconception.correct, issues);
    }
    reportConcept('KR', chapter, issues, narrationCount, misconceptionCount);
    total += issues.length;
  }
  return total;
}

function checkStudyFile(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf8');
  const chapterMatch = content.match(/chapterCode:\s*['"]([^'"]+)['"]/);
  const chapter = chapterMatch ? chapterMatch[1] : path.basename(filePath);
  const issues: string[] = [];
  let problemCount = 0;

  // STUDY files use errorReason or rationaleKo/rationaleEn for the wrong-choice
  // explanation. Original regex matched the bare key name "errorReason" as a
  // false positive (11 chars, no quoted value), inflating issue counts by
  // ~9k. Capture the quoted value explicitly via a non-capturing alternation
  // on the key + a single value group, supporting ' " and ` quotes.
  const reasonRegex = /(?:errorReason|rationaleKo|rationaleEn|rationale)\s*:\s*(?:'([^']+)'|"([^"]+)"|`([^`]+)`)/g;
  let m: RegExpExecArray | null;
  while ((m = reasonRegex.exec(content)) !== null) {
    problemCount++;
    const reason = m[1] ?? m[2] ?? m[3] ?? '';
    checkStudyReason(reason, problemCount, issues);
  }

  if (issues.length === 0 && problemCount > 0) {
    console.log(`✅ STUDY ${chapter}: OK (${problemCount} reasons checked)`);
  } else if (issues.length > 0) {
    console.log(`❌ STUDY ${chapter}:`);
    issues.forEach(iss => console.log(`   - ${iss}`));
  }
  return issues.length;
}

function checkGeneratedStudyRationales(): number {
  let total = 0;
  for (const chapter of Object.values(KOREAN_STUDY_PROBLEMS)) {
    const issues: string[] = [];
    let problemCount = 0;
    for (const problem of chapter.problems) {
      for (const option of problem.options) {
        if (option.isCorrect) continue;
        problemCount++;
        const reason = polishKoreanRationale(option.errorCode, option.errorReason, option.text) ?? '';
        checkStudyReason(reason, problemCount, issues);
      }
    }
    if (issues.length === 0 && problemCount > 0) {
      console.log(`✅ STUDY ${chapter.chapterCode}: OK (${problemCount} generated rationales checked)`);
    } else if (issues.length > 0) {
      console.log(`❌ STUDY ${chapter.chapterCode}:`);
      issues.forEach(iss => console.log(`   - ${iss}`));
    }
    total += issues.length;
  }
  return total;
}

function main() {
  const strict = process.argv.includes('--strict');
  // --warn-only flag so CI can be wired up incrementally without flipping the
  // build red on day one. When set we still print every issue but exit 0.
  const warnOnly = process.argv.includes('--warn-only');
  const sourceConcept = process.argv.includes('--source-concept');
  const sourceStudy = process.argv.includes('--source-study');
  const minWhyLen = strict ? 150 : 120;

  console.log('=== Content Rubric Validator ===');
  console.log(`Mode: ${strict ? 'STRICT' : 'NORMAL'} (minWhyLen=${minWhyLen}, warnOnly=${warnOnly})\n`);

  let totalIssues = 0;

  // Concept content. By default validate the DB-ready polished output; use
  // --source-concept when auditing raw authoring strings directly.
  if (sourceConcept) {
    const ncerts = fs.readdirSync(path.join(CURRICULUM_DIR, 'concept-content')).filter(f => f.endsWith('.ts') && !f.includes('types') && !f.includes('index'));
    ncerts.forEach(f => {
      const p = path.join(CURRICULUM_DIR, 'concept-content', f);
      if (fs.existsSync(p)) totalIssues += checkFile(p, 'NCERT', minWhyLen);
    });

    const krs = fs.readdirSync(path.join(CURRICULUM_DIR, 'concept-content-ko')).filter(f => f.endsWith('.ts') && !f.includes('types') && !f.includes('index'));
    krs.forEach(f => {
      const p = path.join(CURRICULUM_DIR, 'concept-content-ko', f);
      if (fs.existsSync(p)) totalIssues += checkFile(p, 'KR', minWhyLen);
    });
  } else {
    totalIssues += checkGeneratedNcertConcepts(minWhyLen);
    totalIssues += checkGeneratedKoreanConcepts(minWhyLen);
  }

  // STUDY files (korean-problems). By default we validate DB-ready generated
  // rationales because raw errorReason values are intentionally terse authoring
  // tags. Use --source-study when auditing those source tags directly.
  const studyDir = path.join(CURRICULUM_DIR, 'korean-problems');
  if (sourceStudy && fs.existsSync(studyDir)) {
    const studies = fs.readdirSync(studyDir).filter(f => f.includes('STUDY') && f.endsWith('.ts'));
    studies.forEach(f => {
      const p = path.join(studyDir, f);
      if (fs.existsSync(p)) totalIssues += checkStudyFile(p);
    });
  } else {
    totalIssues += checkGeneratedStudyRationales();
  }

  console.log(`\n=== Summary ===`);
  console.log(`Total issues: ${totalIssues}`);
  if (totalIssues === 0) {
    console.log('All content passes Rubric checks.');
    process.exit(0);
  }
  if (warnOnly) {
    console.log('warnOnly mode — exiting 0 despite issues. Drop --warn-only to enforce in CI.');
    process.exit(0);
  }
  console.log('Failing build. Re-run with --warn-only during the gradual rollout phase, or fix the listed issues.');
  process.exit(1);
}

main();
