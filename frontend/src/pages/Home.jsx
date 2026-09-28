import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { Icon } from '../components/Icons.jsx';
import { useStore } from '../state/store.jsx';
import { stats } from '../lib/engine.js';
import { NODES } from '../lib/seed.js';

export default function Home() {
  const { state } = useStore();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const mapRef = useRef(null);
  const [focusId, setFocusId] = useState(params.get('focus') || null);
  const [showAlert, setShowAlert] = useState(true);
  const [activeLayer, setActiveLayer] = useState('passability');

  useEffect(() => {
    const f = params.get('focus');
    if (f) { setFocusId(f); setParams({}, { replace: true }); }
  }, [params, setParams]);

  const s = useMemo(() => stats(state), [state]);

  const focus = (id) => setFocusId(id);

  return (
    <div className="mobile-app-shell">
      {/* Critical Transit Alert Banner (from Mockup Image 2) */}
      {showAlert && (
        <div className="transit-alert-banner">
          <div className="transit-alert-content">
            <Icon name="warn" size={16} color="#ffffff" />
            <div>
              <span className="transit-alert-title">CRITICAL TRANSIT ALERT</span>
              <span>NH-29 Kohima–Dimapur bypass blocked due to fresh landslide near Chumoukedima. All heavy freight diverted to NH-02.</span>
            </div>
          </div>
          <button
            type="button"
            className="transit-alert-dismiss"
            onClick={() => setShowAlert(false)}
            aria-label="Dismiss Alert"
          >
            <Icon name="x" size={15} />
          </button>
        </div>
      )}

      <div className="mobile-home-stage">
        {/* Origin -> Destination Quick Status Card */}
        <div className="mobile-route-header-card">
          <div className="mobile-route-left">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e6f4f6', color: '#0c4a4f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="truck" size={17} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="mobile-route-title">Guwahati &rarr; Imphal</span>
                <span className="mobile-route-badge">NH-27/02</span>
              </div>
              <div className="mobile-route-sub">
                <Icon name="clock" size={12} />
                <span>14h 20m</span>
                <span>&bull;</span>
                <span style={{ color: '#059669', fontWeight: 700 }}>92% Clear</span>
              </div>
            </div>
          </div>
          <button type="button" className="lang-selector-btn" style={{ padding: '6px' }} onClick={() => navigate('/planner')}>
            <Icon name="info" size={16} />
          </button>
        </div>

        {/* Live Map Stage */}
        <div className="mobile-map-container">
          <MapCanvas mode="segments" focusSegId={focusId} onSegClick={focus} mapRef={mapRef} />

          {/* Map Layer Controls */}
          <button
            type="button"
            className="mobile-map-layer-pill"
            onClick={() => setActiveLayer((l) => l === 'passability' ? 'weather' : 'passability')}
          >
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981' }} />
            <span>Layer: Road Passability</span>
          </button>

          <div className="mobile-map-trucks-pill">
            <Icon name="truck" size={13} color="#0c4a4f" />
            <span>128 Live Freight Trucks</span>
          </div>

          {/* Compass & Zoom HUD */}
          <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <button
              type="button"
              className="lang-selector-btn"
              style={{ width: '32px', height: '32px', borderRadius: '50%', padding: 0, justifyContent: 'center' }}
              title="Reset North"
              onClick={() => mapRef.current?.flyToBounds([[22.4, 87.7], [28.4, 95.9]], { padding: [26, 26] })}
            >
              <Icon name="compass" size={16} color="#0c4a4f" />
            </button>
          </div>

          <div style={{ position: 'absolute', right: '10px', bottom: '10px', zIndex: 400, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <button
              type="button"
              className="lang-selector-btn"
              style={{ width: '30px', height: '30px', borderRadius: '6px', padding: 0, justifyContent: 'center' }}
              onClick={() => mapRef.current?.zoomIn()}
            >
              <Icon name="plus" size={14} />
            </button>
            <button
              type="button"
              className="lang-selector-btn"
              style={{ width: '30px', height: '30px', borderRadius: '6px', padding: 0, justifyContent: 'center' }}
              onClick={() => mapRef.current?.zoomOut()}
            >
              <Icon name="minus" size={14} />
            </button>
          </div>
        </div>

        {/* Highway Status Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', fontSize: '11px', fontWeight: 700, color: '#475569', padding: '4px 0' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
            NH-27 Passable
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
            NH-06 Heavy Rain
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} />
            NH-29 Landslide
          </span>
        </div>

        {/* Highway Passability Card (Mockup Image 2) */}
        <div className="mobile-passability-card">
          <div className="passability-header-row">
            <div>
              <div className="passability-title">Highway Passability</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>Live telemetry updated 2m ago</div>
            </div>
            <div className="operational-rate-badge">
              <Icon name="check" size={13} color="#0d824d" />
              <span>84% Operational</span>
            </div>
          </div>

          <div className="passability-metrics-3col">
            <div className="p-metric-box safe">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="box-lbl">Safe</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              </div>
              <div className="box-num">{s.open * 2 + 10}</div>
              <div style={{ fontSize: '9.5px', color: '#047857' }}>&bull; Clear passage</div>
            </div>

            <div className="p-metric-box caution">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="box-lbl">Caution</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#f59e0b' }} />
              </div>
              <div className="box-num">{String(s.risky).padStart(2, '0')}</div>
              <div style={{ fontSize: '9.5px', color: '#b45309' }}>&bull; Rain / Slush</div>
            </div>

            <div className="p-metric-box blocked">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="box-lbl">Blocked</span>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
              </div>
              <div className="box-num">{String(s.blocked).padStart(2, '0')}</div>
              <div style={{ fontSize: '9.5px', color: '#b91c1c' }}>&bull; NH-29 &amp; Makru</div>
            </div>
          </div>

          <button
            type="button"
            className="fab-report-issue"
            onClick={() => navigate('/report')}
          >
            <Icon name="camera" size={17} color="#ffffff" />
            <span>Report Issue</span>
          </button>
        </div>

        {/* Freight Advisory Issued Card */}
        <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#093b40', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="swap" size={16} />
            </div>
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#1e1b4b' }}>Freight Advisory Issued (SDRF)</div>
              <div style={{ fontSize: '10.5px', color: '#475569' }}>Mandatory weight checks at Dimapur ch...</div>
            </div>
          </div>
          <button
            type="button"
            style={{ fontSize: '11.5px', fontWeight: 800, color: '#4338ca' }}
            onClick={() => navigate('/alerts')}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
