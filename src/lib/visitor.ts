import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const VISITOR_COOKIE = "visitor_key";
const VISITOR_TTL_SECONDS = 60 * 60 * 24 * 365;
const UUID_V4_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidVisitorKey(value: string | undefined): value is string {
  return Boolean(value && UUID_V4_PATTERN.test(value));
}

export async function getOrCreateVisitorKey() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VISITOR_COOKIE)?.value;

  if (isValidVisitorKey(existing)) {
    return existing;
  }

  // The UUID is anonymous, but stable enough to de-duplicate stars and views per browser.
  const visitorKey = randomUUID();

  cookieStore.set(VISITOR_COOKIE, visitorKey, {
    httpOnly: true,
    maxAge: VISITOR_TTL_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return visitorKey;
}
