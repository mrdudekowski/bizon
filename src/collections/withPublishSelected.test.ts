import { describe, expect, it } from "vitest";
import type { CollectionConfig } from "payload";

import { withPublishSelected } from "./withPublishSelected";

describe("withPublishSelected", () => {
  it("adds beforeListTable publish button once", () => {
    const base: CollectionConfig = {
      slug: "demo",
      fields: [],
      admin: {
        components: {
          beforeListTable: ["./existing.tsx#Existing"],
        },
      },
    };

    const once = withPublishSelected(base);
    const twice = withPublishSelected(once);

    expect(once.admin?.components?.beforeListTable).toEqual([
      "./existing.tsx#Existing",
      "./payload-admin/PublishSelectedButton.tsx#PublishSelectedButton",
    ]);
    expect(twice.admin?.components?.beforeListTable).toEqual(
      once.admin?.components?.beforeListTable,
    );
  });
});
