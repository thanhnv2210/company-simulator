root/
├── frontend/                        ← React + Vite app
│   ├── src/
│   │   ├── data/                    ← JSON config copies (roles, decisions, workflows, state)
│   │   ├── state/
│   │   │   └── engine.js            ← in-memory state engine
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   └── MetricBar.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RoleExplorer.jsx
│   │   │   ├── WorkflowVisualizer.jsx
│   │   │   └── DecisionPlayground.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── config/                          ← source of truth for JSON data
│   ├── roles.json
│   ├── decisions.json
│   ├── workflows.json
│   ├── stateSchema.json
│   └── historyTracking.json
├── backend/                         ← optional, Phase 2
├── docs/
│   ├── architecture-decisions/
│   ├── product-decisions/
│   └── PendingDecisions.md
└── .devcontainer/                   ← GitHub Codespaces config (pending)