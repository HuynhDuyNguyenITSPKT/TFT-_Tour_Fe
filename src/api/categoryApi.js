import http from './http';

export function getCategories() {
  return http.get('/categories');
}

export function getCategoryById(categoryId) {
  return http.get(`/categories/${categoryId}`);
}

export function createCategory(payload) {
  return http.post('/admin/categories', payload);
}

export function updateCategory(categoryId, payload) {
  return http.put(`/admin/categories/${categoryId}`, payload);
}

export function deleteCategory(categoryId) {
  return http.delete(`/admin/categories/${categoryId}`);
}

