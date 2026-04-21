const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const defaultState = require('../data/stateSchema.json');
const decisionsData = require('../data/decisions.json');

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

// GET /api/flows — list all flows
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, is_active, created_at, updated_at FROM flows ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/flows/:id — get single flow with state and decision history
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const flowResult = await pool.query('SELECT * FROM flows WHERE id = $1', [id]);
    if (flowResult.rows.length === 0) return res.status(404).json({ error: 'Flow not found' });

    const decisionsResult = await pool.query(
      'SELECT * FROM flow_decisions WHERE flow_id = $1 ORDER BY applied_at ASC',
      [id]
    );

    const flow = flowResult.rows[0];
    flow.decisions = decisionsResult.rows;
    res.json(flow);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/flows — create a new flow
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    const flowName = name || `Flow ${new Date().toLocaleString()}`;
    const state = buildDefaultState();

    const result = await pool.query(
      'INSERT INTO flows (name, is_active, state) VALUES ($1, $2, $3) RETURNING *',
      [flowName, false, JSON.stringify(state)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/flows/reset — deactivate current active flow, create new active flow
router.post('/reset', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Deactivate all currently active flows
    await client.query(
      'UPDATE flows SET is_active = false, updated_at = NOW() WHERE is_active = true'
    );

    // Create new active flow
    const { name } = req.body;
    const flowName = name || `Flow ${new Date().toLocaleString()}`;
    const state = buildDefaultState();

    const result = await client.query(
      'INSERT INTO flows (name, is_active, state) VALUES ($1, $2, $3) RETURNING *',
      [flowName, true, JSON.stringify(state)]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PATCH /api/flows/:id/activate — activate a flow (deactivates all others)
router.patch('/:id/activate', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE flows SET is_active = false, updated_at = NOW()');
    const result = await client.query(
      'UPDATE flows SET is_active = true, updated_at = NOW() WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Flow not found' });
    }
    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

// PATCH /api/flows/:id/deactivate — deactivate a specific flow
router.patch('/:id/deactivate', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE flows SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Flow not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/flows/:id/decisions — apply a decision to a flow
router.post('/:id/decisions', async (req, res) => {
  const client = await pool.connect();
  try {
    const { decision_id, option_id } = req.body;
    if (!decision_id || !option_id) {
      return res.status(400).json({ error: 'decision_id and option_id are required' });
    }

    const flowResult = await client.query('SELECT * FROM flows WHERE id = $1', [req.params.id]);
    if (flowResult.rows.length === 0) return res.status(404).json({ error: 'Flow not found' });

    const flow = flowResult.rows[0];
    if (!flow.is_active) return res.status(403).json({ error: 'Cannot apply decisions to an inactive flow' });

    const decision = decisionsData.decisions.find(d => d.id === decision_id);
    if (!decision) return res.status(404).json({ error: 'Decision not found' });
    const option = decision.options.find(o => o.id === option_id);
    if (!option) return res.status(404).json({ error: 'Option not found' });

    await client.query('BEGIN');

    const newState = applyDecisionToState(flow.state, decision_id, option_id);
    await client.query(
      'UPDATE flows SET state = $1, updated_at = NOW() WHERE id = $2',
      [JSON.stringify(newState), flow.id]
    );

    const decisionRecord = await client.query(
      'INSERT INTO flow_decisions (flow_id, decision_id, option_id, role_impacts) VALUES ($1, $2, $3, $4) RETURNING *',
      [flow.id, decision_id, option_id, JSON.stringify(option.role_impacts)]
    );

    await client.query('COMMIT');
    res.json({ state: newState, decision: decisionRecord.rows[0] });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
