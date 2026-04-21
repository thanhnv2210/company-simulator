# 🕐 Pending Decisions

Decisions deferred until implementation requires them. Each item includes the context and options so it can be resolved quickly when the time comes.

---

## PD-001: History Storage Strategy

**Context:**
`stateSchema.json` has a `"history": []` field. `historyTracking.json` also exists as a separate append-only log. Both serve the same purpose.

**Options:**
- **A) Embedded** — Keep history inside `stateSchema.json` only. Single source of truth, simpler reads.
- **B) Separate file** — Keep `historyTracking.json` as a standalone log. Easier to extend for replay, undo, or audit features.

**Resolve when:** Implementing the decision history/audit trail in the Decision Playground.

---

## PD-002: Metric Naming Convention

**Context:**
Original `stateSchema.json` used category-based keys (`customer_satisfaction`, `system_stability`, `tech_debt`). After restructuring to role-based metrics, some legacy names may still appear in comments or older docs.

**Options:**
- **A) Role-scoped keys** (current) — e.g. `pm.user_satisfaction`, `cto.tech_debt_level`. Clear ownership, matches role model.
- **B) Global flat keys** — e.g. `user_satisfaction`, `tech_debt_level`. Simpler state engine lookups.

**Resolve when:** Building the state engine that reads and applies `role_impacts` from `decisions.json`.

---

## PD-003: Agreement Score Display

**Context:**
Each decision option now includes a per-role `agreement` score (0–100). It is not yet defined how this is surfaced in the UI.

**Options:**
- **A) Show per-role reaction** — Display each role's agreement when a decision is made (e.g. "CTO: 90% agrees, Sales: 35% agrees").
- **B) Show consensus score** — Aggregate into a single weighted team consensus score.
- **C) Both** — Show consensus prominently, with per-role breakdown on expand.

**Resolve when:** Designing the Decision Playground UI.
