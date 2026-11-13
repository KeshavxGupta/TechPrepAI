// Pure URL selection shared by the two preserved authentication entry URLs.
export function authRedirect(mode, savedSession, search = '') {
  let user;
  try {
    user = JSON.parse(savedSession || 'null');
  } catch {
    user = null;
  }
  if (user) {
    const admin = user.role === 'admin' || user.email === 'khushboo2006june@admin.com';
    return admin ? '/pages/admin/admin-hub.html' : '/pages/user/dashboard.html';
  }
  const params = new URLSearchParams({ modal: mode === 'signup' ? 'signup' : 'login' });
  if (mode !== 'signup') {
    const incoming = new URLSearchParams(search);
    for (const key of ['email', 'registered'])
      if (incoming.get(key)) params.set(key, incoming.get(key));
  }
  return `/index.html?${params}`;
}
