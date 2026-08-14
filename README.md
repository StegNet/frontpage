# StegNet frontend

The public StegNet website. A statically-exported [Next.js](https://nextjs.org)
site, served by Caddy from a small Docker image and self-hosted behind Traefik.

## Stack

- **Next.js 16** (App Router) — exported to static HTML (`output: "export"`)
- **Bun** — package manager and build runtime
- **Tailwind CSS v4** + **shadcn** (Base UI) components
- **Sentry** — client error tracking, releases, source maps
- **LogTape** — structured logging
- **Caddy** — static file server in the runtime image

## Local development

```bash
bun install
bun dev
```

Then open http://localhost:3000.

### Environment

Local env lives in `.env.local` (gitignored). The site reads:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (public) |
| `NEXT_PUBLIC_APP_VERSION` | Version shown in the footer (set at build) |
| `NEXT_PUBLIC_COMMIT_SHA` | Commit shown in the footer (set at build) |

Sentry `environment` is derived at runtime from the hostname (`staging.*` →
staging, `localhost` → development, otherwise production), so one build serves
every environment.

## Build

```bash
bun run build
```

Produces a static site in `out/`.

## Docker

The image builds the static export and serves it with Caddy on port **8080**
(non-root). TLS is terminated upstream by Traefik.

```bash
docker build \
  --build-arg VERSION=1.2.3 \
  --build-arg COMMIT_SHA="$(git rev-parse HEAD)" \
  --secret id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
  -t stegnet-frontpage .
```

## Release & deploy

Deploys are driven by **git tags**. Pushing a `vX.Y.Z` tag triggers
`.github/workflows/publish-image.yml`, which:

1. builds the image (version + commit baked in) and creates the Sentry release
   with source maps,
2. pushes `ghcr.io/stegnet/frontpage:<version>` and `:latest` to GHCR,
3. records a Sentry deploy and calls the Portainer webhook to roll out.

```bash
git tag v1.2.3
git push origin v1.2.3
```

Portainer pulls the new tag from GHCR and Caddy serves it behind Traefik.
