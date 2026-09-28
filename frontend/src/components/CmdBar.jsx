import React, { useState } from 'react';
import { Logo } from './Logo.jsx';
import { Icon } from './Icons.jsx';
import { useStore } from '../state/store.jsx';
import { useLocation, useNavigate } from 'react-router-dom';

export function CmdBar() {
  const { state, actions } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [lang, setLang] = useState('EN');
  const isGov = location.pathname === '/gov';

  const criticals = state.alerts.filter((a) => a.sev === 'CRITICAL').length;
  const warnings = state.alerts.filter((a) => a.sev === 'WARNING').length;

  return (
    <header className="main-header">
      <div className="header-left">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }} aria-label="NER-Connect Home">
          <Logo size={36} subtitle={isGov ? "GOV.IN • Operations Command Center" : "NORTH EAST LOGISTICS & TRANSIT"} />
        </a>

        {isGov && (
          <div className="header-gov-badge hide-sm">
            <span className="gov-indicator-dot" />
            <span>NER Integrated Transit Grid &bull; Active Live Feed</span>
          </div>
        )}
      </div>

      {isGov && (
        <div className="header-center-stats hide-sm">
          <div className="stat-pill">
            <span>Active Shipments:</span>
            <strong>{state.shipments.length * 41 + 2}</strong>
          </div>
          <div className="stat-pill warning">
            <span>Active Alerts:</span>
            <strong>{state.alerts.length}</strong>
          </div>
          <div className="stat-pill warning">
            <span>Landslide Warnings:</span>
            <strong>{criticals || 3}</strong>
          </div>
        </div>
      )}

      <div className="header-right">
        {/* Language selector */}
        {isGov ? (
          <button type="button" className="lang-selector-btn" title="Select Language">
            <Icon name="radar" size={14} />
            <span>EN (English)</span>
            <Icon name="chevronDown" size={12} />
          </button>
        ) : (
          <div className="lang-pill-group">
            {['EN', 'AS', 'MN'].map((l) => (
              <button
                key={l}
                type="button"
                className={`lang-pill-opt ${lang === l ? 'active' : ''}`}
                onClick={() => setLang(l)}
              >
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Demo trigger / Gov toggle */}
        <button
          className="lang-selector-btn"
          type="button"
          title="Toggle Command View"
          onClick={() => navigate(isGov ? '/' : '/gov')}
        >
          <Icon name={isGov ? "truck" : "grid"} size={14} />
          <span style={{ fontSize: '11px', fontWeight: 800 }}>{isGov ? "MOBILE APP" : "GOV CONSOLE"}</span>
        </button>

        {/* Commander Profile */}
        <div className="user-profile-badge">
          {isGov && (
            <div className="user-meta-text hide-sm">
              <span className="user-name-title">Cmdr. R. Sonowal</span>
              <span className="user-role-sub">Logistics Director, Zone 1</span>
            </div>
          )}
          <div className="user-avatar" title="Operations Officer">
            <Icon name="user" size={16} color="#ffffff" />
          </div>
        </div>
      </div>
    </header>
  );
}
