import { expect, test } from "@playwright/test";

test("homepage follows the approved seven-act hierarchy", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Ресурс для реальной работы" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Для какой техники нужны шины?" })).toBeVisible();
  await expect(page.locator('[data-home-tone="dark"]')).toHaveCount(2);
  await expect(page.getByRole("heading", { level: 2, name: "Tire IQ и People Stories" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "Индивидуальное брендирование" })).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: "BIZON Shop" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Подобрать шины", exact: true }).first()).toHaveAttribute("href", "/selection");
  await expect(page.getByRole("heading", { name: "Надёжность", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Экономичность", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Сервис", exact: true })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Популярные TBR-модели", exact: true })).toHaveCount(0);
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(hasOverflow).toBe(false);
});
