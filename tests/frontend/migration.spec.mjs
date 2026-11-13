import { test, expect } from '@playwright/test';
import manifest from '../../frontend/src/runtime/pages.json' with { type: 'json' };

const student = {
  name: 'Migration Student',
  email: 'migration@example.test',
  role: 'student',
  token: 'test-session',
  profileComplete: true
};
async function fixtures(page, role = 'student') {
  await page.addInitScript(
    (user) => {
      sessionStorage.setItem('techprep_current_user', JSON.stringify(user));
      sessionStorage.setItem('techprep_theme', 'dark');
    },
    role === 'admin' ? { ...student, role: 'admin', email: 'khushboo2006june@admin.com' } : student
  );
  await page.route('**/api/**', async (route) => {
    const url = route.request().url();
    let body = {
      success: true,
      data: [],
      quizzes: [],
      placements: [],
      tasks: [],
      notes: [],
      templates: [],
      problems: [],
      users: [],
      results: [],
      submissions: []
    };
    if (url.includes('/auth/profile')) body = { success: true, data: student, user: student };
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(body)
    });
  });
}
for (const path of Object.keys(manifest).filter(
  (p) => !p.endsWith('/login.html') && !p.endsWith('/signup.html')
)) {
  test(`mounts ${path} without JavaScript or asset errors`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await fixtures(page, path.includes('/admin/') ? 'admin' : 'student');
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true');
    await expect(page.locator('.startup-error')).toHaveCount(0);
    await expect(page.locator('body')).not.toBeEmpty();
    expect(errors).toEqual([]);
  });
}
test('landing example tabs, trace, FAQ and theme work', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true');
  await page.getByRole('tab', { name: 'Python', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toContainText('def two_sum');
  await page.getByRole('button', { name: 'Trace example' }).click();
  await expect(page.locator('.tp-terminal')).toContainText('Return [0, 1]');
  await page.getByText('Where should I start?', { exact: true }).click();
  await expect(page.locator('details').first()).toHaveAttribute('open', '');
  const initial = await page.locator('html').getAttribute('class');
  await page.getByRole('button', { name: 'Toggle light and dark theme' }).click();
  await expect(page.locator('html')).not.toHaveAttribute('class', initial);
});
test('auth modal opens from direct link and closes with Escape', async ({ page }) => {
  await page.goto('/?modal=login&email=student%40example.test');
  const modal = page.locator('#login-modal');
  await expect(modal).toBeVisible();
  await expect(modal.locator('input[type=email]')).toHaveValue('student@example.test');
  await page.keyboard.press('Escape');
  await expect(modal).toBeHidden();
  await page.getByRole('link', { name: 'Sign in', exact: true }).click();
  await expect(modal).toBeVisible();
});
test('mobile layout has no overflow and navigation opens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
  await page.getByRole('tab', { name: 'JavaScript', exact: true }).click();
  await expect(page.getByRole('tabpanel')).toContainText('function twoSum');
});
test('student auth alias retains redirect and modal parameters', async ({ page }) => {
  await page.goto('/pages/public/login.html?email=test%40example.test&registered=1');
  await expect(page).toHaveURL(/index.html\?modal=login/);
  await expect(page.locator('#login-modal')).toBeVisible();
  await expect(page.locator('#login-modal input[type=email]')).toHaveValue('test@example.test');
});
