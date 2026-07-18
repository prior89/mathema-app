import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

/**
 * Deterministic shuffle — in the raw seed data the correct answer is always choice 1,
 * which would let students game the assessment by always picking 1. This shuffle prevents that.
 *
 *   key = source + ":" + stepIndex
 *
 * Same input gives the same output across seed runs (no Math.random), so a student replaying
 * the same problem sees the same choice order — keeping study / wrong-note / stats consistent.
 *
 * choiceIndex is re-assigned as array index + 1 after the shuffle.
 */
function deterministicShuffle<T>(arr: T[], key: string): T[] {
  const h = createHash('sha256').update(key).digest();
  let s = h.readUInt32BE(0) || 1;
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Seed: 7 problems × 3 steps (concept / process / answer) × 5 choices.
 *
 * Each step has 1 correct + 4 attractive distractors.
 * Each distractor is tagged with a distractorType + rationale so the data can be analysed.
 *
 * Distractor categories:
 *   CONCEPT_CONFUSION   — confused with another concept (shell vs solid of revolution,
 *                          independent vs conditional, etc.)
 *   CALC_ERROR          — calculation slip (sign, exponent, substitution)
 *   PROCESS_SKIP        — missed a step (forgot the square, the π, the interval conversion, dx)
 *   TIME_PRESSURE_GUESS — common wrong choice under time pressure (answer leaked from
 *                          another problem, rough numerical guess)
 */

type ChoiceSpec = {
  text: string;
  isCorrect?: boolean;
  distractorType?: 'CONCEPT_CONFUSION' | 'CALC_ERROR' | 'PROCESS_SKIP' | 'TIME_PRESSURE_GUESS';
  rationale?: string;
};

type StepSpec = {
  stepIndex: 1 | 2 | 3;
  stepType: 'CONCEPT' | 'PROCESS' | 'ANSWER';
  prompt: string;
  choices: ChoiceSpec[];
};

type ProblemStepsSpec = {
  source: string;
  steps: [StepSpec, StepSpec, StepSpec];
};

const SPEC: ProblemStepsSpec[] = [
  // ------------------------------------------------------------ 1 ------
  {
    source: '2024 September Mock · Q30',
    steps: [
      {
        stepIndex: 1, stepType: 'CONCEPT',
        prompt: 'What is the volume formula for a solid of revolution (x-axis) for this problem?',
        choices: [
          { text: 'V = π ∫[a→b] [f(x)]² dx', isCorrect: true },
          { text: 'V = ∫[a→b] f(x) dx', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused a plain definite integral (area) with a volume formula' },
          { text: 'V = 2π ∫[a→b] x · f(x) dx', distractorType: 'CONCEPT_CONFUSION', rationale: 'Shell (cylindrical) method — confused with revolution about the y-axis' },
          { text: 'V = π ∫[a→b] f(x) dx', distractorType: 'PROCESS_SKIP', rationale: 'Forgot the square (²)' },
          { text: 'V = π ∫[a→b] [f(x)]² dy', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Mixed up the variable of integration (used y-axis revolution)' },
        ],
      },
      {
        stepIndex: 2, stepType: 'PROCESS',
        prompt: 'Substituting f(x)=√x on the interval [0, 4] and simplifying gives:',
        choices: [
          { text: 'π ∫[0→4] x dx', isCorrect: true },
          { text: 'π ∫[0→4] √x dx', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the simplification (√x)² = x' },
          { text: 'π ∫[0→4] x² dx', distractorType: 'CALC_ERROR', rationale: 'Treated √x as x and then squared again — exponent error' },
          { text: '2π ∫[0→4] x dx', distractorType: 'CONCEPT_CONFUSION', rationale: 'Applied the shell-method coefficient (2π)' },
          { text: 'π ∫[1→4] x dx', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Misread the interval start as 1' },
        ],
      },
      {
        stepIndex: 3, stepType: 'ANSWER',
        prompt: 'The value of the integral (the volume) is:',
        choices: [
          { text: '8π', isCorrect: true },
          { text: '4π', distractorType: 'CALC_ERROR', rationale: '∫x dx = x²/2, but evaluated to 4 instead of 8' },
          { text: '16π', distractorType: 'CALC_ERROR', rationale: 'Dropped the ½ — evaluated x² directly' },
          { text: '8', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to multiply by π' },
          { text: '32π', distractorType: 'CALC_ERROR', rationale: '4²=16 then multiplied by 2 by mistake' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ 2 ------
  {
    source: 'CSAT Prep · Calculus III-2-15',
    steps: [
      {
        stepIndex: 1, stepType: 'CONCEPT',
        prompt: 'Which core technique solves ∫ x e^x dx?',
        choices: [
          { text: 'Integration by parts: ∫u dv = uv − ∫v du', isCorrect: true },
          { text: 'u-substitution: let t = e^x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Reached for u-substitution (confused with integration by parts)' },
          { text: 'Integral of a product = product of integrals: (∫x dx)·(∫e^x dx)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Common error: factoring a product integral into a product of integrals' },
          { text: 'Just take the antiderivative directly', distractorType: 'PROCESS_SKIP', rationale: 'No systematic technique picked — guess-and-check' },
          { text: 'Partial fractions', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Not a rational function — answer leaked from a different problem type' },
        ],
      },
      {
        stepIndex: 2, stepType: 'PROCESS',
        prompt: 'Let u = x and dv = e^x dx. The by-parts expression is:',
        choices: [
          { text: 'x e^x − ∫ e^x dx', isCorrect: true },
          { text: 'x e^x − ∫ x e^x dx', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to substitute du = dx' },
          { text: '(1/2)x² · e^x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused the definitions of u and v' },
          { text: 'e^x − ∫ x e^x dx', distractorType: 'CALC_ERROR', rationale: 'Dropped the x in the uv term' },
          { text: 'x e^x + ∫ e^x dx', distractorType: 'CALC_ERROR', rationale: 'Sign error in the by-parts formula' },
        ],
      },
      {
        stepIndex: 3, stepType: 'ANSWER',
        prompt: 'Simplifying gives the antiderivative:',
        choices: [
          { text: '(x − 1) e^x + C', isCorrect: true },
          { text: 'x e^x − e^x', distractorType: 'PROCESS_SKIP', rationale: 'Forgot the constant of integration C' },
          { text: 'x e^x + e^x + C', distractorType: 'CALC_ERROR', rationale: 'Compounded by-parts sign error' },
          { text: '(x + 1) e^x + C', distractorType: 'CALC_ERROR', rationale: 'Sign slip when subtracting ∫e^x = e^x' },
          { text: 'x e^x − x + C', distractorType: 'CALC_ERROR', rationale: 'Wrongly integrated ∫e^x dx as x' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ 3 ------
  {
    source: '2024 June Mock · Q28',
    steps: [
      {
        stepIndex: 1, stepType: 'CONCEPT',
        prompt: 'Definition of conditional probability P(A|B):',
        choices: [
          { text: 'P(A∩B) / P(B)', isCorrect: true },
          { text: 'P(A) · P(B)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with the independent-events product rule' },
          { text: 'P(A∪B) / P(B)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used the union in place of the intersection' },
          { text: 'P(B|A)', distractorType: 'PROCESS_SKIP', rationale: 'Confused the direction of conditioning vs outcome' },
          { text: 'P(A) + P(B) − P(A∩B)', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Picked the inclusion-exclusion formula by reflex' },
        ],
      },
      {
        stepIndex: 2, stepType: 'PROCESS',
        prompt: 'Once B has occurred, the new sample space is:',
        choices: [
          { text: 'restricted to outcomes in B (compute the proportion of A within B)', isCorrect: true },
          { text: 'the entire original sample space, unchanged', distractorType: 'CONCEPT_CONFUSION', rationale: 'Missed the core idea — sample-space restriction' },
          { text: 'restricted to outcomes in A only', distractorType: 'PROCESS_SKIP', rationale: 'Swapped the roles of A and B' },
          { text: 'derive backwards from P(B|A) via Bayes', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Unnecessary detour through Bayes' },
          { text: 'count trials directly without using probability definitions', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the probability-definition step' },
        ],
      },
      {
        stepIndex: 3, stepType: 'ANSWER',
        prompt: 'After computing, the conditional probability is:',
        choices: [
          { text: '7/15', isCorrect: true },
          { text: '7/30', distractorType: 'PROCESS_SKIP', rationale: 'Halved denominator — forgot to apply P(B)' },
          { text: '8/15', distractorType: 'CALC_ERROR', rationale: 'Mistook the complement (1 − 7/15) for the answer' },
          { text: '1/3', distractorType: 'CALC_ERROR', rationale: 'Slip in combinatorial calculation, over-simplified' },
          { text: '14/30', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Forgot to reduce the fraction (numerically correct, format wrong)' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ 4 ------
  {
    source: '2024 September Mock · Q21',
    steps: [
      {
        stepIndex: 1, stepType: 'CONCEPT',
        prompt: 'Cosine of the angle θ between two lines in 3D space:',
        choices: [
          { text: 'cosθ = |u·v| / (|u| · |v|)', isCorrect: true },
          { text: 'cosθ = (u·v) / (|u| · |v|)', distractorType: 'PROCESS_SKIP', rationale: 'Forgot the absolute value — cannot distinguish acute from obtuse' },
          { text: 'cosθ = (u·v)² / (|u|² · |v|²)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Squared the whole formula by mistake' },
          { text: 'cosθ = (|u| · |v|) / (u·v)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Inverted numerator and denominator' },
          { text: 'sinθ = |u × v| / (|u| · |v|)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Sine formula — confused cross product with dot product' },
        ],
      },
      {
        stepIndex: 2, stepType: 'PROCESS',
        prompt: 'Standard procedure to compute |u|, |v|, u·v from two direction vectors:',
        choices: [
          { text: 'Coordinate differences → direction vectors → dot product → magnitude √(x²+y²+z²)', isCorrect: true },
          { text: 'Use the cross product |u × v| instead of the dot product', distractorType: 'CONCEPT_CONFUSION', rationale: 'Tried to use the cross product to get the cosine' },
          { text: 'Skip the square root in |u| and use x²+y²+z² directly', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the vector-magnitude step' },
          { text: 'Reduce to a planar figure and apply the cosine rule', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Wrongly simplified 3D to 2D' },
          { text: 'Leave the sign of u·v unchanged and compute only the denominator', distractorType: 'CALC_ERROR', rationale: 'Forgot the absolute value, sign leaks in' },
        ],
      },
      {
        stepIndex: 3, stepType: 'ANSWER',
        prompt: 'Computed cosine value:',
        choices: [
          { text: '√3 / 3', isCorrect: true },
          { text: '1/3', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to take the square root in |u|, |v|' },
          { text: '-√3 / 3', distractorType: 'PROCESS_SKIP', rationale: 'Forgot |u·v| absolute value — sign survives' },
          { text: '√2 / 2', distractorType: 'CALC_ERROR', rationale: 'Confused with the special-angle table (45°)' },
          { text: '√3', distractorType: 'CALC_ERROR', rationale: 'Dropped the denominator (|u|·|v|)' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ 5 ------
  {
    source: 'Regional Assessment · Q18',
    steps: [
      {
        stepIndex: 1, stepType: 'CONCEPT',
        prompt: 'Core integration technique for ∫ 2x √(x²+1) dx:',
        choices: [
          { text: 'u-substitution: t = x²+1', isCorrect: true },
          { text: 'Integration by parts', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused u-substitution with integration by parts' },
          { text: 'Integral of a product = product of integrals', distractorType: 'CONCEPT_CONFUSION', rationale: 'Tried to split as ∫(2x)dx · ∫√(x²+1)dx' },
          { text: 'Partial fractions', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Not a rational function — wrong technique reflex' },
          { text: 'Maclaurin series expansion', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Out-of-scope technique leaked in' },
        ],
      },
      {
        stepIndex: 2, stepType: 'PROCESS',
        prompt: 'With t = x²+1, dt and the rewritten integral are:',
        choices: [
          { text: 'dt = 2x dx → ∫ √t dt', isCorrect: true },
          { text: 'dt = x dx → ∫ √t dt', distractorType: 'CALC_ERROR', rationale: 'Dropped the factor of 2 when differentiating t' },
          { text: 'dt = (x²+1) dx → ∫ √t / (x²+1) dt', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused t itself with dt' },
          { text: 'dt = 2x → ∫ t^(1/2) (dx missing)', distractorType: 'PROCESS_SKIP', rationale: 'Dropped dx — common slip' },
          { text: 'dt = 2 dx → ∫ x √t dt', distractorType: 'CALC_ERROR', rationale: 'Differentiated d/dx(x²+1) as 2' },
        ],
      },
      {
        stepIndex: 3, stepType: 'ANSWER',
        prompt: 'Evaluate ∫ √t dt and substitute back to x:',
        choices: [
          { text: '(2/3)(x²+1)^(3/2) + C', isCorrect: true },
          { text: '(2/3) t^(3/2) + C', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to substitute t back in terms of x' },
          { text: '(1/2)(x²+1)² + C', distractorType: 'CALC_ERROR', rationale: 'Treated √ as power 1 instead of 1/2' },
          { text: '(3/2)(x²+1)^(3/2) + C', distractorType: 'CALC_ERROR', rationale: 'Confused 2/3 with 3/2' },
          { text: '(2/3)(x²+1)^(1/2) + C', distractorType: 'CALC_ERROR', rationale: 'Used exponent 1/2 — forgot the +1' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ 6 ------
  {
    source: 'CSAT 2023 · Q22',
    steps: [
      {
        stepIndex: 1, stepType: 'CONCEPT',
        prompt: 'When evaluating ∫₀¹ x² dx from the definition (Riemann sum), the core idea is:',
        choices: [
          { text: 'Partition [0,1] into n parts → sum of rectangle areas → take n→∞ limit', isCorrect: true },
          { text: 'Just take the antiderivative (use only the FTC result)', distractorType: 'PROCESS_SKIP', rationale: 'Ignored the "from the definition" requirement' },
          { text: 'Integrate the derivative of x² (going backwards)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused the Riemann definition with the FTC' },
          { text: 'Trapezoidal rule (numerical approximation)', distractorType: 'CONCEPT_CONFUSION', rationale: 'An approximation — different from applying the definition' },
          { text: 'Estimate using f at the midpoint x = (0+1)/2 = 0.5', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Rough midpoint estimate' },
        ],
      },
      {
        stepIndex: 2, stepType: 'PROCESS',
        prompt: 'Using k/n as the kth-subinterval sample point, the Riemann sum is:',
        choices: [
          { text: 'lim[n→∞] Σ[k=1→n] (k/n)² · (1/n)', isCorrect: true },
          { text: 'lim Σ (k/n) · (1/n)', distractorType: 'PROCESS_SKIP', rationale: 'Dropped the square (²) — integrand is x²' },
          { text: 'lim Σ k² · (1/n)', distractorType: 'PROCESS_SKIP', rationale: 'Dropped the n in the sample point denominator' },
          { text: 'lim Σ (k²/n³)', distractorType: 'CALC_ERROR', rationale: 'Combined Σ and (1/n) notation incorrectly' },
          { text: 'lim k²/n³', distractorType: 'CONCEPT_CONFUSION', rationale: 'Dropped the Σ entirely' },
        ],
      },
      {
        stepIndex: 3, stepType: 'ANSWER',
        prompt: 'Applying Σk² = n(n+1)(2n+1)/6 and taking the limit gives:',
        choices: [
          { text: '1/3', isCorrect: true },
          { text: '1/2', distractorType: 'CALC_ERROR', rationale: 'Wrongly used Σk = n(n+1)/2' },
          { text: '1/6', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the limit step — kept only the n³ coefficient' },
          { text: '2/3', distractorType: 'CALC_ERROR', rationale: 'Computed 2·n³/n³ → 2/3 by mistake' },
          { text: '1', distractorType: 'CONCEPT_CONFUSION', rationale: 'Mistook the integrand for 1 (unit area)' },
        ],
      },
    ],
  },

  // ------------------------------------------------------------ 7 ------
  {
    source: '2024 June Mock · Q21',
    steps: [
      {
        stepIndex: 1, stepType: 'CONCEPT',
        prompt: 'Equivalent condition for log_2 A ≥ 0 (where A is in the log domain):',
        choices: [
          { text: 'A ≥ 1 (since base 2 > 1, and log_2 1 = 0)', isCorrect: true },
          { text: 'A ≥ 0', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused the log domain with the log-value condition' },
          { text: 'A > 0', distractorType: 'CONCEPT_CONFUSION', rationale: 'Applied only the domain — forgot the log-value condition' },
          { text: 'A ≤ 1', distractorType: 'CONCEPT_CONFUSION', rationale: 'Reversed the inequality direction (confused with base < 1)' },
          { text: 'A = 1', distractorType: 'PROCESS_SKIP', rationale: 'Took the equality case only — ignored the inequality' },
        ],
      },
      {
        stepIndex: 2, stepType: 'PROCESS',
        prompt: 'Rearrange x²−x−6 ≥ 1 (with x²−x−6 > 0):',
        choices: [
          { text: 'x²−x−7 ≥ 0', isCorrect: true },
          { text: '(x−3)(x+2) ≥ 0  (= x²−x−6 ≥ 0)', distractorType: 'PROCESS_SKIP', rationale: 'Reduced "≥ 1" to "≥ 0" by mistake' },
          { text: 'use x²−x−6 ≥ 0 directly', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to subtract the 1' },
          { text: 'x² − x ≥ 7', distractorType: 'CALC_ERROR', rationale: 'Sign error when moving terms across' },
          { text: '(x−7)(x+1) ≥ 0', distractorType: 'CALC_ERROR', rationale: 'Wrong factoring' },
        ],
      },
      {
        stepIndex: 3, stepType: 'ANSWER',
        prompt: 'Solution set of the inequality (intersected with the domain):',
        choices: [
          { text: 'x ≤ −2 or x ≥ 4 (approximate form)', isCorrect: true },
          { text: '−2 ≤ x ≤ 4', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused the inside/outside region of a quadratic inequality' },
          { text: 'x ≥ 4 (one side only)', distractorType: 'PROCESS_SKIP', rationale: 'Took only one of the two roots' },
          { text: 'x ≤ −3 or x ≥ 3', distractorType: 'CALC_ERROR', rationale: 'Slip extracting roots after factoring' },
          { text: 'all real numbers', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guessed "always true" from the discriminant alone' },
        ],
      },
    ],
  },
];

// =============== 중1 — 20 problems × 3-step MC (legacy demo) ===============
// Each step has 1 correct + 4 attractive distractors tagged with an error-pattern category.
const SPEC_M1: ProblemStepsSpec[] = [
  // ---- Integers and rational numbers (5) ----
  {
    source: '중1 · 정수와 유리수 · 1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Rule for adding two numbers with opposite signs:', choices: [
        { text: 'Take the sign of the larger absolute value, then (larger |·|) − (smaller |·|)', isCorrect: true },
        { text: 'Add the absolute values of both numbers', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with the same-sign addition rule' },
        { text: 'Multiply the absolute values of both numbers', distractorType: 'CONCEPT_CONFUSION', rationale: 'Mistook for the multiplication rule' },
        { text: 'Always take the negative sign', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the larger-absolute-value sign rule' },
        { text: 'Just write both numbers as they are', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guessed without computing' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: '|−3| = 3, |+7| = 7, so the sign and absolute value of the result are:', choices: [
        { text: 'Sign +, absolute value 7 − 3 = 4', isCorrect: true },
        { text: 'Sign −, absolute value 7 + 3 = 10', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as same-sign addition' },
        { text: 'Sign +, absolute value 7 + 3 = 10', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the subtraction step' },
        { text: 'Sign −, absolute value 7 − 3 = 4', distractorType: 'CALC_ERROR', rationale: 'Used the opposite sign of the larger absolute value' },
        { text: 'Sign +, absolute value 3 − 7 = −4', distractorType: 'CALC_ERROR', rationale: 'Reversed the order of subtraction' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Final value:', choices: [
        { text: '4', isCorrect: true },
        { text: '−4', distractorType: 'CALC_ERROR', rationale: 'Sign decision slip' },
        { text: '10', distractorType: 'CONCEPT_CONFUSION', rationale: 'Applied the same-sign addition rule' },
        { text: '−10', distractorType: 'CONCEPT_CONFUSION', rationale: 'Same-sign addition + negative sign' },
        { text: '−21', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guessed using a product' },
      ]},
    ],
  },
  {
    source: '중1 · 정수와 유리수 · 2',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'How to handle subtraction of a negative number:', choices: [
        { text: 'Flip the subtracted negative to a positive and add (a − (−b) = a + b)', isCorrect: true },
        { text: 'Just add the two negatives as they are', distractorType: 'CONCEPT_CONFUSION', rationale: 'Missed the sign-flip step' },
        { text: 'Compare absolute values and take the sign of the larger', distractorType: 'CONCEPT_CONFUSION', rationale: 'Misclassified subtraction as addition' },
        { text: 'The result is always negative', distractorType: 'PROCESS_SKIP', rationale: 'Ignored the concrete transformation rule' },
        { text: 'Convert to multiplication', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Confused the operation type' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Rewrite −5 − (−8) after flipping the sign:', choices: [
        { text: '−5 + 8', isCorrect: true },
        { text: '−5 − 8', distractorType: 'PROCESS_SKIP', rationale: 'Did not apply the sign flip' },
        { text: '5 + 8', distractorType: 'CALC_ERROR', rationale: 'Also flipped the sign of −5' },
        { text: '5 − 8', distractorType: 'CALC_ERROR', rationale: 'Flipped the signs of both terms' },
        { text: '−5 × 8', distractorType: 'CONCEPT_CONFUSION', rationale: 'Changed the operation to multiplication' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Computed result:', choices: [
        { text: '3', isCorrect: true },
        { text: '−13', distractorType: 'PROCESS_SKIP', rationale: 'Result if the sign flip is forgotten' },
        { text: '13', distractorType: 'CALC_ERROR', rationale: 'Result of flipping −5 as well' },
        { text: '−3', distractorType: 'CALC_ERROR', rationale: 'Reversed the order of subtraction' },
        { text: '40', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as a multiplication' },
      ]},
    ],
  },
  {
    source: '중1 · 정수와 유리수 · 3',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Rule for the sign of a product of several numbers:', choices: [
        { text: 'Even number of negative factors → +, odd number → −', isCorrect: true },
        { text: 'If any factor is negative the product is always negative', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrongly generalised the two-number product rule' },
        { text: 'The product is always positive', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the sign determination' },
        { text: 'Take the sign of the factor with the largest absolute value', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with the addition rule' },
        { text: 'Take the sign of the last factor', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Baseless assumption' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Sign and absolute value of (−2) × (+3) × (−4):', choices: [
        { text: 'Sign +, absolute value 2 × 3 × 4 = 24', isCorrect: true },
        { text: 'Sign −, absolute value 2 × 3 × 4 = 24', distractorType: 'CALC_ERROR', rationale: 'Mishandled the count (2) of negatives' },
        { text: 'Sign +, absolute value 2 + 3 + 4 = 9', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used addition in place of multiplication' },
        { text: 'Sign −, absolute value 2 + 3 + 4 = 9', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong on both operation and sign' },
        { text: 'Sign +, absolute value 2 × 3 − 4 = 2', distractorType: 'CALC_ERROR', rationale: 'Mixed operations' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Final value:', choices: [
        { text: '24', isCorrect: true },
        { text: '−24', distractorType: 'CALC_ERROR', rationale: 'Miscounted the negatives' },
        { text: '9', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as addition' },
        { text: '−9', distractorType: 'CONCEPT_CONFUSION', rationale: 'Addition plus negative sign' },
        { text: '0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
    ],
  },
  {
    source: '중1 · 정수와 유리수 · 4',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Definition of |x| (absolute value):', choices: [
        { text: 'Distance from 0 on the number line (always ≥ 0)', isCorrect: true },
        { text: 'Multiply a negative number by −1', distractorType: 'CONCEPT_CONFUSION', rationale: 'Defines only the negative case — misses positives' },
        { text: 'Always equals the number itself', distractorType: 'PROCESS_SKIP', rationale: 'Ignored the sign handling' },
        { text: 'Always means a positive number only', distractorType: 'CONCEPT_CONFUSION', rationale: 'Misses the |0| = 0 case' },
        { text: 'The distance between two numbers', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Confused with a related concept' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Compute |−7| and |+5|:', choices: [
        { text: '|−7| = 7, |+5| = 5', isCorrect: true },
        { text: '|−7| = −7, |+5| = 5', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the sign-flip on the negative' },
        { text: '|−7| = 7, |+5| = −5', distractorType: 'CALC_ERROR', rationale: 'Slip on the positive case' },
        { text: '|−7| = 0, |+5| = 0', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrongly thought |·| is always 0' },
        { text: '|−7| = 49, |+5| = 25', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with squaring' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: '7 + 5 = ?', choices: [
        { text: '12', isCorrect: true },
        { text: '−12', distractorType: 'CALC_ERROR', rationale: 'Sign slip' },
        { text: '2', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as subtraction' },
        { text: '35', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as multiplication' },
        { text: '0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
    ],
  },
  {
    source: '중1 · 정수와 유리수 · 5',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'How to convert a decimal to a fraction:', choices: [
        { text: 'Use 10ⁿ in the denominator (n = number of decimal places) and reduce', isCorrect: true },
        { text: 'Divide the decimal by 100 to get the fraction', distractorType: 'CONCEPT_CONFUSION', rationale: 'Ignored the number of decimal places' },
        { text: 'Put the decimal in the numerator and 1 in the denominator', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the decimal-place handling' },
        { text: 'Multiply the decimal by 2 and put it in the numerator', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Unfounded transformation' },
        { text: 'It is always 1/2', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Write 0.4 as a fraction:', choices: [
        { text: '4/10', isCorrect: true },
        { text: '0.4/1', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the decimal-place step' },
        { text: '4/100', distractorType: 'CALC_ERROR', rationale: 'Wrong place value' },
        { text: '40/10', distractorType: 'CALC_ERROR', rationale: 'Added a 0 to the numerator' },
        { text: '4/1', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Unfounded simplification' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Reduced lowest-terms fraction:', choices: [
        { text: '2/5', isCorrect: true },
        { text: '4/10', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the reduction step' },
        { text: '1/2', distractorType: 'CALC_ERROR', rationale: 'Divided numerator by 2 but kept denominator as 2' },
        { text: '4/5', distractorType: 'CALC_ERROR', rationale: 'Doubled only the numerator' },
        { text: '5/2', distractorType: 'CALC_ERROR', rationale: 'Swapped numerator and denominator' },
      ]},
    ],
  },

  // ---- Variables and expressions (4) ----
  {
    source: '중1 · 문자와 식 · 1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Write "5 times x" as an expression:', choices: [
        { text: '5x', isCorrect: true },
        { text: 'x + 5', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplication treated as addition' },
        { text: 'x⁵', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplication treated as exponentiation' },
        { text: 'x/5', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplication treated as division' },
        { text: '5 − x', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Confused the operation entirely' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Then "add 3" gives:', choices: [
        { text: '5x + 3', isCorrect: true },
        { text: '5(x + 3)', distractorType: 'CALC_ERROR', rationale: 'Wrong placement of parentheses (different distribution)' },
        { text: '5x · 3', distractorType: 'CONCEPT_CONFUSION', rationale: 'Addition treated as multiplication' },
        { text: '5x − 3', distractorType: 'CALC_ERROR', rationale: 'Sign slip' },
        { text: 'x³ + 5', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Mixed operations' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Final expression:', choices: [
        { text: '5x + 3', isCorrect: true },
        { text: '3x + 5', distractorType: 'CALC_ERROR', rationale: 'Swapped coefficient and constant' },
        { text: '5(x + 3)', distractorType: 'CALC_ERROR', rationale: 'Wrong grouping of parentheses' },
        { text: '5x − 3', distractorType: 'CALC_ERROR', rationale: 'Sign error' },
        { text: '15x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplied 5 × 3 instead of adding' },
      ]},
    ],
  },
  {
    source: '중1 · 문자와 식 · 2',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'What does "combining like terms" mean?', choices: [
        { text: 'Add or subtract the coefficients of terms with the same variable (and degree)', isCorrect: true },
        { text: 'Also combine terms with different variables', distractorType: 'CONCEPT_CONFUSION', rationale: 'Misunderstanding of "like terms"' },
        { text: 'Rewrite every term as a multiplication', distractorType: 'CONCEPT_CONFUSION', rationale: 'Misclassified as multiplication' },
        { text: 'Add only the variables, ignoring the coefficients', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the coefficient step' },
        { text: 'The result is always 0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'No reasoning' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Grouping the a-terms and b-terms in 3a + 2b − a + 5b:', choices: [
        { text: '(3 − 1)a + (2 + 5)b', isCorrect: true },
        { text: '(3 + 1)a + (2 + 5)b', distractorType: 'CALC_ERROR', rationale: 'Sign slip on −a' },
        { text: '(3 − 1)a + (2 − 5)b', distractorType: 'CALC_ERROR', rationale: 'Wrong sign on the b-terms' },
        { text: '(3 × 1)a + (2 × 5)b', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplied coefficients instead of adding' },
        { text: '(3 + 2)ab + (1 + 5)ab', distractorType: 'CONCEPT_CONFUSION', rationale: 'Misclassified the like terms' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Simplified result:', choices: [
        { text: '2a + 7b', isCorrect: true },
        { text: '4a + 7b', distractorType: 'CALC_ERROR', rationale: 'Treated −a as +a' },
        { text: '2a − 3b', distractorType: 'CALC_ERROR', rationale: 'Wrong sign on the b-terms' },
        { text: '9ab', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong like-term classification' },
        { text: '5a + 5b', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guessed coefficients' },
      ]},
    ],
  },
  {
    source: '중1 · 문자와 식 · 3',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'First step when evaluating an expression:', choices: [
        { text: 'Substitute −2 directly for x', isCorrect: true },
        { text: 'Ignore x and compute only the constants', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the substitution step' },
        { text: 'Flip every sign in the expression', distractorType: 'CONCEPT_CONFUSION', rationale: 'Unfounded sign change' },
        { text: 'Eliminate the exponents first', distractorType: 'PROCESS_SKIP', rationale: 'Violates order of operations' },
        { text: 'Always set everything to 0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Exponent step in 3 · (−2)² − 5:', choices: [
        { text: '(−2)² = 4 → 3 · 4 − 5', isCorrect: true },
        { text: '(−2)² = −4 → 3 · (−4) − 5', distractorType: 'CALC_ERROR', rationale: 'Sign error when squaring' },
        { text: '(−2)² = 2 → 3 · 2 − 5', distractorType: 'CALC_ERROR', rationale: 'Treated the square as absolute value' },
        { text: '−2² = −4 → 3 · (−4) − 5', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with the unparenthesised −2²' },
        { text: '(−2)² = 0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Final value:', choices: [
        { text: '7', isCorrect: true },
        { text: '−17', distractorType: 'CALC_ERROR', rationale: 'Result of the sign error when squaring' },
        { text: '1', distractorType: 'CALC_ERROR', rationale: 'Result of treating the square as |−2|' },
        { text: '−7', distractorType: 'CALC_ERROR', rationale: 'Sign slip at the end' },
        { text: '13', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Unfounded guess' },
      ]},
    ],
  },
  {
    source: '중1 · 문자와 식 · 4',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Rule for handling a negative sign in front of parentheses:', choices: [
        { text: 'Distribute the sign over every term inside (distributive property)', isCorrect: true },
        { text: 'Apply the negative only outside; leave the inside signs as they are', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the distribution' },
        { text: 'Distribute only the multiplication, leave signs unchanged', distractorType: 'CONCEPT_CONFUSION', rationale: 'Separated sign from coefficient' },
        { text: 'Apply it only to the first term inside', distractorType: 'PROCESS_SKIP', rationale: 'Partial distribution only' },
        { text: 'Leave the parentheses unchanged', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Avoided the operation' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Apply the distributive property to −2(3x − 5) + 4x:', choices: [
        { text: '−6x + 10 + 4x', isCorrect: true },
        { text: '−6x − 10 + 4x', distractorType: 'CALC_ERROR', rationale: 'Slip on the negative × negative sign' },
        { text: '−6x + 5 + 4x', distractorType: 'CALC_ERROR', rationale: 'Forgot the −2 × −5 = 10 step' },
        { text: '6x + 10 + 4x', distractorType: 'CALC_ERROR', rationale: 'Coefficient sign slip' },
        { text: '−2(3x − 5 + 4x)', distractorType: 'PROCESS_SKIP', rationale: 'Did not distribute' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'After combining like terms:', choices: [
        { text: '−2x + 10', isCorrect: true },
        { text: '−10x + 10', distractorType: 'CALC_ERROR', rationale: 'Slip combining −6x + 4x' },
        { text: '−2x − 10', distractorType: 'CALC_ERROR', rationale: 'Wrong sign on the constant' },
        { text: '2x + 10', distractorType: 'CALC_ERROR', rationale: 'Wrong sign on the x coefficient' },
        { text: '−6x + 10', distractorType: 'PROCESS_SKIP', rationale: 'Did not add the 4x' },
      ]},
    ],
  },

  // ---- Linear equations (7) ----
  {
    source: '중1 · 일차방정식 · 1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'First principle when solving a linear equation:', choices: [
        { text: 'Transpose constants to the right side, keep variable terms on the left', isCorrect: true },
        { text: 'Substitute random values for the variable', distractorType: 'CONCEPT_CONFUSION', rationale: 'Tried trial substitution' },
        { text: 'Convert the whole equation into a product', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused operation type' },
        { text: 'Multiply both sides by the same number to clear denominators', distractorType: 'PROCESS_SKIP', rationale: 'No fractions in the equation' },
        { text: 'Guess without deciding a method', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'No reasoning' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Transpose −7 in 3x − 7 = 11:', choices: [
        { text: '3x = 18', isCorrect: true },
        { text: '3x = 4', distractorType: 'CALC_ERROR', rationale: 'Wrongly computed 11 − 7' },
        { text: '3x = −18', distractorType: 'CALC_ERROR', rationale: 'Sign slip on transposition' },
        { text: 'x = 4', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the coefficient-3 step' },
        { text: '3x − 7 = 11 unchanged', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Did not transpose' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Value of x:', choices: [
        { text: '6', isCorrect: true },
        { text: '−6', distractorType: 'CALC_ERROR', rationale: 'Sign slip' },
        { text: '18', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to divide by the coefficient 3' },
        { text: '3', distractorType: 'CALC_ERROR', rationale: 'Wrongly divided 18 ÷ 6' },
        { text: '54', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplied where division was required' },
      ]},
    ],
  },
  {
    source: '중1 · 일차방정식 · 2',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'First step for a linear equation with parentheses:', choices: [
        { text: 'Expand using the distributive property', isCorrect: true },
        { text: 'Square both sides first', distractorType: 'CONCEPT_CONFUSION', rationale: 'Unrelated transformation' },
        { text: 'Transpose while leaving parentheses untouched', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the parenthesis step' },
        { text: 'Ignore the coefficient in front of the parentheses', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the coefficient' },
        { text: 'Take the difference of the two sides', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'No basis' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Apply the distributive property + transpose in 2(x + 4) = 5x − 1:', choices: [
        { text: '−3x = −9', isCorrect: true },
        { text: '−3x = 9', distractorType: 'CALC_ERROR', rationale: 'Sign error on the constant transposition' },
        { text: '3x = −9', distractorType: 'CALC_ERROR', rationale: 'Sign error on the x-term transposition' },
        { text: '7x = 9', distractorType: 'CALC_ERROR', rationale: 'Combined like terms wrong (2x + 5x)' },
        { text: '2x + 8 = 5x − 1 unchanged', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the transposition step' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Value of x:', choices: [
        { text: '3', isCorrect: true },
        { text: '−3', distractorType: 'CALC_ERROR', rationale: 'Sign-handling slip' },
        { text: '9', distractorType: 'PROCESS_SKIP', rationale: 'Did not divide by the coefficient −3' },
        { text: '1/3', distractorType: 'CALC_ERROR', rationale: 'Swapped numerator and denominator in division' },
        { text: '0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
    ],
  },
  {
    source: '중1 · 일차방정식 · 3',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Cleanest handling when the variable coefficient is negative:', choices: [
        { text: 'Transpose constants to the right, then divide both sides by the negative coefficient', isCorrect: true },
        { text: 'Ignore the negative sign and solve as if positive', distractorType: 'PROCESS_SKIP', rationale: 'Ignored the sign' },
        { text: 'Always multiply both sides by −1 first', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrongly memorised as a required step' },
        { text: 'Square both sides to remove the sign', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong transformation' },
        { text: 'Guess without reasoning', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Transpose 5 in −3x + 5 = 14:', choices: [
        { text: '−3x = 9', isCorrect: true },
        { text: '−3x = 19', distractorType: 'CALC_ERROR', rationale: 'Kept the sign of the moved term' },
        { text: '3x = 9', distractorType: 'CALC_ERROR', rationale: 'Also flipped the sign of −3x' },
        { text: '−3x = −9', distractorType: 'CALC_ERROR', rationale: 'Sign slip on the right side' },
        { text: '−3x + 5 = 14 unchanged', distractorType: 'PROCESS_SKIP', rationale: 'Did not transpose' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Value of x:', choices: [
        { text: '−3', isCorrect: true },
        { text: '3', distractorType: 'CALC_ERROR', rationale: 'Slip handling the negative coefficient' },
        { text: '9', distractorType: 'PROCESS_SKIP', rationale: 'Did not divide by the coefficient −3' },
        { text: '−9', distractorType: 'CALC_ERROR', rationale: 'Sign slip in the division step' },
        { text: '0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
    ],
  },
  {
    source: '중1 · 일차방정식 · 4',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Efficient first step for a linear equation with fractional coefficients:', choices: [
        { text: 'Multiply both sides by the LCM of the denominators to clear fractions', isCorrect: true },
        { text: 'Leave the fractions and only transpose', distractorType: 'PROCESS_SKIP', rationale: 'Skipped clearing fractions' },
        { text: 'Ignore the fractional part', distractorType: 'PROCESS_SKIP', rationale: 'Dropped a term' },
        { text: 'Multiply the two sides together', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'No basis' },
        { text: 'Add only the numerators', distractorType: 'CONCEPT_CONFUSION', rationale: 'Ignored the denominators' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Multiply both sides of x/2 + 3 = 7 by 2:', choices: [
        { text: 'x + 6 = 14', isCorrect: true },
        { text: 'x + 3 = 14', distractorType: 'PROCESS_SKIP', rationale: 'Did not multiply the +3 by 2' },
        { text: '2x + 3 = 14', distractorType: 'CALC_ERROR', rationale: 'Slip handling x/2' },
        { text: 'x + 6 = 7', distractorType: 'PROCESS_SKIP', rationale: 'Did not multiply the right side by 2' },
        { text: '2x + 6 = 14', distractorType: 'CALC_ERROR', rationale: 'Multiplied x/2 itself by 2' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Value of x:', choices: [
        { text: '8', isCorrect: true },
        { text: '4', distractorType: 'CALC_ERROR', rationale: 'Slip in the division step after transposition' },
        { text: '14', distractorType: 'PROCESS_SKIP', rationale: 'Did not transpose 6' },
        { text: '−8', distractorType: 'CALC_ERROR', rationale: 'Sign slip' },
        { text: '20', distractorType: 'CALC_ERROR', rationale: 'Slip combining transposition and multiplication' },
      ]},
    ],
  },
  {
    source: '중1 · 일차방정식 · 5',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'First step for a word problem:', choices: [
        { text: 'Define the unknown and set up an equation', isCorrect: true },
        { text: 'Guess the answer immediately', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Skipped the equation setup' },
        { text: 'Turn the whole sentence into a multiplication', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused operation type' },
        { text: 'Always set up an inequality', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong form chosen' },
        { text: 'Ignore the sentence', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the comprehension step' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Equation for the square’s perimeter (perimeter = side length × ?):', choices: [
        { text: '4x = 24', isCorrect: true },
        { text: '3x = 24', distractorType: 'CONCEPT_CONFUSION', rationale: 'Mistook the figure for a triangle' },
        { text: 'x² = 24', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with the area formula' },
        { text: '2x = 24', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used only the sum of two sides' },
        { text: 'x + 24 = 4', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Wrong equation structure' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Value of x (side length):', choices: [
        { text: '6', isCorrect: true },
        { text: '24', distractorType: 'PROCESS_SKIP', rationale: 'Did not divide by 4' },
        { text: '8', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrongly computed 24 ÷ 3' },
        { text: '12', distractorType: 'CONCEPT_CONFUSION', rationale: 'Took perimeter ÷ 2 = half the perimeter' },
        { text: '4', distractorType: 'CALC_ERROR', rationale: 'Swapped numerator and denominator in division' },
      ]},
    ],
  },
  {
    source: '중1 · 일차방정식 · 6',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'How to represent three consecutive natural numbers:', choices: [
        { text: 'x, x + 1, x + 2', isCorrect: true },
        { text: 'x, 2x, 3x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with multiples' },
        { text: 'x, x², x³', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with exponents' },
        { text: 'Only 1, 2, 3 is possible', distractorType: 'PROCESS_SKIP', rationale: 'Skipped generalisation' },
        { text: 'x, x + 2, x + 4', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with consecutive even numbers' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'The sum of the three numbers is 39, so the equation is:', choices: [
        { text: '3x + 3 = 39', isCorrect: true },
        { text: '3x = 39', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to add the +1 and +2' },
        { text: 'x + 3 = 39', distractorType: 'PROCESS_SKIP', rationale: 'Ignored that x appears three times' },
        { text: '3x − 3 = 39', distractorType: 'CALC_ERROR', rationale: 'Sign error on +1+2 = +3' },
        { text: 'x³ + 3 = 39', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with exponents' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'The smallest natural number (= x):', choices: [
        { text: '12', isCorrect: true },
        { text: '13', distractorType: 'CALC_ERROR', rationale: 'Slip handling the +3 in the equation' },
        { text: '14', distractorType: 'CALC_ERROR', rationale: 'Mistook the middle value for the smallest' },
        { text: '11', distractorType: 'CALC_ERROR', rationale: 'Division slip' },
        { text: '13.5', distractorType: 'CALC_ERROR', rationale: 'Place-value error in the division' },
      ]},
    ],
  },
  {
    source: '중1 · 일차방정식 · 7',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Condition for the proportion a : b = c : d:', choices: [
        { text: 'Product of the means equals product of the extremes (b · c = a · d)', isCorrect: true },
        { text: 'Always a + b = c + d', distractorType: 'CONCEPT_CONFUSION', rationale: 'Mistook for an addition rule' },
        { text: 'Holds whenever a = c', distractorType: 'PROCESS_SKIP', rationale: 'Used only a special case' },
        { text: 'A proportion is the same as a regular equation', distractorType: 'CONCEPT_CONFUSION', rationale: 'Ignored the structural difference' },
        { text: 'Holds if the two numerators are equal', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong rule' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Cross-multiply 3 : 5 = x : 20:', choices: [
        { text: '5 · x = 3 · 20', isCorrect: true },
        { text: '3 · x = 5 · 20', distractorType: 'CALC_ERROR', rationale: 'Swapped means and extremes' },
        { text: '3 + x = 5 + 20', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as addition' },
        { text: '3 · 5 = x · 20', distractorType: 'CALC_ERROR', rationale: 'Wrong pairing for multiplication' },
        { text: 'x = 3 + 5 + 20', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'No reasoning' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Value of x:', choices: [
        { text: '12', isCorrect: true },
        { text: '60', distractorType: 'PROCESS_SKIP', rationale: 'Did not divide by 5' },
        { text: '4', distractorType: 'CALC_ERROR', rationale: 'Place-value slip in the division' },
        { text: '15', distractorType: 'CALC_ERROR', rationale: 'Wrong multiplication result' },
        { text: '20/3', distractorType: 'CALC_ERROR', rationale: 'Result of the swapped means/extremes' },
      ]},
    ],
  },

  // ---- Coordinate plane and graphs (4) ----
  {
    source: '중1 · 좌표평면과 그래프 · 1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Relationship between quadrant number and the signs of coordinates:', choices: [
        { text: 'Q1: (+,+), Q2: (−,+), Q3: (−,−), Q4: (+,−)', isCorrect: true },
        { text: 'Q1: (−,−), Q2: (+,−), Q3: (+,+), Q4: (−,+)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Memorised the rotation direction backwards' },
        { text: 'Q1: (+,−), Q2: (−,−), Q3: (−,+), Q4: (+,+)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Memorised diagonally symmetric' },
        { text: 'All (+,+)', distractorType: 'PROCESS_SKIP', rationale: 'Ignored the sign distinction' },
        { text: 'Anything with a negative is always in Q3', distractorType: 'CONCEPT_CONFUSION', rationale: 'Oversimplification' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Sign pattern of the point (−3, 2):', choices: [
        { text: 'x = − , y = +', isCorrect: true },
        { text: 'x = + , y = +', distractorType: 'CALC_ERROR', rationale: 'Slip on the negative sign' },
        { text: 'x = − , y = −', distractorType: 'CALC_ERROR', rationale: 'Sign slip on y' },
        { text: 'x = + , y = −', distractorType: 'CALC_ERROR', rationale: 'Flipped both signs' },
        { text: 'Both are 0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Which quadrant is this point in?', choices: [
        { text: 'Quadrant II', isCorrect: true },
        { text: 'Quadrant I', distractorType: 'CALC_ERROR', rationale: 'Slip matching signs' },
        { text: 'Quadrant III', distractorType: 'CALC_ERROR', rationale: 'Ignored the y sign' },
        { text: 'Quadrant IV', distractorType: 'CALC_ERROR', rationale: 'Confused with the diagonal quadrant' },
        { text: 'On the x-axis', distractorType: 'CONCEPT_CONFUSION', rationale: 'Assumed a coordinate is 0' },
      ]},
    ],
  },
  {
    source: '중1 · 좌표평면과 그래프 · 2',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Effect of reflection across the x-axis:', choices: [
        { text: 'x stays the same; only the sign of y flips', isCorrect: true },
        { text: 'y stays the same; only the sign of x flips', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with reflection across the y-axis' },
        { text: 'Both signs flip', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with reflection through the origin' },
        { text: 'Swap the two coordinates', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with reflection across y = x' },
        { text: 'No change', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the operation entirely' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Flip only the sign of y in (4, −1):', choices: [
        { text: '(4, 1)', isCorrect: true },
        { text: '(−4, −1)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as y-axis reflection' },
        { text: '(−4, 1)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as reflection through the origin' },
        { text: '(−1, 4)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treated as reflection across y = x' },
        { text: '(4, −1)', distractorType: 'PROCESS_SKIP', rationale: 'Did not apply the reflection' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Reflected point:', choices: [
        { text: '(4, 1)', isCorrect: true },
        { text: '(−4, 1)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Reflection through the origin' },
        { text: '(−4, −1)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Reflection across y-axis' },
        { text: '(1, 4)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Reflection across y = x' },
        { text: '(4, 0)', distractorType: 'CALC_ERROR', rationale: 'Sent the value to 0 instead of flipping the sign' },
      ]},
    ],
  },
  {
    source: '중1 · 좌표평면과 그래프 · 3',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'For the proportional relation y = ax, how do you find the constant of proportionality a?', choices: [
        { text: 'Compute y / x; that gives a', isCorrect: true },
        { text: 'a = y − x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Defined using subtraction' },
        { text: 'a = y + x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Defined using addition' },
        { text: 'a = x · y', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with inverse proportion' },
        { text: 'Always a = 1', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'No basis' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Plug in x = 4, y = 12 to find the constant:', choices: [
        { text: 'a = 12 / 4 = 3', isCorrect: true },
        { text: 'a = 4 / 12 = 1/3', distractorType: 'CALC_ERROR', rationale: 'Swapped numerator and denominator' },
        { text: 'a = 12 − 4 = 8', distractorType: 'CONCEPT_CONFUSION', rationale: 'Applied the subtraction definition' },
        { text: 'a = 12 + 4 = 16', distractorType: 'CONCEPT_CONFUSION', rationale: 'Applied the addition definition' },
        { text: 'a = 12 · 4 = 48', distractorType: 'CONCEPT_CONFUSION', rationale: 'Applied the inverse proportion formula' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Express y as a function of x:', choices: [
        { text: 'y = 3x', isCorrect: true },
        { text: 'y = x/3', distractorType: 'CALC_ERROR', rationale: 'Result of the swapped numerator/denominator on a' },
        { text: 'y = 8x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used the subtraction result' },
        { text: 'y = 48/x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrongly wrote an inverse proportion' },
        { text: 'y = x + 3', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with a linear (affine) expression' },
      ]},
    ],
  },
  {
    source: '중1 · 좌표평면과 그래프 · 4',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Characteristics of the graph y = ax with a < 0:', choices: [
        { text: 'Passes through the origin going upper-left to lower-right (through Q2 and Q4)', isCorrect: true },
        { text: 'Passes through the origin going lower-left to upper-right (through Q1 and Q3)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with the positive-slope graph' },
        { text: 'Always parallel to the x-axis', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with a constant function' },
        { text: 'Always parallel to the y-axis', distractorType: 'CONCEPT_CONFUSION', rationale: 'Misunderstood line direction' },
        { text: 'Does not start at the origin', distractorType: 'PROCESS_SKIP', rationale: 'Forgot that proportionality passes through the origin' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Plug x = 1 and x = −1 into y = −2x:', choices: [
        { text: '(1, −2) and (−1, 2)', isCorrect: true },
        { text: '(1, 2) and (−1, −2)', distractorType: 'CALC_ERROR', rationale: 'Slip on the negative coefficient' },
        { text: '(2, 1) and (−2, −1)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Swapped x and y coordinates' },
        { text: 'Only (0, 0)', distractorType: 'PROCESS_SKIP', rationale: 'Oversimplified the substitution step' },
        { text: '(−1, −1) and (1, 1)', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Guess' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Quadrants the graph passes through:', choices: [
        { text: 'Quadrants II and IV', isCorrect: true },
        { text: 'Quadrants I and III', distractorType: 'CALC_ERROR', rationale: 'Slip handling the sign of the slope' },
        { text: 'Quadrants I and II', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with reflection across the x-axis' },
        { text: 'Quadrants III and IV', distractorType: 'CONCEPT_CONFUSION', rationale: 'Assumed the graph goes only downwards' },
        { text: 'Quadrant I only', distractorType: 'PROCESS_SKIP', rationale: 'Considered only one direction' },
      ]},
    ],
  },
];

// =============== Korean middle/high review — 12 problems ===============
const SPEC_KR_REVIEW: ProblemStepsSpec[] = [
  // ---- 중2 ----
  {
    source: '중2 · 유리수와 순환소수 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'How do you convert a repeating decimal to a fraction?', choices: [
        { text: 'Let x equal the decimal, multiply by 10ⁿ where n = repeating block length, then subtract', isCorrect: true },
        { text: 'Multiply numerator and denominator by 10', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with terminating decimals.' },
        { text: 'Use long division to find the next 10 digits', distractorType: 'PROCESS_SKIP', rationale: 'Brute force, not algebraic.' },
        { text: 'Round to 2 decimal places', distractorType: 'CONCEPT_CONFUSION', rationale: 'Loses information; result is rational only by approximation.' },
        { text: 'Repeating decimals cannot be expressed as fractions', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'False — every repeating decimal is rational.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'For x = 0.333…, what is 10x − x?', choices: [
        { text: '10x − x = 9x = 3', isCorrect: true },
        { text: '10x − x = 9x = 3.333…', distractorType: 'CALC_ERROR', rationale: 'Forgot the subtraction cancels the repeating tail.' },
        { text: '10x − x = 11x = 3', distractorType: 'CALC_ERROR', rationale: 'Sign or coefficient error.' },
        { text: '10x − x = x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Treats x as if 10x = x.' },
        { text: '10x − x = 0', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Random guess.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'So x equals:', choices: [
        { text: '1/3', isCorrect: true },
        { text: '3/10', distractorType: 'PROCESS_SKIP', rationale: 'Did not subtract — just took 0.3 ≈ 3/10.' },
        { text: '1/9', distractorType: 'CALC_ERROR', rationale: '9x = 1 instead of 9x = 3.' },
        { text: '3/9', distractorType: 'PROCESS_SKIP', rationale: 'Did not reduce to lowest terms.' },
        { text: '0.33', distractorType: 'CONCEPT_CONFUSION', rationale: 'Gave a decimal, not a fraction.' },
      ]},
    ],
  },
  {
    source: '중2 · 곱셈공식 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Which identity expands (a + b)²?', choices: [
        { text: '(a + b)² = a² + 2ab + b²', isCorrect: true },
        { text: '(a + b)² = a² + b²', distractorType: 'PROCESS_SKIP', rationale: 'Forgets the middle term 2ab — most common error.' },
        { text: '(a + b)² = a² + ab + b²', distractorType: 'CALC_ERROR', rationale: 'Halved the cross-term coefficient.' },
        { text: '(a + b)² = (a + b)(a − b)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with difference of squares.' },
        { text: '(a + b)² = 2a² + 2b²', distractorType: 'CONCEPT_CONFUSION', rationale: 'Misapplied distributive property.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Substitute a = x, b = 5:', choices: [
        { text: 'x² + 2·x·5 + 5²', isCorrect: true },
        { text: 'x² + 5²', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the cross-term.' },
        { text: 'x² + 5x + 5²', distractorType: 'CALC_ERROR', rationale: 'Cross-term coefficient should be 2·5 = 10, not 5.' },
        { text: '2x² + 5²', distractorType: 'CONCEPT_CONFUSION', rationale: 'Doubled the wrong term.' },
        { text: 'x² · 5²', distractorType: 'CONCEPT_CONFUSION', rationale: 'Replaced + with · between terms.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Simplified result:', choices: [
        { text: 'x² + 10x + 25', isCorrect: true },
        { text: 'x² + 25', distractorType: 'PROCESS_SKIP', rationale: 'Dropped middle term.' },
        { text: 'x² + 5x + 25', distractorType: 'CALC_ERROR', rationale: 'Half coefficient on the cross-term.' },
        { text: 'x² + 10x + 10', distractorType: 'CALC_ERROR', rationale: '5² = 10 instead of 25.' },
        { text: 'x² + 10x', distractorType: 'PROCESS_SKIP', rationale: 'Forgot the constant term.' },
      ]},
    ],
  },
  {
    source: '중2 · 일차방정식 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'First step to solve 2x − 3 = 5x + 9?', choices: [
        { text: 'Move x-terms to one side, constants to the other (transposition flips signs)', isCorrect: true },
        { text: 'Divide both sides by x', distractorType: 'CONCEPT_CONFUSION', rationale: 'Cannot divide by an unknown.' },
        { text: 'Square both sides', distractorType: 'CONCEPT_CONFUSION', rationale: 'Squaring is for radical equations, not linear.' },
        { text: 'Try x = 1 and check', distractorType: 'PROCESS_SKIP', rationale: 'Trial-and-error — slow and unreliable.' },
        { text: 'Multiply both sides by 2', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'No reason to multiply at this stage.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'After transposing all x-terms to the left and constants to the right:', choices: [
        { text: '2x − 5x = 9 + 3', isCorrect: true },
        { text: '2x + 5x = 9 + 3', distractorType: 'CALC_ERROR', rationale: 'Sign error when moving 5x.' },
        { text: '2x − 5x = 9 − 3', distractorType: 'CALC_ERROR', rationale: 'Sign error when moving −3.' },
        { text: '2x − 5x = −9 − 3', distractorType: 'CALC_ERROR', rationale: 'Both signs flipped wrongly.' },
        { text: '2x − 3 + 5x + 9 = 0', distractorType: 'PROCESS_SKIP', rationale: 'Did not combine like terms.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Combine and divide:', choices: [
        { text: 'x = -4', isCorrect: true },
        { text: 'x = 4', distractorType: 'CALC_ERROR', rationale: 'Sign of result wrong; division by −3 not handled.' },
        { text: 'x = -12', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to divide by the coefficient.' },
        { text: 'x = 12', distractorType: 'CALC_ERROR', rationale: 'Multiplied instead of divided.' },
        { text: 'x = -3', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Random guess.' },
      ]},
    ],
  },
  {
    source: '중2 · 일차함수 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Slope of a line between two points?', choices: [
        { text: 'm = (y₂ − y₁) / (x₂ − x₁)', isCorrect: true },
        { text: 'm = (x₂ − x₁) / (y₂ − y₁)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Numerator and denominator swapped.' },
        { text: 'm = y₂ + y₁ / x₂ + x₁', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used sum instead of difference.' },
        { text: 'm = y₂ · x₁', distractorType: 'CONCEPT_CONFUSION', rationale: 'Product is unrelated to slope.' },
        { text: 'Slope is always 1', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Default guess.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Plug in (0, 2) and (3, 8):', choices: [
        { text: 'm = (8 − 2) / (3 − 0)', isCorrect: true },
        { text: 'm = (3 − 0) / (8 − 2)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Swapped numerator and denominator.' },
        { text: 'm = (8 + 2) / (3 + 0)', distractorType: 'CALC_ERROR', rationale: 'Used sums.' },
        { text: 'm = (8 − 2) · (3 − 0)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplied instead of divided.' },
        { text: 'm = 8 / 3', distractorType: 'PROCESS_SKIP', rationale: 'Took the second point only.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Compute:', choices: [
        { text: '2', isCorrect: true },
        { text: '6/3', distractorType: 'PROCESS_SKIP', rationale: 'Did not simplify.' },
        { text: '1/2', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used reciprocal slope.' },
        { text: '6', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to divide by 3.' },
        { text: '3', distractorType: 'CALC_ERROR', rationale: 'Computation error.' },
      ]},
    ],
  },

  // ---- 중3 ----
  {
    source: '중3 · 제곱근과 실수 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'How do you simplify √50?', choices: [
        { text: 'Factor 50 = 25·2 = 5²·2 ⇒ √50 = 5√2', isCorrect: true },
        { text: 'Round to 7.07 and treat as decimal', distractorType: 'PROCESS_SKIP', rationale: 'Loses surd form needed to combine.' },
        { text: '√50 = √25 + √2 = 5 + √2', distractorType: 'CONCEPT_CONFUSION', rationale: 'False: √(a·b) ≠ √a + √b.' },
        { text: '√50 cannot be simplified', distractorType: 'TIME_PRESSURE_GUESS', rationale: '50 has a square factor (25).' },
        { text: '√50 = 50^(1/2) = 25', distractorType: 'CALC_ERROR', rationale: 'Confused exponent rules.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Now √8 = ?', choices: [
        { text: '√8 = √(4·2) = 2√2', isCorrect: true },
        { text: '√8 = 2√4', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong factoring (4·2 should leave 2 inside, not 4).' },
        { text: '√8 = 8√2', distractorType: 'CALC_ERROR', rationale: 'Misapplied factoring.' },
        { text: '√8 = √2', distractorType: 'PROCESS_SKIP', rationale: 'Dropped the coefficient.' },
        { text: '√8 = 4√2', distractorType: 'CALC_ERROR', rationale: 'Took √4 wrong.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Add 5√2 + 2√2:', choices: [
        { text: '7√2', isCorrect: true },
        { text: '7√4', distractorType: 'CONCEPT_CONFUSION', rationale: 'Added under the radical too.' },
        { text: '√58', distractorType: 'CONCEPT_CONFUSION', rationale: 'Tried to combine inside the radical.' },
        { text: '10', distractorType: 'CALC_ERROR', rationale: 'Treated √2 as 1.' },
        { text: '5√2 + 2√2', distractorType: 'PROCESS_SKIP', rationale: 'Did not actually add the like surds.' },
      ]},
    ],
  },
  {
    source: '중3 · 인수분해 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'To factorise x² + 7x + 12, what do you look for?', choices: [
        { text: 'Two numbers that add to 7 and multiply to 12', isCorrect: true },
        { text: 'Two numbers that subtract to 7 and divide to 12', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong relationship between coefficients.' },
        { text: 'Use the quadratic formula immediately', distractorType: 'PROCESS_SKIP', rationale: 'Possible but unnecessary when factorisation works.' },
        { text: 'Two numbers that add to 12 and multiply to 7', distractorType: 'CONCEPT_CONFUSION', rationale: 'Sum and product confused.' },
        { text: 'Factor out an x first', distractorType: 'PROCESS_SKIP', rationale: 'No common factor — leads nowhere.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Which pair (p, q) satisfies p + q = 7 and pq = 12?', choices: [
        { text: 'p = 3, q = 4', isCorrect: true },
        { text: 'p = 6, q = 2', distractorType: 'CALC_ERROR', rationale: '6 + 2 = 8, not 7.' },
        { text: 'p = 5, q = 2', distractorType: 'CALC_ERROR', rationale: '5·2 = 10, not 12.' },
        { text: 'p = 12, q = 1', distractorType: 'PROCESS_SKIP', rationale: 'Sum 13, not 7.' },
        { text: 'p = -3, q = -4', distractorType: 'CALC_ERROR', rationale: 'Product is +12 but sum is −7.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Factorisation:', choices: [
        { text: '(x + 3)(x + 4)', isCorrect: true },
        { text: '(x − 3)(x − 4)', distractorType: 'CALC_ERROR', rationale: 'Negative roots — product OK but signs wrong.' },
        { text: '(x + 3)(x − 4)', distractorType: 'CALC_ERROR', rationale: 'Mixed signs give product = −12.' },
        { text: '(x + 6)(x + 2)', distractorType: 'CALC_ERROR', rationale: 'Sum = 8, not 7.' },
        { text: '(x + 7)(x + 12)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used coefficients themselves as roots.' },
      ]},
    ],
  },
  {
    source: '중3 · 좌표평면 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Distance between two points (x₁, y₁) and (x₂, y₂)?', choices: [
        { text: 'd = √[(x₂ − x₁)² + (y₂ − y₁)²]', isCorrect: true },
        { text: 'd = (x₂ − x₁) + (y₂ − y₁)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Linear sum, not Pythagorean.' },
        { text: 'd = |x₂ − x₁| · |y₂ − y₁|', distractorType: 'CONCEPT_CONFUSION', rationale: 'Product, not sum of squares.' },
        { text: 'd = √(x₂² + y₂²)', distractorType: 'PROCESS_SKIP', rationale: 'Used only the second point.' },
        { text: 'd = (x₂ − x₁)² + (y₂ − y₁)²', distractorType: 'PROCESS_SKIP', rationale: 'Forgot the square root.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Plug A(2, 3), B(5, 7):', choices: [
        { text: '√[(5−2)² + (7−3)²] = √(9 + 16)', isCorrect: true },
        { text: '√[(5+2)² + (7+3)²] = √(49 + 100)', distractorType: 'CALC_ERROR', rationale: 'Used sums instead of differences.' },
        { text: '(5 − 2) + (7 − 3) = 7', distractorType: 'CONCEPT_CONFUSION', rationale: 'Linear sum.' },
        { text: '√[(5−2) + (7−3)] = √7', distractorType: 'PROCESS_SKIP', rationale: 'Skipped the squaring.' },
        { text: '(5 − 2) · (7 − 3) = 12', distractorType: 'CONCEPT_CONFUSION', rationale: 'Product of legs, not hypotenuse.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Compute:', choices: [
        { text: '5', isCorrect: true },
        { text: '√25 = 5 (yes that\'s right)', distractorType: undefined, rationale: undefined as any },
        { text: '7', distractorType: 'CONCEPT_CONFUSION', rationale: 'Linear sum result.' },
        { text: '√25', distractorType: 'PROCESS_SKIP', rationale: 'Did not finish — √25 = 5.' },
        { text: '25', distractorType: 'PROCESS_SKIP', rationale: 'Forgot the square root.' },
      ]},
    ],
  },
  {
    source: '중3 · 이차함수 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'How do you compute p(2) for p(x) = 2x² − 3x − 2?', choices: [
        { text: 'Substitute x = 2 and simplify each term', isCorrect: true },
        { text: 'Divide p(x) by (x − 2)', distractorType: 'CONCEPT_CONFUSION', rationale: 'That gives the quotient, not p(2).' },
        { text: 'Take the coefficient of x²', distractorType: 'PROCESS_SKIP', rationale: 'Ignores other terms.' },
        { text: 'Set p(x) = 0 and solve', distractorType: 'CONCEPT_CONFUSION', rationale: 'Solving — different operation.' },
        { text: 'Multiply all coefficients by 2', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Random guess.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'After substituting x = 2:', choices: [
        { text: '2(2)² − 3(2) − 2 = 8 − 6 − 2', isCorrect: true },
        { text: '2(2) − 3(2) − 2 = 4 − 6 − 2', distractorType: 'CALC_ERROR', rationale: 'Did not square the 2.' },
        { text: '2(2)² − 3(2) − 2 = 8 + 6 − 2', distractorType: 'CALC_ERROR', rationale: 'Sign error on −3·2.' },
        { text: '2(4) − 3(2) − 2 = 6 − 2', distractorType: 'CALC_ERROR', rationale: 'Combined two subtractions wrong.' },
        { text: '2(2)² − 3(2) − 2 = 8 − 6', distractorType: 'PROCESS_SKIP', rationale: 'Forgot the −2 constant.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Therefore p(2) =', choices: [
        { text: '0', isCorrect: true },
        { text: '4', distractorType: 'CALC_ERROR', rationale: 'Subtraction error.' },
        { text: '-4', distractorType: 'CALC_ERROR', rationale: 'Sign error.' },
        { text: '12', distractorType: 'CALC_ERROR', rationale: 'Sum instead of mixed signs.' },
        { text: '6', distractorType: 'PROCESS_SKIP', rationale: 'Did not subtract last term.' },
      ]},
    ],
  },

  // ---- 고1 ----
  {
    source: '고1 · 나머지정리 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Remainder Theorem says:', choices: [
        { text: 'When p(x) is divided by (x − c), the remainder equals p(c)', isCorrect: true },
        { text: 'When p(x) is divided by (x − c), the remainder equals 0', distractorType: 'CONCEPT_CONFUSION', rationale: 'That is the Factor Theorem (a special case).' },
        { text: 'p(x) divided by x = c', distractorType: 'CONCEPT_CONFUSION', rationale: 'Phrasing confused.' },
        { text: 'Use long division — no shortcut exists', distractorType: 'PROCESS_SKIP', rationale: 'The Remainder Theorem IS the shortcut.' },
        { text: 'Plug x = 0', distractorType: 'CONCEPT_CONFUSION', rationale: 'That gives p(0), not the remainder by (x − c).' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'For p(x) = x³ − 3x² + 4 divided by (x − 2), compute p(2):', choices: [
        { text: '(2)³ − 3(2)² + 4 = 8 − 12 + 4', isCorrect: true },
        { text: '(2)³ − 3(2)² + 4 = 8 − 6 + 4', distractorType: 'CALC_ERROR', rationale: '3·(2)² should be 12, not 6.' },
        { text: '(2)³ − 3(2) + 4 = 8 − 6 + 4', distractorType: 'CALC_ERROR', rationale: 'Did not square the 2.' },
        { text: '(2)² − 3(2)² + 4', distractorType: 'CALC_ERROR', rationale: 'Wrong exponent on first term.' },
        { text: 'Plugged x = -2 by mistake', distractorType: 'CALC_ERROR', rationale: 'Sign of c flipped.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Therefore the remainder is:', choices: [
        { text: '0', isCorrect: true },
        { text: '4', distractorType: 'CALC_ERROR', rationale: 'Did not finish 8 − 12 + 4.' },
        { text: '8', distractorType: 'PROCESS_SKIP', rationale: 'Took only the first term.' },
        { text: '12', distractorType: 'CALC_ERROR', rationale: 'Sign or arithmetic error.' },
        { text: '-4', distractorType: 'CALC_ERROR', rationale: 'Wrong sign — 8 − 12 + 4 = 0.' },
      ]},
    ],
  },
  {
    source: '고1 · 이차방정식 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'To factorise x² − 4x − 5, look for two numbers that:', choices: [
        { text: 'Multiply to −5 and add to −4', isCorrect: true },
        { text: 'Multiply to −4 and add to −5', distractorType: 'CONCEPT_CONFUSION', rationale: 'Sum and product confused.' },
        { text: 'Multiply to 5 and add to −4', distractorType: 'CALC_ERROR', rationale: 'Sign of constant wrong.' },
        { text: 'Multiply to −5 and add to 4', distractorType: 'CALC_ERROR', rationale: 'Sign of linear coefficient wrong.' },
        { text: 'Use only the quadratic formula', distractorType: 'PROCESS_SKIP', rationale: 'Possible but factorisation works here cleanly.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Find p, q with pq = −5 and p + q = −4:', choices: [
        { text: 'p = -5, q = 1', isCorrect: true },
        { text: 'p = 5, q = -1', distractorType: 'CALC_ERROR', rationale: 'Sum is +4, not −4.' },
        { text: 'p = -5, q = -1', distractorType: 'CALC_ERROR', rationale: 'Product is +5, not −5.' },
        { text: 'p = -2, q = 2', distractorType: 'CALC_ERROR', rationale: 'Product is −4 and sum is 0.' },
        { text: 'p = 5, q = 1', distractorType: 'CALC_ERROR', rationale: 'Sum is 6, product +5.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'So the solutions are:', choices: [
        { text: 'x = 5 or x = -1', isCorrect: true },
        { text: 'x = -5 or x = 1', distractorType: 'CALC_ERROR', rationale: 'Signs flipped — must use opposite of p, q.' },
        { text: 'x = 5 or x = 1', distractorType: 'CALC_ERROR', rationale: 'Sign error on second root.' },
        { text: 'x = -5 or x = -1', distractorType: 'CALC_ERROR', rationale: 'Both signs wrong.' },
        { text: 'x = ±√5', distractorType: 'CONCEPT_CONFUSION', rationale: 'Confused with x² = 5 case.' },
      ]},
    ],
  },
  {
    source: '고1 · 좌표기하 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Midpoint formula:', choices: [
        { text: 'M = ((x₁ + x₂)/2, (y₁ + y₂)/2)', isCorrect: true },
        { text: 'M = (x₂ − x₁, y₂ − y₁)', distractorType: 'CONCEPT_CONFUSION', rationale: 'That is the displacement, not midpoint.' },
        { text: 'M = ((x₁ − x₂)/2, (y₁ − y₂)/2)', distractorType: 'CALC_ERROR', rationale: 'Used differences instead of sums.' },
        { text: 'M = (x₁ · x₂, y₁ · y₂)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Products are unrelated to midpoints.' },
        { text: 'Midpoint is always the origin', distractorType: 'TIME_PRESSURE_GUESS', rationale: 'Default guess.' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Plug A(-2, 4), B(6, -2):', choices: [
        { text: 'M = ((-2 + 6)/2, (4 + (-2))/2)', isCorrect: true },
        { text: 'M = ((-2 − 6)/2, (4 − 2)/2)', distractorType: 'CALC_ERROR', rationale: 'Used differences.' },
        { text: 'M = ((-2 · 6)/2, (4 · -2)/2)', distractorType: 'CONCEPT_CONFUSION', rationale: 'Multiplied instead of added.' },
        { text: 'M = ((-2 + 6), (4 + -2))', distractorType: 'PROCESS_SKIP', rationale: 'Forgot to divide by 2.' },
        { text: 'M = (4, 2)', distractorType: 'CALC_ERROR', rationale: 'Got numerator OK but skipped division.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Compute:', choices: [
        { text: '(2, 1)', isCorrect: true },
        { text: '(4, 2)', distractorType: 'PROCESS_SKIP', rationale: 'Did not divide by 2.' },
        { text: '(-4, 6)', distractorType: 'CALC_ERROR', rationale: 'Used differences.' },
        { text: '(2, -1)', distractorType: 'CALC_ERROR', rationale: 'Sign error in y-coordinate.' },
        { text: '(8, 2)', distractorType: 'CALC_ERROR', rationale: 'Used wrong arithmetic.' },
      ]},
    ],
  },
  {
    source: '고1 · 삼각비 · Q1',
    steps: [
      { stepIndex: 1, stepType: 'CONCEPT', prompt: 'Pythagorean identity:', choices: [
        { text: 'sin²θ + cos²θ = 1', isCorrect: true },
        { text: 'sin θ + cos θ = 1', distractorType: 'CONCEPT_CONFUSION', rationale: 'Forgot the squares.' },
        { text: 'sin²θ − cos²θ = 1', distractorType: 'CONCEPT_CONFUSION', rationale: 'Wrong sign — that is double-angle related.' },
        { text: 'sin²θ · cos²θ = 1', distractorType: 'CONCEPT_CONFUSION', rationale: 'Product instead of sum.' },
        { text: 'tan²θ = 1', distractorType: 'CONCEPT_CONFUSION', rationale: 'Different identity (tan²θ + 1 = sec²θ).' },
      ]},
      { stepIndex: 2, stepType: 'PROCESS', prompt: 'Given sin θ = 3/5, find cos²θ:', choices: [
        { text: 'cos²θ = 1 − (3/5)² = 1 − 9/25 = 16/25', isCorrect: true },
        { text: 'cos²θ = (3/5)² = 9/25', distractorType: 'CONCEPT_CONFUSION', rationale: 'Used sin²θ value as cos²θ.' },
        { text: 'cos²θ = 1 − 3/5 = 2/5', distractorType: 'PROCESS_SKIP', rationale: 'Did not square the sin value.' },
        { text: 'cos²θ = 1 + 9/25 = 34/25', distractorType: 'CALC_ERROR', rationale: 'Sign error — should subtract.' },
        { text: 'cos²θ = 25/9', distractorType: 'CALC_ERROR', rationale: 'Took reciprocal.' },
      ]},
      { stepIndex: 3, stepType: 'ANSWER', prompt: 'Take positive square root (acute angle):', choices: [
        { text: '4/5', isCorrect: true },
        { text: '√(16/25) = ±4/5 (no info to choose)', distractorType: 'PROCESS_SKIP', rationale: 'For an acute angle, cos θ > 0.' },
        { text: '16/25', distractorType: 'PROCESS_SKIP', rationale: 'Did not take square root.' },
        { text: '3/5', distractorType: 'CONCEPT_CONFUSION', rationale: 'That is sin θ, not cos θ.' },
        { text: '5/4', distractorType: 'CALC_ERROR', rationale: 'Took reciprocal of 4/5.' },
      ]},
    ],
  },
];

export async function seedSteps(prisma: PrismaClient, problemIdsBySource: Record<string, string>) {
  // SPEC_M1 is excluded from the Korea-first smoke seed because the demo
  // account starts at the high-school track.
  const ALL_SPEC = [...SPEC, ...SPEC_KR_REVIEW];

  // Wipe existing steps / choices so re-seeding starts clean.
  for (const spec of ALL_SPEC) {
    const pid = problemIdsBySource[spec.source];
    if (!pid) continue;
    // ProblemChoice is removed too via ProblemStep onDelete cascade.
    await prisma.problemStep.deleteMany({ where: { problemId: pid } });
  }

  let stepCount = 0;
  let choiceCount = 0;
  for (const spec of ALL_SPEC) {
    const pid = problemIdsBySource[spec.source];
    if (!pid) continue;
    for (const s of spec.steps) {
      const step = await prisma.problemStep.create({
        data: {
          problemId: pid,
          stepIndex: s.stepIndex,
          stepType: s.stepType as any,
          prompt: s.prompt,
        },
      });
      stepCount++;
      // Always emit 5 choices: pad short specs with a safe placeholder (rare).
      const rawChs = s.choices.slice(0, 5);
      while (rawChs.length < 5) rawChs.push({ text: '—', distractorType: 'TIME_PRESSURE_GUESS', rationale: '— (placeholder)' });
      // Deterministic shuffle on the correct-answer position, keyed by source + stepIndex.
      // The raw seed always lists the correct answer at index 1, so without a shuffle a student
      // could break the assessment by always picking choice 1.
      const chs = deterministicShuffle(rawChs, `${spec.source}::${s.stepIndex}`);
      for (let i = 0; i < chs.length; i++) {
        const c = chs[i];
        await prisma.problemChoice.create({
          data: {
            stepId: step.id,
            choiceIndex: i + 1,
            text: c.text,
            isCorrect: c.isCorrect ?? false,
            distractorType: (c.distractorType ?? null) as any,
            rationale: c.rationale ?? null,
          },
        });
        choiceCount++;
      }
    }
  }
  console.log(`  · ${stepCount} steps · ${choiceCount} choices seeded (across ${ALL_SPEC.length} problems)`);
}
