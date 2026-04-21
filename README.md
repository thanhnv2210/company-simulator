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

### Stack
- Frontend: React + Vite (port 5183)
- Backend: Node.js + Express (port 3010)
- Database: PostgreSQL (port 54320, database `company_simulator`)
- Data: JSON config files (`config/`) as source of truth

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

# setup & run backend (terminal 1)
cd backend
npm install
npm run migrate
npm start

# setup & run frontend (terminal 2)
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5183
- Backend API: http://localhost:3010

## 🛑 Stop Services

```bash
# stop frontend (find and kill the Vite dev server on port 5183)
lsof -ti :5183 | xargs kill -9

# stop backend (find and kill the Node.js server on port 3010)
lsof -ti :3010 | xargs kill -9

# stop PostgreSQL (if running via Docker)
docker stop <postgres-container-name>
```