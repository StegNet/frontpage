import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { test, type Page } from '@playwright/test';

// Directory `sentry-cli snapshots upload` is pointed at. Filenames are the
// identity key Sentry diffs on, so keep them stable: <page>/<project>-<theme>.png
const OUT_DIR = path.join(__dirname, 'out');

const pages = [
  { slug: 'home', route: '/' },
  { slug: 'about', route: '/about' },
  { slug: 'contact', route: '/contact' },
  { slug: 'not-found', route: '/this-page-does-not-exist' },
] as const;

const themes = ['light', 'dark'] as const;

async function snapshot(
  page: Page,
  name: string,
  meta: Record<string, unknown>,
) {
  const dir = path.dirname(path.join(OUT_DIR, name));
  await mkdir(dir, { recursive: true });
  await page.screenshot({
    path: path.join(OUT_DIR, `${name}.png`),
    fullPage: true,
    animations: 'disabled',
  });
  // Optional sidecar read by Sentry: groups/tags in the UI, dark canvas for
  // dark-theme shots so the diff viewer doesn't render them on white.
  await writeFile(
    path.join(OUT_DIR, `${name}.json`),
    JSON.stringify(meta, null, 2),
  );
}

for (const { slug, route } of pages) {
  for (const theme of themes) {
    test(`${slug} (${theme})`, async ({ page }, testInfo) => {
      // Theme defaults to "system", so emulating the color scheme is enough.
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      const name = `${slug}/${testInfo.project.name}-${theme}`;
      await snapshot(page, name, {
        display_name: `${slug} · ${testInfo.project.name} · ${theme}`,
        group: slug,
        tags: { route, viewport: testInfo.project.name, theme },
        canvas_theme: theme,
      });
    });
  }
}
