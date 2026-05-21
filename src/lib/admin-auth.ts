import "server-only";

import { createHmac, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";

import { db } from "@/lib/db";

const ADMIN_SESSION_COOKIE = "admin_session";
const LOGIN_RATE_LIMIT_SETTING_KEY = "adminLoginRateLimit";
const SESSION_TTL_SECONDS = 60 * 60 * 8;
const MIN_SECRET_LENGTH = 32;
const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 8;

type SessionPayload = {
  exp: number;
  iat: number;
  role: "admin";
};

type LoginAttemptState = Record<string, { count: number; resetAt: number }>;

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    return null;
  }

  return secret;
}

function base64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

function digestRateLimitKey(key: string, secret: string) {
  return createHmac("sha256", secret).update(key).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const first = Buffer.from(a);
  const second = Buffer.from(b);

  // timingSafeEqual prevents leaking how much of the secret matched through response timing.
  return first.length === second.length && timingSafeEqual(first, second);
}

function scryptHash(password: string, salt: Buffer, keyLength: number, options: { N: number; r: number; p: number; maxmem: number }) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, keyLength, options, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(derivedKey);
    });
  });
}

function createSessionToken(payload: SessionPayload, secret: string) {
  const encodedPayload = base64url(JSON.stringify(payload));
  // The token format is "payload.signature". The payload is readable, but tampering
  // invalidates the HMAC signature because the attacker does not know the secret.
  return `${encodedPayload}.${sign(encodedPayload, secret)}`;
}

function verifySessionToken(token: string, secret: string) {
  const [encodedPayload, signature] = token.split(".");

  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload, secret))) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;

    // A valid signature is not enough; expired tokens and unexpected roles are rejected too.
    if (payload.role !== "admin" || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getAdminPasswordHash() {
  return process.env.ADMIN_PASSWORD_HASH ?? null;
}

export function isAdminConfigured() {
  return Boolean(getAdminPasswordHash() && getSessionSecret());
}

export function createAdminPasswordHashCommand() {
  return "node -e 'const { scryptSync, randomBytes } = require(\"node:crypto\"); const password = process.argv[1]; const salt = randomBytes(16); const key = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 }); const hash = `scrypt$16384$8$1$${salt.toString(\"base64url\")}$${key.toString(\"base64url\")}`; console.log(hash.replaceAll(\"$\", \"\\\\$\"));' \"replace-with-admin-password\"";
}

export async function verifyAdminPassword(password: string) {
  const hash = getAdminPasswordHash();

  // Bounds reject obviously invalid input before doing the expensive scrypt work.
  if (!hash || password.length < 8 || password.length > 256) {
    return false;
  }

  const [algorithm, n, r, p, salt, expectedKey] = hash.split("$");

  if (algorithm !== "scrypt" || !n || !r || !p || !salt || !expectedKey) {
    return false;
  }

  // Recompute the key with the saved salt and compare it to the stored derived key.
  const key = await scryptHash(password, Buffer.from(salt, "base64url"), 64, {
    N: Number(n),
    r: Number(r),
    p: Number(p),
    maxmem: 64 * 1024 * 1024,
  });

  return safeEqual(key.toString("base64url"), expectedKey);
}

export async function getAdminSession() {
  const secret = getSessionSecret();

  if (!secret) {
    return null;
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token, secret);
}

export async function setAdminSession() {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }

  const now = Math.floor(Date.now() / 1000);
  const token = createSessionToken(
    {
      role: "admin",
      iat: now,
      exp: now + SESSION_TTL_SECONDS,
    },
    secret,
  );

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    // httpOnly keeps client-side JavaScript from reading the session cookie.
    httpOnly: true,
    maxAge: SESSION_TTL_SECONDS,
    path: "/admin",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function assertAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    throw new Error("Unauthorized");
  }
}

export async function assertSameOrigin() {
  const headerStore = await headers();
  const origin = headerStore.get("origin");
  const host = headerStore.get("host");

  if (!origin || !host) {
    throw new Error("Missing request origin.");
  }

  let originHost: string;

  try {
    originHost = new URL(origin).host;
  } catch {
    throw new Error("Invalid request origin.");
  }

  if (originHost !== host) {
    throw new Error("Invalid request origin.");
  }
}

export async function getRateLimitKey() {
  const headerStore = await headers();
  const userAgent = headerStore.get("user-agent") ?? "unknown";

  if (process.env.TRUST_PROXY_HEADERS === "true") {
    const forwardedFor = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = headerStore.get("x-real-ip")?.trim();

    return `${forwardedFor || realIp || "local"}:${userAgent}`;
  }

  return `local:${userAgent}`;
}

function parseLoginAttemptState(value: string | undefined) {
  if (!value) {
    return {};
  }

  try {
    const parsed = JSON.parse(value) as LoginAttemptState;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function getLoginAttemptState() {
  const setting = await db.siteSetting.findUnique({
    where: { key: LOGIN_RATE_LIMIT_SETTING_KEY },
  });

  return parseLoginAttemptState(setting?.value);
}

async function setLoginAttemptState(state: LoginAttemptState) {
  await db.siteSetting.upsert({
    where: { key: LOGIN_RATE_LIMIT_SETTING_KEY },
    create: {
      key: LOGIN_RATE_LIMIT_SETTING_KEY,
      value: JSON.stringify(state),
    },
    update: {
      value: JSON.stringify(state),
    },
  });
}

export async function isLoginRateLimited(key: string) {
  const secret = getSessionSecret();

  if (!secret) {
    return true;
  }

  const now = Date.now();
  const digest = digestRateLimitKey(key, secret);

  try {
    const state = await getLoginAttemptState();

    for (const [stateKey, attempt] of Object.entries(state)) {
      if (attempt.resetAt <= now) {
        delete state[stateKey];
      }
    }

    const current = state[digest];

    if (!current) {
      state[digest] = { count: 1, resetAt: now + LOGIN_RATE_LIMIT_WINDOW_MS };
      await setLoginAttemptState(state);
      return false;
    }

    current.count += 1;
    state[digest] = current;
    await setLoginAttemptState(state);

    return current.count > MAX_LOGIN_ATTEMPTS;
  } catch {
    return true;
  }
}

export async function resetLoginRateLimit(key: string) {
  const secret = getSessionSecret();

  if (!secret) {
    return;
  }

  try {
    const state = await getLoginAttemptState();
    delete state[digestRateLimitKey(key, secret)];
    await setLoginAttemptState(state);
  } catch {
    return;
  }
}

export function createSessionSecret() {
  return randomBytes(32).toString("base64url");
}
