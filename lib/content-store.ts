import { env } from 'cloudflare:workers';
import { createContentTable, createKindIndex } from '@/db/schema';

export type ContentRecord = { content_key: string; kind: 'text' | 'image' | 'video'; text_value: string | null; media_key: string | null; filename: string | null; content_type: string | null; updated_at: string };

function db() { return env.DB as D1Database; }
export function mediaBucket() { return env.MEDIA as R2Bucket; }

export async function ensureContentSchema() {
  const database = db();
  await database.batch([database.prepare(createContentTable), database.prepare(createKindIndex)]);
}

export async function listContent() {
  await ensureContentSchema();
  const result = await db().prepare('SELECT content_key, kind, text_value, media_key, filename, content_type, updated_at FROM content_items ORDER BY content_key').all<ContentRecord>();
  return result.results;
}

export async function saveText(contentKey: string, value: string, userId: string) {
  await ensureContentSchema();
  await db().prepare(`INSERT INTO content_items (content_key, kind, text_value, updated_at, updated_by) VALUES (?, 'text', ?, CURRENT_TIMESTAMP, ?) ON CONFLICT(content_key) DO UPDATE SET kind='text', text_value=excluded.text_value, media_key=NULL, filename=NULL, content_type=NULL, updated_at=CURRENT_TIMESTAMP, updated_by=excluded.updated_by`).bind(contentKey, value, userId).run();
}

export async function saveMedia(contentKey: string, kind: 'image' | 'video', mediaKey: string, filename: string, contentType: string, userId: string) {
  await ensureContentSchema();
  await db().prepare(`INSERT INTO content_items (content_key, kind, media_key, filename, content_type, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, ?) ON CONFLICT(content_key) DO UPDATE SET kind=excluded.kind, text_value=NULL, media_key=excluded.media_key, filename=excluded.filename, content_type=excluded.content_type, updated_at=CURRENT_TIMESTAMP, updated_by=excluded.updated_by`).bind(contentKey, kind, mediaKey, filename, contentType, userId).run();
}

export async function deleteContent(contentKey: string) {
  await ensureContentSchema();
  const existing = await db().prepare('SELECT media_key FROM content_items WHERE content_key = ?').bind(contentKey).first<{media_key: string | null}>();
  if (existing?.media_key) await mediaBucket().delete(existing.media_key);
  await db().prepare('DELETE FROM content_items WHERE content_key = ?').bind(contentKey).run();
}
