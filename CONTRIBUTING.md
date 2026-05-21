# Contributing to Matheo

Thanks for your interest in contributing to **Matheo** — the AI-powered NCERT
math learning app for Indian Class 7-12 students.

This document is intentionally short. If something here conflicts with the
`README.md`, the README wins for setup instructions and this file wins for
process.

## Code of Conduct

Be kind. Assume good intent. Matheo serves school-age students, so we hold
ourselves to a high bar on respectful communication in commits, reviews, and
issues.

## Commit Messages — Conventional Commits

This repository uses [Conventional Commits](https://www.conventionalcommits.org/)
with a scope prefix. Look at recent history for examples:

```
feat(study): add wrong-answer redo flow
fix(ux): align Hindi subject pill on small screens
chore(deps): bump prisma to 5.22
refactor(server): extract mock-exam aggregation helper
docs(readme): clarify Android release steps
```

Common types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`, `perf`,
`ci`, `build`.

Common scopes: `server`, `app`, `study`, `mock`, `ux`, `auth`, `infra`,
`deps`, `release`.

## Local Setup

See **Quick start** in [`README.md`](./README.md). The short version:

```bash
npm install
npm -w server run dev   # NestJS API
npm -w app run dev      # Vite + React client
```

If you touch the Prisma schema you will also need:

```bash
npm -w server exec prisma generate
npm -w server exec prisma migrate dev --name <short-description>
```

## Language Policy

- **Code is English-only.** Identifiers, comments, log messages, commit
  messages, and PR descriptions must be in English. This includes variable
  names, file names, and string literals that ship to users (those should be
  routed through i18n).
- **Discussion is Korean-friendly.** GitHub issue threads, PR review
  conversations, and design docs may be written in Korean or English — use
  whichever lets you communicate clearly with the other reviewer.

## Partner-Maintained Directories — 0-Line Modification Policy

The following directories are owned by **Karvy-Singh** (partner) and **must
not be modified** in PRs raised against this repo:

- `services/math-helper/app/**`
- `services/data/ncert/**`
- `scripts/ncert-pdf-extract/**`

If you find a bug or want a change in these areas, open an issue against the
upstream repo: [github.com/Karvy-Singh/mathema](https://github.com/Karvy-Singh/mathema).
Changes that span both sides should be coordinated with Karvy first.

## Pull Request Checklist

Before requesting review, please confirm:

- [ ] Typecheck passes locally:
  - `npm -w server run typecheck`
  - `npm -w app exec tsc -- --noEmit`
- [ ] Lint passes (`npm -w server run lint`, `npm -w app run lint` where
      applicable).
- [ ] Server unit tests pass: `npm -w server run test` (Jest).
- [ ] No `console.log` (or equivalent stray debug output) on production code
      paths. Use the project logger.
- [ ] No committed secrets: API keys, `.env` files, keystores, passwords,
      OAuth client secrets, etc. The `.gitignore` should catch most of these,
      but please double-check the diff.
- [ ] Commits follow Conventional Commits (see above).
- [ ] All identifiers and comments are in English.
- [ ] The Karvy 0-line policy is respected.

### Schema Changes

Any change to `server/prisma/schema.prisma` **must** ship with a matching
Prisma migration in `server/prisma/migrations/`. Do not edit existing
migrations — generate a new one. Migrations are reviewed carefully because
they run automatically on deploy.

## Questions

Open a GitHub issue and tag the maintainer (@prior89). For security issues
see [`SECURITY.md`](./SECURITY.md) — do not open a public issue.
