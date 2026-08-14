# deps -> build (static export) -> caddy

FROM oven/bun:1 AS deps
WORKDIR /usr/src/app
# ca-certificates: sentry-cli needs them to reach the Sentry API over HTTPS at build
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY package.json bun.lock ./
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

FROM deps AS build
WORKDIR /usr/src/app

ARG VERSION
ARG COMMIT_SHA
ARG NEXT_PUBLIC_SENTRY_DSN

# sentry.server/edge configs skipped — no server runtime in a static export
COPY public ./public
COPY src ./src
COPY tsconfig.json next.config.ts postcss.config.mjs ./

# baked into the client bundle. VERSION arrives already v-stripped from the
# workflow (it reuses the tag it computes for the image), so plain ENV works.
# CI=true un-silences sentry.
ENV NEXT_PUBLIC_APP_VERSION=${VERSION:-latest}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA:-localbuild}
ENV SENTRY_RELEASE=${VERSION:-latest}
ENV NEXT_PUBLIC_SENTRY_RELEASE=${VERSION:-latest}
ENV NEXT_PUBLIC_SENTRY_DSN=$NEXT_PUBLIC_SENTRY_DSN
ENV CI=true

# token only exists inside this RUN (secret mount, never baked into a layer)
RUN --mount=type=cache,target=/usr/src/app/.next/cache \
    --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/SENTRY_AUTH_TOKEN 2>/dev/null)" \
    bun run build

# optional local hot-reload: docker build --target dev (bind-mount source)
FROM deps AS dev
WORKDIR /usr/src/app
ENV NODE_ENV=development
EXPOSE 3000
CMD ["bun", "dev"]

FROM caddy:2-alpine AS runtime
COPY --from=build /usr/src/app/out /srv
COPY Caddyfile /etc/caddy/Caddyfile

# non-root; caddy on :8080 (Traefik must target 8080)
RUN addgroup -S caddy 2>/dev/null || true; \
    adduser -S -D -H -G caddy caddy 2>/dev/null || true; \
    chown -R caddy:caddy /srv /data /config
USER caddy
EXPOSE 8080
