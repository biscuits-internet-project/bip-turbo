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
# Copy root workspace files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
# Copy all package.json files at once
COPY **/package.json ./**/
# Install all dependencies including dev dependencies
RUN pnpm install --frozen-lockfile
# Generate Prisma client
RUN pnpm --filter database generate

# Build the app
FROM deps as build
WORKDIR /app
# Copy all source files
COPY . .
# Install dependencies with dev dependencies to ensure build tools are available
RUN pnpm install --frozen-lockfile
# Build only the web package
RUN pnpm --filter @bip/web build

# Production image
FROM base
WORKDIR /app

# Copy necessary files for pnpm
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/apps/web/package.json ./apps/web/
COPY --from=build /app/apps/web/build ./apps/web/build
COPY --from=build /app/apps/web/public ./apps/web/public

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Switch to node user after installing dependencies
USER node

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

WORKDIR /app/apps/web
CMD ["pnpm", "exec", "remix-serve", "--host", "0.0.0.0", "./build/server/index.js"]