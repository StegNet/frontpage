import { expect, test } from '@playwright/test';
import { navLinks } from '../src/lib/org';

for (const { href, label } of navLinks) {
  test(`main nav marks ${label} as the current page`, async ({ page }) => {
    await page.goto(href);
    const nav = page.getByRole('navigation', { name: 'Main' });
    await expect(nav.getByRole('link', { name: label })).toHaveAttribute(
      'aria-current',
      'page',
    );
    // Only one link is current at a time.
    await expect(nav.locator('[aria-current="page"]')).toHaveCount(1);
  });
}
