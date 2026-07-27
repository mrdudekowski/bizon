import { TIRE_PERFORMANCE_FEATURE_OPTIONS } from "@/collections/fields/tireCatalogFields";

export type TireFeatureKey = (typeof TIRE_PERFORMANCE_FEATURE_OPTIONS)[number]["value"];

export type FeatureImage = {
  src: string;
  alt: string;
  label: string;
};

export const FEATURE_IMAGE_KEYS = TIRE_PERFORMANCE_FEATURE_OPTIONS.map(
  (option) => option.value,
) as TireFeatureKey[];

const byKey = Object.fromEntries(
  TIRE_PERFORMANCE_FEATURE_OPTIONS.map((option) => [
    option.value,
    {
      src: `/images/catalog/features/${option.value}.png`,
      alt: option.label,
      label: option.label,
    } satisfies FeatureImage,
  ]),
) as Record<TireFeatureKey, FeatureImage>;

export function getFeatureImage(key: string): FeatureImage | null {
  if (key in byKey) return byKey[key as TireFeatureKey];
  return null;
}
