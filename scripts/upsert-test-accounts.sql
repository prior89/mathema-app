\set ON_ERROR_STOP on

\if :{?password}
\else
\echo 'Missing password variable. Usage: psql "$DATABASE_URL" -v password="$TEST_ACCOUNT_PASSWORD" -f scripts/upsert-test-accounts.sql'
\quit 1
\endif

CREATE EXTENSION IF NOT EXISTS pgcrypto;

WITH input(email, name, country) AS (
  VALUES
    ('polopot123@gmail.com', 'KR Test', 'KR'),
    ('polopot12@gmail.com',  'IN Test', 'IN')
),
upserted AS (
  INSERT INTO "User" (
    "id",
    "email",
    "passwordHash",
    "name",
    "examDate",
    "targetGrade",
    "gradeLevel",
    "country",
    "role",
    "deletedAt",
    "emailVerifiedAt",
    "createdAt",
    "updatedAt"
  )
  SELECT
    gen_random_uuid()::text,
    input.email,
    crypt(:'password', gen_salt('bf', 12)),
    input.name,
    TIMESTAMP '2027-02-14',
    3,
    NULL,
    input.country::"CountryCode",
    'STUDENT'::"UserRole",
    NULL,
    NOW(),
    NOW(),
    NOW()
  FROM input
  ON CONFLICT ("email") DO UPDATE
  SET
    "passwordHash" = EXCLUDED."passwordHash",
    "country" = EXCLUDED."country",
    "deletedAt" = NULL,
    "emailVerifiedAt" = NOW(),
    "updatedAt" = NOW()
  RETURNING "id", "email", "country", "role", "emailVerifiedAt"
),
consent_inserted AS (
  INSERT INTO "Consent" (
    "id",
    "userId",
    "kind",
    "policyVersion",
    "grantedAt",
    "ipAddress",
    "userAgent"
  )
  SELECT
    gen_random_uuid()::text,
    upserted."id",
    'DATA_PROCESSING'::"ConsentKind",
    '2026-05-21',
    NOW(),
    'ops-sql',
    'upsert-test-accounts.sql'
  FROM upserted
  WHERE NOT EXISTS (
    SELECT 1
    FROM "Consent" c
    WHERE c."userId" = upserted."id"
      AND c."kind" = 'DATA_PROCESSING'::"ConsentKind"
      AND c."policyVersion" = '2026-05-21'
      AND c."revokedAt" IS NULL
  )
  RETURNING "userId"
),
tokens_closed AS (
  UPDATE "EmailVerificationToken" evt
  SET "usedAt" = NOW()
  FROM upserted
  WHERE evt."email" = upserted."email"
    AND evt."usedAt" IS NULL
  RETURNING evt."id"
)
SELECT
  upserted."email",
  upserted."country",
  upserted."role",
  upserted."emailVerifiedAt",
  EXISTS (
    SELECT 1
    FROM "Consent" c
    WHERE c."userId" = upserted."id"
      AND c."kind" = 'DATA_PROCESSING'::"ConsentKind"
      AND c."policyVersion" = '2026-05-21'
      AND c."revokedAt" IS NULL
  ) AS "dataProcessingActive"
FROM upserted
ORDER BY upserted."email";
