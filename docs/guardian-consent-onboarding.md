# Guardian Consent Onboarding Contract

Status: accepted product flow
Last reviewed: 2026-06-14

## Product Decision

Guardian consent is an approval step in a student's onboarding. It is not a
parent signup flow and it does not create a parent account.

The canonical flow is:

1. A student starts registration and provides their country and age.
2. If guardian consent is not required, the student continues normally.
3. If guardian consent is required, the student enters a restricted
   `AWAITING_GUARDIAN` state and sends an approval email.
4. The guardian opens the email link, reviews the notice, and explicitly
   approves.
5. The guardian sees a terminal success page and closes the page. There is no
   login, signup, parent dashboard, or redirect into the student app.
6. The student's waiting page detects the approval and automatically advances
   to the next onboarding step.

## State Machine

```text
STUDENT_REGISTERING
  |-- consent not required --------------------> STUDENT_CONTINUES
  |
  `-- consent required
         |
         v
AWAITING_GUARDIAN -- send/resend email --> GUARDIAN_REVIEW
         ^                                     |
         |                                     | explicit approve
         |                                     v
         `-- expired/changed email ------- CONSENT_VERIFIED
                                                   |
                                                   v
                                           STUDENT_CONTINUES

GUARDIAN_REVIEW -- invalid/expired link --> TERMINAL_ERROR
CONSENT_VERIFIED ------------------------> GUARDIAN_TERMINAL_SUCCESS
```

## Invariants

- Only the student session advances through onboarding.
- Guardian approval never issues a student, parent, or guardian auth token.
- Guardian approval never signs the guardian into Mathema.
- The guardian success page is terminal: it only says the approval is complete
  and the page may be closed.
- The student remains restricted until the server records verified consent.
- The student page must recover automatically from refreshes, temporary network
  failures, and short cache delays after approval.
- Sending a new approval email invalidates every older unused link for that
  request.
- Changing the guardian email invalidates links sent to the previous address.
- Approval is idempotent. A repeated approval must not create another account,
  relationship, or session.
- Parent dashboard linking is a separate feature and must not be coupled to
  guardian consent.

## Country Thresholds

- Korea: guardian consent below age 14.
- India: product gate below age 18.
- Other or unknown countries currently use the stricter age-18 default until a
  country-specific policy is implemented.

These thresholds define product routing. The verification method and the data
that may be stored before approval require separate country-specific legal
review. Product copy must not claim that email possession alone proves full
statutory compliance.

## Acceptance Criteria

- After guardian approval, the guardian receives no auth credentials and stays
  on the terminal success page.
- A waiting student advances without refreshing or signing in again.
- A waiting student who refreshes resumes polling and still advances.
- A transient `/users/me` failure delays progression but does not permanently
  strand the student.
- After resend or guardian email change, old links return invalid or expired.
- The approval email states that approval lets the student continue and does
  not create a parent account.

## Known Follow-up

The current backend creates a restricted student account before approval. A
separate legal-hardening phase must minimize pre-consent data and determine the
required guardian identity and adult-verification method for each country.
