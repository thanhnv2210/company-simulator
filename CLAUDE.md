# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Engineer Company Simulator** — an interactive app helping software engineers understand how a small company operates by simulating roles, workflows, and decision-making. The goal is to prepare engineers for leadership and solution architect roles by letting them experience business trade-offs (speed vs. quality, hiring decisions, prioritization).

## Current State

**Phase 2 is in progress.** Backend API is live, flows are persisted to PostgreSQL.

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
→ engine.applyDecision(decisionId, optionId)
→ look up role_impacts in decisions.json
→ apply deltas to in-memory state (metrics clamped 0–100)
→ append to state.history
→ React re-renders Dashboard with new state
```

### Key files
- `backend/src/routes/flows.js` — all API endpoints, decision logic, state mutation
- `backend/src/db/migrate.js` — creates `flows` and `flow_decisions` tables
- `frontend/src/api/client.js` — all API calls (listFlows, applyDecision, resetFlow, etc.)
- `frontend/src/components/FlowSelector.jsx` — active/inactive flow switcher + reset button
- `frontend/src/state/engine.js` — `getDecisions()` still used for local decision list; state is now owned by backend
- `frontend/src/pages/DecisionPlayground.jsx` — calls API, disabled in view-only mode
- `frontend/src/pages/Dashboard.jsx` — renders flow state from API

### Tech Stack (ADR-002)
- **Frontend**: React + Vite
- **State**: In-memory state engine (no backend for MVP)
- **Data**: JSON config files in `config/`
- **Backend**: Optional, introduced in Phase 2

### Development Phases
1. **Phase 1 (MVP)**: Non-AI, frontend-only — React + Vite, JSON-driven, in-memory state
2. **Phase 2**: State persistence, backend introduced, expanded decision scenarios
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
