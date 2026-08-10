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
RUN pnpm --filter @project/database run generate
RUN pnpm turbo run build --filter=@project/server

# 3. Production runner
FROM alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copy the built output from installer
COPY --from=installer --chown=nestjs:nodejs /app/apps/server/dist ./dist
COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/apps/server/package.json .

# Expose port (default 3000)
EXPOSE 3000
CMD ["node", "dist/main"]
