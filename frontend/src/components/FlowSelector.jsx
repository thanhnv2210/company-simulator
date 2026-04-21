import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

export default function FlowSelector({ flows, selectedId, onSelect, onReset, onFlowUpdated, loading }) {
  const active = flows.find(f => f.is_active);
  const inactive = flows.filter(f => !f.is_active);
  const selectedFlow = flows.find(f => f.id === selectedId);
  const isViewOnly = selectedFlow && !selectedFlow.is_active;

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedFlow) {
      setEditName(selectedFlow.name ?? '');
      setEditDesc(selectedFlow.description ?? '');
    }
    setEditing(false);
  }, [selectedId]);

  async function handleSave() {
    if (!editName.trim() || saving) return;
    setSaving(true);
    try {
      const updated = await api.updateFlow(selectedId, editName.trim(), editDesc.trim());
      onFlowUpdated(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setEditName(selectedFlow?.name ?? '');
    setEditDesc(selectedFlow?.description ?? '');
    setEditing(false);
  }

  return (
    <div style={{ background: '#0f172a', borderBottom: '1px solid #1e293b' }}>

      {/* Main bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 24px', flexWrap: 'wrap' }}>
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

        {isViewOnly && (
          <span style={{
            fontSize: 11, color: '#f59e0b', background: '#1e293b',
            border: '1px solid #f59e0b', borderRadius: 4, padding: '2px 8px',
          }}>
            View only
          </span>
        )}

        {selectedFlow && !editing && (
          <button
            onClick={() => setEditing(true)}
            title="Rename or add description"
            style={{
              background: 'none', border: '1px solid #334155', borderRadius: 6,
              color: '#64748b', cursor: 'pointer', fontSize: 13, padding: '4px 10px',
            }}
          >
            ✏️ Edit
          </button>
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

      {/* Description display */}
      {!editing && selectedFlow?.description && (
        <div style={{ padding: '0 24px 10px', fontSize: 13, color: '#64748b', fontStyle: 'italic' }}>
          {selectedFlow.description}
        </div>
      )}

      {/* Inline editor */}
      {editing && (
        <div style={{
          padding: '12px 24px 16px',
          borderTop: '1px solid #1e293b',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              value={editName}
              onChange={e => setEditName(e.target.value)}
              placeholder="Flow name"
              style={{
                background: '#1e293b', border: '1px solid #334155', borderRadius: 6,
                color: '#e2e8f0', padding: '6px 12px', fontSize: 14, width: 260,
              }}
            />
            <input
              value={editDesc}
              onChange={e => setEditDesc(e.target.value)}
              placeholder="Add a description (optional)"
              style={{
                background: '#1e293b', border: '1px solid #334155', borderRadius: 6,
                color: '#e2e8f0', padding: '6px 12px', fontSize: 14, flex: 1, minWidth: 200,
              }}
            />
            <button
              onClick={handleSave}
              disabled={saving || !editName.trim()}
              style={{
                padding: '6px 18px', borderRadius: 6, border: 'none', fontWeight: 600,
                fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer',
                background: '#3b82f6', color: '#fff', opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              style={{
                padding: '6px 14px', borderRadius: 6, border: '1px solid #334155',
                background: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
