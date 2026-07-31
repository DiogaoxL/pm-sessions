import { test, expect } from '@playwright/test';

test.describe('Public Scheduling Flow', () => {
  test('should load available slots, allow booking, and show success message', async ({ page }) => {
    // 1. Visit the scheduling page
    await page.goto('/agendamento');

    // 2. Expect header to be visible
    await expect(page.locator('h1')).toContainText('Agendamento de Entrevista');

    // 3. Locate available time slot cards
    const slotCard = page.locator('button[aria-label*="Disponível"]').first();
    if ((await slotCard.count()) > 0) {
      // 4. Click the first available slot card
      await slotCard.click();

      // 5. Fill out the registration form
      await page.fill('input[name="name"]', 'John E2E Doe');
      await page.fill('input[name="email"]', 'john.e2e@example.com');
      await page.fill('input[name="phone"]', '11999999999');

      // 6. Submit registration
      await page.click('button[type="submit"]');

      // 7. Verify success page or dialog
      await expect(page.locator('text=Agendamento Confirmado')).toBeVisible();
    }
  });
});
