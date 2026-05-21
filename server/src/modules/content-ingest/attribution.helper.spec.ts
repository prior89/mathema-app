import {
  buildNcertAttribution,
  isAcceptableAttribution,
  parseSourceLabel,
} from './attribution.helper';

describe('attribution.helper', () => {
  describe('parseSourceLabel', () => {
    it('parses old-textbook AUTO label', () => {
      const r = parseSourceLabel('AUTO · CLASS_8 · Ch1 · Ex1.1 · Q1');
      expect(r).toEqual({ ncertClass: 8, chapter: 1, exerciseId: '1.1', qIndex: 1 });
    });

    it('parses new-textbook Figure it Out label', () => {
      const r = parseSourceLabel('AUTO · CLASS_7 · Ch6 · ExFIO-13 · Q3');
      expect(r).toEqual({ ncertClass: 7, chapter: 6, exerciseId: 'FIO-13', qIndex: 3 });
    });

    it('returns nulls when fields missing', () => {
      const r = parseSourceLabel('AUTO · ? · ? · ? · ?');
      expect(r).toEqual({ ncertClass: null, chapter: null, exerciseId: null, qIndex: null });
    });

    it('handles unusual order or extra tokens', () => {
      const r = parseSourceLabel('CLASS_12 something Ch7 noise Ex3.2 spam Q42 trailing');
      expect(r).toEqual({ ncertClass: 12, chapter: 7, exerciseId: '3.2', qIndex: 42 });
    });
  });

  describe('buildNcertAttribution', () => {
    it('produces canonical attribution for old textbook', () => {
      const s = buildNcertAttribution('AUTO · CLASS_10 · Ch1 · Ex1.1 · Q4');
      expect(s).toBe(
        'NCERT Class 10 Mathematics, Ch.1 Ex.1.1 Q.4 (derived for Matheo, Reprint 2024-25)',
      );
    });

    it('formats Figure it Out exercise id without Ex prefix duplication', () => {
      const s = buildNcertAttribution('AUTO · CLASS_7 · Ch1 · ExFIO-2 · Q1');
      expect(s).toBe(
        'NCERT Class 7 Mathematics, Ch.1 FIO-2 Q.1 (derived for Matheo, Reprint 2024-25)',
      );
    });

    it('returns null for incomplete labels', () => {
      expect(buildNcertAttribution('AUTO · ? · ? · ? · ?')).toBeNull();
      expect(buildNcertAttribution('')).toBeNull();
      expect(buildNcertAttribution('CLASS_8 only')).toBeNull();
    });
  });

  describe('isAcceptableAttribution', () => {
    it('accepts a full NCERT attribution', () => {
      expect(
        isAcceptableAttribution(
          'NCERT Class 10 Mathematics, Ch.1 Ex.1.1 Q.4 (derived for Matheo, Reprint 2024-25)',
        ),
      ).toBe(true);
    });

    it('accepts EBS-derived attribution', () => {
      expect(
        isAcceptableAttribution('EBS 수능특강 2024 problem 12 (derived for Matheo)'),
      ).toBe(true);
    });

    it('rejects bare sourceLabel', () => {
      expect(isAcceptableAttribution('AUTO · CLASS_8 · Ch1 · Ex1.1 · Q1')).toBe(false);
    });

    it('rejects empty / too short', () => {
      expect(isAcceptableAttribution('')).toBe(false);
      expect(isAcceptableAttribution('NCERT')).toBe(false);
    });

    it('rejects when "derived" missing', () => {
      expect(
        isAcceptableAttribution('NCERT Class 10 Mathematics, Ch.1 Ex.1.1 Q.4'),
      ).toBe(false);
    });

    it('rejects when textbook brand missing', () => {
      expect(
        isAcceptableAttribution('Some Mathematics problem (derived for Matheo)'),
      ).toBe(false);
    });
  });
});
