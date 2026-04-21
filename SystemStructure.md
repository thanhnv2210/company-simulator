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

## 2. Data Flow

User → Select Role / Decision  
→ System loads JSON config  
→ Apply rules  
→ Return updated state  

---

## 3. Key Design Choice
- JSON-driven system (no hardcoding logic)
- Easily extendable for AI later

---

## 4. Future Extension
- Replace rule engine with AI reasoning
- Add real-time data ingestion (GitHub, Jira)