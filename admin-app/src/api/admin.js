import { request, requestJson } from './http';

function buildAdminHeaders(adminToken) {
  return {
    'Authorization': `Bearer ${adminToken}`
  };
}

export async function listAdminJerseys(adminToken, params = '') {
  return request(`/jerseys${params}`, {
    headers: buildAdminHeaders(adminToken)
  });
}

export async function createAdminJersey(adminToken, formData) {
  return request('/admin/jerseys', {
    method: 'POST',
    headers: buildAdminHeaders(adminToken),
    body: formData
  });
}

export async function updateAdminJersey(adminToken, jerseyId, formData) {
  return request(`/admin/jerseys/${jerseyId}`, {
    method: 'PUT',
    headers: buildAdminHeaders(adminToken),
    body: formData
  });
}

export async function deleteAdminJersey(adminToken, jerseyId) {
  return requestJson(`/admin/jerseys/${jerseyId}`, 'DELETE', undefined, buildAdminHeaders(adminToken));
}

export async function verifyAdminToken(adminToken) {
  return requestJson('/admin/verify', 'POST', undefined, buildAdminHeaders(adminToken));
}

export async function loginAdmin(password) {
  return requestJson('/admin/login', 'POST', { password });
}
