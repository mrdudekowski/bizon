import type { Media } from "@/payload-types";

import { shouldServeMediaFromPublicDir, toLocalPublicMediaUrl } from "./localMediaUrl";
import { isS3StorageEnabled } from "@/lib/payload/s3StorageConfig";

export type MediaSizeName = "thumbnail" | "card" | "hero" | "og";

export type ResolvedMedia = {
  url: string;
  alt: string;
  title?: string | null;
  mimeType?: string | null;
  filename?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  mediaType?: Media["mediaType"];
};

export function isPopulatedMedia(
  value: Media | number | string | null | undefined,
): value is Media {
  return Boolean(value && typeof value === "object" && "url" in value);
}

/**
 * Resolve a public URL for a Payload Media document.
 * Prefers generated image sizes when available.
 * Local storage: use /media/{filename} (Next public), not prefixed /api/media/file URLs.
 */
export function resolveMediaUrl(
  media: Media | number | string | null | undefined,
  size?: MediaSizeName,
): string | null {
  if (!isPopulatedMedia(media)) return null;

  if (size) {
    const sizedName = media.sizes?.[size]?.filename;
    if (
      sizedName &&
      (!isS3StorageEnabled() || shouldServeMediaFromPublicDir(sizedName))
    ) {
      const localSized = toLocalPublicMediaUrl(sizedName);
      if (localSized) return localSized;
    }
    const sizedUrl = media.sizes?.[size]?.url;
    if (sizedUrl) return sizedUrl;
  }

  if (
    media.filename &&
    (!isS3StorageEnabled() || shouldServeMediaFromPublicDir(media.filename))
  ) {
    return toLocalPublicMediaUrl(media.filename) ?? media.url ?? null;
  }

  return media.url ?? null;
}

export function resolveMedia(
  media: Media | number | string | null | undefined,
  size?: MediaSizeName,
): ResolvedMedia | null {
  if (!isPopulatedMedia(media)) return null;

  const url = resolveMediaUrl(media, size);
  if (!url) return null;

  const sized = size ? media.sizes?.[size] : undefined;

  return {
    url,
    alt: media.alt,
    title: media.title,
    mimeType: sized?.mimeType ?? media.mimeType,
    filename: sized?.filename ?? media.filename,
    filesize: sized?.filesize ?? media.filesize,
    width: sized?.width ?? media.width,
    height: sized?.height ?? media.height,
    mediaType: media.mediaType,
  };
}
