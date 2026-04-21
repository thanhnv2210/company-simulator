const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const scenariosData = require('../data/scenarios.json');
const decisionsData = require('../data/decisions.json');
const defaultState = require('../data/stateSchema.json');

function buildDefaultState() {
  return JSON.parse(JSON.stringify(defaultState));
}

function applyDecisionToState(state, decisionId, optionId) {
  const decision = decisionsData.decisions.find(d => d.id === decisionId);
  if (!decision) return state;
  const option = decision.options.find(o => o.id === optionId);
  if (!option) return state;

  const newState = JSON.parse(JSON.stringify(state));
  Object.entries(option.role_impacts).forEach(([role, impacts]) => {
    Object.entries(impacts).forEach(([key, value]) => {
      if (key === 'agreement') return;
      if (newState.metrics[role] && newState.metrics[role][key] !== undefined) {
        newState.metrics[role][key] = Math.max(0, Math.min(100, newState.metrics[role][key] + value));
      }
    });
  });
  newState.timestamp = new Date().toISOString();
  return newState;
}

// GET /api/scenarios — list all scenarios
router.get('/', (req, res) => {
  const summary = scenariosData.scenarios.map(({ id, title, outcome, description, steps }) => ({
    id, title, outcome, description, total_steps: steps.length,
  }));
  res.json(summary);
});

// GET /api/scenarios/:id — get full scenario with steps
router.get('/:id', (req, res) => {
  const scenario = scenariosData.scenarios.find(s => s.id === req.params.id);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });
  res.json(scenario);
});

// POST /api/scenarios/:id/start — create a new flow pre-loaded for this scenario
router.post('/:id/start', async (req, res) => {
  const scenario = scenariosData.scenarios.find(s => s.id === req.params.id);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deactivate all active flows
    await client.query('UPDATE flows SET is_active = false, updated_at = NOW() WHERE is_active = true');

    // Create new flow for this scenario
    const flowName = `${scenario.title} — ${new Date().toLocaleDateString()}`;
    const state = buildDefaultState();
    const flowResult = await client.query(
      'INSERT INTO flows (name, is_active, state) VALUES ($1, $2, $3) RETURNING *',
      [flowName, true, JSON.stringify(state)]
    );
    const flow = flowResult.rows[0];

    await client.query('COMMIT');
    res.status(201).json({ flow, scenario });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// POST /api/scenarios/:id/step — apply the next step of a scenario to a flow
router.post('/:id/step', async (req, res) => {
  const { flow_id, step_index } = req.body;
  if (flow_id === undefined || step_index === undefined) {
    return res.status(400).json({ error: 'flow_id and step_index are required' });
  }

  const scenario = scenariosData.scenarios.find(s => s.id === req.params.id);
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  const step = scenario.steps[step_index];
  if (!step) return res.status(400).json({ error: 'Step index out of range' });

  const decision = decisionsData.decisions.find(d => d.id === step.decision_id);
  const option = decision?.options.find(o => o.id === step.option_id);
  if (!decision || !option) return res.status(404).json({ error: 'Decision or option not found' });

  const client = await pool.connect();
  try {
    const flowResult = await client.query('SELECT * FROM flows WHERE id = $1', [flow_id]);
    if (flowResult.rows.length === 0) return res.status(404).json({ error: 'Flow not found' });

    const flow = flowResult.rows[0];
    const newState = applyDecisionToState(flow.state, step.decision_id, step.option_id);

    await client.query('BEGIN');
    await client.query(
      'UPDATE flows SET state = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(newState), flow_id]
    );
    await client.query(
      'INSERT INTO flow_decisions (flow_id, decision_id, option_id, role_impacts) VALUES ($1, $2, $3, $4)',
      [flow_id, step.decision_id, step.option_id, JSON.stringify(option.role_impacts)]
    );
    await client.query('COMMIT');

    res.json({
      state: newState,
      step,
      role_impacts: option.role_impacts,
      is_last: step_index === scenario.steps.length - 1,
    });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
