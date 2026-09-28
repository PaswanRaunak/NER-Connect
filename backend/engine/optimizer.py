"""NER-Connect route optimization engine.

Implements the TDD section 3.3 contract: modified Dijkstra where edge
weight = f(distance, risk score, cargo priority multiplier). Mirrors the
frontend fallback engine in engine.js so the demo works with or without
this backend; this service is authoritative when present.
"""

from __future__ import annotations

import json
import math
import random
import threading
import time
from pathlib import Path

DATA = json.loads((Path(__file__).resolve().parent.parent / "data" / "seed.json").read_text(encoding="utf-8"))
NODES = DATA["nodes"]
SEGMENTS_SEED = DATA["segments"]
SHIPMENTS_SEED = DATA["shipments"]
SEED_ALERTS = DATA["seedAlerts"]

CARGO_MULT = {"Medical": 2.0, "Food": 1.5, "Construction": 1.0, "General": 1.0}  # risk-aversion multiplier
_NODE_BY_NAME = {v["name"]: k for k, v in NODES.items()}

_HAZARDS = [
    ("Landslide", "debris runout across both lanes"),
    ("Flood", "water over carriageway, shoulder eroded"),
    ("Roadblock", "felled tree + protest blockade reported"),
    ("Bridge Damage", "approach slab cracked, load restriction feared"),
]


def _clone(x):
    return json.loads(json.dumps(x))


class AppState:
    """In-memory state store. Swap for PostGIS + Redis in production
    (see db/schema.sql and docker-compose.yml)."""

    def __init__(self):
        self.lock = threading.Lock()
        self.reset()

    def reset(self):
        now_ms = int(time.time() * 1000)
        self.segments = _clone(SEGMENTS_SEED)
        self.shipments = _clone(SHIPMENTS_SEED)
        self.reports: list[dict] = []
        self.alerts = []
        offsets = [34, 96, 141, 219, 302, 388, 512, 631]
        for i, a in enumerate(SEED_ALERTS):
            alert = _clone(a)
            alert["id"] = f"A-{1000 + i}"
            alert["ts"] = now_ms - offsets[i % len(offsets)] * 60_000
            alert["origin"] = "MODEL"
            self.alerts.append(alert)
        self.seq = 1
        self.recs = build_recs(self.segments, self.shipments)
    def snapshot(self) -> dict:
        return {
            "segments": self.segments,
            "alerts": self.alerts,
            "shipments": self.shipments,
            "reports": self.reports,
            "recs": self.recs,
            "model": DATA["model"],
        }


def _seg_hrs(s: dict) -> float:
    h = s["km"] / max(s["speed"], 1)
    return h + (0.35 * h if s["status"] == "risky" else 0.0)


def _enumerate_paths(segments: list[dict], src: str, dst: str, cap: int = 80) -> list[list[dict]]:
    """Depth-first enumeration of simple paths (small graph, hard caps keep
    it instant). Pruning: cumulative base hours and total path count."""
    adj: dict[str, list[tuple[str, dict]]] = {k: [] for k in NODES}
    for s in segments:
        adj[s["a"]].append((s["b"], s))
        adj[s["b"]].append((s["a"], s))

    results: list[list[dict]] = []
    stack: list[dict] = []
    on_path: set[str] = {src}

    def dfs(node: str, cost: float) -> None:
        if len(results) >= cap or cost > 40:
            return
        if node == dst:
            results.append(list(stack))
            return
        for nxt, seg in adj[node]:
            if nxt in on_path:
                continue
            w = seg["km"] / max(seg["speed"], 1)
            on_path.add(nxt)
            stack.append(seg)
            dfs(nxt, cost + w)
            stack.pop()
            on_path.discard(nxt)

    dfs(src, 0.0)
    return results


def _score(segs: list[dict], mult: float) -> dict:
    km = sum(s["km"] for s in segs)
    hrs = sum(_seg_hrs(s) for s in segs)
    risk_pct = round(sum(s["risk"] * s["km"] for s in segs) / km) if km else 0
    # balanced cost: hours + cargo-weighted risk hours (0.25 h per risk point)
    rec_cost = hrs + mult * 0.25 * risk_pct
    return {
        "km": km,
        "hrs": round(hrs, 1),
        "riskPct": risk_pct,
        "recCost": rec_cost,
        "segIds": [s["id"] for s in segs],
        "segs": [
            {"id": s["id"], "road": s["road"], "a": s["a"], "b": s["b"], "km": s["km"],
             "risk": s["risk"], "status": s["status"], "terrain": s["terrain"]}
            for s in segs
        ],
    }


def plan_routes(origin: str, dest: str, cargo: str) -> list[dict]:
    mult = CARGO_MULT.get(cargo, 1.0)
    chains = _enumerate_paths(STATE.segments, origin, dest)
    cands = [_score(c, mult) for c in chains]
    if not cands:
        return []

    best_rec = min(cands, key=lambda c: c["recCost"])
    best_time = min(cands, key=lambda c: c["hrs"])
    best_risk = min(cands, key=lambda c: c["riskPct"])

    used: list[list[str]] = []

    def pick(pref) -> dict | None:
        for c in sorted(cands, key=pref):
            if c["segIds"] in used:
                continue
            used.append(c["segIds"])
            return c
        return None

    recommended = pick(lambda c: c["recCost"])
    fastest = pick(lambda c: c["hrs"])
    safest = pick(lambda c: c["riskPct"])

    out = []
    for card, kind in ((recommended, "Recommended"), (fastest, "Fastest"), (safest, "Safest")):
        if not card:
            continue
        entry = {k: card[k] for k in ("km", "hrs", "riskPct", "segIds", "segs")}
        entry.update(
            kind=kind,
            path=_chain_to_nodes(STATE.segments, card["segIds"]),
            cargo=cargo,
            mult=mult,
            alsoFastest=card is best_time,
            alsoSafest=card is best_risk,
        )
        out.append(entry)
    return out


def _chain_to_nodes(segments: list[dict], seg_ids: list[str]) -> list[str]:
    by_id = {s["id"]: s for s in segments}
    path = [by_id[seg_ids[0]]["a"]]
    for sid in seg_ids:
        s = by_id[sid]
        path.append(s["b"] if path[-1] == s["a"] else s["a"])
    return path


def _affected(shipments: list[dict], seg: dict) -> list[dict]:
    out = []
    for sh in shipments:
        if sh["status"] == "DELIVERED":
            continue
        names = [NODES[v]["name"] for v in sh["via"]]
        if NODES[seg["a"]]["name"] in names and NODES[seg["b"]]["name"] in names:
            out.append(sh)
    return out


def build_recs(segments: list[dict], shipments: list[dict]) -> list[dict]:
    recs = []
    for seg in segments:
        if seg["status"] == "blocked":
            touched = _affected(shipments, seg)
            if touched:
                recs.append({
                    "id": f"R-{seg['id']}",
                    "sev": "CRITICAL",
                    "action": "REROUTE",
                    "title": f"Reroute {', '.join(t['id'] for t in touched)} off {seg['road']}",
                    "body": (f"{seg['road']} {NODES[seg['a']]['name']}-{NODES[seg['b']]['name']} is blocked "
                             f"({seg['note']}) {seg['risk']}% risk. Diversion via alternate corridor keeps "
                             f"{NODES[_NODE_BY_NAME[touched[0]['dest']]]['name']} delivery inside SLA."),
                    "shipments": [t["id"] for t in touched],
                })
            else:
                recs.append({
                    "id": f"R-{seg['id']}",
                    "sev": "WARNING",
                    "action": "MONITOR",
                    "title": f"Stage crew near {seg['road']} closure",
                    "body": (f"Blocked segment carries no live cargo. Pre-position earthmovers at the "
                             f"{NODES[seg['b']]['name']} end; clearance window improves after 48 h dry spell."),
                    "shipments": [],
                })
    for seg in segments:
        if seg["status"] == "risky" and seg["risk"] >= 55:
            touched = _affected(shipments, seg)
            if touched:
                recs.append({
                    "id": f"R-{seg['id']}",
                    "sev": "ADVISORY",
                    "action": "STAGE",
                    "title": f"Pre-stage fuel + convoy escort on {seg['road']}",
                    "body": (f"{seg['risk']}% model risk with {len(touched)} shipment(s) committed, including "
                             f"{touched[0]['id']} ({touched[0]['type'].lower()}). Rain band inbound within 24 h."),
                    "shipments": [t["id"] for t in touched],
                })
    return recs


STATE = AppState()  # noqa: E305  (must come after build_recs definition)


def inject_disruption() -> dict:
    st = STATE
    with st.lock:
        pool = [s for s in st.segments if s["status"] == "open" and s["risk"] >= 34]
        if not pool:
            pool = [s for s in st.segments if s["status"] == "open"]
        seg = random.choice(pool)
        htype, hdetail = random.choice(_HAZARDS)
        sev = "CRITICAL" if random.random() > 0.45 else "WARNING"

        seg["status"] = "blocked"
        seg["risk"] = min(98, max(seg["risk"], 86 if sev == "CRITICAL" else 72))
        seg["note"] = f"{htype}: {hdetail}. Field teams dispatched."
        seg["source"] = "Simulated event (demo)"

        touched = _affected(st.shipments, seg)
        for sh in touched:
            sh["status"] = "REROUTING"
            sh["etaHrs"] += random.randint(6, 14)
            sh["holdReason"] = f"{htype} on {seg['road']}"

        alert = {
            "id": f"A-{1000 + len(st.alerts) + st.seq}",
            "sev": sev,
            "title": f"{htype} closes {seg['road']} {NODES[seg['a']]['name']}-{NODES[seg['b']]['name']}",
            "body": (f"Injected demo event: {hdetail}. {len(touched)} shipment(s) flagged for reroute. "
                     f"Model risk for this segment jumped to {seg['risk']}%."),
            "route": seg["id"],
            "area": f"{NODES[seg['a']]['state']} / {seg['terrain']}",
            "ch": ["PUSH", "SMS"],
            "ts": int(time.time() * 1000),
            "origin": "SIM",
        }
        st.alerts.insert(0, alert)
        st.recs = build_recs(st.segments, st.shipments)
        st.seq += 1
        snap = st.snapshot()
        snap["lastEvent"] = {"seg": seg, "alert": alert, "touched": touched}
        return snap


def apply_report(seg_id: str, rtype: str, severity: int, note: str) -> dict:
    st = STATE
    with st.lock:
        seg = next((s for s in st.segments if s["id"] == seg_id), None)
        if seg is None:
            raise KeyError(seg_id)
        labels = {1: "minor", 2: "moderate", 3: "moderate", 4: "severe", 5: "catastrophic"}
        seg["risk"] = min(99, seg["risk"] + severity * 7)
        if severity >= 4 or seg["risk"] >= 85:
            seg["status"] = "blocked"
        elif seg["risk"] >= 45:
            seg["status"] = "risky"
        seg["note"] = f"Crowd report ({rtype.lower()}, {labels.get(severity, 'moderate')}): {note or 'no further detail'}."
        seg["source"] = "Crowd report + model v2.4.1"

        alert = {
            "id": f"A-{1000 + len(st.alerts) + st.seq}",
            "sev": "CRITICAL" if severity >= 4 else "WARNING",
            "title": f"{rtype} reported on {seg['road']} {NODES[seg['a']]['name']}-{NODES[seg['b']]['name']}",
            "body": (f"Citizen report, severity {severity}/5 ({labels.get(severity, 'moderate')}). "
                     f"Segment risk re-scored to {seg['risk']}% pending verification."),
            "route": seg["id"],
            "area": f"{NODES[seg['a']]['state']} / {seg['terrain']}",
            "ch": ["PUSH", "SMS"],
            "ts": int(time.time() * 1000),
            "origin": "CROWD",
        }
        st.alerts.insert(0, alert)
        st.reports.insert(0, {"segId": seg["id"], "type": rtype, "severity": severity, "ts": int(time.time() * 1000)})
        st.recs = build_recs(st.segments, st.shipments)
        st.seq += 1
        snap = st.snapshot()
        snap["lastReport"] = {"seg": seg, "alert": alert}
        return snap


def reroute_shipment(shipment_id: str) -> dict:
    st = STATE
    with st.lock:
        sh = next((s for s in st.shipments if s["id"] == shipment_id), None)
        if sh is None:
            raise KeyError(shipment_id)
        origin = _NODE_BY_NAME[sh["origin"]]
        dest = _NODE_BY_NAME[sh["dest"]]
        mult = CARGO_MULT.get(sh["type"], 1.0)
        cands = [_score(c, mult) for c in _enumerate_paths(st.segments, origin, dest)]
        if cands:
            best = min(cands, key=lambda c: c["recCost"])
            sh["via"] = _chain_to_nodes(st.segments, best["segIds"])
            sh["status"] = "REROUTED"
            sh.pop("holdReason", None)
        st.recs = [r for r in st.recs if shipment_id not in (r.get("shipments") or [])]
        return st.snapshot()
