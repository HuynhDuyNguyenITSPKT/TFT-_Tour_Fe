export function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    return JSON.parse(payload);
  } catch {
    return null;
  }
}

export function isTokenExpired(token, offsetSeconds = 15) {
  const payload = parseJwt(token);
  if (!payload?.exp) return false;
  const expiresAt = payload.exp * 1000;
  return Date.now() >= expiresAt - offsetSeconds * 1000;
}

export function normalizeRole(role) {
  if (!role || typeof role !== 'string') return '';
  return role.replace(/^ROLE_/, '');
}

export function userHasRole(user, role) {
  const target = normalizeRole(role);
  if (!target) return false;

  if (Array.isArray(user?.roles)) {
    return user.roles.map(normalizeRole).includes(target);
  }

  return normalizeRole(user?.role) === target;
}
