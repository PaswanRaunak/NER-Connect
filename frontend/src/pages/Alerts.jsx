import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { useStore } from '../state/store.jsx';
import { NODES } from '../lib/seed.js';

const SEV_ICON = { CRITICAL: 'warn', WARNING: 'warn', ADVISORY: 'info', INFO: 'info' };

function relTime(ts) {
  const m = Math.max(0, Math.round((Date.now() - ts) / 60000));
  if (m < 1) return 'JUST NOW';
  if (m < 60) return `${m} MIN AGO`;
  const h = Math.floor(m / 60);
  return `${h} H ${m % 60} M AGO`;
}

const absTime = (ts) => {
  const d = new Date(ts);
  const p = (n) => String(n).padStart(2, '0');
  return `${p(d.getDate())}-${p(d.getMonth() + 1)} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export default function Alerts() {
  const { state } = useStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('ALL');

  const counts = useMemo(() => {
    const c = { ALL: state.alerts.length, CRITICAL: 0, WARNING: 0, ADVISORY: 0, INFO: 0 };
    for (const a of state.alerts) c[a.sev] = (c[a.sev] || 0) + 1;
    return c;
  }, [state.alerts]);

  const feed = filter === 'ALL' ? state.alerts : state.alerts.filter((a) => a.sev === filter);

  return (
    <section className="view is-active" aria-label="Alerts and notifications">
      <div className="alerts-layout">
        <header className="alerts-head">
          <div>
            <h1 className="view-title">ALERTS &amp; NOTIFICATIONS</h1>
            <p className="view-lede">Chronological dispatch log. Every entry here was also mirrored to SMS and IVR for low-connectivity zones.</p>
          </div>
          <div className="alert-filters" role="group" aria-label="Filter alerts by severity">
            {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY', 'INFO'].map((f) => (
              <button key={f} type="button" className={`filter-chip ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
                {f} <span className="fc-count">{counts[f] ?? 0}</span>
              </button>
            ))}
          </div>
        </header>

        {feed.length === 0 && (
          <div className="empty-state">
            <Icon name="bell" size={30} className="empty-ic" />
            <h2>No alerts at this severity</h2>
            <p>Change the filter above, or inject a demo disruption from the command bar to watch the pipeline react.</p>
          </div>
        )}

        <ol className="alert-feed">
          {feed.map((a) => {
            const seg = state.segments.find((s) => s.id === a.route);
            return (
              <li key={a.id} className={`alert-row al-${a.sev.toLowerCase()}`}>
                <div className="alert-spine" aria-hidden="true" />
                <div className="alert-ic"><Icon name={SEV_ICON[a.sev] || 'info'} size={17} /></div>
                <div className="alert-main">
                  <div className="alert-top">
                    <span className={`tag tag-sev-${a.sev.toLowerCase()}`}>{a.sev}</span>
                    <h3 className="alert-title">{a.title}</h3>
                  </div>
                  <p className="alert-body">{a.body}</p>
                  <div className="alert-meta">
                    {seg && (
                      <button type="button" className="route-chip" onClick={() => navigate(`/?focus=${seg.id}`)}>
                        <Icon name="pin" size={12} /> {seg.road} · {NODES[seg.a].name}-{NODES[seg.b].name}
                      </button>
                    )}
                    <button type="button" className="viewmap" onClick={() => navigate(`/?focus=${seg ? seg.id : ''}`)}>
                      VIEW ON MAP <Icon name="arrow" size={12} />
                    </button>
                    <span className="alert-where">{a.area}</span>
                    <span className="alert-ts mono" title={absTime(a.ts)}>{relTime(a.ts)}</span>
                    <span className="alert-ch">{a.ch.map((c) => <span key={c} className="chip chip-mini">{c}</span>)}</span>
                    <span className={`chip chip-mini chip-origin ${a.origin === 'CROWD' ? 'o-crowd' : a.origin === 'SIM' ? 'o-sim' : ''}`}>{a.origin}</span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
