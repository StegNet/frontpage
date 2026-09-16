import { defineConfig, devices } from '@playwright/test';

// Serves the static export in `out/` and captures page screenshots for Sentry
// Snapshots (visual diffing in CI). Run `bun run build` first.
export default defineConfig({
  testDir: './snapshots',
  outputDir: './snapshots/.results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    // Screenshots are the whole point: no traces/videos to keep runs fast.
    trace: 'off',
    video: 'off',
  },
  projects: [
    {
      name: 'desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    // `serve` maps `/about` -> `about.html` and unknown paths -> `404.html`, like Caddy.
    command: 'bunx serve out -l 3100 --no-clipboard',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
