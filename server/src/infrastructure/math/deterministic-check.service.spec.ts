import { DeterministicCheckService } from './deterministic-check.service';

describe('DeterministicCheckService', () => {
  let svc: DeterministicCheckService;

  beforeEach(() => {
    svc = new DeterministicCheckService();
  });

  describe('remainder theorem', () => {
    it('computes f(2) for x^3 - 3x^2 + 4x - 7 divided by x - 2', () => {
      const r = svc.check('Find the remainder when x^3 - 3x^2 + 4x - 7 is divided by x - 2', '-3');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('remainder_theorem');
      expect(r!.answer).toBe('-3');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('flags incorrect student answer', () => {
      const r = svc.check('Find the remainder when x^3 - 3x^2 + 4x - 7 is divided by x - 2', '5');
      expect(r!.isStudentCorrect).toBe(false);
      expect(r!.mistakeDiagnosis).toContain('does not match');
    });
  });

  describe('linear equation', () => {
    it('solves 2x + 3 = 11', () => {
      const r = svc.check('Solve 2x + 3 = 11', '4');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('linear_equation');
      expect(r!.answer).toBe('4');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('handles fractional answers', () => {
      const r = svc.check('Solve 3x = 7', '7/3');
      expect(r!.answer).toBe('7/3');
      expect(r!.isStudentCorrect).toBe(true);
    });
  });

  describe('quadratic roots', () => {
    it('solves x^2 - 5x + 6 = 0', () => {
      const r = svc.check('Solve x^2 - 5x + 6 = 0', '2,3');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('quadratic_roots');
      expect(r!.answer).toBe('2, 3');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('detects no real roots', () => {
      const r = svc.check('Solve x^2 + 1 = 0', 'none');
      expect(r!.answer).toBe('no real roots');
    });
  });

  describe('percentage', () => {
    it('computes 20% of 150', () => {
      const r = svc.check('What is 20% of 150?', '30');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('percentage');
      expect(r!.answer).toBe('30');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('handles part-of-whole percent', () => {
      const r = svc.check('25 is what percent of 200', '12.5%');
      expect(r!.answer).toBe('25/2%');
    });
    it('handles increase by percent', () => {
      const r = svc.check('increase 80 by 25%', '100');
      expect(r!.answer).toBe('100');
      expect(r!.isStudentCorrect).toBe(true);
    });
  });

  describe('ratio and proportion', () => {
    it('divides 60 in ratio 2:3', () => {
      const r = svc.check('Divide 60 in the ratio 2:3', '24,36');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('ratio_proportion');
      expect(r!.answer).toBe('24, 36');
      expect(r!.isStudentCorrect).toBe(true);
    });
  });

  describe('coordinate geometry', () => {
    it('computes distance between (1,2) and (4,6)', () => {
      const r = svc.check('Find the distance between (1,2) and (4,6)', '5');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('coordinate_geometry_distance');
      expect(r!.answer).toBe('5');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('computes midpoint', () => {
      const r = svc.check('Find the midpoint of (2,4) and (6,8)', '(4,6)');
      expect(r!.answer).toBe('(4, 6)');
    });
    it('computes slope', () => {
      const r = svc.check('Find the slope between (0,0) and (3,6)', '2');
      expect(r!.answer).toBe('2');
      expect(r!.isStudentCorrect).toBe(true);
    });
  });

  describe('simplification', () => {
    it('simplifies polynomial 2x + 3x - 4 + 1', () => {
      const r = svc.check('Simplify: 2x + 3x - 4 + 1', '5x - 3');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('algebraic_simplification');
      expect(r!.answer).toBe('5x - 3');
    });
  });

  describe('arithmetic', () => {
    it('evaluates 1/2 + 3/4', () => {
      const r = svc.check('Calculate 1/2 + 3/4', '5/4');
      expect(r).not.toBeNull();
      expect(r!.checker).toBe('arithmetic');
      expect(r!.answer).toBe('5/4');
      expect(r!.isStudentCorrect).toBe(true);
    });
  });

  describe('returns null for unsupported questions', () => {
    it('returns null on natural language without pattern', () => {
      const r = svc.check('What is the capital of France?', null);
      expect(r).toBeNull();
    });
    it('returns null on integration', () => {
      const r = svc.check('Find the integral of sin(x) dx', null);
      expect(r).toBeNull();
    });
  });
});
