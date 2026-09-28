import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConsoleShell, Icon, StatusPill, Card } from '../components/ui.jsx';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { useStore } from '../state/store.jsx';
import { OFFICER, INCIDENTS, FREIGHT, RIBBON_NH10 } from '../lib/data.js';

/* ============================================================
   SCREEN 10 — Regional Operations Command Center
   ============================================================ */
const NH10_PTS = [
  [[26.71, 88.43], [26.68, 88.48], [26.72, 88.54]],
  [[26.72, 88.54], [26.88, 88.58], [27.02, 88.6]],
  [[27.02, 88.6], [27.15, 88.55], [27.33, 88.61]],
];
const NH29_PTS = [[[25.9, 93.73], [25.78, 93.9], [25.67, 94.11]]];
const NH27_PTS = [[[26.14, 91.74], [26.35, 92.68], [26.75, 94.2]]];
const BYPASS_PTS = [[[26.71, 88.43], [27.0, 88.9], [27.33, 88.61]]];

export function CommandCenter() {
  const { state, actions } = useStore();
  const officer = OFFICER.console;
  const [clock, setClock] = useState(new Date());
  const [ping, setPing] = useState('1.4s ago');
  const [cargo, setCargo] = useState('all');
  const [medOnly, setMedOnly] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date());
      if (Math.random() > 0.6) setPing(`${(Math.random() * 1.3 + 0.8).toFixed(1)}s ago`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const hh = String(clock.getHours()).padStart(2, '0');
  const mm = String(clock.getMinutes()).padStart(2, '0');
  const ss = String(clock.getSeconds()).padStart(2, '0');

  const rows = FREIGHT.filter((f) => !medOnly || f.id.startsWith('MED'));

  return (
    <ConsoleShell officer={officer}>
      <div className="flex flex-col w-full px-space-xl pb-space-3xl gap-space-xl">
        {/* Header + filter bar */}
        <header className="flex flex-col gap-space-md pt-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm">
                <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider">SEC-D1 · Realtime Matrix</span>
                <span className="text-outline text-label-sm">•</span>
                <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-secondary animate-pulse" />
                  ISRO Telemetry Sync: <strong className="font-telemetry-num text-telemetry-num text-on-surface">{ping}</strong>
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mt-1">Operations Center — Regional Transit Command</h1>
            </div>
            <div className="flex items-center gap-space-md">
              <div className="flex flex-col items-end px-space-md py-1 bg-surface-container rounded-lg">
                <span className="font-label-sm text-label-sm text-on-surface-variant">IST (UTC+05:30)</span>
                <span className="font-telemetry-num text-telemetry-num text-primary">{hh}:{mm}:{ss} hrs</span>
              </div>
              <button onClick={() => actions.toast('Regional Broadcast dispatched via Common Alerting Protocol (CAP) to 142,000 citizens in Kalimpong & Gangtok districts.')} className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-secondary text-on-secondary hover:bg-on-secondary-container transition-all shadow-sm">
                <Icon name="cell_tower" size={18} />
                <span className="font-label-md text-label-md font-semibold">Broadcast Regional Advisory</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm p-space-md bg-surface-container-lowest rounded-xl shadow-sm items-center">
            <div className="md:col-span-3 flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="state-selector">Jurisdiction (State / Zone)</label>
              <div className="relative">
                <select className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md appearance-none outline-none focus:bg-surface transition-colors cursor-pointer" id="state-selector" defaultValue="SK">
                  <option value="ALL">All 8 NE States (Sovereign Regional)</option>
                  <option value="AS">Assam (Brahmaputra Valley)</option>
                  <option value="AR">Arunachal Pradesh (Frontier Highways)</option>
                  <option value="MN">Manipur (Imphal East/West)</option>
                  <option value="ML">Meghalaya (Khasi/Garo Hills)</option>
                  <option value="MZ">Mizoram (Aizawl Corridor)</option>
                  <option value="NL">Nagaland (Kohima-Dimapur)</option>
                  <option value="SK">Sikkim (NH-10 Himalayan Corridor)</option>
                  <option value="TR">Tripura (Agartala Grid)</option>
                </select>
                <Icon name="expand_more" size={20} className="absolute right-2.5 top-2.5 pointer-events-none text-outline" />
              </div>
            </div>
            <div className="md:col-span-3 flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="highway-selector">Strategic Highway Corridors</label>
              <div className="relative">
                <select className="w-full h-10 px-3 pr-8 rounded-lg bg-surface-container-low text-on-surface font-label-md text-label-md appearance-none outline-none focus:bg-surface transition-colors cursor-pointer" id="highway-selector" defaultValue="NH-10">
                  <option value="ALL">All Corridors (Monitored Active)</option>
                  <option value="NH-10">NH-10 (Siliguri - Gangtok Arterial)</option>
                  <option value="NH-27">NH-27 (East-West Highspeed Expressway)</option>
                  <option value="NH-29">NH-29 (Dimapur - Kohima Segment)</option>
                  <option value="NH-37">NH-37 (Kaziranga Transit Bypass)</option>
                  <option value="NH-53">NH-53 (Silchar - Jiribam Backbone)</option>
                  <option value="NH-306">NH-306 (Vairengte - Aizawl Supply)</option>
                </select>
                <Icon name="alt_route" size={20} className="absolute right-2.5 top-2.5 pointer-events-none text-outline" />
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-1">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Consignment Priority Triage</label>
              <div className="flex items-center p-1 bg-surface-container-low rounded-lg gap-1">
                <button
                  onClick={() => { setCargo('all'); setMedOnly(false); }}
                  className={`flex-1 py-1.5 px-3 rounded-md font-label-md text-label-md text-center transition-all ${!medOnly ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm' : 'text-on-surface-variant hover:text-primary font-semibold'}`}
                >
                  All Manifests (412)
                </button>
                <button
                  onClick={() => { setMedOnly(true); setCargo('med'); }}
                  className={`flex-1 py-1.5 px-3 rounded-md font-label-md text-label-md text-center transition-all flex items-center justify-center gap-1.5 ${medOnly ? 'bg-tertiary-container text-on-tertiary font-semibold shadow-sm' : 'text-tertiary-container hover:text-tertiary font-semibold'}`}
                >
                  <span className="w-2 h-2 rounded-full bg-tertiary-container" />
                  Medical / Cryo Only (18)
                </button>
              </div>
            </div>
            <div className="md:col-span-2 flex items-end justify-end h-full pt-4 md:pt-0">
              <button onClick={() => actions.toast('GIS Matrix Nodes successfully synchronized with ISRO Bhuvan Geo-Portal.')} className="w-full h-10 px-3 rounded-lg bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md text-label-md flex items-center justify-center gap-1.5 transition-colors">
                <Icon name="sync" size={18} />
                <span>Sync GIS Nodes</span>
              </button>
            </div>
          </div>
        </header>

        {/* KPI banner */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
          {[
            { label: 'Active Freight in Transit', icon: 'local_shipping', iconCls: 'text-primary', value: '412', valueCls: 'text-primary', delta: '+6.4% load', deltaCls: 'text-secondary', foot: <span>34 highland convoys</span>, chip: '18 Medical Priority', chipCls: 'bg-tertiary-container text-on-tertiary' },
            { label: 'Critical Blockages', icon: 'warning', iconCls: 'text-error', value: '04', valueCls: 'text-error', delta: 'Sector Hold Active', deltaCls: 'text-error', chips: [['2 Red Slides', 'bg-error-container text-on-error-container'], ['1 Flash Flood', 'bg-surface-container-high text-on-surface'], ['1 PWD Maint', 'bg-surface-container text-on-surface-variant']] },
            { label: 'Dynamic Bypass Diversions', icon: 'fork_right', iconCls: 'text-tertiary', value: '19', valueCls: 'text-primary', delta: 'Corridors rerouted', deltaCls: 'text-secondary', foot: <span>Avg Delay: +38 mins</span>, foot2: '94.1% clearance' },
            { label: 'Corridor Cleared (24h)', icon: 'construction', iconCls: 'text-secondary', value: '142.6', valueCls: 'text-secondary', unit: 'KM Restored', foot: <span>BRO Swastik &amp; PWD Hill Wings</span>, chip: '8 Depots Active', chipCls: 'bg-secondary-container text-on-secondary-container' },
          ].map((k, i) => (
            <Card key={k.label} style={{ animationDelay: `${i * 70}ms` }} className="p-space-lg flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span className="font-label-sm text-label-sm uppercase tracking-wide">{k.label}</span>
                <Icon name={k.icon} size={22} className={k.iconCls} />
              </div>
              <div className="mt-space-sm flex items-baseline gap-space-sm">
                <span className={`font-display text-display tracking-tight ${k.valueCls}`}>{k.value}</span>
                {k.unit && <span className="font-label-md text-label-md text-on-surface font-semibold">{k.unit}</span>}
                {k.delta && <span className={`font-label-sm text-label-sm font-semibold ${k.deltaCls}`}>{k.delta}</span>}
              </div>
              <div className="mt-space-sm pt-space-xs flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                {k.foot}
                {k.foot2 && <span className="font-telemetry-num text-telemetry-num text-secondary font-semibold">{k.foot2}</span>}
                {k.chip && <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${k.chipCls}`}>{k.chip}</span>}
              </div>
              {k.chips && (
                <div className="mt-space-sm pt-space-xs flex items-center gap-space-xs font-label-sm text-label-sm flex-wrap">
                  {k.chips.map(([t, cls]) => <span key={t} className={`px-1.5 py-0.5 rounded font-semibold ${cls}`}>{t}</span>)}
                </div>
              )}
            </Card>
          ))}
        </section>

        {/* Main split view */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Tactical map */}
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm flex flex-col overflow-hidden">
            <div className="p-space-md bg-surface-container-low flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-sm">
                <Icon name="layers" size={20} className="text-primary" />
                <span className="font-headline-sm text-headline-sm text-primary">Sovereign GIS Dynamic Map Engine</span>
                <span className="px-2 py-0.5 rounded bg-surface-container-highest text-primary font-label-sm text-label-sm">ISRO-Bhuvan Vector v4.2</span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {['IMD Radar', 'Inclinometers', 'Medical Convoys', 'BRO Depots'].map((l) => (
                  <label key={l} className="flex items-center gap-1 px-2.5 py-1 bg-surface-container-lowest rounded text-on-surface font-label-sm text-label-sm cursor-pointer shadow-sm select-none">
                    <input defaultChecked className="accent-primary rounded cursor-pointer" type="checkbox" />
                    <span>{l}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="relative w-full h-[520px] bg-surface-container overflow-hidden">
              <MapCanvas
                center={[26.85, 90.3]}
                zoom={7}
                corridors={[
                  ...NH27_PTS.map((p) => ({ points: p, tier: 1, label: 'NH-27 [Clear • 78 km/h nominal]' })),
                  ...NH29_PTS.map((p) => ({ points: p, tier: 3, label: 'NH-29 [Sludge Trap · 20 km/h restricted]' })),
                  ...NH10_PTS.map((p, i) => ({ points: p, tier: [1, 4, 1][i], label: 'NH-10 Teesta corridor' })),
                  { points: BYPASS_PTS[0], tier: 4, label: 'Active Bypass (Lava Sector)' },
                ]}
                markers={[
                  { lat: 27.08, lon: 88.58, tier: 4, label: 'Pagla Jhora · Km 42', note: 'IMD TIER-4 RED · 14 freight halted · JCB-300 ETA 22m' },
                  { lat: 25.78, lon: 93.68, tier: 3, label: 'Chumukedima · NH-29', note: 'Single lane crawl. Speed cap 20 km/h.' },
                  { lat: 27.02, lon: 88.6, tier: 4, label: 'CONVOY MED-0982 · RE-ROUTING', note: 'Oxygen cryogenic, escorted' },
                  { lat: 27.0, lon: 88.7, tier: 1, label: 'BRO Sector HQ', note: 'Excavator fleet on standby' },
                ]}
              />
              {/* Floating HUD legend */}
              <div className="absolute bottom-3 left-3 p-space-sm bg-surface-container-lowest/95 backdrop-blur-md rounded-lg shadow-md flex flex-col gap-1 max-w-[260px] z-[500]">
                <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">IMD 4-Tier Severity Key</span>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
                  {[['#1B5E20', 'Tier 1: Clear'], ['#946200', 'Tier 2: Caution'], ['#9A3412', 'Tier 3: Prepared'], ['#8A1F11', 'Tier 4: Blocked']].map(([c, l]) => (
                    <div key={l} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      <span className="font-label-sm text-label-sm text-on-surface">{l}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Zoom cluster */}
              <div className="absolute top-3 right-3 flex flex-col gap-1 bg-surface-container-lowest rounded-lg shadow-md p-1 z-[500]">
                <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container text-primary font-bold transition-colors" title="Zoom in"><Icon name="add" size={18} /></button>
                <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container text-primary font-bold transition-colors" title="Zoom out"><Icon name="remove" size={18} /></button>
                <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-surface-container text-primary transition-colors" title="Recenter to Sikkim Teesta Valley"><Icon name="my_location" size={18} /></button>
              </div>
            </div>

            {/* Corridor ribbon */}
            <div className="p-space-md bg-surface-container-low flex flex-col gap-space-xs">
              <div className="flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                <span className="font-semibold text-primary">Strategic Corridor Health Index (Sequential Chainage)</span>
                <span className="font-telemetry-num text-telemetry-num">NH-10 (Siliguri → Sevoke → Teesta → Rangpo → Gangtok)</span>
              </div>
              <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden flex">
                {RIBBON_NH10.map((r) => <div key={r.title} className={`h-full ${r.cls}`} style={{ width: `${r.pct}%` }} title={r.title} />)}
              </div>
              <div className="flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm pt-1">
                <span>0 km</span>
                <span className="text-error font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-error" /> km 42 Major Slope Failure
                </span>
                <span>92 km (Gangtok)</span>
              </div>
            </div>
          </div>

          {/* Incident feed */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <Icon name="fmd_bad" size={20} className="text-error" />
                <h2 className="font-headline-sm text-headline-sm text-primary">Live Disruptions &amp; Action Feed</h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-label-sm font-semibold">4 Critical / Active</span>
            </div>
            <div className="flex flex-col gap-space-sm max-h-[610px] overflow-y-auto pr-1">
              {INCIDENTS.map((inc) => (
                <article key={inc.id} className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm flex flex-col gap-space-sm relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-imd${inc.tier}`} />
                  <div className="flex items-center justify-between pl-1">
                    <div className="flex items-center gap-space-sm">
                      <StatusPill tier={inc.tier} label={`IMD TIER-${inc.tier} (${{ 1: 'GREEN', 2: 'YELLOW', 3: 'ORANGE', 4: 'RED' }[inc.tier]})`} />
                      <span className="font-telemetry-num text-telemetry-num text-xs text-on-surface-variant">{inc.time}</span>
                    </div>
                    {inc.tier === 4 ? (
                      <button onClick={() => actions.toast(`Field teams ack: ${inc.title}. Barrier protocol armed via FASTag & Vahan network.`)} className="px-2.5 py-1 rounded bg-error text-on-error hover:bg-on-error-container font-label-sm text-label-sm font-semibold transition-colors">Take Action</button>
                    ) : (
                      <span className={`font-label-sm text-label-sm font-semibold ${inc.tier === 3 ? 'text-imd3-text' : inc.tier === 2 ? 'text-imd2-text' : 'text-imd1-text'}`}>{inc.tier === 3 ? 'Be Prepared' : inc.tier === 2 ? 'Watch & Monitor' : 'No Action Needed'}</span>
                    )}
                  </div>
                  <div className="pl-1">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">{inc.title}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">{inc.body}</p>
                  </div>
                  {inc.team && (
                    <div className="pl-1 grid grid-cols-2 gap-space-sm bg-surface-container-low p-space-sm rounded-lg font-body-sm text-body-sm">
                      <div>
                        <span className="text-on-surface-variant block font-label-sm text-label-sm">BRO Clearing Team</span>
                        <span className="font-semibold text-primary">{inc.team}</span>
                      </div>
                      <div>
                        <span className="text-on-surface-variant block font-label-sm text-label-sm">Dynamic Bypass</span>
                        <span className="font-semibold text-tertiary-container">{inc.bypass}</span>
                      </div>
                    </div>
                  )}
                  {inc.speed && (
                    <div className="pl-1 flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                      <span>{inc.foot}</span>
                      <span className="font-telemetry-num text-telemetry-num text-primary">{inc.speed}</span>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Freight telemetry table */}
        <section className="flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-space-md pb-space-sm">
            <div className="flex flex-col">
              <div className="flex items-center gap-space-sm">
                <Icon name="database" size={22} className="text-primary" />
                <h2 className="font-headline-md text-headline-md text-primary">Critical Freight Telemetry &amp; Clearance Dispatch</h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Live transponder stream with automated IMD slope predictive hazard assignment.</p>
            </div>
            <div className="flex items-center gap-space-sm flex-wrap">
              <button onClick={() => actions.toast('Sector Halt Transmitted: Regional highway barriers activated via FASTag & Vahan Network.')} className="px-space-md py-2 rounded-lg bg-error text-on-error hover:bg-on-error-container font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
                <Icon name="stop_circle" size={18} />
                <span>Issue Dispatch Halt</span>
              </button>
              <button onClick={() => actions.toast('Bypass Protocol Authorized: 19 convoys queued on NH-10 diverted through Lava - Gorubathan Corridor.')} className="px-space-md py-2 rounded-lg bg-primary-container text-on-primary hover:bg-primary font-label-md text-label-md font-semibold transition-colors flex items-center gap-1.5 shadow-sm">
                <Icon name="alt_route" size={18} />
                <span>Approve Dynamic Bypass</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left font-body-sm text-body-sm whitespace-nowrap">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                  <th className="py-3 px-space-md rounded-l-lg">Consignment ID</th>
                  <th className="py-3 px-space-md">Cargo Classification</th>
                  <th className="py-3 px-space-md">Route (Origin → Destination)</th>
                  <th className="py-3 px-space-md">Current Location</th>
                  <th className="py-3 px-space-md">Comms &amp; Transponder</th>
                  <th className="py-3 px-space-md text-center">Predicted Risk Tier</th>
                  <th className="py-3 px-space-md rounded-r-lg text-right">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/40">
                {rows.map((f) => (
                  <tr key={f.id} className="hover:bg-surface-container-low transition-colors bg-surface-container-lowest">
                    <td className="py-3 px-space-md font-telemetry-num text-telemetry-num text-primary font-bold">{f.id}</td>
                    <td className="py-3 px-space-md">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${f.pill}`}>
                        <Icon name={f.icon} size={14} />
                        {f.cargo}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-on-surface">{f.route}</td>
                    <td className="py-3 px-space-md font-telemetry-num text-telemetry-num text-on-surface">{f.loc}</td>
                    <td className="py-3 px-space-md">
                      <span className={`flex items-center gap-1 font-label-sm text-label-sm font-semibold ${f.commsText}`}>
                        <span className={`w-2 h-2 rounded-full ${f.commsDot}`} />
                        {f.comms}
                      </span>
                    </td>
                    <td className="py-3 px-space-md text-center"><StatusPill tier={f.risk.tier} label={f.risk.label} /></td>
                    <td className="py-3 px-space-md text-right">
                      {f.action.type === 'button' ? (
                        <button onClick={() => actions.toast(`${f.id} diverted to Gorubathan Pass — new chainage stream live.`)} className="px-2.5 py-1 rounded bg-primary-container text-on-primary hover:bg-primary font-label-sm text-label-sm font-semibold transition-colors">{f.action.text}</button>
                      ) : (
                        <span className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold ${f.action.cls}`}>{f.action.text}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant font-body-sm text-body-sm">
            <div className="flex items-center gap-space-md">
              <span>Showing <strong>{rows.length}</strong> of 412 strategic manifests</span>
              <span>•</span>
              <span className="text-tertiary font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-tertiary" />
                Prioritizing 18 Life-Critical Oxygen &amp; Vaccine Transits
              </span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button className="px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold">Previous</button>
              <button className="px-2 py-1 rounded bg-primary text-on-primary text-xs font-semibold">1</button>
              <button className="px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold">2</button>
              <button className="px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold">3</button>
              <button className="px-2 py-1 rounded bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold">Next</button>
            </div>
          </div>
        </section>
      </div>
    </ConsoleShell>
  );
}
