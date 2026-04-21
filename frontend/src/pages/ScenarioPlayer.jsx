import { useState, useEffect } from 'react';
import { api } from '../api/client.js';

const ROLE_COLORS = {
  ceo: '#f59e0b', cto: '#8b5cf6', engineer: '#3b82f6', pm: '#10b981', sales: '#ef4444',
};
const ROLE_LABELS = {
  ceo: 'CEO', cto: 'CTO', engineer: 'Engineer', pm: 'PM', sales: 'Sales',
};

function agreementColor(score) {
  if (score >= 70) return '#10b981';
  if (score >= 40) return '#f59e0b';
  return '#ef4444';
}

// ── Scenario selection screen ─────────────────────────────────────────────────
function ScenarioCard({ scenario, onStart, loading }) {
  const isPositive = scenario.outcome === 'positive';
  return (
    <div style={{
      background: '#1e293b', borderRadius: 12, padding: 28,
      border: `1px solid ${isPositive ? '#10b981' : '#ef4444'}`,
      borderTop: `4px solid ${isPositive ? '#10b981' : '#ef4444'}`,
      flex: 1, minWidth: 280,
    }}>
      <div style={{ fontSize: 28, marginBottom: 10 }}>{isPositive ? '🟢' : '🔴'}</div>
      <h3 style={{ margin: '0 0 10px', fontSize: 18 }}>{scenario.title}</h3>
      <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
        {scenario.description}
      </p>
      <div style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>
        {scenario.total_steps} decisions over 2 years
      </div>
      <button
        onClick={() => onStart(scenario.id)}
        disabled={loading}
        style={{
          width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14,
          background: isPositive ? '#10b981' : '#ef4444', color: '#fff',
          opacity: loading ? 0.6 : 1,
        }}
      >
        ▶ Play This Scenario
      </button>
    </div>
  );
}

// ── Step result panel ──────────────────────────────────────────────────────────
function StepResult({ result }) {
  return (
    <div style={{ background: '#0f172a', borderRadius: 10, padding: 20, border: '1px solid #1e293b', marginTop: 16 }}>
      <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
        Team Reaction
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
        {Object.entries(result.role_impacts).map(([role, impacts]) => {
          const score = impacts.agreement ?? 50;
          const metricChanges = Object.entries(impacts).filter(([k]) => k !== 'agreement');
          return (
            <div key={role} style={{
              background: '#1e293b', borderRadius: 8, padding: '12px 10px', textAlign: 'center',
              borderTop: `2px solid ${ROLE_COLORS[role]}`,
            }}>
              <div style={{ color: ROLE_COLORS[role], fontWeight: 700, fontSize: 12, marginBottom: 6 }}>
                {ROLE_LABELS[role]}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: agreementColor(score), marginBottom: 6 }}>
                {score}%
              </div>
              {metricChanges.map(([k, v]) => (
                <div key={k} style={{ fontSize: 11, color: v > 0 ? '#10b981' : v < 0 ? '#ef4444' : '#475569' }}>
                  {k.replace(/_/g, ' ')} {v > 0 ? `+${v}` : v}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ScenarioPlayer({ onFlowCreated }) {
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [flowId, setFlowId] = useState(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [stepResult, setStepResult] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.listScenarios().then(setScenarios);
  }, []);

  async function handleStart(scenarioId) {
    setLoading(true);
    try {
      const { flow, scenario } = await api.startScenario(scenarioId);
      setActiveScenario(scenario);
      setFlowId(flow.id);
      setStepIndex(0);
      setStepResult(null);
      setCompleted(false);
      onFlowCreated(flow);
    } finally {
      setLoading(false);
    }
  }

  async function handleApplyStep() {
    if (!activeScenario || flowId === null) return;
    setLoading(true);
    try {
      const result = await api.applyScenarioStep(activeScenario.id, flowId, stepIndex);
      setStepResult(result);
      if (result.is_last) setCompleted(true);
    } finally {
      setLoading(false);
    }
  }

  function handleNextStep() {
    setStepIndex(i => i + 1);
    setStepResult(null);
  }

  function handleReset() {
    setActiveScenario(null);
    setFlowId(null);
    setStepIndex(0);
    setStepResult(null);
    setCompleted(false);
  }

  // ── Scenario selection ──
  if (!activeScenario) {
    return (
      <div style={{ padding: 32, maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 8 }}>🎬 Scenarios</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
          Play through a guided 2-year startup journey. Each step applies real decisions and shows how the company state evolves.
        </p>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {scenarios.map(s => (
            <ScenarioCard key={s.id} scenario={s} onStart={handleStart} loading={loading} />
          ))}
        </div>
      </div>
    );
  }

  const isPositive = activeScenario.outcome === 'positive';
  const currentStep = activeScenario.steps[stepIndex];
  const progress = stepResult && completed
    ? activeScenario.steps.length
    : stepIndex + (stepResult ? 1 : 0);

  // ── Completion screen ──
  if (completed && stepResult) {
    return (
      <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{isPositive ? '🎉' : '📉'}</div>
          <h2 style={{ marginBottom: 8 }}>{isPositive ? 'Series A Closed!' : 'Runway Exhausted'}</h2>
          <p style={{ color: '#64748b', fontSize: 14 }}>
            You completed <strong style={{ color: '#e2e8f0' }}>{activeScenario.title}</strong> — all {activeScenario.steps.length} decisions applied.
            Check the Dashboard to see the final company state.
          </p>
        </div>

        <StepResult result={stepResult} />

        <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'center' }}>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 28px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: '#3b82f6', color: '#fff', fontWeight: 600, fontSize: 14,
            }}
          >
            ← Try Another Scenario
          </button>
        </div>
      </div>
    );
  }

  // ── Step player ──
  return (
    <div style={{ padding: 32, maxWidth: 800, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <button
            onClick={handleReset}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13, padding: 0, marginBottom: 8 }}
          >
            ← Back to scenarios
          </button>
          <h2 style={{ margin: 0 }}>{activeScenario.title}</h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 13, color: '#64748b' }}>Step</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: isPositive ? '#10b981' : '#ef4444' }}>
            {progress} / {activeScenario.steps.length}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ background: '#1e293b', borderRadius: 4, height: 6, marginBottom: 28 }}>
        <div style={{
          width: `${(progress / activeScenario.steps.length) * 100}%`,
          background: isPositive ? '#10b981' : '#ef4444',
          borderRadius: 4, height: 6, transition: 'width 0.4s ease',
        }} />
      </div>

      {/* Current step card */}
      {!stepResult && (
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 28, border: '1px solid #334155' }}>
          <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            {currentStep.quarter}
          </div>
          <h3 style={{ margin: '0 0 12px', fontSize: 20 }}>{currentStep.title}</h3>
          <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.7, marginBottom: 20 }}>
            {currentStep.context}
          </p>
          <div style={{ background: '#0f172a', borderRadius: 8, padding: '14px 18px', borderLeft: `3px solid ${isPositive ? '#10b981' : '#ef4444'}`, marginBottom: 24 }}>
            <div style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
              Market Impact
            </div>
            <p style={{ color: '#cbd5e1', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {currentStep.market_impact}
            </p>
          </div>
          <button
            onClick={handleApplyStep}
            disabled={loading}
            style={{
              width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 15,
              background: isPositive ? '#10b981' : '#ef4444', color: '#fff',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Applying...' : `Apply: ${currentStep.title}`}
          </button>
        </div>
      )}

      {/* Step result */}
      {stepResult && !completed && (
        <div>
          <div style={{ background: '#1e293b', borderRadius: 12, padding: 28, border: '1px solid #334155', marginBottom: 0 }}>
            <div style={{ fontSize: 12, color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
              {currentStep.quarter}
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: 18, color: isPositive ? '#10b981' : '#ef4444' }}>
              ✓ {currentStep.title}
            </h3>
            <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{currentStep.context}</p>
          </div>

          <StepResult result={stepResult} />

          <button
            onClick={handleNextStep}
            style={{
              marginTop: 20, width: '100%', padding: '12px 0', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontWeight: 700, fontSize: 15,
              background: '#3b82f6', color: '#fff',
            }}
          >
            Next Step →
          </button>
        </div>
      )}
    </div>
  );
}
