# Math Helper Service

Python AI solving and assessment service used by the main NestJS backend.

## Local Setup

```bash
npm run math-helper:install
npm run dev:math-helper
```

The root `npm run dev` starts this service together with the backend and frontend.

The NestJS backend calls it through `MATH_HELPER_URL`, defaulting to `http://localhost:8000`.

## Data Sources

- Static curriculum JSON lives in `services/math-helper/data/ncert`.
- Student learning profile is supplied by the NestJS backend from Prisma/Postgres.
- The local JSON student store is only used if this Python service is called directly with a `userId` and no injected `studentProfile`.
