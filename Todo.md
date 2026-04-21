# ✅ TODO

## Phase 1: Foundation

### Core Setup
- [x] Initialize repo
- [x] Define JSON config files (roles, decisions, workflows, state)
- [x] Setup frontend (React + Vite) — `frontend/`
- [x] Build state engine (`frontend/src/state/engine.js`)

---

### Data Modeling
- [x] Define Company schema (`config/stateSchema.json`)
- [x] Define Role schema (`config/roles.json`)
- [x] Define Workflow schema (`config/workflows.json`)
- [x] Define Decision schema (`config/decisions.json`)

---

### Features

#### Company Dashboard
- [x] Display role metric cards
- [x] Show live metrics with progress bars

#### Role Explorer
- [x] List all roles with tab selector
- [x] Show responsibilities, daily activities, KPIs per role

#### Workflow Visualizer
- [x] Render lifecycle steps with icons
- [x] Map roles to steps with color badges

#### Decision Playground
- [x] Implement all 5 decisions
- [x] Show per-role agreement scores after each decision
- [x] Apply impacts to live dashboard state

---

## Phase 2: Enhancement

### Backend (Node.js + PostgreSQL)
- [x] Setup Express API (`backend/src/index.js`)
- [x] PostgreSQL connection + schema migration (`flows`, `flow_decisions` tables)
- [x] `GET /api/flows` — list all flows
- [x] `GET /api/flows/:id` — get flow state + decision history
- [x] `POST /api/flows/reset` — deactivate active flow, create new active flow
- [x] `PATCH /api/flows/:id/activate` — switch active flow
- [x] `POST /api/flows/:id/decisions` — apply decision, persist state

### Frontend Updates
- [x] API client (`frontend/src/api/client.js`)
- [x] Flow selector component (active/inactive flows, view-only badge)
- [x] Reset button — deactivates current flow, creates new active flow
- [x] Decision Playground — disabled in view-only mode for inactive flows
- [x] App.jsx — loads flows from API on mount, orchestrates flow state

### Pending
- [ ] Add more decision scenarios (in backlog)
- [x] Decision history log / timeline view (`frontend/src/pages/DecisionHistory.jsx`)

---

## Phase 3: AI
- [ ] Add AI explanation for decisions
- [ ] Add role-based simulation
- [ ] Integrate LLM API