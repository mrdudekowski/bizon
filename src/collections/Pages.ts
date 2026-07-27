import type { CollectionConfig } from "payload";

import {
  catalogDeleteAccess,
  catalogReadAccess,
  catalogWriteAccess,
} from "@/access/content";
import { isAdmin } from "@/access/roles";
import {
  ADMIN_GROUPS,
  publishedAtField,
  seoFields,
  statusField,
} from "@/collections/fields";
import { pageSectionFields } from "@/lib/cms/pages/fields";
import { PAGE_KEY_OPTIONS, getPageRegistryEntry } from "@/lib/cms/pages/registry";
import { isPageKey } from "@/lib/cms/pages/keys";
import { catalogContentHooks } from "@/payload/hooks/catalogContentHooks";

export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: "Страница",
    plural: "Страницы сайта",
  },
  admin: {
    group: ADMIN_GROUPS.sitePages,
    useAsTitle: "title",
    defaultColumns: ["title", "key", "status", "updatedAt"],
    description:
      "Маркетинговые оболочки страниц. Состав секций фиксирован в коде; здесь правятся тексты, медиа и CTA.",
  },
  access: {
    read: catalogReadAccess,
    create: isAdmin,
    update: catalogWriteAccess,
    delete: catalogDeleteAccess,
  },
  hooks: {
    ...catalogContentHooks,
    beforeValidate: [
      ({ data }) => {
        if (!data) return data;
        if (isPageKey(data.key)) {
          const entry = getPageRegistryEntry(data.key);
          data.path = entry.path;
          if (!data.title?.trim()) data.title = entry.title;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: "key",
      type: "select",
      label: "Ключ страницы",
      required: true,
      unique: true,
      options: PAGE_KEY_OPTIONS,
      access: {
        // Seed/create sets key once; editors should not re-key pages.
        update: () => false,
      },
      admin: {
        description: "Технический ключ. Задаётся при создании, дальше не меняется.",
        position: "sidebar",
      },
    },
    {
      name: "title",
      type: "text",
      label: "Название в админке",
      required: true,
    },
    {
      name: "path",
      type: "text",
      label: "Маршрут на сайте",
      admin: {
        readOnly: true,
        position: "sidebar",
        description: "Подставляется автоматически по ключу.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Секции",
          fields: pageSectionFields(),
        },
        {
          label: "SEO",
          fields: [seoFields],
        },
      ],
    },
    statusField(),
    publishedAtField(),
  ],
};
