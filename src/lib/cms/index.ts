import {
  getShopProducts,
  getAllShopProductSlugs,
  getShopProductsByCategorySlug,
} from "./getProducts";
import { getShopProductBySlug } from "./getProductBySlug";
import { getShopCategories, getShopCategoryBySlug, getAllShopCategorySlugs } from "./getShopCategories";
import {
  getTireIQArticles,
  getTireIQArticleBySlug,
  getAllTireIQSlugs,
} from "./getTireIQArticles";
import {
  getPeopleStories,
  getPeopleStoryBySlug,
  getAllPeopleStorySlugs,
} from "./getPeopleStories";
import {
  getTireModels,
  getTireModelsByTypeSlug,
  getTireModelBySlug,
  getTireModelByTypeAndSlug,
  getAllTireModelSlugs,
  getAllTireModelRouteParams,
} from "./getTireModels";
import { getTireTypes, getTireTypeBySlug, getAllTireTypeSlugs } from "./getTireTypes";
import { getTireVariantsByModelId } from "./getTireVariants";
import {
  getWheelModelsByTypeSlug,
  getWheelModelByTypeAndSlug,
  getAllWheelModelRouteParams,
} from "./getWheelModels";
import {
  getWheelTypes,
  getWheelTypeBySlug,
  getDefaultWheelType,
  getAllWheelTypeSlugs,
} from "./getWheelTypes";
import { getWheelVariantsByModelId, getWheelVariantsByTypeSlug } from "./getWheelVariants";
import { getMenuItems } from "./getMenuItems";

export {
  getShopProducts,
  getShopProductsByCategorySlug,
  getShopProductBySlug,
  getAllShopProductSlugs,
  getShopCategories,
  getShopCategoryBySlug,
  getAllShopCategorySlugs,
  getTireIQArticles,
  getTireIQArticleBySlug,
  getAllTireIQSlugs,
  getPeopleStories,
  getPeopleStoryBySlug,
  getAllPeopleStorySlugs,
  getTireTypes,
  getTireTypeBySlug,
  getAllTireTypeSlugs,
  getTireModels,
  getTireModelsByTypeSlug,
  getTireModelBySlug,
  getTireModelByTypeAndSlug,
  getAllTireModelSlugs,
  getAllTireModelRouteParams,
  getTireVariantsByModelId,
  getWheelTypes,
  getWheelTypeBySlug,
  getDefaultWheelType,
  getAllWheelTypeSlugs,
  getWheelModelsByTypeSlug,
  getWheelModelByTypeAndSlug,
  getAllWheelModelRouteParams,
  getWheelVariantsByModelId,
  getWheelVariantsByTypeSlug,
  getMenuItems,
};

export { getPublishedMediaById, getPublishedMediaList } from "./getMedia";
export { resolveMedia, resolveMediaUrl, type ResolvedMedia } from "./media";
export type {
  CmsProduct,
  CmsShopCategory,
  CmsTireType,
  CmsTireModel,
  CmsTireVariant,
  CmsWheelType,
  CmsWheelModel,
  CmsWheelVariant,
  TireModelRouteParam,
  WheelModelRouteParam,
  CmsArticle,
  CmsStory,
} from "./types";
