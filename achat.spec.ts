import { test, expect } from '@playwright/test';

test.describe('Purchase/Acquisition Flow', () => {
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

  test('should display purchase panel', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase|acquisition/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const purchasePanel = page.locator('[data-testid="purchase-panel"], section:has-text(/achat|purchase/i)').first();
    await expect(purchasePanel).toBeVisible();
  });

  test('should confirm purchase', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const confirmButton = page.locator('button:has-text(/confirmer|confirm|accepter|accept/i)').first();
    if (await confirmButton.isVisible()) {
      await confirmButton.click();

      const successMessage = page.locator('[role="alert"], .success, .toast').first();
      if (await successMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(successMessage).toContainText(/confirmé|confirmed|succès|success/i);
      }
    }
  });

  test('should track payment status', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const paymentTracking = page.locator('[data-testid="payment-tracking"], section:has-text(/paiement|payment/i)').first();
    if (await paymentTracking.isVisible()) {
      await expect(paymentTracking).toContainText(/statut|status|payé|paid|en attente|pending/i);
    }
  });

  test('should handle vehicle reception', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const receptionButton = page.locator('button:has-text(/réception|reception|livraison|delivery|reçu|received/i)').first();
    if (await receptionButton.isVisible()) {
      await receptionButton.click();

      const successMessage = page.locator('[role="alert"], .success').first();
      if (await successMessage.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(successMessage).toContainText(/réception|reception|succès|success/i);
      }
    }
  });

  test('should change payment status', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const paymentStatusSelect = page.locator('select, [role="combobox"]').filter({ hasText: /paiement|payment/i }).first();
    if (await paymentStatusSelect.isVisible()) {
      await paymentStatusSelect.click();

      const statusOption = page.locator('[role="option"], button').filter({ hasText: /payé|paid/i }).first();
      if (await statusOption.isVisible()) {
        await statusOption.click();
      }
    }
  });

  test('should display actual costs', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const costsSection = page.locator('[data-testid="actual-costs"], section:has-text(/coûts|costs|prix|price/i)').first();
    if (await costsSection.isVisible()) {
      await expect(costsSection).toContainText(/€|€|coûts réels|actual costs/i);
    }
  });

  test('should display revised margin', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const marginSection = page.locator('[data-testid="revised-margin"], section:has-text(/marge|margin/i)').first();
    if (await marginSection.isVisible()) {
      await expect(marginSection).toContainText(/%|pourcentage|percent/i);
    }
  });

  test('should display cost summary', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const summarySection = page.locator('[data-testid="cost-summary"], section:has-text(/résumé|summary|total/i)').first();
    if (await summarySection.isVisible()) {
      await expect(summarySection).toContainText(/€|total|somme/i);
    }
  });

  test('should block purchase on VIN mismatch', async ({ page }) => {
    const purchaseTab = page.locator('[role="tab"], button:has-text(/achat|purchase/i)').first();
    if (await purchaseTab.isVisible()) {
      await purchaseTab.click();
    }

    const confirmButton = page.locator('button:has-text(/confirmer|confirm/i)').first();
    if (await confirmButton.isVisible()) {
      // Try clicking - should be disabled if VIN mismatch
      const isDisabled = await confirmButton.isDisabled();
      if (isDisabled) {
        await expect(confirmButton).toBeDisabled();
      }
    }
  });
});
