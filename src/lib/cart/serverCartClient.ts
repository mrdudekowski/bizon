import type { RequestItemInput } from "@/types/requestItem";

export type ServerCartSnapshot = {
  hasSession: boolean;
  items: RequestItemInput[];
};

let syncQueue = Promise.resolve();

export async function readServerCart(): Promise<ServerCartSnapshot | null> {
  try {
    const response = await fetch("/api/cart", {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) return null;
    const data = await response.json() as {
      hasSession?: boolean;
      items?: RequestItemInput[];
    };
    return {
      hasSession: data.hasSession === true,
      items: Array.isArray(data.items) ? data.items : [],
    };
  } catch {
    return null;
  }
}

async function sendCart(items: RequestItemInput[]): Promise<void> {
  await fetch("/api/cart", {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ items }),
    keepalive: true,
  });
}

export function syncCartToServer(items: RequestItemInput[]): Promise<void> {
  syncQueue = syncQueue
    .catch(() => undefined)
    .then(() => sendCart(items))
    .catch(() => undefined);
  return syncQueue;
}
