#!/usr/bin/env bash
# prod-inventory.sh — read-only snapshot of the live deployment.
# Run from Azure Cloud Shell where ~/.pgconn has the prod Postgres DSN.
#
# Output is meant to be copy-pasted back to the operator. Nothing here
# mutates state.
#
# Usage:
#   bash prod-inventory.sh
#
# Prereqs:
#   - Logged into az with read access on RG mathema-prod-cin
#   - ~/.pgconn contains the Postgres connection string
set -euo pipefail

RG=mathema-prod-cin
APP=mathema-backend
KV=mathema-kv-7ehvzq

echo "===== 1. Prod backend image (commit SHA tag is the suffix) ====="
az containerapp show \
  --name "$APP" \
  --resource-group "$RG" \
  --query "properties.template.containers[0].image" \
  -o tsv 2>&1 || echo "[az error]"

echo ""
echo "===== 2. Prod backend active revisions ====="
az containerapp revision list \
  --name "$APP" \
  --resource-group "$RG" \
  --query "[?properties.active].{name:name, fqdn:properties.fqdn, image:properties.template.containers[0].image, createdAt:properties.createdTime, trafficWeight:properties.trafficWeight}" \
  -o table 2>&1 || echo "[az error]"

echo ""
echo "===== 3. Prod frontend (SWA) build provenance ====="
# SWA doesn't expose 'commit SHA of last deploy' directly; we approximate via
# the last successful frontend-deploy.yml run. Operator should run gh from
# their workstation; we just point to the right query here.
az staticwebapp list --resource-group "$RG" --query "[].{name:name, defaultHostname:defaultHostname}" -o table 2>&1 || echo "[az error]"

echo ""
echo "===== 4. Prod DB migration head + total applied count ====="
psql "$(cat ~/.pgconn)" -At -c "SELECT migration_name, finished_at FROM \"_prisma_migrations\" ORDER BY finished_at DESC NULLS LAST LIMIT 5;" 2>&1 || echo "[psql error]"
echo "---"
psql "$(cat ~/.pgconn)" -At -c "SELECT COUNT(*) AS total_applied FROM \"_prisma_migrations\" WHERE finished_at IS NOT NULL;" 2>&1 || echo "[psql error]"

echo ""
echo "===== 5. Backend Container App env (names only, NO VALUES) ====="
az containerapp show \
  --name "$APP" \
  --resource-group "$RG" \
  --query "properties.template.containers[0].env[].name" \
  -o tsv 2>&1 | sort || echo "[az error]"

echo ""
echo "===== 6. Container App secret names (no values) ====="
az containerapp secret list \
  --name "$APP" \
  --resource-group "$RG" \
  --query "[].name" \
  -o tsv 2>&1 | sort || echo "[az error]"

echo ""
echo "===== 7. Key Vault secret names (no values) ====="
az keyvault secret list \
  --vault-name "$KV" \
  --query "[].name" \
  -o tsv 2>&1 | sort || echo "[az error]"

echo ""
echo "===== 8. ConceptLesson chapter mapping snapshot ====="
psql "$(cat ~/.pgconn)" -c "SELECT \"ncertClass\", COUNT(*) AS chapters FROM \"ConceptLesson\" GROUP BY \"ncertClass\" ORDER BY \"ncertClass\";" 2>&1 || echo "[psql error]"

echo ""
echo "===== 9. Per-chapter Problem count (top 5 lowest + class 11/12 only) ====="
psql "$(cat ~/.pgconn)" -c "
SELECT cl.\"ncertClass\" AS class, cl.\"chapterNumber\" AS ch, cl.\"titleEn\",
       (SELECT COUNT(*) FROM \"Problem\" p
          WHERE p.\"conceptLessonId\"=cl.id
            AND EXISTS (SELECT 1 FROM \"ProblemStep\" s WHERE s.\"problemId\"=p.id AND s.\"stepIndex\"=1)
            AND EXISTS (SELECT 1 FROM \"ProblemStep\" s WHERE s.\"problemId\"=p.id AND s.\"stepIndex\"=2)
            AND EXISTS (SELECT 1 FROM \"ProblemStep\" s WHERE s.\"problemId\"=p.id AND s.\"stepIndex\"=3)
       ) AS multi_step_count
FROM \"ConceptLesson\" cl
WHERE cl.\"ncertClass\" IN ('CLASS_11','CLASS_12')
ORDER BY multi_step_count ASC, cl.\"ncertClass\", cl.\"chapterNumber\"
LIMIT 12;" 2>&1 || echo "[psql error]"

echo ""
echo "===== END ====="
