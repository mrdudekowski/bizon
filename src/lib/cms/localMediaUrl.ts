/**
 * Local Payload uploads land in public/media and are served by Next at /media/*.
 * S3 plugin fields can still stamp prefix=bizon/media onto docs, which breaks
 * /api/media/file/... lookups. Prefer the static public path when the file is
 * present locally (or when S3 is disabled).
 */
import fs from "node:fs";
import path from "node:path";

export function toLocalPublicMediaUrl(filename: string | null | undefined): string | null {
  const name = filename?.trim();
  if (!name) return null;
  return `/media/${name.replace(/^\/+/, "")}`;
}

export function localMediaFileExists(filename: string | null | undefined): boolean {
  const name = filename?.trim();
  if (!name) return false;
  return fs.existsSync(path.join(process.cwd(), "public", "media", name));
}

/** Use /media/* when S3 is off, or when the object was seeded into public/media. */
export function shouldServeMediaFromPublicDir(filename: string | null | undefined): boolean {
  return localMediaFileExists(filename);
}

type SizeLike = {
  filename?: string | null;
  url?: string | null;
} | null;

type MediaDocLike = {
  filename?: string | null;
  url?: string | null;
  prefix?: string | null;
  sizes?: Record<string, SizeLike> | null;
};

export function rewriteMediaDocUrlsForLocalStorage<T extends MediaDocLike>(doc: T): T {
  const next = { ...doc };
  const main = toLocalPublicMediaUrl(doc.filename);
  if (main) next.url = main;
  next.prefix = null;

  if (doc.sizes && typeof doc.sizes === "object") {
    const sizes: Record<string, SizeLike> = {};
    for (const [key, size] of Object.entries(doc.sizes)) {
      if (!size || typeof size !== "object") {
        sizes[key] = size;
        continue;
      }
      const local = toLocalPublicMediaUrl(size.filename);
      sizes[key] = local ? { ...size, url: local } : { ...size };
    }
    next.sizes = sizes;
  }

  return next;
}
