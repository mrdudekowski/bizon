export type MediaSourceMode = "local" | "s3";

export function getMediaSourceMode(): MediaSourceMode {
  return process.env.MEDIA_SOURCE === "s3" ? "s3" : "local";
}

export function isLocalMediaMode(): boolean {
  return getMediaSourceMode() === "local";
}
