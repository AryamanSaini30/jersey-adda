import { request } from './http';

export async function listJerseys(params = '') {
  return request(`/jerseys${params}`);
}

export async function getJerseyBySlug(slug) {
  return request(`/jerseys/${slug}`);
}
