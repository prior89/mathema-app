#!/usr/bin/env bash
# One-shot bootstrap for the math-helper Python Container App.
#
# Run from the repo root in Azure Cloud Shell, or any shell with az logged in:
#
#   cd ~/mathema-app && bash scripts/deploy-math-helper.sh
#
# If the Key Vault OpenAI secret is stale, pass a fresh key explicitly:
#
#   OPENAI_API_KEY=sk-... bash scripts/deploy-math-helper.sh
#
# What it does:
#   0. Reads current DB / JWT secrets from Key Vault, and uses OPENAI_API_KEY
#      from the environment when provided.
#   1. Redeploys Bicep to add/update the math-helper Container App.
#   2. Builds the Python image in ACR.
#   3. Updates the math-helper Container App revision and env vars.
#   4. Runs an LLM-backed smoke test through the backend proxy.
#
# Safe to re-run: az deployment group create + containerapp update are both
# idempotent.

set -euo pipefail

KV=mathema-kv-7ehvzq
RG=mathema-prod-cin
ACR=mathemaacr7ehvzqcd6c436

step() { printf "\n\033[1;36m=== %s ===\033[0m\n" "$*"; }
fail() { printf "\n\033[1;31mFAILED:\033[0m %s\n" "$*"; exit 1; }

step "0. Read existing secrets without clobbering live values"
DB_PASSWORD=$(az keyvault secret show --vault-name "$KV" --name database-url --query value -o tsv \
  | sed -E 's|^postgresql://[^:]+:([^@]+)@.*|\1|')
JWT_ACCESS=$(az keyvault secret show --vault-name "$KV" --name jwt-access-secret --query value -o tsv)
JWT_REFRESH=$(az keyvault secret show --vault-name "$KV" --name jwt-refresh-secret --query value -o tsv)
if [ -n "${OPENAI_API_KEY:-}" ]; then
  OPENAI_KEY="$OPENAI_API_KEY"
  printf "  using OPENAI_API_KEY from environment\n"
else
  OPENAI_KEY=$(az keyvault secret show --vault-name "$KV" --name openai-api-key --query value -o tsv)
  printf "  using openai-api-key from Key Vault\n"
fi
printf "  secret lengths: db=%d access=%d refresh=%d openai=%d\n" \
  "${#DB_PASSWORD}" "${#JWT_ACCESS}" "${#JWT_REFRESH}" "${#OPENAI_KEY}"
[ -n "$DB_PASSWORD" ] && [ -n "$JWT_ACCESS" ] && [ -n "$JWT_REFRESH" ] && [ -n "$OPENAI_KEY" ] \
  || fail "one or more secrets were empty; refusing to redeploy"

step "1. Bicep redeploy"
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

step "2. Ensure Container App OpenAI secret is current"
az containerapp secret set \
  -n mathema-math-helper -g "$RG" \
  --secrets "openai-api-key=$OPENAI_KEY" \
  >/dev/null \
  || fail "containerapp secret update failed"

step "3. Build Python image in ACR"
az acr build \
  -r "$ACR" \
  -t mathema-math-helper:initial \
  -f services/math-helper/Dockerfile \
  . \
  || fail "az acr build failed"

step "4. Update math-helper Container App revision"
az containerapp update \
  -n mathema-math-helper -g "$RG" \
  --image "$ACR.azurecr.io/mathema-math-helper:initial" \
  --set-env-vars \
    OPENAI_API_KEY=secretref:openai-api-key \
    MATH_HELPER_MODEL=gpt-5.4-mini \
    MATH_HELPER_FALLBACK_MODEL=gpt-5.5 \
  --query "properties.latestRevisionName" -o tsv \
  || fail "containerapp update failed"

step "5. LLM-backed production smoke test"
bash scripts/verify-math-helper.sh
