import { useState } from 'react';
import rolesData from '../data/roles.json';

const ROLE_COLORS = {
  ceo: '#f59e0b',
  cto: '#8b5cf6',
  engineer: '#3b82f6',
  pm: '#10b981',
  sales: '#ef4444',
};

export default function RoleExplorer() {
  const [selected, setSelected] = useState(rolesData.roles[0].id);
  const role = rolesData.roles.find(r => r.id === selected);

  return (
    <div style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
      <h2 style={{ marginBottom: 24 }}>👤 Role Explorer</h2>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' }}>
        {rolesData.roles.map(r => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            style={{
              padding: '8px 20px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
              background: selected === r.id ? ROLE_COLORS[r.id] : '#1e293b',
              color: selected === r.id ? '#fff' : '#94a3b8',
              transition: 'all 0.2s',
            }}
          >
            {r.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        <div style={{ background: '#1e293b', borderRadius: 10, padding: 20 }}>
          <h4 style={{ color: ROLE_COLORS[role.id], marginTop: 0, marginBottom: 14, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
            Responsibilities
          </h4>
          <ul style={{ paddingLeft: 18, color: '#cbd5e1', lineHeight: 2, margin: 0 }}>
            {role.responsibilities.map(r => <li key={r}>{r}</li>)}
          </ul>
        </div>

        <div style={{ background: '#1e293b', borderRadius: 10, padding: 20 }}>
          <h4 style={{ color: ROLE_COLORS[role.id], marginTop: 0, marginBottom: 14, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
            Daily Activities
          </h4>
          <ul style={{ paddingLeft: 18, color: '#cbd5e1', lineHeight: 2, margin: 0 }}>
            {role.daily_activities.map(a => <li key={a}>{a}</li>)}
          </ul>
        </div>

        <div style={{ background: '#1e293b', borderRadius: 10, padding: 20 }}>
          <h4 style={{ color: ROLE_COLORS[role.id], marginTop: 0, marginBottom: 14, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
            KPIs
          </h4>
          <ul style={{ paddingLeft: 18, color: '#cbd5e1', lineHeight: 2, margin: 0 }}>
            {role.metrics.map(m => <li key={m}>{m.replace(/_/g, ' ')}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
