import { expect, test } from "@playwright/test";

test("catalog filters survive reload and model detail exposes fitment CTA", async ({ page }) => {
  await page.goto("/models/tbr?application=regional&axle=drive");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("TBR");
  await expect(page.locator('select[name="application"]')).toHaveValue("regional");
  await expect(page.locator('select[name="axle"]')).toHaveValue("drive");
  await expect(page.locator("[data-tire-model-card]")).toHaveCount(1);

  await page.reload();
  await expect(page.locator('select[name="application"]')).toHaveValue("regional");
  await expect(page.locator('select[name="axle"]')).toHaveValue("drive");

  await page.locator("[data-tire-model-card] h2 a").first().click();
  await expect(page).toHaveURL(/\/models\/tbr\/regional\/dsr177$/);
  await expect(page.getByRole("button", { name: "Добавить в корзину" }).first()).toBeVisible();
  await expect(page.getByLabel("Типоразмер")).toBeVisible();

  const hasOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});

test("legacy direct model link resolves to the canonical category path", async ({ page }) => {
  await page.goto("/models/tbr/dsr177");
  await expect(page).toHaveURL(/\/models\/tbr\/regional\/dsr177$/);
  await expect(page.getByRole("heading", { level: 1, name: "DSR177" })).toBeVisible();
});
