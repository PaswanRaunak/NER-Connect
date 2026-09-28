/* ============================================================
   NER-Connect | MapCanvas.jsx
   Leaflet map over dark CARTO tiles. Renders:
   - color-coded NH segments (green open / amber risky / red blocked)
   - stylised state hulls, city nodes, hub labels
   - optional model heat grid (blurred pane) for the gov view
   - optional candidate-route overlays for the planner view
   Tiles fail gracefully: polylines remain legible on the dark base.
   ============================================================ */

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, WMSTileLayer, Polyline, CircleMarker, Polygon, Rectangle, Tooltip, Pane, useMap } from 'react-leaflet';
import { NODES, STATES } from '../lib/seed.js';
import { heatCells } from '../lib/engine.js';
import { useStore } from '../state/store.jsx';

// Optional ISRO Bhuvan terrain overlay (WMS). Configure via env:
//   VITE_BHUVAN_WMS_URL / VITE_BHUVAN_WMS_LAYERS
// When unset or unreachable, tiles simply do not render; the map stays usable.
const BHUVAN_WMS = import.meta.env.VITE_BHUVAN_WMS_URL || '';
const BHUVAN_LAYERS = import.meta.env.VITE_BHUVAN_WMS_LAYERS || 'bhuvan:Landslide_Vulnerability';

const STATUS_STYLE = {
  open:    { color: '#46d68c', weight: 3, dashArray: null },
  risky:   { color: '#f5b841', weight: 4, dashArray: null },
  blocked: { color: '#ff5f52', weight: 5, dashArray: '2 7' },
};

const PLAN_STYLE = {
  Recommended: { color: '#31d3c0', weight: 6, dashArray: null },
  Fastest:     { color: '#e9f1ef', weight: 3, dashArray: '1 7' },
  Safest:      { color: '#46d68c', weight: 3, dashArray: '6 6' },
};

const BAND_FILL = { sev: '#ff5f52', high: '#f5b841', mod: '#8fb956', low: '#3f8f7a' };

function FitAll() {
  const map = useMap();
  useEffect(() => {
    // Network-extent bounds (all monitored nodes) — chosen so the fit lands
    // on zoom 7 in the wide-but-short map stage instead of the coarse
    // region box, which caps out at zoom 6.
    const fit = () => map.fitBounds([[22.4, 87.7], [28.4, 95.9]], { padding: [26, 26] });
    fit();
    // when the map mounts before its flex container settles (direct URL
    // load on /gov), the first fit mis-measures; re-run after layout
    const t = setTimeout(() => { map.invalidateSize(); fit(); }, 400);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function FocusSeg({ segId, segments }) {
  const map = useMap();
  useEffect(() => {
    if (!segId || !map) return;
    const seg = segments.find((s) => s.id === segId);
    if (!seg || !NODES[seg.a] || !NODES[seg.b]) return;
    const a = NODES[seg.a]; const b = NODES[seg.b];
    map.flyToBounds([[a.lat, a.lon], [b.lat, b.lon]], { padding: [90, 90], duration: 0.9, maxZoom: 9 });
  }, [segId, map, segments]);
  return null;
}

function FitPlans({ plans }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !plans.length) return;
    const pts = plans.flatMap((p) => p.path.filter((k) => NODES[k]).map((k) => [NODES[k].lat, NODES[k].lon]));
    if (pts.length < 2) return;
    map.flyToBounds(pts, { padding: [42, 42], duration: 0.9, maxZoom: 9 });
  }, [map, plans]);
  return null;
}

function SegLines({ segments, selectedSegId, onSegClick }) {
  return (
    <>
      {segments.map((s) => {
        if (!NODES[s.a] || !NODES[s.b]) return null;
        const style = STATUS_STYLE[s.status] || STATUS_STYLE.open;
        const pos = [[NODES[s.a].lat, NODES[s.a].lon], [NODES[s.b].lat, NODES[s.b].lon]];
        return (
          <Polyline key={`c-${s.id}`} positions={pos}
            pathOptions={{ color: s.id === selectedSegId ? '#31d3c0' : '#06181d', weight: (style.weight || 3) + 4, opacity: s.id === selectedSegId ? 0.95 : 0.6, interactive: false }} />
        );
      })}
      {segments.map((s) => {
        if (!NODES[s.a] || !NODES[s.b]) return null;
        const style = STATUS_STYLE[s.status] || STATUS_STYLE.open;
        const pos = [[NODES[s.a].lat, NODES[s.a].lon], [NODES[s.b].lat, NODES[s.b].lon]];
        return (
          <Polyline key={s.id} positions={pos} pathOptions={{ ...style, opacity: 0.95 }}
            eventHandlers={{ click: () => onSegClick && onSegClick(s.id) }}>
            <Tooltip sticky className="seg-tip">
              <strong>{s.road}</strong> · {NODES[s.a]?.name || s.a} to {NODES[s.b]?.name || s.b}<br />
              STATUS {(s.status || 'open').toUpperCase()} · RISK {s.risk}%<br />
              {s.note}
            </Tooltip>
          </Polyline>
        );
      })}
    </>
  );
}

function HeatGrid({ segments, horizon }) {
  const cells = heatCells({ segments }, horizon);
  return (
    <Pane name="heatpane" style={{ filter: 'blur(7px)' }}>
      {cells.map((c, i) => (
        <Rectangle key={i}
          bounds={[[c.lat - 0.25, c.lon - 0.25], [c.lat + 0.25, c.lon + 0.25]]}
          pathOptions={{ fillColor: BAND_FILL[c.band], fillOpacity: 0.1 + c.i * 0.45, stroke: false, interactive: false }} />
      ))}
    </Pane>
  );
}

function Nodes({ labeled }) {
  const labelSet = new Set(labeled || ['guwahati']);
  return (
    <>
      {Object.entries(NODES).map(([key, n]) => (
        // key includes label state so react-leaflet remounts the marker and its
        // permanent tooltip when the labeled set changes (tooltip props are not dynamic)
        <CircleMarker key={`${key}-${labelSet.has(key) ? 'lb' : 'hover'}`} center={[n.lat, n.lon]} radius={n.hub ? 5.5 : 3.5}
          pathOptions={{ color: '#08181c', weight: 2, fillColor: n.hub ? '#31d3c0' : '#b9ccc9', fillOpacity: 1 }}>
          {labelSet.has(key)
            ? <Tooltip permanent direction="right" offset={[6, 0]} className="lb-city">{n.name.toUpperCase()}</Tooltip>
            : <Tooltip className="seg-tip">{n.name} · {n.state}</Tooltip>}
        </CircleMarker>
      ))}
    </>
  );
}

function StateHulls() {
  return (
    <>
      {STATES.map((st) => (
        <Polygon key={st.name} positions={st.pts.map(([lon, lat]) => [lat, lon])}
          pathOptions={{ color: '#2c525b', weight: 1, dashArray: '3 5', fillColor: '#0f2b32', fillOpacity: 0.5, interactive: false }} />
      ))}
      {STATES.map((st) => {
        const lat = st.pts.reduce((a, p) => a + p[1], 0) / st.pts.length;
        const lon = st.pts.reduce((a, p) => a + p[0], 0) / st.pts.length;
        return (
          <CircleMarker key={`lb-${st.name}`} center={[lat, lon]} radius={0.1} interactive={false}
            pathOptions={{ fillOpacity: 0 }}>
            <Tooltip permanent direction="center" className={`lb-state ${st.name === 'Sikkim' ? 'lb-state-sm' : ''}`}>{st.name.toUpperCase()}</Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

export function MapCanvas({ mode = 'segments', heatHorizon = 'live', plans = [], focusSegId = null, labeled = null, onSegClick = null, mapRef = null, className = '', bhuvan = false }) {
  const { state } = useStore();
  const segments = state.segments;

  return (
    <MapContainer center={[25.7, 92.6]} zoom={6} minZoom={5} maxZoom={11}
      zoomControl={false} className={`map-root ${className}`}
      maxBounds={[[15, 78], [36, 106]]} attributionControl
      ref={(m) => { if (mapRef) mapRef.current = m; if (m && typeof window !== 'undefined') window.__nerMap = m; }}>
      {/* OpenStreetMap standard tiles (free, no key). A CSS filter on the
          tile pane darkens them to match the control-room theme; the
          attribution link satisfies the OSM tile usage policy. */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19} />
      {bhuvan && BHUVAN_WMS && (
        <WMSTileLayer url={BHUVAN_WMS} layers={BHUVAN_LAYERS} format="image/png"
          transparent opacity={0.55} attribution="ISRO Bhuvan" />
      )}
      <FitAll />
      <FocusSeg segId={focusSegId} segments={segments} />
      {plans.length > 0 && <FitPlans plans={plans} />}
      <StateHulls />
      {mode === 'heat' && <HeatGrid segments={segments} horizon={heatHorizon} />}
      <SegLines segments={segments} selectedSegId={focusSegId} onSegClick={onSegClick} />
      <Nodes labeled={labeled} />
      {plans.map((p) => {
        // ORS-validated plans carry real road geometry; graph plans fall back
        // to straight node-to-node chains.
        const pos = Array.isArray(p.geometry) && p.geometry.length > 1
          ? p.geometry
          : p.path.map((k) => [NODES[k].lat, NODES[k].lon]);
        return (
          <React.Fragment key={p.kind}>
            {p.kind === 'Recommended' && (
              <Polyline positions={pos}
                pathOptions={{ color: '#06181d', weight: 10, opacity: 0.85, interactive: false }} />
            )}
            <Polyline positions={pos}
              pathOptions={{ ...PLAN_STYLE[p.kind], opacity: 0.95, interactive: false }} />
          </React.Fragment>
        );
      })}
    </MapContainer>
  );
}
