import { describe, expect, it } from "vitest";

import { TIRE_CATEGORIES } from "./tireCategories";
import { getCategoryIcon } from "./categoryIcons";

describe("category icon registry", () => {
  it("maps every canonical category to its supplied SVG", () => {
    for (const category of TIRE_CATEGORIES) {
      expect(getCategoryIcon(category.slug)).toEqual({
        src: `/images/catalog/category-icons/${category.slug}-m.svg`,
        alt: category.name,
      });
    }
  });

  it("does not invent an icon for an unknown category", () => {
    expect(getCategoryIcon("legacy")).toBeNull();
  });
});
