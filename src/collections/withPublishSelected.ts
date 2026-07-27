import type { CollectionConfig } from "payload";

const PUBLISH_SELECTED =
  "./payload-admin/PublishSelectedButton.tsx#PublishSelectedButton";

/** Attach list-view bulk publish to collections that use `statusField`. */
export function withPublishSelected(
  collection: CollectionConfig,
): CollectionConfig {
  const admin = collection.admin ?? {};
  const components = admin.components ?? {};
  const beforeListTable = components.beforeListTable ?? [];

  if (beforeListTable.includes(PUBLISH_SELECTED)) {
    return collection;
  }

  return {
    ...collection,
    admin: {
      ...admin,
      components: {
        ...components,
        beforeListTable: [...beforeListTable, PUBLISH_SELECTED],
      },
    },
  };
}
