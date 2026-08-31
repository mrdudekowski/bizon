/** Static build boundary: CMS queries are intentionally unavailable. */
export const PUBLISHED_STATUS_WHERE = { status: { equals: "published" } } as const;
export async function findPublished(..._args: unknown[]): Promise<any[]> { return []; }
export async function findPublishedBySlug(..._args: unknown[]): Promise<any | null> { return null; }
export async function findPublishedSlugs(..._args: unknown[]): Promise<string[]> { return []; }
export async function withPayload<T>(..._args: unknown[]): Promise<T | null> { return null; }
