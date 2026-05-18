#!/usr/bin/env bash
# Undo scripts/close-site.sh:
#   1. Re-enable the frontend-deploy.yml workflow.
#   2. Trigger it so the real React SPA gets rebuilt and redeployed,
#      replacing the maintenance page.
#
# Run from repo root in Cloud Shell with gh + az logged in:
#   git pull && bash scripts/reopen-site.sh

set -euo pipefail

step() { printf "\n\033[1;36m=== %s ===\033[0m\n" "$*"; }

step "1. Re-enable frontend-deploy.yml workflow"
gh workflow enable frontend-deploy.yml -R prior89/mathema-app 2>&1 || true

step "2. Trigger frontend rebuild + redeploy"
gh workflow run frontend-deploy.yml -R prior89/mathema-app
sleep 3
RUN_ID=$(gh run list --workflow=frontend-deploy.yml -R prior89/mathema-app --limit 1 --json databaseId --jq '.[0].databaseId')
printf "  run id=%s — tailing…\n" "$RUN_ID"
gh run watch "$RUN_ID" --exit-status -R prior89/mathema-app || true

printf "\n\033[1;32m✓ Site reopened.\033[0m Real SPA should be live at https://black-wave-093b02b00.7.azurestaticapps.net/ in ~30s.\n"
