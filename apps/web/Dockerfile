FROM node:22-alpine AS base
RUN npm install -g pnpm
RUN npm install -g turbo

# Prune the workspace to only what's needed for web
FROM base as pruner
WORKDIR /app
COPY . .
RUN turbo prune @bip/web --docker

# Build the app
FROM base AS builder
WORKDIR /app
# Copy the pruned workspace
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
# Copy source code after installing dependencies
COPY --from=pruner /app/out/full/ .
RUN pnpm run build --filter=@bip/web...

# Production image
FROM base AS runner
WORKDIR /app
COPY --from=builder /app .

# Set up permissions properly
RUN chown -R node:node /app
RUN chmod +x /app/packages/core/node_modules/.bin/*
USER node

# Add migrations script explicitly
RUN echo "#!/bin/sh\ncd /app/packages/core && pnpm drizzle-kit push:pg" > /app/migrate.sh
RUN chmod +x /app/migrate.sh

WORKDIR /app/apps/web
EXPOSE 8080
CMD ["pnpm", "start"]