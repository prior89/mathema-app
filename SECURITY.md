# Security Policy

Thanks for helping keep **Matheo** and its users safe.

Matheo is an AI-powered NCERT math learning app for Indian Class 7-12 students.
This document describes how to report security vulnerabilities in this
repository and how we respond.

## Supported Versions

Matheo is currently in pre-beta. Only the `main` branch of this repository
receives security fixes. There are no tagged releases or long-term-support
branches at this time.

| Version       | Supported |
| ------------- | --------- |
| `main`        | Yes       |
| Other branches / forks | No |

## Reporting a Vulnerability

**Please do not open a public GitHub issue, pull request, or discussion for
security problems.** Public disclosure before a fix is available puts users at
risk.

Instead, email a private report to:

- **polopot123@gmail.com**

> Note: this is a placeholder personal address while the project is pre-beta.
> The maintainer plans to migrate to a dedicated `security@` alias before
> public launch — once that alias is live, update this file and any external
> references.

Please include as much of the following as you can:

- A description of the issue and the impact you believe it has.
- Steps to reproduce (proof-of-concept code, requests, screenshots).
- Affected component (`server/`, `app/`, `infra/`, a specific endpoint, etc.).
- Affected version / commit SHA.
- Your name / handle if you want credit in the acknowledgements.

We commit to:

1. Acknowledging your report within **3 business days**.
2. Providing an initial assessment within **10 business days**.
3. Working with you on a fix and coordinated disclosure within **90 days** of
   the initial report. If we need longer (e.g. dependency upstream is slow),
   we will tell you why and agree a revised timeline.
4. Crediting you in the release notes once the fix ships, unless you ask to
   remain anonymous.

We follow responsible / coordinated disclosure: we ask that you give us a
reasonable window to ship a fix before any public write-up, and we will do the
same in return.

## Scope

**In scope (report to this repo):**

- `server/` — NestJS backend, Prisma schema, API endpoints, auth.
- `app/` — React / Vite / Capacitor mobile and web client.
- `infra/` — Azure infrastructure-as-code, deployment scripts, CI workflows.
- Configuration files in the repo root (`.github/workflows/`, `docker-compose.yml`, etc.).

**Out of scope (report upstream):**

- `services/math-helper/` and `services/data/ncert/` are partner-maintained
  by **Karvy-Singh** under a 0-line modification policy in this repo. Please
  report issues in those directories to the upstream project:
  [github.com/Karvy-Singh/mathema](https://github.com/Karvy-Singh/mathema).
- Third-party services we integrate with (OpenAI, Mathpix, Azure, Google Play
  Billing, etc.) — please report directly to the relevant vendor.
- Social-engineering, physical security, and denial-of-service tests against
  production infrastructure.

## Safe Harbor

We will not pursue legal action against researchers who:

- Follow this policy in good faith.
- Avoid privacy violations, destruction of data, and degradation of service.
- Give us a reasonable time to remediate before public disclosure.

Thank you for helping protect Matheo's students.
