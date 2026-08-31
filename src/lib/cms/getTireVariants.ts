import { mapTireVariant } from "./payload/mappers";
import { findPublished } from "./payload/query";
import type { TireVariant } from "@/payload-types";
import type { CmsTireVariant } from "./types";
import localVariants from "@/lib/content/local/tire-variants.json";
import { isLocalMediaMode } from "@/lib/media/mediaMode";

export async function getTireVariantsByModelId(modelId: string | number): Promise<CmsTireVariant[]> {
  const id = typeof modelId === "string" ? Number(modelId) : modelId;
  if (!Number.isFinite(id)) return [];
  if (isLocalMediaMode()) {
    return (localVariants as TireVariant[])
      .filter((item) => item.tireModel === id || (item.tireModel && typeof item.tireModel === "object" && "id" in item.tireModel && item.tireModel.id === id))
      .map((item) => mapTireVariant(item));
  }

  const docs = await findPublished("tire-variants", {
    where: { tireModel: { equals: id } },
    sort: "sortOrder",
    depth: 0,
  });

  if (!docs || docs.length === 0) return [];

  return docs.map((doc) => mapTireVariant(doc as TireVariant));
}
