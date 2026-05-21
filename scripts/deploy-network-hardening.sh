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

# Normalise the shorthand `whatif` to the az subcommand `what-if`.
case "$MODE" in
  whatif|what-if) AZ_SUBCMD="what-if" ;;
  create)         AZ_SUBCMD="create" ;;
  *)
    echo "Usage: bash $0 [whatif|create]" >&2
    exit 1
    ;;
esac

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

echo ">>> az deployment group $AZ_SUBCMD (rg=$RG, name=$NAME)"
echo ">>> template=$TEMPLATE"
echo ">>> parameters file=$PARAMS_FILE + 6 inline values"
echo

# Allow the deploy to fail without aborting the script — we still need the
# post-deploy hook to re-pin PG/KV public access. ARM partial rollback has
# bitten us twice: a Bicep redeploy that fails mid-way leaves PG and KV
# with publicNetworkAccess=Disabled + KV networkAcls.defaultAction=Deny,
# even though the template specifies the opposite. Until we ship VNet +
# private endpoints (#27), the safe state is public + Allow + KV bypass.
set +e
az deployment group "$AZ_SUBCMD" "${ARGS[@]}"
AZ_EXIT=$?
set -e

# Only the create path mutates state; whatif is pure dry-run.
if [ "$AZ_SUBCMD" = "create" ]; then
  echo
  echo ">>> post-deploy: pinning PG + KV to known-safe public state"

  PG_NAME=$(az postgres flexible-server list -g "$RG" --query "[0].name" -o tsv 2>/dev/null || echo "")
  KV_NAME=$(az keyvault list -g "$RG" --query "[0].name" -o tsv 2>/dev/null || echo "")

  if [ -n "$PG_NAME" ]; then
    echo "    PG $PG_NAME → public-access Enabled"
    az postgres flexible-server update -g "$RG" -n "$PG_NAME" --public-access Enabled --output none || true
  else
    echo "    (PG not found — skipping)"
  fi

  if [ -n "$KV_NAME" ]; then
    echo "    KV $KV_NAME → publicNetworkAccess Enabled + default-action Allow"
    az keyvault update --name "$KV_NAME" --public-network-access Enabled --output none || true
    az keyvault update --name "$KV_NAME" --default-action Allow            --output none || true
  else
    echo "    (KV not found — skipping)"
  fi

  echo ">>> post-deploy hook done."
fi

if [ $AZ_EXIT -ne 0 ]; then
  echo
  echo "::error::az deployment group $AZ_SUBCMD exited $AZ_EXIT (state pinned to safe values above; investigate before redeploy)" >&2
  exit $AZ_EXIT
fi
