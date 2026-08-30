import { deleteContent, listContent, saveText } from '@/lib/content-store';
import { getAdminUser } from '@/lib/admin-auth';

export async function GET() { return Response.json({ items: await listContent() }); }

export async function POST(request: Request) {
  const user = getAdminUser(request); if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json() as { key?: string; value?: string };
  if (!body.key || typeof body.value !== 'string') return Response.json({ error: 'Invalid content' }, { status: 400 });
  await saveText(body.key, body.value, user.userId); return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const user = getAdminUser(request); if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const key = new URL(request.url).searchParams.get('key'); if (!key) return Response.json({ error: 'Missing key' }, { status: 400 });
  await deleteContent(key); return Response.json({ ok: true });
}
