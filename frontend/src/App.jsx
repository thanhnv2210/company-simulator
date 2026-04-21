import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import RoleExplorer from './pages/RoleExplorer.jsx';
import WorkflowVisualizer from './pages/WorkflowVisualizer.jsx';
import DecisionPlayground from './pages/DecisionPlayground.jsx';
import { getState } from './state/engine.js';

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [state, setState] = useState(getState());

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#e2e8f0', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <NavBar current={page} onChange={setPage} />
      <main>
        {page === 'dashboard' && <Dashboard state={state} />}
        {page === 'roles' && <RoleExplorer />}
        {page === 'workflow' && <WorkflowVisualizer />}
        {page === 'decisions' && <DecisionPlayground onStateChange={setState} />}
      </main>
    </div>
  );
}
