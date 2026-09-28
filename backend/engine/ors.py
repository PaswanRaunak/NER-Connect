"""OpenRouteService integration (free tier key, no card required).

When ORS_API_KEY is set, the fastest candidate is validated against the
real OSM road network: ORS plans a driving-hgv route between the origin
and destination nodes while AVOIDING polygons drawn around blocked
segments. That is the production hook for "avoid the risky corridor"
logic (PRD FR-3 / TC-03). Without a key the built-in risk-weighted graph
engine answers alone, so the demo never depends on network access.

Sign up: https://openrouteservice.org/dev/#/signup
"""

from __future__ import annotations

import json
import os
import urllib.request

ORS_URL = "https://api.openrouteservice.org/v2/directions/{profile}/geojson"
DEFAULT_PROFILE = "driving-hgv"
# ORS caps avoid-polygon area at 2.0E8 m^2 (200 km^2) TOTAL per request, so
# each blocked corridor gets a small ~40 km^2 box (±0.03 deg ≈ 6.5 km) around
# its midpoint, at most 4 boxes (≈160 km^2 worst case).
AVOID_BOX = 0.03
AVOID_MAX_BOXES = 4


def api_key() -> str:
    return os.environ.get("ORS_API_KEY", "").strip()


def profile() -> str:
    return os.environ.get("ORS_PROFILE", DEFAULT_PROFILE)


def avoid_polygons_from(segments: list[dict], nodes: dict) -> dict | None:
    """Build a GeoJSON MultiPolygon covering blocked corridors (small capped
    boxes so ORS accepts the request; see AVOID_BOX / AVOID_MAX_BOXES)."""
    blocked = sorted(
        (s for s in segments if s["status"] == "blocked"),
        key=lambda s: s["risk"], reverse=True,
    )[:AVOID_MAX_BOXES]
    if not blocked:
        return None
    rings = []
    for s in blocked:
        a, b = nodes[s["a"]], nodes[s["b"]]
        lat = (a["lat"] + b["lat"]) / 2
        lon = (a["lon"] + b["lon"]) / 2
        lat_lo, lat_hi = lat - AVOID_BOX, lat + AVOID_BOX
        lon_lo, lon_hi = lon - AVOID_BOX, lon + AVOID_BOX
        rings.append([[
            [lon_lo, lat_lo], [lon_hi, lat_lo], [lon_hi, lat_hi],
            [lon_lo, lat_hi], [lon_lo, lat_lo],
        ]])
    return {"type": "MultiPolygon", "coordinates": rings}


def fastest_route(origin_node: dict, dest_node: dict, segments: list[dict], nodes: dict) -> dict | None:
    """Return {km, hrs, geometry[[lat, lon]...]} for an ORS route that avoids
    blocked segments, or None when unavailable (no key, quota, network).

    ORS only allows avoid areas on routes up to ~150 km (straight-line), so
    long inter-state corridors are validated on the real network without
    avoidance; short district runs get the full blocked-area avoidance."""
    key = api_key()
    if not key:
        return None

    body = {
        "coordinates": [
            [origin_node["lon"], origin_node["lat"]],
            [dest_node["lon"], dest_node["lat"]],
        ],
        "instructions": False,
        "elevation": False,
    }

    import math

    dlat = dest_node["lat"] - origin_node["lat"]
    dlon = (dest_node["lon"] - origin_node["lon"]) * math.cos(math.radians((origin_node["lat"] + dest_node["lat"]) / 2))
    straight_km = math.hypot(dlat, dlon) * 111.32
    if straight_km <= 140:
        avoid = avoid_polygons_from(segments, nodes)
        if avoid:
            body["options"] = {"avoid_polygons": avoid}

    req = urllib.request.Request(
        ORS_URL.format(profile=profile()),
        data=json.dumps(body).encode("utf-8"),
        headers={"Authorization": key, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as res:
            data = json.loads(res.read().decode("utf-8"))
    except Exception as exc:
        if os.environ.get("ORS_DEBUG"):
            detail = ""
            if hasattr(exc, "read"):
                try:
                    detail = exc.read().decode("utf-8")[:300]
                except Exception:
                    pass
            print(f"[ors] fastest_route failed: {type(exc).__name__} {str(exc)[:120]} {detail}", flush=True)
        return None

    try:
        feature = data["features"][0]
        summary = feature["properties"]["summary"]
        coords = feature["geometry"]["coordinates"]
        # decimate for map rendering: a full ORS trace can carry >10k points
        if len(coords) > 500:
            step = max(1, len(coords) // 500)
            coords = coords[::step] + [coords[-1]]
        return {
            "km": round(summary["distance"] / 1000),
            "hrs": round(summary["duration"] / 3600, 1),
            "geometry": [[c[1], c[0]] for c in coords],  # GeoJSON lon,lat -> leaflet lat,lon
        }
    except (KeyError, IndexError, TypeError):
        return None
