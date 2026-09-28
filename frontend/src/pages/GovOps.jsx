import React, { useMemo, useRef, useState } from 'react';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { Icon } from '../components/Icons.jsx';
import { useStore } from '../state/store.jsx';
import { districtRisk } from '../lib/engine.js';
import { NODES } from '../lib/seed.js';

const SIDEBAR_ITEMS = [
  { section: 'OPERATIONS COMMAND' },
  { id: 'grid', label: 'Transit Grid Map', icon: 'map', active: true },
  { id: 'telemetry', label: 'Shipment Telemetry', icon: 'truck' },
  { id: 'alerts', label: 'Hazard Alerts', icon: 'warn' },
  { id: 'checkpoint', label: 'Checkpoint Clearance', icon: 'traffic' },
  { id: 'relief', label: 'Relief Allocation', icon: 'package' },
  { section: 'GOVERNANCE & AUDIT' },
  { id: 'reports', label: 'District Reports', icon: 'grid' },
  { id: 'protocols', label: 'Emergency Protocols', icon: 'shield' },
];

export default function GovOps() {
  const { state, actions } = useStore();
  const mapRef = useRef(null);
  const [activeTab, setActiveTab] = useState('grid');
  const [filterQuery, setFilterQuery] = useState('');
  const [heatFilter, setHeatFilter] = useState('doppler');
  const [focusId, setFocusId] = useState(null);

  const districts = useMemo(() => {
    const raw = districtRisk(state);
    if (!filterQuery) return raw;
    const q = filterQuery.toLowerCase();
    return raw.filter((d) => d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q));
  }, [state, filterQuery]);

  const onDistrictClick = (d) => {
    setFocusId(null);
    const seg = state.segments.find((s) => s.a === d.node || s.b === d.node);
    if (seg && mapRef.current && NODES[seg.a] && NODES[seg.b]) {
      const a = NODES[seg.a]; const b = NODES[seg.b];
      mapRef.current.flyToBounds([[a.lat, a.lon], [b.lat, b.lon]], { padding: [80, 80], duration: 0.9, maxZoom: 9 });
    }
  };

  const handleApproveReroute = async (shId = 'NER-0472') => {
    const ok = await actions.reroute(shId);
    actions.toast(ok ? `Approved & Dispatched Reroute for ${shId}. Diversion applied.` : `Reroute dispatched for ${shId}.`, 'ok');
  };

  const handleIssueAdvisory = () => {
    actions.toast('Pre-emptive Road Advisory broadcasted to all transit freight.', 'ok');
  };

  const handleDeployBRO = () => {
    actions.toast('BRO Bulldozer Taskforce 12 deployed to NH-29 rock slip zone.', 'ok');
  };

  const handleBroadcast = () => {
    actions.toast('Emergency High-Priority Broadcast transmitted to all NER carriers.', 'alert');
  };

  return (
    <div className="gov-full-shell">
      {/* Desktop Left Sidebar */}
      <aside className="gov-sidebar" aria-label="Operations Navigation">
        <div>
          {SIDEBAR_ITEMS.map((item, idx) => {
            if (item.section) {
              return <div key={idx} className="sidebar-section-title">{item.section}</div>;
            }
            const isSel = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-link ${isSel ? 'is-active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon name={item.icon} size={16} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="sidebar-bottom-seal">
          <Icon name="shieldCheck" size={18} color="#0c4a4f" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: '#657b88' }}>Encrypted Comms</span>
            <span style={{ fontWeight: 800 }}>NIC Secure Gateway</span>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <div className="gov-workspace-area">
        {/* Telemetry sub-header */}
        <div className="gov-telemetry-banner" style={{ borderRadius: '12px', boxShadow: 'var(--shadow-sm)' }}>
          <div className="gov-telemetry-title-group">
            <span className="gov-indicator-dot" />
            <span className="gov-telemetry-title">NER CRISIS GRID &amp; MULTIMODAL TELEMETRY CONSOLE</span>
            <span className="gov-security-level">DEFENCE &amp; CIVIL LOGISTICS LEVEL-4</span>
            <span className="gov-sat-sync-badge">
              <Icon name="satellite" size={13} color="#15803d" />
              GSAT-7A REALTIME SYNC: ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span className="gov-cycle-text">Grid Cycle: <strong>12s Auto-Refresh</strong></span>
            <button className="btn-emergency-broadcast" type="button" onClick={handleBroadcast}>
              <Icon name="broadcast" size={14} color="#ffffff" />
              <span>Emergency Broadcast</span>
            </button>
          </div>
        </div>

        {/* 3-Column Tactical Layout */}
        <div className="gov-three-col-grid">
          {/* Column 1: Districts & Corridors */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Icon name="compass" size={16} color="#0c4a4f" />
                <span>NER Districts &amp; Corridors</span>
              </div>
              <span className="gov-card-badge">8 States</span>
            </div>

            <div className="district-search-bar">
              <Icon name="search" size={14} color="#718096" />
              <input
                className="district-search-input"
                type="text"
                placeholder="Search 8 Sister States, NH..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>

            <div className="gov-district-scroll">
              {districts.map((d) => {
                const statusKey = d.blocked > 0 ? 'blocked' : d.risky > 0 ? 'risky' : 'safe';
                const statusLabel = d.blocked > 0 ? 'Blocked' : d.risky > 0 ? 'Risky' : 'Safe';
                const countText = d.blocked > 0 ? `${d.blocked * 12 + 6} halted` : d.risky > 0 ? `${d.risky * 16} delayed` : `${d.segCount * 32 + 34} trucks`;
                return (
                  <button
                    key={d.name}
                    type="button"
                    className={`gov-district-item ${statusKey}`}
                    onClick={() => onDistrictClick(d)}
                  >
                    <div className="district-info-main">
                      <span className={`district-status-dot ${statusKey}`} />
                      <div className="district-label-wrap">
                        <span className="district-h-name">{d.name}</span>
                        <span className="district-sub-flow">
                          {statusKey === 'safe' ? 'Normal Flow • NH-27 Corridor' : statusKey === 'blocked' ? 'Landslide • NH-29 Block' : 'Waterlogging / Slit'}
                        </span>
                      </div>
                    </div>

                    <div className="district-badge-right">
                      <span className={`pill-status-tag ${statusKey}`}>{statusLabel}</span>
                      <span className="district-truck-count">{countText}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bro-centers-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Icon name="tool" size={14} color="#0c4a4f" />
                <span>BRO Emergency Centers</span>
              </div>
              <strong style={{ fontSize: '13px', color: '#0c4a4f' }}>14 Active Units</strong>
            </div>
          </div>

          {/* Column 2: Topographical Heatmap & Corridor Pulses */}
          <div className="gov-card">
            <div className="heatmap-stage-header">
              <div className="gov-card-title">
                <Icon name="map" size={16} color="#0c4a4f" />
                <div>
                  <span>Topographical Heatmap &amp; Corridor Pulses</span>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                    Dynamic monsoon hazard gradient across 8 Sister States
                  </div>
                </div>
              </div>
              <span className="gov-card-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                Live Vector Feed
              </span>
            </div>

            <div className="heatmap-filter-tabs">
              <button
                type="button"
                className={`heatmap-tab-btn ${heatFilter === 'doppler' ? 'active' : ''}`}
                onClick={() => setHeatFilter('doppler')}
              >
                <Icon name="water" size={12} /> Rainfall Doppler (IMD)
              </button>
              <button
                type="button"
                className={`heatmap-tab-btn ${heatFilter === 'soil' ? 'active' : ''}`}
                onClick={() => setHeatFilter('soil')}
              >
                <Icon name="layers" size={12} /> Soil Saturation Index
              </button>
              <button
                type="button"
                className={`heatmap-tab-btn ${heatFilter === 'bro' ? 'active' : ''}`}
                onClick={() => setHeatFilter('bro')}
              >
                <Icon name="tool" size={12} /> BRO Alerts
              </button>
            </div>

            <div className="gov-map-viewport">
              <MapCanvas mode="heat" heatHorizon="live" focusSegId={focusId} mapRef={mapRef} />

              {/* Realtime Tactical HUD Badges over map */}
              <div className="map-hud-overlay-card landslide">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 900 }}>
                  <Icon name="landslide" size={14} color="#ffffff" />
                  <span>LANDSLIDE ALERT</span>
                </div>
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                  BRO Unit 47 Deployed &bull; ETA: 4h 30m
                </div>
              </div>

              <div className="map-hud-overlay-card rain">
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 900 }}>
                  <Icon name="water" size={14} color="#1a202c" />
                  <span>HEAVY RAIN SLURRY</span>
                </div>
                <div style={{ fontSize: '10px', marginTop: '2px' }}>
                  Speed Capped to 20 km/h
                </div>
              </div>

              <div className="map-hud-bottom-bar">
                <div className="green-corridor-active-pill">
                  <Icon name="truck" size={14} color="#32d796" />
                  <span>GREEN CORRIDOR ACTIVE: Oxygen &amp; Medical Convoy en route</span>
                </div>

                <div className="risk-saturation-legend">
                  <span style={{ fontWeight: 800, color: '#94a3b8' }}>RISK SATURATION:</span>
                  <span style={{ color: '#32d796' }}>&bull; Passable</span>
                  <span style={{ color: '#f5a623' }}>&bull; Slippage Risk</span>
                  <span style={{ color: '#ff5f52' }}>&bull; Blocked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Critical Freight Telemetry */}
          <div className="gov-card">
            <div className="gov-card-header">
              <div className="gov-card-title">
                <Icon name="package" size={16} color="#0c4a4f" />
                <div>
                  <span>Critical Freight Telemetry</span>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                    412 Live Active Consignments
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button type="button" className="lang-selector-btn" style={{ padding: '3px 6px' }} title="Download Report">
                  <Icon name="download" size={13} />
                </button>
                <button type="button" className="lang-selector-btn" style={{ padding: '3px 6px' }} title="Filter Consignments">
                  <Icon name="filter" size={13} />
                </button>
              </div>
            </div>

            <div className="gov-telemetry-table-wrap">
              <table className="telemetry-table">
                <thead>
                  <tr>
                    <th>Cargo ID</th>
                    <th>Type</th>
                    <th>Route</th>
                    <th>Status</th>
                    <th>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {state.shipments.map((sh) => {
                    const typeKey = sh.type === 'Medical' ? 'med' : sh.type === 'Food' ? 'food' : sh.type === 'Construction' ? 'girders' : 'gen';
                    const routeAbbr = `${sh.origin.slice(0, 3).toUpperCase()} &rarr; ${sh.dest.slice(0, 3).toUpperCase()}`;
                    const isHalted = sh.status === 'HELD' || sh.status === 'DELAYED';
                    return (
                      <tr key={sh.id}>
                        <td style={{ fontWeight: 800, fontFamily: 'var(--f-mono)', color: isHalted ? 'var(--danger)' : '#0f2a33' }}>
                          {sh.id}
                        </td>
                        <td>
                          <span className={`cargo-type-pill ${typeKey}`}>
                            {sh.type === 'Medical' && <Icon name="medical" size={10} />}
                            {sh.type}
                          </span>
                        </td>
                        <td dangerouslySetInnerHTML={{ __html: routeAbbr }} />
                        <td>
                          <span className="status-dot-text">
                            <span className={`gov-indicator-dot`} style={{ width: '6px', height: '6px', background: isHalted ? 'var(--danger)' : 'var(--safe)' }} />
                            {sh.status}
                          </span>
                        </td>
                        <td style={{ fontFamily: 'var(--f-mono)', fontWeight: 700 }}>
                          {sh.etaHrs}h
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="gov-telemetry-summary-cards">
              <div className="summary-metric-card">
                <div className="metric-val">89.2%</div>
                <div className="metric-lbl">On-Time Index</div>
                <div style={{ fontSize: '8px', color: '#94a3b8' }}>Target: &gt;85%</div>
              </div>
              <div className="summary-metric-card">
                <div className="metric-val purple">3</div>
                <div className="metric-lbl">Vulnerable Cargo</div>
                <div style={{ fontSize: '8px', color: '#94a3b8' }}>Live Monitored</div>
              </div>
              <div className="summary-metric-card">
                <div className="metric-val alert">7 Active</div>
                <div className="metric-lbl">Advisories</div>
                <div style={{ fontSize: '8px', color: '#94a3b8' }}>Zone 1 &amp; Zone 3</div>
              </div>
            </div>

            <div className="active-reroutes-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#0e4c52', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="route" size={14} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#0e4c52' }}>Active Reroutes: 12 Drivers</span>
                  <span style={{ fontSize: '9.5px', color: '#657b88' }}>Average clearance saving: 2h 15m</span>
                </div>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#047857' }}>+18.4% Eff</span>
            </div>
          </div>
        </div>

        {/* Bottom Panel: AI Operational Suggestions & Reroute Engine */}
        <div className="gov-bottom-deck">
          <div className="deck-header-row">
            <div className="deck-title">
              <Icon name="sparkles" size={17} color="#4f46e5" />
              <span>AI Operational Suggestions &amp; Reroute Decision Engine</span>
            </div>
            <div className="deck-meta-info">
              <span>Predictive Telemetry v4.2 &bull; Auto-calculated using IMD satellite + BRO ground node mesh</span>
            </div>
          </div>

          <div className="ai-suggestions-grid">
            {/* Directive 1: Medical Reroute */}
            <div className="ai-directive-card purple">
              <div className="directive-badge-row" style={{ color: '#4338ca' }}>
                <Icon name="route" size={15} color="#4338ca" />
                <span>AI REROUTE DIRECTIVE</span>
              </div>
              <p className="directive-body-text">
                Reroute medical convoy <strong>NER-0472</strong> via <strong>NH-702B</strong> to bypass Chumoukedima bottleneck. Saves <strong>3h 40m</strong> transit time.
              </p>
              <div className="directive-action-footer">
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#059669' }}>Impact: Zero Life Risk</span>
                <button
                  type="button"
                  className="directive-action-btn teal"
                  onClick={() => handleApproveReroute('NER-0472')}
                >
                  <Icon name="send" size={12} color="#ffffff" />
                  <span>Approve &amp; Dispatch Alert</span>
                </button>
              </div>
            </div>

            {/* Directive 2: Pre-emptive Warning */}
            <div className="ai-directive-card amber">
              <div className="directive-badge-row" style={{ color: '#b45309' }}>
                <Icon name="warn" size={15} color="#b45309" />
                <span>PRE-EMPTIVE WARNING</span>
              </div>
              <p className="directive-body-text">
                Soil moisture sensor at <strong>KM-68 (Barapani)</strong> reached <strong>92%</strong>. Recommend halting heavy freight trailers (&gt;25T) before 16:00.
              </p>
              <div className="directive-action-footer">
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#dc2626' }}>Hazard Risk: Severe</span>
                <button
                  type="button"
                  className="directive-action-btn amber"
                  onClick={handleIssueAdvisory}
                >
                  <Icon name="broadcast" size={12} color="#ffffff" />
                  <span>Issue Road Advisory</span>
                </button>
              </div>
            </div>

            {/* Directive 3: Asset Allocation */}
            <div className="ai-directive-card green">
              <div className="directive-badge-row" style={{ color: '#047857' }}>
                <Icon name="tool" size={15} color="#047857" />
                <span>ASSET ALLOCATION</span>
              </div>
              <p className="directive-body-text">
                BRO Bulldozer Taskforce 12 currently idle at <strong>Dimapur staging depot</strong>. Reassign immediately to <strong>NH-29 rock slip</strong>.
              </p>
              <div className="directive-action-footer">
                <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#475569' }}>Staging Distance: 18km</span>
                <button
                  type="button"
                  className="directive-action-btn green"
                  onClick={handleDeployBRO}
                >
                  <Icon name="truck" size={12} color="#ffffff" />
                  <span>Deploy BRO Unit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
