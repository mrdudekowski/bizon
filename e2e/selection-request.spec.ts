import { expect, test } from "@playwright/test";

test("selection state is shareable and restored by browser history", async ({ page }) => {
  await page.goto("/selection");
  await page.getByRole("radio", { name: "Магистральный тягач" }).check();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page).toHaveURL(/vehicle=long-haul-tractor/);
  await expect(page.getByText("В каких условиях работает техника?", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: "Магистраль" }).check();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page).toHaveURL(/condition=long-haul/);
  await expect(page.getByText("Что известно о посадке?", { exact: true })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/condition=long-haul/);
  await expect(page.getByText("В каких условиях работает техника?", { exact: true })).toBeVisible();
  await expect(page.getByRole("checkbox", { name: "Магистраль" })).toBeChecked();
});

test("an incomplete deep link focuses the first missing question", async ({ page }) => {
  await page.goto("/selection?vehicle=regional-truck");
  const question = page.getByText("В каких условиях работает техника?", { exact: true });
  await expect(question).toBeVisible();
  await expect(question).toBeFocused();
});

test("unknown fitment data still reaches an honest result", async ({ page }) => {
  await page.goto("/selection?vehicle=regional-truck&condition=regional&axle=unknown&sizeKnown=false&step=result");
  await expect(page.getByRole("heading", { name: "Предварительная рекомендация" })).toBeVisible();
  await expect(page.getByText("Финальную совместимость и наличие подтверждает специалист BIZON")).toBeVisible();
});

test("contextual request submits a safe summary and keeps the request id", async ({ page }) => {
  await page.route("**/api/requests", async (route) => {
    const body = route.request().postDataJSON();
    expect(body.selectionContext.vehicle).toBe("long-haul-tractor");
    expect(body.selectionContext.conditions).toEqual(["long-haul"]);
    expect(body.selectionContext.modelSlugs).toEqual(["dsr158"]);
    expect(body.phone).toBe("+7 999 123-45-67");
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, requestId: "BZN-1042", message: "Request created successfully" }),
    });
  });

  await page.goto("/contact?vehicle=long-haul-tractor&condition=long-haul&axle=steer&sizeKnown=false&model=dsr158");
  await page.getByLabel("Имя *").fill("Алексей");
  await page.getByLabel("Телефон").fill("+7 999 123-45-67");
  await page.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page.getByRole("heading", { name: "Заявка BZN-1042 принята" })).toBeVisible();
  await expect(page.getByText("Алексей", { exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Модель dsr158" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Вернуться в каталог" })).toHaveAttribute("href", "/models");
});

test("request error retains fields and allows retry", async ({ page }) => {
  let attempts = 0;
  await page.route("**/api/requests", async (route) => {
    attempts += 1;
    await route.fulfill({
      status: attempts === 1 ? 500 : 200,
      contentType: "application/json",
      body: JSON.stringify(
        attempts === 1
          ? { ok: false, message: "Temporary error" }
          : { ok: true, requestId: "BZN-1043", message: "ok" },
      ),
    });
  });

  await page.goto("/contact");
  await page.getByLabel("Имя *").fill("Мария");
  await page.getByLabel("Email").fill("maria@example.com");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
  await expect(page.getByLabel("Имя *")).toHaveValue("Мария");
  await expect(page.getByLabel("Email")).toHaveValue("maria@example.com");
  await page.getByRole("button", { name: "Отправить заявку" }).click();
  await expect(page.getByRole("heading", { name: "Заявка BZN-1043 принята" })).toBeVisible();
});
