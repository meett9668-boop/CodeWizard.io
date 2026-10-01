# Product Requirements Document (PRD) — Campus Navigator

## 1. Project Name
**Campus Navigator**

## 2. Problem Statement
**Hackathon Problem Statement #19 — Campus Navigator**
> "Help students find rooms and labs, with optional shortest-route and accessible-route modes."

## 3. Problem Deep-Dive
Navigating a large university campus like CHARUSAT presents significant challenges for students, faculty, and visitors. While standard mapping solutions (such as Google Maps or Apple Maps) can route a user to a general campus location or building envelope, they fail at the indoor and hyper-local level.

When a student has a class in "Room 638", they face multiple unanswered questions:
* Which building contains Room 638? (e.g., A5 DEPSTAR vs. A6/A7 CSPIT)
* Which entrance should they use to minimize walking?
* Which floor is the room on?
* Which corridor leads to the room?
* Where are the nearest staircases or elevators?
* Which route is the shortest vs. accessible (step-free for wheelchair users or mobility impairments)?
* How long will it take to walk there?

Without room-level navigation, students waste time, miss classes, or face mobility barriers.

## 4. Product Vision
> **"Google Maps can help you reach the campus. Campus Navigator helps you reach the exact room."**

Campus Navigator is a room-level, graph-powered campus wayfinding system. It seamlessly bridges outdoor campus navigation and indoor multi-floor building navigation, providing step-by-step guidance tailored to user preferences (Shortest Route vs. Accessible Route).

## 5. Target Users
1. **Current & New Students**: Quickly locate classrooms, laboratories, and faculty cabins without relying on physical inquiry.
2. **Visitors & Guest Faculty**: Navigate unfamiliar buildings and multi-wing layouts with ease.
3. **Students & Visitors with Mobility Needs**: Find guaranteed step-free routes, leveraging elevators and ramps while avoiding stairs.
4. **Campus Administrators & Facilities**: Maintain and update spatial node/edge data to reflect real-world campus accessibility and layout.

## 6. Core User Journey
```text
Open Website
     ↓
Search Destination (Room / Lab / Building / Facility)
     ↓
Select Destination Node
     ↓
Select Starting Location (Current Pin / Entrance / Room)
     ↓
Select Route Preference Mode (🚶 Shortest vs ♿ Accessible)
     ↓
Calculate Route (A* Pathfinding on Campus Graph)
     ↓
Display Interactive Route (Map + Outdoor/Indoor Step Instructions)
     ↓
Navigate to Destination
```

## 7. Minimum Viable Product (MVP) Scope
* **Interactive Campus Map**: Leaflet & OpenStreetMap rendering focused on CHARUSAT prototype area (A5 DEPSTAR, A6 CSPIT, A7 CSPIT).
* **Multi-Category Search**: Instant search indexing Buildings, Floors, Rooms, Labs, and Key Facilities (Restrooms, Entrances).
* **Location Pickers**: Ability to set Start Location and Destination from search or interactive map clicks.
* **Dual Routing Modes**:
  * **Shortest Route (🚶)**: Optimized purely for path distance/time across corridors, stairs, and walkways.
  * **Accessible Route (♿)**: Guaranteed step-free path preferring ramps and elevators, explicitly ignoring stair edges.
* **Indoor Multi-Floor Navigation**: Clear floor transitions (e.g., Ground Floor Entrance → Elevator → 2nd Floor Corridor → Room 638).
* **Turn-by-Turn Route Instructions**: Textual step breakdown with icon indicators (turn left, take elevator to floor 2, enter room).
* **Data Verification Indicators**: Visual badges or metadata clearly indicating whether room layout data is physically verified or unverified.

## 8. Future Features (Post-MVP Backlog)
* **QR Code Quick-Start**: Scanning physical QR codes posted at building entrances/corridors to instantly set "Start Location".
* **Schedule & Timetable Integration**: Importing student schedules to automatically generate "Next Class" route cards.
* **Dynamic Path Closures**: Real-time administrative toggling of blocked corridors or out-of-order elevators.
* **Crowd & Weather-Aware Routing**: Preferring covered walkways during rain or less congested corridors during peak hall times.
* **Voice & AR Navigation**: Audio-guided turn prompts and augmented reality visual overlays.
* **Community Issue Reporting**: Student reports for broken elevators or locked access gates.

## 9. Success Criteria for Demo
1. **Functional Graph-Based Pathfinding**: Demonstrate A* routing accurately navigating between outdoor campus paths and indoor multi-floor rooms.
2. **Distinct Mode Switching**: Prove that selecting "Accessible Mode" reroutes around staircases using elevators/ramps, whereas "Shortest Mode" takes stairs if faster.
3. **Multi-Building Support**: Successfully query and route between A5 (DEPSTAR), A6 (CSPIT), and A7 (CSPIT).
4. **Intuitive UI/UX**: Clean, responsive layout where map rendering and navigation instructions remain synchronized.
