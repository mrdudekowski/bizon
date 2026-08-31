import { mapWheelModelDetail, resolveRelationSlug } from "./payload/mappers";
import { findPublished, findPublishedBySlug } from "./payload/query";
import type { WheelModel } from "@/payload-types";
import type { CmsWheelModel, WheelModelRouteParam } from "./types";
import localModels from "@/lib/content/local/wheel-models.json";
import localTypes from "@/lib/content/local/wheel-types.json";
import { isLocalMediaMode } from "@/lib/media/mediaMode";

function localRelationId(value: unknown): string | number | null {
  if (typeof value === "number" || typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value) return (value as { id?: string | number }).id ?? null;
  return null;
}

function localWheelModels(typeSlug?: string): CmsWheelModel[] {
  const type = typeSlug ? localTypes.find((item) => item.slug === typeSlug) : null;
  return (localModels as WheelModel[]).filter((item) => !type || localRelationId(item.wheelType) === type.id).map(mapWheelModelDetail);
}

/** Published wheel models for dual-pane menu. */
export async function getPublishedWheelModels(): Promise<CmsWheelModel[]> {
  if (isLocalMediaMode()) return localWheelModels();
  const docs = await findPublished("wheel-models", { depth: 1 });
  if (!docs?.length) return [];
  return docs.map((doc) => mapWheelModelDetail(doc as WheelModel));
}

export async function getWheelModelsByTypeSlug(wheelTypeSlug: string): Promise<CmsWheelModel[]> {
  const normalized = wheelTypeSlug?.trim().toLowerCase();
  if (!normalized) return [];
  if (isLocalMediaMode()) return localWheelModels(normalized);

  const typeDoc = await findPublishedBySlug("wheel-types", normalized);
  if (!typeDoc) return [];

  const docs = await findPublished("wheel-models", {
    where: { wheelType: { equals: typeDoc.id } },
    depth: 1,
  });
  if (!docs?.length) return [];
  return docs.map((doc) => mapWheelModelDetail(doc as WheelModel));
}

export async function getWheelModelByTypeAndSlug(
  wheelTypeSlug: string,
  modelSlug: string,
): Promise<CmsWheelModel | null> {
  const normalizedType = wheelTypeSlug?.trim().toLowerCase();
  if (isLocalMediaMode()) return localWheelModels(normalizedType).find((model) => model.slug === modelSlug) ?? null;
  const doc = await findPublishedBySlug("wheel-models", modelSlug);
  if (!doc) return null;

  const model = mapWheelModelDetail(doc as WheelModel);
  return model.wheelTypeSlug === normalizedType ? model : null;
}

export async function getAllWheelModelRouteParams(): Promise<WheelModelRouteParam[]> {
  if (isLocalMediaMode()) return localWheelModels().map((model) => ({ wheelTypeSlug: model.wheelTypeSlug, modelSlug: model.slug }));
  const docs = await findPublished("wheel-models", { depth: 1 });
  if (!docs?.length) return [];

  return docs
    .map((doc) => {
      const wheelTypeSlug = resolveRelationSlug((doc as WheelModel).wheelType);
      const modelSlug = "slug" in doc && typeof doc.slug === "string" ? doc.slug : null;
      if (!wheelTypeSlug || !modelSlug) return null;
      return { wheelTypeSlug, modelSlug };
    })
    .filter((item): item is WheelModelRouteParam => Boolean(item));
}
