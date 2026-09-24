export const SCHEMA_VERSION = "001_documents";

export const PAGE_KEYS = [
  "home",
  "shop-home",
  "about",
  "contact",
  "warranty",
  "branding",
  "become-a-supplier",
  "privacy-policy",
  "shop-delivery-returns",
];

export function isPageKey(value) {
  return typeof value === "string" && PAGE_KEYS.includes(value);
}

export function isPublishedTireDirection(value) {
  if (!value || typeof value !== "object") return false;
  return (
    typeof value.id === "string" &&
    value.id.length > 0 &&
    typeof value.slug === "string" &&
    value.slug.length > 0 &&
    typeof value.name === "string" &&
    Array.isArray(value.selectionVehicleTypes) &&
    Array.isArray(value.selectionConditions)
  );
}
