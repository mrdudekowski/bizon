import { ROUTES } from "@/constants/navigation";
import { getTireTypes } from "./getTireTypes";

const MAIN_MENU_SECTIONS = [
  {
    id: "services",
    label: "Сервис и поддержка",
    items: [
      { name: "BIZON Shop", link: ROUTES.shop, description: "Диски и аксессуары" },
      { name: "Индивидуальное брендирование", link: ROUTES.branding },
      { name: "Гарантия", link: ROUTES.warranty },
    ],
  },
  {
    id: "company",
    label: "Материалы и компания",
    items: [
      { name: "Tire IQ", link: ROUTES.tireIq, description: "Статьи и рекомендации" },
      { name: "Истории клиентов", link: ROUTES.peopleStories },
      { name: "О компании", link: ROUTES.about },
      { name: "Стать поставщиком", link: ROUTES.supplier },
    ],
  },
];

export async function getMainMenuItems() {
  const tireTypes = await getTireTypes();
  const tireTypeItems = tireTypes
    .filter((type) => type.showInMenu)
    .map((type) => ({
      id: type.slug,
      name: type.name,
      description: type.shortDescription,
      link: `${ROUTES.models}/${type.slug}`,
    }));

  return [
    {
      id: "models",
      label: "Каталог шин",
      items: [
        { name: "Все шины", link: ROUTES.models, description: "TBR и OTR" },
        ...tireTypeItems,
      ],
    },
    ...MAIN_MENU_SECTIONS,
  ];
}

/** @deprecated Use getMainMenuItems to make the site context explicit. */
export const getMenuItems = getMainMenuItems;
