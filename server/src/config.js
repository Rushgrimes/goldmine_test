const positiveInteger = (value, fallback, name) => {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
};

export function readConfig(env = process.env) {
  if (!env.DATABASE_URL) throw new Error("DATABASE_URL is required");
  const production = env.NODE_ENV === "production";
  const databaseUrl = new URL(env.DATABASE_URL);
  if (!["postgres:", "postgresql:"].includes(databaseUrl.protocol)) {
    throw new Error("DATABASE_URL must use PostgreSQL");
  }
  const sslQueryParameters = ["sslmode", "sslrootcert", "sslcert", "sslkey"];
  if (production && sslQueryParameters.some((parameter) => databaseUrl.searchParams.has(parameter))) {
    throw new Error("Configure production PostgreSQL TLS with PG_SSL_CA; do not put SSL options in DATABASE_URL");
  }
  const allowedOrigins = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (production && allowedOrigins.length === 0) {
    throw new Error("ALLOWED_ORIGINS must be configured in production");
  }
  for (const origin of allowedOrigins) {
    const parsed = new URL(origin);
    if (parsed.origin !== origin || (production && parsed.protocol !== "https:")) {
      throw new Error("ALLOWED_ORIGINS must contain exact origins; production origins must use HTTPS");
    }
  }
  return {
    port: positiveInteger(env.PORT, 8080, "PORT"),
    databaseUrl: databaseUrl.toString(),
    allowedOrigins,
    poolMax: positiveInteger(env.PG_POOL_MAX, 10, "PG_POOL_MAX"),
    sslCa: env.PG_SSL_CA || undefined,
    production,
  };
}
