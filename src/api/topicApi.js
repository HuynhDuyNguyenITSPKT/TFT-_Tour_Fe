import http from './http';

export function getTopics() {
  return http.get('/topics');
}


export function createTopic(payload) {
  return http.post('/admin/game-topics', payload);
}

export function updateTopic(topicId, payload) {
  return http.put(`/admin/game-topics/${topicId}`, payload);
}

export function deleteTopic(topicId) {
  return http.delete(`/admin/game-topics/${topicId}`);
}

