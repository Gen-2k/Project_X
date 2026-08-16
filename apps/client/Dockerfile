FROM node:22-alpine AS alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME/bin:$PATH"
RUN corepack enable

# 1. Prune the monorepo for the client
FROM alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN pnpm add -g turbo
COPY . .
RUN turbo prune @project/client --docker

# 2. Add dependencies and build
FROM alpine AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter=@project/client

# 3. Serve via NGINX (Unprivileged Non-Root Security Container)
FROM nginxinc/nginx-unprivileged:alpine AS runner
# Copy custom nginx configuration
COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
# The base image already runs as the non-root 'nginx' user, so switch to
# root to clear the default static assets, then drop back to unprivileged.
USER root
# Remove default nginx static assets
RUN rm -rf ./*
USER nginx
# Copy static assets from builder (COPY always runs as root)
COPY --from=installer /app/apps/client/dist .

EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]
