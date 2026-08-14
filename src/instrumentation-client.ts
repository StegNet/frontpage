// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { configure, getConsoleSink, withFilter } from "@logtape/logtape";
import { getSentrySink } from "@logtape/sentry";

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_VERCEL_ENV === 'development';

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  console.log('Instrumenting client-sided Sentry...')
} else {
  console.warn('No Sentry DSN detected. Telemetry may fail.')
}

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  release: process.env.NEXT_PUBLIC_SENTRY_RELEASE
    ? `frontpage@${process.env.NEXT_PUBLIC_SENTRY_RELEASE.replace(/^v/, "")}`
    : undefined,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,

  // Add optional integrations for additional features
  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
  ],
  tracePropagationTargets: ["localhost", /^\/api/, /^https:\/\/stegnet\.com\/api/],

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: process.env.NODE_ENV === 'production'
    ? 1.0
    : 1.0,
  profileSessionSampleRate: process.env.NODE_ENV === 'production'
  ? 1.0
  : 1.0,

  enableLogs: true,

  // Define how likely Replay events are sampled.
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  // Define how likely Replay events are sampled when an error occurs.
  replaysOnErrorSampleRate: 1.0,

  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

console.log('Client-sided Sentry instrumented!');

await configure({
  sinks: {
    console: withFilter(getConsoleSink(), isDevelopment ? 'debug' : 'info'),
    sentry: withFilter(getSentrySink({ sentry: Sentry }), 'info'),
  },
  loggers: [
    {
      category: 'frontpage',
      lowestLevel: 'debug',
      sinks: ['console', 'sentry'],
    },
  ],
});