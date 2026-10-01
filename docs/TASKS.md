# Project Roadmap & Implementation Tasks — Campus Navigator

## PHASE 0 — FOUNDATION (Current Phase)
- [x] Understand problem statement (#19 Campus Navigator)
- [x] Research campus navigation & indoor wayfinding domain
- [x] Research CHARUSAT prototype scope (A5 DEPSTAR, A6 CSPIT, A7 CSPIT)
- [x] Create project foundation documentation (`PRD.md`, `ARCHITECTURE.md`, `RULES.md`, `DESIGN.md`, `TASKS.md`, `MEMORY.md`)
- [x] Define MVP feature boundaries
- [x] Define data architecture & pathfinding graph models
- [x] Establish UI design guidelines & responsive strategies

---

## PHASE 1 — CAMPUS DATA & VERIFICATION SCHEMA
- [x] Establish initial static JSON dataset for CHARUSAT prototype
- [x] Define building node bounds for A5 (DEPSTAR)
- [x] Define building node bounds for A6 (CSPIT)
- [x] Define building node bounds for A7 (CSPIT)
- [x] Map initial ground floor entrance points & outdoor connecting pathways
- [x] Index floor plans & stair/elevator core locations for A5, A6, and A7
- [x] Add explicit metadata tags (`VERIFIED`, `UNVERIFIED`, `ASSUMPTION`) to all node & edge entities

---

## PHASE 2 — MAP VISUALIZATION ENGINE (FRONTEND)
- [ ] Set up Leaflet map instance centered over CHARUSAT coordinates
- [ ] Add OpenStreetMap outdoor base layer tiles
- [ ] Render building footprint polygons for A5, A6, and A7
- [ ] Implement interactive building click & selection handlers
- [ ] Add indoor floor plan switcher / overlay renderer

---

## PHASE 3 — SEARCH & DESTINATION SELECTION
- [x] Implement fuzzy search indexing across buildings, rooms, labs, and facilities (Backend API)
- [ ] Build search input UI component with instant dropdown recommendations (Frontend)
- [ ] Build Start Location selection picker (Frontend)
- [ ] Build Destination selection picker (Frontend)
- [x] Add visual badges indicating data verification status on search results API

---

## PHASE 4 — GRAPH CONSTRUCTION & ADJACENCY DATA
- [x] Implement Graph data structure (Nodes & Weighted Edges)
- [x] Connect outdoor campus walkways to building entrance nodes
- [x] Connect indoor corridor nodes to room & lab destination nodes
- [x] Implement multi-floor vertical edge connections (Stairs & Elevators)
- [x] Attach accessibility attributes (`accessible: boolean`, `has_stairs: boolean`) to all edges

---

## PHASE 5 — PATHFINDING ENGINE (A* ALGORITHM)
- [x] Implement core A* (A-Star) search algorithm in pure JavaScript module
- [x] Implement distance heuristic $h(n)$ incorporating lat/lng and floor elevation
- [x] Implement Shortest Path calculation mode
- [x] Benchmark pathfinding performance across complex multi-floor graph traversals
- [x] Unit test graph path calculation for edge cases (disconnected nodes, same-floor routing, multi-building routing)

---

## PHASE 6 — ACCESSIBLE ROUTING MODE
- [ ] Implement Accessible routing mode filter in A* pathfinder
- [ ] Configure engine to strictly bypass stair edges when Accessible mode is active
- [ ] Implement elevator & ramp priority scoring
- [ ] Add UI mode toggle (🚶 Shortest vs ♿ Accessible)
- [ ] Add clear route explanation badges (e.g. "Route adjusted to use Elevator 2 to bypass stairs")

---

## PHASE 7 — INDOOR WAYFINDING & STEP INSTRUCTIONS
- [ ] Implement turn-by-turn route instruction generator (e.g., "Walk 20m", "Turn Left", "Take Elevator to Floor 2")
- [ ] Implement floor transition visual indicators
- [ ] Render route polylines on Leaflet map (distinct styles for outdoor vs indoor segments)
- [ ] Build navigation progress drawer / step list UI component

---

## PHASE 8 — BACKEND COMPLETION & INTEGRATION PREPARATION
- [x] Enforce responsive API standards
- [x] Add loading indicators and error boundary HTTP status responses
- [x] Conduct end-to-end user workflow testing across prototype routes (A5 to A7 Room 638)
- [x] Validate physical verification checklist for CHARUSAT data
- [x] Prepare hackathon presentation demo flow and edge-case highlights
- [x] Complete destination catalog and prototype graph layer isolation (`destinations.json`, `demo_destinations.json`, `demo_edges.json`)
- [x] Complete frontend integration documentation (`FRONTEND_BACKEND_INTEGRATION.md`)
