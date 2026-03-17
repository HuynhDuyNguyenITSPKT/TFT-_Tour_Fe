import http from './http';

export function refreshAccessToken(refreshToken) {
  return http.post('/auth/refresh', { refreshToken });
}
