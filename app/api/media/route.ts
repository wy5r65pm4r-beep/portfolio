import { getAdminUser } from '@/lib/admin-auth';
import { listContent, mediaBucket, saveMedia } from '@/lib/content-store';

export async function GET(request: Request) {
  const contentKey = new URL(request.url).searchParams.get('key'); if (!contentKey) return new Response('Missing key', { status: 400 });
  const item = (await listContent()).find((entry) => entry.content_key === contentKey); if (!item?.media_key) return new Response('Not found', { status: 404 });
  const object = await mediaBucket().get(item.media_key); if (!object) return new Response('Not found', { status: 404 });
  return new Response(object.body, { headers: { 'Content-Type': item.content_type ?? 'application/octet-stream', 'Cache-Control': 'public, max-age=60' } });
}

export async function POST(request: Request) {
  const user = getAdminUser(request); if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const form = await request.formData(); const key = form.get('key'); const file = form.get('file');
  if (typeof key !== 'string' || !(file instanceof File)) return Response.json({ error: 'Invalid upload' }, { status: 400 });
  const kind = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : null;
  if (!kind) return Response.json({ error: 'Only image and video files are supported' }, { status: 415 });
  const mediaKey = `${key}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  await mediaBucket().put(mediaKey, file.stream(), { httpMetadata: { contentType: file.type } });
  await saveMedia(key, kind, mediaKey, file.name, file.type, user.userId);
  return Response.json({ ok: true, kind, url: `/api/media?key=${encodeURIComponent(key)}` });
}
