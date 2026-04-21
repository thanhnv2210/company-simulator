import { useState, useEffect } from 'react';
import { api } from '../api/client.js';
import decisionsData from '../data/decisions.json';

const ROLE_COLORS = {
  ceo: '#f59e0b',
  cto: '#8b5cf6',
  engineer: '#3b82f6',
  pm: '#10b981',
  sales: '#ef4444',
};

const ROLE_LABELS = {
  ceo: 'CEO', cto: 'CTO', engineer: 'Engineer', pm: 'PM', sales: 'Sales',
};

function agreementColor(score) {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

function formatTime(ts) {
  return new Date(ts).toLocaleString(undefined, {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function lookupDecision(decisionId, optionId) {
  const decision = decisionsData.decisions.find(d => d.id === decisionId);
  const option = decision?.options.find(o => o.id === optionId);
  return { decisionTitle: decision?.title ?? decisionId, optionLabel: option?.label ?? optionId };
}

export default function DecisionHistory({ flowId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (!flowId) return;
    setLoading(true);
    api.getFlow(flowId)
      .then(flow => setHistory([...flow.decisions].reverse()))
      .finally(() => setLoading(false));
  }, [flowId]);

  if (loading) {
    return (
      <div style={{ padding: 32, color: '#64748b', textAlign: 'center' }}>Loading history...</div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>📜 Decision History</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
        {history.length} decision{history.length !== 1 ? 's' : ''} made in this flow — most recent first.
      </p>

      {history.length === 0 && (
        <div style={{ background: '#1e293b', borderRadius: 10, padding: 32, textAlign: 'center', color: '#475569' }}>
          No decisions made yet. Go to the Decision Playground to get started.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {history.map((record, i) => {
          const { decisionTitle, optionLabel } = lookupDecision(record.decision_id, record.option_id);
          const isExpanded = expanded === record.id;
          const isLast = i === history.length - 1;

          return (
            <div key={record.id} style={{ display: 'flex', gap: 16 }}>
              {/* Timeline spine */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%', marginTop: 18, flexShrink: 0,
                  background: i === 0 ? '#3b82f6' : '#334155',
                  border: i === 0 ? '2px solid #60a5fa' : '2px solid #475569',
                }} />
                {!isLast && (
                  <div style={{ width: 2, flex: 1, background: '#1e293b', minHeight: 16 }} />
                )}
              </div>

              {/* Card */}
              <div style={{ flex: 1, marginBottom: 12 }}>
                <div
                  onClick={() => setExpanded(isExpanded ? null : record.id)}
                  style={{
                    background: '#1e293b', borderRadius: 10, padding: '14px 18px',
                    border: '1px solid ' + (isExpanded ? '#3b82f6' : '#334155'),
                    cursor: 'pointer', transition: 'border-color 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{decisionTitle}</div>
                      <div style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>→ {optionLabel}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                      <div style={{ fontSize: 12, color: '#475569' }}>{formatTime(record.applied_at)}</div>
                      <div style={{ fontSize: 12, color: '#334155', marginTop: 4 }}>
                        {isExpanded ? '▲ collapse' : '▼ expand'}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #334155' }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Team Reaction
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                        {Object.entries(record.role_impacts).map(([role, impacts]) => {
                          const score = impacts.agreement ?? 50;
                          return (
                            <div key={role} style={{
                              background: '#0f172a', borderRadius: 8, padding: '12px 10px', textAlign: 'center',
                              borderTop: `2px solid ${ROLE_COLORS[role]}`,
                            }}>
                              <div style={{ color: ROLE_COLORS[role], fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
                                {ROLE_LABELS[role]}
                              </div>
                              <div style={{ fontSize: 22, fontWeight: 800, color: agreementColor(score) }}>
                                {score}%
                              </div>
                              <div style={{ marginTop: 8, fontSize: 11, color: '#475569' }}>
                                {Object.entries(impacts)
                                  .filter(([k]) => k !== 'agreement')
                                  .map(([k, v]) => (
                                    <div key={k} style={{ color: v > 0 ? '#10b981' : v < 0 ? '#ef4444' : '#475569' }}>
                                      {k.replace(/_/g, ' ')} {v > 0 ? `+${v}` : v}
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
