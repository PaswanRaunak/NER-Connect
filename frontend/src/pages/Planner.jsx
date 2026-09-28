import React, { useState } from 'react';
import { Icon } from '../components/Icons.jsx';
import { useStore } from '../state/store.jsx';
import { NODES } from '../lib/seed.js';

export default function Planner() {
  const { state, actions } = useStore();
  const [origin, setOrigin] = useState('guwahati');
  const [dest, setDest] = useState('imphal');
  const [cargo, setCargo] = useState('Medical');
  const [heavyFreight, setHeavyFreight] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState('Recommended');

  const swap = () => {
    const o = origin;
    setOrigin(dest);
    setDest(o);
  };

  const handleConfirmDispatch = () => {
    actions.toast(`Route via NH-27 & NH-02 confirmed. Instant manifest dispatched to Border Security & Relief Command.`, 'ok');
  };

  return (
    <div className="mobile-app-shell">
      {/* Top telemetry sync header */}
      <div style={{ background: '#e0f2fe', borderBottom: '1px solid #bae6fd', padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, color: '#0369a1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7' }} />
          <span>GIS TELEMETRY ONLINE</span>
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Icon name="satellite" size={13} color="#0369a1" />
          <span>INSAT-3DR Synced</span>
        </span>
      </div>

      <div className="planner-stage-wrap">
        {/* Transit Origin & Target Card */}
        <div className="transit-target-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '15px', fontWeight: 900, color: '#0f2a33' }}>Transit Origin &amp; Target</h1>
            <span style={{ fontSize: '10.5px', fontFamily: 'var(--f-mono)', color: '#64748b', fontWeight: 700 }}>
              ID: NER-8941
            </span>
          </div>

          <div className="depot-input-row">
            <div className="depot-icon-circle origin">
              <Icon name="pin" size={15} />
            </div>
            <div className="depot-select-wrap">
              <div className="depot-label-sub">ORIGIN DEPOT</div>
              <select
                className="depot-select-field"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              >
                {Object.entries(NODES).map(([k, n]) => (
                  <option key={k} value={k}>
                    {n.name} Central Depot, {n.state}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <button
            type="button"
            className="swap-depot-btn"
            onClick={swap}
            title="Swap Origin & Destination"
          >
            <Icon name="swap" size={16} />
          </button>

          <div className="depot-input-row">
            <div className="depot-icon-circle dest">
              <Icon name="target" size={15} />
            </div>
            <div className="depot-select-wrap">
              <div className="depot-label-sub">EMERGENCY RECIPIENT</div>
              <select
                className="depot-select-field"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
              >
                {Object.entries(NODES).map(([k, n]) => (
                  <option key={k} value={k}>
                    {n.name === 'Imphal' ? 'RIMS Hospital, Imphal, Manipur' : `${n.name} Distribution Hub, ${n.state}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Freight Classification */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#475569', letterSpacing: '0.06em' }}>
              FREIGHT CLASSIFICATION
            </span>
            <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#3730a3', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Icon name="shield" size={12} color="#3730a3" />
              <span>Priority Protocol</span>
            </span>
          </div>

          <div className="freight-class-pills">
            <button
              type="button"
              className={`f-class-btn ${cargo === 'Medical' ? 'selected' : ''}`}
              onClick={() => setCargo('Medical')}
            >
              <Icon name="medical" size={14} />
              <span>Medical Relief (PRIORITY)</span>
            </button>
            <button
              type="button"
              className={`f-class-btn ${cargo === 'Food' ? 'selected' : ''}`}
              onClick={() => setCargo('Food')}
            >
              <Icon name="food" size={14} />
              <span>Food &amp; Rations</span>
            </button>
            <button
              type="button"
              className={`f-class-btn ${cargo === 'General' ? 'selected' : ''}`}
              onClick={() => setCargo('General')}
            >
              <Icon name="package" size={14} />
              <span>General Cargo</span>
            </button>
          </div>

          {/* Heavy Freight Toggle */}
          <div style={{ background: '#ffffff', border: '1px solid var(--mobile-border)', borderRadius: '10px', padding: '10px 14px', marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icon name="truck" size={18} color="#0c4a4f" />
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0f2a33' }}>Vehicle Clearance: Heavy Freight (16-32T)</div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Includes NH-27 bridge load limits</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={heavyFreight}
              onChange={(e) => setHeavyFreight(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#093b40', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* 3 Corridors Computed Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px', fontWeight: 900, color: '#0f2a33' }}>3 Corridors Computed</span>
            <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '4px' }}>
              Active
            </span>
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>Filtered</span>
        </div>

        {/* Computed Corridor Card (#1 DETOUR from Image 5) */}
        <div className="computed-corridor-card">
          <div className="corridor-badge-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Icon name="star" size={14} color="#facc15" />
              <span>AI Pick - Medical Priority</span>
            </div>
            <span>#1 DETOUR</span>
          </div>

          {/* Corridor Map Preview Canvas */}
          <div className="corridor-map-preview">
            <svg width="100%" height="120" viewBox="0 0 400 120" fill="none" preserveAspectRatio="none">
              <rect width="400" height="120" fill="#0d232b" />
              {/* Mountain topography curves */}
              <path d="M0 80Q100 30 200 70T400 40V120H0Z" fill="#13313d" />
              {/* Route line in neon teal */}
              <path d="M30 90C100 40 180 100 260 50S370 80 370 80" stroke="#32d796" strokeWidth="4" strokeLinecap="round" strokeDasharray="6 4" />
              <circle cx="30" cy="90" r="6" fill="#32d796" />
              <circle cx="260" cy="50" r="5" fill="#f59e0b" />
              <circle cx="370" cy="80" r="6" fill="#ffffff" />
            </svg>

            <div style={{ position: 'absolute', bottom: '8px', left: '12px', background: 'rgba(9, 59, 64, 0.9)', color: '#32d796', padding: '3px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, border: '1px solid #32d796' }}>
              &check; Haflong Bypass Safe
            </div>
          </div>

          <div className="corridor-details-body">
            <div>
              <div style={{ fontSize: '9.5px', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em' }}>
                RECOMMENDED SAFE PATH
              </div>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f2a33' }}>
                Via NH-27 &amp; NH-02
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Haflong&ndash;Imphal safe all-weather detour
              </div>
            </div>

            <div className="corridor-stats-row">
              <div className="stat-item">
                <div className="stat-lbl">Distance</div>
                <div className="stat-val">482 <span style={{ fontSize: '12px' }}>km</span></div>
              </div>
              <div className="stat-item" style={{ textAlign: 'right' }}>
                <div className="stat-lbl">Est. Transit Time</div>
                <div className="stat-val">13h 45m</div>
              </div>
            </div>

            {/* Risk gauge info */}
            <div className="corridor-risk-circle-wrap">
              <div className="risk-circle-badge">
                <span>12%</span>
                <span style={{ fontSize: '7px', fontWeight: 800 }}>RISK</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#065f46' }}>
                  &bull; Minimal Landslide Hazard
                </div>
                <div style={{ fontSize: '10px', color: '#334155' }}>
                  6 Managed Fuel Depots &bull; Civil Security Convoy Enroute
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-submit-verification"
              style={{ background: '#093b40', padding: '10px' }}
            >
              <Icon name="check" size={14} color="#32d796" />
              <span>Selected Corridor</span>
            </button>
          </div>
        </div>

        {/* Automated Incident Alerting Banner */}
        <div style={{ background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Icon name="broadcast" size={18} color="#4338ca" />
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#1e1b4b' }}>Automated Incident Alerting</div>
              <div style={{ fontSize: '10.5px', color: '#475569' }}>Relief units and border control receive instant manifest</div>
            </div>
          </div>
          <span style={{ background: '#4338ca', color: '#ffffff', fontSize: '10px', fontWeight: 900, padding: '3px 8px', borderRadius: '4px' }}>
            L4 ACTIVE
          </span>
        </div>

        {/* Confirm Route & Notify Dispatch Action */}
        <button
          type="button"
          className="btn-confirm-dispatch"
          onClick={handleConfirmDispatch}
        >
          <Icon name="send" size={16} color="#ffffff" />
          <span>Confirm Route &amp; Notify Dispatch &rarr;</span>
        </button>

        <div style={{ textAlign: 'center', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
          &bull; Authorized North Eastern Regional Logistics Clearance &bull;
        </div>
      </div>
    </div>
  );
}
