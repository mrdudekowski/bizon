import { describe, expect, it } from "vitest";

import { resolveContactIntent } from "./contactIntent";

describe("resolveContactIntent", () => {
  it("maps whitelisted subjects to sourceForm and copy", () => {
    expect(resolveContactIntent(new URLSearchParams("subject=branding"))).toMatchObject({
      subject: "branding",
      sourceForm: "branding",
      title: "Обсудить брендирование",
    });
    expect(resolveContactIntent(new URLSearchParams("subject=supplier")).sourceForm).toBe(
      "supplier",
    );
    expect(resolveContactIntent(new URLSearchParams("subject=warranty")).sourceForm).toBe(
      "warranty",
    );
    expect(
      resolveContactIntent(new URLSearchParams("subject=wheel-selection")).sourceForm,
    ).toBe("wheel_selection");
  });

  it("ignores unknown subjects", () => {
    expect(resolveContactIntent(new URLSearchParams("subject=hack"))).toMatchObject({
      sourceForm: "contact",
      title: "Контакты",
    });
  });

  it("uses tire selection intent when selection context is present", () => {
    expect(resolveContactIntent(new URLSearchParams(), { hasSelectionContext: true })).toMatchObject({
      subject: "tire-selection",
      sourceForm: "tire_selection",
    });
  });

  it("prefers explicit subject over selection flag", () => {
    expect(
      resolveContactIntent(new URLSearchParams("subject=branding"), {
        hasSelectionContext: true,
      }).sourceForm,
    ).toBe("branding");
  });
});
