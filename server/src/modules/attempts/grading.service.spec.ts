import { GradingService, GradingSignals } from './grading.service';
import { ErrorCode, ErrorType } from '@prisma/client';

const base: GradingSignals = {
  isCorrect: false,
  distractorType: null,
  durationSec: 30,
  expectedTimeSec: 60,
  hintUsed: false,
  hintCount: 0,
  confidence: null,
  stepByStepInput: null,
  problemHasSteps: false,
};

describe('GradingService', () => {
  let svc: GradingService;
  beforeEach(() => { svc = new GradingService(); });

  it('returns empty codes + OTHER on correct attempt', () => {
    const r = svc.analyze({ ...base, isCorrect: true });
    expect(r.errorCodes).toEqual([]);
    expect(r.legacyErrorType).toBe(ErrorType.OTHER);
  });

  it('maps distractorType CONCEPT_CONFUSION → CON', () => {
    const r = svc.analyze({ ...base, distractorType: 'CONCEPT_CONFUSION' });
    expect(r.errorCodes).toContain(ErrorCode.CON);
    expect(r.legacyErrorType).toBe(ErrorType.CONCEPT_MISUNDERSTANDING);
  });

  it('maps distractorType CALC_ERROR → CALC', () => {
    const r = svc.analyze({ ...base, distractorType: 'CALC_ERROR' });
    expect(r.errorCodes).toContain(ErrorCode.CALC);
    expect(r.legacyErrorType).toBe(ErrorType.CALCULATION_MISTAKE);
  });

  it('maps distractorType PROCESS_SKIP → LOGIC', () => {
    const r = svc.analyze({ ...base, distractorType: 'PROCESS_SKIP' });
    expect(r.errorCodes).toContain(ErrorCode.LOGIC);
  });

  it('flags LOGIC when problem has steps but stepByStepInput is empty', () => {
    const r = svc.analyze({ ...base, problemHasSteps: true, stepByStepInput: [] });
    expect(r.errorCodes).toContain(ErrorCode.LOGIC);
  });

  it('does NOT flag LOGIC when stepByStepInput has entries', () => {
    const r = svc.analyze({ ...base, problemHasSteps: true, stepByStepInput: ['step1', 'step2'] });
    expect(r.errorCodes).not.toContain(ErrorCode.LOGIC);
  });

  it('flags CON when hint was used', () => {
    const r = svc.analyze({ ...base, hintUsed: true });
    expect(r.errorCodes).toContain(ErrorCode.CON);
  });

  it('flags CON on overconfident wrong (confidence >= 70)', () => {
    const r = svc.analyze({ ...base, confidence: 85 });
    expect(r.errorCodes).toContain(ErrorCode.CON);
  });

  it('does NOT flag CON on low confidence', () => {
    const r = svc.analyze({ ...base, confidence: 30 });
    expect(r.errorCodes).not.toContain(ErrorCode.CON);
  });

  it('fills in LOGIC on time overrun when no other code yet', () => {
    const r = svc.analyze({ ...base, durationSec: 200, expectedTimeSec: 60 });
    expect(r.errorCodes).toContain(ErrorCode.LOGIC);
  });

  it('falls back to TIME_SHORTAGE legacy type when only signal is duration > 240s', () => {
    const r = svc.analyze({ ...base, durationSec: 300, expectedTimeSec: null });
    expect(r.legacyErrorType).toBe(ErrorType.TIME_SHORTAGE);
  });

  it('falls back to CALCULATION_MISTAKE legacy type when no other signal fires', () => {
    const r = svc.analyze({ ...base });
    expect(r.errorCodes).toEqual([]);
    expect(r.legacyErrorType).toBe(ErrorType.CALCULATION_MISTAKE);
  });

  it('combines multiple signals (hint + overconfidence) into a single CON entry', () => {
    const r = svc.analyze({ ...base, hintUsed: true, confidence: 90 });
    const conCount = r.errorCodes.filter((c) => c === ErrorCode.CON).length;
    expect(conCount).toBe(1);
  });
});
