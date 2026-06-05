import { request } from './http';

export async function listJerseys() {
  return request('/jerseys');
}

export async function getJerseyBySlug(slug) {
  return request(`/jerseys/${slug}`);
}
