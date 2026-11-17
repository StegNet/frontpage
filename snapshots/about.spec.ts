import { expect, test } from '@playwright/test';
import { emailTemplates } from '../src/lib/mailto';
import { formattedAddress, leadership, org } from '../src/lib/org';

test('page has a clear outline of headings', async ({ page }) => {
  await page.goto('/about');
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'About StegNet' }),
  ).toBeVisible();
  for (const name of [
    'Our mission',
    "Who it's for",
    'Leadership',
    'Official details',
  ]) {
    await expect(main.getByRole('heading', { level: 2, name })).toBeVisible();
  }
});

test('"On this page" links jump to their section below the fixed nav', async ({
  page,
}) => {
  await page.goto('/about');
  const nav = page.getByRole('navigation', { name: 'On this page' });
  const links = nav.getByRole('link');
  await expect(links).toHaveCount(4);
  const siteNav = page.getByRole('navigation', { name: 'Main' });
  for (const link of await links.all()) {
    const id = (await link.getAttribute('href'))!.replace('#', '');
    await link.click();
    const heading = page.locator(`#${id}`);
    await expect(heading).toBeInViewport();
    // The heading must not end up hidden behind the fixed site nav.
    await expect
      .poll(async () => {
        const [h, n] = await Promise.all([
          heading.boundingBox(),
          siteNav.boundingBox(),
        ]);
        return h!.y >= n!.y + n!.height;
      })
      .toBe(true);
  }
});

test('"Become a member" opens a pre-filled membership email', async ({
  page,
}) => {
  await page.goto('/about');
  const links = page.getByRole('link', { name: 'Become a member' });
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe(org.email);
    expect(url.searchParams.get('subject')).toBe(
      emailTemplates.membership.subject,
    );
    expect(url.searchParams.get('body')).toBe(emailTemplates.membership.body);
  }
  for (const name of ['Contact us', 'All contact options']) {
    await expect(page.getByRole('link', { name })).toHaveAttribute(
      'href',
      '/contact',
    );
  }
});

test('leadership lists every representative', async ({ page }) => {
  await page.goto('/about');
  const section = page.getByRole('region', { name: 'Leadership' });
  for (const person of leadership) {
    const card = section.getByRole('listitem').filter({ hasText: person.name });
    await expect(card).toContainText(person.title);
    for (const role of person.roles) await expect(card).toContainText(role);
  }
});

test('official details show the right values with copy buttons', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const writes: string[] = [];
    Object.defineProperty(window, '__clipboardWrites', { value: writes });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: async (v: string) => void writes.push(v) },
    });
  });
  await page.goto('/about');
  const details = page.getByRole('region', { name: 'Official details' });
  const rows = [
    { label: 'Legal name', value: org.legalName },
    { label: 'English name', value: org.alternateName },
    { label: 'OIB', value: org.oib },
    { label: 'Registarski broj', value: org.registryNumber },
    { label: 'Sjedište', value: formattedAddress },
  ];
  for (const { label, value } of rows) {
    const row = details
      .locator('dl > div')
      .filter({ has: page.locator('dt', { hasText: label }) });
    await expect(row.locator('dd')).toHaveText(value);
    await row
      .getByRole('button', { name: `Copy ${label}`, exact: true })
      .click();
  }
  await expect(
    details.getByRole('link', { name: org.email, exact: true }),
  ).toHaveAttribute('href', `mailto:${org.email}`);
  expect(
    await page.evaluate(
      () =>
        (window as Window & { __clipboardWrites?: string[] }).__clipboardWrites,
    ),
  ).toEqual(rows.map((r) => r.value));
});

test('page never scrolls sideways', async ({ page }) => {
  for (const width of [320, 375, 412, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about');
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, `overflow at ${width}px`).toBe(0);
  }
});

test('sections fade in as they scroll into view', async ({ page }) => {
  await page.goto('/about');
  const cta = page.getByRole('region', {
    name: 'Curious about technology? Join us.',
  });
  const opacity = () => cta.evaluate((el) => getComputedStyle(el).opacity);
  // Hidden while below the fold (fails if <main> becomes a scroll container).
  expect(await opacity()).toBe('0');
  await cta.scrollIntoViewIfNeeded();
  await expect.poll(opacity).toBe('1');
});

test('animations are switched off for reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/about');
  const names = await page.evaluate(() =>
    [...document.querySelectorAll('main h1, main .reveal, main .animate-glow')]
      .map((el) => getComputedStyle(el).animationName)
      .filter((name) => name !== 'none'),
  );
  expect(names).toEqual([]);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
});
