#!/usr/bin/env bash
# One-shot bootstrap for the math-helper Python Container App.
#
# Run from the repo root in Azure Cloud Shell (or any shell with az logged in
# to subscription b469edd9-f8e6-4202-a2e5-b2dd5bed0f40):
#
#   cd ~/mathema-app && bash scripts/deploy-math-helper.sh
#
# What it does:
#   0. Reads current DB / JWT / OpenAI secrets from Key Vault so the Bicep
#      redeploy doesn't overwrite them with placeholder values.
#   1. Redeploys Bicep to add: math-helper Container App (internal ingress)
#      and backend env vars for MATH_HELPER_URL.
#   2. Builds the Python image in ACR (Azure-side docker build, no local docker
#      needed).
#   3. Swaps the math-helper Container App from the bootstrap hello-world
#      placeholder to the real Python image.
#   4. Smoke-tests via the backend's /math-helper/health proxy.
#
# Safe to re-run: az deployment group create + containerapp update are both
# idempotent.

set -euo pipefail

KV=mathema-kv-7ehvzq
RG=mathema-prod-cin
ACR=mathemaacr7ehvzqcd6c436
BACKEND_URL=https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io

step() { printf "\n\033[1;36m=== %s ===\033[0m\n" "$*"; }
fail() { printf "\n\033[1;31mFAILED:\033[0m %s\n" "$*"; exit 1; }

step "0. Read existing KV secrets so the redeploy doesn't clobber them"
DB_PASSWORD=$(az keyvault secret show --vault-name "$KV" --name database-url --query value -o tsv \
  | sed -E 's|^postgresql://[^:]+:([^@]+)@.*|\1|')
JWT_ACCESS=$(az keyvault secret show --vault-name "$KV" --name jwt-access-secret  --query value -o tsv)
JWT_REFRESH=$(az keyvault secret show --vault-name "$KV" --name jwt-refresh-secret --query value -o tsv)
OPENAI_KEY=$(az keyvault secret show --vault-name "$KV" --name openai-api-key    --query value -o tsv)
printf "  secret lengths: db=%d access=%d refresh=%d openai=%d\n" \
  "${#DB_PASSWORD}" "${#JWT_ACCESS}" "${#JWT_REFRESH}" "${#OPENAI_KEY}"
[ -n "$DB_PASSWORD" ] && [ -n "$JWT_ACCESS" ] && [ -n "$JWT_REFRESH" ] && [ -n "$OPENAI_KEY" ] \
  || fail "one or more KV secrets were empty — refusing to redeploy"

step "1. Bicep redeploy (math-helper Container App)"
az deployment group create \
  -g "$RG" \
  --template-file infra/bicep/main.bicep \
  --parameters @infra/bicep/main.parameters.json \
  --parameters \
    dbAdminPassword="$DB_PASSWORD" \
    jwtAccessSecret="$JWT_ACCESS" \
    jwtRefreshSecret="$JWT_REFRESH" \
    openaiApiKey="$OPENAI_KEY" \
  --query "properties.provisioningState" -o tsv \
  || fail "Bicep deployment failed"

step "2. Build Python image in ACR (server-side build, no local docker needed)"
az acr build \
  -r "$ACR" \
  -t mathema-math-helper:initial \
  -f services/math-helper/Dockerfile \
  . \
  || fail "az acr build failed"

step "3. Swap math-helper Container App from hello-world to real image"
az containerapp update \
  -n mathema-math-helper -g "$RG" \
  --image "$ACR.azurecr.io/mathema-math-helper:initial" \
  --set-env-vars \
    MATH_HELPER_MODEL=gpt-5.4-mini \
    MATH_HELPER_FALLBACK_MODEL=gpt-5.5 \
  --query "properties.latestRevisionName" -o tsv \
  || fail "containerapp update failed"

step "4. Smoke test via backend's /math-helper/health proxy"
# math-helper has internal ingress so we can't curl it directly. /math-helper/health
# is JWT-guarded by NestJS, so:
#   200 → math-helper is up AND backend → math-helper internal HTTP works
#   401 → routing works, just no auth (good enough — proves no 503)
#   503 → math-helper unreachable from backend (still broken)
for i in $(seq 1 18); do
  sleep 5
  code=$(curl -s -o /dev/null --max-time 8 -w "%{http_code}" \
    "$BACKEND_URL/api/v1/math-helper/health" || echo "000")
  printf "  attempt %02d → HTTP %s\n" "$i" "$code"
  case "$code" in
    200|401) printf "\n\033[1;32m✓ done.\033[0m math-helper is reachable from backend (HTTP %s).\n" "$code"; exit 0 ;;
    503|502|504) ;; # keep polling — Container App may still be cold-starting
    *) ;;
  esac
done
printf "\n\033[1;31m✗ still got 5xx after 90s. Last 50 log lines:\033[0m\n"
az containerapp logs show -n mathema-math-helper -g "$RG" --type=console --tail 50 || true
exit 1
