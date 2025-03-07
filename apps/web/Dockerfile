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

# Generate Prisma client before building
RUN cd packages/core && bun prisma:generate:prod

# Build the app
RUN cd apps/web && bun run build

# Production image
FROM base AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/web/build ./apps/web/build
COPY --from=builder /app/apps/web/package.json ./apps/web/

# Install production dependencies
WORKDIR /app/apps/web
RUN bun install --production

# Set up permissions properly
USER bun

EXPOSE 8080

CMD ["bun", "run", "start"]