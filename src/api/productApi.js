import http from './http';

export function getProducts(categoryId) {
  return http.get('/products', {
    params: categoryId ? { categoryId } : undefined
  });
}

export function getProductById(productId) {
  return http.get(`/products/${productId}`);
}

export function createProduct(payload) {
  return http.post('/admin/products', payload);
}

export function updateProduct(productId, payload) {
  return http.put(`/admin/products/${productId}`, payload);
}

export function deleteProduct(productId) {
  return http.delete(`/admin/products/${productId}`);
}

