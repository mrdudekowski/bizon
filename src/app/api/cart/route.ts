import { randomBytes } from "node:crypto";

import { NextRequest, NextResponse } from "next/server";

import { getPayload } from "@/lib/payload/getPayload";
import {
  CART_SESSION_COOKIE_NAME,
  CART_SESSION_MAX_AGE_SECONDS,
  hashCartSessionToken,
  sanitizeServerCartItems,
} from "@/lib/cart/serverCart";

function expiresAt(): string {
  return new Date(Date.now() + CART_SESSION_MAX_AGE_SECONDS * 1000).toISOString();
}

function cookieOptions(request: NextRequest) {
  const hostname = request.nextUrl.hostname;
  const production = hostname === "bizon.ru" || hostname.endsWith(".bizon.ru");

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: request.nextUrl.protocol === "https:",
    path: "/",
    maxAge: CART_SESSION_MAX_AGE_SECONDS,
    ...(production ? { domain: ".bizon.ru" } : {}),
  };
}

function mutationOriginAllowed(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const originHost = new URL(origin).hostname;
    const requestHost = request.nextUrl.hostname;
    if (originHost === requestHost) return true;
    return (
      (originHost === "bizon.ru" || originHost.endsWith(".bizon.ru")) &&
      (requestHost === "bizon.ru" || requestHost.endsWith(".bizon.ru"))
    );
  } catch {
    return false;
  }
}

async function findSession(token: string) {
  const payload = await getPayload();
  const result = await payload.find({
    collection: "cart-sessions",
    where: { tokenHash: { equals: hashCartSessionToken(token) } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return { payload, session: result.docs[0] };
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get(CART_SESSION_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ ok: true, hasSession: false, items: [] });

  const { payload, session } = await findSession(token);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    if (session) {
      await payload.delete({
        collection: "cart-sessions",
        id: session.id,
        overrideAccess: true,
      });
    }
    const response = NextResponse.json({ ok: true, hasSession: false, items: [] });
    response.cookies.set(CART_SESSION_COOKIE_NAME, "", {
      ...cookieOptions(request),
      maxAge: 0,
    });
    return response;
  }

  return NextResponse.json({
    ok: true,
    hasSession: true,
    items: sanitizeServerCartItems(session.items),
  });
}

export async function PUT(request: NextRequest) {
  if (!mutationOriginAllowed(request)) {
    return NextResponse.json({ ok: false, message: "Origin not allowed" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const items = sanitizeServerCartItems(
    body && typeof body === "object" && "items" in body ? body.items : null,
  );
  const currentToken = request.cookies.get(CART_SESSION_COOKIE_NAME)?.value;
  const token = currentToken ?? randomBytes(32).toString("hex");
  const { payload, session } = await findSession(token);

  if (session) {
    await payload.update({
      collection: "cart-sessions",
      id: session.id,
      data: { items, expiresAt: expiresAt() },
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "cart-sessions",
      data: {
        tokenHash: hashCartSessionToken(token),
        items,
        expiresAt: expiresAt(),
      },
      overrideAccess: true,
    });
  }

  const response = NextResponse.json({ ok: true, hasSession: true, items });
  response.cookies.set(CART_SESSION_COOKIE_NAME, token, cookieOptions(request));
  return response;
}

export async function DELETE(request: NextRequest) {
  if (!mutationOriginAllowed(request)) {
    return NextResponse.json({ ok: false, message: "Origin not allowed" }, { status: 403 });
  }

  const token = request.cookies.get(CART_SESSION_COOKIE_NAME)?.value;
  if (token) {
    const { payload, session } = await findSession(token);
    if (session) {
      await payload.delete({
        collection: "cart-sessions",
        id: session.id,
        overrideAccess: true,
      });
    }
  }

  const response = NextResponse.json({ ok: true, hasSession: false, items: [] });
  response.cookies.set(CART_SESSION_COOKIE_NAME, "", {
    ...cookieOptions(request),
    maxAge: 0,
  });
  return response;
}
