// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: "https://12f8f38e9e78e2900f386bec2549c9d7@o4504157766942720.ingest.us.sentry.io/4507589484544000",
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_ENABLED,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.05,
  replaysOnErrorSampleRate: 0.05,
  integrations: [
    // eslint-disable-next-line import/namespace
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
})
