const BASE_URL = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  // Flows
  listFlows: () => request('/flows'),
  getFlow: (id) => request(`/flows/${id}`),
  createFlow: (name) => request('/flows', { method: 'POST', body: JSON.stringify({ name }) }),
  resetFlow: (name) => request('/flows/reset', { method: 'POST', body: JSON.stringify({ name }) }),
  activateFlow: (id) => request(`/flows/${id}/activate`, { method: 'PATCH' }),

  // Decisions
  applyDecision: (flowId, decisionId, optionId) =>
    request(`/flows/${flowId}/decisions`, {
      method: 'POST',
      body: JSON.stringify({ decision_id: decisionId, option_id: optionId }),
    }),
};
