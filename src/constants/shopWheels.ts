export type ShopWheelDesign = {
  slug: string;
  name: string;
  positioning: string;
  finish: string;
  description: string;
  heroImage: string;
  gallery: readonly {
    src: string;
    alt: string;
    label: string;
  }[];
};

const wheelImage = (slug: string, view: string) =>
  `/images/premium/shop/wheels/${slug}/bizon-${slug}-${view}.png`;

export const SHOP_WHEEL_DESIGNS = [
  {
    slug: "atlas",
    name: "BIZON Atlas",
    positioning: "Off-road",
    finish: "Satin Black / Machined Silver",
    description: "Выразительная геометрия для внедорожного образа и уверенного визуального присутствия.",
  },
  {
    slug: "vector",
    name: "BIZON Vector",
    positioning: "Urban",
    finish: "Graphite",
    description: "Чистый городской дизайн с точным ритмом спиц и сдержанной графитовой отделкой.",
  },
  {
    slug: "nomad",
    name: "BIZON Nomad",
    positioning: "Expedition",
    finish: "Bronze",
    description: "Экспедиционный характер, глубокий профиль и тёплый бронзовый акцент.",
  },
  {
    slug: "ember",
    name: "BIZON Ember",
    positioning: "Performance",
    finish: "Red",
    description: "Энергичный дизайн с ярким цветовым акцентом для индивидуальной конфигурации автомобиля.",
  },
  {
    slug: "bastion",
    name: "BIZON Bastion",
    positioning: "Off-road",
    finish: "Dark Graphite",
    description: "Массивная архитектура и тёмная отделка для собранного внедорожного образа.",
  },
].map((design) => ({
  ...design,
  heroImage: wheelImage(design.slug, "hero-3q"),
  gallery: [
    {
      src: wheelImage(design.slug, "front"),
      alt: `${design.name}, фронтальный вид`,
      label: "Front",
    },
    {
      src: wheelImage(design.slug, "depth-3q"),
      alt: `${design.name}, объём и глубина профиля`,
      label: "Depth",
    },
    {
      src: wheelImage(design.slug, "detail"),
      alt: `${design.name}, деталь поверхности`,
      label: "Detail",
    },
  ],
})) satisfies readonly ShopWheelDesign[];

export function getShopWheelDesignBySlug(slug: string): ShopWheelDesign | null {
  const normalized = slug?.trim().toLowerCase();
  return SHOP_WHEEL_DESIGNS.find((design) => design.slug === normalized) ?? null;
}

