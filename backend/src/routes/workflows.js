const express = require('express');
const router = express.Router();
const workflowsData = require('../data/workflows.json');

// GET /api/workflows — list all workflows
router.get('/', (req, res) => {
  res.json(workflowsData.workflows);
});

module.exports = router;
