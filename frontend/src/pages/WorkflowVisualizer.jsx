import { useState, useEffect } from 'react';
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

const STEP_ICONS = ['💡', '📋', '⚙️', '🚀', '💬', '🔄', '🔍', '📢', '🔀', '⚖️', '💰', '🏗️'];

export default function WorkflowVisualizer({ workflowId }) {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listWorkflows()
      .then(setWorkflows)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 32, color: '#64748b' }}>Loading workflow…</div>
    );
  }

  const workflow = workflows.find(w => w.id === workflowId) ?? workflows[0];

  if (!workflow) {
    return (
      <div style={{ padding: 32, color: '#64748b' }}>No workflow data available.</div>
    );
  }

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>🔄 {workflow.name}</h2>
      <p style={{ color: '#64748b', marginBottom: 36, fontSize: 14 }}>
        {workflow.description}
      </p>

      <div style={{ display: 'flex', alignItems: 'stretch', gap: 0, overflowX: 'auto', paddingBottom: 8 }}>
        {workflow.steps.map((step, i) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              background: '#1e293b',
              borderRadius: 10,
              padding: '24px 20px',
              minWidth: 160,
              textAlign: 'center',
              border: '1px solid #334155',
            }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{STEP_ICONS[i] ?? '📌'}</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15, color: '#f8fafc' }}>{step.name}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>{step.description}</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {step.roles.map(r => (
                  <span key={r} style={{
                    background: ROLE_COLORS[r] ?? '#475569',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    {ROLE_LABELS[r] ?? r}
                  </span>
                ))}
              </div>
            </div>
            {i < workflow.steps.length - 1 && (
              <div style={{ padding: '0 10px', color: '#475569', fontSize: 22, flexShrink: 0 }}>→</div>
            )}
          </div>
        ))}
      </div>

      {workflows.length > 1 && (
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #1e293b' }}>
          <span style={{ color: '#475569', fontSize: 12 }}>
            Other workflows: {workflows.filter(w => w.id !== workflow.id).map(w => w.name).join(', ')}
          </span>
        </div>
      )}
    </div>
  );
}
