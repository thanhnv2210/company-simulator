import initialState from '../data/stateSchema.json';
import decisions from '../data/decisions.json';

let state = JSON.parse(JSON.stringify(initialState));

export function getState() {
  return state;
}

export function resetState() {
  state = JSON.parse(JSON.stringify(initialState));
  return state;
}

export function getDecisions() {
  return decisions.decisions;
}

export function applyDecision(decisionId, optionId) {
  const decision = decisions.decisions.find(d => d.id === decisionId);
  if (!decision) return state;
  const option = decision.options.find(o => o.id === optionId);
  if (!option) return state;

  Object.entries(option.role_impacts).forEach(([role, impacts]) => {
    Object.entries(impacts).forEach(([key, value]) => {
      if (key === 'agreement') return;
      if (state.metrics[role] && state.metrics[role][key] !== undefined) {
        state.metrics[role][key] = Math.max(0, Math.min(100, state.metrics[role][key] + value));
      }
    });
  });

  state.history.push({
    decision_id: decisionId,
    option_id: optionId,
    timestamp: new Date().toISOString(),
    role_impacts: option.role_impacts,
  });

  return { ...state };
}

export function getRoleAgreement(decisionId, optionId) {
  const decision = decisions.decisions.find(d => d.id === decisionId);
  if (!decision) return {};
  const option = decision.options.find(o => o.id === optionId);
  if (!option) return {};
  const result = {};
  Object.entries(option.role_impacts).forEach(([role, impacts]) => {
    result[role] = impacts.agreement ?? 50;
  });
  return result;
}
