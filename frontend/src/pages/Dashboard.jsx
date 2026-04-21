import MetricBar from '../components/MetricBar.jsx';

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
  pm: 'Product Manager',
  sales: 'Sales',
};

const ROLE_ICONS = {
  ceo: '👔',
  cto: '🛠️',
  engineer: '💻',
  pm: '📋',
  sales: '📈',
};

export default function Dashboard({ state }) {
  const { company, metrics, history } = state;

  return (
    <div style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ margin: '0 0 6px', fontSize: 24 }}>🏢 {company.name}</h2>
        <div style={{ display: 'flex', gap: 20, color: '#64748b', fontSize: 14 }}>
          <span>Stage: <strong style={{ color: '#94a3b8' }}>{company.stage}</strong></span>
          <span>Team: <strong style={{ color: '#94a3b8' }}>{company.size} people</strong></span>
          <span>Budget: <strong style={{ color: '#94a3b8' }}>${company.budget.toLocaleString()}</strong></span>
          <span>Decisions made: <strong style={{ color: '#94a3b8' }}>{history.length}</strong></span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 20 }}>
        {Object.entries(metrics).map(([role, roleMetrics]) => (
          <div key={role} style={{
            background: '#1e293b',
            borderRadius: 10,
            padding: 20,
            borderTop: `3px solid ${ROLE_COLORS[role]}`,
          }}>
            <h3 style={{ margin: '0 0 16px', color: ROLE_COLORS[role], fontSize: 14, textTransform: 'uppercase', letterSpacing: 1 }}>
              {ROLE_ICONS[role]} {ROLE_LABELS[role]}
            </h3>
            {Object.entries(roleMetrics).map(([key, value]) => (
              <MetricBar key={key} label={key} value={value} color={ROLE_COLORS[role]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
