import { mergeHomeContent, mergeShopHomeContent, mergeStubContent } from "./pages/merge";
import type { PageKey } from "./pages/keys";
import { isPageKey } from "./pages/keys";
import type { PageContentByKey } from "./pages/types";
import type { CmsTireType } from "./types";

export type PublishedTireDirection = CmsTireType & { id: string };

export function isPublishedTireDirection(value: unknown): value is PublishedTireDirection {
  if (!value || typeof value !== "object") return false;
  const row = value as PublishedTireDirection;
  return (
    typeof row.id === "string" &&
    row.id.length > 0 &&
    typeof row.slug === "string" &&
    row.slug.length > 0 &&
    typeof row.name === "string" &&
    typeof row.description === "string" &&
    typeof row.shortDescription === "string" &&
    typeof row.sortOrder === "number" &&
    typeof row.showInMenu === "boolean" &&
    Array.isArray(row.selectionVehicleTypes) &&
    Array.isArray(row.selectionConditions)
  );
}

export async function fetchPublishedTireDirections(
  backendUrl: string | undefined,
  fetchImpl: typeof fetch = fetch,
): Promise<PublishedTireDirection[] | null> {
  if (!backendUrl) return null;
  try {
    const response = await fetchImpl(`${backendUrl.replace(/\/$/, "")}/v1/published/tire-directions`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const body = (await response.json()) as { items?: unknown };
    if (!Array.isArray(body.items)) return null;
    return body.items.filter(isPublishedTireDirection);
  } catch {
    return null;
  }
}

export function mergePublishedPage<K extends PageKey>(
  defaults: PageContentByKey[K],
  snapshot: unknown,
): PageContentByKey[K] {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot)) return defaults;
  const patch = snapshot as Record<string, never>;
  if (defaults.key === "home") return mergeHomeContent(defaults, patch) as PageContentByKey[K];
  if (defaults.key === "shop-home") return mergeShopHomeContent(defaults, patch) as PageContentByKey[K];
  return mergeStubContent(defaults, patch) as PageContentByKey[K];
}

export async function fetchPublishedPageSnapshot(
  backendUrl: string | undefined,
  key: PageKey,
  fetchImpl: typeof fetch = fetch,
): Promise<unknown | null> {
  if (!backendUrl || !isPageKey(key)) return null;
  try {
    const response = await fetchImpl(
      `${backendUrl.replace(/\/$/, "")}/v1/published/pages/${encodeURIComponent(key)}`,
      { cache: "no-store" },
    );
    if (!response.ok) return null;
    const body = (await response.json()) as { snapshot?: unknown };
    return body.snapshot ?? null;
  } catch {
    return null;
  }
}
