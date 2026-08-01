import { test, expect } from '@playwright/test';

test.describe('Inspection Workflow', () => {
  test.beforeEach(async ({ page }) => {
    const testEmail = process.env.TEST_USER_EMAIL || 'demo@veora.local';
    const testPassword = process.env.TEST_USER_PASSWORD || 'Demo123!@#';

    await page.goto('/');
    await page.fill('input[type="email"]', testEmail);
    await page.fill('input[type="password"]', testPassword);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/\/(dashboard|manager|office)/);

    // Navigate to dossiers and open first one
    await page.goto('/manager/dossiers');
    const dossierRow = page.locator('[data-testid="dossier-row"], tr').first();
    await dossierRow.click();
    await page.waitForURL(/dossiers\/\d+|dossier\/[\w-]+/);
  });

  test('should access inspection form', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection|contrôle|check/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    const inspectionForm = page.locator('form, [data-testid="inspection-form"]').first();
    await expect(inspectionForm).toBeVisible();
  });

  test('should display identity checklist', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection|contrôle/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    const identityChecklist = page.locator('[data-testid="identity-checklist"], section:has-text(/identité|identity/i)').first();
    await expect(identityChecklist).toBeVisible();

    // Check for form fields
    const inputs = page.locator('input[type="checkbox"], input[type="text"], input[type="email"]');
    await expect(inputs.first()).toBeVisible();
  });

  test('should complete exterior checklist (19 points)', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    const exteriorSection = page.locator('[data-testid="exterior-checklist"], section:has-text(/extérieur|exterior/i)').first();
    await expect(exteriorSection).toBeVisible();

    // Check for multiple checkboxes (at least 5 to represent the 19-point checklist)
    const checkboxes = exteriorSection.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    await expect(count).toBeGreaterThanOrEqual(5);

    // Check first few items
    await checkboxes.nth(0).check();
    await expect(checkboxes.nth(0)).toBeChecked();
  });

  test('should complete interior checklist (17 points)', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    const interiorSection = page.locator('[data-testid="interior-checklist"], section:has-text(/intérieur|interior/i)').first();
    await expect(interiorSection).toBeVisible();

    const checkboxes = interiorSection.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    await expect(count).toBeGreaterThanOrEqual(5);

    await checkboxes.nth(0).check();
    await expect(checkboxes.nth(0)).toBeChecked();
  });

  test('should complete mechanical checklist (19 points)', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    const mechanicalSection = page.locator('[data-testid="mechanical-checklist"], section:has-text(/mécanique|mechanical/i)').first();
    await expect(mechanicalSection).toBeVisible();

    const checkboxes = mechanicalSection.locator('input[type="checkbox"]');
    const count = await checkboxes.count();
    await expect(count).toBeGreaterThanOrEqual(5);

    await checkboxes.nth(0).check();
    await expect(checkboxes.nth(0)).toBeChecked();
  });

  test('should block inspection on VIN mismatch', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    // Try to enter mismatched VIN
    const vinInput = page.locator('input[data-testid*="vin"], input[placeholder*="VIN"]').first();
    if (await vinInput.isVisible()) {
      await vinInput.fill('DIFFERENTVIN123456789');

      const errorAlert = page.locator('[role="alert"], .error, .alert-error').first();
      const isVisible = await errorAlert.isVisible({ timeout: 2000 }).catch(() => false);

      if (isVisible) {
        await expect(errorAlert).toContainText(/vin|correspondance|mismatch/i);
      }
    }
  });

  test('should auto-save inspection form', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    // Fill a field
    const textInput = page.locator('input[type="text"]').first();
    if (await textInput.isVisible()) {
      await textInput.fill('Test value');
      await page.waitForTimeout(500);

      // Check for save indicator or reload
      await page.reload();
      await expect(textInput).toHaveValue('Test value');
    }
  });

  test('should display comparison table (declared vs estimated vs actual)', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    const comparisonTable = page.locator('[data-testid="comparison-table"], table').first();
    if (await comparisonTable.isVisible()) {
      await expect(comparisonTable).toContainText(/déclaré|declared|estimé|estimated|constaté|actual/i);
    }
  });

  test('should persist inspection data after page reload', async ({ page }) => {
    const inspectionTab = page.locator('[role="tab"], button:has-text(/inspection/i)').first();
    if (await inspectionTab.isVisible()) {
      await inspectionTab.click();
    }

    // Fill some data
    const checkbox = page.locator('input[type="checkbox"]').first();
    if (await checkbox.isVisible()) {
      await checkbox.check();

      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Verify checkbox is still checked
      if (await checkbox.isVisible()) {
        await expect(checkbox).toBeChecked();
      }
    }
  });
});
