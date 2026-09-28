"""Bhuvan (ISRO/NRSC) terrain data provider.

Bhuvan supplies landslide-vulnerability zones, LULC and terrain slope
through its WMS/WPS services and thematic APIs. The prediction service
consumes two products from it (TDD section 2, PRD section 8):

  1. terrain slope per road segment        -> feeds score_segment()
  2. landslide vulnerability zone polygons -> feeds base risk priors

The frontend renders the same source as an optional WMS overlay on the
Gov heatmap (set VITE_BHUVAN_WMS_URL / VITE_BHUVAN_WMS_LAYERS).

This module defines the provider interface the prototype runs against.
For the hackathon demo the factors come from the packaged dataset; wire
`terrain_factor()` to Bhuvan's WPS/thematic endpoint in production:

    GET https://bhuvan-app1.nrsc.gov.in/api/... (token required)
    WMS: https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms  (thematic layers)
"""

from __future__ import annotations

# Static per-terrain slope priors (degrees) derived from the packaged
# demo dataset until live Bhuvan sampling is enabled.
TERRAIN_SLOPE = {
    "Plains": 3.5,
    "Riverbank": 5.0,
    "Riverine": 2.5,
    "Plateau": 9.0,
    "Plateau/Hilly": 14.0,
    "Hilly": 24.0,
    "Garo hills": 22.0,
    "Barail hills": 31.0,
    "Ghat section": 33.0,
    "Ridge road": 36.0,
    "North-bank": 4.0,
    "Himalayan": 42.0,
    "Riverine/Hilly": 26.0,
    "Corridor": 12.0,
}


def terrain_factor(terrain: str) -> float:
    """Slope in degrees for a terrain class (Bhuvan-derived in production)."""
    return TERRAIN_SLOPE.get(terrain, 15.0)


def wms_config() -> dict:
    """WMS endpoint details used by the map overlay and docs."""
    return {
        "url": "https://bhuvan-vec2.nrsc.gov.in/bhuvan/wms",
        "example_layers": "bhuvan:Landslide_Vulnerability",
        "note": "Thematic WMS layers are publicly viewable; API products need an NRSC token.",
    }
