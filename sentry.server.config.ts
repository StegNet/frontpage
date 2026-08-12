// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  console.log('Instrumenting server-sided Sentry...')
} else {
  console.warn('No Sentry DSN detected. Telemetry may fail.')
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE
    ? `frontpage@${process.env.NEXT_PUBLIC_SENTRY_RELEASE.replace(/^v/, "")}`
    : undefined,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  integrations: [
    nodeProfilingIntegration(),
  ],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production'
    ? 1.0
    : 1.0,
  profileSessionSampleRate: process.env.NODE_ENV === 'production'
  ? 1.0
  : 1.0,
  profileLifecycle: 'trace',

  // Enable logs to be sent to Sentry
  enableLogs: true,

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});

console.log('Server-sided Sentry instrumented!');