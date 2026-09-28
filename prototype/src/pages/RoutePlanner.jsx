import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileShell } from '../components/MobileShell.jsx';
import { Icon } from '../components/ui.jsx';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { useStore } from '../state/store.jsx';
import { ROUTE } from '../lib/data.js';

/* ============================================================
   SCREEN 6 — Citizen Safe Route Planner (NH-10 Siliguri → Gangtok)
   ============================================================ */
const PRIORITIES = [
  { id: 'normal', icon: 'directions_car', label: 'Passenger' },
  { id: 'perishable', icon: 'local_shipping', label: 'Perishable' },
  { id: 'medical', icon: 'e911_emergency', label: 'Medical' },
];

const SEGMENTS = [
  { points: [[26.71, 88.43], [26.68, 88.48], [26.72, 88.54]], tier: 1 },
  { points: [[26.72, 88.54], [26.88, 88.58], [27.02, 88.6]], tier: 3 },
  { points: [[27.02, 88.6], [27.15, 88.55], [27.33, 88.61]], tier: 1 },
];


export function RoutePlanner() {
  const navigate = useNavigate();
  const { actions } = useStore();
  const [priority, setPriority] = useState('normal');
  const [speaking, setSpeaking] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [live, setLive] = useState(null); // ORS-validated fastest route (km, hrs, geometry)

  // Backend plan (OpenRouteService real-road geometry when ORS_API_KEY is
  // set server-side). Falls back silently to the designed corridor offline.
  useEffect(() => {
    let alive = true;
    actions.planRoute('siliguri', 'gangtok', 'General').then((routes) => {
      if (!alive || !routes) return;
      const fast = routes.find((r) => r.orsValidated && Array.isArray(r.geometry) && r.geometry.length > 1);
      if (fast) setLive({ km: fast.km, hrs: fast.hrs, geometry: fast.geometry });
    }).catch(() => {});
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  function speak() {
    setSpeaking((s) => !s);
    try {
      if (!('speechSynthesis' in window)) return;
      const text = `${ROUTE.advisory.pre}${ROUTE.advisory.strong}${ROUTE.advisory.post}`;
      if (!speaking) {
        const u = new SpeechSynthesisUtterance(text);
        u.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } else window.speechSynthesis.cancel();
    } catch { /* noop */ }
  }

  function startNavigation() {
    setNavigating(true);
    actions.toast('Navigation locked: live slope sensors will re-check the Melli sector every 4 km.');
    setTimeout(() => setNavigating(false), 2600);
  }

  return (
    <MobileShell title="Route">
      <div className="flex flex-col w-full relative select-none">
        <div className="relative w-full h-[620px] overflow-hidden bg-surface-container-highest">
          <MapCanvas
            center={[27.0, 88.55]}
            zoom={10}
            bounds={[[26.5, 88.2], [27.52, 88.85]]}
            interactive="touch"
            corridors={live
              ? [{ points: live.geometry, color: '#004349', label: 'NH-10 · ORS-validated fastest road network' }]
              : SEGMENTS.map((s, i) => ({ ...s, label: ['NH-10 · Siliguri to Sevoke (CLEAR)', 'Teesta Bazar / Melli (IMD TIER 2)', 'Singtam to Gangtok (CLEAR)'][i] }))}
            markers={[
              { lat: 26.71, lon: 88.43, tier: 1, label: 'Siliguri Junction' },
              { lat: 27.02, lon: 88.6, tier: 3, label: 'Melli · Single lane', note: 'Crawler traffic, mud clearing' },
              { lat: 27.33, lon: 88.61, tier: 4, label: 'Gangtok Central' },
            ]}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/40 pointer-events-none" />

          {/* Floating Top Overlay */}
          <div className="absolute top-0 left-0 right-0 p-space-md flex flex-col gap-space-sm z-20">
            <div className="flex items-center justify-between">
              <button aria-label="Navigate Back to Sector Overview" onClick={() => navigate('/citizen')} className="w-12 h-12 rounded-full bg-surface text-on-surface shadow-md flex items-center justify-center active:scale-95 transition-transform">
                <Icon name="arrow_back" size={24} />
              </button>
              <div className="h-10 px-space-md rounded-full bg-surface/95 backdrop-blur-md shadow-sm flex items-center gap-space-xs text-on-surface">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">{live ? 'NH-10 Live · ORS Road Network' : 'NH-10 Live'}</span>
              </div>
            </div>

            <div className="w-full bg-surface rounded-xl shadow-md p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center gap-space-md">
                <div className="flex flex-col items-center justify-between h-14 py-1">
                  <span className="w-3 h-3 rounded-full bg-primary-container ring-4 ring-primary-fixed-dim" />
                  <span className="w-0.5 h-6 bg-outline-variant" />
                  <Icon name="location_on" size={18} className="text-error" />
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div className="flex items-center justify-between pb-space-xs">
                    <div className="min-w-0">
                      <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Origin</span>
                      <span className="font-label-lg text-label-lg text-on-surface truncate block">{ROUTE.origin}</span>
                    </div>
                    <Icon name="my_location" size={18} className="text-outline" />
                  </div>
                  <div className="h-[1px] bg-surface-container-high w-full my-0.5" />
                  <div className="flex items-center justify-between pt-space-xs">
                    <div className="min-w-0">
                      <span className="font-label-sm text-label-sm text-on-surface-variant block uppercase">Destination</span>
                      <span className="font-label-lg text-label-lg text-on-surface truncate block">{ROUTE.dest}</span>
                    </div>
                    <Icon name="flag" size={18} className="text-outline" />
                  </div>
                </div>
              </div>

              <div className="pt-space-xs flex items-center gap-space-xs overflow-x-auto no-scrollbar">
                {PRIORITIES.map((p) => {
                  const active = priority === p.id;
                  const activeCls = p.id === 'medical'
                    ? 'bg-tertiary-container text-on-primary shadow-sm'
                    : 'bg-primary-container text-on-primary shadow-sm';
                  return (
                    <button
                      key={p.id}
                      onClick={() => setPriority(p.id)}
                      className={`flex items-center gap-space-xs h-10 px-space-md rounded-full font-label-md text-label-md whitespace-nowrap active:scale-95 transition-all ${active ? activeCls : 'bg-surface-container-high text-on-surface-variant'}`}
                      type="button"
                    >
                      <Icon name={p.icon} size={16} />
                      <span>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet */}
        <div className="sheet-up relative -mt-6 w-full rounded-t-[24px] bg-surface shadow-xl z-30 flex flex-col px-space-md pt-space-sm pb-space-lg">
          <div className="w-full flex justify-center py-space-xs">
            <div className="w-9 h-1 rounded-full bg-outline-variant" />
          </div>

          <div className="mt-space-sm flex items-start justify-between gap-space-md">
            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-space-xs">
                <span className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-on-surface tracking-tight">{live ? `${Math.floor(live.hrs)} hr ${String(Math.round((live.hrs % 1) * 60)).padStart(2, '0')} min` : ROUTE.eta}</span>
                <span className="font-label-md text-label-md text-secondary font-semibold">{live ? 'ORS Validated' : ROUTE.label}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">{live ? `${live.km} km via NH-10 · real road network, rerouted around live blockages` : ROUTE.km}</p>
            </div>
            <div className="flex-shrink-0 flex items-center">
              <div className="h-9 px-space-sm rounded-full bg-error-container/40 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-error" />
                <span className="font-label-sm text-label-sm font-bold text-error tracking-tight uppercase">{ROUTE.slowZones} Slow Zone</span>
              </div>
            </div>
          </div>

          <div className="mt-space-md p-space-md rounded-xl bg-surface-container-low flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <button aria-label="Read safety alert aloud" onClick={speak} className={`w-10 h-10 rounded-full text-on-primary flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform ${speaking ? 'bg-secondary' : 'bg-primary-container'}`} type="button">
                <Icon name={speaking ? 'pause' : 'volume_up'} size={20} />
              </button>
              <span className="font-label-sm text-label-sm text-on-surface uppercase tracking-wide font-semibold truncate">IMD &amp; Police Advisory</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant">Updated 8m ago</span>
          </div>

          <div className="mt-space-sm px-space-xs">
            <p className="font-body-lg text-body-lg text-on-surface leading-snug">
              {ROUTE.advisory.pre}<span className="font-semibold text-primary-container">{ROUTE.advisory.strong}</span>{ROUTE.advisory.post}
            </p>
          </div>

          <div className="mt-space-md grid grid-cols-3 gap-space-xs">
            {ROUTE.highlights.map((h) => (
              <div key={h.label} className="p-space-sm rounded-xl bg-surface-container flex flex-col items-center text-center justify-center min-h-[64px]">
                <div className="flex items-center gap-1">
                  <Icon name={h.icon} size={18} className={h.iconCls} />
                  <span className="font-headline-sm text-headline-sm text-on-surface">{h.value}</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight mt-0.5">{h.label}</span>
              </div>
            ))}
          </div>

          {priority === 'medical' && (
            <div className="mt-space-md p-space-sm rounded-xl bg-tertiary-container/10 flex items-center gap-space-sm">
              <Icon name="verified" size={22} className="text-tertiary flex-shrink-0" />
              <p className="font-body-sm text-body-sm text-on-surface">
                <strong className="font-semibold text-tertiary">Green Corridor Enabled:</strong> {ROUTE.medicalNote}
              </p>
            </div>
          )}

          <div className="mt-space-lg w-full relative">
            <button
              onClick={startNavigation}
              className="w-full h-12 rounded-lg bg-primary-container text-on-primary flex items-center justify-center gap-space-sm active:scale-[0.98] transition-transform shadow-md min-h-[48px]"
              type="button"
            >
              <Icon name={navigating ? 'route' : 'navigation'} size={22} className={navigating ? 'animate-pulse' : ''} />
              <span className="font-label-lg text-label-lg tracking-wide uppercase">{navigating ? 'Corridor Locked — Re-routing Live' : 'Start Safe Navigation'}</span>
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
