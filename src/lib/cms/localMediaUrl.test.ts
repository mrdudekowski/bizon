import { describe, expect, it } from "vitest";

import {
  localMediaFileExists,
  rewriteMediaDocUrlsForLocalStorage,
  toLocalPublicMediaUrl,
} from "./localMediaUrl";

describe("toLocalPublicMediaUrl", () => {
  it("maps a filename into the public /media path", () => {
    expect(toLocalPublicMediaUrl("bizon-atlas-hero-3q.png")).toBe(
      "/media/bizon-atlas-hero-3q.png",
    );
  });

  it("strips leading slashes and ignores blanks", () => {
    expect(toLocalPublicMediaUrl("/card.png")).toBe("/media/card.png");
    expect(toLocalPublicMediaUrl("  ")).toBeNull();
    expect(toLocalPublicMediaUrl(null)).toBeNull();
  });
});

describe("localMediaFileExists", () => {
  it("finds seeded wheel media under public/media", () => {
    expect(localMediaFileExists("bizon-atlas-hero-3q.png")).toBe(true);
    expect(localMediaFileExists("definitely-missing-wheel.png")).toBe(false);
  });
});

describe("rewriteMediaDocUrlsForLocalStorage", () => {
  it("rewrites main and size urls and clears prefix", () => {
    const rewritten = rewriteMediaDocUrlsForLocalStorage({
      filename: "bizon-atlas-hero-3q.png",
      url: "/api/media/file/bizon-atlas-hero-3q.png?prefix=bizon%2Fmedia",
      prefix: "bizon/media",
      sizes: {
        card: {
          filename: "bizon-atlas-hero-3q-600x600.png",
          url: "/api/media/file/bizon-atlas-hero-3q-600x600.png?prefix=bizon%2Fmedia",
        },
        hero: null,
      },
    });

    expect(rewritten.url).toBe("/media/bizon-atlas-hero-3q.png");
    expect(rewritten.prefix).toBeNull();
    expect(rewritten.sizes?.card?.url).toBe("/media/bizon-atlas-hero-3q-600x600.png");
    expect(rewritten.sizes?.hero).toBeNull();
  });
});
