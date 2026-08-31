import { mapProduct } from "./payload/mappers";
import { findPublishedBySlug } from "./payload/query";
import type { Product } from "@/payload-types";
import type { CmsProduct } from "./types";
import { isLocalMediaMode } from "@/lib/media/mediaMode";
import localProducts from "@/lib/content/local/shop-products.json";

export async function getShopProductBySlug(slug: string): Promise<CmsProduct | null> {
  if (isLocalMediaMode()) {
    const product = localProducts.find((item) => item.slug === slug && item.status === "published");
    return product
      ? {
          slug: product.slug,
          name: product.name,
          categorySlug: product.shopCategorySlug,
          type: "shop",
          brand: "BIZON",
          descriptionShort: product.shortDescription,
          descriptionLong: product.shortDescription,
          gallery: [],
          priceOnRequest: product.priceOnRequest,
          available: true,
          variants: [],
        }
      : null;
  }
  const doc = await findPublishedBySlug("products", slug);
  return doc ? mapProduct(doc as Product) : null;
}
