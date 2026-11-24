import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { test, type Locator, type Page } from '@playwright/test';

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
  target: Page | Locator,
  name: string,
  meta: Record<string, unknown>,
) {
  const dir = path.dirname(path.join(OUT_DIR, name));
  await mkdir(dir, { recursive: true });
  const options = {
    path: path.join(OUT_DIR, `${name}.png`),
    animations: 'disabled',
  } as const;
  await ('goto' in target
    ? target.screenshot({ ...options, fullPage: true })
    : target.screenshot(options));
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
      // Reduced motion: scroll-in sections would otherwise still be hidden.
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await page.goto(route, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      const name = `${slug}/${testInfo.project.name}-${theme}`;
      const tags = { route, viewport: testInfo.project.name, theme };
      await snapshot(page, name, {
        display_name: `${slug} · ${testInfo.project.name} · ${theme}`,
        group: slug,
        tags,
        canvas_theme: theme,
      });

      // One readable shot per top-level section: full-page phone shots are too
      // tall for the diff viewer, and a change in one section no longer shifts
      // (and so "changes") every section below it. Nested sections are part of
      // their parent's shot. The section's id or label is its stable name.
      const sections = page.locator('main section:not(section section)');
      for (const section of await sections.all()) {
        const label =
          (await section.getAttribute('aria-labelledby')) ??
          (await section.getAttribute('aria-label'))
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');
        if (!label) throw new Error(`Unnamed <section> on ${route}`);
        await snapshot(section, `${name}/${label}`, {
          display_name: `${slug} · ${label} · ${testInfo.project.name} · ${theme}`,
          group: slug,
          tags: { ...tags, section: label },
          canvas_theme: theme,
        });
      }
    });
  }
}
