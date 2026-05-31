-- diag-prod-cn-ch4.sql
-- Run via: psql "<conn-string>" -f diag-prod-cn-ch4.sql
-- Purpose: verify whether Class 11 Complex Numbers chapter has 5 multi-step
-- problems and whether the on-screen problem's CONCEPT step has a correct
-- choice marked.

\echo '== A. Lesson + problem counts =='
SELECT
  cl.id,
  cl."chapterCode",
  cl."chapterNumber",
  cl."titleEn",
  (SELECT COUNT(*) FROM "Problem" WHERE "conceptLessonId" = cl.id) AS problem_count,
  (SELECT COUNT(*) FROM "Problem" p
     WHERE p."conceptLessonId" = cl.id
       AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId"=p.id AND s."stepIndex"=1)
       AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId"=p.id AND s."stepIndex"=2)
       AND EXISTS (SELECT 1 FROM "ProblemStep" s WHERE s."problemId"=p.id AND s."stepIndex"=3)
  ) AS multi_step_count
FROM "ConceptLesson" cl
WHERE cl."ncertClass" = 'CLASS_11'
  AND cl."titleEn" ILIKE 'Complex Numbers%';

\echo '== B. mastery* columns present on prod ConceptLesson? =='
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'ConceptLesson'
  AND column_name LIKE 'mastery%';

\echo '== C. On-screen problem body lookup =='
SELECT p.id, p.source, LEFT(p.body, 200) AS body_snippet
FROM "Problem" p
JOIN "ConceptLesson" cl ON p."conceptLessonId" = cl.id
WHERE cl."ncertClass" = 'CLASS_11'
  AND cl."titleEn" ILIKE 'Complex Numbers%'
  AND (
    p.body LIKE '%\frac{1}{5}%\frac{2}{5}%\frac{5}{2}%'
    OR p.body LIKE '%1/5%2/5%5/2%'
  );

\echo '== D. All steps + choices for that problem (if B returned exactly one row, this auto-targets it) =='
WITH t AS (
  SELECT p.id
  FROM "Problem" p
  JOIN "ConceptLesson" cl ON p."conceptLessonId" = cl.id
  WHERE cl."ncertClass" = 'CLASS_11'
    AND cl."titleEn" ILIKE 'Complex Numbers%'
    AND (
      p.body LIKE '%\frac{1}{5}%\frac{2}{5}%\frac{5}{2}%'
      OR p.body LIKE '%1/5%2/5%5/2%'
    )
  LIMIT 1
)
SELECT s."stepIndex", s."stepType",
       c."choiceIndex", c."isCorrect",
       LEFT(c.text, 120) AS choice_text
FROM "ProblemStep" s
JOIN "ProblemChoice" c ON c."stepId" = s.id
WHERE s."problemId" = (SELECT id FROM t)
ORDER BY s."stepIndex", c."choiceIndex";

\echo '== E. Per-step correct-choice marking integrity for THIS chapter =='
-- Sanity check: every multi-step problem should have exactly 1 isCorrect=t per step.
-- Rows here = problems missing or having extra correct marks.
WITH chap AS (
  SELECT id FROM "ConceptLesson"
  WHERE "ncertClass"='CLASS_11' AND "titleEn" ILIKE 'Complex Numbers%'
)
SELECT p.id,
       s."stepIndex", s."stepType",
       COUNT(*) FILTER (WHERE c."isCorrect") AS correct_marks,
       COUNT(*)                              AS total_choices
FROM "Problem" p
JOIN "ProblemStep" s ON s."problemId"=p.id
JOIN "ProblemChoice" c ON c."stepId"=s.id
WHERE p."conceptLessonId" IN (SELECT id FROM chap)
GROUP BY p.id, s."stepIndex", s."stepType"
HAVING COUNT(*) FILTER (WHERE c."isCorrect") <> 1
ORDER BY p.id, s."stepIndex";
