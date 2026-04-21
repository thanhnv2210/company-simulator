# 🧠 Engineer Company Simulator

An interactive application that helps software engineers understand how a small company operates by simulating roles, workflows, and decision-making.

## 🚀 Vision
In the AI era, engineers can build entire products alone.  
But building a product is not the same as running a company.

This project helps engineers:
- Understand how a company works internally
- Experience decision-making across roles (CEO, CTO, PM, Engineer)
- Learn trade-offs between speed, cost, quality, and growth
- Prepare for leadership and solution architect roles

---

## 🎯 MVP Scope (Non-AI First)
- Model a small SaaS company (<15 people)
- Define roles and responsibilities
- Simulate workflows (idea → build → release → feedback)
- Provide a decision playground with trade-offs

---

## 🧩 Core Features

### 1. Company Dashboard
- Team structure
- Current state (workload, backlog, basic metrics)

### 2. Role Explorer
- Responsibilities
- Daily activities
- KPIs per role

### 3. Workflow Visualizer
- End-to-end product lifecycle
- Role involvement per stage

### 4. Decision Playground
- Simulate decisions like:
  - Hiring
  - Prioritization
  - Trade-offs (speed vs quality)

---

## 🪶 Tech Stack & Architecture

This project is designed to run instantly in GitHub Codespaces with minimal setup.

### Principles
- No heavy backend required for MVP
- JSON-driven simulation engine
- Frontend-first architecture

### Stack
- Frontend: React + Vite
- State: Local JSON + in-memory state engine
- Data: JSON config files (roles, decisions, workflows)
- Backend: Optional (introduced in Phase 2)

### Run in Codespaces
```bash
npm install
npm run dev
```

---

## 🔮 Future (AI Integration)
- AI-powered decision assistant
- Role simulation (e.g. “Act as CTO”)
- Personalized recommendations
- Context-aware suggestions based on real developer data

---

## 📌 Why this project?
This is not just a tool.  
It’s a **thinking framework** for engineers who want to:
- Become Tech Leads / Architects
- Understand business trade-offs
- Build products, not just features

---

## 📂 Documentation
- [Strategy](./Strategy.md)
- [Structure](./Structure.md)
- [Todo](./Todo.md)
- [Discussions](./Discussion.md)
- [ADR](./adr)

---

## ⚡ Getting Started
```bash
# clone repo
git clone <repo-url>

# install dependencies
# (to be defined)

# run app
# (to be defined)