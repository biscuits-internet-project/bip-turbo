FROM node:18-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN apk update

# Copy package files
COPY package.json package-lock.json ./
COPY packages/database/package.json ./packages/database/package.json
COPY packages/ts-config/package.json ./packages/ts-config/package.json
COPY apps/workers/package.json ./apps/workers/package.json

# Install dependencies
RUN npm ci

# Copy source files
COPY packages/database ./packages/database
COPY packages/ts-config ./packages/ts-config
COPY apps/workers ./apps/workers

# Build the app
RUN npm run build -w @bip/workers

FROM node:18-alpine AS runner
WORKDIR /app

# Copy built files
COPY --from=builder /app/package.json .
COPY --from=builder /app/package-lock.json .
COPY --from=builder /app/apps/workers/dist ./apps/workers/dist
COPY --from=builder /app/apps/workers/package.json ./apps/workers/package.json

# Install production dependencies
RUN npm ci --production

CMD ["node", "apps/workers/dist/index.js"] 