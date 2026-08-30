export function getAdminUser(request: Request) {
  const userId = request.headers.get('oai-authenticated-user-id');
  const email = request.headers.get('oai-authenticated-user-email');
  if (userId) return { userId, email: email ?? 'Signed-in user' };
  if (process.env.NODE_ENV !== 'production') return { userId: 'local-admin', email: 'local@preview.test' };
  return null;
}
