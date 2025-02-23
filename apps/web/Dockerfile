FROM node:22-alpine AS base
RUN npm install -g pnpm
RUN npm install -g turbo

FROM base AS builder
WORKDIR /app
# Copy all files needed for building
COPY . .
# Install all dependencies (including devDependencies)
RUN pnpm install
# Build web and all its dependencies
RUN turbo run build --filter=@bip/web...

FROM base AS runner
WORKDIR /app
# Copy root workspace files
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

# Create directories based on the source structure
COPY --from=builder /app/packages /app/packages
COPY --from=builder /app/apps/web /app/apps/web

# Install production dependencies
RUN pnpm install --prod

WORKDIR /app/apps/web
CMD ["pnpm", "start"]