# 🏗️ ADR-002: Lightweight Frontend-First Architecture

## Context
We want fast development, easy sharing, and compatibility with GitHub Codespaces.

## Decision
Use a frontend-first architecture:
- React + Vite
- JSON-driven data
- In-memory state engine
- No backend for MVP

## Rationale
- Zero setup complexity
- Instant run in browser
- Focus on product logic

## Consequences
+ Fast iteration
+ Easy onboarding
- No persistence
- Limited scalability (temporary)