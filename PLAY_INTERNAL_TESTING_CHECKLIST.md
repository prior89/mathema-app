# Matheo — Google Play Internal Testing 출시 체크리스트

> **대상**: v0.1.0 RC → Play Console **Internal testing** 트랙 첫 업로드  
> **패키지**: `ai.matheo.app`  
> **관련 문서**: `PLAY_BILLING_GATES.md` · `PLAY_LISTING.md` · `PLAY_DATA_SAFETY.md` · `README.md`  
> **최종 갱신**: 2026-06-11

이 문서는 **G0(인프라·코드)** → **G1(콘솔·AAB 업로드)** → **G2(결제 E2E)** → **G3(가입·학습 스모크)** 순서로 진행합니다.  
각 게이트의 **Sign-off** 체크박스를 모두 통과한 뒤 Internal testing 릴리스를 승인합니다.

---

## 빠른 참조

| 항목 | 값 |
|------|-----|
| 프론트엔드 | `https://app.matheo.verastudy.net` |
| 백엔드 (ACA) | `https://mathema-backend.redcoast-6e6508a7.centralindia.azurecontainerapps.io` |
| API 베이스 | `…/api/v1` |
| Privacy URL | `…/privacy` |
| Terms URL | `…/terms` |
| AAB 빌드 | GitHub Actions → **Android Release (AAB)** → artifact `matheo-aab` |
| 빌링 준비도 | `GET /admin/billing/readiness` |
| G1 프리플라이트 | `npm run billing:preflight` |

---

## G0 — 코드·인프라·자동화 (업로드 전 필수)

코드와 프로덕션 환경이 Internal testing 빌드와 **동일한 main 리비전**을 가리키는지 확인합니다.

### G0-A. CI / 로컬 품질 게이트

| # | 항목 | 방법 | 통과 기준 |
|---|------|------|-----------|
| 0.1 | `main` CI green | GitHub Actions **CI** 워크플로 | server jest + coverage, app tsc + vite build, android-compile 모두 성공 |
| 0.2 | 타입체크 | `npm run typecheck` | exit 0 (server + app) |
| 0.3 | 보호자 연령 단위 테스트 | `npm -w server exec -- npx jest guardian-consent.util.spec.ts` | KR 14세 / default 13세 케이스 통과 |
| 0.4 | 빌링 서버 테스트 | CI jest `billing/*` | 전체 통과 |
| 0.5 | 빌링 앱 단위 테스트 | CI vitest `billing-*` | 전체 통과 |
| 0.6 | Android 컴파일 | CI `android-compile` job | Java compile 성공 (Capacitor 8 + Play Billing 7.1.1) |

- [ ] G0-A 전체 통과

### G0-B. 프로덕션 배포·헬스

| # | 항목 | 방법 | 통과 기준 |
|---|------|------|-----------|
| 0.7 | 백엔드 배포 | `main` push → `backend-deploy.yml` | 최신 revision active |
| 0.8 | 프론트 배포 | `main` push → `frontend-deploy.yml` | Custom domain (`app.matheo.verastudy.net`) 최신 배포 |
| 0.9 | math-helper | `math-helper-deploy.yml` | sidecar healthy (internal ingress) |
| 0.10 | 프로덕션 스모크 (9항목) | `bash scripts/smoke-prod.sh <BACKEND_URL> <EMAIL> <PASSWORD> [ADMIN…]` | required 7항목 PASS (admin·az log는 SKIP 허용) |
| 0.11 | `/health/version` | curl 또는 smoke #2 | `gitSha` ≠ unknown, `dbMigrationHead` 존재 |

- [ ] G0-B 전체 통과

### G0-C. 프로덕션 시크릿·환경 (Key Vault / ACA)

| # | 변수 / 설정 | 용도 | 확인 |
|---|-------------|------|------|
| 0.12 | `JWT_SECRET` | 인증 | 설정됨 |
| 0.13 | `DATABASE_URL` | Postgres | migrate head 일치 |
| 0.14 | `REDIS_URL` | 캐시·큐·쿼터 | 연결 OK |
| 0.15 | `AI_LLM_API_KEY` | LLM·AI Solver | 키 유효 (quota gate 동작) |
| 0.16 | `ADMIN_EMAILS` | 관리자 콘솔 | 운영자 이메일 포함 |
| 0.17 | `VITE_GOOGLE_CLIENT_ID` | Google 로그인 (AAB 빌드 시) | GH secret 주입됨 |
| 0.18 | `GUARDIAN_PASS_ENABLED` | KR PASS 보호자 동의 | 의도한 값 (미설정 시 KR_EMAIL_OTP) |
| 0.19 | `BILLING_UI_ENABLED` | 페이월 킬스위치 | Internal testing 기간 `true` |

- [ ] G0-C 전체 확인

### G0-D. 콘텐츠·데이터

| # | 항목 | 통과 기준 |
|---|------|-----------|
| 0.20 | NCERT 문제 풀 | 프로덕션 Postgres `Problem` ≥ 2,100 (seed + bulk publish) |
| 0.21 | ConceptLesson | Class 7–12 챕터 카탈로그 API 200 |
| 0.22 | Attribution | `DraftPublisher` 거부 케이스 없음 (NCERT attribution 필수) |

- [ ] G0-D 전체 통과

### G0 Sign-off

- [ ] **G0 승인** — 위 항목 통과, Internal testing용 AAB 빌드 트리거 가능

---

## G1 — Play Console · AAB · 빌링 인프라 (조건부 GO)

자동화 준비가 완료된 뒤 AAB를 **Internal testing**에 업로드합니다.  
License tester 실제 구매 E2E는 **업로드 후** G2에서 수행합니다 (`PLAY_BILLING_GATES.md`).

### G1-A. 자동화 프리플라이트

```bash
npm run billing:preflight          # server/.env 로드 후 6항목 검사
curl -s <BACKEND>/api/v1/admin/billing/readiness   # admin JWT 필요
```

| # | 항목 | 통과 기준 |
|---|------|-----------|
| 1.1 | `billing:preflight` | exit 0 |
| 1.2 | `/admin/billing/readiness` | `g1.ready: true` |
| 1.3 | Kill switch | `BILLING_UI_ENABLED=false` 시 앱 재빌드 없이 페이월 숨김 확인 (스테이징 또는 문서화된 스모크) |

- [ ] G1-A 통과

### G1-B. 서버 `.env` / Key Vault (빌링)

```
PLAY_SERVICE_ACCOUNT_JSON=...          # androidpublisher scope
PLAY_PACKAGE_NAME=ai.matheo.app
PLAY_OBFUSCATED_ACCOUNT_SECRET=...     # ≥ 16 chars
RTDN_AUDIENCE=https://<backend>/api/v1/billing/rtdn
RTDN_SERVICE_ACCOUNT_EMAIL=...
BILLING_UI_ENABLED=true
```

- [ ] G1-B 변수 프로덕션 반영

### G1-C. Play Console — 수동

| # | 위치 | 작업 | 통과 기준 |
|---|------|------|-----------|
| 1.4 | Monetize → Subscriptions | `premium_monthly`, `premium_yearly` base plan **Active** | 5개국 가격 + 60일 intro (`launch-promo-60d`) |
| 1.5 | Settings → License testing | 테스터 Google 계정 등록 | 최소 2계정 (구매·복원 분리 테스트용) |
| 1.6 | Monetize → Monetization setup | RTDN Pub/Sub 연결 | Push → `POST /billing/rtdn` |
| 1.7 | RTDN 테스트 알림 | Console에서 test notification 전송 | HTTP 200, inbox `PROCESSED` |
| 1.8 | App integrity / Signing | Play App Signing 활성 | 업로드 키 ↔ 로컬 keystore 일치 |
| 1.9 | Data safety form | `PLAY_DATA_SAFETY.md` 대조 | 수집·공유·보안·삭제 URL 일치 |
| 1.10 | Store listing URLs | `PLAY_LISTING.md` | Privacy / Terms / 삭제 URL이 커스텀 도메인(`app.matheo.verastudy.net`)과 동일 |
| 1.11 | 스토어 에셋 | `store-assets/play-console/` | 아이콘 512, feature 1024×500, 스크린샷 2–8장 업로드 |
| 1.12 | 콘텐츠 등급·타겟 | Education, 아동 대상 정책 | 보호자 동의 플로우와 정합 |

- [ ] G1-C 전체 완료

### G1-D. AAB 빌드·업로드

```bash
# GitHub CLI 예시
gh workflow run android-release.yml --ref main
# 완료 후 Actions → Artifacts → matheo-aab 다운로드
```

| # | 항목 | 통과 기준 |
|---|------|-----------|
| 1.13 | AAB 빌드 | `android-release.yml` 성공, `ANDROID_VERSION_CODE` = run_number (중복 없음) |
| 1.14 | `VITE_API_BASE_URL` | CI 빌드에 프로덕션 ACA URL 주입됨 (WebView localhost 오류 방지) |
| 1.15 | Internal testing 업로드 | Play Console → Testing → Internal testing → Create release |
| 1.16 | 릴리스 노트 | Internal testers용 변경 요약 기재 | 
| 1.17 | 테스터 초대 | 이메일 또는 링크로 license tester 접근 가능 |

- [ ] G1-D 전체 완료

### G1 Sign-off

- [ ] `billing:preflight` exit 0
- [ ] `/admin/billing/readiness` → `g1.ready: true`
- [ ] RTDN 테스트 알림 처리 확인
- [ ] AAB Internal testing 트랙 **Published**
- [ ] **G1 승인**

---

## G2 — License Tester 결제 E2E (GO 재판정)

**License tester** 계정 + Internal testing 빌드(Play 스토어에서 설치)로 수행합니다.

### G2-A. 구매·복원·갱신

| # | 시나리오 | 기대 결과 |
|---|----------|-----------|
| 2.1 | 신규 월간 구독 | Play 결제 UI → verify → Premium 게이트 해제 |
| 2.2 | 구매 중 앱 강제 종료 | 재실행 → onResume sync → entitlement 복구 |
| 2.3 | Restore purchases | 페이월 Restore → `/billing/verify` → Premium |
| 2.4 | 월간 → 연간 업그레이드 | 새 토큰; 이전 토큰 `SubscriptionPurchaseToken` 보관; 끊김 없음 |
| 2.5 | Play에서 구독 취소 | RTDN `CANCELED`; `expiryTime`까지 이용 가능 |
| 2.6 | 환불 / voided | RTDN voided → API 재조회 → entitlement 즉시 해제 |

- [ ] 2.1–2.6 통과

### G2-B. RTDN·운영

| # | 시나리오 | 기대 결과 |
|---|----------|-----------|
| 2.7 | 클라이언트 verify 전 RTDN | inbox `ORPHAN` → verify 후 cron reconcile |
| 2.8 | Play API 일시 장애 | RTDN 503 → Pub/Sub retry → `RETRYABLE` 해소 |
| 2.9 | Inbox triage | `/admin/billing/rtdn-inbox?status=DEAD` **비어 있음** |

- [ ] 2.7–2.9 통과 또는 문서화

### G2-C. Premium 게이트 (403 → Paywall)

| 기능 | 트리거 | 기대 |
|------|--------|------|
| AI Solver quota | 9번째 무료 풀이 | `/app/paywall?reason=quota` |
| Weekly report | `/app/report` | `PremiumRequired` |
| Adaptive practice | adaptive study endpoint | 403 + 페이월 |

자동화(모킹): Playwright `app/e2e/billing-paywall.spec.ts`

- [ ] G2-C 수동 또는 E2E 확인

### G2 Sign-off

- [ ] 시나리오 2.1–2.6 license tester 빌드에서 통과
- [ ] `/admin/billing/readiness` → `g2.ready: true`
- [ ] `DEAD` RTDN 행 없음
- [ ] **G2 승인** — Closed testing 확대 가능

---

## G3 — 가입·온보딩·보호자·학습 스모크 (제품 QA)

Internal testing 빌드 또는 프로덕션 API에 연결된 Web/Android에서 수행합니다.  
v1 출시 UX: **`LAUNCH_STUDENT_ONLY = true`** — 학부모/교사 가입 UI 숨김.

### G3-A. v1 출시 UX·로케일

| # | 시나리오 | 기대 결과 |
|---|----------|-----------|
| 3.1 | `/register` 진입 | 학생만 표시; parent/teacher 카드 **없음** |
| 3.2 | `/onboarding` role 스텝 | **스킵** (role 스텝 없음) |
| 3.3 | 온보딩 첫 화면 — KR 기기/로케일 | 한국어 welcome (`detectOnboardingLang` → ko) |
| 3.4 | 온보딩 첫 화면 — IN/ID/AE | 영어 welcome |
| 3.5 | 국가 칩 KR 선택 후 | UI → 한국어 (`langForCountry`) |
| 3.6 | 설정 → 지역·언어 | 국가 PATCH + 언어 auto/ko/en 전환 동작 |

- [ ] G3-A 통과

### G3-B. 이메일 가입·온보딩 (성인 학생, IN)

| # | 단계 | 기대 결과 |
|---|------|-----------|
| 3.7 | Register → 이메일·비밀번호 | 계정 생성, `grantInitial` consent |
| 3.8 | 이메일 미인증 | `/verify-required` 리다이렉트 |
| 3.9 | 인증 후 로그인 | `postAuthPath` → `/onboarding` (birthDate 없음) |
| 3.10 | country → profile → goal → diagnostic → consents → ready | `completedAt` 저장, 홈 진입 |
| 3.11 | 재로그인 | 온보딩 스킵, `/app/home` |

- [ ] G3-B 통과

### G3-C. 미성년·보호자 동의 (국가별)

| # | 시나리오 | 기대 (KR / IN) |
|---|----------|----------------|
| 3.12 | IN, 만 12세 | 보호자 이메일 OTP 필요 (threshold **13**) |
| 3.13 | KR, 만 13세 | 보호자 동의 필요 (threshold **14**) |
| 3.14 | 보호자 이메일 발송 | 메일 수신, `/guardian-consent/verify?token=…` |
| 3.15 | 보호자 링크 클릭 | `guardianConsentVerifiedAt` 설정, 학생 앱 잠금 해제 |
| 3.16 | 보호자 완료 후 온보딩 | **goal** 스텝으로 이동 (welcome 역행 없음) |
| 3.17 | 보호자 미완료 API 호출 | 403 `guardian_consent_required` |
| 3.18 | birthDate 미입력 학생 | 403 `age_profile_required` |

**Register 경로 (미성년)** — 알려진 이슈, 반드시 수동 확인:

| # | 확인 | 현재 기대 vs 이슈 |
|---|------|-------------------|
| 3.19 | Register → 미성년 → 보호자 | 이상: 보호자 먼저 / **이슈 가능**: `/verify-required`가 먼저 (P1) |

- [ ] G3-C 통과 (3.19 이슈는 별도 기록)

### G3-D. Google 로그인

| # | 시나리오 | 기대 / 알려진 이슈 |
|---|----------|-------------------|
| 3.20 | Google 신규 가입 | 온보딩 진입 |
| 3.21 | Google + KR 사용자 | **P1**: 서버 `country: IN` 고정 가능 — 온보딩에서 KR 선택 후 PATCH로 보정되는지 확인 |
| 3.22 | Google 신규 consent | **P2**: `grantInitial` 호출 여부 확인 (설정 → 동의 화면) |

- [ ] G3-D 수행 및 이슈 티켓 연결

### G3-E. 핵심 학습 루프 (IN, Class 8 예시)

| # | 화면 / API | 기대 결과 |
|---|------------|-----------|
| 3.23 | Home | 오늘의 플랜·마스터리 스냅샷 표시 |
| 3.24 | Learn → 챕터 목록 | NCERT 카탈로그 로드 |
| 3.25 | Concept 5-step | HOOK → … → WORKED 진행·저장 |
| 3.26 | Practice 3-step MC | 채점·피드백 |
| 3.27 | Wrong notes | 오답 SM-2 큐 반영 |
| 3.28 | Mock exam (mini) | 결과·점수 추이 |
| 3.29 | AI Solver (무료) | 8회/일 quota; 9회째 페이월 (G2와 연동) |
| 3.30 | Me → Weekly report | Premium 게이트 (무료 시 페이월) |
| 3.31 | Settings | DPDP 동의·데이터보내기·계정 삭제 링크 동작 |

- [ ] G3-E 통과

### G3-F. 법적·정책 일치

| # | 항목 | 확인 |
|---|------|------|
| 3.32 | `/privacy`, `/terms` | 앱 내 WebView·SWA 동일 콘텐츠 |
| 3.33 | 청소년 analytics 기본값 | 정책 문구 vs 앱 기본 ON/OFF 일치 (**P2** 검토) |
| 3.34 | 계정 삭제 | Play Data safety 삭제 URL + in-app 삭제 플로우 |
| 3.35 | `CURRENT_GUARDIAN_POLICY_VERSION` | `2026-06-12` — 재동의 필요 시나리오 없음 |

- [ ] G3-F 통과

### G3 Sign-off

- [ ] 학생 전용 가입·온보딩·홈 진입 E2E 1회 이상 완주
- [ ] KR·IN 보호자 시나리오 각 1회 이상
- [ ] 학습 루프(개념→연습→오답) 1회 이상
- [ ] P1 이슈(3.19, 3.21) 재현 여부 기록
- [ ] **G3 승인**

---

## G4 — 디바이스·네트워크 매트릭스 (권장)

Internal testing은 최소 아래 조합에서 스모크합니다.

| 기기 클래스 | OS | 네트워크 | 필수 시나리오 |
|-------------|-----|----------|---------------|
| Pixel 클래스 (에뮬 또는 실기) | Android 13+ | Wi-Fi | G2 구매 + G3 온보딩 |
| 저사양 또는 구형 | Android 10–12 | Wi-Fi | 로그인 + Learn 1챕터 |
| 동일 기기 | — | 모바일 데이터 | API 타임아웃·재시도 UX |
| License tester 계정 | 최신 Internal 빌드 | — | Play 스토어 경유 설치 (sideload APK 아님) |

- [ ] G4 매트릭스 1행 이상 완료

---

## 출시 전 최종 승인 보드

| 게이트 | 승인자 | 날짜 | 비고 |
|--------|--------|------|------|
| G0 인프라·CI | | | gitSha: |
| G1 Console·AAB | | | versionCode: |
| G2 Billing E2E | | | |
| G3 제품 QA | | | |
| G4 디바이스 | | | |

**최종 GO 조건**: G0 + G1 필수. G2·G3는 Internal testing **첫 테스터 초대 전** 완료 권장.  
G2 미완 시 `BILLING_UI_ENABLED=false`로 결제 UI를 끄고 제품 플로우만 검증할 수 있음.

---

## 알려진 이슈 · 출시 차단 기준

### P1 — Internal testing 전에 수정 또는 명시적 수용 결정 필요

| ID | 이슈 | 영향 | 조치 |
|----|------|------|------|
| P1-1 | Google 온보딩 시 서버 `country: IN` 고정 | KR 보호자 threshold·커리큘럼 불일치 | 온보딩 country PATCH 직후 검증; 수정 전 KR Google 가입에 주의 |
| P1-2 | Register 미성년: `/verify-required` vs `/guardian-consent` 순서 | 보호자 메일 지연 | 3.19 수동 확인·수용 또는 핫픽스 |

### P2 — Internal testing 중 모니터링 (차단 아님)

| ID | 이슈 | 비고 |
|----|------|------|
| P2-1 | 청소년 analytics/marketing 기본값 vs 정책 문구 | Data safety·설정 UI 정합 |
| P2-2 | Google 신규 `grantInitial` 누락 가능성 | 동의 화면 빈 상태 확인 |
| P2-3 | `GuardianConsentPage` country별 sub 문구 | KR 전용 카피 미세 조정 |

### 아직 미배포 (Internal testing 차단 아님)

- FCM / push (`google-services.json`)
- VNet + private endpoints
- Family plan
- Custom domain live: `https://app.matheo.verastudy.net` (Azure SWA is now behind the custom domain)

---

## 롤백·비상 대응

### 앱·트랙

| 상황 | 조치 |
|------|------|
| 치명적 앱 버그 | Play Console → Internal testing → **이전 release로 프로모트** 또는 새 AAB 핫픽스 |
| 결제 사고 | `BILLING_UI_ENABLED=false` (서버 env) → 페이월 즉시 비활성 |
| RTDN 폭주·DEAD 적체 | `/admin/billing/rtdn-inbox?status=DEAD` 확인 → `POST …/reprocess` |

### 백엔드

```bash
az containerapp revision restart -g mathema-prod-cin -n mathema-backend
az containerapp logs show -g mathema-prod-cin -n mathema-backend --tail 200
```

| 상황 | 조치 |
|------|------|
| 배포 후 5xx 급증 | 이전 ACA revision으로 traffic split 복구 |
| KV / PG public access | README Operator runbook — `public-access Enabled` 재적용 |

### 프론트엔드

- SWA 이전 배포로 rollback (GitHub Actions 재실행 또는 Azure Portal)

---

## 유용한 명령·엔드포인트

```bash
npm run billing:preflight
npm run typecheck
npm -w server exec -- npx jest guardian-consent.util.spec.ts --runInBand
gh workflow run android-release.yml --ref main
bash scripts/smoke-prod.sh "$SMOKE_BACKEND_URL" "$SMOKE_USER_EMAIL" "$SMOKE_USER_PASSWORD"
```

| Endpoint | 용도 |
|----------|------|
| `GET /admin/billing/readiness` | G1/G2 자동 준비도 |
| `GET /admin/billing/rtdn-inbox?status=ORPHAN` | RTDN 고아 백로그 |
| `GET /admin/billing/rtdn-inbox?status=DEAD` | 처리 실패 행 |
| `POST /admin/billing/rtdn-inbox/:id/reprocess` | 수동 재처리 |
| `GET /health/live` · `GET /health/version` | 배포 검증 |

---

## 다음 단계 (Internal testing 이후)

1. G2 완료 → **Closed testing** (지인·파일럿 교사 그룹)
2. 스토어 리스팅·스크린샷 A/B 피드백 반영
3. P1 이슈 클로즈 후 **Open testing** 검토
4. Production staged rollout (5% → 20% → 100%)

---

*이 체크리스트는 `PLAY_BILLING_GATES.md`의 G1/G2를 확장한 운영 문서입니다. Play Console 정책·가격 변경 시 `PLAY_DATA_SAFETY.md`와 `PLAY_LISTING.md`를 먼저 갱신하세요.*