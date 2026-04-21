import workflowData from '../data/workflows.json';

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

const STEP_ICONS = ['💡', '📋', '⚙️', '🚀', '💬'];

export default function WorkflowVisualizer() {
  const workflow = workflowData.workflows[0];

  return (
    <div style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 8 }}>🔄 {workflow.name}</h2>
      <p style={{ color: '#64748b', marginBottom: 36, fontSize: 14 }}>
        End-to-end product lifecycle showing which roles are involved at each stage.
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
              <div style={{ fontSize: 28, marginBottom: 10 }}>{STEP_ICONS[i]}</div>
              <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15, color: '#f8fafc' }}>{step.name}</div>
              <div style={{ color: '#64748b', fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>{step.description}</div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                {step.roles.map(r => (
                  <span key={r} style={{
                    background: ROLE_COLORS[r],
                    color: '#fff',
                    borderRadius: 12,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                  }}>
                    {ROLE_LABELS[r]}
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
    </div>
  );
}
