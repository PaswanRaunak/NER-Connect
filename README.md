# NER-Connect: Logistics Intelligence for India's North Eastern Region

**NER-Connect** is an AI-driven multimodal logistics and corridor accessibility intelligence platform purpose-built for India's North Eastern Region (NER). It enables real-time highway passability monitoring, predictive risk scoring across landslide & flood zones, and autonomous cargo diversion for civil, defense, and emergency freight.

---

## Key Features

1. **GovOps & Defense Logistics Console** (`/gov`):
   - Real-time multimodal crisis grid with GSAT-7A & IMD satellite sync.
   - District-level passability tracking across all 8 Sister States.
   - Topographical risk heatmap with IMD rainfall doppler and soil saturation modeling.
   - AI Reroute Decision Engine for pre-emptive freight diversion.

2. **Mobile / Field Transit Telemetry** (`/`):
   - Highway operational meters, live convoy counters, and critical corridor alerts.
   - Interactive road passability maps with live GPS telemetry.

3. **Autonomous Route Optimization** (`/planner`):
   - Risk-weighted Dijkstra and road geometry routing.
   - Medical Relief priority protocols (cold-chain, oxygen, insulin).
   - Real-time detours via all-weather bypasses (e.g., Haflong bypass).

4. **4-Step Disruption Reporting & Verification** (`/report`):
   - Photographic evidence with AI rockfall & landslide density assessment.
   - Sub-meter incident telemetry and 4-tier classification (Landslide, Flash Flood, Roadblock, Structural).
   - Offline Hybrid Protocol (SMS gateway fallback to `56161` for mountain gorges).

---

## Project Architecture

```
NER-Connect/
├── backend/            # FastAPI Python intelligence service & risk engine
│   ├── engine/         # Modified Dijkstra routing, risk scoring, ORS integration
│   ├── data/           # Authoritative network nodes, segments & shipment seeds
│   ├── main.py         # REST API Gateway endpoints
│   └── requirements.txt
├── frontend/           # Vite + React 18 high-performance web console & mobile UI
│   ├── src/
│   │   ├── components/ # Leaflet map canvas, telemetry command bar, tactical icons
│   │   ├── pages/      # GovOps, Home, Planner, Report, Alerts
│   │   ├── state/      # Synchronized store with embedded fallback simulation
│   │   └── styles.css  # Modern telemetry control room design system
│   └── package.json
└── android/            # Native Android wrapper & offline pass configuration
```

---

## Quick Start

### 1. Backend Service (FastAPI)
```bash
cd backend
python -m venv .venv
# Activate virtual environment (.venv\Scripts\activate on Windows)
pip install -r requirements.txt
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Application (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## Security & Privacy
- Zero sensitive keys in source control.
- Configuration templates provided via `.env.example`.
