# Permanent Memory & Decisions — Campus Navigator

## Project Metadata
* **PROJECT**: Campus Navigator
* **PROBLEM STATEMENT**: #19 — Campus Navigator
* **PRIMARY PURPOSE**: Hyper-local, room-level campus wayfinding & navigation
* **PROTOTYPE CAMPUS**: CHARUSAT (Charotar University of Science and Technology)
* **INITIAL PROTOTYPE BUILDINGS**:
  * A5 — DEPSTAR
  * A6 — CSPIT
  * A7 — CSPIT

---

## Core Product Principles
1. **Room-Level Navigation Focus**: The system must solve navigation down to specific room numbers, corridors, and floor levels.
2. **First-Class Accessibility**: Accessible routing mode is an essential feature, ensuring step-free elevator/ramp routes.
3. **Graph-Based Routing**: All pathfinding relies strictly on spatial nodes and weighted edges using the A* algorithm.
4. **Decoupled Data Architecture**: Campus spatial datasets must be completely separated from UI rendering logic.
5. **No Invented Campus Data**: Unverified room locations, floor layouts, or stairs must be explicitly tagged as `UNVERIFIED` until physically confirmed.
6. **MVP Priority**: Implementation must follow a strict stage-by-stage progression before adding advanced features.
7. **Clean Navigation UI**: The UI must remain focused on map interaction and search rather than generic admin dashboards.
8. **User Problem Driven**: Every feature added must directly serve a practical wayfinding need.

---

## Key Technical & Design Decisions Log

### Decision 1: Foundation Document Architecture
* **Date**: 2026-10-01
* **Decision**: Created six dedicated foundation markdown files (`PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, `TASKS.md`, `MEMORY.md`) inside `docs/`.
* **Reason**: Establishes a permanent single source of truth for all requirements, graph schemas, coding standards, and tasks prior to writing code.

### Decision 2: Stack Selection for Prototype
* **Date**: 2026-10-01
* **Decision**: Selected React + Leaflet + OpenStreetMap + Custom Graph engine.
* **Reason**: Leaflet provides lightweight, performant map rendering; OpenStreetMap gives base outdoor tiles; React enables clean component state management for navigation UI.

### Decision 3: Pathfinding Algorithm Selection (A*)
* **Date**: 2026-10-01
* **Decision**: Use A* (A-Star) pathfinding with a spatial heuristic $h(n)$ incorporating latitude, longitude, and floor level elevation.
* **Reason**: Solves shortest-path routing efficiently while allowing edge filtering for step-free accessible modes.

### Decision 4: Polyline Coordinates & Refined Instruction Wording
* **Date**: 2026-10-01
* **Decision**:
  1. Added `polyline_coordinates: [[lat, lng], ...]` array to `POST /api/routes` response payloads for direct consumption by Leaflet `L.polyline()`.
  2. Refined turn-by-turn instruction generator to distinguish between `outdoor_path`, `entrance`, `corridor`, `ramp`, `stairs`, `elevator`, and arrival states.
  3. Audited and documented A* spatial Haversine heuristic + 10m/floor penalty assumption.
* **Reason**: Prepares backend API for seamless, stable integration with future React + Leaflet frontend.
