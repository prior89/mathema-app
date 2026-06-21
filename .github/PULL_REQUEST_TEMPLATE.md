# Pull Request

> Title should follow [Conventional Commits](https://www.conventionalcommits.org/)
> with a scope, e.g. `feat(study): add wrong-answer redo flow`,
> `fix(ux): align Hindi subject pill`, `chore(deps): bump prisma`.

## Summary

<!-- One or two sentences. What does this PR do, at a glance? -->

## Why

<!-- The motivation. Link the issue (`Closes #123`) or describe the user
problem this solves. If it came out of a meeting / chat, note that. -->

## Changes

<!-- Bullet list of the meaningful changes. Skip trivial whitespace edits. -->

-
-
-

## Risk

<!-- What could break? Which surfaces (server endpoints, app screens, jobs,
infra) are touched? What is the blast radius if something is wrong? -->

## Test Plan

<!-- How did you verify this? Include commands you ran and what you observed.
At minimum the PR checklist below should be green. -->

- [ ] `npm -w server run typecheck`
- [ ] `npm -w app exec tsc -- --noEmit`
- [ ] `npm -w server run test` (Jest)
- [ ] Lint
- [ ] Manual smoke test of the affected screen / endpoint

## Screenshots / Recordings (optional)

<!-- For UI changes, please attach before / after. -->

## Checklist

- [ ] Commit messages follow Conventional Commits with a scope.
- [ ] Code, comments, and identifiers are in English.
- [ ] No `console.log` or stray debug output on production paths.
- [ ] No committed secrets (`.env`, keystores, API keys, OAuth secrets).
- [ ] **Schema migration**: if `server/prisma/schema.prisma` changed, a
      matching new migration is included in `server/prisma/migrations/`.
      (Tick "N/A" by deleting this line if no schema changes.)
- [ ] **Privacy / consent impact**: this PR does not introduce new data
      collection, third-party processors, or PII flows without updating
      `PRIVACY_POLICY.md` and `PLAY_DATA_SAFETY.md`. (Tick "N/A" if not
      applicable.)
