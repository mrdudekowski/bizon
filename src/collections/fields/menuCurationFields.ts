import type { Field } from "payload";

/** Shared CMS toggles for dual-pane burger curation. */
export function menuCurationFields(): Field[] {
  return [
    {
      name: "showInMenu",
      type: "checkbox",
      label: "Показывать в меню",
      defaultValue: true,
      admin: { position: "sidebar" },
    },
    {
      name: "menuOrder",
      type: "number",
      label: "Порядок в меню",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Меньше значение — выше в списке меню",
      },
    },
  ];
}
