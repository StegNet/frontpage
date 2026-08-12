FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Hot reloading
FROM base AS hot
VOLUME /usr/src/app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

COPY public ./public
COPY src ./src
COPY tsconfig.json next.config.ts postcss.config.mjs sentry.server.config.ts sentry.edge.config.ts ./

EXPOSE 3000
ENV NODE_ENV=development

CMD ["bun", "dev"]

# Build image for prod
FROM base AS build

COPY package.json bun.lock ./
RUN apt-get update
RUN apt-get install ca-certificates -y

RUN bun install --frozen-lockfile

ARG VERSION
ARG COMMIT_SHA
ENV NEXT_PUBLIC_APP_VERSION=${VERSION:-latest}
ENV NEXT_PUBLIC_COMMIT_SHA=${COMMIT_SHA:-localbuild}

COPY src ./src
COPY public ./public
COPY tsconfig.json next.config.ts postcss.config.mjs sentry.server.config.ts sentry.edge.config.ts ./

RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN \
    SENTRY_AUTH_TOKEN="$(cat /run/secrets/SENTRY_AUTH_TOKEN)" \
    VERSION="${VERSION:-latest}" \
    SENTRY_RELEASE="${VERSION:-latest}" \
    NEXT_PUBLIC_SENTRY_RELEASE="${VERSION:-latest}" \
    bun run build

# Run prod image
FROM build AS prod
WORKDIR /usr/src/app
ARG VERSION

COPY --from=build /usr/src/app/package.json ./
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

EXPOSE 3000
ENV NODE_ENV=production
CMD ["bun", "run", "start"]