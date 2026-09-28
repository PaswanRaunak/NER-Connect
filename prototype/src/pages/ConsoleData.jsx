import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ConsoleShell, Icon, StatusPill, Card } from '../components/ui.jsx';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { useStore } from '../state/store.jsx';
import { OFFICER, DISTRICT, SEVERITY_MATRIX, VULNERABILITY } from '../lib/data.js';

/* ============================================================
   SCREEN 11 — District Detail: Pakyong & East Sikkim
   ============================================================ */
export function DistrictDetail() {
  const { actions } = useStore();
  const [layer, setLayer] = useState('Slope Risk');

  return (
    <ConsoleShell officer={OFFICER.console}>
      <div className="p-space-lg flex flex-col gap-space-lg max-w-[1720px] mx-auto w-full">
        {/* Header */}
        <Card className="p-space-lg flex flex-col gap-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <nav aria-label="Breadcrumb" className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <Link className="hover:text-primary transition-colors flex items-center gap-1" to="/console">
                <Icon name="radar" size={16} />
                Operations Center
              </Link>
              <span className="text-outline-variant font-bold">/</span>
              <Link className="hover:text-primary transition-colors" to="/console">District Matrix</Link>
              <span className="text-outline-variant font-bold">/</span>
              <span className="text-on-surface font-semibold">Sikkim — Pakyong &amp; Gangtok Corridor</span>
            </nav>
            <div className="flex items-center gap-space-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-imd4-bg text-imd4-text">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">IMD RED ALERT · TAKE ACTION — SEVERE LANDSLIDE WATCH</span>
              </div>
              <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                <span className="font-label-sm text-label-sm font-semibold">NavIC Telemetry 100% Locked</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-space-sm">
                <span className="w-3 h-8 bg-error rounded-full inline-block" />
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">{DISTRICT.title}</h1>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant pl-4">{DISTRICT.sub}</p>
            </div>
            <div className="flex flex-wrap items-center gap-space-sm">
              <button onClick={() => actions.toast('Incident briefing compiled (PDF) and queued for the DC war room distribution list.')} className="inline-flex items-center gap-2 px-space-md py-2 bg-surface-container-lowest text-on-surface rounded-lg shadow-sm hover:bg-surface-container-low transition-colors font-label-lg text-label-lg border border-struct-border" type="button">
                <Icon name="picture_as_pdf" size={18} />
                Export Incident Briefing (PDF)
              </button>
              <button onClick={() => actions.toast('BRO emergency bailey unit 758 BRTF rolling from Melli depot — ETA 48 mins.')} className="inline-flex items-center gap-2 px-space-md py-2 bg-tertiary-container text-on-tertiary rounded-lg shadow-sm hover:bg-tertiary transition-colors font-label-lg text-label-lg" type="button">
                <Icon name="engineering" size={18} />
                Deploy BRO Emergency Bailey Unit
              </button>
              <button onClick={() => actions.toast('DC War Room notified over microwave trunk + SACHET CAP broadcast.')} className="inline-flex items-center gap-2 px-space-md py-2 bg-error text-on-error rounded-lg shadow-sm hover:bg-on-error-container transition-colors font-label-lg text-label-lg" type="button">
                <Icon name="crisis_alert" size={18} className="animate-pulse" />
                Notify DC War Room
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-lg p-space-md grid grid-cols-2 md:grid-cols-4 gap-space-md">
            {DISTRICT.meta.map((m) => (
              <div key={m.label} className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">{m.label}</span>
                <span className={`font-headline-sm text-headline-sm ${m.cls || 'text-primary'} flex items-center gap-1`}>
                  {m.icon && <Icon name={m.icon} size={18} className={m.iconCls} />}
                  {m.value}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* KPI cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-space-md">
          {DISTRICT.kpis.map((k) => {
            const tone = k.tone === 'error'
              ? { value: 'text-error', bg: 'bg-gradient-to-br from-surface-container-lowest via-error-container/20 to-surface-container-lowest', foot: 'bg-error-container/50 text-on-error-container', icon: 'text-error animate-bounce' }
              : k.tone === 'tertiary'
                ? { value: 'text-tertiary-container', foot: 'bg-surface-container-low text-on-surface-variant', icon: 'text-tertiary' }
                : k.footTone === 'warn'
                  ? { value: 'text-on-surface', foot: 'bg-imd3-bg text-imd3-text', icon: 'text-on-surface' }
                  : k.footTone === 'error'
                    ? { value: 'text-on-surface', foot: 'bg-imd4-bg text-imd4-text', icon: 'text-primary' }
                    : { value: 'text-primary', foot: 'bg-surface-container-low text-on-surface-variant', icon: 'text-primary' };
            return (
              <Card key={k.label} className={`p-space-md flex flex-col justify-between ${tone.bg ?? ''}`}>
                <div className="flex items-center justify-between text-on-surface-variant">
                  <span className={`font-label-md text-label-md uppercase tracking-wider font-semibold ${k.tone === 'error' ? 'text-error' : ''}`}>{k.label}</span>
                  <Icon name={k.icon} size={20} className={tone.icon} />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className={`font-display text-display font-telemetry-num ${tone.value}`}>{k.value}</span>
                  <span className={`font-label-lg text-label-lg ${k.tone === 'tertiary' ? 'text-error font-semibold' : 'text-on-surface-variant'}`}>{k.unit}</span>
                </div>
                <div className={`mt-2 pt-2 rounded p-1.5 flex items-center justify-between font-label-sm text-label-sm ${tone.foot}`}>
                  <span className="truncate">{k.foot[0]}</span>
                  <span className="font-semibold truncate ml-1">{k.foot[1]}</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main sector grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          <div className="xl:col-span-7 flex flex-col gap-space-md">
            <Card className="p-space-lg flex flex-col gap-space-md">
              <div className="flex flex-wrap items-center justify-between gap-space-sm">
                <div className="flex items-center gap-space-sm">
                  <Icon name="map" size={24} className="text-primary" />
                  <div className="flex flex-col">
                    <span className="font-headline-sm text-headline-sm text-on-surface">Tactical Corridor GIS: NH-10 Teesta Gorge</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Sevoke → Melli → Rangpo → Singtam → Gangtok / Pakyong Bypass</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg">
                  {['Slope Risk', 'Equipment', 'Inclinometers'].map((l) => (
                    <button key={l} onClick={() => setLayer(l)} className={`px-2.5 py-1 rounded font-label-sm text-label-sm font-semibold ${layer === l ? 'text-on-primary bg-primary shadow-xs' : 'text-on-surface hover:bg-surface-container-highest'}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative w-full h-[520px] rounded-xl overflow-hidden shadow-sm bg-surface-container-highest">
                <MapCanvas
                  center={[27.0, 88.56]}
                  zoom={10}
                  corridors={[
                    { points: [[26.71, 88.43], [26.85, 88.57]], tier: 1, label: 'Sevoke → Rangpo (Nominal)' },
                    { points: [[26.85, 88.57], [26.98, 88.58]], tier: 3, label: 'Rangpo → Singtam (Slow crawl)' },
                    { points: [[26.98, 88.58], [27.08, 88.58]], tier: 4, label: 'Km 42 Pagla Jhora (SEVERED)' },
                    { points: [[27.08, 88.58], [27.2, 88.6], [27.33, 88.61]], tier: 2, label: 'Ranipool 1-lane → Gangtok' },
                  ]}
                  markers={[
                    { lat: 27.08, lon: 88.58, tier: 4, label: 'Km 42.4 Pagla Jhora', note: '65m carriageway gone · mud torrent active · 24.2°/hr drift' },
                    { lat: 26.98, lon: 88.58, tier: 3, label: 'Singtam Slump (Km 38)', note: 'Light vehicles only. Crawl speed 10 km/h.' },
                    { lat: 26.85, lon: 88.57, tier: 1, label: 'Rangpo Checkpost (Km 51)', note: 'Toll & inspection normal · outflow cleared' },
                  ]}
                />
                {/* Teesta gauge card */}
                <div className="absolute top-4 left-4 z-[500] bg-surface/90 backdrop-blur-md rounded-lg p-space-sm shadow-md flex flex-col gap-1 max-w-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
                    <span className="font-label-md text-label-md font-semibold text-primary">Teesta Water Level Monitor</span>
                  </div>
                  <div className="flex justify-between items-baseline font-telemetry-num text-telemetry-num">
                    <span className="text-on-surface-variant font-body-sm text-body-sm">Singtam Gauge:</span>
                    <span className="text-error font-bold">298.40 m (Danger: 299.00 m)</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
                {/* Equipment pins */}
                {layer !== 'Slope Risk' || true ? (
                  <>
                    <div className="absolute top-[52%] left-[67%] z-[500]">
                      <div className="bg-primary text-on-primary px-2 py-1 rounded-md shadow-md flex items-center gap-1 text-[11px] font-semibold">
                        <Icon name="precision_manufacturing" size={14} className="text-secondary-fixed" />
                        JCB #4 (Singtam)
                      </div>
                    </div>
                    <div className="absolute bottom-[28%] left-[22%] z-[500]">
                      <div className="bg-primary text-on-primary px-2 py-1 rounded-md shadow-md flex items-center gap-1 text-[11px] font-semibold">
                        <Icon name="front_loader" size={14} className="text-secondary-fixed" />
                        BRO Dozer #12 (Melli)
                      </div>
                    </div>
                  </>
                ) : null}
                {/* Legend */}
                <div className="absolute bottom-3 right-3 z-[500] bg-surface/90 backdrop-blur-md rounded-lg p-space-sm shadow-md flex flex-col gap-1.5">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface uppercase tracking-wider">IMD Passability Key</span>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    {[['#2E8B57', 'Nominal / Clear'], ['#E8A317', 'Watch (Single)'], ['#E8590C', 'Alert (Crawling)'], ['#C0392B', 'Closed / Severed']].map(([c, l]) => (
                      <div key={l} className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c }} /><span>{l}</span></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Passability ribbon */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                  <span>Linear Passability Ribbon (NH-10 Sevoke to Gangtok &amp; Pakyong)</span>
                  <span className="font-telemetry-num text-error">42.4 km / 92 km Severed</span>
                </div>
                <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden flex">
                  <div className="h-full bg-imd1" style={{ width: '38%' }} title="Sevoke to Rangpo: Clear" />
                  <div className="h-full bg-imd3" style={{ width: '14%' }} title="Rangpo to Singtam Km 38: Slow Crawl" />
                  <div className="h-full bg-imd4 animate-pulse" style={{ width: '18%' }} title="Singtam to 20th Mile Km 42: Severed" />
                  <div className="h-full bg-imd2" style={{ width: '12%' }} title="Ranipool: 1 Lane" />
                  <div className="h-full bg-imd1" style={{ width: '18%' }} title="Gangtok Metro: Clear" />
                </div>
                <div className="flex justify-between text-[11px] text-on-surface-variant font-telemetry-num">
                  <span>Km 0 (Sevoke)</span>
                  <span>Km 38 (Singtam)</span>
                  <span className="text-error font-bold">Km 42 (Pagla Jhora)</span>
                  <span>Km 65 (Ranipool)</span>
                  <span>Km 92 (Gangtok)</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="xl:col-span-5 flex flex-col gap-space-md">
            <Card className="p-space-md flex flex-col gap-space-sm bg-gradient-to-r from-error-container/15 via-surface-container-lowest to-surface-container-lowest">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <StatusPill tier={4} label="IMD RED · CLOSURE 3h 40m" className="font-bold" />
                    <span className="font-telemetry-num text-telemetry-num text-xs text-on-surface-variant">INC-SKM-2024-89</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mt-1">Pagla Jhora Km 42.4 — Mudslide &amp; Debris Accumulation</h2>
                </div>
                <Icon name="crisis_alert" size={24} className="text-error" />
              </div>
              <div className="text-body-md font-body-md text-on-surface-variant text-sm">
                Road severed across <span className="font-semibold text-on-surface font-telemetry-num">65 meters</span>. Continuous rockfall and high-viscosity silt active from ridge 240m above. Direct transit between Siliguri and Gangtok halted.
              </div>
              <div className="bg-surface-container-low rounded-lg p-2.5 flex flex-col gap-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface flex items-center gap-1">
                    <Icon name="front_loader" size={16} className="text-primary" />
                    Equipment on Site:
                  </span>
                  <span className="font-telemetry-num text-primary">2x JCB-300 · 1x PWD Tipper</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-on-surface-variant">Target Carriageway Clearance:</span>
                  <span className="font-telemetry-num font-bold text-error">Today ~16:30 IST</span>
                </div>
                <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: '45%' }} />
                </div>
              </div>
              <div className="bg-surface-container p-2 rounded-lg text-xs flex items-start gap-2">
                <Icon name="alt_route" size={16} className="text-on-surface-variant mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface">Traffic Diversion Active:</span>
                  <span className="text-on-surface-variant">Light vehicles rerouted via Melli → Jorethang → Singtam alternate. Freight vehicles holding at Siliguri North Bengal terminal.</span>
                </div>
              </div>
            </Card>

            <Card className="p-space-md flex flex-col gap-space-sm bg-gradient-to-r from-imd2-bg via-surface-container-lowest to-surface-container-lowest">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <StatusPill tier={2} label="IMD ORANGE · SINGLE LANE" className="font-bold" />
                    <span className="font-telemetry-num text-telemetry-num text-xs text-on-surface-variant">INC-SKM-2024-91</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface mt-1">Ranipool Bridge Approach — Riverbank Scour</h2>
                </div>
                <Icon name="warning" size={24} className="text-imd3" />
              </div>
              <div className="text-body-md font-body-md text-on-surface-variant text-sm">
                Teesta tributary high-velocity scour near pier 2 foundation. Left approach abutment reinforced with wire crates. Bridge structural load monitors indicate <span className="font-semibold text-on-surface font-telemetry-num">nominal integrity</span> for gross vehicles under 15T.
              </div>
              <div className="flex items-center justify-between text-xs bg-surface-container-low p-2 rounded">
                <span className="text-on-surface-variant">Hydrological Margin:</span>
                <span className="font-telemetry-num font-semibold text-primary">0.8m below High Flood Level (HFL)</span>
              </div>
            </Card>

            <Card className="p-space-md flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Icon name="sensors" size={20} className="text-primary" />
                  <span className="font-headline-sm text-headline-sm text-on-surface">Slope Sensor Telemetry (Bhuvan IOT)</span>
                </div>
                <span className="font-label-sm text-label-sm text-secondary font-semibold">Live 1 Hz</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body-sm text-body-sm">
                  <thead className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase">
                    <tr>
                      <th className="py-1.5 px-2 rounded-l">Sensor ID</th>
                      <th className="py-1.5 px-2">Geological Zone</th>
                      <th className="py-1.5 px-2 text-right">Displacement Rate</th>
                      <th className="py-1.5 px-2 text-center rounded-r">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low font-telemetry-num">
                    {DISTRICT.sensors.map((s) => (
                      <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="py-2 px-2 font-bold text-on-surface">{s.id}</td>
                        <td className="py-2 px-2 text-on-surface-variant">{s.zone}</td>
                        <td className={`py-2 px-2 text-right font-semibold ${s.rateCls}`}>{s.rate}</td>
                        <td className="py-2 px-2 text-center">
                          <span className={`px-2 py-0.5 rounded-full font-semibold text-[10px] ${s.cls}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>

        {/* Trend chart + emergency desk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mb-6">
          <Card className="lg:col-span-7 p-space-lg flex flex-col justify-between gap-space-md">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface">7-Day Rainfall vs. Average Road Clearance Duration</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Empirical correlation between cumulative precipitation &amp; debris clearance time</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1 text-primary"><span className="w-3 h-3 rounded-xs bg-primary inline-block" /> Rainfall (mm)</span>
                <span className="flex items-center gap-1 text-imd3"><span className="w-3 h-1 bg-imd3 inline-block" /> Clearance Time (hrs)</span>
              </div>
            </div>
            <div className="w-full h-56 pt-2">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 680 180">
                <line stroke="#E2E8F0" strokeDasharray="3 3" x1="40" x2="660" y1="20" y2="20" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" x1="40" x2="660" y1="60" y2="60" />
                <line stroke="#E2E8F0" strokeDasharray="3 3" x1="40" x2="660" y1="100" y2="100" />
                <line stroke="#E2E8F0" x1="40" x2="660" y1="140" y2="140" />
                {[['120', '24'], ['80', '64'], ['40', '104'], ['0', '144']].map(([v, y]) => (
                  <text key={y} className="text-[10px] fill-current text-on-surface-variant font-telemetry-num" textAnchor="end" x="32" y={y}>{v}</text>
                ))}
                {[[75, 110, 30], [160, 95, 45], [245, 75, 65], [330, 85, 55], [415, 50, 90], [500, 38, 102]].map(([x, y, h]) => (
                  <rect key={x} fill="#004349" height={h} opacity="0.8" rx="3" width="28" x={x} y={y} />
                ))}
                <rect fill="#BA1A1A" height="115" opacity="0.85" rx="3" width="28" x="585" y="25" />
                <polyline fill="none" points="89,130 174,122 259,110 344,115 429,80 514,60 599,42" stroke="#E8590C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                {[[89, 130], [174, 122], [259, 110], [344, 115], [429, 80], [514, 60]].map(([x, y]) => <circle key={x} cx={x} cy={y} fill="#E8590C" r="3.5" />)}
                <circle cx="599" cy="42" fill="#BA1A1A" r="4.5" />
                {['Mon (18mm)', 'Tue (32mm)', 'Wed (48mm)', 'Thu (40mm)', 'Fri (75mm)', 'Sat (92mm)'].map((d, i) => (
                  <text key={d} className="text-[11px] fill-current text-on-surface-variant font-telemetry-num" textAnchor="middle" x={89 + i * 85} y="160">{d}</text>
                ))}
                <text className="text-[11px] fill-current text-error font-bold font-telemetry-num" textAnchor="middle" x="599" y="160">Today (114mm)</text>
              </svg>
            </div>
            <div className="bg-surface-container-low rounded-lg p-space-sm flex items-center gap-space-sm">
              <Icon name="smart_toy" size={22} className="text-tertiary-container" />
              <p className="font-body-sm text-body-sm text-on-surface">
                <span className="font-bold text-tertiary">NER-Connect AI Sentinel:</span> Predictive early warning delivered an alert <span className="font-telemetry-num font-bold text-primary">4.2 hours</span> before structural slope displacement at Km 42, allowing preemptive closure and averting casualties along the heavy convoy corridor.
              </p>
            </div>
          </Card>

          <Card className="lg:col-span-5 p-space-lg flex flex-col justify-between gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name="contact_phone" size={22} className="text-primary" />
                <span className="font-headline-sm text-headline-sm text-on-surface">District Emergency Desk Matrix</span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Pakyong War Room</span>
            </div>
            <div className="flex flex-col gap-2 font-body-sm text-body-sm">
              {DISTRICT.contacts.map((c) => (
                <div key={c.role} className="p-space-sm bg-surface-container rounded-lg flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface">{c.role}</span>
                    <span className="text-on-surface-variant text-xs">{c.org}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-telemetry-num text-telemetry-num text-primary font-bold">{c.phone}</span>
                    <a className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-primary-container transition-colors" href={`tel:${c.phone.replace(/\D/g, '')}`}>
                      <Icon name="call" size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-surface-container-low rounded-lg p-2 flex items-center justify-between text-xs text-on-surface-variant">
              <span className="flex items-center gap-1 font-semibold text-primary">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
                Direct Microwave Link Verified
              </span>
              <span className="font-telemetry-num">Packet Loss: 0.00%</span>
            </div>
          </Card>
        </div>
      </div>
    </ConsoleShell>
  );
}

/* ============================================================
   SCREEN 12 — Analytics & Macro Impact
   ============================================================ */
export function Analytics() {
  const { actions } = useStore();
  const [season, setSeason] = useState('active');

  return (
    <ConsoleShell officer={OFFICER.console}>
      <div className="flex flex-col w-full">
        {/* Header */}
        <section className="w-full px-margin-lg py-space-xl bg-surface-container-low">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-lg">
            <div className="flex flex-col gap-space-xs max-w-4xl">
              <div className="flex items-center gap-space-sm flex-wrap">
                <span className="px-space-sm py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase tracking-wider">MDoNER Section D3</span>
                <span className="px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" /> Live ISRO Geo-Analytics
                </span>
                <span className="font-telemetry-num text-telemetry-num text-on-surface-variant">Archival Synced: 2024-Q3 Macro Sweep</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Analytics &amp; Macro Impact — Regional Transit Resiliency</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">MDoNER Multi-Year Highway Efficiency, Disaster Mitigation, and Supply Chain Uptime Telemetry across the 8 Northeastern Sister States.</p>
            </div>
            <div className="flex items-center gap-space-md shrink-0">
              <button
                onClick={(e) => {
                  const b = e.currentTarget;
                  b.disabled = true;
                  const orig = b.innerHTML;
                  b.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>Compiling MDoNER Telemetry...</span>';
                  setTimeout(() => {
                    b.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span><span>Report Ready (PDF Dispatched)</span>';
                    setTimeout(() => { b.innerHTML = orig; b.disabled = false; }, 2600);
                  }, 1200);
                }}
                className="bg-primary-container hover:bg-primary text-on-primary px-space-lg py-space-sm rounded-lg font-label-lg text-label-lg shadow-sm flex items-center gap-space-sm transition-all active:scale-[0.99]"
              >
                <Icon name="picture_as_pdf" size={18} />
                <span>Generate MDoNER Parliamentary Standing Committee Report</span>
              </button>
            </div>
          </div>

          <div className="mt-space-lg bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
            <div className="flex flex-wrap items-center gap-space-md">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Analytical Horizon</span>
                <div className="inline-flex rounded-lg bg-surface-container p-0.5">
                  {[['active', 'Monsoon Season 2024 (Jun 01 - Oct 31)'], ['baseline', 'Pre-AI Baseline (Monsoon 2022-2023)']].map(([k, l]) => (
                    <button
                      key={k}
                      onClick={() => setSeason(k)}
                      className={`px-space-md py-1.5 rounded-md font-label-md text-label-md transition-all ${season === k ? 'bg-surface-container-lowest text-primary shadow-sm font-semibold' : 'text-on-surface-variant hover:text-on-surface'}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block w-px h-8 bg-surface-container-high" />
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">State Corridor Scope</span>
                <div className="flex items-center gap-space-xs flex-wrap">
                  {['All 8 States', 'Assam', 'Arunachal', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Sikkim', 'Tripura'].map((s, i) => (
                    <button key={s} className={`px-space-sm py-1 rounded-md font-label-sm text-label-sm transition-colors ${i === 0 ? 'text-on-primary bg-primary' : 'text-on-surface-variant bg-surface-container hover:bg-surface-container-high'}`}>{s}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-space-sm justify-end text-on-surface-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1">
                <Icon name="verified" size={15} className="text-secondary" /> Baseline Delta Verified: NIC Engine
              </span>
              <button className="p-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary" title="Refresh Telemetry">
                <Icon name="sync" size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* KPI cards */}
        <section className="w-full px-margin-lg py-space-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter-lg">
            {[
              { tag: 'Corridor Throughput', h: 'Avg. Transit Delay Reduced', icon: 'speed', iconCls: 'bg-secondary-container/60 text-on-secondary-container', value: '-28.4%', valueCls: 'text-secondary', pill: 'Net Improvement', pillCls: 'bg-secondary-container text-on-secondary-container', line: <span>Saved <strong className="text-on-surface font-semibold">4.8 hrs</strong> per commercial freight run across hilly sectors</span>, foot: ['NH-10, NH-29 & NH-37 Aggregated', '142 hrs saved/wk'] },
              { tag: 'NISAR SAR Radar & Bhuvan', h: 'AI Landslide Predictions Verified', icon: 'landslide', iconCls: 'bg-primary-container/20 text-primary', value: '91.8%', unit: 'Accuracy', line: <span><strong className="text-on-surface font-semibold">142 of 155</strong> slope instabilities pre-emptively flagged &gt;3h in advance</span>, foot: ['Mean False Positive: 8.2%', 'P-Value <0.001'] },
              { tag: 'Crowdsource Telemetry', h: 'Citizen & Ground Reports', icon: 'rss_feed', iconCls: 'bg-surface-container-high text-primary', value: '18,490', pill: 'Verified', pillCls: 'bg-secondary-container text-on-secondary-container', line: <span><strong className="text-on-surface font-semibold">3,210</strong> received via offline SMS 56161 gateway</span>, foot: ['Gram Panchayat Sync: Active', 'Avg Latency: 4.1 min'] },
              { tag: 'Critical Life Line Transit', h: 'Medical Convoy Transit', icon: 'emergency', iconCls: 'bg-tertiary-container/10 text-tertiary-container', value: '99.6%', valueCls: 'text-tertiary-container', pill: 'On-Schedule', pillCls: 'bg-tertiary-fixed text-on-tertiary-fixed', accent: '#2C18B5', line: <span><strong className="text-tertiary-container font-semibold">412</strong> cryogenic & vaccine runs without cold-chain spoilage</span>, foot: ['Zero Convoy Failures (NE-NERC)', '100% SLA Met'] },
            ].map((k) => (
              <Card key={k.h} className="p-space-lg hover:shadow-md transition-shadow flex flex-col justify-between" style={k.accent ? { borderLeft: `4px solid ${k.accent}` } : undefined}>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className={`font-label-sm text-label-sm uppercase tracking-wider ${k.accent ? 'text-on-tertiary-fixed-variant' : 'text-on-surface-variant'}`}>{k.tag}</span>
                    <h3 className={`font-headline-sm text-headline-sm mt-0.5 ${k.accent ? 'text-tertiary-container' : 'text-primary'}`}>{k.h}</h3>
                  </div>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${k.iconCls}`}>
                    <Icon name={k.icon} size={20} />
                  </div>
                </div>
                <div className="mt-space-md">
                  <div className="flex items-baseline gap-space-sm">
                    <span className={`font-display text-display tracking-tight font-telemetry-num ${k.valueCls ?? 'text-primary'}`}>{k.value}</span>
                    {k.unit && <span className="font-label-lg text-label-lg text-on-surface-variant font-semibold">{k.unit}</span>}
                    {k.pill && <span className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${k.pillCls}`}>{k.pill}</span>}
                  </div>
                  <p className="mt-space-xs font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <Icon name="trending_down" size={16} className="text-secondary" />
                    {k.line}
                  </p>
                </div>
                <div className="mt-space-md pt-space-sm bg-surface-container-low px-space-sm py-1 rounded flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
                  <span className="truncate">{k.foot[0]}</span>
                  <span className={`font-telemetry-num ${k.accent ? 'text-tertiary-container' : 'text-primary'} font-semibold text-right`}>{k.foot[1]}</span>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Charts */}
        <section className="w-full px-margin-lg py-space-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            <Card className="lg:col-span-7 p-space-lg flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
                <div>
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2 h-2 rounded-full bg-primary-container" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Multi-Line Telemetry</span>
                  </div>
                  <h2 className="font-headline-sm text-headline-sm text-primary">Arterial Corridor Delay: Before vs. After AI Early Warning System</h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Average Stranded Hours per Heavy Vehicle during Peak Cloudburst Window (June–October)</p>
                </div>
                <div className="flex items-center gap-space-sm text-label-sm font-label-sm">
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-error rounded" /> 2022-23 Baseline</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-1 bg-secondary rounded" /> 2024 AI Grid</span>
                </div>
              </div>
              <div className="w-full my-space-md bg-surface-container-low/50 rounded-lg p-space-md">
                <svg className="w-full h-56 text-on-surface-variant" fill="none" viewBox="0 0 640 240" xmlns="http://www.w3.org/2000/svg">
                  <line stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="620" y1="20" y2="20" />
                  <line stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="620" y1="65" y2="65" />
                  <line stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="620" y1="110" y2="110" />
                  <line stroke="#d5e3fc" strokeDasharray="3 3" x1="40" x2="620" y1="155" y2="155" />
                  <line stroke="#bfc8c9" x1="40" x2="620" y1="200" y2="200" />
                  {[['24h', '24'], ['18h', '69'], ['12h', '114'], ['6h', '159'], ['0h', '204']].map(([v, y]) => (
                    <text key={y} className="text-[10px] fill-on-surface-variant font-telemetry-num" textAnchor="end" x="32" y={y}>{v}</text>
                  ))}
                  <path d="M 60 140 Q 140 100 200 50 T 340 38 T 460 70 T 580 130" fill="none" opacity="0.85" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="2.5" />
                  {[[60, 140], [200, 50], [340, 38], [460, 70], [580, 130]].map(([x, y]) => <circle key={`b${x}`} cx={x} cy={y} fill="#ba1a1a" r="3.5" />)}
                  <path d="M 60 175 Q 140 155 200 120 T 340 110 T 460 135 T 580 178" fill="none" stroke="#006d3d" strokeLinecap="round" strokeWidth="3" />
                  <path d="M 60 175 Q 140 155 200 120 T 340 110 T 460 135 T 580 178 L 580 200 L 60 200 Z" fill="#006d3d" fillOpacity="0.08" />
                  {[[60, 175], [200, 120], [340, 110], [460, 135], [580, 178]].map(([x, y]) => <circle key={`g${x}`} cx={x} cy={y} fill="#006d3d" r="4" />)}
                  <g transform="translate(340, 75)">
                    <rect fill="#002b2f" height="20" rx="4" width="92" x="-46" y="-22" />
                    <text className="text-[10px] font-semibold font-telemetry-num" fill="#ffffff" textAnchor="middle" x="0" y="-8">-11.6 hrs saved</text>
                  </g>
                  {['Jun (Onset)', 'Jul (Flash Floods)', 'Aug (Peak Slumps)', 'Sep (Cyclonic)', 'Oct (Receding)'].map((m, i) => (
                    <text key={m} className="text-[11px] fill-on-surface-variant font-label-md" textAnchor="middle" x={60 + i * 130} y="218">{m}</text>
                  ))}
                </svg>
              </div>
              <div className="grid grid-cols-3 gap-space-sm pt-space-xs">
                {[['NH-10 (Siliguri-Gangtok)', '14.2h', '(-34%)', 'Teesta Basin Early Bypass'], ['NH-29 (Dimapur-Kohima)', '7.4h', '(-26%)', 'Phesama Mudflow Shield'], ['NH-37 (Guwahati-Silchar)', '18.6h', '(-24%)', 'Barak Inundation Pre-route']].map(([n, v, d, s]) => (
                  <div key={n} className="bg-surface-container rounded-lg p-space-sm flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{n}</span>
                    <span className="font-telemetry-num text-telemetry-num text-primary font-bold">{v} <span className="text-secondary text-[12px]">{d}</span></span>
                    <span className="text-[11px] text-on-surface-variant">{s}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="lg:col-span-5 p-space-lg flex flex-col justify-between">
              <div className="flex flex-col gap-space-xs pb-space-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Severity Matrix</span>
                  </div>
                  <span className="font-telemetry-num text-telemetry-num text-primary font-bold">1,128 Total Incidents</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-primary">Disruptions by NE State &amp; IMD Severity Level</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Classified by IMD 4-Tier color standard for monsoonal transit disruption.</p>
              </div>
              <div className="grid grid-cols-4 gap-1 py-space-xs text-center font-label-sm text-label-sm">
                {[['Green', 'imd1'], ['Yellow', 'imd2'], ['Orange', 'imd3'], ['Red', 'imd4']].map(([l, t]) => (
                  <div key={l} className={`bg-${t}-bg text-${t}-text py-1 rounded flex items-center justify-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-${t}-text`} /> {l}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2.5 my-space-sm">
                {SEVERITY_MATRIX.map((s) => (
                  <div key={s.state} className="flex flex-col gap-0.5">
                    <div className="flex justify-between text-on-surface font-label-sm text-label-sm">
                      <span className="font-medium">{s.state}</span>
                      <span className="font-telemetry-num text-telemetry-num font-semibold text-primary">{s.total}</span>
                    </div>
                    <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden flex">
                      {s.segs.map((w, i) => <div key={i} className={`h-full bg-imd${i + 1}`} style={{ width: `${w}%` }} title={`${['Green', 'Yellow', 'Orange', 'Red'][i]}`} />)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-space-xs text-on-surface-variant font-body-sm text-body-sm flex items-center justify-between">
                <span>BRO Swift Heavy Recovery deployed: 64 Units</span>
                <span className="font-semibold text-primary">Sikkim NH-10 most critical</span>
              </div>
            </Card>
          </div>
        </section>

        {/* Donut + vulnerability table */}
        <section className="w-full px-margin-lg py-space-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-lg">
            <Card className="lg:col-span-4 p-space-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-space-xs">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Root Cause Distribution</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-primary mt-1">Disruption Categorization Breakdown</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">Aggregated across all 8,420 km of National Highway network in NER.</p>
              </div>
              <div className="flex flex-col items-center justify-center my-space-xs">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#eff4ff" strokeWidth="3.8" />
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#004349" strokeDasharray="48 52" strokeDashoffset="0" strokeWidth="4.2" />
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#006d3d" strokeDasharray="26 74" strokeDashoffset="-48" strokeWidth="4.2" />
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#2c18b5" strokeDasharray="14 86" strokeDashoffset="-74" strokeWidth="4.2" />
                    <circle cx="18" cy="18" fill="transparent" r="15.91549430918954" stroke="#ba1a1a" strokeDasharray="12 88" strokeDashoffset="-88" strokeWidth="4.2" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-telemetry-num text-headline-sm text-primary font-bold">100%</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">Classified</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-space-sm">
                {[['bg-primary-container', 'Rockfall & Landslides', '48%'], ['bg-[#006d3d]', 'Flash Floods & Inundation', '26%'], ['bg-tertiary-container', 'Bridge Structural Maintenance', '14%'], ['bg-error', 'Heavy Vehicle Breakdown', '12%']].map(([c, l, v]) => (
                  <div key={l} className="flex items-center justify-between p-1.5 rounded bg-surface-container-low font-body-sm text-body-sm">
                    <div className="flex items-center gap-space-xs">
                      <span className={`w-3 h-3 rounded ${c}`} />
                      <span className="text-on-surface font-medium">{l}</span>
                    </div>
                    <span className="font-telemetry-num text-telemetry-num font-bold text-primary">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-space-md p-space-sm rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-space-xs">
                <Icon name="info" size={18} className="text-primary" />
                <span>Geological slope stabilization projects underway under PM-DevINE.</span>
              </div>
            </Card>

            <Card className="lg:col-span-8 p-space-lg flex flex-col justify-between overflow-hidden">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-sm">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="w-2 h-2 rounded-full bg-error" />
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Topographical Hotspots</span>
                    </div>
                    <h2 className="font-headline-sm text-headline-sm text-primary">High-Risk Corridor Vulnerability Index</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Top 5 mountain highway sections ranked by vulnerability score, historical cloudburst frequency, and designated BRO depot response.</p>
                  </div>
                  <button className="shrink-0 px-space-md py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md flex items-center gap-1 transition-colors">
                    <Icon name="filter_list" size={16} /> All 38 Sectors
                  </button>
                </div>
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left font-body-sm text-body-sm">
                    <thead>
                      <tr className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                        <th className="py-space-xs px-space-sm rounded-l">Highway Section</th>
                        <th className="py-space-xs px-space-sm">State</th>
                        <th className="py-space-xs px-space-sm text-center">Severity Tier</th>
                        <th className="py-space-xs px-space-sm text-right">Avg Clearance</th>
                        <th className="py-space-xs px-space-sm text-right">AI Warning Lead</th>
                        <th className="py-space-xs px-space-sm text-right">BRO Depot</th>
                        <th className="py-space-xs px-space-sm rounded-r text-right">Risk Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {VULNERABILITY.map((v) => (
                        <tr key={v.hw} className="hover:bg-surface-container-low transition-colors">
                          <td className="py-space-xs px-space-sm font-semibold text-primary">
                            <div className="flex items-center gap-1.5">
                              <Icon name={v.icon} size={16} className={v.iconCls} />
                              <span>{v.hw}</span>
                            </div>
                          </td>
                          <td className="py-space-xs px-space-sm text-on-surface">{v.state}</td>
                          <td className="py-space-xs px-space-sm text-center">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold ${v.tier.cls}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${v.tier.cls.split(' ')[1]}`} /> {v.tier.label}
                            </span>
                          </td>
                          <td className="py-space-xs px-space-sm text-right font-telemetry-num text-primary">{v.clear}</td>
                          <td className="py-space-xs px-space-sm text-right font-telemetry-num text-secondary font-semibold">{v.lead}</td>
                          <td className="py-space-xs px-space-sm text-right text-on-surface-variant font-label-sm">{v.depot}</td>
                          <td className={`py-space-xs px-space-sm text-right font-telemetry-num font-bold ${v.scoreCls}`}>{v.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-space-md pt-space-sm flex flex-col sm:flex-row items-center justify-between text-on-surface-variant font-label-sm text-label-sm bg-surface-container-low px-space-md py-space-xs rounded-lg gap-space-sm">
                <div className="flex items-center gap-2">
                  <Icon name="hub" size={16} className="text-primary" />
                  <span>Automated Heavy Excavator Dispatch: 18 Border Road Depots Connected</span>
                </div>
                <Link className="text-primary font-semibold hover:underline flex items-center gap-1" to="/console">
                  <span>View Full Corridor Manifest</span>
                  <Icon name="arrow_forward" size={14} />
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Fiscal banner */}
        <section className="w-full px-margin-lg py-space-lg mb-space-xl">
          <div className="w-full rounded-xl bg-primary text-on-primary p-space-lg shadow-md flex flex-col md:flex-row items-center justify-between gap-space-lg relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none">
              <Icon name="currency_rupee" size={200} />
            </div>
            <div className="flex items-center gap-space-lg relative z-10">
              <div className="w-14 h-14 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 shadow-sm">
                <Icon name="payments" size={32} />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-space-sm">
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">Consolidated Fiscal Audit</span>
                  <span className="font-telemetry-num text-telemetry-num text-primary-fixed-dim">FY 2024-25 Mid-Year</span>
                </div>
                <h3 className="font-headline-lg text-headline-lg text-white mt-0.5 tracking-tight font-display">
                  Economic Value Preserved: <span className="text-secondary-fixed">₹248.5 Crore</span>
                </h3>
                <p className="font-body-md text-body-md text-outline-variant max-w-2xl mt-0.5">
                  Measured via agricultural spoilage prevention, uninterrupted cryogenic cold-chain routing, and 1.8M liters of reduced diesel idling across North Eastern logistics corridors.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-space-md shrink-0 relative z-10 w-full md:w-auto justify-end">
              <button onClick={() => actions.toast('Audit methodology note (NIC-verified checksum) sent to your secure console inbox.')} className="px-space-lg py-space-sm rounded-lg bg-surface-container-lowest text-primary font-label-lg text-label-lg hover:bg-surface transition-colors shadow-sm">
                Audit Methodology Note
              </button>
              <button onClick={() => actions.toast('Telemetry dump (CSV, 1.2M rows) packaging for NIC-S3 secure transfer.')} className="px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-[#0d5c63] font-label-lg text-label-lg transition-colors shadow-sm flex items-center gap-1.5">
                <span>Download Telemetry Dump</span>
                <Icon name="download" size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </ConsoleShell>
  );
}
