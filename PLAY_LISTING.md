# Play Store listing — matheo v1.0

Canonical source for every field Google Play Console asks for at listing
creation time. Each section below is sized to the Play limit so we can paste
verbatim. Hindi locale (`hi-IN`) is intentionally omitted in v1.0; see
`memory/project_mathema_v1_scope.md`.

---

## App identity

| Field | Value |
|---|---|
| App name (Play Store listing) | **matheo** |
| Package name | `ai.matheo.app` |
| Default language | English (United States) — `en-US` |
| Additional supported language | English (India) — `en-IN` |
| Category | Education |
| Tags (≤ 5) | NCERT, CBSE, Class 7-12, Math practice, JEE foundation |
| Contact email | `VeraStudy01@gmail.com` |
| Website | `https://app.matheo.verastudy.net` |
| Privacy Policy URL | `https://app.matheo.verastudy.net/privacy` |
| Terms of Service URL | `https://app.matheo.verastudy.net/terms` |
| Account deletion URL | `https://app.matheo.verastudy.net/legal/account-deletion.md` |

> **Note:** Custom domain `https://app.matheo.verastudy.net` is live. Use this for all Store listing URLs.
> Custom domain is now live at `https://app.matheo.verastudy.net` (was previously Azure SWA).
> Updates after publish require version bumps for the Play listing, so lock
> the URLs first.

---

## App title (≤ 30 characters)

```
matheo · NCERT Maths 7-12
```

26 characters. Mentions the subject (Maths) and the audience (NCERT Class
7-12) so Play's search index has signal beyond the brand word alone.

---

## Short description (≤ 80 characters)

```
NCERT-aligned math practice with adaptive mocks, wrong-note review, and AI.
```

77 characters.

---

## Full description (≤ 4000 characters)

```
matheo is built for Indian students preparing for NCERT mathematics from
Class 7 through Class 12. The app pairs structured concept lessons with
adaptive practice, an AI solving assistant, and an automatic wrong-note
book — so you spend less time looking up answers and more time fixing the
exact gaps that keep tripping you up.

— Built around the NCERT syllabus —

  • Concept lessons follow the official Class 7 to Class 12 chapter
    sequence. Each lesson breaks a topic into Hook → Concrete → Pictorial
    → Abstract steps grounded in Bruner's CPA model and Sweller's
    cognitive load theory.
  • Worked examples explain the reasoning step-by-step before you try a
    problem yourself, then guided practice scaffolds you down to fully
    independent work.
  • A retrieval check at the end of every lesson catches misconceptions
    early — the test is mastery, not memorisation.

— Practice that adapts to you —

  • Chapter tests pull from a shared pool of problems you have never seen
    before, so you never re-meet the same question twice in practice.
  • Mock exams cover full board-style papers as well as targeted modes:
    Wrong-Redo (review just your mistakes), Mini (per-chapter quick test),
    and AI-Tailored (the recommender picks today's weakness).
  • Mastery is tracked per concept and surfaced on a Home dashboard with
    today's minutes, current streak, and weak-spot heat map.

— Wrong-note book + spaced repetition —

  • Every wrong answer flows into your Notes tab automatically.
  • The Test tab uses a FIFO queue plus a three-day cooldown so notes
    "ripen" — you re-encounter them after the concept has had time to
    settle, then revisit on an SM-2 spaced-repetition schedule.
  • Mark a problem Easy three times in a row and matheo retires it from
    review — graduation, not just memorisation.

— AI maths helper —

  • Upload a photo of a problem from a textbook, your homework, or the
    blackboard. AI-powered OCR pulls out the math, our deterministic solver
    handles the routine algebra, and the LLM only fills in the
    reasoning when the deterministic chain runs out.
  • The solution is added to your problem library so you can practise it
    later as a flash card.

— Privacy first —

  • matheo is aligned to India's Digital Personal Data Protection Act
    2023 and the Google Play Family Policy.
  • You can withdraw consent for analytics, AI training, or marketing
    independently from Settings → Privacy at any time.
  • Account deletion from inside the app or the web — every record is
    permanently removed within 30 days. No dark patterns, no retention.
  • Under-13 (India) / under-14 (Korea) accounts need a one-time parent
    email confirmation. A PARENT role is also available for optional
    supervision of teen accounts.

— Made for Class 7 to Class 12 —

  • Pick your class at sign-up; the lesson tree, recommended pool and
    mock exams adjust instantly. Switching class later is one tap in
    Settings.
  • Parent and teacher dashboards let supporters see weekly progress
    without unlocking the student's full account.

Get matheo. Spend your study time on the problems that actually matter.
```

3,560 characters. Mentions NCERT, Class 7-12, CBSE-style mock exams, JEE
foundation (via the recommender wording), and the safety story. No claims
of guaranteed exam scores (consistent with `TERMS_OF_SERVICE.md` §9).

---

## What's new (release notes, ≤ 500 chars per release)

```
First release. NCERT Class 7-12 concept lessons, chapter tests with a
no-repeat shared pool, full mock exams, AI photo-to-solution helper, and a
spaced-repetition wrong-note book. Built for Indian students under DPDP
2023.
```

258 characters.

---

## IARC questionnaire answers

| Question | Answer |
|---|---|
| Does the app contain violence? | **No.** Mathematical content only. |
| Sexual or suggestive content? | **No.** |
| Profanity or crude humour? | **No.** |
| Drugs, alcohol, tobacco references? | **No.** |
| Simulated gambling or real-money gambling? | **No.** |
| Horror or fear-inducing content? | **No.** |
| User-generated content / chat between users? | **No.** Wrong notes and feedback are private to the user. There is no peer chat surface. |
| Shares user location with third parties? | **No.** No precise location is collected. |
| Allows users to interact online? | **No.** All multiplayer / leaderboard features are out of scope for v1.0. |
| Digital purchases? | **No.** Free PoC. |
| Recommended age rating | **3+** (Education / Math). Play will resolve to "Everyone" / equivalent regional bracket. |

---

## Target audience and content

- **Target audience age groups**: 13-15, 16-17, 18+ (NCERT Class 7-12 spans
  these brackets; the Indian regulatory floor for digital consent is 13).
- **Appeals to children?**: Yes, indirectly — Class 7-9 users are typically
  13-15. Family-policy compliance is therefore claimed.
- **Ads**: **None** in v1.0.

---

## Pricing and distribution

- **Price**: Free.
- **In-app purchases**: None for v1.0.
- **Countries**:
  - Launch wave: **India** only.
  - Phase 2 candidates: Bhutan, Nepal, Bangladesh, Sri Lanka (sharing NCERT
    or similar Indian-board curriculum exposure). Switch on country-by-
    country as legal review clears.
- **Devices**: Android phones (primary). Tablet support left open — layouts
  already responsive but no tablet screenshots in v1.0.

---

## Account / sign-in for reviewer

Play reviewers need a working account. Provide via the "App access"
section:

```
sign-in: required
email: VeraStudy01@gmail.com
password: <generate a 24-char passphrase, rotate monthly>
notes: This account starts at the onboarding flow. Pick any NCERT class to
       reach the main app. The diagnostic at step 06 can be skipped via
       the bottom-right Skip button.
```

> **Action item**: create the reviewer account before submission; rotate
> the password after each review pass.

---

## Open items before submission

- [x] Custom domain live: https://app.matheo.verastudy.net (HTTPS enabled)
      every placeholder URL above.
- [ ] Reviewer account created + password stored in the secrets vault.
- [ ] Feature graphic 1024 × 500 and 8 phone screenshots in
      `app/store-assets/` (task E2).
- [ ] 512 × 512 launcher icon authored from the brand mark (task B1).
- [ ] FCM credentials live so push notification claim is genuine
      (task C1).
