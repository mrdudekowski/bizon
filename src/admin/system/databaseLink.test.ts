import { describe, expect, it } from "vitest";

import {
  databaseLinkLabel,
  parseDatabaseHealth,
  parsePublishedTireDirections,
  readDatabaseLink,
} from "./databaseLink";

describe("parseDatabaseHealth", () => {
  it("accepts the backend-app health body", () => {
    expect(
      parseDatabaseHealth({
        ok: true,
        service: "backend-app",
        database: "bizon",
        schemaVersion: "001_documents",
      }),
    ).toEqual({ state: "connected", schemaVersion: "001_documents", database: "bizon" });
  });

  it("rejects a different database name", () => {
    expect(parseDatabaseHealth({ ok: true, database: "other", schemaVersion: "001_documents" })).toBeNull();
  });
});

describe("databaseLinkLabel", () => {
  it("names the connected schema", () => {
    expect(
      databaseLinkLabel({ state: "connected", schemaVersion: "001_documents", database: "bizon" }),
    ).toBe("База подключена · 001_documents");
  });
});

describe("parsePublishedTireDirections", () => {
  it("keeps rows that have id, slug, and name", () => {
    expect(
      parsePublishedTireDirections({
        items: [{ id: "dir-long-haul", slug: "long-haul", name: "Магистральные" }, { slug: "broken" }],
      }),
    ).toEqual([{ id: "dir-long-haul", slug: "long-haul", name: "Магистральные" }]);
  });
});

describe("readDatabaseLink", () => {
  it("stays unconfigured without BACKEND_URL", async () => {
    expect(await readDatabaseLink(undefined)).toEqual({ state: "unconfigured" });
  });
});
