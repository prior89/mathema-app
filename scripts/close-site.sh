#!/usr/bin/env bash
# Take the public SWA frontend offline:
#   1. Replace the React SPA in production with a "Service Paused" page.
#   2. Disable the frontend-deploy.yml workflow so the next push to app/**
#      doesn't auto-reopen the site.
# Backend Container App stays running (it's API-only, not publicly indexed).
#
# Reverse with scripts/reopen-site.sh (rebuilds + redeploys the real SPA).
#
# Run from repo root in Cloud Shell with az logged in:
#   git pull && bash scripts/close-site.sh

set -euo pipefail

RG=mathema-prod-cin
SWA=mathema-swa

step() { printf "\n\033[1;36m=== %s ===\033[0m\n" "$*"; }

step "1. Build maintenance page"
DIST=$(mktemp -d)
trap "rm -rf $DIST" EXIT
cat > "$DIST/index.html" << 'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mathēma — Service Paused</title>
<style>
  body { margin: 0; min-height: 100vh; display: grid; place-items: center;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    background: #f7f7f5; color: #2a3340; }
  main { max-width: 440px; padding: 40px 24px; text-align: center; }
  h1 { font-family: 'Lora', Georgia, serif; font-weight: 400;
       margin: 0 0 14px; font-size: 32px; font-style: italic;
       color: #1d4a44; letter-spacing: -0.01em; }
  p  { color: #5c6770; line-height: 1.55; margin: 0; font-size: 15px; }
</style>
</head>
<body>
  <main>
    <h1>Mathēma</h1>
    <p>This service is currently paused. Please check back later.</p>
  </main>
</body>
</html>
HTML

# SPA fallback so any deep link (/app, /onboarding, /login, …) lands on the
# maintenance page instead of 404.
cat > "$DIST/staticwebapp.config.json" << 'JSON'
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": []
  },
  "globalHeaders": {
    "cache-control": "no-cache, no-store, must-revalidate"
  }
}
JSON

printf "  dist built at %s\n" "$DIST"

step "2. Fetch SWA deployment token"
TOKEN=$(az staticwebapp secrets list --name "$SWA" --resource-group "$RG" --query "properties.apiKey" -o tsv)
[ -z "$TOKEN" ] && { echo "could not fetch deployment token"; exit 1; }
printf "  token len=%d\n" "${#TOKEN}"

step "3. Deploy maintenance page to production"
npx -y @azure/static-web-apps-cli@latest deploy "$DIST" \
  --deployment-token "$TOKEN" \
  --env production \
  --verbose silent

step "4. Disable frontend-deploy.yml so app/** pushes don't auto-reopen"
gh workflow disable frontend-deploy.yml -R prior89/mathema-app 2>&1 || true

printf "\n\033[1;32m✓ Site closed.\033[0m https://black-wave-093b02b00.7.azurestaticapps.net/ now shows the maintenance page.\n"
printf "  Reopen with: bash scripts/reopen-site.sh\n"
