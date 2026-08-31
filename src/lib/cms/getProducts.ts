import { mapProduct } from "./payload/mappers";
import { findPublished, findPublishedBySlug } from "./payload/query";
import type { Product } from "@/payload-types";
import type { CmsProduct } from "./types";
import { isLocalMediaMode } from "@/lib/media/mediaMode";
import localProducts from "@/lib/content/local/shop-products.json";

type ShopProductsOptions = {
  categorySlug?: string;
};

export async function getShopProducts(options: ShopProductsOptions = {}): Promise<CmsProduct[]> {
  const { categorySlug } = options;
  if (isLocalMediaMode()) {
    return localProducts
      .filter((product) => product.status === "published")
      .filter((product) => !categorySlug || product.shopCategorySlug === categorySlug)
      .map((product) => ({
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
      }));
  }

  if (categorySlug) {
    const category = await findPublishedBySlug("shop-categories", categorySlug);
    if (!category) return [];

    const docs = await findPublished("products", {
      where: { shopCategory: { equals: category.id } },
      depth: 1,
    });
    if (!docs?.length) return [];
    return docs.map((doc) => mapProduct(doc as Product));
  }

  const docs = await findPublished("products", { depth: 1 });
  if (!docs?.length) return [];
  return docs.map((doc) => mapProduct(doc as Product));
}

export async function getShopProductsByCategorySlug(categorySlug: string): Promise<CmsProduct[]> {
  return getShopProducts({ categorySlug });
}

export async function getAllShopProductSlugs(): Promise<string[]> {
  if (isLocalMediaMode()) return localProducts.map((product) => product.slug);
  const docs = await findPublished("products", {
    depth: 0,
    select: { slug: true },
  });
  if (!docs?.length) return [];

  return docs
    .map((doc) => ("slug" in doc && typeof doc.slug === "string" ? doc.slug : null))
    .filter((slug): slug is string => Boolean(slug));
}
