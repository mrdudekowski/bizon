import { CartPage } from "@/components/cart/CartPage";
import { PageHeader } from "@/components/catalog/PageHeader";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata = createPageMetadata({
  title: "Единая заявка BIZON",
  description: "Составьте одну заявку на шины BIZON, кованые диски и аксессуары.",
  path: "/cart",
});

export default function CartRoutePage() {
  return (
    <div className="section-inner">
      <PageHeader
        title="Единая заявка BIZON"
        description="Проверьте все позиции из BIZON Tires и BIZON Shop, затем оставьте контакты один раз."
        breadcrumbs={[{ href: "/", label: "Главная" }, { href: "/cart", label: "Заявка" }]}
      />
      <CartPage />
    </div>
  );
}
