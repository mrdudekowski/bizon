import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import {
  catalogDeleteAccess,
  catalogReadAccess,
  catalogWriteAccess,
} from "@/access/content";
import {
  ADMIN_GROUPS,
  mainImageField,
  publishedAtField,
  seoFields,
  slugField,
  statusField,
} from "@/collections/fields";
import { setPublishedAt } from "@/payload/hooks/setPublishedAt";

export const TireIQArticles: CollectionConfig = {
  slug: "tire-iq-articles",
  labels: {
    singular: "Статья Tire IQ",
    plural: "Tire IQ",
  },
  admin: {
    group: ADMIN_GROUPS.content,
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt", "updatedAt"],
    description: "Экспертные статьи для раздела /tire-iq.",
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
      name: "title",
      type: "text",
      label: "Заголовок",
      required: true,
    },
    slugField({ fieldToUse: "title" }),
    {
      name: "excerpt",
      type: "textarea",
      label: "Краткое описание",
      admin: {
        description: "Для карточек в списке статей",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Текст статьи",
      required: true,
      editor: lexicalEditor(),
    },
    mainImageField({ name: "featuredImage", label: "Обложка" }),
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      label: "Автор",
      admin: { position: "sidebar" },
    },
    seoFields,
    statusField(),
    publishedAtField(),
  ],
};
