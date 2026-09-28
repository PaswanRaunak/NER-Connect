import React from 'react';
import { MobileShell } from '../components/MobileShell.jsx';
import { Icon } from '../components/ui.jsx';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { useStore } from '../state/store.jsx';
import { CONVOY } from '../lib/data.js';

/* ============================================================
   SCREEN 8 — Live Shipment / Convoy Tracking (MED-0982)
   ============================================================ */
const CHECKPOINTS = [
  { name: 'Sevoke · Clr', tier: 1, lat: 26.71, lon: 88.43 },
  { name: 'Melli · Rain Slopes', tier: 4, lat: 27.02, lon: 88.6 },
  { name: 'Singtam · Grn', tier: 1, lat: 27.15, lon: 88.55 },
];

const CONVOY_PATH = [[26.71, 88.43], [26.72, 88.54], [27.02, 88.6], [27.15, 88.55], [27.33, 88.61]];

export function Tracking() {
  const { actions } = useStore();

  return (
    <MobileShell title="Tracking">
      <div className="flex flex-col w-full relative select-none">
        {/* Live Mission Heads-Up Overlay */}
        <div className="absolute top-3 left-0 right-0 z-30 px-space-md flex flex-col gap-space-xs pointer-events-none">
          <div className="flex items-center justify-between gap-space-xs pointer-events-auto">
            <button aria-label="Go Back" className="w-11 h-11 rounded-full bg-surface-container-lowest/95 backdrop-blur-md shadow-md flex items-center justify-center text-primary-container active:scale-95 transition-transform">
              <Icon name="arrow_back" size={20} />
            </button>
            <div className="flex items-center gap-space-xs">
              <div className="h-9 px-space-sm rounded-full bg-tertiary-container text-on-tertiary shadow-md flex items-center gap-space-xs">
                <Icon name="medical_services" size={16} fill className="text-tertiary-fixed-dim" />
                <span className="font-label-sm text-label-sm tracking-wide">{CONVOY.id}</span>
              </div>
              <div className="h-9 px-space-sm rounded-full bg-surface-container-lowest/95 backdrop-blur-md text-on-surface shadow-md flex items-center gap-space-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-ping" />
                <span className="w-2 h-2 rounded-full bg-secondary -ml-[12px]" />
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">{CONVOY.navic}</span>
              </div>
            </div>
          </div>
          <div className="pointer-events-auto self-start mt-space-xs">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-primary text-on-primary text-label-sm font-label-sm shadow-sm backdrop-blur-md">
              <Icon name="alt_route" size={14} className="text-secondary-fixed" />
              <span>{CONVOY.corridor}</span>
            </div>
          </div>
        </div>

        {/* Full-Bleed Mission Map Canvas */}
        <div className="relative w-full h-[390px] overflow-hidden bg-surface-container">
          <MapCanvas
            center={[27.0, 88.55]}
            zoom={10}
            interactive="touch"
            corridors={[{ points: CONVOY_PATH, tier: 2, label: 'NH-10 · Sevoke → Gangtok' }]}
            markers={[
              ...CHECKPOINTS.map((c) => ({ lat: c.lat, lon: c.lon, tier: c.tier, label: c.name, always: true })),
              { lat: 27.02, lon: 88.6, tier: 4, label: 'Convoy #4 (34 km/h)', note: 'Escorted descent, Melli bypass', always: true },
            ]}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/60 mix-blend-multiply pointer-events-none" />

          {/* Recenter */}
          <button aria-label="Recenter Map on Convoy" className="absolute bottom-6 right-margin z-20 w-11 h-11 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-primary active:bg-surface-container">
            <Icon name="my_location" size={22} />
          </button>
        </div>

        {/* Bottom Sheet */}
        <div className="sheet-up w-full bg-surface-container-lowest -mt-5 rounded-t-[24px] shadow-[0_4px_16px_rgba(15,23,42,0.12)] z-30 pt-space-xs px-margin pb-space-lg flex flex-col gap-space-md">
          <div className="w-12 h-1.5 rounded-full bg-outline-variant/60 self-center my-space-xs" />

          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center justify-between gap-space-sm">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">Estimated Arrival</span>
                <span className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface tracking-tight">{CONVOY.eta}</span>
              </div>
              <div className="px-space-sm py-1 rounded-full bg-secondary-container text-on-secondary-container flex items-center gap-1 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm tracking-tight font-bold">{CONVOY.status}</span>
              </div>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">{CONVOY.body}</p>
          </div>

          {/* Horizontal Milestone Progress Track */}
          <div className="w-full p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-primary-container font-semibold uppercase tracking-wider">Corridor Chainage</span>
              <span className="font-telemetry-num text-telemetry-num text-on-surface-variant">{CONVOY.chainage}</span>
            </div>
            <div className="relative w-full pt-1 pb-2">
              <div className="absolute top-[18px] left-[8%] right-[8%] h-0.5 bg-outline-variant/50 z-0" />
              <div className="absolute top-[18px] left-[8%] w-[58%] h-0.5 bg-secondary z-0" />
              <div className="relative z-10 flex items-start justify-between text-center">
                {CONVOY.nodes.map((n) => {
                  const done = n.state === 'done';
                  const active = n.state === 'active';
                  return (
                    <div key={n.name} className="flex flex-col items-center w-1/4">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm ${done ? 'bg-secondary text-on-secondary' : active ? 'bg-primary-container text-on-primary ring-4 ring-primary-fixed/40 shadow-sm animate-pulse' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        <Icon name={done ? 'check' : active ? 'navigation' : n.icon || 'flag'} size={16} />
                      </div>
                      <span className={`font-label-sm text-label-sm mt-1 ${active ? 'text-primary font-bold' : done ? 'text-on-surface font-semibold' : 'text-on-surface-variant font-medium'}`}>{n.name}</span>
                      <span className={`font-telemetry-num text-body-sm ${active ? 'text-primary font-semibold' : 'text-on-surface-variant'}`}>{n.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Telemetry & Convoy Clearance Manifest */}
          <div className="flex flex-col gap-space-xs">
            <div className="grid grid-cols-2 gap-space-sm">
              {CONVOY.telemetry.map((t) => (
                <div key={t.label} className="p-space-sm rounded-lg bg-surface-container flex flex-col gap-1">
                  <div className="flex items-center justify-between text-on-surface-variant">
                    <span className="font-label-sm text-label-sm">{t.label}</span>
                    <Icon name={t.icon} size={16} className={t.iconCls} />
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-telemetry-num text-headline-sm text-on-surface tabular-nums">{t.value}</span>
                    <span className={`font-label-sm text-label-sm ${t.badgeCls}`}>{t.badge}</span>
                  </div>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{t.sub}</span>
                </div>
              ))}
            </div>
            <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
                  <Icon name="verified_user" size={18} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-surface truncate font-semibold">{CONVOY.truck}</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{CONVOY.pilot}</span>
                </div>
              </div>
              <button onClick={() => actions.toast('Secure line opened to BRO Pilot Vehicle #2 via VHF relay.')} aria-label="Direct Phone Link with Escort" className="w-9 h-9 rounded-full bg-surface-container-highest text-primary flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform">
                <Icon name="call" size={18} />
              </button>
            </div>
          </div>

          {/* Operational Action Triggers */}
          <div className="flex flex-col gap-space-sm pt-space-xs">
            <button onClick={() => actions.toast('Dispatch bridge connected: NERC Guwahati control + Melli BRO outpost.')} className="w-full h-12 rounded-lg bg-primary-container hover:bg-primary active:bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-md active:scale-[0.99] transition-all">
              <Icon name="support_agent" size={20} />
              <span>Contact Dispatch &amp; Escort Team</span>
            </button>
            <button onClick={() => actions.toast('Telemetry log streamed: inclinometer nominal, slope drift 0.3°/hr at Km 41.')} className="w-full py-2 flex items-center justify-center gap-1 text-primary-container hover:text-primary active:underline">
              <Icon name="analytics" size={18} />
              <span className="font-label-sm text-label-sm font-semibold">View Live Telemetry Log &amp; Slope Inclinometer Alert</span>
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
