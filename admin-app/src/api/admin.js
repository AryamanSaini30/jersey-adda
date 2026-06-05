import { request, requestJson } from './http';

function buildAdminHeaders(adminPassword) {
  return {
    'x-admin-password': adminPassword
  };
}

export async function listAdminJerseys(adminPassword, params = '') {
  return request(`/jerseys${params}`, {
    headers: buildAdminHeaders(adminPassword)
  });
}

export async function createAdminJersey(adminPassword, formData) {
  return request('/admin/jerseys', {
    method: 'POST',
    headers: buildAdminHeaders(adminPassword),
    body: formData
  });
}

export async function updateAdminJersey(adminPassword, jerseyId, formData) {
  return request(`/admin/jerseys/${jerseyId}`, {
    method: 'PUT',
    headers: buildAdminHeaders(adminPassword),
    body: formData
  });
}

export async function deleteAdminJersey(adminPassword, jerseyId) {
  return requestJson(`/admin/jerseys/${jerseyId}`, 'DELETE', undefined, buildAdminHeaders(adminPassword));
}

export async function verifyAdminPassword(adminPassword) {
  return requestJson('/admin/verify', 'POST', undefined, buildAdminHeaders(adminPassword));
}
