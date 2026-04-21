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
- [ ] Add state persistence
- [ ] Add more decision scenarios
- [ ] Improve UI/UX

---

## Phase 3: AI
- [ ] Add AI explanation for decisions
- [ ] Add role-based simulation
- [ ] Integrate LLM API