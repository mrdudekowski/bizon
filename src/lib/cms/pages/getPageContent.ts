import { withPayload } from "@/lib/cms/payload/query";

import { getPageDefaults } from "./defaults";
import type { PageKey } from "./keys";
import { isPageKey } from "./keys";
import {
  mapHomePatch,
  mapShopHomePatch,
  mapStubPatch,
} from "./mapPage";
import {
  mergeHomeContent,
  mergeShopHomeContent,
  mergeStubContent,
} from "./merge";
import type { PageContentByKey } from "./types";

export async function getPageContent<K extends PageKey>(
  key: K,
): Promise<PageContentByKey[K]> {
  const defaults = getPageDefaults(key);

  const doc = await withPayload(async (payload) => {
    const result = await payload.find({
      collection: "pages",
      where: {
        and: [{ key: { equals: key } }, { status: { equals: "published" } }],
      },
      limit: 1,
      depth: 2,
      overrideAccess: true,
    });
    return result.docs[0] ?? null;
  });

  if (!doc || !isPageKey(doc.key)) {
    return defaults;
  }

  const loose = doc as unknown as Record<string, unknown>;

  if (key === "home") {
    return mergeHomeContent(
      defaults as PageContentByKey["home"],
      mapHomePatch(loose),
    ) as PageContentByKey[K];
  }

  if (key === "shop-home") {
    return mergeShopHomeContent(
      defaults as PageContentByKey["shop-home"],
      mapShopHomePatch(loose),
    ) as PageContentByKey[K];
  }

  return mergeStubContent(
    defaults as PageContentByKey[Exclude<PageKey, "home" | "shop-home">],
    mapStubPatch(loose),
  ) as PageContentByKey[K];
}
