import assert from "node:assert/strict";
import test from "node:test";

import { isPageKey, isPublishedTireDirection, PAGE_KEYS, SCHEMA_VERSION } from "../src/contract.mjs";

test("schema version is the documents migration", () => {
  assert.equal(SCHEMA_VERSION, "001_documents");
});

test("page keys match the public site registry", () => {
  assert.equal(PAGE_KEYS.length, 9);
  assert.equal(isPageKey("home"), true);
  assert.equal(isPageKey("shop-home"), true);
  assert.equal(isPageKey("not-a-page"), false);
});

test("published tire direction requires id, slug, name, and selection lists", () => {
  assert.equal(
    isPublishedTireDirection({
      id: "dir-long-haul",
      slug: "long-haul",
      name: "Магистральные",
      selectionVehicleTypes: ["long-haul-tractor"],
      selectionConditions: ["long-haul"],
    }),
    true,
  );
  assert.equal(isPublishedTireDirection({ slug: "long-haul", name: "Магистральные" }), false);
});
