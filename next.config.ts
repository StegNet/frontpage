import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Emit a fully static site into `out/` — served by Caddy, no Node server.
  output: 'export',

  // No image optimizer without a server; serve the original assets as-is.
  images: {
    unoptimized: true,
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: 'stegnet',
  project: 'stegnet-frontpage',
  authToken: process.env.SENTRY_AUTH_TOKEN,

  debug: false,
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  release: {
    name: process.env.SENTRY_RELEASE
      ? `frontpage@${process.env.SENTRY_RELEASE.replace(/^v/, '')}`
      : undefined,
    // Deploy is recorded at deploy time (in the workflow's environment-scoped
    // job), not here — the build produces one env-agnostic image.
  },

  webpack: {
    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
