import { isLocalMediaMode } from "./mediaMode";

/** Public media resolver. Local mode deliberately rejects CMS/S3 URLs. */
export function resolvePublicMedia(
  localSrc: string | null | undefined,
  fallbackSrc?: string | null,
): string | null {
  const candidate = (localSrc?.trim() || fallbackSrc?.trim() || "");
  if (!candidate) return null;
  if (isLocalMediaMode() && /^https?:\/\//i.test(candidate)) return null;
  return candidate;
}
