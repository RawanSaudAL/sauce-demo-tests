import { test, expect } from '@playwright/test';

test('Complete checkout flow with 3 random items', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(/inventory.html/);

  const items = page.locator('.inventory_item');
  const count = await items.count();
  const selectedIndexes: number[] = [];
  while (selectedIndexes.length < 3) {
    const rand = Math.floor(Math.random() * count);
    if (!selectedIndexes.includes(rand)) selectedIndexes.push(rand);
  }

  for (const index of selectedIndexes) {
    await items.nth(index).locator('button').click();
  }

  await page.click('.shopping_cart_link');
  await expect(page.locator('.cart_item')).toHaveCount(3);

  await page.click('#checkout');
  await page.fill('#first-name', 'John');
  await page.fill('#last-name', 'Doe');
  await page.fill('#postal-code', '12345');
  await page.click('#continue');
  await expect(page.locator('.cart_item')).toHaveCount(3);

  await page.click('#finish');
  await expect(page.locator('.complete-header')).toHaveText(/thank you for your order!/i);
});
