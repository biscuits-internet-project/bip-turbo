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
# Copy production dependencies and built files
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/pnpm-lock.yaml /app/pnpm-lock.yaml
COPY --from=builder /app/apps/web/package.json /app/apps/web/package.json
# Copy all package build outputs
COPY --from=builder /app/packages/*/dist /app/packages/*/dist
COPY --from=builder /app/apps/web/build /app/apps/web/build

# Install production dependencies only
RUN pnpm install --prod
CMD ["pnpm", "start"]