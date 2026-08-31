/** Static build boundary: CMS queries are intentionally unavailable. */
export const PUBLISHED_STATUS_WHERE = { status: { equals: "published" } } as const;
export async function findPublished(): Promise<never[]> { return []; }
export async function findPublishedBySlug(): Promise<null> { return null; }
export async function findPublishedSlugs(): Promise<string[]> { return []; }
export async function withPayload<T>(): Promise<T | null> { return null; }
