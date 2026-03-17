import http from './http';

export function getUsers() {
  return http.get('/admin/users');
}

export function changeUserRole(userId, roleName) {
  return http.put(`/admin/users/${userId}/role`, { roleName });
}

export function deleteUser(userId) {
  return http.delete(`/admin/users/${userId}`);
}
