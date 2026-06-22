import { revalidatePath } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

const SITE_PATHS = [
  "/",
  "/models",
  "/shop",
  "/tire-iq",
  "/people-stories",
  "/contact",
] as const;

function revalidatePublicSite(): void {
  for (const path of SITE_PATHS) {
    revalidatePath(path);
  }

  revalidatePath("/", "layout");
  revalidatePath("/models", "layout");
  revalidatePath("/shop", "layout");
  revalidatePath("/sitemap.xml");
}

/** Invalidate static pages after catalog/content saves in Payload admin. */
export const revalidateSiteCache: CollectionAfterChangeHook = () => {
  revalidatePublicSite();
};

export const revalidateSiteCacheAfterDelete: CollectionAfterDeleteHook = () => {
  revalidatePublicSite();
};
