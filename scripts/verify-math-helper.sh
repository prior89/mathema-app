#!/usr/bin/env bash
# Fix MATH_HELPER_URL on backend (must be https://, not http://, or ACA
# ingress 301-redirects and Node fetch downgrades POST to GET → 405).
# Then end-to-end test: register → call /math-helper/solve → cleanup.
#
# Usage (from repo root, in Cloud Shell with az logged in):
#   git pull && bash scripts/verify-math-helper.sh

set -euo pipefail

RG=mathema-prod-cin
BACKEND_URL=https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io

step() { printf "\n\033[1;36m=== %s ===\033[0m\n" "$*"; }
fail() { printf "\n\033[1;31mFAILED:\033[0m %s\n" "$*"; exit 1; }

step "0. Resolve math-helper internal FQDN"
FQDN=$(az containerapp show -n mathema-math-helper -g "$RG" \
  --query "properties.configuration.ingress.fqdn" -o tsv)
# Defensive: strip any accidental surrounding double-quotes from paste mishaps.
FQDN="${FQDN%\"}"
FQDN="${FQDN#\"}"
printf "  FQDN = %s\n" "$FQDN"
case "$FQDN" in
  mathema-math-helper.internal.*.azurecontainerapps.io) ;;
  *) fail "unexpected FQDN shape: $FQDN" ;;
esac

step "1. Patch backend env MATH_HELPER_URL → https://<fqdn>"
NEW_URL="https://$FQDN"
printf "  setting MATH_HELPER_URL=%s\n" "$NEW_URL"
az containerapp update -n mathema-backend -g "$RG" \
  --set-env-vars "MATH_HELPER_URL=$NEW_URL" \
  --query "properties.latestRevisionName" -o tsv \
  || fail "containerapp update failed"

step "2. Wait for backend new revision to be Ready"
for i in $(seq 1 24); do
  sleep 5
  state=$(az containerapp revision show -n mathema-backend -g "$RG" \
    --revision "$(az containerapp show -n mathema-backend -g "$RG" --query 'properties.latestRevisionName' -o tsv)" \
    --query "properties.runningState" -o tsv 2>/dev/null || echo "Unknown")
  printf "  attempt %02d → %s\n" "$i" "$state"
  [ "$state" = "Running" ] && break
done

step "3. End-to-end: register fresh user → POST /math-helper/solve → cleanup"
API="$BACKEND_URL/api/v1"
TS=$(date +%s)
EMAIL="solve-verify-$TS@mathema.test"
PW="Verify!$TS"

REG_RESP=$(curl -s -X POST "$API/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PW\",\"name\":\"VerifyTest\",\"role\":\"STUDENT\",\"gradeLevel\":\"CLASS_8\"}")
TOKEN=$(printf '%s' "$REG_RESP" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null) \
  || { printf "register failed: %s\n" "$REG_RESP"; fail "register"; }
printf "  registered %s (token len %d)\n" "$EMAIL" "${#TOKEN}"

SOLVE_RESP=$(curl -s -X POST "$API/math-helper/solve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classLevel":8,"question":"Solve for x: 2x + 7 = 15"}' \
  -w "\nHTTP_CODE:%{http_code}" \
  --max-time 90)
CODE=$(printf '%s' "$SOLVE_RESP" | tail -1 | sed 's/HTTP_CODE://')
BODY=$(printf '%s' "$SOLVE_RESP" | sed '$d')

printf "  HTTP %s\n" "$CODE"
printf "  body (head):\n"
printf '%s\n' "$BODY" | python3 -m json.tool 2>/dev/null | head -25 || printf "%s\n" "$BODY"

step "4. Cleanup test user"
curl -s -X DELETE "$API/users/me" -H "Authorization: Bearer $TOKEN" > /dev/null || true
printf "  deleted %s\n" "$EMAIL"

# NestJS 의 POST 핸들러는 기본 status 201 Created. /solve 도 데이터 생성은 안 하지만
# 그 기본을 따름. 200·201 둘 다 성공 — Python 까지 가서 응답을 받았다는 뜻.
case "$CODE" in
  200|201)
    printf "\n\033[1;32m✅ /math-helper/solve = %s. Karvy AI solve is live in production.\033[0m\n" "$CODE"
    exit 0 ;;
  *)
    printf "\n\033[1;31m✗ Expected 200/201, got %s. Check backend logs:\033[0m\n  az containerapp logs show -n mathema-backend -g %s --tail 80 --type=console\n" "$CODE" "$RG"
    exit 1 ;;
esac
