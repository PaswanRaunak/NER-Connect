/* Light-theme Leaflet canvas shared by citizen + console map surfaces.
   Corridors render with the IMD 4-tier colors from the design system.

   interactive:
     true     full mouse + touch control (console maps)
     "touch"  drag + pinch + double-tap, but NO wheel zoom so the map
              never hijacks page scroll on the mobile shells
     false    frozen backdrop (unused now, kept for completeness)

   Geo-anchored overlays (vehicle, pins) are Leaflet layers, so they track
   the road and stay glued to the map while panning/zooming. */
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { divIcon as lDivIcon, marker as lMarker } from 'leaflet';

const TIER_COLOR = { 1: '#2E8B57', 2: '#E8A317', 3: '#E8590C', 4: '#C0392B' };

function interactionProps(interactive) {
  if (interactive === 'touch') {
    return { dragging: true, touchZoom: true, doubleClickZoom: true, scrollWheelZoom: false, boxZoom: false, keyboard: false };
  }
  if (interactive) {
    return { dragging: true, touchZoom: true, doubleClickZoom: true, scrollWheelZoom: true, boxZoom: true, keyboard: true };
  }
  return { dragging: false, touchZoom: false, doubleClickZoom: false, scrollWheelZoom: false, boxZoom: false, keyboard: false };
}

function Fitter({ bounds }) {
  const map = useMap();
  useEffect(() => {
    const fit = () => { if (bounds) map.fitBounds(bounds, { padding: [16, 16] }); };
    fit();
    const t = setTimeout(() => { map.invalidateSize(); fit(); }, 350);
    return () => clearTimeout(t);
  }, [map, bounds]);
  return null;
}

function Resizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 250);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

/* GPS / asset pin with the designed pulse halo + permanent label. */
function GeoPin({ lat, lon, label }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const icon = lDivIcon({
      className: '',
      html: `<div class="geo-pin"><span class="geo-halo"></span><span class="geo-dot"></span></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
    const marker = lMarker([lat, lon], { icon, interactive: false, zIndexOffset: 300 }).addTo(map);
    marker.bindTooltip(label, { permanent: true, direction: 'bottom', offset: [0, 10], className: 'ner-tip lb-pin' });
    return () => { map.removeLayer(marker); };
  }, [map, lat, lon, label]);
  return null;
}

/* corridors: [{ points: [[lat,lon],[lat,lon]], tier, color, label }] */
/* markers:  [{ lat, lon, tier, label, note, always }] */
/* pins:     [{ lat, lon, label }] - GPS-style pulse pins */
export function MapCanvas({ center = [26.2, 91.8], zoom = 7, corridors = [], markers = [], pins = [], vehicle = null, bounds, interactive = true, className = '' }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      minZoom={4}
      maxZoom={12}
      zoomControl={false}
      attributionControl
      className={`w-full h-full ${className}`}
      style={{ background: '#dbe6f2' }}
      {...interactionProps(interactive)}
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      <Resizer />
      <Fitter bounds={bounds} />
      {pins.map((p, i) => <GeoPin key={i} lat={p.lat} lon={p.lon} label={p.label} />)}
      {corridors.map((c, i) => (
        <Polyline key={i} positions={c.points} pathOptions={{ color: c.color ?? TIER_COLOR[c.tier] ?? TIER_COLOR[1], weight: 5, opacity: 0.9 }}>
          {c.label && <Tooltip sticky className="ner-tip">{c.label}</Tooltip>}
        </Polyline>
      ))}
      {markers.map((m, i) => (
        <CircleMarker
          key={i}
          center={[m.lat, m.lon]}
          radius={m.tier === 4 ? 9 : 7}
          pathOptions={{ color: '#ffffff', weight: 2.5, fillColor: TIER_COLOR[m.tier] ?? TIER_COLOR[1], fillOpacity: 1 }}
        >
          <Tooltip direction="top" offset={[0, -6]} className="ner-tip" permanent={m.always}>
            <strong>{m.label}</strong>
            {m.note && <><br />{m.note}</>}
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
