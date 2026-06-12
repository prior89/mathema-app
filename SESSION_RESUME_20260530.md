# 2026-05-30 세션 핸드오프

내일 이 파일 + Claude memory `project_mathema_session_resume_20260530.md` 를 읽고 그대로 이어서 진행.

## 오늘 한 것 (작업 디렉토리: `mathema-app/`)

### KR↔IN parity (Track A) — 완료
- **G2** `server/src/modules/recommendations/services/adaptive-next-problem.service.ts`
  - `ERROR_CODE_LABEL_EN` 18개 매핑 추가
  - `buildReason(country)` + `coldStart` reason — KR=한국어 / IN=영어 분기
- **G3** `app/src/lib/translations.ts`
  - `solo.done.again.body` EN 갱신 (1-step Study Try Again 의미로)
  - Hindi pack은 `solo.*` 전체 EN 폴백 의도라 유지
- **G1 / G4** 추가작업 불필요 — 기존 NCERT 코드가 이미 user-aware + mastered-gate

### P0 Play Store 보안/정책 (Track B) — 완료
- **P0-1** `AuthContext.tsx`에서 demo cred 폴백 제거 + `app/.env.production` 신설 + `.env.example` 갱신
- **P0-2** `/privacy`, `/terms` 공개 라우트 (`PolicyPage.tsx`) + 백엔드 `@Public()` + Onboarding `<span>` → `<Link>`
- **P0-3** 빌드 후 dist leak scan: `polopot123`/`password1234`/`localhost:4000` 0건 (진원: `auth.seedHint` dead key)
- **P0-4** `npx cap sync android` → Android assets 갱신 (동일하게 0 leak)
- **P0-5** Signed AAB 재빌드 → **`release/matheo-1.0-vc2-20260530.aab`** (8.0 MB, versionCode=2, leak 0)
  - 부수 수정: `app/android/app/build.gradle` line 14 `versionCode (...)` → `versionCode = (...)` Groovy 파서 모호성 해결

## 미커밋 변경 파일 (내일 git status로 재확인)
```
server/src/modules/recommendations/services/adaptive-next-problem.service.ts
server/src/modules/privacy/privacy.controller.ts
app/src/context/AuthContext.tsx
app/src/pages/OnboardingPage.tsx
app/src/pages/PolicyPage.tsx          (신규)
app/src/App.tsx
app/src/lib/queries.ts
app/src/lib/translations.ts
app/.env.production                    (신규, gitignored)
app/.env.example
app/android/app/build.gradle
app/android/app/src/main/assets/public/   (cap sync 산출물)
release/matheo-1.0-vc2-20260530.aab    (신규)
```

## 내일 시작 — Next Actions (우선순위)

1. **Play Console 가입 + 자산 준비** (블로커)
   - 아이콘 512×512, Feature graphic 1024×500, 스크린샷 1080×1920 2장 이상, 설명문
   - Privacy URL: `https://<deployed-spa>/privacy`

2. **#19 prod smoke 표준화** — 9항목 (health/version/login/chapter/C11-CH04/mastery/question/console/500log)
   - 먼저 prod backend wake: `https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io/api/v1/health/live`

3. **Play Billing 7 → 8** (deadline 2026-08-31)
   - `app/android/app/build.gradle` line 70: `:7.1.1` → `:8.0.0`
   - `BillingPlugin.java` 사용 API는 unchanged 예상이라 빌드 + 실기기 회귀 위주

4. **FCM 자격증명 + push**
5. **#44 CHAPTER_MISMATCH 511건 재분류**
6. **#29 NO_CORRECT_OPTION 자동 fix**

## 빌드 재현

```bash
cd app && npx vite build
npx cap sync android
set -a; source ../.keystore.env; set +a
export ANDROID_VERSION_CODE=3   # 이전 + 1
./android/gradlew.bat -p ./android bundleRelease
```

## 주의

- 다음 AAB는 `ANDROID_VERSION_CODE=3` 이상 — Play Console은 중복 vc 거부
- prod migration 새로 머지 시 dist push 전 `prisma migrate deploy` 먼저 (`feedback_migration_before_dist`)
- `.keystore.env` 키스토어 비밀번호는 절대 채팅에 paste 금지 (`feedback_never_paste_secrets`)
