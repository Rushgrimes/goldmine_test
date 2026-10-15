CREATE SCHEMA IF NOT EXISTS goldmine;

CREATE TABLE IF NOT EXISTS goldmine.archive_record (
  record_id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  county text,
  record_year smallint CHECK (record_year BETWEEN 1000 AND 9999),
  mime_type text NOT NULL,
  size_bytes bigint CHECK (size_bytes IS NULL OR size_bytes >= 0),
  location text,
  description text NOT NULL DEFAULT '',
  keywords text NOT NULL DEFAULT '',
  search_document tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(record_id, '')), 'A')
    || setweight(to_tsvector('simple', coalesce(category, '')), 'B')
    || setweight(to_tsvector('simple', coalesce(county, '') || ' ' || coalesce(location, '')), 'B')
    || setweight(to_tsvector('simple', coalesce(description, '') || ' ' || coalesce(keywords, '')), 'C')
  ) STORED
);

CREATE TABLE IF NOT EXISTS goldmine.archive_folder (
  folder_id text PRIMARY KEY,
  parent_folder_id text REFERENCES goldmine.archive_folder(folder_id) ON DELETE CASCADE,
  name text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  CHECK (folder_id ~ '^[A-Za-z0-9_-]{1,100}$')
);

CREATE INDEX IF NOT EXISTS archive_folder_parent_sort
  ON goldmine.archive_folder(parent_folder_id, sort_order, name);

CREATE TABLE IF NOT EXISTS goldmine.archive_folder_record (
  folder_id text NOT NULL REFERENCES goldmine.archive_folder(folder_id) ON DELETE CASCADE,
  record_id text NOT NULL REFERENCES goldmine.archive_record(record_id) ON DELETE CASCADE,
  PRIMARY KEY (folder_id, record_id)
);

CREATE INDEX IF NOT EXISTS archive_folder_record_record
  ON goldmine.archive_folder_record(record_id);

CREATE INDEX IF NOT EXISTS archive_record_search_document
  ON goldmine.archive_record USING gin(search_document);

CREATE INDEX IF NOT EXISTS archive_record_category_county
  ON goldmine.archive_record(category, county);

REVOKE ALL ON SCHEMA goldmine FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA goldmine FROM PUBLIC;
