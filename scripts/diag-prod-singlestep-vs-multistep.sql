-- diag-prod-singlestep-vs-multistep.sql
-- Per-chapter single-step vs multi-step counts for Class 11/12.
-- Run via: psql "$(cat ~/.pgconn)" -f diag-prod-singlestep-vs-multistep.sql
-- Read-only. Same query for prod and local DB.

SELECT
  cl."ncertClass" AS class,
  cl."chapterNumber" AS ch,
  cl."titleEn",
  COUNT(*) FILTER (
    WHERE NOT EXISTS (
      SELECT 1 FROM "ProblemStep" s
      WHERE s."problemId" = p.id AND s."stepIndex" > 1
    )
  ) AS single_step,
  COUNT(*) FILTER (
    WHERE EXISTS (
      SELECT 1 FROM "ProblemStep" s
      WHERE s."problemId" = p.id AND s."stepIndex" > 1
    )
  ) AS multi_step,
  COUNT(p.id) AS total
FROM "ConceptLesson" cl
LEFT JOIN "Problem" p ON p."conceptLessonId" = cl.id
WHERE cl."ncertClass" IN ('CLASS_11','CLASS_12')
GROUP BY cl.id, cl."ncertClass", cl."chapterNumber", cl."titleEn"
ORDER BY single_step ASC, multi_step ASC
LIMIT 30;
