import "dotenv/config";
import pg from "pg";
import { readConfig } from "./config.js";
import { createApiServer } from "./app.js";

const config = readConfig();
const pool = new pg.Pool({
  connectionString: config.databaseUrl,
  max: config.poolMax,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 5_000,
  query_timeout: 7_000,
  application_name: "goldmine-read-api",
  ssl: config.production
    ? { rejectUnauthorized: true, ...(config.sslCa ? { ca: config.sslCa } : {}) }
    : undefined,
});

pool.on("error", () => {
  process.stderr.write("PostgreSQL pool emitted an idle client error.\n");
});

const server = createApiServer({ pool, allowedOrigins: config.allowedOrigins });
server.listen(config.port, "0.0.0.0", () => {
  process.stdout.write(`GOLDMINE PostgreSQL API listening on port ${config.port}\n`);
});

async function shutdown() {
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
