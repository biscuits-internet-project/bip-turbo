FROM oven/bun:1.2.4-alpine AS base

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

# Copy Prisma files
COPY --from=builder /app/packages/core/src/_shared/prisma ./packages/core/src/_shared/prisma

# Copy web app
COPY --from=builder /app/apps/web/build ./apps/web/build
COPY --from=builder /app/apps/web/package.json ./apps/web/

WORKDIR /app/apps/web

# Install production dependencies and generate Prisma client
RUN bun install --production && \
    cd ../packages/core && \
    DATABASE_URL=postgresql://dummy bun prisma generate --schema=src/_shared/prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080

CMD ["bun", "run", "start"]