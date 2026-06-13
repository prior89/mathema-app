#!/usr/bin/env ts-node
/**
 * Rubric Compliance Validator (data-only)
 * Run from server/: npx ts-node scripts/validate-content-rubric.ts
 *
 * Checks key rules from CONTENT_QUALITY_RUBRIC.md:
 * - Worked narration must contain explanatory "because" language
 * - Misconception why/correct should be sufficiently deep
 * - No dangerous unescaped single quotes in ko: strings (syntax risk)
 * - Reports per chapter
 */

import * as fs from 'fs';
import * as path from 'path';

const CURRICULUM_DIR = path.join(__dirname, '../src/common/curriculum');

const BECAUSE_PATTERNS = /because|때문에|this works because|모델링|이유는|왜냐하면/gi;
const DANGEROUS_QUOTE = /ko:\s*'[^']*'[^'\\][^']*'/;  // crude detector for unescaped ' inside single-quoted ko

function checkFile(filePath: string, label: string) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues: string[] = [];

  // Simple chapter code extractor (for reporting)
  const chapterMatch = content.match(/'([A-Z0-9-]+)':\s*\{/);
  const chapter = chapterMatch ? chapterMatch[1] : path.basename(filePath);

  let hasBecause = false;
  let narrationCount = 0;
  let deepMisconception = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.includes('narrationKo') || line.includes('narrationEn') || line.includes('narration:')) {
      narrationCount++;
      if (BECAUSE_PATTERNS.test(line)) hasBecause = true;
    }

    if (line.includes('whyKo') || line.includes('whyEn') || line.includes('why:')) {
      if (line.length > 80) deepMisconception++; // crude depth
    }

    if (DANGEROUS_QUOTE.test(line)) {
      issues.push(`Line ${i+1}: Possible unescaped single quote in ko: string (syntax risk)`);
    }
  }

  if (!hasBecause && narrationCount > 0) {
    issues.push('Missing explanatory "because/때문에/모델링" language in narrations');
  }

  if (issues.length === 0) {
    console.log(`✅ ${label} ${chapter}: OK (${narrationCount} narrations, ${deepMisconception} deep misconceptions)`);
  } else {
    console.log(`❌ ${label} ${chapter}:`);
    issues.forEach(iss => console.log(`   - ${iss}`));
  }
}

function main() {
  console.log('=== Content Rubric Validator ===\n');

  // NCERT
  const ncerts = ['class-7.ts', 'class-8.ts', 'class-9.ts', 'class-10.ts'];
  ncerts.forEach(f => {
    const p = path.join(CURRICULUM_DIR, 'concept-content', f);
    if (fs.existsSync(p)) checkFile(p, 'NCERT');
  });

  // Korean
  const krs = ['middle-school.ts'];
  krs.forEach(f => {
    const p = path.join(CURRICULUM_DIR, 'concept-content-ko', f);
    if (fs.existsSync(p)) checkFile(p, 'KR');
  });

  // Quick note for STUDY files (manual for now, as structure differs)
  console.log('\nNote: STUDY files use different structure (errorReason). Run manual check or extend validator.');
  console.log('Foundations (Rubric/Guidelines) assumed present and followed.');

  console.log('\nDone. Extend this script as more patterns emerge.');
}

main();