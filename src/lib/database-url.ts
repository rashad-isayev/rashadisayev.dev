const DATABASE_URL_ENV_KEYS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "PRISMA_DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL_NON_POOLING",
] as const;

export function getDatabaseUrl() {
  for (const key of DATABASE_URL_ENV_KEYS) {
    const value = process.env[key]?.trim();

    // Ignore scaffolded placeholder values so the next configured key can be used.
    if (value && !value.includes("replace-with")) {
      return value;
    }
  }

  return undefined;
}

export function getPgAdapterDatabaseUrl() {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(databaseUrl);
    const sslMode = parsedUrl.searchParams.get("sslmode");

    if (
      sslMode === "prefer" ||
      sslMode === "require" ||
      sslMode === "verify-ca"
    ) {
      // Prisma's pg adapter expects a strict SSL mode for providers that expose sslmode.
      parsedUrl.searchParams.set("sslmode", "verify-full");
      return parsedUrl.toString();
    }
  } catch {
    return databaseUrl;
  }

  return databaseUrl;
}

export function getDatabaseUrlEnvKeys() {
  return DATABASE_URL_ENV_KEYS;
}
