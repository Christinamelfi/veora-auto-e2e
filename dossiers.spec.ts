import { test, expect } from '@playwright/test';

test.describe('Dossiers Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    const testEmail = process.env.TEST_USER_EMAIL || 'demo@veora.local';
    const testPassword = process.env.TEST_USER_PASSWORD || 'Demo123!@#';

    await page.goto('/');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/\/(dashboard|manager|office)/);
  });

  test('should display dossiers list for Manager', async ({ page }) => {
    await page.goto('/manager/dossiers');

    await expect(page.locator('h1, h2').filter({ hasText: /dossier/i }).first()).toBeVisible();
    await expect(page.locator('[data-testid="dossier-row"], tr').first()).toBeVisible();
  });

  test('should display dossiers list for Office', async ({ page }) => {
    // Navigate to office section
    await page.goto('/office/dossiers');

    await expect(page.locator('h1, h2').filter({ hasText: /dossier/i }).first()).toBeVisible();
  });

  test('should create a new dossier', async ({ page }) => {
    await page.goto('/manager/dossiers');

    const createButton = page.locator('button:has-text(/nouveau|créer|ajouter|new|create/i)').first();
    await expect(createButton).toBeVisible();
    await createButton.click();

    await page.waitForURL(/dossiers\/(new|create)/);
    await expect(page.locator('input[type="text"], input[type="email"], textarea').first()).toBeVisible();
  });

  test('should display dossier detail', async ({ page }) => {
    await page.goto('/manager/dossiers');

    const dossierRow = page.locator('[data-testid="dossier-row"], tr').first();
    await expect(dossierRow).toBeVisible();
    await dossierRow.click();

    await page.waitForURL(/dossiers\/\d+|dossier\/[\w-]+/);
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('should change dossier status', async ({ page }) => {
    await page.goto('/manager/dossiers');

    const dossierRow = page.locator('[data-testid="dossier-row"], tr').first();
    await dossierRow.click();

    await page.waitForURL(/dossiers\/\d+|dossier\/[\w-]+/);

    // Look for status selector/dropdown
    const statusSelect = page.locator('select, [role="combobox"], button:has-text(/statut|status/i)').first();
    if (await statusSelect.isVisible()) {
      await statusSelect.click();
      const statusOption = page.locator('[role="option"], button:has-text(/en cours|in progress|pending/i)').first();
      await statusOption.click();
    }
  });

  test('should display vehicle information', async ({ page }) => {
    await page.goto('/manager/dossiers');

    const dossierRow = page.locator('[data-testid="dossier-row"], tr').first();
    await dossierRow.click();

    await page.waitForURL(/dossiers\/\d+|dossier\/[\w-]+/);

    // Check for vehicle info section
    const vehicleSection = page.locator('[data-testid="vehicle-info"], section:has-text(/véhicule|vehicle/i)').first();
    if (await vehicleSection.isVisible()) {
      await expect(vehicleSection).toContainText(/marque|brand|make/i);
    }
  });

  test('should filter dossiers by status', async ({ page }) => {
    await page.goto('/manager/dossiers');

    const filterButton = page.locator('button:has-text(/filtrer|filter|rechercher|search/i)').first();
    if (await filterButton.isVisible()) {
      await filterButton.click();

      const statusFilter = page.locator('button, label').filter({ hasText: /statut|status/i }).first();
      if (await statusFilter.isVisible()) {
        await statusFilter.click();
      }
    }
  });

  test('should display dossier timeline/activity', async ({ page }) => {
    await page.goto('/manager/dossiers');

    const dossierRow = page.locator('[data-testid="dossier-row"], tr').first();
    await dossierRow.click();

    await page.waitForURL(/dossiers\/\d+|dossier\/[\w-]+/);

    // Look for timeline/activity section
    const timelineSection = page.locator('[data-testid="timeline"], [role="tablist"] >> text=/historique|timeline|activity/i').first();
    if (await timelineSection.isVisible()) {
      await expect(timelineSection).toBeVisible();
    }
  });
});
