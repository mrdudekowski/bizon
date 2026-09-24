import { describe, expect, it, vi } from "vitest";

import { HOME_PAGE_DEFAULTS } from "./pages/defaults/home";
import {
  fetchPublishedPageSnapshot,
  fetchPublishedTireDirections,
  mergePublishedPage,
} from "./publishedBackend";

describe("fetchPublishedTireDirections", () => {
  it("returns null when the backend url is unset", async () => {
    expect(await fetchPublishedTireDirections(undefined)).toBeNull();
  });

  it("keeps a published direction from backend-app", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        items: [
          {
            id: "dir-long-haul",
            slug: "long-haul",
            name: "Магистральные",
            description: "",
            shortDescription: "",
            sortOrder: 0,
            showInMenu: true,
            imageUrl: null,
            selectionVehicleTypes: ["long-haul-tractor"],
            selectionConditions: ["long-haul"],
          },
          { slug: "broken" },
        ],
      }),
    })) as unknown as typeof fetch;

    const items = await fetchPublishedTireDirections("http://backend.test", fetchImpl);
    expect(items?.[0]?.slug).toBe("long-haul");
    expect(items).toHaveLength(1);
  });
});

describe("mergePublishedPage", () => {
  it("keeps the code default when the snapshot is empty", () => {
    expect(mergePublishedPage(HOME_PAGE_DEFAULTS, null)).toEqual(HOME_PAGE_DEFAULTS);
  });

  it("applies a published home title and leaves the rest of the default", () => {
    const merged = mergePublishedPage(HOME_PAGE_DEFAULTS, {
      hero: { title: "С базы" },
    });
    expect(merged.hero.title).toBe("С базы");
    expect(merged.hero.imageUrl).toBe(HOME_PAGE_DEFAULTS.hero.imageUrl);
  });
});

describe("fetchPublishedPageSnapshot", () => {
  it("reads the snapshot field", async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ key: "home", snapshot: { hero: { title: "С базы" } } }),
    })) as unknown as typeof fetch;

    await expect(fetchPublishedPageSnapshot("http://backend.test/", "home", fetchImpl)).resolves.toEqual({
      hero: { title: "С базы" },
    });
  });
});
