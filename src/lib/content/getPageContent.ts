import { fetchPublishedPageSnapshot, mergePublishedPage } from "./publishedBackend";
import { getPageDefaults } from "./pages/defaults";
import type { PageKey } from "./pages/keys";
import type { PageContentByKey } from "./pages/types";

export async function getPageContent<K extends PageKey>(
  key: K,
): Promise<PageContentByKey[K]> {
  const defaults = getPageDefaults(key);
  const snapshot = await fetchPublishedPageSnapshot(process.env.BACKEND_URL, key);
  if (!snapshot) return defaults;
  return mergePublishedPage(defaults, snapshot);
}
