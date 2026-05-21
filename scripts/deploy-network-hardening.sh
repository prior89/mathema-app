#!/usr/bin/env bash
# scripts/deploy-network-hardening.sh
#
# Helper for the publicNetworkAccess=Disabled + ACR managed-identity + KV-backed
# admin-emails Bicep deploy. Wraps the long `az deployment group` invocation so
# Cloud Shell paste wrapping doesn't break the command.
#
# Usage (from repo root, after exporting the four secret env vars):
#   export DB_PW='...'
#   export JWT_A='...'
#   export JWT_R='...'
#   export OAI='...'        # any non-empty placeholder works when provisionAzureOpenAi=false
#   bash scripts/deploy-network-hardening.sh whatif     # dry-run, no changes
#   bash scripts/deploy-network-hardening.sh create     # real deploy

set -euo pipefail

MODE="${1:-whatif}"
RG="mathema-prod-cin"
TEMPLATE="infra/bicep/main.bicep"
PARAMS_FILE="infra/bicep/main.parameters.json"
NAME="privlock-$(date +%Y%m%d-%H%M)"

if [ "$MODE" != "whatif" ] && [ "$MODE" != "create" ]; then
  echo "Usage: bash $0 [whatif|create]" >&2
  exit 1
fi

# Sanity check the four expected env vars are non-empty.
for v in DB_PW JWT_A JWT_R OAI; do
  if [ -z "${!v:-}" ]; then
    echo "ERROR: env var \$$v is empty. Run the KV extraction snippet first, then 'export $v'." >&2
    exit 1
  fi
done

# Build the command as a bash array so each token is preserved exactly.
ARGS=(
  --resource-group "$RG"
  --template-file "$TEMPLATE"
  --parameters "@$PARAMS_FILE"
  --parameters
    dbAdminPassword="$DB_PW"
    jwtAccessSecret="$JWT_A"
    jwtRefreshSecret="$JWT_R"
    openaiApiKey="$OAI"
    bootstrapMode=false
    mathHelperBootstrap=false
)

if [ "$MODE" = "create" ]; then
  ARGS+=(--name "$NAME")
fi

echo ">>> az deployment group $MODE (rg=$RG, name=$NAME)"
echo ">>> template=$TEMPLATE"
echo ">>> parameters file=$PARAMS_FILE + 6 inline values"
echo

az deployment group "$MODE" "${ARGS[@]}"
