import { ROUTES } from "@/constants/navigation";

/**
 * BIZON Shop burger content.
 * Kept separate from the main-site CMS menu so the shop can evolve independently.
 */
export const SHOP_BURGER_MENU_ITEMS = [
  {
    id: "shop-catalog",
    label: "Каталог",
    items: [
      { name: "Все категории", link: ROUTES.shopCategories },
      { name: "Кованые диски BIZON", link: `${ROUTES.shop}/wheels/forged` },
      { name: "Аксессуары", link: `${ROUTES.shop}/accessories` },
      { name: "Outdoor", link: `${ROUTES.shop}/outdoor` },
    ],
  },
  {
    id: "shop-service",
    label: "Покупателям",
    items: [
      { name: "Доставка и возврат", link: ROUTES.shopDeliveryAndReturns },
      { name: "Связаться с BIZON", link: ROUTES.contact },
    ],
  },
  {
    id: "shop-bizon",
    label: "BIZON Tires",
    items: [
      { name: "Шины для коммерческого транспорта", link: ROUTES.models },
      { name: "Вернуться на основной сайт", link: ROUTES.home },
    ],
  },
];
