import type { Field } from "payload";

import type { PageKey } from "./keys";

function whenKey(...keys: PageKey[]) {
  return (_data: unknown, siblingData: { key?: string } | undefined) =>
    Boolean(siblingData?.key && keys.includes(siblingData.key as PageKey));
}

function ctaFields(prefix = ""): Field[] {
  return [
    {
      name: "label",
      type: "text",
      label: "Текст кнопки",
      admin: { description: prefix || undefined },
    },
    {
      name: "href",
      type: "text",
      label: "Ссылка",
      admin: {
        description: "Внутренний путь (/shop) или https://…",
      },
    },
  ];
}

function shellFields(): Field[] {
  return [
    { name: "eyebrow", type: "text", label: "Надзаголовок" },
    { name: "title", type: "text", label: "Заголовок" },
    { name: "lead", type: "textarea", label: "Подзаголовок / описание" },
  ];
}

export function pageSectionFields(): Field[] {
  return [
    {
      name: "homeHero",
      type: "group",
      label: "Герой",
      admin: { condition: whenKey("home") },
      fields: [
        ...shellFields(),
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Фоновое изображение",
        },
        { name: "imageAlt", type: "text", label: "Alt изображения" },
        {
          name: "primaryCta",
          type: "group",
          label: "Основная кнопка",
          fields: ctaFields(),
        },
        {
          name: "secondaryCta",
          type: "group",
          label: "Вторая кнопка",
          fields: ctaFields(),
        },
        { name: "metricLabel", type: "text", label: "Метрика (номер)" },
        { name: "metricText", type: "text", label: "Метрика (текст)" },
      ],
    },
    {
      name: "homeSelectionEntry",
      type: "group",
      label: "Подбор по технике",
      admin: { condition: whenKey("home") },
      fields: shellFields(),
    },
    {
      name: "homeDirections",
      type: "group",
      label: "Направления шин",
      admin: { condition: whenKey("home") },
      fields: shellFields(),
    },
    {
      name: "homeExpertise",
      type: "group",
      label: "Экспертиза",
      admin: { condition: whenKey("home") },
      fields: shellFields(),
    },
    {
      name: "homeShopCampaign",
      type: "group",
      label: "Кампания Shop",
      admin: { condition: whenKey("home") },
      fields: [
        ...shellFields(),
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Изображение",
        },
        { name: "imageAlt", type: "text", label: "Alt изображения" },
        {
          name: "cta",
          type: "group",
          label: "Кнопка",
          fields: ctaFields(),
        },
      ],
    },
    {
      name: "homeResume",
      type: "group",
      label: "Призыв к подбору",
      admin: { condition: whenKey("home") },
      fields: [
        ...shellFields(),
        {
          name: "primaryCta",
          type: "group",
          label: "Основная кнопка",
          fields: ctaFields(),
        },
        {
          name: "secondaryCta",
          type: "group",
          label: "Вторая кнопка",
          fields: ctaFields(),
        },
      ],
    },
    {
      name: "shopHero",
      type: "group",
      label: "Герой Shop",
      admin: { condition: whenKey("shop-home") },
      fields: [
        ...shellFields(),
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Фоновое изображение",
        },
        { name: "imageAlt", type: "text", label: "Alt изображения" },
        {
          name: "cta",
          type: "group",
          label: "Кнопка",
          fields: ctaFields(),
        },
      ],
    },
    {
      name: "shopWheelsIntro",
      type: "group",
      label: "Вступление к дискам",
      admin: { condition: whenKey("shop-home") },
      fields: [
        { name: "kicker", type: "text", label: "Kicker" },
        ...shellFields(),
      ],
    },
    {
      name: "shopOrderSteps",
      type: "array",
      label: "Шаги заказа",
      maxRows: 6,
      admin: {
        condition: whenKey("shop-home"),
        initCollapsed: true,
      },
      fields: [
        { name: "title", type: "text", label: "Заголовок", required: true },
        { name: "description", type: "textarea", label: "Описание" },
      ],
    },
    {
      name: "shopCategoryCarousel",
      type: "array",
      label: "Карусель категорий",
      admin: {
        condition: whenKey("shop-home"),
        initCollapsed: true,
      },
      fields: [
        {
          name: "slideId",
          type: "text",
          label: "ID слайда",
          admin: { description: "Например: accessories" },
        },
        { name: "kicker", type: "text", label: "Kicker" },
        { name: "title", type: "text", label: "Заголовок" },
        { name: "action", type: "text", label: "Текст действия" },
        { name: "href", type: "text", label: "Ссылка" },
        {
          name: "desktopImage",
          type: "upload",
          relationTo: "media",
          label: "Изображение desktop",
        },
        {
          name: "mobileImage",
          type: "upload",
          relationTo: "media",
          label: "Изображение mobile",
        },
        { name: "alt", type: "text", label: "Alt" },
      ],
    },
    {
      name: "shopVehicles",
      type: "group",
      label: "Автомобили / lifestyle",
      admin: { condition: whenKey("shop-home") },
      fields: [
        ...shellFields(),
        {
          name: "cta",
          type: "group",
          label: "Кнопка",
          fields: ctaFields(),
        },
        {
          name: "slides",
          type: "array",
          label: "Кадры",
          admin: { initCollapsed: true },
          fields: [
            { name: "title", type: "text", label: "Подпись" },
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Изображение",
            },
            { name: "alt", type: "text", label: "Alt" },
          ],
        },
      ],
    },
    {
      name: "stubHero",
      type: "group",
      label: "Герой",
      admin: {
        condition: whenKey(
          "about",
          "contact",
          "warranty",
          "branding",
          "become-a-supplier",
          "privacy-policy",
          "shop-delivery-returns",
        ),
      },
      fields: [
        ...shellFields(),
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Изображение",
        },
        { name: "imageAlt", type: "text", label: "Alt изображения" },
      ],
    },
  ];
}
