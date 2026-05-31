-- cleanup-stale-ai-solve.sql
-- A안: AI Solver로 업로드된 기존 문제들 (이전 gpt-4o 시절 잘못 풀린 것들)을
-- qualityStatus=EXCLUDED + 'STALE_LLM_OUTPUT' 플래그로 마크. 풀 추출 쿼리 +
-- Mastery canonical-20 후보 + Study 추천에서 자동으로 빠짐.
--
-- 왜 row 삭제 안 함:
--   ProblemChoice ← Attempt.choiceId FK 가 걸려있어 cascade-delete 시 학생
--   attempt 이력이 함께 날아감. 데이터 무결성 깨짐. 마크-하고-숨김이 안전.
--
-- 새 업로드는 이미 gemini-3.5-flash + multi-part-aware prompt 통해 들어가므로
-- 같은 문제 재발 0. 사용자가 같은 사진을 다시 업로드하면 새 정답으로 새 row
-- 생성됨 (기존 stale row는 그대로 EXCLUDED 상태).
--
-- Idempotent — 여러 번 돌려도 안전.

BEGIN;

WITH affected AS (
  SELECT id FROM "Problem"
  WHERE "source" LIKE 'AI Solve · %'
    AND ("qualityStatus" IS DISTINCT FROM 'EXCLUDED'
         OR NOT 'STALE_LLM_OUTPUT' = ANY(COALESCE("qualityCriticalFlags", ARRAY[]::TEXT[])))
)
UPDATE "Problem" p
SET
  "qualityStatus"        = 'EXCLUDED',
  "qualityCriticalFlags" = (
    SELECT ARRAY(
      SELECT DISTINCT unnest(
        array_append(COALESCE(p."qualityCriticalFlags", ARRAY[]::TEXT[]), 'STALE_LLM_OUTPUT')
      )
    )
  ),
  "qualityScoredAt" = COALESCE(p."qualityScoredAt", NOW()),
  "qualityModel"    = COALESCE(p."qualityModel", 'cleanup-2026-05-23')
FROM affected
WHERE p.id = affected.id;

-- Report
SELECT
  COUNT(*) FILTER (WHERE "source" LIKE 'AI Solve · %')                                                AS total_ai_solve,
  COUNT(*) FILTER (WHERE "source" LIKE 'AI Solve · %' AND "qualityStatus" = 'EXCLUDED')               AS now_excluded,
  COUNT(*) FILTER (
    WHERE "source" LIKE 'AI Solve · %'
      AND 'STALE_LLM_OUTPUT' = ANY(COALESCE("qualityCriticalFlags", ARRAY[]::TEXT[]))
  )                                                                                                    AS flagged_stale
FROM "Problem";

COMMIT;
