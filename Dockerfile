# ─── build ──────────────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /src

# Install dependencies from the lockfile first so this layer is cached across
# source changes.
COPY package.json package-lock.json* ./
RUN npm ci --no-audit --no-fund

COPY . .
RUN npm run build

# ─── runtime ────────────────────────────────────────────────────────────
FROM node:22-alpine

RUN addgroup -g 10001 cfn && adduser -D -u 10001 -G cfn cfn

WORKDIR /app
# Nitro's output is self-contained: no node_modules needed at runtime.
COPY --from=build --chown=cfn:cfn /src/.output /app/.output

USER cfn
ENV NODE_ENV=production NITRO_PORT=3000 NITRO_HOST=0.0.0.0
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:3000/ >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]
