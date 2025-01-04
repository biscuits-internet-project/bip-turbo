# Base node image
FROM node:22-slim as base
RUN apt-get update && apt-get install -y openssl

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Install dependencies
FROM base as deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile
RUN pnpm --filter database generate

# Build the app
FROM deps as build
WORKDIR /app
COPY . .
RUN pnpm run build

# Production image
FROM base
WORKDIR /app
USER node

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=build /app/apps/web/build ./apps/web/build
COPY --from=build /app/apps/web/public ./apps/web/public
COPY --from=build /app/package.json ./
COPY --from=build /app/apps/web/package.json ./apps/web/

ENV NODE_ENV=production
ENV PORT=8080

CMD ["pnpm", "run", "--filter", "web", "start"] 