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
  if (!role) return '';

  if (typeof role === 'string') {
    return role.trim().replace(/^ROLE_/i, '').toUpperCase();
  }

  if (typeof role === 'object') {
    const nested = role.name || role.role || role.roleName || role.authority;
    return normalizeRole(nested);
  }

  return '';
}

export function userHasRole(user, role) {
  const target = normalizeRole(role);
  if (!target) return false;

  const values = [];

  if (user?.role) values.push(user.role);
  if (user?.roleName) values.push(user.roleName);
  if (Array.isArray(user?.roles)) values.push(...user.roles);
  if (Array.isArray(user?.authorities)) values.push(...user.authorities);

  if (!values.length) return false;

  const normalizedValues = values.map(normalizeRole).filter(Boolean);

  if (!normalizedValues.length) return false;

  return normalizedValues.includes(target);
}
