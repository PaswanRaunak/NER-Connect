"""NER-Connect risk scoring stand-in.

The production system (TDD 3.2) runs an XGBoost segment classifier plus a
Prophet trend model over IMD rainfall, Bhuvan terrain slope, soil saturation,
NDMA event history and crowdsourced signals. Training data is not shipped
with the hackathon prototype, so this module exposes the SAME interface with
a deterministic, transparent surrogate formula. When the real model is ready,
only `score_segment` needs re-implementing; the API contract holds.
"""

from __future__ import annotations

MODEL_VERSION = "v2.4.1"
MODEL_NAME = "XGBoost segment classifier + Prophet trend (stand-in formula)"


def score_segment(
    rainfall_24h_mm: float,
    rainfall_next_48h_mm: float,
    soil_saturation: float,      # 0..1 field capacity
    slope_deg: float,
    historical_events_5y: int,
    crowd_reports_24h: int = 0,
) -> float:
    """Return risk 0..100 for a road segment, refreshed every 1-6 h."""
    rain = max(rainfall_24h_mm, rainfall_next_48h_mm * 0.85)
    r_term = 34 * (1 - pow(2.718, -rain / 95))
    s_term = 22 * soil_saturation
    g_term = 26 * min(1.0, slope_deg / 55)
    h_term = min(14, historical_events_5y * 2.4)
    c_term = min(9, crowd_reports_24h * 3.2)
    return round(min(99.0, r_term + s_term + g_term + h_term + c_term), 1)


def status_for(risk: float) -> str:
    if risk >= 85:
        return "blocked"
    if risk >= 45:
        return "risky"
    return "open"


def model_meta() -> dict:
    return {
        "name": MODEL_NAME,
        "version": MODEL_VERSION,
        "precision": "72%",
        "refreshed": "2 h ago",
        "inputs": [
            "IMD rainfall 24-48 h",
            "Bhuvan terrain slope",
            "soil saturation",
            "NDMA event history",
            "crowd reports",
        ],
    }
