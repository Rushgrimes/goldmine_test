import assert from "node:assert/strict";
import { once } from "node:events";
import { after, before, test } from "node:test";
import { createApiServer } from "../src/app.js";
import { readConfig } from "../src/config.js";
import { buildRecordFilters, parseSearchParams } from "../src/queries.js";

let server;
let baseUrl;
const queries = [];
const pool = {
  async query(text, values = []) {
    queries.push({ text, values });
    if (text.includes("count(*)")) return { rows: [{ total: 1 }] };
    if (text.includes("archive_folder_record")) return { rows: [], rowCount: 0 };
    if (text.includes("archive_record")) {
      return {
        rows: [{
          id: "PL 3045",
          title: "Mineral exploration in Navan",
          category: "Open Files",
          county: "Meath",
          year: 1998,
          type: "application/pdf",
          sizeBytes: "1048576",
          location: "Navan",
          description: "Sample",
        }],
      };
    }
    if (text.includes("SELECT 1")) return { rows: [{ "?column?": 1 }], rowCount: 1 };
    return { rows: [], rowCount: 0 };
  },
};

before(async () => {
  server = createApiServer({ pool, allowedOrigins: ["https://archive.example.test"] });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  server.close();
  await once(server, "close");
});

test("parses bounded search options and rejects unsupported sorting", () => {
  const parsed = parseSearchParams(new URLSearchParams("query=bedrock&page=2&pageSize=20&sort=year-asc"));
  assert.deepEqual(parsed, {
    query: "bedrock",
    category: "",
    county: "",
    sort: "year-asc",
    page: 2,
    pageSize: 20,
  });
  assert.throws(
    () => parseSearchParams(new URLSearchParams("sort=title%3Bdrop%20table")),
    /sort is not supported/,
  );
  assert.throws(
    () => parseSearchParams(new URLSearchParams("pageSize=1000")),
    /pageSize/,
  );
});

test("requires exact HTTPS origins and verified database TLS in production", () => {
  assert.throws(
    () => readConfig({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://api:secret@db.example.test/goldmine?sslmode=disable",
      ALLOWED_ORIGINS: "https://archive.example.test",
    }),
    /SSL options in DATABASE_URL/,
  );
  assert.throws(
    () => readConfig({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://api:secret@db.example.test/goldmine",
      ALLOWED_ORIGINS: "http://archive.example.test",
    }),
    /production origins must use HTTPS/,
  );
  const config = readConfig({
    NODE_ENV: "production",
    DATABASE_URL: "postgresql://api:secret@db.example.test/goldmine",
    ALLOWED_ORIGINS: "https://archive.example.test",
  });
  assert.equal(config.production, true);
});

test("binds user search filters as SQL parameters", () => {
  const input = {
    query: "'; DROP TABLE goldmine.archive_record; --",
    category: "Open Files",
    county: "Meath",
  };
  const result = buildRecordFilters(input);
  assert.equal(result.values[0], input.query);
  assert.equal(result.values[1], input.category);
  assert.equal(result.values[2], input.county);
  assert.doesNotMatch(result.where, /DROP TABLE/);
});

test("serves bounded, parameterized record searches with safe response headers", async () => {
  queries.length = 0;
  const response = await fetch(`${baseUrl}/api/v1/records?query=Navan&category=Open%20Files&pageSize=5`, {
    headers: { Origin: "https://archive.example.test" },
  });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("access-control-allow-origin"), "https://archive.example.test");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  const body = await response.json();
  assert.equal(body.total, 1);
  assert.equal(body.items[0].size, "1.0 MB");
  assert.equal(body.items[0].type, "PDF");
  assert.ok(queries.some(({ values }) => values.includes("Navan")));
});

test("rejects unapproved browser origins and non-read methods", async () => {
  const forbidden = await fetch(`${baseUrl}/api/v1/records`, {
    headers: { Origin: "https://unapproved.example.test" },
  });
  assert.equal(forbidden.status, 403);
  const method = await fetch(`${baseUrl}/api/v1/records`, { method: "POST" });
  assert.equal(method.status, 405);
});

test("serves only direct children for root Browse requests", async () => {
  const response = await fetch(`${baseUrl}/api/v1/folders/root/contents`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { folders: [], records: [] });
});
