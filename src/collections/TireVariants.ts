import type { CollectionConfig } from "payload";

import {
  catalogDeleteAccess,
  catalogReadAccess,
  catalogWriteAccess,
} from "@/access/content";
import { ADMIN_GROUPS, priceFieldsRow, publishedAtField, statusField } from "@/collections/fields";
import { setPublishedAt } from "@/payload/hooks/setPublishedAt";

export const TireVariants: CollectionConfig = {
  slug: "tire-variants",
  labels: {
    singular: "Размер и характеристики",
    plural: "Размеры и характеристики шин",
  },
  admin: {
    group: ADMIN_GROUPS.tireCatalog,
    useAsTitle: "size",
    defaultColumns: ["size", "tireModel", "available", "sortOrder", "status"],
    description: "Размеры и технические параметры конкретной модели шины.",
  },
  access: {
    read: catalogReadAccess,
    create: catalogWriteAccess,
    update: catalogWriteAccess,
    delete: catalogDeleteAccess,
  },
  hooks: {
    beforeChange: [setPublishedAt],
  },
  fields: [
    {
      name: "tireModel",
      type: "relationship",
      relationTo: "tire-models",
      label: "Модель шины",
      required: true,
    },
    {
      name: "size",
      type: "text",
      label: "Размер",
      required: true,
      admin: {
        description: "Например: 12.00R20",
      },
    },
    {
      type: "row",
      fields: [
        {
          name: "sectionWidth",
          type: "number",
          label: "Ширина профиля",
        },
        {
          name: "aspectRatio",
          type: "number",
          label: "Высота профиля",
        },
        {
          name: "rimDiameter",
          type: "number",
          label: "Диаметр обода",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "loadIndex",
          type: "text",
          label: "Индекс нагрузки",
        },
        {
          name: "speedIndex",
          type: "text",
          label: "Индекс скорости",
        },
        {
          name: "plyRating",
          type: "text",
          label: "PR (слойность)",
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "overallDiameter",
          type: "number",
          label: "Наружный диаметр (мм)",
        },
        {
          name: "weight",
          type: "number",
          label: "Масса (кг)",
        },
        {
          name: "recommendedRim",
          type: "text",
          label: "Рекомендуемый обод",
        },
      ],
    },
    {
      name: "available",
      type: "checkbox",
      label: "Доступен",
      defaultValue: true,
    },
    priceFieldsRow(),
    {
      name: "sortOrder",
      type: "number",
      label: "Порядок в таблице",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    statusField(),
    publishedAtField(),
  ],
};
