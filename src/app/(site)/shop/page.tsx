import { createPageMetadata } from "@/lib/seo/metadata";
import { getShopCategories, getWheelTypes } from "@/lib/cms";
import { CatalogListingPage } from "@/components/catalog/CatalogListingPage";

export const metadata = createPageMetadata({
  title: "Магазин",
  description: "Категории продукции BIZON — шины и аксессуары для fleet-операторов.",
  path: "/shop",
});

export default async function ShopPage() {
  const [categories, wheelTypes] = await Promise.all([getShopCategories(), getWheelTypes()]);

  const items = [
    ...wheelTypes.map((wheelType) => ({
      key: `wheel-${wheelType.slug}`,
      href: `/shop/wheels/${wheelType.slug}`,
      title: wheelType.name,
      description: wheelType.shortDescription,
      imageUrl: wheelType.imageUrl,
      imageAlt: wheelType.name,
    })),
    ...categories.map((category) => ({
      key: `category-${category.slug}`,
      href: `/shop/${category.slug}`,
      title: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      imageAlt: category.name,
    })),
  ];

  return (
    <CatalogListingPage
      title="Магазин"
      description="Каталог продукции для автопарков и тяжёлой техники."
      breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/shop", label: "Магазин" }]}
      items={items}
    />
  );
}
