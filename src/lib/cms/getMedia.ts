import { getPayload } from "@/lib/payload/getPayload";
import { resolveMedia, type MediaSizeName, type ResolvedMedia } from "@/lib/cms/media";

export async function getPublishedMediaById(
  id: string | number,
  size?: MediaSizeName,
): Promise<ResolvedMedia | null> {
  const payload = await getPayload();

  try {
    const doc = await payload.findByID({
      collection: "media",
      id,
      depth: 0,
    });

    if (doc.status !== "published") return null;

    return resolveMedia(doc, size);
  } catch {
    return null;
  }
}

export async function getPublishedMediaList(limit = 20): Promise<ResolvedMedia[]> {
  const payload = await getPayload();

  const result = await payload.find({
    collection: "media",
    where: { status: { equals: "published" } },
    limit,
    sort: "-updatedAt",
    depth: 0,
  });

  return result.docs
    .map((doc) => resolveMedia(doc))
    .filter((item): item is ResolvedMedia => item !== null);
}
