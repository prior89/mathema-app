import { KOREAN_STUDY_PROBLEMS } from '../src/common/curriculum/korean-problems';

const ch = KOREAN_STUDY_PROBLEMS['K-G7-MATH1-CH01-FACTORIZATION'];
const p = ch.problems[0];
const correct = p.options.find((o) => o.isCorrect)!;
console.log('CORRECT RAW:', JSON.stringify(correct.text));
console.log('SOLUTION RAW:', JSON.stringify(p.solution));
const norm = (s: string) =>
  s
    .replace(/\$/g, '')
    .replace(/\\dfrac/g, '\\frac')
    .replace(/\\left|\\right/g, '')
    .replace(/[\s,]/g, '')
    .toLowerCase();
const co = norm(correct.text);
const so = norm(p.solution);
console.log('CORRECT NORM:', JSON.stringify(co));
console.log('SOLUTION NORM:', JSON.stringify(so));
console.log('includes?', so.includes(co));
