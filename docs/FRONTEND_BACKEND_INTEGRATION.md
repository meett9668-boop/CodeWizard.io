# Frontend & Backend API Integration Guide — Campus Navigator

This document serves as the official integration guide for connecting the **React + Leaflet Frontend** to the **Express.js Backend REST API** for **Campus Navigator (Hackathon Problem Statement #19)**.

---

## 1. Backend Startup & Base URL

* **Development Command**: `npm run dev` (runs on `http://localhost:5000`)
* **Production / Start Command**: `npm start`
* **Base API Endpoint**: `http://localhost:5000/api`
* **CORS Policy**: Configured to allow `http://localhost:3000` (React) and `http://localhost:5173` (Vite) out of the box.

---

## 2. Complete API Endpoint Reference

### 2.1 Health Checks
- **`GET /health`** or **`GET /api/health`**
- **Response**:
```json
{ "status": "ok" }
```

---

### 2.2 Campus & Building Information
- **`GET /api/campuses/charusat`**: Returns CHARUSAT campus metadata.
- **`GET /api/campuses/charusat/buildings`**: Returns list of focus buildings (A5 DEPSTAR, A6 CSPIT Block 1, A7 CSPIT Block 2).
- **`GET /api/buildings/:id`**: Returns specific building details by code (`A5`, `A6`, `A7`) or ID.

---

### 2.3 Search & Location Lookup
- **`GET /api/locations/search?q=638`**
- **Supported Queries**: Building codes (`A5`, `A7`), room numbers (`638`, `501`), lab names (`DBMS`, `AI`), facilities (`Auditorium`, `Seminar Hall`).
- **Response Example**:
```json
{
  "success": true,
  "count": 1,
  "locations": [
    {
      "id": "dest_a7_r638",
      "node_id": "node_a7_f2_r638",
      "name": "Room 638 - Advanced Computing Lab",
      "display_name": "Room 638 - Advanced Computing Lab",
      "room_number": "638",
      "building_code": "A7",
      "building_name": "CSPIT Block 2",
      "floor": 2,
      "type": "lab",
      "verification_status": "SOURCE_VERIFIED",
      "data_status": "VERIFIED",
      "is_navigable": true
    }
  ]
}
```

---

### 2.4 Current Location Resolution
- **`GET /api/locations/nearest?lat=22.5995&lng=72.8205`**
- **Response Example**:
```json
{
  "success": true,
  "nearest_node": {
    "id": "node_ext_a6_entrance",
    "name": "CSPIT Block 1 Main Entrance (A6)",
    "coordinates": { "lat": 22.5996, "lng": 72.8206 }
  },
  "building": { "id": "bldg_a6", "code": "A6", "name": "CSPIT - Block 1" },
  "floor": 0,
  "distance_meters": 14.2
}
```

---

### 2.5 Route Calculation API
- **`POST /api/routes`**
- **Request Body**:
```json
{
  "from": "node_ext_main_gate",
  "to": "dest_a7_r638",
  "mode": "ACCESSIBLE" // "SHORTEST" or "ACCESSIBLE"
}
```

- **Response Example**:
```json
{
  "success": true,
  "route": {
    "mode": "ACCESSIBLE",
    "distance_meters": 243,
    "estimated_time_minutes": 2.9,
    "polyline_coordinates": [
      [22.5988, 72.8195],
      [22.5996, 72.8206],
      [22.5998, 72.8209],
      [22.59982, 72.82092],
      [22.59984, 72.82094],
      [22.59984, 72.82094],
      [22.59989, 72.82098],
      [22.59995, 72.82105]
    ],
    "origin": {
      "id": "node_ext_main_gate",
      "name": "Main Campus Entrance Gate",
      "floor": 0
    },
    "destination": {
      "id": "node_a7_f2_r638",
      "name": "Room 638 - Advanced Computing Lab",
      "building_id": "bldg_a7",
      "floor": 2
    },
    "data_quality": {
      "verified_segments": 2,
      "unverified_segments": 5,
      "demo_segments": 0,
      "is_demo_route": false
    },
    "floor_transitions": [
      {
        "from_floor": 0,
        "to_floor": 2,
        "transition_type": "elevator",
        "node_id": "node_a7_f0_elevator"
      }
    ],
    "instructions": [
      "Walk 120m along the outdoor path toward CSPIT Block 1 Main Entrance (A6).",
      "Walk 40m along the outdoor path toward CSPIT Block 2 Entrance (A7).",
      "Enter A7 Ground Lobby through the entrance.",
      "Continue 10m along the corridor toward A7 Main Elevator (Ground).",
      "Take the elevator to Floor 2.",
      "Continue 15m along the corridor toward A7 Floor 2 Corridor B.",
      "Continue 18m along the corridor to destination: Room 638 - Advanced Computing Lab.",
      "You have arrived at Room 638 - Advanced Computing Lab."
    ]
  }
}
```

---

## 3. Leaflet Polyline Integration Example

```javascript
// Drawing calculated route directly on Leaflet map
const renderRouteOnMap = (routePayload, mapInstance) => {
  if (!routePayload || !routePayload.polyline_coordinates) return;

  // Pass polyline_coordinates directly to L.polyline
  const routePolyline = L.polyline(routePayload.polyline_coordinates, {
    color: routePayload.mode === 'ACCESSIBLE' ? '#10B981' : '#4F46E5', // Emerald for Accessible, Indigo for Shortest
    weight: 5,
    opacity: 0.8,
    dashArray: routePayload.data_quality.is_demo_route ? '8, 8' : null // Dashed line for prototype demo routes
  }).addTo(mapInstance);

  // Zoom map to fit route bounds
  mapInstance.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
};
```

---

## 4. Frontend UI Display Guidelines

1. **Floor Transitions**: Render interactive badge indicators whenever `floor_transitions` is non-empty (e.g., `🛗 Take Elevator to Floor 2`).
2. **Demo & Data Quality Badges**:
   - If `route.data_quality.is_demo_route === true`, display a subtle badge: `"Prototype Route — Indoor map unverified"`.
   - If `location.data_status === 'DEMO_ONLY'`, display `"Unverified Position"`.
3. **Routing Mode Toggle**: Provide a clean UI switch between `Shortest (🚶)` and `Accessible (♿)`.
