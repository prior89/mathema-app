-- diag-prod-broken-math.sql
-- Read-only survey: how many Problem rows have math expressions in plain
-- text (caret, **, unicode superscript) WITHOUT LaTeX delimiters.
-- Run via: psql "$(cat ~/.pgconn)" -f diag-prod-broken-math.sql

\echo '== 1. Total problems =='
SELECT COUNT(*) AS total_problems FROM "Problem";

\echo ''
\echo '== 2. Body has caret math ( x^2, e^x, etc.) =='
-- Flag: body contains caret followed by digit/letter/paren (not escaped)
-- Subset: AND body has no $...$ delimiters anywhere
SELECT
  COUNT(*) FILTER (WHERE body ~ '[A-Za-z0-9)]\^[0-9A-Za-z{(]')                                       AS has_caret,
  COUNT(*) FILTER (WHERE body ~ '[A-Za-z0-9)]\^[0-9A-Za-z{(]' AND body !~ '\$.+\$')                  AS caret_no_dollar,
  COUNT(*) FILTER (WHERE body ~ '[A-Za-z0-9)]\^[0-9A-Za-z{(]' AND body !~ '\$.+\$' AND body !~ '\\\(.+\\\)') AS caret_no_any_delim
FROM "Problem";

\echo ''
\echo '== 3. Body has Python-style power ** =='
SELECT COUNT(*) FROM "Problem" WHERE body ~ '\*\*[0-9]';

\echo ''
\echo '== 4. Body has Unicode superscript (²³⁴ etc.) =='
SELECT COUNT(*) FROM "Problem" WHERE body ~ '[²³⁴⁵⁶⁷⁸⁹⁰¹]';

\echo ''
\echo '== 5. Same checks on ProblemChoice.text =='
SELECT
  COUNT(*) FILTER (WHERE c.text ~ '[A-Za-z0-9)]\^[0-9A-Za-z{(]' AND c.text !~ '\$.+\$' AND c.text !~ '\\\(.+\\\)') AS choices_caret_no_delim,
  COUNT(*) FILTER (WHERE c.text ~ '\*\*[0-9]')                                                                      AS choices_python_power,
  COUNT(*) FILTER (WHERE c.text ~ '[²³⁴⁵⁶⁷⁸⁹⁰¹]')                                                                  AS choices_unicode_sup
FROM "ProblemChoice" c;

\echo ''
\echo '== 6. 20 sample broken bodies (first 200 chars) =='
SELECT p.id, LEFT(p.body, 200) AS body_snippet
FROM "Problem" p
WHERE p.body ~ '[A-Za-z0-9)]\^[0-9A-Za-z{(]'
  AND p.body !~ '\$.+\$'
  AND p.body !~ '\\\(.+\\\)'
LIMIT 20;

\echo ''
\echo '== 7. Per-chapter breakdown of broken bodies =='
SELECT
  cl."ncertClass", cl."chapterNumber", cl."titleEn",
  COUNT(*) AS broken_count
FROM "Problem" p
JOIN "ConceptLesson" cl ON p."conceptLessonId" = cl.id
WHERE p.body ~ '[A-Za-z0-9)]\^[0-9A-Za-z{(]'
  AND p.body !~ '\$.+\$'
  AND p.body !~ '\\\(.+\\\)'
GROUP BY cl.id, cl."ncertClass", cl."chapterNumber", cl."titleEn"
HAVING COUNT(*) > 0
ORDER BY broken_count DESC
LIMIT 20;
