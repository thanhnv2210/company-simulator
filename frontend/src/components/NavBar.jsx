const TABS = [
  { id: 'dashboard', label: '🏢 Dashboard' },
  { id: 'roles', label: '👤 Roles' },
  { id: 'workflow', label: '🔄 Workflow' },
  { id: 'decisions', label: '🎯 Decisions' },
  { id: 'history', label: '📜 History' },
];

export default function NavBar({ current, onChange }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '12px 24px', background: '#1e293b',
      borderBottom: '1px solid #334155',
    }}>
      <span style={{ color: '#f8fafc', fontWeight: 700, marginRight: 20, fontSize: 15 }}>
        Company Simulator
      </span>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            padding: '6px 16px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 14,
            background: current === tab.id ? '#3b82f6' : 'transparent',
            color: current === tab.id ? '#fff' : '#94a3b8',
            fontWeight: current === tab.id ? 600 : 400,
          }}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
