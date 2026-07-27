import { describe, expect, it } from "vitest";

import { buildSelectionCartItem } from "./selectionCartItem";

describe("buildSelectionCartItem", () => {
  it("builds one structured item from the selection and chosen models", () => {
    const item = buildSelectionCartItem(
      {
        vehicle: "regional-truck",
        conditions: ["regional"],
        axle: "steer",
        sizeKnown: true,
        size: "315/80R22.5",
      },
      [{ slug: "dsr158", name: "DSR158" }],
    );

    expect(item).toMatchObject({
      itemType: "tire",
      name: "Подбор шин",
      quantity: 1,
      priceOnRequest: true,
    });
    expect(item.itemId).toContain("regional-truck");
    expect(item.url).toBe(
      "/?vehicle=regional-truck&condition=regional&axle=steer&sizeKnown=true&size=315%2F80R22.5&step=result#solutions",
    );
    expect(item.notes).toContain("315/80R22.5");
    expect(item.notes).toContain("DSR158");
  });

  it("keeps an engineering-check request useful without matched models", () => {
    const item = buildSelectionCartItem(
      {
        vehicle: "quarry-special",
        conditions: ["off-road"],
        axle: "unknown",
        sizeKnown: false,
      },
      [],
    );

    expect(item.notes).toContain("Размер требует уточнения");
    expect(item.notes).toContain("Инженерная проверка без выбранной модели");
  });
});
