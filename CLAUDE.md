# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Engineer Company Simulator** — an interactive app helping software engineers understand how a small company operates by simulating roles, workflows, and decision-making. The goal is to prepare engineers for leadership and solution architect roles by letting them experience business trade-offs (speed vs. quality, hiring decisions, prioritization).

## Current State

This repository is in the **planning/design phase**. No implementation exists yet — only documentation, architectural decisions, and JSON config files in `config/`.

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
User → Select Role/Decision → Load JSON config → Apply rules → Return updated state
```

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
