const sortExpressions = Object.freeze({
  relevance: "r.record_year DESC NULLS LAST, r.record_id ASC",
  title: "r.title ASC, r.record_id ASC",
  "year-desc": "r.record_year DESC NULLS LAST, r.record_id ASC",
  "year-asc": "r.record_year ASC NULLS LAST, r.record_id ASC",
});

const recordColumns = `
  r.record_id AS id,
  r.title,
  r.category,
  r.county,
  r.record_year AS year,
  r.mime_type AS type,
  r.size_bytes AS "sizeBytes",
  r.location,
  r.description
`;

export class InputError extends Error {}

export function parseSearchParams(searchParams) {
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const county = searchParams.get("county") || "";
  const sort = searchParams.get("sort") || "relevance";
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 10);

  if (query.length > 200 || /[\u0000-\u001f\u007f]/.test(query)) {
    throw new InputError("query must be at most 200 printable characters");
  }
  if (category.length > 120 || county.length > 120) {
    throw new InputError("category and county must be at most 120 characters");
  }
  if (!Number.isSafeInteger(page) || page < 1 || page > 10000) {
    throw new InputError("page must be an integer from 1 to 10000");
  }
  if (!Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new InputError("pageSize must be an integer from 1 to 100");
  }
  if (!Object.hasOwn(sortExpressions, sort)) {
    throw new InputError("sort is not supported");
  }

  return { query: query.trim(), category, county, sort, page, pageSize };
}

export function buildRecordFilters({ query, category, county }) {
  const clauses = [];
  const values = [];
  if (query) {
    values.push(query);
    const queryParameter = `$${values.length}`;
    clauses.push(`(r.search_document @@ websearch_to_tsquery('simple', ${queryParameter}) OR r.record_id = ${queryParameter})`);
  }
  if (category) {
    values.push(category);
    clauses.push(`r.category = $${values.length}`);
  }
  if (county) {
    values.push(county);
    clauses.push(`r.county = $${values.length}`);
  }
  return {
    where: clauses.length ? `WHERE ${clauses.join(" AND ")}` : "",
    values,
  };
}

export async function searchRecords(pool, options) {
  const { where, values } = buildRecordFilters(options);
  const countResult = await pool.query(
    `SELECT count(*)::int AS total FROM goldmine.archive_record r ${where}`,
    values,
  );
  const offset = (options.page - 1) * options.pageSize;
  const pageValues = [...values, options.pageSize, offset];
  const orderBy = options.sort === "relevance" && options.query
    ? "ts_rank(r.search_document, websearch_to_tsquery('simple', $1)) DESC, r.record_year DESC NULLS LAST, r.record_id ASC"
    : sortExpressions[options.sort];
  const result = await pool.query(
    `SELECT ${recordColumns}
       FROM goldmine.archive_record r
       ${where}
       ORDER BY ${orderBy}
       LIMIT $${pageValues.length - 1} OFFSET $${pageValues.length}`,
    pageValues,
  );
  return {
    items: result.rows.map(serializeRecord),
    total: countResult.rows[0].total,
    page: options.page,
    pageSize: options.pageSize,
  };
}

export function serializeRecord(record) {
  const parsedSize = record.sizeBytes === null || record.sizeBytes === undefined
    ? null
    : Number(record.sizeBytes);
  const sizeBytes = Number.isSafeInteger(parsedSize) && parsedSize >= 0 ? parsedSize : null;
  const type = ({
    "application/pdf": "PDF",
    "image/tiff": "TIFF",
    "image/tif": "TIFF",
  })[record.type?.toLowerCase()] || record.type;
  return {
    ...record,
    type,
    size: sizeBytes === null ? "Unknown size" : formatSize(sizeBytes),
    sizeBytes,
  };
}

function formatSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "Unknown size";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(1)} ${units[unit]}`;
}
