export type DatabaseLink =
  | { state: "unconfigured" }
  | { state: "unavailable" }
  | { state: "connected"; schemaVersion: string; database: string };

export type PublishedTireDirection = {
  id: string;
  slug: string;
  name: string;
};

type FetchLike = (input: string, init?: { cache?: "no-store"; signal?: AbortSignal }) => Promise<{
  ok: boolean;
  json: () => Promise<unknown>;
}>;

export function databaseLinkLabel(link: DatabaseLink): string {
  if (link.state === "connected") return `База подключена · ${link.schemaVersion}`;
  if (link.state === "unconfigured") return "База не настроена";
  return "База недоступна";
}

export function parseDatabaseHealth(body: unknown): DatabaseLink | null {
  if (!body || typeof body !== "object") return null;
  const health = body as { ok?: unknown; schemaVersion?: unknown; database?: unknown };
  if (health.ok !== true || typeof health.schemaVersion !== "string" || health.database !== "bizon") {
    return null;
  }
  return { state: "connected", schemaVersion: health.schemaVersion, database: health.database };
}

export function parsePublishedTireDirections(body: unknown): PublishedTireDirection[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { items?: unknown }).items)) {
    return null;
  }
  const items = (body as { items: unknown[] }).items.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const row = item as { id?: unknown; slug?: unknown; name?: unknown };
    if (typeof row.id !== "string" || typeof row.slug !== "string" || typeof row.name !== "string") {
      return [];
    }
    return [{ id: row.id, slug: row.slug, name: row.name }];
  });
  return items;
}

export async function readDatabaseLink(
  backendUrl: string | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<DatabaseLink> {
  if (!backendUrl) return { state: "unconfigured" };
  try {
    const response = await fetchImpl(`${backendUrl.replace(/\/$/, "")}/health`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return { state: "unavailable" };
    return parseDatabaseHealth(await response.json()) ?? { state: "unavailable" };
  } catch {
    return { state: "unavailable" };
  }
}

export async function readPublishedTireDirections(
  backendUrl: string | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<PublishedTireDirection[] | null> {
  if (!backendUrl) return null;
  try {
    const response = await fetchImpl(`${backendUrl.replace(/\/$/, "")}/v1/published/tire-directions`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) return null;
    return parsePublishedTireDirections(await response.json());
  } catch {
    return null;
  }
}
