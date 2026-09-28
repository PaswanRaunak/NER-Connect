# NER-Connect — Working Web App Prototype

AI-powered logistics and road-accessibility platform for North East India,
built for **MDoNER (Ministry of Development of North Eastern Region)**.

This prototype faithfully implements the 15 Stitch-designed screens in
`../design-reference/` as a real, clickable React application — every screen
is componentized, routed, and wired end-to-end with mock data (no backend
required).

## Run it

```bash
cd prototype
npm install
npm run dev          # http://localhost:5174
```

Production build: `npm run build && npm run preview`.

## Screen map (design → route)

| # | Stitch screen | Route |
|---|---|---|
| 1 | Public Portal / Operational Overview | `/portal` |
| 2 | Citizen & Official Login | `/login` |
| 3 | Secure OTP Verification | `/otp` |
| 4 | Onboarding / Language Selection | `/onboarding` |
| 5 | Citizen Home (Live Corridor Status) | `/citizen` |
| 6 | Citizen Safe Route Planner | `/citizen/route` |
| 7 | Report Hazard / Disruption | `/citizen/report` |
| 8 | Live Shipment / Convoy Tracking | `/citizen/tracking` |
| 9 | Offline Mode / Emergency Transit Pass | `/citizen/offline-pass` |
| 10 | Regional Operations Command Center | `/console` |
| 11 | District Detail (Pakyong, East Sikkim) | `/console/district` |
| 12 | Analytics & Impact Dashboard | `/console/analytics` |
| 13 | Admin Field-Report Moderation Console | `/console/moderation` |
| 14 | Digital Transit Permits / E-Pass | `/console/permits` |
| 15 | Official Emblem / brand asset | `/brand` (emblem also lives at `src/assets/emblem.svg`) |

## Wired flows (all clickable end-to-end)

- **Portal → Console:** "Access Dispatch Console" and the top nav open the
  Operations Center; "Citizen Transit Advisory & Reporting" starts login.
- **Login → OTP → Onboarding → Citizen app:** pick a clearance identity
  (Citizen / Transporter / Govt Official — Official switches to NIC email
  mode), any 10-digit mobile, any 6-digit OTP, choose language + district.
  Transporter role gets the transporter tab bar (Home / Routes / Offline
  Pass / Tracking).
- **Report → moderation pipeline:** file a hazard report (photo tile, GPS
  chainage, 2×2 classification grid, 3-step IMD severity, voice note). The
  confirmation screen summarizes the dispatch, and returning to Citizen Home
  shows your report live in the advisory card with a FILED tag — while the
  same incident appears in `/console/moderation` as a fresh queue entry
  (dispatch it, request a second photo, or reject it; every action logs to
  the Incident Controller Log).
- **Route planner:** Siliguri → Gangtok on NH-10 with the IMD-colored
  corridor, animated vehicle marker, priority pills; selecting **Medical /
  Life-Critical** reveals the Green Corridor escort banner, and **Start Safe
  Navigation** locks the route with a confirmation toast.
- **Tracking → permits:** convoy MED-0982 telemetry, chainage milestones,
  cryo card; the offline pass counts down live, fires the NavIC beacon
  sequence, and its QR is the offline credential. On `/console/permits` you
  can issue an emergency pass (it appears in the roster + inspector), open
  QR modals, and grant green-corridor escorts.

## Stack & design fidelity

- **React 18 + Vite + Tailwind CSS v4**, tokens ported 1:1 from the design
  system (`DESIGN.md` + the reference Tailwind config): every color role
  (`primary #002b2f`, `primary-container #004349`, IMD 4-tier matrix, …),
  the Inter-only type scale (display → label-sm, telemetry-num with
  tabular numerals), spacing tokens, 10px cards / 8px controls / pill
  badges, and the three elevation levels.
- **Material Symbols Outlined** icon font + **Inter**, exactly as in the
  references.
- **Leaflet + OpenStreetMap** powers the five live map surfaces (citizen
  home, route planner, tracking, command center GIS, district tactical map)
  with IMD-tier corridor polylines and incident markers — the interactive
  stand-in for the reference map imagery.
- Shared kit: `Btn`, `Card` (Level 1/2/3 elevations), `StatusPill` (IMD
  tiers with color-blind-safe indicator dots), `PhotoEvidence` (offline-safe
  forensic photo placeholder), `Emblem`, `MobileShell` (phone-canvas citizen
  app), `ConsoleShell` (288px fixed sidebar + twin top bars), `Toast`.
- Charts (correlation, before/after AI lines, donut, topo profile) are the
  reference inline SVGs; the QR block is the designed vector module art.

## Notes

- All data is mocked in `src/lib/data.js` + `src/state/store.jsx`; figures
  mirror the reference screens (412 shipments, MED-0982, #EP-8841-SIK, …).
- Prototype OTP: any 6 digits verify. No real SMS/network calls are made.
- **Live routing (optional):** with the FastAPI backend running and
  `ORS_API_KEY` set in `backend/.env` (OpenRouteService free key), the Route
  Planner replaces the designed corridor with the **real NH-10 road geometry**
  — distance/ETA come from the live network and the "NH-10 LIVE · ORS ROAD
  NETWORK" pill appears. Blocked segments become avoid-polygons on short
  runs (ORS caps avoid areas at 200 km² and 150 km routes). Without the
  backend the planner silently falls back to the designed corridor.
- The earlier experimental build (`../frontend/`, dark tactical theme) is
  kept for reference; this `prototype/` app is the current deliverable
  matching the Stitch designs.
- Browser-tested evidence lives in `../gui-test-screenshots/` (portal, auth
  flow, citizen loop, all five consoles, mobile layouts, ORS live route).
