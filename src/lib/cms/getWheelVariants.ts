import { mapWheelVariant } from "./payload/mappers";
import { findPublished } from "./payload/query";
import type { WheelVariant } from "@/payload-types";
import type { CmsWheelVariant } from "./types";
import { getWheelModelsByTypeSlug } from "./getWheelModels";
import localVariants from "@/lib/content/local/wheel-variants.json";
import { isLocalMediaMode } from "@/lib/media/mediaMode";

export async function getWheelVariantsByModelId(modelId: string | number): Promise<CmsWheelVariant[]> {
  const id = typeof modelId === "string" ? Number(modelId) : modelId;
  if (!Number.isFinite(id)) return [];
  if (isLocalMediaMode()) {
    return (localVariants as WheelVariant[])
      .filter((item) => item.wheelModel === id || (item.wheelModel && typeof item.wheelModel === "object" && "id" in item.wheelModel && item.wheelModel.id === id))
      .map((item) => mapWheelVariant(item, String(id)));
  }

  const docs = await findPublished("wheel-variants", {
    where: { wheelModel: { equals: id } },
    sort: "sortOrder",
    depth: 0,
  });
  if (!docs?.length) return [];

  return docs.map((doc) => mapWheelVariant(doc as WheelVariant, String(id)));
}

export async function getWheelVariantsByTypeSlug(wheelTypeSlug: string): Promise<CmsWheelVariant[]> {
  if (isLocalMediaMode()) {
    const models = await getWheelModelsByTypeSlug(wheelTypeSlug);
    const ids = new Set(models.map((model) => Number(model.id)));
    return (localVariants as WheelVariant[])
      .filter((item) => {
        const relation = item.wheelModel;
        const relationId = typeof relation === "object" && relation && "id" in relation ? relation.id : relation;
        return ids.has(Number(relationId));
      })
      .map((item) => mapWheelVariant(item));
  }
  const models = await getWheelModelsByTypeSlug(wheelTypeSlug);
  if (models.length === 0) return [];

  const modelIds = models.map((model) => Number(model.id)).filter(Number.isFinite);
  if (modelIds.length === 0) return [];

  const docs = await findPublished("wheel-variants", {
    where: { wheelModel: { in: modelIds } },
    sort: "sortOrder",
    depth: 0,
  });
  if (!docs?.length) return [];

  return docs.map((doc) => mapWheelVariant(doc as WheelVariant));
}
