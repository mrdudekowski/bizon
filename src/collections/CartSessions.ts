import type { CollectionConfig } from "payload";

export const CartSessions: CollectionConfig = {
  slug: "cart-sessions",
  labels: {
    singular: "Анонимная корзина",
    plural: "Анонимные корзины",
  },
  admin: {
    hidden: true,
    useAsTitle: "tokenHash",
  },
  access: {
    read: () => false,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  timestamps: true,
  fields: [
    {
      name: "tokenHash",
      type: "text",
      required: true,
      unique: true,
      index: true,
    },
    {
      name: "items",
      type: "json",
      required: true,
      defaultValue: [],
    },
    {
      name: "expiresAt",
      type: "date",
      required: true,
      index: true,
    },
  ],
};
