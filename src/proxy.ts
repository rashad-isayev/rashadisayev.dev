import { NextRequest, NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "admin_session";
const MIN_SECRET_LENGTH = 32;

type SessionPayload = {
  exp: number;
  role: "admin";
};

function isAdminConfigured() {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  return Boolean(
    passwordHash && sessionSecret && sessionSecret.length >= MIN_SECRET_LENGTH,
  );
}

function base64urlToBytes(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const binary = atob(padded);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function importHmacKey(secret: string) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["verify"],
  );
}

async function verifySignature(value: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await importHmacKey(secret);

  try {
    return await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlToBytes(signature),
      encoder.encode(value),
    );
  } catch {
    return false;
  }
}

async function verifySessionToken(token: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    return false;
  }

  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature) {
    return false;
  }

  if (!(await verifySignature(encodedPayload, signature, secret))) {
    return false;
  }

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(base64urlToBytes(encodedPayload)),
    ) as SessionPayload;

    return (
      payload.role === "admin" &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

function redirectTo(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isSignInPage = pathname === "/admin/sign-in";
  const configured = isAdminConfigured();
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const hasValidSession = token ? await verifySessionToken(token) : false;

  if (isSignInPage) {
    return configured && hasValidSession
      ? redirectTo(request, "/admin/blog")
      : NextResponse.next();
  }

  if (!configured || !hasValidSession) {
    return redirectTo(request, "/admin/sign-in");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
