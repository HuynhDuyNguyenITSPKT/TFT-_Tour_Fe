import http from './http';

export function createPost(topicId, payload) {
  return http.post(`/topics/${topicId}/posts`, payload);
}

export function getPostsByTopic(topicId) {
  return http.get(`/topics/${topicId}/posts`);
}

export function getMyPosts() {
  return http.get('/posts/me');
}

export function updatePost(postId, payload) {
  return http.put(`/posts/${postId}`, payload);
}

export function deletePost(postId) {
  return http.delete(`/posts/${postId}`);
}

