import http from './http';

export function refreshAccessToken(refreshToken) {
  return http.post('/auth/refresh', { refreshToken });
}

export function sendLoginSuccessEmail({ to, subject, content }) {
  return http.get('/send-email', {
    params: { to, subject, content }
  });
}

