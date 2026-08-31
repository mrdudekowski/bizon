import { TIRE_PERFORMANCE_FEATURE_OPTIONS } from "@/collections/fields/tireCatalogFields";
export type TireFeatureKey = (typeof TIRE_PERFORMANCE_FEATURE_OPTIONS)[number]["value"];
export type FeatureImage = { src: string; alt: string; label: string };
export const FEATURE_IMAGE_KEYS = TIRE_PERFORMANCE_FEATURE_OPTIONS.map((option) => option.value);
export function getFeatureImage(key: string): FeatureImage | null {
  const option = TIRE_PERFORMANCE_FEATURE_OPTIONS.find((item) => item.value === key);
  return option ? { src: `/images/catalog/feature-icons/${option.value}-v1.png`, alt: option.label, label: option.label } : null;
}
