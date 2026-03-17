const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ accessToken, refreshToken }) {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function readOAuthTokensFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;
  const hashParams = new URLSearchParams(hash);

  const accessToken =
    params.get('accessToken') ||
    params.get('access_token') ||
    hashParams.get('accessToken') ||
    hashParams.get('access_token');

  const refreshToken =
    params.get('refreshToken') ||
    params.get('refresh_token') ||
    hashParams.get('refreshToken') ||
    hashParams.get('refresh_token');

  if (!accessToken && !refreshToken) {
    return null;
  }

  return { accessToken, refreshToken };
}

export function clearTokenParamsFromUrl() {
  const url = new URL(window.location.href);
  ['accessToken', 'refreshToken', 'access_token', 'refresh_token'].forEach((key) => {
    url.searchParams.delete(key);
  });
  url.hash = '';
  window.history.replaceState({}, document.title, `${url.pathname}${url.search}`);
}
