import { describe, expect, it } from "vitest";

import type { TireCatalogReadModel } from "@/lib/catalog/tireReadModel";

import { recommendTires } from "./engine";

const catalog = {
  directions: [
    {
      slug: "tbr",
      name: "TBR",
      selectionVehicleTypes: ["long-haul-tractor", "regional-truck"],
      selectionConditions: ["long-haul", "regional"],
      models: [
        {
          id: "steer-1",
          slug: "alpha-steer",
          name: "Alpha Steer",
          href: "/models/tbr/long-haul/alpha-steer",
          selectionVehicleTypes: ["long-haul-tractor"],
          selectionConditions: ["long-haul"],
          selectionAxles: ["steer"],
          sizes: ["385/65R22.5"],
        },
        {
          id: "drive-1",
          slug: "beta-drive",
          name: "Beta Drive",
          href: "/models/tbr/regional/beta-drive",
          selectionVehicleTypes: ["regional-truck"],
          selectionConditions: ["regional"],
          selectionAxles: ["drive"],
          sizes: ["315/80R22.5"],
        },
        {
          id: "trailer-1",
          slug: "gamma-trailer",
          name: "Gamma Trailer",
          href: "/models/tbr/regional/gamma-trailer",
          selectionVehicleTypes: ["regional-truck"],
          selectionConditions: ["regional"],
          selectionAxles: ["trailer"],
          sizes: ["385/65R22.5"],
        },
      ],
    },
    {
      slug: "otr",
      name: "OTR",
      selectionVehicleTypes: ["quarry-special"],
      selectionConditions: ["off-road"],
      models: [
        {
          id: "otr-1",
          slug: "quarry-x",
          name: "Quarry X",
          href: "/models/otr/off-road/quarry-x",
          selectionVehicleTypes: ["construction-dumper"],
          selectionConditions: ["mixed"],
          selectionAxles: ["drive"],
          sizes: [],
        },
      ],
    },
  ],
} as unknown as TireCatalogReadModel;

describe("recommendTires", () => {
  it("ranks a compatible long-haul steer model first", () => {
    const result = recommendTires(catalog, {
      vehicle: "long-haul-tractor",
      conditions: ["long-haul"],
      axle: "steer",
      sizeKnown: false,
    });

    expect(result.kind).toBe("matches");
    if (result.kind === "matches") {
      expect(result.matches[0].modelSlug).toBe("alpha-steer");
      expect(result.matches[0].score).toBe(90);
    }
  });

  it("explains an exact size without removing the specialist check", () => {
    const result = recommendTires(catalog, {
      vehicle: "regional-truck",
      conditions: ["regional"],
      axle: "drive",
      sizeKnown: true,
      size: "315/80R22.5",
    });

    expect(result.requiresSpecialistCheck).toBe(true);
    expect(result.kind).toBe("matches");
    if (result.kind === "matches") {
      expect(result.matches[0].reasons).toContain(
        "Есть совпадающий типоразмер в опубликованной линейке",
      );
    }
  });

  it("returns up to three models when the axle is unknown", () => {
    const result = recommendTires(catalog, {
      vehicle: "regional-truck",
      conditions: ["regional"],
      axle: "unknown",
      sizeKnown: false,
    });

    expect(result.kind).toBe("matches");
    if (result.kind === "matches") {
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.matches.length).toBeLessThanOrEqual(3);
      expect(result.matches.flatMap((match) => match.reasons)).not.toContain(
        "Соответствует выбранной оси",
      );
    }
  });

  it("returns the closest direction when no model has evidence", () => {
    expect(
      recommendTires(catalog, {
        vehicle: "quarry-special",
        conditions: ["off-road"],
        axle: "unknown",
        sizeKnown: false,
      }),
    ).toEqual({
      kind: "consultation",
      directionSlug: "otr",
      reason: "Точного совпадения в опубликованном каталоге нет",
      requiresSpecialistCheck: true,
    });
  });

  it("never creates synthetic products for an empty catalog", () => {
    expect(
      recommendTires(
        { directions: [] },
        {
          vehicle: "regional-truck",
          conditions: ["regional"],
          axle: "drive",
          sizeKnown: false,
        },
      ),
    ).toEqual({
      kind: "consultation",
      reason: "Точного совпадения в опубликованном каталоге нет",
      requiresSpecialistCheck: true,
    });
  });
});
