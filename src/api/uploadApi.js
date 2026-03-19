import http from './http';

export function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  return http.post('/admin/products/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

