# Permanent Development Rules — Campus Navigator

## 1. Core Engineering & Architecture Rules

* **Rule 1 — Do Not Break Existing Functionality**: Every new module or feature must pass baseline tests before integration. Do not break working map rendering or graph traversal.
* **Rule 2 — Strict Data Integrity (No Invented Campus Data)**: Do not invent room numbers, elevator locations, floor plans, or accessibility attributes. Unconfirmed details must be explicitly tagged as `UNVERIFIED` or `TO BE VERIFIED`.
* **Rule 3 — Data & UI Separation**: Campus graph data (nodes, edges, building schemas) must remain cleanly decoupled from React/Leaflet presentation code. UI components should receive routing output strictly via defined API interfaces.
* **Rule 4 — Routing Engine Isolation**: Pathfinding algorithms (A*, Dijkstra) must be written in pure, decoupled modules separate from map rendering hooks or component lifecycle states.
* **Rule 5 — Avoid Feature Creep**: Do not introduce non-core features (e.g. AI chatbots, social feeds, gamification) that do not directly address Problem Statement 19.

---

## 2. Product & UI/UX Guidelines

* **Rule 6 — Navigation-First UI**: Do not transform the project into a cluttered administrative college dashboard. The map viewport and search/navigation control bar must remain the core UI focus.
* **Rule 7 — Clean & Accessible Interface**: Contrast ratios, font scaling, and interactive controls must adhere to WCAG accessibility guidelines.
* **Rule 8 — Responsive Design Requirements**: Mobile, tablet, and desktop views must be explicitly planned and tested (e.g., collapsible bottom sheets on mobile, persistent control sidebars on desktop).
* **Rule 9 — First-Class Accessibility Routing**: Accessible routing mode must be fully functional and distinct from shortest-path routing, explicitly bypassing staircases.

---

## 3. Workflow & Maintenance Constraints

* **Rule 10 — Dependency Minimalization**: Do not install heavy or unnecessary third-party npm packages without documented justification. Prefer lightweight, standard web utilities.
* **Rule 11 — Incremental Refactoring Only**: Avoid rewriting entire components or structural files without clear diagnostic justification or team alignment.
* **Rule 12 — Synchronized Documentation**: All six foundational markdown files (`PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, `TASKS.md`, `MEMORY.md`) must be updated whenever major structural or architectural decisions occur.
* **Rule 13 — Direct Alignment with Problem Statement 19**: Every pull request, module, and feature must explicitly demonstrate how it solves campus room/lab wayfinding.
* **Rule 14 — Strict MVP Priority**: Advanced/future features (QR codes, timetable import, AR) must not be started before the core MVP (search, graph, A* routing, map visualization) is 100% complete and verified.
