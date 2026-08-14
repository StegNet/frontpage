# ---------------------------------------------------------------------------
FROM oven/bun:1 AS deps
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ---------------------------------------------------------------------------
# Stage: build — produce the static export in `out/`
# ---------------------------------------------------------------------------
FROM deps AS build
WORKDIR /usr/src/app

# Build-time metadata baked into the client bundle.
ARG VERSION
ARG COMMIT_SHA
ENV NEXT_PUBLIC_APP_VERSION=${VERSION#v}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA:-localbuild}

# Application source and build-time config.
# NOTE: sentry.server.config.ts / sentry.edge.config.ts are intentionally NOT
# copied — the server/edge runtimes no longer exist in a static export.
COPY public ./public
COPY src ./src
COPY tsconfig.json next.config.ts postcss.config.mjs ./

# `next build` with `output: "export"` writes the site to `out/`.
# Sentry source-map upload uses the SENTRY_AUTH_TOKEN secret (never persisted
# into a layer). The .next/cache mount speeds up incremental rebuilds.
RUN --mount=type=cache,target=/usr/src/app/.next/cache \
    --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/SENTRY_AUTH_TOKEN 2>/dev/null || true)" \
    SENTRY_RELEASE="${VERSION#v}" \
    NEXT_PUBLIC_SENTRY_RELEASE="${VERSION#v}" \
    bun run build

# ---------------------------------------------------------------------------
# Stage: dev — optional local hot-reload target (`docker build --target dev`)
# ---------------------------------------------------------------------------
FROM deps AS dev
WORKDIR /usr/src/app
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "dev"]

# ---------------------------------------------------------------------------
# Stage: runtime — static file server (default build target)
# ---------------------------------------------------------------------------
FROM caddy:2-alpine AS runtime
COPY --from=build /usr/src/app/out /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
# The base caddy image's entrypoint runs the Caddyfile automatically.
