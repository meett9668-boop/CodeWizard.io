# UI/UX Design Specification — Campus Navigator

## 1. Design Philosophy & Core Principles

> **"Modern navigation application, not a generic college dashboard."**

* **Clean & Focused**: The interactive map consumes the majority of the screen space.
* **Search-Driven**: Users start with a prominent search input: *"Where do you want to go?"*.
* **Mobile-First & Context-Aware**: Mobile users interact via touch-friendly bottom sheets; desktop users utilize a sleek sidebar panel.
* **Visual Clarity & Accessibility**: High contrast, crisp iconography for indoor transitions (elevators, stairs, ramps), and distinct color coding for Shortest vs. Accessible routes.

---

## 2. Interface Layout & Components

### 2.1 Main Search & Destination Interface
```text
┌────────────────────────────────────────────────────────┐
│  🔍 Search rooms, labs, buildings... (e.g. Room 638)   │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  📍 Use Current Location  │  🏢 Pick on Campus Map     │
└────────────────────────────────────────────────────────┘
┌───────────────────────────┬────────────────────────────┐
│  🚶 Shortest Route        │  ♿ Accessible Route      │
└───────────────────────────┴────────────────────────────┘
```

### 2.2 Route View & Step Instructions
```text
┌────────────────────────────────────────────────────────┐
│  FROM: Ground Entrance (A7 Building)                   │
│  TO:   Room 638 (Floor 2, A7 Building)                 │
├────────────────────────────────────────────────────────┤
│  Mode: ♿ Accessible Route  │  Distance: 140 m (~2 min) │
├────────────────────────────────────────────────────────┤
│                                                        │
│                  MAP VIEW (LEAFLET)                    │
│             [ Interactive Outdoor &                    │
│               Indoor Path Polylines ]                  │
│                                                        │
├────────────────────────────────────────────────────────┤
│  Current Step:                                         │
│  🛗 Take Elevator near Main Lobby to Floor 2           │
├────────────────────────────────────────────────────────┤
│  [ ▶ START NAVIGATION ]  [ 📋 VIEW ALL STEPS ]        │
└────────────────────────────────────────────────────────┘
```

---

## 3. Responsive Adaptations

| Platform | Screen Layout | Control Interaction | Map Visibility |
| :--- | :--- | :--- | :--- |
| **Desktop** | Fixed left sidebar (380px wide) + Fullscreen Map | Sidebar search & step list | 100% height, remaining width |
| **Tablet** | Floating search card + Collapsible side drawer | Top search bar with overlay modal | Fullscreen background |
| **Mobile** | Fullscreen Map + Bottom Sheet overlay | Swipeable bottom sheet (Collapsed / Peek / Expanded) | 100% view with bottom padding |

---

## 4. Visual Tokens & Design System

* **Primary Colors**: Deep Navy `#0F172A` (Header/Text), Slate `#64748B` (Secondary text).
* **Accent Colors**: Electric Indigo `#4F46E5` (Active Route / Primary Buttons), Emerald `#10B981` (Accessible Mode / Success).
* **Alert & Unverified Tags**: Amber `#F59E0B` (Unverified data badge / Caution).
* **Typography**: Clean Sans-Serif font hierarchy (Inter / Outfit / Roboto).
* **Icons**: Feather Icons / Lucide Icons (`MapPin`, `Navigation`, `Search`, `Accessibility`, `ArrowRight`, `CornerUpRight`, `Elevator`, `Stairs`).
