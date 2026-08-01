import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page with form', async ({ page }) => {
    await expect(page).toHaveTitle(/Veora Auto|Login/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Se connecter")')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button:has-text("Se connecter")');

    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText(/incorrect|invalid|email/i);
  });

  test('should redirect to dashboard on valid login', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'demo@veora.local';
    const testPassword = process.env.TEST_USER_PASSWORD || 'Demo123!@#';

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Se connecter")');

    await page.waitForURL(/\/(dashboard|manager|office)/);
    await expect(page).toHaveTitle(/Dashboard|Manager|Office/i);
    await expect(page.locator('[aria-label="User menu"], [role="button"]:has-text(/profil|account|user/i)')).toBeVisible();
  });

  test('should logout successfully', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'demo@veora.local';
    const testPassword = process.env.TEST_USER_PASSWORD || 'Demo123!@#';

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/\/(dashboard|manager|office)/);

    const userMenu = page.locator('[aria-label="User menu"], button:has-text(/menu|profil/i)').first();
    await userMenu.click();

    const logoutButton = page.locator('button:has-text(/déconnexion|logout|sign out/i)');
    await logoutButton.click();

    await page.waitForURL('/');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('should handle password reset flow', async ({ page }) => {
    await page.click('a:has-text(/oublié|forgot|reset/i)');
    await expect(page).toHaveTitle(/reset|oublié|password/i);

    const testEmail = process.env.TEST_USER_EMAIL || 'demo@veora.local';
    await page.fill('input[type="email"]', testEmail);
    await page.click('button:has-text(/envoyer|send|reset/i)');

    const successMessage = page.locator('[role="alert"], .success');
    await expect(successMessage).toContainText(/email|envoyé|sent|check/i);
  });

  test('should persist session after page reload', async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'demo@veora.local';
    const testPassword = process.env.TEST_USER_PASSWORD || 'Demo123!@#';

    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/\/(dashboard|manager|office)/);

    await page.reload();
    await expect(page.locator('[aria-label="User menu"], button:has-text(/profil|account/i)')).toBeVisible();
  });
});
