import { expect, test, type Page } from '@playwright/test';
import { formattedAddress, org } from '../src/lib/org';

// Exercise the exported page with the existing Playwright harness. Clipboard
// outcomes are controlled per browser context so these tests need no OS access.
async function mockClipboard(page: Page, fail = false) {
  await page.addInitScript((shouldFail) => {
    const writes: string[] = [];
    Object.defineProperty(window, '__clipboardWrites', { value: writes });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          writes.push(value);
          if (shouldFail) throw new DOMException('Denied', 'NotAllowedError');
        },
      },
    });
  }, fail);
}

function copyFeedback(page: Page, label: string) {
  return page
    .getByRole('button', { name: `Copy ${label}`, exact: true })
    .locator('..')
    .getByRole('status');
}

async function writtenValues(page: Page) {
  return page.evaluate(
    () =>
      (window as Window & { __clipboardWrites?: string[] }).__clipboardWrites,
  );
}

const copyCases = [
  { label: 'email address', value: org.email },
  { label: 'address', value: formattedAddress },
  { label: 'Legal name', value: org.legalName },
  { label: 'OIB', value: org.oib },
  { label: 'Registarski broj', value: org.registryNumber },
];

test('contact channels, office and official details are accessible', async ({
  page,
}) => {
  await page.goto('/contact');
  const main = page.getByRole('main');
  await expect(
    main.getByRole('heading', { level: 1, name: 'Contact us' }),
  ).toBeVisible();
  const channels = main.getByRole('region', { name: 'Contact channels' });
  for (const name of [org.email, 'Write to us']) {
    await expect(
      channels.getByRole('link', { name, exact: true }),
    ).toHaveAttribute('href', `mailto:${org.email}`);
  }
  await expect(channels.locator('address')).toContainText(org.address.street);
  await expect(channels.locator('address')).toContainText(
    `${org.address.postalCode} ${org.address.city}, ${org.address.region}`,
  );
  await expect(channels.locator('address')).toContainText(org.address.country);
  const details = main.getByRole('region', { name: 'Official details' });
  for (const { label, value } of copyCases.slice(2)) {
    const row = details
      .locator('dl > div')
      .filter({ has: page.locator('dt', { hasText: label }) });
    await expect(row.locator('dd')).toHaveText(value);
    await expect(
      row.getByRole('button', { name: `Copy ${label}`, exact: true }),
    ).toBeVisible();
  }
});

test('map link preserves the full Unicode address and opens safely in a new tab', async ({
  page,
}) => {
  await page.goto('/contact');
  const link = page.getByRole('link', { name: 'Open in Maps', exact: false });
  await expect(link).toBeVisible();
  const url = new URL((await link.getAttribute('href'))!);
  expect(url.origin + url.pathname).toBe('https://www.google.com/maps/search/');
  expect(url.searchParams.get('api')).toBe('1');
  expect(url.searchParams.get('query')).toBe(formattedAddress);
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', /\bnoopener\b/);
  await expect(link).toHaveAttribute('rel', /\bnoreferrer\b/);
  await expect(link).toHaveAccessibleName(/opens in a new tab/);
});

const topicCases = [
  {
    title: 'Membership',
    subject: 'Membership enquiry',
    body: 'Hi StegNet,\n\nI would like to know more about membership.\n\nName:\nAbout me:\n\n',
  },
  {
    title: 'Collaboration',
    subject: 'Collaboration proposal',
    body: 'Hi StegNet,\n\nI would like to propose a collaboration.\n\nOrganisation:\nIdea in brief:\n\n',
  },
  {
    title: 'Security report',
    subject: 'Security report',
    body: 'Hi StegNet,\n\nI would like to report a potential security issue.\n\nAffected URL / system:\nDescription:\nSteps to reproduce:\nImpact:\n\n',
  },
  {
    title: 'Official matters',
    subject: 'Administrative enquiry',
    body: 'Hi StegNet,\n\n',
  },
];

for (const { title, subject, body } of topicCases) {
  test(`${title} opens an email with the correct recipient and intact template`, async ({
    page,
  }) => {
    await page.goto('/contact');
    const link = page
      .getByRole('region', { name: "What's it about?" })
      .getByRole('link', { name: new RegExp(`^${title}`) });
    await expect(link).toBeVisible();
    const url = new URL((await link.getAttribute('href'))!);
    expect(url.protocol).toBe('mailto:');
    expect(url.pathname).toBe(org.email);
    // Decode via URLSearchParams to catch double encoding and lost newlines.
    expect([...url.searchParams.keys()]).toEqual(['subject', 'body']);
    expect(url.searchParams.get('subject')).toBe(subject);
    expect(url.searchParams.get('body')).toBe(body);
  });
}

for (const { label, value } of copyCases) {
  test(`copies ${label} exactly and announces success`, async ({ page }) => {
    await mockClipboard(page);
    await page.goto('/contact');
    const button = page.getByRole('button', {
      name: `Copy ${label}`,
      exact: true,
    });
    const status = copyFeedback(page, label);
    await expect(button).toHaveAttribute('type', 'button');
    await expect(button).toHaveAttribute('title', `Copy ${label}`);
    await expect(status).toBeEmpty();
    await expect(status).toHaveAttribute('aria-live', 'polite');
    await button.click();
    await expect(status).toHaveText(`Copied ${label}`);
    expect(await writtenValues(page)).toEqual([value]);
    // Each instance owns its feedback; copying one field leaves others idle.
    for (const other of copyCases.filter((item) => item.label !== label)) {
      await expect(copyFeedback(page, other.label)).toBeEmpty();
    }
  });
}

test('success feedback clears after two seconds and repeated copies restart the timer', async ({
  page,
}) => {
  await mockClipboard(page);
  await page.goto('/contact');
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
  const button = page.getByRole('button', {
    name: 'Copy email address',
    exact: true,
  });
  const status = copyFeedback(page, 'email address');
  await button.click();
  await expect(status).toHaveText('Copied email address');
  await page.clock.fastForward(1500);
  await button.click();
  await expect.poll(() => writtenValues(page)).toEqual([org.email, org.email]);
  await page.clock.fastForward(1500);
  await expect(status).toHaveText('Copied email address');
  await page.clock.fastForward(500);
  await expect(status).toBeEmpty();
});

for (const unavailable of [false, true]) {
  test(`${unavailable ? 'missing' : 'denied'} clipboard shows manual-copy guidance for six seconds`, async ({
    page,
  }) => {
    if (unavailable) {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: undefined,
        });
      });
    } else {
      await mockClipboard(page, true);
    }
    await page.goto('/contact');
    await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
    await page.clock.pauseAt(new Date('2026-01-01T00:00:01Z'));
    await page
      .getByRole('button', { name: 'Copy address', exact: true })
      .click();
    const status = copyFeedback(page, 'address');
    const guidance = page.getByText(
      "Couldn't copy. Select the address and copy it manually.",
      { exact: true },
    );
    await expect(status).toHaveText('Could not copy address');
    await expect(guidance).toBeVisible();
    await page.clock.fastForward(5999);
    await expect(guidance).toBeVisible();
    await page.clock.fastForward(1);
    await expect(guidance).toHaveCount(0);
    await expect(status).toBeEmpty();
  });
}

test('retrying after a clipboard error removes guidance and confirms success', async ({
  page,
}) => {
  await mockClipboard(page, true);
  await page.goto('/contact');
  const button = page.getByRole('button', {
    name: 'Copy email address',
    exact: true,
  });
  const status = copyFeedback(page, 'email address');
  await button.click();
  await expect(status).toHaveText('Could not copy email address');
  await page.evaluate(() => {
    navigator.clipboard.writeText = async () => {};
  });
  await button.click();
  await expect(status).toHaveText('Copied email address');
  await expect(page.getByText(/Couldn't copy\./)).toHaveCount(0);
});
