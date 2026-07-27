import { expect, test } from "@playwright/test";

test("anonymous cart uses an opaque HttpOnly server session", async (
  { request },
  testInfo,
) => {
  test.skip(testInfo.project.name !== "desktop-1440", "One database-backed API check is enough");

  const initial = await request.get("/api/cart");
  expect(initial.status()).toBe(200);
  expect(await initial.json()).toMatchObject({
    ok: true,
    hasSession: false,
    items: [],
  });

  const items = [
    {
      itemType: "tire",
      itemId: "selection:e2e",
      name: "Подбор шин E2E",
      quantity: 1,
      priceOnRequest: true,
    },
  ];
  const saved = await request.put("/api/cart", {
    data: { items },
    headers: { origin: testInfo.project.use.baseURL as string },
  });
  expect(saved.status()).toBe(200);
  expect(saved.headers()["set-cookie"]).toContain("bizon-cart-session-v1=");
  expect(saved.headers()["set-cookie"]).toContain("HttpOnly");
  expect(saved.headers()["set-cookie"]).not.toContain("Подбор шин E2E");

  const restored = await request.get("/api/cart");
  expect(restored.status()).toBe(200);
  expect(await restored.json()).toMatchObject({
    ok: true,
    hasSession: true,
    items,
  });

  const cleared = await request.delete("/api/cart", {
    headers: { origin: testInfo.project.use.baseURL as string },
  });
  expect(cleared.status()).toBe(200);

  const afterClear = await request.get("/api/cart");
  expect(await afterClear.json()).toMatchObject({
    ok: true,
    hasSession: false,
    items: [],
  });
});
