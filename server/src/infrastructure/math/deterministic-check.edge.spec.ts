import { DeterministicCheckService } from './deterministic-check.service';

describe('DeterministicCheckService — adversarial edge cases', () => {
  const svc = new DeterministicCheckService();

  describe('numeric edge cases', () => {
    it('zero coefficient linear: 0x = 5 returns null (degenerate)', () => {
      expect(svc.check('Solve 0x = 5', null)).toBeNull();
    });
    it('large fraction does not overflow', () => {
      const r = svc.check('Calculate 1000000/3', null);
      expect(r).not.toBeNull();
      expect(r!.answer).toBe('1000000/3');
    });
    it('negative percentage handles signs', () => {
      const r = svc.check('What is 25% of -80?', '-20');
      expect(r!.answer).toBe('-20');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('quadratic with repeated root', () => {
      const r = svc.check('Solve x^2 - 4x + 4 = 0', '2,2');
      expect(r!.answer).toBe('2, 2');
    });
    it('quadratic with irrational roots returns symbolic form', () => {
      const r = svc.check('Solve x^2 - 2 = 0', null);
      expect(r!.answer).toContain('sqrt');
    });
  });

  describe('text normalization', () => {
    it('handles unicode minus signs from PDF extraction', () => {
      const r = svc.check('Solve 2x − 4 = 6', '5'); // U+2212 MINUS SIGN
      expect(r!.answer).toBe('5');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('handles superscript exponents', () => {
      const r = svc.check('Solve x² - 5x + 6 = 0', '2,3');
      expect(r!.answer).toBe('2, 3');
    });
    it('matches answers with spaces around commas', () => {
      const r = svc.check('Solve x^2 - 5x + 6 = 0', '2 , 3');
      expect(r!.isStudentCorrect).toBe(true);
    });
    it('matches answers in different order', () => {
      const r = svc.check('Solve x^2 - 5x + 6 = 0', '3,2');
      expect(r!.isStudentCorrect).toBe(true);
    });
  });

  describe('parser robustness', () => {
    it('handles parentheses in problem text', () => {
      const r = svc.check('Find the remainder when (x^3 + 2x^2 - x + 1) is divided by x - 1', null);
      expect(r).not.toBeNull();
      expect(r!.answer).toBe('3');
    });
    it('rejects malformed expressions silently', () => {
      const r = svc.check('Solve x++++ = 5', null);
      expect(r).toBeNull();
    });
    it('returns null on multivariable expression', () => {
      const r = svc.check('Solve 2x + 3y = 10', null);
      expect(r).toBeNull();
    });
  });

  describe('false-positive guards', () => {
    it('does not match narrative text containing numbers', () => {
      const r = svc.check('Meteorological Department predicts weather by observing trends from the data over many years in the past.', null);
      expect(r).toBeNull();
    });
    it('does not match figure references', () => {
      const r = svc.check('Find m∠C in Fig 3.27 if AB DC', null);
      expect(r).toBeNull();
    });
    it('returns null on extraction debris', () => {
      const r = svc.check('Reprint 2026-27', null);
      expect(r).toBeNull();
    });
    it('does not falsely match when question contains an equals sign in different context', () => {
      const r = svc.check('Speed = 30 km/h, find the distance in 4 hours.', null);
      expect(r).toBeNull();
    });
  });

  describe('PDF extraction noise', () => {
    it('arithmetic check refuses chapter title in disguise', () => {
      const r = svc.check('Therefore, the numbers to be counted will be 7-digit only.', null);
      expect(r).toBeNull();
    });
    it('coordinate geometry returns null on garbled NCERT figure caption', () => {
      const r = svc.check('Find m∠C in Fig 3.27 if AB DC', null);
      expect(r).toBeNull();
    });
  });
});
