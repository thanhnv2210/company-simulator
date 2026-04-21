const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const ai = require('../ai/index');
const decisionsData = require('../data/decisions.json');

// POST /api/ai/explain
// Body: { flow_id, decision_id, option_id, before_state }
router.post('/explain', async (req, res) => {
  const { flow_id, decision_id, option_id, before_state } = req.body;

  if (!flow_id || !decision_id || !option_id || !before_state) {
    return res.status(400).json({ error: 'flow_id, decision_id, option_id, and before_state are required' });
  }

  const decision = decisionsData.decisions.find(d => d.id === decision_id);
  const option = decision?.options.find(o => o.id === option_id);
  if (!decision || !option) {
    return res.status(404).json({ error: 'Decision or option not found' });
  }

  // Fetch current (after) state from DB
  const flowResult = await pool.query('SELECT state FROM flows WHERE id = $1', [flow_id]);
  if (flowResult.rows.length === 0) return res.status(404).json({ error: 'Flow not found' });
  const afterState = flowResult.rows[0].state;

  try {
    const explanation = await ai.run('decision-explainer', {
      company: afterState.company,
      decisionTitle: decision.title,
      optionLabel: option.label,
      roleImpacts: option.role_impacts,
      beforeMetrics: before_state.metrics,
      afterMetrics: afterState.metrics,
    });

    res.json({ explanation });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
