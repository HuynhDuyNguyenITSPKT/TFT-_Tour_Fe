import http from './http';

export function getProjects() {
  return http.get('/projects');
}

export function createProject(payload) {
  return http.post('/projects', payload);
}

export function updateProject(projectId, payload) {
  return http.put(`/projects/${projectId}`, payload);
}

export function deleteProject(projectId) {
  return http.delete(`/projects/${projectId}`);
}
