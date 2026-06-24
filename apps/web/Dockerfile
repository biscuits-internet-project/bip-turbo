FROM oven/bun:1.3.5-debian AS base

# Build the app
FROM base AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
COPY apps/web/package.json ./apps/web/
COPY packages/core/package.json ./packages/core/
COPY packages/domain/package.json ./packages/domain/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Generate Prisma client first
RUN cd packages/core && DATABASE_URL=postgresql://dummy bun prisma generate --schema=src/_shared/prisma/schema.prisma

# Build packages
RUN cd packages/core && bun run build
RUN cd packages/domain && bun run build

# Build web app
RUN cd apps/web && bun run build

# Production image
FROM base AS runner
WORKDIR /app

# Copy workspace packages
COPY --from=builder /app/package.json /app/bun.lock ./
COPY --from=builder /app/packages/core/package.json ./packages/core/
COPY --from=builder /app/packages/domain/package.json ./packages/domain/
COPY --from=builder /app/packages/core/dist ./packages/core/dist
COPY --from=builder /app/packages/domain/dist ./packages/domain/dist

# Copy core source: Prisma schema + migrations, plus the services that
# deploy-time scripts (scripts/recompute-pending.ts) import and bun runs directly.
COPY --from=builder /app/packages/core/src ./packages/core/src
# Copy deploy-time scripts run from docker-entrypoint.sh.
COPY --from=builder /app/packages/core/scripts ./packages/core/scripts

# Copy the quonfig feature-flag workspace; @quonfig/node reads it from disk at
# runtime (local/offline datadir mode). QUONFIG_DATADIR below points here.
COPY --from=builder /app/quonfig ./quonfig

# The dev @bip/domain package.json points main/exports at ./src/index.ts, but the
# runner only ships packages/domain/dist (not src). When the deploy-time script
# runs core's raw TS, its `import "@bip/domain"` must resolve to the built dist —
# rewrite the runner copy's entry points to dist so resolution succeeds.
RUN cd packages/domain && \
    sed -i 's#"./src/index.ts"#"./dist/index.js"#g' package.json

# Copy web app
COPY --from=builder /app/apps/web/build ./apps/web/build
COPY --from=builder /app/apps/web/package.json ./apps/web/

# Install dependencies and generate Prisma client
WORKDIR /app/packages/core
RUN bun add prisma@7.2.0 @prisma/adapter-pg@7.2.0 && \
    bun prisma generate --schema=src/_shared/prisma/schema.prisma

WORKDIR /app/apps/web
RUN bun install --production

COPY apps/web/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

ENV NODE_ENV=production
ENV PORT=8080
# quonfig local/offline datadir (absolute so it resolves regardless of cwd).
ENV QUONFIG_DATADIR=/app/quonfig
ENV QUONFIG_ENVIRONMENT=production

EXPOSE 8080

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["bun", "run", "start"]
