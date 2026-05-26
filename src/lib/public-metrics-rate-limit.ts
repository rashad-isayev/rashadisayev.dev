import "server-only";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_BUCKETS = 1000;

const ACTION_LIMITS = {
  star: 60,
  view: 240,
} as const;

type PublicMetricAction = keyof typeof ACTION_LIMITS;
type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const globalForPublicMetricRateLimit = globalThis as unknown as {
  publicMetricRateLimit?: Map<string, RateLimitBucket>;
};

const buckets =
  globalForPublicMetricRateLimit.publicMetricRateLimit ?? new Map<string, RateLimitBucket>();

globalForPublicMetricRateLimit.publicMetricRateLimit = buckets;

function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return true;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function getPublicMetricClientKey(request: Request, action: PublicMetricAction) {
  const userAgent = request.headers.get("user-agent") ?? "unknown";

  if (process.env.TRUST_PROXY_HEADERS === "true") {
    const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const realIp = request.headers.get("x-real-ip")?.trim();

    return `${action}:${forwardedFor || realIp || "local"}:${userAgent}`;
  }

  return `${action}:local:${userAgent}`;
}

function pruneExpiredBuckets(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }

  if (buckets.size <= MAX_BUCKETS) {
    return;
  }

  const keysToDelete = buckets.size - MAX_BUCKETS;
  let deleted = 0;

  for (const key of buckets.keys()) {
    buckets.delete(key);
    deleted += 1;

    if (deleted >= keysToDelete) {
      break;
    }
  }
}

export function isPublicMetricRequestAllowed(
  request: Request,
  action: PublicMetricAction,
) {
  if (!hasSameOrigin(request)) {
    return false;
  }

  const now = Date.now();
  const key = getPublicMetricClientKey(request, action);
  const current = buckets.get(key);

  pruneExpiredBuckets(now);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return true;
  }

  if (current.count >= ACTION_LIMITS[action]) {
    return false;
  }

  current.count += 1;
  return true;
}
