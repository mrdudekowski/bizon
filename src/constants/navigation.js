/**
 * Canonical public routes — single source of truth for navigation.
 */
export const ROUTES = {
  home: "/",
  models: "/models",
  shop: "/shop",
  tireIq: "/tire-iq",
  peopleStories: "/people-stories",
  contact: "/contact",
  warranty: "/warranty",
  about: "/about",
};

/** Primary header navigation */
export const HEADER_NAV = [
  { label: "Модели", href: ROUTES.models },
  { label: "Магазин", href: ROUTES.shop },
  { label: "Контакты", href: ROUTES.contact },
];

/** Static routes included in sitemap */
export const SITEMAP_STATIC_ROUTES = [
  ROUTES.home,
  ROUTES.models,
  ROUTES.shop,
  ROUTES.tireIq,
  ROUTES.peopleStories,
  ROUTES.contact,
  ROUTES.warranty,
  ROUTES.about,
];
