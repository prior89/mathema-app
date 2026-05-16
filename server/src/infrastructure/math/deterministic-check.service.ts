import { Injectable } from '@nestjs/common';
import Fraction from 'fraction.js';

export interface DeterministicResult {
  method: 'deterministic';
  answer: string;
  confidence: number;
  checker: string;
  concepts: string[];
  steps: string[];
  isStudentCorrect?: boolean | null;
  mistakeDiagnosis?: string | null;
}

type Polynomial = Map<number, Fraction>;

const ZERO = new Fraction(0);
const ONE = new Fraction(1);

@Injectable()
export class DeterministicCheckService {
  private readonly checkers: Array<
    (question: string, studentAnswer: string | null) => DeterministicResult | null
  > = [
    this.checkRemainderTheorem.bind(this),
    this.checkPolynomialSubstitution.bind(this),
    this.checkCoordinateGeometry.bind(this),
    this.checkQuadraticRoots.bind(this),
    this.checkLinearEquation.bind(this),
    this.checkPercentage.bind(this),
    this.checkRatioProportion.bind(this),
    this.checkSimplification.bind(this),
    this.checkArithmetic.bind(this),
  ];

  check(question: string, studentAnswer?: string | null): DeterministicResult | null {
    for (const checker of this.checkers) {
      const result = checker(question, studentAnswer ?? null);
      if (result !== null) return result;
    }
    return null;
  }

  private cleanQuestion(q: string): string {
    return q
      .replace(/[−–—]/g, '-')
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/²/g, '^2')
      .replace(/³/g, '^3')
      .trim();
  }

  private normalize(value: string | null | undefined): string {
    return String(value ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/,/g, '')
      .replace(/%/g, '')
      .replace(/\.0+$/g, '');
  }

  private formatFrac(value: Fraction): string {
    const n = value.n * value.s;
    if (value.d === 1) return String(n);
    return `${n}/${value.d}`;
  }

  private parseNumber(value: string): Fraction | null {
    const v = this.cleanQuestion(value).trim().replace(/\s+/g, '').replace(/\.$/, '');
    if (!v) return null;
    try {
      if (v.includes('/')) {
        const [n, d] = v.split('/');
        const ni = parseInt(n, 10);
        const di = parseInt(d, 10);
        if (Number.isNaN(ni) || Number.isNaN(di) || di === 0) return null;
        return new Fraction(ni, di);
      }
      return new Fraction(v);
    } catch {
      return null;
    }
  }

  private compareAnswers(expected: string, actual: string | null): boolean | null {
    if (actual === null || actual === undefined) return null;
    if (this.normalize(expected) === this.normalize(actual)) return true;

    const expectedValues = expected.split(/[,;]/).map((x) => x.trim()).filter(Boolean);
    const actualValues = actual.split(/[,;]/).map((x) => x.trim()).filter(Boolean);

    if (expectedValues.length > 1 || actualValues.length > 1) {
      const eNums = expectedValues.map((x) => this.parseNumber(x));
      const aNums = actualValues.map((x) => this.parseNumber(x));
      if (
        eNums.every((x) => x !== null) &&
        aNums.every((x) => x !== null) &&
        eNums.length === aNums.length
      ) {
        const sortKey = (f: Fraction) => Number(f.valueOf());
        const eSorted = [...(eNums as Fraction[])].sort((a, b) => sortKey(a) - sortKey(b));
        const aSorted = [...(aNums as Fraction[])].sort((a, b) => sortKey(a) - sortKey(b));
        return eSorted.every((v, i) => v.equals(aSorted[i]));
      }
      const eN = [...expectedValues.map((x) => this.normalize(x))].sort();
      const aN = [...actualValues.map((x) => this.normalize(x))].sort();
      return JSON.stringify(eN) === JSON.stringify(aN);
    }

    const eNum = this.parseNumber(expected);
    const aNum = this.parseNumber(actual);
    if (eNum !== null && aNum !== null) return eNum.equals(aNum);
    return false;
  }

  private withStudentCheck(
    result: DeterministicResult,
    studentAnswer: string | null,
  ): DeterministicResult {
    const correct = this.compareAnswers(result.answer, studentAnswer);
    result.isStudentCorrect = correct;
    if (correct === false) {
      result.mistakeDiagnosis =
        'The final value does not match the deterministic recomputation. Recheck signs, substitution, and arithmetic.';
    }
    return result;
  }

  // ===== Expression parser (recursive descent, replaces Python ast) =====
  // Grammar: expr = term ((+|-) term)*
  //          term = factor ((*|/) factor)*
  //          factor = unary ('^' unary)*    (right-associative)
  //          unary = ('-'|'+')? primary
  //          primary = NUMBER | IDENT | '(' expr ')'

  private addImplicitMultiplication(expr: string): string {
    let e = this.cleanQuestion(expr);
    // Karvy uses ^ -> ** (Python). Our parser handles ^ directly, keep it.
    // Insert * between number and identifier/paren, identifier/paren and identifier/paren.
    e = e.replace(/(\d)([a-zA-Z(])/g, '$1*$2');
    e = e.replace(/([a-zA-Z)])(\d)/g, '$1*$2');
    e = e.replace(/([a-zA-Z)])(\()/g, '$1*$2');
    e = e.replace(/(\))([a-zA-Z])/g, '$1*$2');
    return e;
  }

  private tokenize(expr: string): string[] {
    const tokens: string[] = [];
    let i = 0;
    while (i < expr.length) {
      const c = expr[i];
      if (/\s/.test(c)) {
        i++;
        continue;
      }
      if (/[0-9.]/.test(c)) {
        let j = i;
        while (j < expr.length && /[0-9.]/.test(expr[j])) j++;
        tokens.push(expr.slice(i, j));
        i = j;
      } else if (/[a-zA-Z]/.test(c)) {
        let j = i;
        while (j < expr.length && /[a-zA-Z]/.test(expr[j])) j++;
        tokens.push(expr.slice(i, j));
        i = j;
      } else if ('+-*/^()'.includes(c)) {
        tokens.push(c);
        i++;
      } else {
        throw new Error(`Unexpected character: ${c}`);
      }
    }
    return tokens;
  }

  // Generic parser returning AST as nested arrays/objects.
  // Node shapes: {n: Fraction} | {v: string} | {op: '+|-|*|/|^', l, r} | {u: '+|-', x}
  private parseExpr(tokens: string[]): any {
    let pos = 0;
    const peek = () => tokens[pos];
    const eat = (t?: string) => {
      if (t !== undefined && tokens[pos] !== t) throw new Error(`Expected ${t}, got ${tokens[pos]}`);
      return tokens[pos++];
    };

    const parsePrimary = (): any => {
      const t = peek();
      if (t === '(') {
        eat('(');
        const e = parseExpr();
        eat(')');
        return e;
      }
      if (/^[0-9.]/.test(t)) {
        eat();
        return { n: new Fraction(t) };
      }
      if (/^[a-zA-Z]/.test(t)) {
        eat();
        return { v: t };
      }
      throw new Error(`Unexpected token: ${t}`);
    };

    const parseUnary = (): any => {
      if (peek() === '+' || peek() === '-') {
        const u = eat();
        return { u, x: parseUnary() };
      }
      return parsePower();
    };

    const parsePower = (): any => {
      const base = parsePrimary();
      if (peek() === '^') {
        eat('^');
        return { op: '^', l: base, r: parseUnary() };
      }
      return base;
    };

    const parseTerm = (): any => {
      let left = parseUnary();
      while (peek() === '*' || peek() === '/') {
        const op = eat();
        const right = parseUnary();
        left = { op, l: left, r: right };
      }
      return left;
    };

    const parseExprInner = (): any => {
      let left = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = eat();
        const right = parseTerm();
        left = { op, l: left, r: right };
      }
      return left;
    };

    const parseExpr = parseExprInner;
    const result = parseExprInner();
    if (pos !== tokens.length) throw new Error(`Unexpected trailing tokens: ${tokens.slice(pos).join(' ')}`);
    return result;
  }

  // Evaluate AST as pure arithmetic (no variables).
  private evalArith(node: any): Fraction {
    if (node.n !== undefined) return node.n;
    if (node.v !== undefined) throw new Error('Variable in arithmetic');
    if (node.u !== undefined) {
      const x = this.evalArith(node.x);
      return node.u === '-' ? x.neg() : x;
    }
    const l = this.evalArith(node.l);
    const r = this.evalArith(node.r);
    switch (node.op) {
      case '+':
        return l.add(r);
      case '-':
        return l.sub(r);
      case '*':
        return l.mul(r);
      case '/':
        return l.div(r);
      case '^': {
        if (r.d !== 1) throw new Error('Fractional exponent unsupported');
        const exp = r.n * r.s;
        if (Math.abs(exp) > 12) throw new Error('Exponent too large');
        return l.pow(exp);
      }
    }
    throw new Error('Unknown op');
  }

  safeEvalArithmetic(expr: string): Fraction | null {
    const e = this.addImplicitMultiplication(expr);
    if (/[a-zA-Z]/.test(e)) return null;
    if (!/^[0-9+\-*/^().\s]+$/.test(e)) return null;
    try {
      const tokens = this.tokenize(e);
      const ast = this.parseExpr(tokens);
      return this.evalArith(ast);
    } catch {
      return null;
    }
  }

  // Evaluate AST as polynomial over single variable `variable`.
  private evalPoly(node: any, variable: string): Polynomial {
    if (node.n !== undefined) return new Map([[0, node.n]]);
    if (node.v !== undefined) {
      if (node.v !== variable) throw new Error('Unsupported variable');
      return new Map([[1, ONE]]);
    }
    if (node.u !== undefined) {
      const p = this.evalPoly(node.x, variable);
      if (node.u === '-') return new Map(Array.from(p.entries()).map(([d, c]) => [d, c.neg()]));
      return p;
    }
    const l = this.evalPoly(node.l, variable);
    const r = this.evalPoly(node.r, variable);
    switch (node.op) {
      case '+':
        return this.polyAdd(l, r);
      case '-':
        return this.polyAdd(
          l,
          new Map(Array.from(r.entries()).map(([d, c]) => [d, c.neg()])),
        );
      case '*':
        return this.polyMul(l, r);
      case '/': {
        if (r.size !== 1 || !r.has(0) || (r.get(0) as Fraction).equals(ZERO))
          throw new Error('Polynomial divisor must be non-zero constant');
        const divisor = r.get(0) as Fraction;
        return new Map(Array.from(l.entries()).map(([d, c]) => [d, c.div(divisor)]));
      }
      case '^': {
        if (r.size !== 1 || !r.has(0) || (r.get(0) as Fraction).d !== 1)
          throw new Error('Polynomial exponent must be integer constant');
        const exp = (r.get(0) as Fraction).n * (r.get(0) as Fraction).s;
        if (exp < 0 || exp > 8) throw new Error('Polynomial exponent unsupported');
        return this.polyPow(l, exp);
      }
    }
    throw new Error('Unknown op');
  }

  private polyAdd(a: Polynomial, b: Polynomial): Polynomial {
    const out = new Map(a);
    for (const [d, c] of b) {
      const cur = out.get(d) ?? ZERO;
      const sum = cur.add(c);
      if (sum.equals(ZERO)) out.delete(d);
      else out.set(d, sum);
    }
    return out;
  }

  private polyMul(a: Polynomial, b: Polynomial): Polynomial {
    const out: Polynomial = new Map();
    for (const [da, ca] of a) {
      for (const [db, cb] of b) {
        const key = da + db;
        const cur = out.get(key) ?? ZERO;
        const sum = cur.add(ca.mul(cb));
        if (sum.equals(ZERO)) out.delete(key);
        else out.set(key, sum);
      }
    }
    return out;
  }

  private polyPow(poly: Polynomial, exponent: number): Polynomial {
    let out: Polynomial = new Map([[0, ONE]]);
    for (let i = 0; i < exponent; i++) out = this.polyMul(out, poly);
    return out;
  }

  parsePolynomial(expr: string, variable = 'x'): Polynomial | null {
    const e = this.addImplicitMultiplication(expr);
    if (!/^[0-9a-zA-Z+\-*/^().\s]+$/.test(e)) return null;
    try {
      const tokens = this.tokenize(e);
      const ast = this.parseExpr(tokens);
      return this.evalPoly(ast, variable);
    } catch {
      return null;
    }
  }

  evalPolynomial(poly: Polynomial, xValue: Fraction): Fraction {
    let sum = ZERO;
    for (const [degree, coef] of poly) {
      sum = sum.add(coef.mul(xValue.pow(degree)));
    }
    return sum;
  }

  formatPolynomial(poly: Polynomial, variable = 'x'): string {
    if (poly.size === 0) return '0';
    const parts: string[] = [];
    const degrees = Array.from(poly.keys()).sort((a, b) => b - a);
    for (const degree of degrees) {
      const coef = poly.get(degree) as Fraction;
      const sign = coef.s < 0 ? '-' : '+';
      const absCoef = coef.abs();
      let body: string;
      if (degree === 0) {
        body = this.formatFrac(absCoef);
      } else if (degree === 1) {
        body = absCoef.equals(ONE) ? variable : `${this.formatFrac(absCoef)}${variable}`;
      } else {
        body = absCoef.equals(ONE)
          ? `${variable}^${degree}`
          : `${this.formatFrac(absCoef)}${variable}^${degree}`;
      }
      if (parts.length === 0) parts.push(sign === '-' ? `-${body}` : body);
      else parts.push(` ${sign} ${body}`);
    }
    return parts.join('');
  }

  private extractExpressionAfterKeywords(question: string, keywords: string[]): string | null {
    const q = this.cleanQuestion(question);
    for (const kw of keywords) {
      const re = new RegExp(`${kw}\\s*[:\\-]?\\s*(.+)`, 'i');
      const m = q.match(re);
      if (m) return m[1].trim().replace(/\?$/, '');
    }
    return null;
  }

  private isqrt(n: number): number {
    return Math.floor(Math.sqrt(n));
  }

  // ===== Checkers =====

  checkRemainderTheorem(question: string, studentAnswer: string | null): DeterministicResult | null {
    const q = this.cleanQuestion(question);
    const m = q.match(
      /(?:find\s+the\s+remainder\s+when\s+)?(.+?)\s+is\s+divided\s+by\s+x\s*([+-])\s*(\d+(?:\/\d+)?|\d+(?:\.\d+)?)/i,
    );
    if (!m) return null;
    const polyText = m[1].trim().replace(/^find\s+the\s+remainder\s+when\s+/i, '');
    const sign = m[2];
    const n = this.parseNumber(m[3]);
    if (n === null) return null;
    const xValue = sign === '-' ? n : n.neg();
    const poly = this.parsePolynomial(polyText);
    if (poly === null) return null;
    const value = this.evalPolynomial(poly, xValue);
    return this.withStudentCheck(
      {
        method: 'deterministic',
        answer: this.formatFrac(value),
        confidence: 1.0,
        checker: 'remainder_theorem',
        concepts: ['Remainder theorem', 'Polynomial substitution'],
        steps: [
          `For divisor x ${sign} ${m[3]}, use x = ${this.formatFrac(xValue)}.`,
          `Evaluate f(${this.formatFrac(xValue)}) for ${this.formatPolynomial(poly)}.`,
          `The remainder is ${this.formatFrac(value)}.`,
        ],
      },
      studentAnswer,
    );
  }

  checkPolynomialSubstitution(question: string, studentAnswer: string | null): DeterministicResult | null {
    const q = this.cleanQuestion(question);
    const patterns = [
      /(?:find|calculate|evaluate)\s+(?:the\s+value\s+of\s+)?(?:the\s+polynomial\s+)?(.+?)\s+(?:when|at|for)\s+x\s*=\s*([+-]?\d+(?:\/\d+)?|[+-]?\d+(?:\.\d+)?)/i,
      /f\(x\)\s*=\s*(.+?)\s*,?\s*(?:find|calculate|evaluate)\s+f\(\s*([+-]?\d+(?:\/\d+)?|[+-]?\d+(?:\.\d+)?)\s*\)/i,
    ];
    for (const re of patterns) {
      const m = q.match(re);
      if (!m) continue;
      const polyText = m[1].trim();
      const xValue = this.parseNumber(m[2]);
      if (xValue === null) continue;
      const poly = this.parsePolynomial(polyText);
      if (poly === null) continue;
      const value = this.evalPolynomial(poly, xValue);
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer: this.formatFrac(value),
          confidence: 1.0,
          checker: 'polynomial_substitution',
          concepts: ['Polynomial substitution'],
          steps: [
            `Substitute x = ${this.formatFrac(xValue)} into ${this.formatPolynomial(poly)}.`,
            `The value is ${this.formatFrac(value)}.`,
          ],
        },
        studentAnswer,
      );
    }
    return null;
  }

  checkLinearEquation(question: string, studentAnswer: string | null): DeterministicResult | null {
    let q = this.cleanQuestion(question).replace(/\?$/, '');
    if (!q.includes('=')) return null;
    if (/\bx\^?2\b|\*\*2/.test(q)) return null;
    q = q.replace(/^(solve|find\s+x|find\s+the\s+value\s+of\s+x)\s*[:\-]?\s*/i, '');
    const parts = q.split('=');
    if (parts.length !== 2) return null;
    const left = this.parsePolynomial(parts[0]);
    const right = this.parsePolynomial(parts[1]);
    if (left === null || right === null) return null;
    const maxDeg = (p: Polynomial) => (p.size ? Math.max(...p.keys()) : 0);
    if (maxDeg(left) > 1 || maxDeg(right) > 1) return null;
    const a = (left.get(1) ?? ZERO).sub(right.get(1) ?? ZERO);
    const b = (right.get(0) ?? ZERO).sub(left.get(0) ?? ZERO);
    if (a.equals(ZERO)) return null;
    const x = b.div(a);
    return this.withStudentCheck(
      {
        method: 'deterministic',
        answer: this.formatFrac(x),
        confidence: 0.98,
        checker: 'linear_equation',
        concepts: ['Linear equations'],
        steps: [
          'Collect x terms on one side and constants on the other side.',
          `Solve ${this.formatFrac(a)}x = ${this.formatFrac(b)}.`,
          `x = ${this.formatFrac(x)}.`,
        ],
      },
      studentAnswer,
    );
  }

  checkQuadraticRoots(question: string, studentAnswer: string | null): DeterministicResult | null {
    let q = this.cleanQuestion(question).replace(/\?$/, '');
    if (!/(solve|roots|zeroes|zeros)/i.test(q)) return null;
    if (!q.includes('=')) return null;
    q = q.replace(
      /^(solve|find\s+the\s+roots\s+of|find\s+roots\s+of|find\s+the\s+zeroes\s+of|find\s+the\s+zeros\s+of)\s*[:\-]?\s*/i,
      '',
    );
    const [leftText, rightText] = q.split('=');
    const left = this.parsePolynomial(leftText);
    const right = this.parsePolynomial(rightText);
    if (left === null || right === null) return null;
    const negRight = new Map(Array.from(right.entries()).map(([d, c]) => [d, c.neg()] as [number, Fraction]));
    const poly = this.polyAdd(left, negRight);
    if ((poly.size ? Math.max(...poly.keys()) : 0) !== 2) return null;
    const a = poly.get(2) ?? ZERO;
    const b = poly.get(1) ?? ZERO;
    const c = poly.get(0) ?? ZERO;
    if (a.equals(ZERO)) return null;
    const disc = b.mul(b).sub(a.mul(c).mul(4));
    let answer: string;
    let steps: string[];
    if (disc.s < 0) {
      answer = 'no real roots';
      steps = [
        `Compare with ax^2 + bx + c = 0: a = ${this.formatFrac(a)}, b = ${this.formatFrac(b)}, c = ${this.formatFrac(c)}.`,
        `Discriminant D = b^2 - 4ac = ${this.formatFrac(disc)}.`,
        'Since D < 0, there are no real roots.',
      ];
    } else {
      const sqrtDisc = disc.d === 1 ? this.isqrt(disc.n * disc.s) : null;
      if (sqrtDisc !== null && sqrtDisc * sqrtDisc === disc.n * disc.s) {
        const sd = new Fraction(sqrtDisc);
        const twoA = a.mul(2);
        const r1 = b.neg().add(sd).div(twoA);
        const r2 = b.neg().sub(sd).div(twoA);
        const roots = [r1, r2].sort((x, y) => Number(x.valueOf()) - Number(y.valueOf()));
        answer = roots.map((r) => this.formatFrac(r)).join(', ');
        steps = [
          `Compare with ax^2 + bx + c = 0: a = ${this.formatFrac(a)}, b = ${this.formatFrac(b)}, c = ${this.formatFrac(c)}.`,
          `Discriminant D = ${this.formatFrac(disc)}.`,
          `Use x = (-b ± sqrt(D))/(2a), so roots are ${answer}.`,
        ];
      } else {
        answer = `(${this.formatFrac(b.neg())} ± sqrt(${this.formatFrac(disc)}))/${this.formatFrac(a.mul(2))}`;
        steps = [
          `Compare with ax^2 + bx + c = 0: a = ${this.formatFrac(a)}, b = ${this.formatFrac(b)}, c = ${this.formatFrac(c)}.`,
          `Discriminant D = ${this.formatFrac(disc)}.`,
          `Use x = (-b ± sqrt(D))/(2a), giving ${answer}.`,
        ];
      }
    }
    return this.withStudentCheck(
      {
        method: 'deterministic',
        answer,
        confidence: 0.96,
        checker: 'quadratic_roots',
        concepts: ['Quadratic equations', 'Quadratic formula'],
        steps,
      },
      studentAnswer,
    );
  }

  checkPercentage(question: string, studentAnswer: string | null): DeterministicResult | null {
    const q = this.cleanQuestion(question).toLowerCase().replace(/\?$/, '');

    let m = q.match(/(?:what\s+is|find|calculate)?\s*([+-]?\d+(?:\.\d+)?)\s*%\s+of\s+([+-]?\d+(?:\.\d+)?)/);
    if (m) {
      const pct = new Fraction(m[1]);
      const base = new Fraction(m[2]);
      const value = pct.mul(base).div(100);
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer: this.formatFrac(value),
          confidence: 1.0,
          checker: 'percentage',
          concepts: ['Percentages'],
          steps: [
            `${this.formatFrac(pct)}% of ${this.formatFrac(base)} = (${this.formatFrac(pct)}/100) × ${this.formatFrac(base)}.`,
            `Answer = ${this.formatFrac(value)}.`,
          ],
        },
        studentAnswer,
      );
    }

    m = q.match(/([+-]?\d+(?:\.\d+)?)\s+is\s+what\s+percent\s+of\s+([+-]?\d+(?:\.\d+)?)/);
    if (m) {
      const part = new Fraction(m[1]);
      const whole = new Fraction(m[2]);
      if (whole.equals(ZERO)) return null;
      const value = part.mul(100).div(whole);
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer: `${this.formatFrac(value)}%`,
          confidence: 1.0,
          checker: 'percentage',
          concepts: ['Percentages'],
          steps: [
            `Percent = part/whole × 100 = ${this.formatFrac(part)}/${this.formatFrac(whole)} × 100.`,
            `Answer = ${this.formatFrac(value)}%.`,
          ],
        },
        studentAnswer,
      );
    }

    m = q.match(/(increase|decrease)\s+([+-]?\d+(?:\.\d+)?)\s+by\s+([+-]?\d+(?:\.\d+)?)\s*%/);
    if (m) {
      const direction = m[1];
      const base = new Fraction(m[2]);
      const pct = new Fraction(m[3]);
      const change = base.mul(pct).div(100);
      const value = direction === 'increase' ? base.add(change) : base.sub(change);
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer: this.formatFrac(value),
          confidence: 1.0,
          checker: 'percentage',
          concepts: ['Percentages'],
          steps: [
            `Change = ${this.formatFrac(pct)}% of ${this.formatFrac(base)} = ${this.formatFrac(change)}.`,
            `After ${direction}, answer = ${this.formatFrac(value)}.`,
          ],
        },
        studentAnswer,
      );
    }
    return null;
  }

  checkRatioProportion(question: string, studentAnswer: string | null): DeterministicResult | null {
    const q = this.cleanQuestion(question).toLowerCase().replace(/\?$/, '');

    let m = q.match(/divide\s+([+-]?\d+(?:\.\d+)?)\s+(?:in|into)\s+(?:the\s+)?ratio\s+(\d+)\s*:\s*(\d+)/);
    if (m) {
      const total = new Fraction(m[1]);
      const a = new Fraction(m[2]);
      const b = new Fraction(m[3]);
      const first = total.mul(a).div(a.add(b));
      const second = total.mul(b).div(a.add(b));
      const answer = `${this.formatFrac(first)}, ${this.formatFrac(second)}`;
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer,
          confidence: 0.98,
          checker: 'ratio_proportion',
          concepts: ['Ratio and proportion'],
          steps: [
            `Total ratio parts = ${this.formatFrac(a)} + ${this.formatFrac(b)} = ${this.formatFrac(a.add(b))}.`,
            `Parts are ${answer}.`,
          ],
        },
        studentAnswer,
      );
    }

    m = q.match(/ratio\s+of\s+([+-]?\d+(?:\.\d+)?)\s+(?:and|to)\s+([+-]?\d+(?:\.\d+)?)/);
    if (m) {
      const a = new Fraction(m[1]);
      const b = new Fraction(m[2]);
      if (b.equals(ZERO)) return null;
      const leftRaw = Math.abs(a.n * b.d);
      const rightRaw = Math.abs(b.n * a.d);
      const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
      const common = gcd(leftRaw, rightRaw);
      const answer = `${Math.floor(leftRaw / common)}:${Math.floor(rightRaw / common)}`;
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer,
          confidence: 0.95,
          checker: 'ratio_proportion',
          concepts: ['Ratio and proportion'],
          steps: [
            `Write the ratio as ${this.formatFrac(a)}:${this.formatFrac(b)}.`,
            `Simplify to ${answer}.`,
          ],
        },
        studentAnswer,
      );
    }

    m = q.match(/(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)\s*=\s*(\d+(?:\.\d+)?)\s*:\s*x/);
    if (m) {
      const a = new Fraction(m[1]);
      const b = new Fraction(m[2]);
      const c = new Fraction(m[3]);
      if (a.equals(ZERO)) return null;
      const x = b.mul(c).div(a);
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer: this.formatFrac(x),
          confidence: 0.98,
          checker: 'ratio_proportion',
          concepts: ['Ratio and proportion'],
          steps: [
            `For ${this.formatFrac(a)}:${this.formatFrac(b)} = ${this.formatFrac(c)}:x, use a/b = c/x.`,
            `x = b × c / a = ${this.formatFrac(x)}.`,
          ],
        },
        studentAnswer,
      );
    }
    return null;
  }

  private parsePoint(text: string): [Fraction, Fraction] | null {
    const m = text.match(
      /\(\s*([+-]?\d+(?:\/\d+)?|[+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\/\d+)?|[+-]?\d+(?:\.\d+)?)\s*\)/,
    );
    if (!m) return null;
    const x = this.parseNumber(m[1]);
    const y = this.parseNumber(m[2]);
    if (x === null || y === null) return null;
    return [x, y];
  }

  checkCoordinateGeometry(question: string, studentAnswer: string | null): DeterministicResult | null {
    const q = this.cleanQuestion(question).toLowerCase();
    const ptRe = /\(\s*[+-]?\d+(?:\/\d+)?(?:\.\d+)?\s*,\s*[+-]?\d+(?:\/\d+)?(?:\.\d+)?\s*\)/g;
    const points = q.match(ptRe);
    if (!points || points.length < 2) return null;
    const p1 = this.parsePoint(points[0]);
    const p2 = this.parsePoint(points[1]);
    if (p1 === null || p2 === null) return null;
    const [x1, y1] = p1;
    const [x2, y2] = p2;

    if (q.includes('midpoint') || q.includes('mid point')) {
      const mx = x1.add(x2).div(2);
      const my = y1.add(y2).div(2);
      const answer = `(${this.formatFrac(mx)}, ${this.formatFrac(my)})`;
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer,
          confidence: 1.0,
          checker: 'coordinate_geometry_midpoint',
          concepts: ['Coordinate geometry', 'Midpoint formula'],
          steps: ['Midpoint = ((x1 + x2)/2, (y1 + y2)/2).', `Answer = ${answer}.`],
        },
        studentAnswer,
      );
    }

    if (q.includes('slope') || q.includes('gradient')) {
      const dx = x2.sub(x1);
      const dy = y2.sub(y1);
      const answer = dx.equals(ZERO) ? 'undefined' : this.formatFrac(dy.div(dx));
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer,
          confidence: 1.0,
          checker: 'coordinate_geometry_slope',
          concepts: ['Coordinate geometry', 'Slope'],
          steps: ['Slope = (y2 - y1)/(x2 - x1).', `Answer = ${answer}.`],
        },
        studentAnswer,
      );
    }

    if (q.includes('distance')) {
      const dx = x2.sub(x1);
      const dy = y2.sub(y1);
      const square = dx.mul(dx).add(dy.mul(dy));
      let answer: string;
      const sqN = square.n * square.s;
      if (square.d === 1 && this.isqrt(sqN) * this.isqrt(sqN) === sqN) {
        answer = String(this.isqrt(sqN));
      } else {
        answer = `sqrt(${this.formatFrac(square)})`;
      }
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer,
          confidence: 1.0,
          checker: 'coordinate_geometry_distance',
          concepts: ['Coordinate geometry', 'Distance formula'],
          steps: [
            'Distance = sqrt((x2 - x1)^2 + (y2 - y1)^2).',
            `Answer = ${answer}.`,
          ],
        },
        studentAnswer,
      );
    }
    return null;
  }

  checkSimplification(question: string, studentAnswer: string | null): DeterministicResult | null {
    const expr = this.extractExpressionAfterKeywords(question, ['simplify', 'expand']);
    if (!expr || expr.includes('=')) return null;
    if (/[a-zA-Z]/.test(expr)) {
      const poly = this.parsePolynomial(expr);
      if (poly === null) return null;
      const answer = this.formatPolynomial(poly);
      return this.withStudentCheck(
        {
          method: 'deterministic',
          answer,
          confidence: 0.92,
          checker: 'algebraic_simplification',
          concepts: ['Simplification', 'Algebraic expressions'],
          steps: ['Combine like terms and simplify coefficients.', `Answer = ${answer}.`],
        },
        studentAnswer,
      );
    }
    const value = this.safeEvalArithmetic(expr);
    if (value === null) return null;
    return this.withStudentCheck(
      {
        method: 'deterministic',
        answer: this.formatFrac(value),
        confidence: 1.0,
        checker: 'arithmetic_simplification',
        concepts: ['Arithmetic', 'Simplification'],
        steps: [`Evaluate the expression ${expr}.`, `Answer = ${this.formatFrac(value)}.`],
      },
      studentAnswer,
    );
  }

  checkArithmetic(question: string, studentAnswer: string | null): DeterministicResult | null {
    const q = this.cleanQuestion(question);
    if (q.includes('=')) return null;
    let expr = this.extractExpressionAfterKeywords(q, ['calculate', 'evaluate', 'find', 'what is']);
    if (!expr) expr = q;
    expr = expr.trim().replace(/\?$/, '');
    if (/[a-zA-Z%]/.test(expr)) return null;
    const value = this.safeEvalArithmetic(expr);
    if (value === null) return null;
    return this.withStudentCheck(
      {
        method: 'deterministic',
        answer: this.formatFrac(value),
        confidence: 1.0,
        checker: 'arithmetic',
        concepts: ['Arithmetic', 'Fractions'],
        steps: [`Evaluate ${expr}.`, `Answer = ${this.formatFrac(value)}.`],
      },
      studentAnswer,
    );
  }
}
