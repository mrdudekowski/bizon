import { expect, test } from "@playwright/test";

test("branding CTA opens contextual contact with branding sourceForm", async ({ page }) => {
  await page.route("**/api/requests", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.sourceForm).toBe("branding");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ok: true,
        requestId: "BZN-BRAND",
        message: "Request created successfully",
      }),
    });
  });

  await page.goto("/contact?subject=branding");
  await expect(page.getByRole("heading", { level: 1, name: "Обсудить брендирование" })).toBeVisible();
  await expect(page.getByText("Заявка по брендированию")).toBeVisible();
  await page.getByLabel("Имя *").fill("Игорь");
  await page.getByLabel("Телефон").fill("+7 999 111-22-33");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByRole("heading", { name: "Заявка BZN-BRAND принята" })).toBeVisible();
});
