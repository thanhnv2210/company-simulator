root/
├── frontend/                        ← React + Vite (port 5183)
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js            ← all backend API calls
│   │   ├── data/                    ← copies of config/ JSON files
│   │   ├── state/
│   │   │   └── engine.js            ← getDecisions() for local lookup
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   ├── MetricBar.jsx
│   │   │   └── FlowSelector.jsx     ← active/inactive flow switcher + reset
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RoleExplorer.jsx
│   │   │   ├── WorkflowVisualizer.jsx
│   │   │   ├── DecisionPlayground.jsx
│   │   │   ├── DecisionHistory.jsx  ← expandable decision timeline
│   │   │   └── ScenarioPlayer.jsx   ← guided 2-year scenario walkthrough
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/                         ← Node.js + Express (port 3010)
│   ├── src/
│   │   ├── data/                    ← copies of config/ JSON files
│   │   ├── db/
│   │   │   ├── index.js             ← pg pool
│   │   │   └── migrate.js           ← creates flows + flow_decisions tables
│   │   ├── routes/
│   │   │   ├── flows.js             ← flow CRUD + free-play decisions
│   │   │   └── scenarios.js         ← scenario list, start, step-apply
│   │   └── index.js                 ← Express entry point
│   ├── .env
│   └── package.json
├── config/                          ← source of truth for all JSON data
│   ├── roles.json
│   ├── decisions.json
│   ├── workflows.json
│   ├── stateSchema.json
│   ├── historyTracking.json
│   └── scenarios.json               ← 4 guided scenarios (copy to backend + frontend data/)
├── docs/
│   ├── architecture-decisions/
│   ├── product-decisions/
│   └── PendingDecisions.md
├── .gitignore
└── .devcontainer/                   ← GitHub Codespaces config (pending)