# 🏗️ ADR-001: JSON-driven Architecture

## Context
We need a flexible system to model company structure and decisions.

## Decision
Use JSON as the primary data source for:
- Roles
- Workflows
- Decisions

## Rationale
- Easy to modify
- No heavy backend logic
- AI-ready (can feed into LLM later)

## Consequences
+ High flexibility
+ Fast iteration
- Limited validation at runtime