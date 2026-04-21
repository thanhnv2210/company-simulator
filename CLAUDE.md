# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Engineer Company Simulator** — an interactive app helping software engineers understand how a small company operates by simulating roles, workflows, and decision-making. The goal is to prepare engineers for leadership and solution architect roles by letting them experience business trade-offs (speed vs. quality, hiring decisions, prioritization).

## Current State

**Phase 2 is complete.** Backend API is live, flows persist to PostgreSQL, scenarios and history are fully implemented.

- `config/` — JSON source of truth for all domain data
- `frontend/` — React + Vite app → `cd frontend && npm run dev` (port 5183)
- `backend/` — Node.js + Express API → `cd backend && npm start` (port 3010)
- Database: PostgreSQL at `localhost:54320`, database `company_simulator`
- To set up DB from scratch: `cd backend && npm run migrate`

## Architecture

### Core Design Principle: JSON-driven (ADR-001)
All domain data (roles, workflows, decisions) lives in JSON config files — no hardcoded logic. This keeps the system flexible and AI-ready for Phase 3.

### Domain Model
- **Company**: size, stage, budget, team[]
- **Role**: name, responsibilities[], metrics[]
- **Workflow**: steps[], role_mapping
- **Decision**: title, options[], impacts[]

### Data Flow
```
User Action (UI)
→ api.applyDecision(flowId, decisionId, optionId)   [or scenario step]
→ backend looks up role_impacts in decisions.json
→ applies deltas to flow.state in PostgreSQL (metrics clamped 0–100)
→ persists to flow_decisions with quarter-aware timestamp
→ returns new state → React re-renders Dashboard
```

### Scenario timestamp logic
Each scenario step maps to a calendar quarter. `stepTimestamp(flow.created_at, stepIndex)` adds `stepIndex × 3 months` so the history timeline reads as a real 2-year journey (Q1 Year 1 → Q4 Year 2).

### Key files
- `backend/src/routes/flows.js` — flow CRUD and free-play decision endpoints
- `backend/src/routes/scenarios.js` — scenario list, start, and step-apply with quarter timestamps
- `backend/src/db/migrate.js` — creates `flows` and `flow_decisions` tables
- `config/scenarios.json` — source of truth for all 4 scenarios (copy to `backend/src/data/` and `frontend/src/data/` when updated)
- `frontend/src/api/client.js` — all API calls
- `frontend/src/components/FlowSelector.jsx` — active/inactive flow switcher + reset button
- `frontend/src/pages/ScenarioPlayer.jsx` — step-by-step guided walkthrough with market impact text
- `frontend/src/pages/DecisionHistory.jsx` — expandable timeline of all decisions in a flow
- `frontend/src/pages/DecisionPlayground.jsx` — free-play decisions, disabled in view-only mode
- `frontend/src/state/engine.js` — `getDecisions()` still used for local decision list; state is owned by backend

### Tech Stack
- **Frontend**: React + Vite (port 5183)
- **Backend**: Node.js + Express (port 3010)
- **Database**: PostgreSQL (port 54320, db `company_simulator`)
- **Data**: JSON config files in `config/` — source of truth, copied to `backend/src/data/` and `frontend/src/data/`

### Development Phases
1. **Phase 1 ✅**: Non-AI, frontend-only — React + Vite, JSON-driven, in-memory state, all 4 core views
2. **Phase 2 ✅**: Node.js backend, PostgreSQL persistence, flow management, decision history, 4 guided scenarios
3. **Phase 3**: AI-powered decision assistant, role simulation ("Act as CTO"), personalized recommendations

## Key Constraints (PDR-001)
- Model a small SaaS company (<15 people)
- Non-AI simulation for MVP — avoid overengineering before the domain model is validated
- Success = personal daily usage + decision exploration frequency

## Documentation Layout
- `Strategy.md` — product strategy and phased roadmap
- `SystemStructure.md` — domain model and data flow
- `Discussion.md` — open design questions and trade-offs
- `Todo.md` — task backlog
- `docs/architecture-decisions/` — ADRs
- `docs/product-decisions/` — PDRs
- `docs/PendingDecisions.md` — deferred technical decisions, resolve when implementation requires them
