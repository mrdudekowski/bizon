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
  getTireModelsByTypeSlug,
  getTireModelByTypeAndSlug,
  getAllTireModelRouteParams,
  getPublishedTireModels,
} from "./getTireModels";
import { getTireTypes, getTireTypeBySlug, getAllTireTypeSlugs } from "./getTireTypes";
import { getTireVariantsByModelId } from "./getTireVariants";
import {
  getWheelModelsByTypeSlug,
  getWheelModelByTypeAndSlug,
  getAllWheelModelRouteParams,
  getPublishedWheelModels,
} from "./getWheelModels";
import {
  getWheelTypes,
  getWheelTypeBySlug,
  getAllWheelTypeSlugs,
} from "./getWheelTypes";
import { getWheelVariantsByModelId, getWheelVariantsByTypeSlug } from "./getWheelVariants";
import { getMainDualPaneMenu, getShopDualPaneMenu } from "./getDualPaneMenu";
import { getPublishedTireCatalog } from "@/lib/catalog/getPublishedTireCatalog";
import { getPageContent } from "./pages/getPageContent";

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
  getTireModelsByTypeSlug,
  getTireModelByTypeAndSlug,
  getAllTireModelRouteParams,
  getPublishedTireModels,
  getTireVariantsByModelId,
  getWheelTypes,
  getWheelTypeBySlug,
  getAllWheelTypeSlugs,
  getWheelModelsByTypeSlug,
  getWheelModelByTypeAndSlug,
  getAllWheelModelRouteParams,
  getPublishedWheelModels,
  getWheelVariantsByModelId,
  getWheelVariantsByTypeSlug,
  getMainDualPaneMenu,
  getShopDualPaneMenu,
  getPublishedTireCatalog,
  getPageContent,
};

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
