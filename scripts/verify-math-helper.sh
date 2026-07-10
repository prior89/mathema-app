#!/usr/bin/env bash
# Fix MATH_HELPER_URL on backend, then run an end-to-end LLM-backed
# /math-helper/solve test: register -> solve -> cleanup.
#
# Usage, from repo root in Azure Cloud Shell with az logged in:
#   git pull && bash scripts/verify-math-helper.sh

set -euo pipefail

RG=mathema-prod-cin
BACKEND_URL=https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io

step() { printf "\n\033[1;36m=== %s ===\033[0m\n" "$*"; }
fail() { printf "\n\033[1;31mFAILED:\033[0m %s\n" "$*"; exit 1; }

step "0. Resolve math-helper internal FQDN"
FQDN=$(az containerapp show -n mathema-math-helper -g "$RG" \
  --query "properties.configuration.ingress.fqdn" -o tsv)
FQDN="${FQDN%\"}"
FQDN="${FQDN#\"}"
printf "  FQDN = %s\n" "$FQDN"
case "$FQDN" in
  mathema-math-helper.internal.*.azurecontainerapps.io) ;;
  *) fail "unexpected FQDN shape: $FQDN" ;;
esac

step "1. Patch backend env MATH_HELPER_URL -> https://<fqdn>"
NEW_URL="https://$FQDN"
printf "  setting MATH_HELPER_URL=%s\n" "$NEW_URL"
az containerapp update -n mathema-backend -g "$RG" \
  --set-env-vars "MATH_HELPER_URL=$NEW_URL" \
  --query "properties.latestRevisionName" -o tsv \
  || fail "containerapp update failed"

step "2. Wait for backend new revision to be Running"
for i in $(seq 1 24); do
  sleep 5
  latest=$(az containerapp show -n mathema-backend -g "$RG" \
    --query 'properties.latestRevisionName' -o tsv)
  state=$(az containerapp revision show -n mathema-backend -g "$RG" \
    --revision "$latest" \
    --query "properties.runningState" -o tsv 2>/dev/null || echo "Unknown")
  printf "  attempt %02d -> %s\n" "$i" "$state"
  [ "$state" = "Running" ] && break
done

step "3. End-to-end LLM solve: auth -> solve -> cleanup"
API="$BACKEND_URL/api/v1"
TS=$(date +%s)
EMAIL="solve-verify-$TS@mathema.test"
PW="Verify!$TS"

if [ -n "${SMOKE_USER_EMAIL:-}" ] && [ -n "${SMOKE_USER_PASSWORD:-}" ]; then
  AUTH_RESP=$(curl -sS --max-time 20 -X POST "$API/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$SMOKE_USER_EMAIL\",\"password\":\"$SMOKE_USER_PASSWORD\"}")
  CLEANUP=0
  printf "  logged in smoke user (email len %d)\n" "${#SMOKE_USER_EMAIL}"
else
  AUTH_RESP=$(curl -sS --max-time 20 -X POST "$API/auth/register" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PW\",\"name\":\"VerifyTest\",\"role\":\"STUDENT\",\"gradeLevel\":\"CLASS_11\"}")
  CLEANUP=1
  printf "  registered %s\n" "$EMAIL"
fi
TOKEN=$(printf '%s' "$AUTH_RESP" | python3 -c "import json,sys; print(json.load(sys.stdin)['data']['accessToken'])" 2>/dev/null) \
  || { printf "auth failed: %s\n" "$AUTH_RESP"; fail "auth"; }
printf "  token len %d\n" "${#TOKEN}"

if [ "$CLEANUP" = "1" ]; then
  PROFILE_RESP=$(curl -sS --max-time 20 -X PATCH "$API/users/me" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"birthDate":"2000-01-01T00:00:00.000Z","gradeLevel":"CLASS_11","country":"IN"}' \
    -w "\nHTTP_CODE:%{http_code}")
  PROFILE_CODE=$(printf '%s' "$PROFILE_RESP" | tail -1 | sed 's/HTTP_CODE://')
  printf "  profile HTTP %s\n" "$PROFILE_CODE"
fi

SOLVE_RESP=$(curl -sS --max-time 90 -X POST "$API/math-helper/solve" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"classLevel":11,"question":"Find the derivative of x^2."}' \
  -w "\nHTTP_CODE:%{http_code}")
CODE=$(printf '%s' "$SOLVE_RESP" | tail -1 | sed 's/HTTP_CODE://')
BODY=$(printf '%s' "$SOLVE_RESP" | sed '$d')

printf "  HTTP %s\n" "$CODE"
printf "  body (head):\n"
printf '%s\n' "$BODY" | python3 -m json.tool 2>/dev/null | head -25 || printf "%s\n" "$BODY"

step "4. Cleanup test user"
if [ "$CLEANUP" = "1" ]; then
  curl -sS --max-time 10 -X DELETE "$API/users/me" -H "Authorization: Bearer $TOKEN" >/dev/null || true
  printf "  deleted %s\n" "$EMAIL"
else
  printf "  kept configured smoke user\n"
fi

# This prompt intentionally requires the LLM path, not the deterministic solver,
# so stale OpenAI secrets are caught.
case "$CODE" in
  200|201)
    printf "\n\033[1;32mOK /math-helper/solve = %s. AI Solver LLM path is live in production.\033[0m\n" "$CODE"
    exit 0 ;;
  *)
    printf "\n\033[1;31mExpected 200/201, got %s. Check backend and math-helper logs:\033[0m\n" "$CODE"
    printf "  az containerapp logs show -n mathema-backend -g %s --tail 80 --type=console\n" "$RG"
    printf "  az containerapp logs show -n mathema-math-helper -g %s --tail 80 --type=console\n" "$RG"
    exit 1 ;;
esac
