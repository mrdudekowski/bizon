export type ShopLifestyleCategory = {
  slug: "accessories" | "outdoor";
  kicker: string;
  title: string;
  description: string;
  desktopImage: string;
  mobileImage: string;
  imageAlt: string;
  principles: readonly {
    label: string;
    title: string;
    description: string;
  }[];
};

export const SHOP_LIFESTYLE_CATEGORIES: readonly ShopLifestyleCategory[] = [
  {
    slug: "accessories",
    kicker: "Accessories",
    title: "Детали для движения",
    description:
      "Автомобильные аксессуары и дорожные детали BIZON. Коллекция формируется — наличие, варианты и стоимость будут подтверждаться перед заказом.",
    desktopImage: "/images/premium/shop/lifestyle/categories/accessories-driver-glasses-primorye.png",
    mobileImage: "/images/premium/shop/lifestyle/categories/accessories-driver-glasses-primorye-mobile.png",
    imageAlt: "Водитель в очках BIZON на приморской дороге",
    principles: [
      {
        label: "01",
        title: "В дороге",
        description: "Очки, дорожные мелочи и детали для салона — единая автомобильная коллекция.",
      },
      {
        label: "02",
        title: "Варианты",
        description: "Цвет, размер и комплектация будут указаны на странице каждого товара.",
      },
      {
        label: "03",
        title: "Подтверждение",
        description: "Специалист BIZON уточнит наличие и стоимость после получения заявки.",
      },
    ],
  },
  {
    slug: "outdoor",
    kicker: "Outdoor",
    title: "За пределами маршрута",
    description:
      "Снаряжение BIZON для выездов, воды и спокойных остановок вне города. Коллекция формируется — комплектация и наличие подтверждаются перед заказом.",
    desktopImage: "/images/premium/shop/lifestyle/categories/outdoor-wrangler-camp-desktop.png",
    mobileImage: "/images/premium/shop/lifestyle/categories/outdoor-wrangler-camp-mobile.png",
    imageAlt: "Wrangler BIZON и компания на летней стоянке у лесного озера",
    principles: [
      {
        label: "01",
        title: "На выезде",
        description: "Предметы для маршрута, стоянки и отдыха собраны в одном outdoor-направлении.",
      },
      {
        label: "02",
        title: "Комплектация",
        description: "Состав набора и доступные варианты будут видны до добавления в заявку.",
      },
      {
        label: "03",
        title: "Подтверждение",
        description: "Специалист BIZON уточнит наличие и стоимость после получения заявки.",
      },
    ],
  },
] as const;

export function getShopLifestyleCategory(slug: string): ShopLifestyleCategory | undefined {
  return SHOP_LIFESTYLE_CATEGORIES.find((category) => category.slug === slug);
}
