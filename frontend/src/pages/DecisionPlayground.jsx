import { useState } from 'react';
import { getDecisions } from '../state/engine.js';
import { api } from '../api/client.js';

const ROLE_COLORS = {
  ceo: '#f59e0b',
  cto: '#8b5cf6',
  engineer: '#3b82f6',
  pm: '#10b981',
  sales: '#ef4444',
};

const ROLE_LABELS = {
  ceo: 'CEO',
  cto: 'CTO',
  engineer: 'Engineer',
  pm: 'PM',
  sales: 'Sales',
};

function agreementColor(score) {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function agreementLabel(score) {
  if (score >= 70) return 'Agrees';
  if (score >= 40) return 'Neutral';
  return 'Disagrees';
}

export default function DecisionPlayground({ flowId, isActive, onStateChange }) {
  const decisions = getDecisions();
  const [selectedDecision, setSelectedDecision] = useState(decisions[0].id);
  const [result, setResult] = useState(null);
  const [applying, setApplying] = useState(false);

  const decision = decisions.find(d => d.id === selectedDecision);

  async function handleOption(optionId) {
    if (!isActive || applying) return;
    setApplying(true);
    try {
      const option = decision.options.find(o => o.id === optionId);
      const agreement = {};
      Object.entries(option.role_impacts).forEach(([role, impacts]) => {
        agreement[role] = impacts.agreement ?? 50;
      });
      const { state: newState } = await api.applyDecision(flowId, selectedDecision, optionId);
      setResult({ optionId, agreement, optionLabel: option.label });
      onStateChange(newState);
    } finally {
      setApplying(false);
    }
  }

  function handleSelectDecision(id) {
    setSelectedDecision(id);
    setResult(null);
  }

  return (
    <div style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>🎯 Decision Playground</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
        {isActive
          ? 'Make a decision and see how each role reacts. Impacts are saved to this flow.'
          : 'Viewing an inactive flow — decisions are read-only.'}
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {decisions.map(d => (
          <button
            key={d.id}
            onClick={() => handleSelectDecision(d.id)}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13,
              background: selectedDecision === d.id ? '#3b82f6' : '#1e293b',
              color: selectedDecision === d.id ? '#fff' : '#94a3b8',
              fontWeight: selectedDecision === d.id ? 600 : 400,
              border: '1px solid ' + (selectedDecision === d.id ? '#3b82f6' : '#334155'),
            }}
          >
            {d.title}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: 10, padding: 24, marginBottom: 20, border: '1px solid #334155' }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 18 }}>{decision.title}</h3>
        <p style={{ color: '#94a3b8', margin: '0 0 20px', fontSize: 14 }}>{decision.description}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {decision.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => handleOption(opt.id)}
              disabled={!isActive || applying}
              style={{
                padding: '10px 28px', borderRadius: 8, border: 'none', fontSize: 14, fontWeight: 600,
                cursor: isActive && !applying ? 'pointer' : 'not-allowed',
                background: result?.optionId === opt.id ? '#3b82f6' : '#0f172a',
                color: result?.optionId === opt.id ? '#fff' : '#e2e8f0',
                border: '1px solid ' + (result?.optionId === opt.id ? '#3b82f6' : '#475569'),
                opacity: !isActive ? 0.5 : 1,
                transition: 'all 0.2s',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div style={{ background: '#0f172a', borderRadius: 10, padding: 24, border: '1px solid #1e293b' }}>
          <h4 style={{ margin: '0 0 16px', color: '#94a3b8', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
            Team Reaction → <span style={{ color: '#e2e8f0' }}>{result.optionLabel}</span>
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {Object.entries(result.agreement).map(([role, score]) => (
              <div key={role} style={{
                background: '#1e293b', borderRadius: 8, padding: '16px 12px', textAlign: 'center',
                borderTop: `3px solid ${ROLE_COLORS[role]}`,
              }}>
                <div style={{ color: ROLE_COLORS[role], fontWeight: 700, marginBottom: 8, fontSize: 13 }}>
                  {ROLE_LABELS[role]}
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color: agreementColor(score), marginBottom: 4 }}>
                  {score}%
                </div>
                <div style={{ fontSize: 11, color: agreementColor(score), fontWeight: 600 }}>
                  {agreementLabel(score)}
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 16, fontSize: 12, color: '#475569' }}>
            Metric changes have been applied. Check the Dashboard to see the updated state.
          </p>
        </div>
      )}
    </div>
  );
}
