FROM oven/bun:1.2.4-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY apps/workers/package.json ./apps/workers/
COPY packages/core/package.json ./packages/core/
COPY packages/domain/package.json ./packages/domain/

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the app
RUN cd apps/workers && bun run build

FROM oven/bun:1.2.4-alpine AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/apps/workers/dist ./apps/workers/dist
COPY --from=builder /app/apps/workers/package.json ./apps/workers/

# Install production dependencies
WORKDIR /app/apps/workers
RUN bun install --production

# Set up permissions properly
USER bun

CMD ["bun", "run", "start"] 