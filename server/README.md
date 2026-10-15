# GOLDMINE PostgreSQL read API

This is a separately deployed, read-only Node.js API scaffold for GOLDMINE-style archive metadata. It is designed to replace a browser-to-PHP/Oracle data path with a browser-to-HTTPS-API-to-PostgreSQL path. The current GitHub Pages site remains a static mock and does **not** call this API. The API has not been connected to the live GOLDMINE Oracle database or deployed; this repository contains no production database credentials, Oracle source code, schema export, or production PostgreSQL connection.

The included PostgreSQL schema is a proposed metadata model based on the demonstration site's Search and folder Browse fields. It is not asserted to match the live Oracle schema. Map and review the source data and access rules before importing or exposing real records.

## API contract

All routes are read-only and versioned:

| Method and route | Purpose |
| --- | --- |
| `GET /api/v1/records?query=&category=&county=&sort=&page=&pageSize=` | Full-text search with optional exact category/county filters, allowlisted sort order, and bounded pagination. |
| `GET /api/v1/facets` | Distinct category and county filters. |
| `GET /api/v1/folders?parentId=root` | Direct child folders (`root` requests top-level folders). |
| `GET /api/v1/folders/{folderId}/contents` | Child folders and records for a folder (`root` requests archive root contents). |
| `GET /healthz` / `GET /readyz` | Liveness and database readiness; responses contain no connection details. |

Search returns `{ items, total, page, pageSize }`. Record rows use `id`, `title`, `category`, `county`, `year`, `type`, `size`, `sizeBytes`, `location`, and `description` to match the static demo's presentation model. Folder contents return `{ folders, records }`.

## Local setup

Requires Node.js 20+ and PostgreSQL. Create a local database and a dedicated login role, apply `migrations/001_archive_schema.sql` as a migration/admin role, and load reviewed catalogue data into the `goldmine` schema. No seed script is included: the frontend's sample records are illustrative, not an approved import of live archive content.

```powershell
cd server
npm install
Copy-Item .env.example .env
```

Edit the local `.env` with a **local-only** connection string and exact development origin. Do not commit it. Start the API with `npm start`, and run tests with `npm test`. The API listens on port 8080 by default.

Production configuration is supplied by the deployment platform's secret manager, not a committed `.env` file. Set `NODE_ENV=production`, `DATABASE_URL` (without SSL-related query parameters), `ALLOWED_ORIGINS` (comma-separated exact HTTPS origins), and optionally `PG_SSL_CA` for the database CA certificate. Production TLS certificate validation is mandatory; never disable it. Put the API behind a managed HTTPS ingress/reverse proxy and do not expose PostgreSQL to the public internet.

## Database privileges

Use a distinct runtime account, not an owner, migration account, or superuser. A DBA should create it without embedding a password in SQL history, for example with `psql`'s interactive `\password` command:

```sql
CREATE ROLE goldmine_api LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOBYPASSRLS;
GRANT CONNECT ON DATABASE goldmine TO goldmine_api;
GRANT USAGE ON SCHEMA goldmine TO goldmine_api;
GRANT SELECT ON ALL TABLES IN SCHEMA goldmine TO goldmine_api;
ALTER ROLE goldmine_api SET default_transaction_read_only = on;
ALTER ROLE goldmine_api SET statement_timeout = '5s';
```

Run future migrations as the designated migration owner and grant `SELECT` on new tables to the API role as part of that controlled deployment. Do not grant writes, schema creation, or access to unrelated schemas. If any archive items have non-public access rules, implement and test those authorization rules before making the API reachable; CORS is not authentication.

## Security controls and production work still required

- SQL values are bound parameters; sort choices are allowlisted and page/query sizes are capped. Responses expose selected metadata columns only, not SQL errors, database connection details, or stack traces.
- Exact-origin CORS, GET-only routes, bounded per-process request throttling, a bounded connection pool, database timeouts, verified TLS, and security response headers are implemented.
- The in-process limiter is only a single-instance backstop; configure shared edge/API-gateway throttling, abuse monitoring and alerting for production. This app uses the direct socket address and deliberately does not trust forwarded-IP headers. Behind a reverse proxy, configure the gateway's shared limiter using its trusted client-IP metadata.
- This scaffold is intentionally an anonymous read API for public metadata. Add authentication, authorization and row-level access checks before serving restricted catalogue entries. Never put `DATABASE_URL` or database credentials in frontend code.
- File binaries are not served by these metadata endpoints. For real document delivery, authorize each request and use a private object store or a controlled streaming service; do not expose Oracle/PostgreSQL file paths or public bucket objects.
- Add operational logging/monitoring, backups, secrets rotation, vulnerability scanning, dependency lockfile review, deployment-specific network restrictions, and load/security testing before production use.

## Oracle-to-PostgreSQL migration

This repo cannot perform the live database switch: it contains no PHP/Oracle connector, production Oracle query contract, source schema, credentials, or PostgreSQL deployment. Before replacing the existing connector, obtain the approved Oracle table/query mapping and access-control rules, transform/export the data into a staging PostgreSQL instance, compare row counts and representative Search/Browse results, verify permissions and performance, then deploy the API and update the site's frontend/API routing. Preserve a tested rollback to the existing service until the new path is approved.
