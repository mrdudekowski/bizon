import { ShopCategoriesIndex } from "@/components/shop/ShopCategoriesIndex";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Категории BIZON Shop",
  description: "Accessories и Outdoor — два lifestyle-направления BIZON Shop.",
  path: "/shop/categories",
});

export default function ShopCategoriesPage() {
  return <ShopCategoriesIndex />;
}
