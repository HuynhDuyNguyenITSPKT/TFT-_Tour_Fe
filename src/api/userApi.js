import http from './http';

export function getCurrentUser() {
  return http.get('/user/me');
}

export function updateCurrentUser(payload) {
  return http.put('/user/update', payload);
}
