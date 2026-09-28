import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon } from './Icons.jsx';
import { useStore } from '../state/store.jsx';

const MOBILE_NAV_ITEMS = [
  { to: '/', label: 'Home', ic: 'grid', end: true },
  { to: '/planner', label: 'Route Planner', ic: 'route' },
  { to: '/alerts', label: 'Alerts', ic: 'warn' },
  { to: '/gov', label: 'Profile / Gov', ic: 'user' },
];

export function BottomNav() {
  const { state } = useStore();
  const criticals = state.alerts.filter((a) => a.sev === 'CRITICAL').length;

  return (
    <nav className="bottomnav" aria-label="Mobile Navigation">
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) => `bnav-btn ${isActive ? 'is-active' : ''}`}
        >
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={item.ic} size={20} />
            {item.to === '/alerts' && criticals > 0 && (
              <span className="bnav-badge">{criticals}</span>
            )}
          </div>
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export function Tabs() {
  // Desktop header tabs are now consolidated in the GovOps sidebar & CmdBar
  return null;
}
