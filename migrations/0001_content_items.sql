CREATE TABLE IF NOT EXISTS content_items (
  content_key TEXT PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('text', 'image', 'video')),
  text_value TEXT,
  media_key TEXT,
  filename TEXT,
  content_type TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT
);

CREATE INDEX IF NOT EXISTS idx_content_items_kind ON content_items(kind);
