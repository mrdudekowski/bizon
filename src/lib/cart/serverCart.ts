import { createHash } from "node:crypto";

import type { RequestItemInput } from "@/types/requestItem";

export const CART_SESSION_COOKIE_NAME = "bizon-cart-session-v1";
export const CART_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const MAX_SERVER_CART_LINES = 24;

const SUPPORTED_ITEM_TYPES = new Set(["tire", "wheel", "shopProduct"]);

function safeString(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const cleaned = value.trim();
  return cleaned ? cleaned.slice(0, maxLength) : undefined;
}

export function hashCartSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function sanitizeServerCartItems(value: unknown): RequestItemInput[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, MAX_SERVER_CART_LINES).flatMap((candidate) => {
    if (!candidate || typeof candidate !== "object") return [];
    const item = candidate as Record<string, unknown>;
    const itemType = safeString(item.itemType, 32);
    const itemId = safeString(String(item.itemId ?? item.productId ?? ""), 160);
    const name = safeString(item.name ?? item.title, 200);
    if (!itemType || !SUPPORTED_ITEM_TYPES.has(itemType) || !itemId || !name) return [];

    const quantityValue = typeof item.quantity === "number" ? item.quantity : 1;
    const quantity = Math.min(Math.max(Math.round(quantityValue), 1), 99999);
    const price = typeof item.price === "number" && Number.isFinite(item.price)
      ? Math.max(item.price, 0)
      : undefined;

    return [{
      itemType,
      itemId,
      variantId: safeString(String(item.variantId ?? ""), 160),
      name,
      slug: safeString(item.slug, 160),
      parentSlug: safeString(item.parentSlug, 160),
      quantity,
      price,
      priceOnRequest: item.priceOnRequest !== false,
      url: safeString(item.url, 300),
      variantLabel: safeString(item.variantLabel, 160),
      notes: safeString(item.notes, 1000),
    }];
  }).map((item) =>
    Object.fromEntries(
      Object.entries(item).filter(([, fieldValue]) => fieldValue !== undefined),
    ) as RequestItemInput
  );
}
