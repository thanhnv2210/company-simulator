import { useState, useEffect } from 'react';
import NavBar from './components/NavBar.jsx';
import FlowSelector from './components/FlowSelector.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RoleExplorer from './pages/RoleExplorer.jsx';
import WorkflowVisualizer from './pages/WorkflowVisualizer.jsx';
import DecisionPlayground from './pages/DecisionPlayground.jsx';
import DecisionHistory from './pages/DecisionHistory.jsx';
import ScenarioPlayer from './pages/ScenarioPlayer.jsx';
import { api } from './api/client.js';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [flows, setFlows] = useState([]);
  const [selectedFlowId, setSelectedFlowId] = useState(null);
  const [flowState, setFlowState] = useState(null);
  const [loading, setLoading] = useState(true);

  const selectedFlow = flows.find(f => f.id === selectedFlowId);
  const isActive = selectedFlow?.is_active ?? false;

  async function loadFlows(selectId = null) {
    setLoading(true);
    try {
      const list = await api.listFlows();
      setFlows(list);
      const target = selectId
        ? list.find(f => f.id === selectId)
        : list.find(f => f.is_active) || list[0];
      if (target) {
        await selectFlow(target.id, list);
      } else {
        // No flows yet — create the first one
        const created = await api.resetFlow('Flow 1');
        const fresh = await api.listFlows();
        setFlows(fresh);
        await selectFlow(created.id, fresh);
      }
    } finally {
      setLoading(false);
    }
  }

  async function selectFlow(id, list = flows) {
    setSelectedFlowId(id);
    const flow = await api.getFlow(id);
    setFlowState(flow.state);
    // Sync flows list is_active status
    const updated = list.map(f => ({ ...f, is_active: f.id === id ? flow.is_active : f.is_active }));
    setFlows(updated);
  }

  async function handleSelectFlow(id) {
    setLoading(true);
    try { await selectFlow(id); } finally { setLoading(false); }
  }

  async function handleReset() {
    setLoading(true);
    try {
      const newFlow = await api.resetFlow(`Flow ${new Date().toLocaleString()}`);
      await loadFlows(newFlow.id);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadFlows(); }, []);

  if (loading && !flowState) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        Loading...
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NavBar current={page} onChange={setPage} />
      <FlowSelector
        flows={flows}
        selectedId={selectedFlowId}
        onSelect={handleSelectFlow}
        onReset={handleReset}
        loading={loading}
      />
      <main>
        {flowState && (
          <>
            {page === 'dashboard' && <Dashboard state={flowState} />}
            {page === 'roles' && <RoleExplorer />}
            {page === 'workflow' && <WorkflowVisualizer />}
            {page === 'decisions' && (
              <DecisionPlayground
                flowId={selectedFlowId}
                isActive={isActive}
                currentState={flowState}
                onStateChange={setFlowState}
              />
            )}
            {page === 'history' && (
              <DecisionHistory flowId={selectedFlowId} />
            )}
            {page === 'scenarios' && (
              <ScenarioPlayer onFlowCreated={(flow) => loadFlows(flow.id)} />
            )}
          </>
        )}
      </main>
    </div>
  );
}
