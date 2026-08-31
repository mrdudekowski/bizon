export type CatalogRelationTo = "products" | "tire-models" | "wheel-models";
export function isCatalogRelationTo(value: string): value is CatalogRelationTo {
  return value === "products" || value === "tire-models" || value === "wheel-models";
}
