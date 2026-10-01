# Campus Navigator — Backend Service

## Problem Statement #19 — Campus Navigator
> Help students find rooms and labs, with optional shortest-route and accessible-route modes.

This folder contains the **backend REST API service** for Campus Navigator. It handles location lookup, campus spatial data schemas, graph network representation, and pathfinding routing engines.

---

## Technology Stack
* **Language**: Node.js / JavaScript (ES6+)
* **Framework**: Express.js
* **Middleware**: CORS, dotenv

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` if local customization is required:
```bash
PORT=5000
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

---

## Running the Backend

### Development Mode (Auto-reload with nodemon)
```bash
npm run dev
```

### Production / Standard Mode
```bash
npm start
```

---

## Health Check API

To verify that the backend server is running and accessible:

* **Endpoint**: `GET /api/health`
* **URL**: `http://localhost:5000/api/health`
* **Response**:
```json
{
  "success": true,
  "message": "Campus Navigator backend is running"
}
```

---

## Planned Architecture (Future Phases)

As development progresses, the backend will incorporate:

```text
Campus Spatial Data (JSON Schema)
         ↓
Graph Adjacency Engine (Nodes & Weighted Edges)
         ↓
A* Pathfinding Algorithm (Shortest & Accessible Modes)
         ↓
Route & Turn-by-Turn Instruction Generator
         ↓
REST API Endpoints (Routes / Controllers / Services)
```
