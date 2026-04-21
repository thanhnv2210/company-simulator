export default function FlowSelector({ flows, selectedId, onSelect, onReset, loading }) {
  const active = flows.find(f => f.is_active);
  const inactive = flows.filter(f => !f.is_active);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 24px', background: '#0f172a',
      borderBottom: '1px solid #1e293b', flexWrap: 'wrap',
    }}>
      <span style={{ color: '#475569', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
        Flow
      </span>

      <select
        value={selectedId ?? ''}
        onChange={e => onSelect(Number(e.target.value))}
        disabled={loading}
        style={{
          background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155',
          borderRadius: 6, padding: '5px 10px', fontSize: 13, cursor: 'pointer',
        }}
      >
        {active && (
          <optgroup label="Active">
            <option value={active.id}>▶ {active.name}</option>
          </optgroup>
        )}
        {inactive.length > 0 && (
          <optgroup label="Inactive">
            {inactive.map(f => (
              <option key={f.id} value={f.id}>⏸ {f.name}</option>
            ))}
          </optgroup>
        )}
      </select>

      {selectedId && flows.find(f => f.id === selectedId && !f.is_active) && (
        <span style={{
          fontSize: 11, color: '#f59e0b', background: '#1e293b',
          border: '1px solid #f59e0b', borderRadius: 4, padding: '2px 8px',
        }}>
          View only
        </span>
      )}

      <button
        onClick={onReset}
        disabled={loading}
        style={{
          marginLeft: 'auto', padding: '6px 16px', borderRadius: 6, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer', fontSize: 13, fontWeight: 600,
          background: '#dc2626', color: '#fff', opacity: loading ? 0.6 : 1,
        }}
      >
        ↺ Reset & New Flow
      </button>
    </div>
  );
}
