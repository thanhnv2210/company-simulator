export default function MetricBar({ label, value, color = '#4f8ef7' }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4, color: '#cbd5e1' }}>
        <span>{label.replace(/_/g, ' ')}</span>
        <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{value}</span>
      </div>
      <div style={{ background: '#334155', borderRadius: 4, height: 8 }}>
        <div
          style={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            background: color,
            borderRadius: 4,
            height: 8,
            transition: 'width 0.4s ease',
          }}
        />
      </div>
    </div>
  );
}
