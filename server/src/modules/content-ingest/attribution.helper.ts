/**
 * Attribution helpers — produce a license-safe Problem.source string for every
 * published Problem derived from a copyrighted textbook (NCERT, EBS, etc.).
 *
 * NCERT textbooks are copyright-protected — commercial republication is not
 * permitted, but derivative works that transform the source (e.g. NCERT
 * problem -> 3-step MC with distractors) are generally accepted *provided
 * attribution is preserved*. Every published Problem must carry the chain
 * back to its original source.
 *
 * Source label format produced by ContentIngestService.draftAll():
 *   "AUTO · CLASS_8 · Ch1 · Ex1.1 · Q1"            (PDF / MMD adapters)
 *   "AUTO · CLASS_7 · Ch6 · ExFIO-13 · Q3"         (Ganita Prakash new textbook)
 *   "AUTO · ? · ? · ? · ?"                         (unmatched — reject)
 *
 * We parse this into a canonical, human-readable attribution string saved
 * to Problem.source.
 */

export type ParsedSourceLabel = {
  ncertClass: number | null;
  chapter: number | null;
  exerciseId: string | null;
  qIndex: number | null;
};

const NCERT_REPRINT_YEAR = '2024-25';

/** Parse the AUTO sourceLabel produced by ContentIngestService.draftAll(). */
export function parseSourceLabel(label: string): ParsedSourceLabel {
  const out: ParsedSourceLabel = { ncertClass: null, chapter: null, exerciseId: null, qIndex: null };
  const cls = label.match(/CLASS_(\d+)/);
  if (cls) out.ncertClass = parseInt(cls[1], 10);
  const ch = label.match(/\bCh(\d+)\b/);
  if (ch) out.chapter = parseInt(ch[1], 10);
  // Exercise can be "Ex1.1" (old textbook) or "ExFIO-13" / "ExTRY-4" (new textbook)
  const ex = label.match(/\bEx([A-Za-z\d.\-]+)/);
  if (ex) out.exerciseId = ex[1];
  const q = label.match(/\bQ(\d+)/);
  if (q) out.qIndex = parseInt(q[1], 10);
  return out;
}

/**
 * Build a license-safe attribution string for Problem.source.
 *
 * Two precision tiers:
 *   - full   : class + chapter + exerciseId + qIndex are all known
 *              → "NCERT Class 10 Mathematics, Ch.1 Ex.1.1 Q.4 (derived ...)"
 *   - chapter: only class + chapter are known (e.g. Grade 9 Ganita Manjari
 *              inline narrative activities surfaced by the LLM extractor)
 *              → "NCERT Class 9 Mathematics, Ch.1 inline activity (derived ...)"
 *
 * Returns null only when even class+chapter are missing — caller MUST reject
 * the publish operation so a reviewer can supply manual attribution.
 */
export function buildNcertAttribution(label: string): string | null {
  const p = parseSourceLabel(label);
  if (p.ncertClass === null || p.chapter === null) return null;

  if (p.exerciseId && p.qIndex !== null) {
    const exDisplay = /^\d+\.\d+/.test(p.exerciseId) ? `Ex.${p.exerciseId}` : p.exerciseId;
    return `NCERT Class ${p.ncertClass} Mathematics, Ch.${p.chapter} ${exDisplay} Q.${p.qIndex} (derived for Matheo, Reprint ${NCERT_REPRINT_YEAR})`;
  }
  return `NCERT Class ${p.ncertClass} Mathematics, Ch.${p.chapter} inline activity (derived for Matheo, Reprint ${NCERT_REPRINT_YEAR})`;
}

/**
 * Validate that an arbitrary attribution string is acceptable for publish.
 * Required substrings: a textbook brand (NCERT|EBS|CBSE|...) and a "(derived ...)" tail.
 */
export function isAcceptableAttribution(source: string): boolean {
  if (!source || source.length < 20) return false;
  if (!/\bNCERT|EBS|CBSE|ICSE\b/i.test(source)) return false;
  if (!/\(derived\b/i.test(source)) return false;
  return true;
}
