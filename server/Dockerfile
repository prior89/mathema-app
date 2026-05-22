# =============================================================
#  Mathēma backend — production Dockerfile (monorepo-aware)
#  Build context = repo root. We use npm workspaces so dependencies
#  live in the root package-lock.json; this Dockerfile copies that
#  lock + the server workspace manifest, then `npm ci --workspace=...`
#  installs only the backend's deps.
# =============================================================

# ----- stage 1: install deps (cached) -----
FROM node:20-alpine AS deps
WORKDIR /repo
COPY package.json package-lock.json ./
# Root postinstall is `node scripts/sync-env.cjs` — a dev-only helper that
# copies the root .env into each workspace. It exits 0 when no .env exists,
# which is exactly the case in CI. Copy it so npm can run the hook.
COPY scripts/sync-env.cjs ./scripts/sync-env.cjs
COPY server/package.json ./server/
# server/package.json now declares "postinstall": "prisma generate" so the
# local-dev npm install regenerates the client whenever a teammate pulls a
# schema change. That hook fires inside `npm ci` too, so the schema must
# already be on disk at this stage even though the build stage will run
# prisma generate again — without it `npm ci` exits 1 with "schema.prisma:
# file not found". Schema changes invalidate this layer's cache, but that's
# acceptable: schema edits should rebuild deps anyway since they typically
# come with prisma-version or @prisma/client version bumps.
COPY server/prisma ./server/prisma
RUN npm ci --workspace=mathema-backend --include-workspace-root=false --include=dev

# ----- stage 2: build (TypeScript + Prisma client) -----
FROM node:20-alpine AS build
WORKDIR /repo
# npm workspaces hoist everything into /repo/node_modules; there is no
# server/node_modules at the deps stage (server resolves up the tree).
COPY --from=deps /repo/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY server ./server
WORKDIR /repo/server
RUN npx prisma generate && npm run build
# drop dev deps from the runtime tree
WORKDIR /repo
RUN npm prune --omit=dev --workspace=mathema-backend --include-workspace-root=false

# ----- stage 3: runtime -----
FROM node:20-alpine
LABEL org.opencontainers.image.title="mathema-backend" \
      org.opencontainers.image.source="https://github.com/prior89/mathema-app"

# Prisma's prebuilt engines link against OpenSSL at runtime. Alpine 3.17+ ships
# OpenSSL 3.x, and we tell schema.prisma to use the matching engine target —
# but we still need the openssl library itself installed in the runtime image.
RUN apk add --no-cache curl tini openssl libssl3 \
 && addgroup -S app && adduser -S app -G app

WORKDIR /app
ENV NODE_ENV=production \
    PORT=4000 \
    NODE_OPTIONS="--enable-source-maps"

# Flatten the workspace layout into /app — runtime doesn't need the monorepo shape.
# Workspaces hoist deps to the repo-root node_modules, so we ship that one.
COPY --from=build --chown=app:app /repo/server/dist          ./dist
COPY --from=build --chown=app:app /repo/node_modules         ./node_modules
COPY --from=build --chown=app:app /repo/server/prisma        ./prisma
COPY --from=build --chown=app:app /repo/server/package.json  ./

USER app
EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:4000/api/v1/health/live || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
