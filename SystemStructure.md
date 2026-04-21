# 🏗️ System Structure

## 1. Domain Model

### Company
- size
- stage
- budget
- team[]

### Role
- name
- responsibilities[]
- metrics[]

### Workflow
- steps[]
- role_mapping

### Decision
- title
- options[]
- impacts[]

---

## 2. Data Flow (MVP)

User Action (UI)
→ Load JSON config
→ Apply decision (in-memory)
→ Update state
→ Re-render UI

---

## 3. Key Design Choice
- JSON-driven system (no hardcoding logic)
- Easily extendable for AI later

---

## 4. Future Extension
- Replace rule engine with AI reasoning
- Add real-time data ingestion (GitHub, Jira)

---

## 5. Runtime Architecture (MVP)

```
Browser
├── JSON Data (roles, decisions, workflows)
├── State Engine (in-memory)
└── UI Components (React)
```

No backend required in initial phase.