# Syntax: docker/dockerfile:1.4
FROM node:20-alpine AS alpine

# Set up pnpm on the alpine base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 1. Prune the monorepo to only include the server app and its dependencies
FROM alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune @project/server --docker

# 2. Add dependencies and build
FROM alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies (only what's needed for the pruned workspace)
COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
# Since we use prisma, we need to generate the client before building
RUN pnpm --filter @project/database run db:generate
RUN pnpm turbo run build --filter=@project/server

# 3. Production runner
FROM alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the pruned workspace so the compiled server can resolve its workspace
# packages (@project/database, @project/shared) and the pnpm install tree
# (store + per-package node_modules symlinks) exactly as in the builder.
# Docker COPY preserves symlinks, so relative workspace links keep working.
COPY --from=installer --chown=nestjs:nodejs /app/apps/server ./apps/server
COPY --from=installer --chown=nestjs:nodejs /app/packages/database ./packages/database
COPY --from=installer --chown=nestjs:nodejs /app/packages/shared ./packages/shared
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules

# Expose port (default 3000)
EXPOSE 3000
CMD ["node", "apps/server/dist/main"]
