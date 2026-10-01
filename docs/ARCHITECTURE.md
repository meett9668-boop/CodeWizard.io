# Technical Architecture — Campus Navigator

## 1. High-Level Architecture Overview

```text
                 FUTURE FRONTEND (React + Leaflet)
                               │
                               │ HTTP / REST API
                               ▼
                        BACKEND API LAYER
                 (Express.js Routes & Controllers)
                               │
          ┌────────────────────┼───────────────────┐
          ▼                    ▼                   ▼
     Location Service    Routing Service   Navigation Service
          │                    │                   │
          └────────────────────┼───────────────────┘
                               ▼
                        CAMPUS GRAPH (A*)
             (In-memory Weighted Adjacency Structure)
                               │
                               ▼
                       CAMPUS SPATIAL DATA
        (Decoupled JSON Schemas: Buildings/Nodes/Edges)
```

---

## 2. Component Responsibilities

### 2.1 Frontend & Visualization Layer
* **Map Renderer (Leaflet / OpenStreetMap)**: Renders outdoor tile layers for CHARUSAT along with custom GeoJSON/SVG floor overlays for indoor plans.
* **Search & Filter Component**: Instant client-side fuzzy searching across building names, floor numbers, room IDs, and lab designations.
* **Navigation Overlay Panel**: Displays active route summary (distance, estimated time, step-by-step instructions, floor transitions).

### 2.2 Routing Engine & Algorithm
* **Pathfinding Algorithm**: A* (A-Star) search algorithm operating on the Campus Graph.
* **Cost Evaluation & Modes**:
  * **Shortest Mode**: Calculates edge weight $g(n)$ based on physical distance or average walking time.
  * **Accessible Mode**: Filters out edges tagged as `has_stairs: true` or `accessible: false`, relying strictly on elevators, ramps, and step-free corridors.
* **Heuristic Function $h(n)$**: Euclidean distance or Manhattan distance between node coordinates $(x, y, z)$.

### 2.3 Campus Graph Data Model

#### Node Schema (Locations)
A Node represents a discrete point on campus (outdoor or indoor).
```json
{
  "id": "node_a7_f2_r638",
  "building_id": "A7",
  "floor": 2,
  "name": "Room 638",
  "type": "room", // room | lab | entrance | elevator | stairs | corridor_junction | outdoor_gate
  "coordinates": {
    "lat": 22.5995,
    "lng": 72.8205,
    "floor_z": 2
  },
  "is_accessible": true,
  "verification_status": "UNVERIFIED" // VERIFIED | UNVERIFIED | ASSUMPTION
}
```

#### Edge Schema (Connections)
An Edge represents traversable paths between two nodes.
```json
{
  "id": "edge_a7_f2_corr_to_r638",
  "source": "node_a7_f2_j2",
  "target": "node_a7_f2_r638",
  "distance_meters": 12.5,
  "edge_type": "corridor", // corridor | stairs | elevator | ramp | outdoor_path
  "accessible": true,
  "is_bidirectional": true,
  "verification_status": "UNVERIFIED"
}
```

---

## 3. Pathfinding Algorithm Details: A* (A-Star)

### Mathematical Formulation
A* evaluates nodes using the objective function:

$$f(n) = g(n) + h(n)$$

Where:
* **$n$**: The current node under evaluation.
* **$g(n)$**: The exact cost (distance/time) of the path from the starting node to node $n$.
* **$h(n)$**: The estimated heuristic cost from node $n$ to the goal node.
* **$f(n)$**: The total estimated cost of the lowest-cost path through node $n$.

### Heuristic Function Formula
For spatial campus routing across lat/lng coordinates and vertical floor heights $z$:

$$h(n) = \sqrt{(\text{lat}_n - \text{lat}_{\text{goal}})^2 + (\text{lng}_n - \text{lng}_{\text{goal}})^2} + \left| z_n - z_{\text{goal}} \right| \times w_{\text{floor penalty}}$$

### Accessible Route Logic
During edge expansion in A*:
1. If routing mode is set to **`ACCESSIBLE`**, any edge where `edge.accessible === false` or `edge.edge_type === 'stairs'` is immediately excluded from neighbor expansion.
2. Elevators and ramps are assigned lower accessible cost penalties to prefer smooth step-free transitions.
