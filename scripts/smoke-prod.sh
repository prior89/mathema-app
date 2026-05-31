#!/usr/bin/env bash
# Matheo prod smoke test — 9 items, post-deploy verification.
#
# Built per feedback_smoke_test_required: health + version + login +
# chapter + C11-CH04 learn + mastery + question + console + 500 log.
# Single bash source of truth so CI (ubuntu-latest), Cloud Shell, and
# local Git Bash all run the same checks.
#
# Usage:
#   bash scripts/smoke-prod.sh <BACKEND_URL> <EMAIL> <PASSWORD> \
#                              [ADMIN_EMAIL] [ADMIN_PASSWORD]
#
# Env fallback (overridden by positional args when provided):
#   SMOKE_BACKEND_URL       e.g. https://mathema-backend.redcoast-...azurecontainerapps.io
#   SMOKE_USER_EMAIL        regular learner account for /problems, /mastery
#   SMOKE_USER_PASSWORD
#   SMOKE_ADMIN_EMAIL       optional — admin allowlist account (#8 console check)
#   SMOKE_ADMIN_PASSWORD
#   SMOKE_RG / SMOKE_ACA    optional — for #9 log scan (defaults to prod values)
#
# Exit codes:
#   0   every required check passed (admin/log checks skipped count as pass)
#   1   one or more required checks failed
#   2   bad invocation (missing url or creds)

set -uo pipefail

# --- args / env -----------------------------------------------------
BACKEND_URL="${1:-${SMOKE_BACKEND_URL:-}}"
EMAIL="${2:-${SMOKE_USER_EMAIL:-}}"
PASSWORD="${3:-${SMOKE_USER_PASSWORD:-}}"
ADMIN_EMAIL="${4:-${SMOKE_ADMIN_EMAIL:-}}"
ADMIN_PASSWORD="${5:-${SMOKE_ADMIN_PASSWORD:-}}"
RG="${SMOKE_RG:-mathema-prod-cin}"
ACA="${SMOKE_ACA:-mathema-backend}"

if [ -z "$BACKEND_URL" ] || [ -z "$EMAIL" ] || [ -z "$PASSWORD" ]; then
  cat <<EOF
usage: bash scripts/smoke-prod.sh <BACKEND_URL> <EMAIL> <PASSWORD> [ADMIN_EMAIL] [ADMIN_PASSWORD]
  BACKEND_URL  https origin, no trailing slash. /api/v1 is appended.
  EMAIL        learner account used for steps 3-7.
  PASSWORD     learner password.
  ADMIN_EMAIL  optional — admin allowlist account for step 8.
  ADMIN_PASS   optional — admin password.

Env fallback: SMOKE_BACKEND_URL / SMOKE_USER_EMAIL / SMOKE_USER_PASSWORD /
              SMOKE_ADMIN_EMAIL / SMOKE_ADMIN_PASSWORD
EOF
  exit 2
fi

BACKEND_URL="${BACKEND_URL%/}"          # strip trailing slash
API="${BACKEND_URL}/api/v1"
CHAPTER_CODE="C11-CH04-COMPLEX"          # NCERT Class 11 Ch 4 — Complex Numbers

# --- output helpers -------------------------------------------------
if [ -t 1 ]; then
  G="$(printf '\033[32m')"; R="$(printf '\033[31m')"; Y="$(printf '\033[33m')"; D="$(printf '\033[0m')"
else
  G=""; R=""; Y=""; D=""
fi

pass_count=0
fail_count=0
skip_count=0
fail_steps=""

pass() { echo "  ${G}PASS${D} $1"; pass_count=$((pass_count+1)); }
fail() { echo "  ${R}FAIL${D} $1"; fail_count=$((fail_count+1)); fail_steps="${fail_steps}\n  - $1"; }
skip() { echo "  ${Y}SKIP${D} $1"; skip_count=$((skip_count+1)); }
step() { echo ""; echo "[$1/9] $2"; }

# Curl wrapper — returns "<http_code>|<body>" via stdout. --max-time 15
# so a stuck endpoint can't hang the whole smoke run.
curl_json() {
  local method="$1" url="$2" body="${3:-}" auth="${4:-}"
  local out
  if [ -n "$body" ]; then
    out=$(curl -sS -o /tmp/smoke.body -w "%{http_code}" --max-time 15 \
      -X "$method" -H "Content-Type: application/json" \
      ${auth:+-H "Authorization: Bearer $auth"} \
      -d "$body" "$url" 2>/tmp/smoke.err)
  else
    out=$(curl -sS -o /tmp/smoke.body -w "%{http_code}" --max-time 15 \
      -X "$method" \
      ${auth:+-H "Authorization: Bearer $auth"} \
      "$url" 2>/tmp/smoke.err)
  fi
  local code="$out"
  local body_content
  body_content=$(cat /tmp/smoke.body 2>/dev/null || echo "")
  printf '%s|%s' "$code" "$body_content"
}

# Extract a JSON field via grep+sed — keeps script jq-free for portability
# (Cloud Shell, Git Bash, some CI runners don't have jq).
json_field() {
  local body="$1" key="$2"
  printf '%s' "$body" | grep -oE "\"$key\":\\s*\"[^\"]*\"" | head -1 \
    | sed -E "s/\"$key\":\\s*\"([^\"]*)\".*/\\1/"
}

echo "Matheo prod smoke — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "Backend: $BACKEND_URL"
echo "User:    $EMAIL"
if [ -n "$ADMIN_EMAIL" ]; then echo "Admin:   $ADMIN_EMAIL"; fi

# --- 1. /health/live -----------------------------------------------
step 1 "/health/live"
res=$(curl_json GET "$API/health/live")
code="${res%%|*}"; body="${res#*|}"
if [ "$code" = "200" ] && echo "$body" | grep -q '"status":"ok"'; then
  pass "live $code"
else
  fail "live got $code body=$body"
fi

# --- 2. /health/version --------------------------------------------
step 2 "/health/version (release inventory)"
res=$(curl_json GET "$API/health/version")
code="${res%%|*}"; body="${res#*|}"
git_sha=$(json_field "$body" gitSha)
mig_head=$(json_field "$body" dbMigrationHead)
env_field=$(json_field "$body" env)
if [ "$code" = "200" ] \
  && [ -n "$git_sha" ] && [ "$git_sha" != "unknown" ] \
  && [ -n "$mig_head" ] && [ "$mig_head" != "null" ]; then
  pass "version gitSha=${git_sha:0:7} mig=${mig_head} env=${env_field}"
else
  fail "version code=$code gitSha='$git_sha' mig='$mig_head' body=$body"
fi

# --- 3. /auth/login -> JWT -----------------------------------------
step 3 "/auth/login (acquire JWT)"
res=$(curl_json POST "$API/auth/login" \
  "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}")
code="${res%%|*}"; body="${res#*|}"
# Login response wraps in TransformInterceptor — check both top-level and
# data.access object (the project's standard envelope).
access=$(printf '%s' "$body" | grep -oE '"access(Token)?":\s*"[^"]+"' | head -1 \
  | sed -E 's/.*"access(Token)?":\s*"([^"]+)".*/\2/')
if [ "$code" = "200" ] && [ -n "$access" ]; then
  pass "login 200 token=${access:0:12}…"
else
  fail "login code=$code body=$body"
fi

# Steps 4-7 need JWT; skip them all if login failed.
if [ -z "$access" ]; then
  step 4 "/curriculum/catalog"; skip "no JWT (login failed)"
  step 5 "/concept-lessons/$CHAPTER_CODE"; skip "no JWT"
  step 6 "/mastery"; skip "no JWT"
  step 7 "/problems"; skip "no JWT"
else
  # --- 4. /curriculum/catalog --------------------------------------
  step 4 "/curriculum/catalog"
  res=$(curl_json GET "$API/curriculum/catalog?country=IN" "" "$access")
  code="${res%%|*}"; body="${res#*|}"
  # Project envelope: data is wrapped. We just check the response is JSON
  # array-ish and ≥1 row.
  if [ "$code" = "200" ] && printf '%s' "$body" | grep -qE '"(id|code)":'; then
    pass "catalog 200"
  else
    fail "catalog code=$code body=${body:0:200}"
  fi

  # --- 5. /concept-lessons/C11-CH04-COMPLEX -------------------------
  step 5 "/concept-lessons/$CHAPTER_CODE (NCERT Class 11 Ch 4 — Complex)"
  res=$(curl_json GET "$API/concept-lessons/$CHAPTER_CODE" "" "$access")
  code="${res%%|*}"; body="${res#*|}"
  if [ "$code" = "200" ] && printf '%s' "$body" | grep -qE '"chapterCode":\s*"C11-CH04'; then
    pass "C11-CH04 lesson 200"
  else
    fail "C11-CH04 code=$code body=${body:0:200}"
  fi

  # --- 6. /mastery -------------------------------------------------
  step 6 "/mastery (per-concept mastery state)"
  res=$(curl_json GET "$API/mastery" "" "$access")
  code="${res%%|*}"; body="${res#*|}"
  if [ "$code" = "200" ]; then
    pass "mastery 200"
  else
    fail "mastery code=$code body=${body:0:200}"
  fi

  # --- 7. /problems ------------------------------------------------
  step 7 "/problems?limit=1 (pool fetch)"
  res=$(curl_json GET "$API/problems?limit=1" "" "$access")
  code="${res%%|*}"; body="${res#*|}"
  if [ "$code" = "200" ] && printf '%s' "$body" | grep -qE '"id":\s*"[^"]+"'; then
    pass "problems 200 (>=1 row)"
  else
    fail "problems code=$code body=${body:0:200}"
  fi
fi

# --- 8. /admin/* console check (optional) --------------------------
step 8 "/admin (auth-gated console — optional)"
if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
  skip "ADMIN_EMAIL / ADMIN_PASSWORD not provided"
else
  res=$(curl_json POST "$API/auth/login" \
    "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")
  admin_body="${res#*|}"
  admin_tok=$(printf '%s' "$admin_body" | grep -oE '"access(Token)?":\s*"[^"]+"' | head -1 \
    | sed -E 's/.*"access(Token)?":\s*"([^"]+)".*/\2/')
  if [ -z "$admin_tok" ]; then
    fail "admin login failed"
  else
    # admin.controller has GET /admin/content/pool-gaps (recent feat) —
    # 200 means JWT + admin role both validated. Substitute any cheap
    # admin GET if that endpoint moves.
    res=$(curl_json GET "$API/admin/content/pool-gaps?limit=1" "" "$admin_tok")
    code="${res%%|*}"; body="${res#*|}"
    if [ "$code" = "200" ]; then
      pass "admin/content/pool-gaps 200"
    else
      fail "admin code=$code body=${body:0:200}"
    fi
  fi
fi

# --- 9. recent 5xx scan in ACA logs (Cloud Shell / CI with az) -----
step 9 "ACA logs — no 5xx in last 5 min (optional)"
if ! command -v az >/dev/null 2>&1; then
  skip "az CLI not in PATH"
else
  if ! az account show >/dev/null 2>&1; then
    skip "az not logged in"
  else
    # Fetch tail and count 5xx. Tail size 200 is enough for a freshly
    # restarted revision (~30s of traffic). status >= 500 covers all
    # server errors regardless of which interceptor emitted them.
    log_dump=$(az containerapp logs show -g "$RG" -n "$ACA" \
      --type=console --tail 200 --format text 2>/tmp/smoke.err || echo "")
    if [ -z "$log_dump" ]; then
      skip "az logs returned empty (cold revision?)"
    else
      five_xx=$(printf '%s' "$log_dump" | grep -cE '"statusCode":5[0-9]{2}|HTTP/[0-9.]+" 5[0-9]{2}' || true)
      if [ "$five_xx" = "0" ]; then
        pass "no 5xx in last 200 log lines"
      else
        fail "$five_xx 5xx hit(s) — inspect with: az containerapp logs show -g $RG -n $ACA --tail 200"
      fi
    fi
  fi
fi

# --- summary --------------------------------------------------------
echo ""
echo "────────────────────────────────────"
echo "Summary: ${G}${pass_count} pass${D} / ${R}${fail_count} fail${D} / ${Y}${skip_count} skip${D}"
if [ $fail_count -gt 0 ]; then
  printf 'Failed steps:%b\n' "$fail_steps"
  exit 1
fi
exit 0
