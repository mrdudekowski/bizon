import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import {
  catalogDeleteAccess,
  catalogReadAccess,
  catalogWriteAccess,
} from "@/access/content";
import {
  ADMIN_GROUPS,
  TIRE_APPLICATION_CATEGORIES,
  documentsField,
  galleryField,
  mainImageField,
  publishedAtField,
  seoFields,
  slugField,
  statusField,
} from "@/collections/fields";
import { catalogContentHooks } from "@/payload/hooks/catalogContentHooks";

export const TireModels: CollectionConfig = {
  slug: "tire-models",
  labels: {
    singular: "Модель шины",
    plural: "Модели шин",
  },
  admin: {
    group: ADMIN_GROUPS.tireCatalog,
    useAsTitle: "name",
    defaultColumns: ["name", "tireType", "applicationCategory", "status", "updatedAt"],
    description:
      "Конкретная модель шины. Тип (TBR/OTR) — через «Тип шин». Сегмент применения — через «Сегмент применения».",
  },
  access: {
    read: catalogReadAccess,
    create: catalogWriteAccess,
    update: catalogWriteAccess,
    delete: catalogDeleteAccess,
  },
  hooks: catalogContentHooks,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Название модели",
      required: true,
    },
    slugField(),
    {
      name: "tireType",
      type: "relationship",
      relationTo: "tire-types",
      label: "Тип шин",
      required: true,
      admin: {
        description: "TBR, OTR, Agriculture и т.д. — техническая группа каталога",
      },
    },
    {
      name: "applicationCategory",
      type: "select",
      label: "Сегмент применения",
      required: true,
      options: [...TIRE_APPLICATION_CATEGORIES],
      admin: {
        description: "Long Haul, Regional и т.д. — не путать с типом шин (TBR/OTR)",
      },
    },
    {
      name: "series",
      type: "text",
      label: "Серия",
    },
    {
      name: "application",
      type: "text",
      label: "Применение",
    },
    {
      name: "axlePosition",
      type: "text",
      label: "Положение оси",
    },
    {
      name: "treadType",
      type: "text",
      label: "Тип протектора",
    },
    {
      name: "shortDescription",
      type: "textarea",
      label: "Краткое описание",
    },
    {
      name: "fullDescription",
      type: "richText",
      label: "Полное описание",
      editor: lexicalEditor(),
    },
    {
      name: "advantages",
      type: "array",
      label: "Преимущества",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Заголовок",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Описание",
        },
      ],
    },
    mainImageField(),
    galleryField(),
    documentsField(),
    seoFields,
    statusField(),
    publishedAtField(),
  ],
};
