import React from 'react';
import { useStore } from '../state/store.jsx';
import { NODES } from '../lib/seed.js';

/* Single marquee on the page (justified: it is the alert ticker,
   the fastest way to signal severity without stealing map space). */
export function Ticker() {
  const { state } = useStore();
  const severe = state.alerts.filter((a) => a.sev === 'CRITICAL' || a.sev === 'WARNING');

  if (!severe.length) {
    return (
      <div className="ticker" role="region" aria-label="Active disruptions ticker">
        <span className="ticker-tag ticker-tag-ok">NO SEVERE DISRUPTIONS</span>
        <div className="ticker-track"><div className="ticker-content">All monitored corridors within model tolerance. Next prediction refresh in under 1 h.</div></div>
      </div>
    );
  }

  const items = severe.map((a) => {
    const seg = state.segments.find((s) => s.id === a.route);
    const where = seg ? `${NODES[seg.a].name}-${NODES[seg.b].name}` : a.area;
    return { sev: a.sev, text: `${a.title} / ${where}`, id: a.id };
  });

  // duplicated content makes the CSS loop seamless for screen readers it is aria-hidden
  const loop = [...items, ...items];

  return (
    <div className="ticker" role="region" aria-label="Active severe disruptions ticker">
      <span className="ticker-tag">{items.length} ACTIVE SEVERE</span>
      <div className="ticker-track">
        <div className="ticker-content ticker-anim">
          {loop.map((it, i) => (
            <span className="ticker-item" key={`${it.id}-${i}`} aria-hidden={i >= items.length}>
              <i className={`ticker-dot dot-${it.sev.toLowerCase()}`} aria-hidden="true" />
              {it.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
