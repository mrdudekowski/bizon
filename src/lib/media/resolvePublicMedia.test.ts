import { describe, expect, it } from "vitest";

import { resolvePublicMedia } from "./resolvePublicMedia";

describe("resolvePublicMedia", () => {
  it("prefers a local path", () => {
    expect(resolvePublicMedia("/images/site/hero.webp", "/images/fallback.webp"))
      .toBe("/images/site/hero.webp");
  });

  it("uses a local fallback", () => {
    expect(resolvePublicMedia("", "/images/fallback.webp")).toBe("/images/fallback.webp");
  });

  it("does not leak remote media in local mode", () => {
    expect(resolvePublicMedia("https://s3.example.test/file.webp")).toBeNull();
  });
});
