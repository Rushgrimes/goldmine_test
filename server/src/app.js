import { createServer } from "node:http";
import { InputError, parseSearchParams, searchRecords, serializeRecord } from "./queries.js";

const jsonHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "no-referrer",
};

function sendJson(response, status, body, extraHeaders = {}) {
  response.writeHead(status, { ...jsonHeaders, ...extraHeaders });
  response.end(JSON.stringify(body));
}

function createRateLimiter({ limit = 120, windowMs = 60_000, now = Date.now } = {}) {
  const requests = new Map();
  return (key) => {
    const current = now();
    const entry = requests.get(key);
    if (!entry || current - entry.start >= windowMs) {
      if (!entry && requests.size >= 10_000) {
        for (const [candidate, value] of requests) {
          if (current - value.start >= windowMs) requests.delete(candidate);
        }
        if (requests.size >= 10_000) return false;
      }
      requests.set(key, { start: current, count: 1 });
      return true;
    }
    entry.count += 1;
    return entry.count <= limit;
  };
}

export function createHandler({ pool, allowedOrigins = [], rateLimiter = createRateLimiter(), logger = console }) {
  if (!pool || typeof pool.query !== "function") throw new TypeError("A PostgreSQL-compatible pool is required");
  const allowed = new Set(allowedOrigins);

  return async (request, response) => {
    const origin = request.headers.origin;
    if (origin && !allowed.has(origin)) {
      sendJson(response, 403, { error: "origin_not_allowed" });
      return;
    }
    const corsHeaders = origin ? {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
    } : {};
    if (request.method === "OPTIONS") {
      response.writeHead(204, {
        ...jsonHeaders,
        ...corsHeaders,
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Accept, Content-Type",
        "Access-Control-Max-Age": "600",
      });
      response.end();
      return;
    }
    if (!rateLimiter(request.socket.remoteAddress || "unknown")) {
      sendJson(response, 429, { error: "rate_limit_exceeded" }, {
        ...corsHeaders,
        "Retry-After": "60",
      });
      return;
    }
    if (request.method !== "GET") {
      sendJson(response, 405, { error: "method_not_allowed" }, { ...corsHeaders, Allow: "GET, OPTIONS" });
      return;
    }

    let url;
    try {
      url = new URL(request.url, "http://localhost");
      if (url.pathname === "/healthz") {
        sendJson(response, 200, { status: "ok" }, corsHeaders);
        return;
      }
      if (url.pathname === "/readyz") {
        await pool.query("SELECT 1");
        sendJson(response, 200, { status: "ready" }, corsHeaders);
        return;
      }
      if (url.pathname === "/api/v1/records") {
        const options = parseSearchParams(url.searchParams);
        const result = await searchRecords(pool, options);
        sendJson(response, 200, result, corsHeaders);
        return;
      }
      if (url.pathname === "/api/v1/facets") {
        const [categories, counties] = await Promise.all([
          pool.query("SELECT DISTINCT category AS value FROM goldmine.archive_record ORDER BY category LIMIT 500"),
          pool.query("SELECT DISTINCT county AS value FROM goldmine.archive_record WHERE county IS NOT NULL ORDER BY county LIMIT 500"),
        ]);
        sendJson(response, 200, {
          categories: categories.rows.map((row) => row.value),
          counties: counties.rows.map((row) => row.value),
        }, corsHeaders);
        return;
      }
      if (url.pathname === "/api/v1/folders") {
        const parentId = url.searchParams.get("parentId") || "root";
        const parent = parentId === "root" ? null : parentId;
        if (parent !== null && !/^[A-Za-z0-9_-]{1,100}$/.test(parent)) {
          sendJson(response, 400, { error: "invalid_folder_id" }, corsHeaders);
          return;
        }
        if (parent !== null) {
          const exists = await pool.query(
            "SELECT 1 FROM goldmine.archive_folder WHERE folder_id = $1",
            [parent],
          );
          if (!exists.rowCount) {
            sendJson(response, 404, { error: "folder_not_found" }, corsHeaders);
            return;
          }
        }
        const folders = await pool.query(
          `SELECT f.folder_id AS id, f.name, f.parent_folder_id AS "parentId",
                  (SELECT count(*)::int FROM goldmine.archive_folder child WHERE child.parent_folder_id = f.folder_id)
                  + (SELECT count(*)::int FROM goldmine.archive_folder_record fr WHERE fr.folder_id = f.folder_id) AS "itemCount"
             FROM goldmine.archive_folder f
            WHERE f.parent_folder_id IS NOT DISTINCT FROM $1
            ORDER BY f.sort_order, f.name
            LIMIT 500`,
          [parent],
        );
        sendJson(response, 200, { items: folders.rows }, corsHeaders);
        return;
      }
      const folderMatch = url.pathname.match(/^\/api\/v1\/folders\/([A-Za-z0-9_-]{1,100})\/contents$/);
      if (folderMatch) {
        const folderId = folderMatch[1];
        const parent = folderId === "root" ? null : folderId;
        if (parent !== null) {
          const exists = await pool.query(
            "SELECT 1 FROM goldmine.archive_folder WHERE folder_id = $1",
            [parent],
          );
          if (!exists.rowCount) {
            sendJson(response, 404, { error: "folder_not_found" }, corsHeaders);
            return;
          }
        }
        const [folders, records] = await Promise.all([
          pool.query(
            `SELECT f.folder_id AS id, f.name, f.parent_folder_id AS "parentId"
               FROM goldmine.archive_folder f
              WHERE f.parent_folder_id IS NOT DISTINCT FROM $1
              ORDER BY f.sort_order, f.name
              LIMIT 500`,
            [parent],
          ),
          pool.query(
            `SELECT r.record_id AS id, r.title, r.category, r.county,
                    r.record_year AS year, r.mime_type AS type, r.size_bytes AS "sizeBytes",
                    r.location, r.description
               FROM goldmine.archive_folder_record fr
               JOIN goldmine.archive_record r ON r.record_id = fr.record_id
              WHERE fr.folder_id IS NOT DISTINCT FROM $1
              ORDER BY r.title, r.record_id
              LIMIT 500`,
            [parent],
          ),
        ]);
        sendJson(response, 200, {
          folders: folders.rows,
          records: records.rows.map(serializeRecord),
        }, corsHeaders);
        return;
      }
      sendJson(response, 404, { error: "not_found" }, corsHeaders);
    } catch (error) {
      if (error instanceof InputError) {
        sendJson(response, 400, { error: "invalid_request", message: error.message }, corsHeaders);
        return;
      }
      logger.error("PostgreSQL API request failed", error?.name || "UnknownError");
      sendJson(response, 503, { error: "service_unavailable" }, corsHeaders);
    }
  };
}

export function createApiServer(options) {
  return createServer(createHandler(options));
}
