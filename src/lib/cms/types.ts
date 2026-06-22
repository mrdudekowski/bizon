/** Public CMS shapes consumed by pages and SEO helpers — keep stable when swapping data sources. */

export type CmsProduct = {
  id?: string;
  slug: string;
  name: string;
  categorySlug: string;
  type: string;
  brand: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl?: string | null;
};

export type CmsShopCategory = {
  slug: string;
  name: string;
  description: string;
  imageUrl?: string | null;
};

export type CmsTireType = {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  sortOrder: number;
  showInMenu: boolean;
  imageUrl?: string | null;
};

export type CmsTireModel = {
  id: string;
  slug: string;
  name: string;
  tireTypeSlug: string;
  tireTypeName: string;
  applicationCategory: string;
  brand: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl?: string | null;
  application?: string;
  axlePosition?: string;
  treadType?: string;
};

export type CmsTireVariant = {
  id: string;
  size: string;
  rimDiameter?: number;
  loadIndex?: string;
  speedIndex?: string;
  plyRating?: string;
  overallDiameter?: number;
  weight?: number;
  recommendedRim?: string;
  available: boolean;
  price?: number;
  priceOnRequest: boolean;
};

export type TireModelRouteParam = {
  tireTypeSlug: string;
  modelSlug: string;
};

export type CmsArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  /** Payload Lexical JSON — render with LexicalContent on detail pages. */
  content: unknown;
  imageUrl?: string | null;
};

export type CmsStory = CmsArticle & {
  clientName?: string;
  industry?: string;
};

export type WheelModelRouteParam = {
  wheelTypeSlug: string;
  modelSlug: string;
};

export type CmsWheelType = {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  sortOrder: number;
  imageUrl?: string | null;
};

export type CmsWheelModel = {
  id: string;
  slug: string;
  name: string;
  wheelTypeSlug: string;
  wheelTypeName: string;
  series?: string;
  designStyle?: string;
  material?: string;
  constructionMethod?: string;
  fitmentNotes?: string;
  descriptionShort: string;
  descriptionLong: string;
  imageUrl?: string | null;
  documents?: { url: string; title: string }[];
};

export type CmsWheelVariant = {
  id: string;
  modelId: string;
  sizeLabel: string;
  sku?: string;
  diameter?: number;
  width?: number;
  boltHoles?: number;
  pcd?: string;
  offsetET?: number;
  centerBore?: number;
  loadRating?: string;
  weight?: number;
  color?: string;
  finish?: string;
  compatibleTireSizes?: string;
  available: boolean;
  price?: number;
  priceOnRequest: boolean;
};

export type GetShopProductsOptions = {
  categorySlug?: string;
};
