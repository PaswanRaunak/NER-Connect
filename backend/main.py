"""NER-Connect API gateway (prototype service layer).

Endpoints mirror the TDD section 5 API table:
  GET  /api/network/status        live segment status + alerts + shipments
  POST /api/routes/optimize       risk-weighted route planning
  POST /api/reports               citizen disruption report ingest
  POST /api/simulate/disruption   demo: inject a severe event
  POST /api/simulate/reset        demo: back to baseline
  POST /api/shipments/{id}/reroute  apply an AI allocation suggestion

State is in-memory for the demo; swap AppState for PostGIS + Redis
per TDD section 2 (see db/schema.sql, docker-compose.yml).
"""

from __future__ import annotations

from dotenv import load_dotenv

load_dotenv()  # backend/.env — ORS_API_KEY etc.

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from engine import optimizer as opt
from engine import ors
from engine import risk

app = FastAPI(title="NER-Connect API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class OptimizeIn(BaseModel):
    origin: str
    dest: str
    cargo: str = "General"


class ReportIn(BaseModel):
    segId: str
    type: str
    severity: int
    note: str = ""


@app.get("/api/health")
def health():
    return {"ok": True, "service": "ner-connect", "model": risk.model_meta()}


@app.get("/api/network/status")
def network_status():
    return opt.STATE.snapshot()


@app.post("/api/routes/optimize")
def routes_optimize(body: OptimizeIn):
    if body.origin not in opt.NODES or body.dest not in opt.NODES:
        raise HTTPException(422, "origin/dest must be network node keys")
    if body.origin == body.dest:
        raise HTTPException(422, "origin and destination must differ")
    routes = opt.plan_routes(body.origin, body.dest, body.cargo)
    if not routes:
        raise HTTPException(503, "no corridor connects these nodes right now")
    # Optional real-network validation: when an OpenRouteService key is
    # configured, the fastest candidate is re-planned on OSM roads while
    # avoiding polygons around blocked segments. Graph engine stays the
    # source of truth for risk scoring.
    if ors.api_key() and routes:
        ors_hit = ors.fastest_route(opt.NODES[body.origin], opt.NODES[body.dest], opt.STATE.segments, opt.NODES)
        if ors_hit:
            target = next((r for r in routes if r["kind"] == "Fastest"), routes[0])
            target["km"] = ors_hit["km"]
            target["hrs"] = ors_hit["hrs"]
            target["geometry"] = ors_hit["geometry"]
            target["orsValidated"] = True
    return {"routes": routes}


@app.post("/api/reports")
def reports(body: ReportIn):
    if not 1 <= body.severity <= 5:
        raise HTTPException(422, "severity must be 1-5")
    try:
        return opt.apply_report(body.segId, body.type, body.severity, body.note)
    except KeyError:
        raise HTTPException(404, f"unknown segment {body.segId}") from None


@app.post("/api/simulate/disruption")
def simulate_disruption():
    return opt.inject_disruption()


@app.post("/api/simulate/reset")
def simulate_reset():
    opt.STATE.reset()
    return opt.STATE.snapshot()


@app.post("/api/shipments/{shipment_id}/reroute")
def shipment_reroute(shipment_id: str):
    try:
        return opt.reroute_shipment(shipment_id)
    except KeyError:
        raise HTTPException(404, f"unknown shipment {shipment_id}") from None
