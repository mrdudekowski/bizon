import {
  buildMainDualPaneMenuSections,
  buildShopDualPaneMenuSections,
} from "./buildDualPaneMenu";
import type { DualPaneMenuData } from "./dualPaneMenuTypes";
import { getPublishedTireModels } from "./getTireModels";
import { getPublishedWheelModels } from "./getWheelModels";
import { getShopCategories } from "./getShopCategories";
import { getTireIQArticles } from "./getTireIQArticles";
import { getTireTypes } from "./getTireTypes";

export type { DualPaneItem, DualPaneMenuData, DualPaneSection } from "./dualPaneMenuTypes";
export { buildMainDualPaneMenuSections, buildShopDualPaneMenuSections } from "./buildDualPaneMenu";

export async function getMainDualPaneMenu(): Promise<DualPaneMenuData> {
  const [models, tireTypes, articles] = await Promise.all([
    getPublishedTireModels(),
    getTireTypes(),
    getTireIQArticles(),
  ]);

  return {
    defaultSectionId: "models",
    sections: buildMainDualPaneMenuSections({ models, tireTypes, articles }),
  };
}

export async function getShopDualPaneMenu(): Promise<DualPaneMenuData> {
  const [wheels, categories] = await Promise.all([
    getPublishedWheelModels(),
    getShopCategories(),
  ]);

  return {
    defaultSectionId: "wheels",
    sections: buildShopDualPaneMenuSections({ wheels, categories }),
  };
}
