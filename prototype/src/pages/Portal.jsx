import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon, Emblem, Card } from '../components/ui.jsx';
import { useStore } from '../state/store.jsx';
import { STATES8, CORRIDORS, PORTAL_KPIS } from '../lib/data.js';

/* ============================================================
   SCREEN 1 — Public Portal / Operational Overview
   ============================================================ */

export function PortalHeader({ active }) {
  const nav = [
    ['overview', 'Overview', '/portal'],
    ['operations-center', 'Operations Center', '/console'],
    ['district-matrix', 'District Matrix', '/console/district'],
    ['analytics-and-impact', 'Analytics & Impact', '/console/analytics'],
    ['dispatch-moderation', 'Dispatch Moderation', '/console/moderation'],
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="bg-primary text-on-primary px-margin-lg">
        <div className="w-full flex items-center justify-between h-8">
          <div className="flex items-center gap-space-md min-w-0">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              <span className="font-label-sm text-label-sm tracking-wide uppercase truncate">Ministry of Development of North Eastern Region | Govt of India</span>
            </div>
            <span className="text-outline-variant font-label-sm text-label-sm hidden md:inline">•</span>
            <div className="hidden md:flex items-center gap-space-xs bg-primary-container px-space-sm py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-primary">NIC-Secured Grid Online · ISRO Bhuvan Sync Active</span>
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <div className="hidden sm:flex items-center gap-space-xs bg-error px-space-sm py-0.5 rounded-full">
              <Icon name="phone_in_talk" size={13} className="text-on-error" />
              <span className="font-label-sm text-label-sm text-on-error font-semibold">Emergency: 1070 / 112 (NE-NERC)</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <Icon name="translate" size={14} className="text-on-primary" />
              <select className="bg-transparent text-on-primary font-label-sm text-label-sm cursor-pointer outline-none border-none" aria-label="Language">
                <option className="text-on-surface bg-surface" value="en">English</option>
                <option className="text-on-surface bg-surface" value="as">অসমীয়া</option>
                <option className="text-on-surface bg-surface" value="bn">বাংলা</option>
                <option className="text-on-surface bg-surface" value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full px-margin-lg bg-surface/95 backdrop-blur-md">
        <div className="h-20 flex items-center justify-between">
          <div className="flex items-center gap-space-lg">
            <Link to="/portal" className="flex items-center gap-space-md">
              <Emblem />
              <div className="flex flex-col">
                <div className="flex items-center gap-space-xs">
                  <span className="font-headline-sm text-headline-sm text-primary uppercase tracking-tight">NER-Connect</span>
                  <span className="bg-surface-container-high text-primary font-label-sm text-label-sm px-space-xs py-0.5 rounded">DoNER Portal</span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Northeastern States Infrastructure &amp; Logistics Grid</span>
              </div>
            </Link>
            <nav className="hidden xl:flex items-center gap-space-xs ml-space-xl">
              {nav.map(([id, label, to]) => (
                <Link
                  key={id}
                  to={to}
                  className={`px-space-md py-space-sm font-label-lg text-label-lg transition-colors rounded-lg ${
                    active === id ? 'bg-primary-container text-on-primary font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="hidden md:flex flex-col text-right">
              <span className="font-label-md text-label-md text-on-surface">Dr. P. Barman, IAS</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Joint Secy · Transit Ops</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-surface-container-low px-margin-lg py-space-xs flex items-center justify-between text-on-surface-variant font-body-sm text-body-sm gap-space-md">
        <div className="flex items-center gap-space-md min-w-0 flex-1 overflow-hidden">
          <div className="flex items-center gap-space-xs min-w-0 overflow-x-auto no-scrollbar">
            <span className="font-label-sm text-label-sm text-primary font-semibold shrink-0">EIGHT STATES STATUS:</span>
            {STATES8.map((s) => (
              <span key={s.name} className="bg-surface-container text-on-surface font-label-sm text-label-sm px-space-xs rounded whitespace-nowrap shrink-0">{s.name}: {s.status}</span>
            ))}
          </div>
        </div>
        <div className="hidden xl:flex items-center gap-space-lg font-telemetry-num text-telemetry-num shrink-0">
          <span className="flex items-center gap-space-xs"><Icon name="satellite_alt" size={14} className="text-secondary" /> Bhuvan Telemetry: Live 30s</span>
          <span className="text-outline-variant">|</span>
          <span>Disaster Esc: L1 Regular</span>
        </div>
      </div>
    </header>
  );
}

export function PortalFooter() {
  return (
    <footer className="w-full bg-surface-container-low shadow-[0_-1px_6px_rgba(0,0,0,0.03)] mt-space-3xl">
      <div className="w-full px-margin-lg py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-gutter-lg mb-space-2xl">
          <div className="lg:col-span-2 flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-sm">
              <Emblem />
              <span className="font-headline-sm text-headline-sm text-primary uppercase">NER-Connect</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
              Integrated Infrastructure, Disaster Telemetry, and Heavy Freight Corridor Transit Monitoring System for the North Eastern Region of India. Orchestrated by the Ministry of Development of North Eastern Region (MDoNER).
            </p>
            <div className="flex items-center gap-space-sm mt-space-xs">
              <span className="px-space-sm py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-primary">NIC Cloud Hosting Tier-4</span>
              <span className="px-space-sm py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-primary">GIGW 3.0 Compliant</span>
            </div>
          </div>
          {[
            ['Operational Interop', ['National Highways & PWD (NER)', 'ISRO Bhuvan Spatial Feed', 'IMD Monsoonal Radar Portal', 'NDMA Emergency Operations', 'Border Roads Organisation (BRO)']],
            ['Governance & Citizen', ['Right to Information (RTI)', 'Public Grievances Portal (CPGRAMS)', 'North Eastern Council (NEC)', 'Open Government Data Platform', 'Freight Operator Guidelines']],
          ].map(([title, links]) => (
            <div key={title} className="flex flex-col gap-space-xs">
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider mb-space-xs">{title}</span>
              {links.map((l) => <a key={l} className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href={`#${l}`}>{l}</a>)}
            </div>
          ))}
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-md text-label-md text-primary uppercase tracking-wider mb-space-xs">Network Comms</span>
            <div className="flex flex-col gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
              <span>NERC Central NOC, Vigyan Bhawan Annexe, New Delhi</span>
              <span>Guwahati Camp Office: Khanapara, Assam</span>
              <span>Dedicated Toll-free: 1800-11-2024</span>
              <span className="font-telemetry-num text-telemetry-num text-primary">SSL SHA-256 · NIC-DELHI-NODE-04</span>
            </div>
          </div>
        </div>
        <div className="border-t border-surface-container-high pt-space-lg flex flex-col md:flex-row items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md flex-wrap font-body-sm text-body-sm text-on-surface-variant">
            <span>© 2024 Ministry of Development of North Eastern Region, Government of India.</span>
            <a className="hover:text-primary" href="#policies">Website Policies</a>
            <a className="hover:text-primary" href="#cyber">Cyber Security Directive</a>
            <a className="hover:text-primary" href="#help">Help &amp; Documentation</a>
          </div>
          <div className="flex items-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant">
            <span>Designed &amp; Maintained by National Informatics Centre (NIC)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function Portal() {
  const { actions } = useStore();
  const [query, setQuery] = useState('');

  function inspect() {
    if (!query.trim()) {
      actions.toast('Please specify a highway segment (e.g., NH-10) or consignment reference code.');
      return;
    }
    actions.toast(`Querying Bhuvan and PWD Real-Time Telemetry for: ${query.trim()}`);
  }

  return (
    <div className="view-enter bg-background text-on-surface font-body-md text-body-md min-h-screen">
      <PortalHeader active="overview" />
      <main className="w-full pt-28 bg-background">
        {/* Monsoon advisory banner */}
        <div className="w-full bg-surface-container text-on-surface px-margin-lg py-space-sm shadow-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-space-sm font-body-sm text-body-sm">
            <div className="flex items-center gap-space-sm min-w-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error text-on-error font-label-sm text-label-sm font-semibold tracking-wider uppercase shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-surface-container-lowest animate-ping" />
                Monsoon Advisory
              </span>
              <span className="font-medium text-on-surface">NH-29 Kohima-Dimapur sector single-lane transit active due to controlled mud-clearing. Real-time rerouting online.</span>
            </div>
            <div className="flex items-center gap-space-md shrink-0">
              <span className="font-telemetry-num text-telemetry-num text-primary">BRO Unit 44 Cleared: 14:20 IST</span>
              <Link className="font-label-sm text-label-sm text-primary-container font-semibold underline hover:text-primary transition-colors" to="/console">Sector Diagnostics</Link>
            </div>
          </div>
        </div>

        {/* Hero */}
        <section className="relative w-full bg-surface-container-lowest px-margin-lg py-space-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none opacity-40">
            <svg className="w-full h-full text-surface-container-high" fill="none" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 150 C 150 100, 300 250, 450 120" stroke="currentColor" strokeDasharray="6 6" strokeWidth="2" />
              <path d="M20 280 C 160 220, 280 380, 480 260" stroke="currentColor" strokeWidth="2.5" />
              <path d="M80 410 C 220 340, 350 460, 490 390" stroke="currentColor" strokeDasharray="4 4" strokeWidth="1.5" />
              <circle cx="300" cy="250" fill="#006D3D" r="6" />
              <circle cx="450" cy="120" fill="#2C18B5" r="5" />
              <circle cx="160" cy="220" fill="#BA1A1A" r="5" />
              <circle cx="280" cy="380" fill="#004349" r="6" />
            </svg>
          </div>
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-space-2xl">
            <div className="max-w-3xl flex flex-col gap-space-md">
              <div className="flex items-center gap-space-xs text-primary font-label-md text-label-md tracking-wider uppercase font-semibold">
                <Icon name="hub" size={16} />
                <span>Inter-State High-Altitude Connectivity Architecture</span>
              </div>
              <h1 className="font-display text-display text-primary tracking-tight leading-tight">
                NER Integrated Transit &amp; Critical Supply Grid
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
                AI-orchestrated corridor accessibility, predictive landslide rerouting, and real-time civil disaster logistics across the eight Northeastern States. Seamless interop across BRO, NDMA, and State PWD networks.
              </p>
              <div className="flex flex-wrap items-center gap-space-md pt-space-sm">
                <Link to="/console" className="px-space-xl py-space-md bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-md transition-all flex items-center gap-space-xs">
                  <Icon name="terminal" size={18} />
                  <span>Access Dispatch Console</span>
                </Link>
                <Link to="/citizen" className="px-space-xl py-space-md bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm transition-all flex items-center gap-space-xs border border-struct-border">
                  <Icon name="cell_tower" size={18} />
                  <span>Citizen Transit Advisory &amp; Reporting</span>
                </Link>
              </div>
            </div>
            <div className="w-full max-w-4xl bg-surface p-space-md rounded-xl shadow-md border border-struct-border">
              <div className="flex flex-col md:flex-row items-stretch gap-space-sm">
                <div className="flex-1 flex items-center gap-space-sm px-space-md py-space-xs bg-surface-container-lowest rounded-lg shadow-inner border border-struct-border">
                  <Icon name="search" size={20} className="text-outline" />
                  <input
                    className="w-full bg-transparent border-none outline-none font-body-md text-body-md text-on-surface placeholder:text-outline-variant"
                    id="manifestSearch"
                    placeholder="Track Consignment / Road Segment ID (e.g., NH-10, TR-8842, CON-9041)"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && inspect()}
                  />
                </div>
                <div className="flex items-center gap-space-xs shrink-0">
                  <button onClick={inspect} className="h-full px-space-lg py-2.5 bg-primary-container text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary transition-colors flex items-center gap-1.5">
                    <span>Inspect Telemetry</span>
                    <Icon name="arrow_forward" size={16} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-space-md mt-space-sm text-outline font-label-sm text-label-sm flex-wrap">
                <span className="text-on-surface-variant font-medium">Quick Pinned Vectors:</span>
                {['NH-10 Siliguri-Gangtok', 'NH-29 Chumukedima'].map((q) => (
                  <React.Fragment key={q}>
                    <button className="hover:text-primary underline" onClick={() => setQuery(q)}>{q}</button>
                    <span>•</span>
                  </React.Fragment>
                ))}
                <button className="text-tertiary-container font-semibold hover:underline" onClick={() => setQuery('MED-V-9081 O2 Tanker')}>MED-V-9081 (ICU Liquid O2)</button>
              </div>
            </div>
          </div>
        </section>

        {/* KPI cards */}
        <section className="w-full bg-surface-container-low py-space-xl px-margin-lg">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-space-md">
              {PORTAL_KPIS.map((k, i) => (
                <Card key={k.label} style={{ animationDelay: `${i * 70}ms` }} className={`p-space-lg flex flex-col justify-between ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                  <div className="flex items-center justify-between text-outline">
                    <span className="font-label-sm text-label-sm tracking-wider uppercase">{k.label}</span>
                    <Icon name={k.icon} size={18} className={k.iconColor} />
                  </div>
                  <div className="mt-space-md">
                    {i === 4 ? (
                      <>
                        <div className="font-headline-sm text-headline-sm text-primary flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-secondary" />
                          <span>100% IN-SYNC</span>
                        </div>
                        <div className="mt-1 font-telemetry-num text-body-sm text-on-surface-variant">ISRO Bhuvan • IMD Doppler</div>
                      </>
                    ) : (
                      <>
                        <div className={`font-display text-display font-telemetry-num tracking-tight ${k.valueColor ?? 'text-primary'}`}>{k.value}</div>
                        <div className={`flex items-center gap-1 mt-1 font-label-sm text-label-sm ${k.subColor ?? 'text-on-surface-variant'} ${k.subColor ? 'font-semibold' : ''}`}>
                          {k.subIcon && <Icon name={k.subIcon} size={14} />}
                          <span>{k.sub}</span>
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Corridor health */}
        <section className="w-full py-space-3xl px-margin-lg bg-surface" id="corridor-matrix">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md">
              <div>
                <span className="font-label-md text-label-md text-primary font-semibold tracking-wider uppercase">Spatial Operations Feed</span>
                <h2 className="font-headline-lg text-headline-lg text-primary mt-1">Eight States Corridor Health &amp; Pulse</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-1">Real-time IMD precipitation risk classification mapped to critical national highway corridors and border logistics tracks.</p>
              </div>
              <div className="flex items-center gap-space-xs flex-wrap">
                {[['Clear', 'bg-secondary'], ['Caution', 'bg-primary-fixed-dim'], ['Delay/Prep', 'bg-surface-tint'], ['Blocked', 'bg-error']].map(([l, c]) => (
                  <span key={l} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-label-sm">
                    <span className={`w-2 h-2 rounded-full ${c}`} /> {l}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              <Card className="lg:col-span-7 p-space-lg flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <Icon name="map" size={20} className="text-primary" />
                    <span className="font-headline-sm text-headline-sm text-on-surface">Spatial Topography GIS Mesh</span>
                  </div>
                  <span className="font-telemetry-num text-body-sm text-outline">Projection: EPSG:4326 WGS84</span>
                </div>
                <div className="w-full h-80 rounded-lg shadow-inner relative overflow-hidden bg-surface-container-high flex flex-col justify-end p-space-md">
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px]" />
                  <div className="relative z-10 bg-surface-container-lowest/90 p-space-md rounded-lg shadow max-w-sm border border-struct-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-sm text-label-sm text-primary font-bold">Brahmputra Logistics Basin</span>
                      <span className="px-1.5 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-label-sm">Transit Stable</span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">Ferry services active between Dhubri and Majuli. Guwahati bypass free flowing with average 44 km/h speed.</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-space-xs text-center font-label-sm text-label-sm">
                  {[['Assam', '98.2% Passable', 'text-secondary'], ['Sikkim', 'Caution NH-10', 'text-error'], ['Arunachal', '91.4% Passable', 'text-on-surface-variant'], ['Nagaland', 'Slow Transit', 'text-on-surface-variant']].map(([n, v, c]) => (
                    <div key={n} className="p-2 rounded bg-surface-container text-on-surface">
                      <span className="block font-bold">{n}</span>
                      <span className={`${c} font-semibold`}>{v}</span>
                    </div>
                  ))}
                </div>
              </Card>
              <div className="lg:col-span-5 flex flex-col gap-space-md">
                <Card className="p-space-lg">
                  <div className="flex items-center justify-between pb-space-sm">
                    <h3 className="font-headline-sm text-headline-sm text-primary">Arterial Highway Corridors</h3>
                    <span className="font-label-sm text-label-sm text-outline">Updated 2m ago</span>
                  </div>
                  <div className="flex flex-col gap-space-md mt-space-sm">
                    {CORRIDORS.map((c) => (
                      <div key={c.id} className="p-space-md rounded-lg bg-surface flex flex-col gap-space-xs border border-struct-border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-space-xs min-w-0">
                            <span className="font-label-md text-label-md font-bold text-on-surface">{c.name}</span>
                            <span className="font-body-sm text-body-sm text-outline truncate">({c.via})</span>
                          </div>
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high font-label-sm text-label-sm font-semibold shrink-0 ${
                            c.tier === 1 ? 'text-secondary' : c.tier === 2 ? 'text-primary' : 'text-on-surface'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${c.tier === 1 ? 'bg-secondary' : c.tier === 2 ? 'bg-primary-fixed-dim' : 'bg-surface-tint'}`} /> {c.label}
                          </span>
                        </div>
                        <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
                          {c.segments.map((w, i) => (
                            <div key={i} className={`h-full ${['bg-secondary', 'bg-surface-tint', 'bg-error'][i]}`} style={{ width: `${w}%` }} />
                          ))}
                        </div>
                        <div className="flex justify-between font-body-sm text-body-sm text-outline">
                          <span>{c.foot}</span>
                          <span className={`font-telemetry-num text-telemetry-num ${c.tier === 3 ? 'text-error' : 'text-primary'}`}>{c.speed}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="w-full py-space-3xl px-margin-lg bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-2xl">
            <div className="text-center max-w-2xl mx-auto">
              <span className="font-label-md text-label-md text-primary font-semibold tracking-wider uppercase">Mission Architecture</span>
              <h2 className="font-display text-display text-primary mt-1">How It Works: Built for Resilient Terrain</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-2">Engineered specifically for seismically active, cloudburst-prone geographic corridors where conventional connectivity fails.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-xl">
              {[
                ['01', 'bg-primary-container text-on-primary', 'Report & Multi-Sensor Ingest', 'Aggregates raw telemetry from citizen ground reports, BRO earth-moving telemetry, PWD highway sensors, and satellite imagery. Offline mountain areas relay automatically via SMS to 56161.', 'sensors', 'Ground-truth triangulation active', 'text-primary'],
                ['02', 'bg-secondary text-on-secondary', 'Predict & Risk Classification', 'AI neural slope-stability models cross-reference IMD rainfall thresholds and slope moisture gradients to anticipate rockfalls 4 to 8 hours prior to catastrophic corridor severance.', 'psychology', 'IMD Doppler Radar Cross-Sync', 'text-secondary'],
                ['03', 'bg-tertiary-container text-on-tertiary', 'Prioritize & Dynamic Reroute', 'Critical life-saving medical supplies and essential fuel receive prioritized corridor clearance, triggering automated green waves and highland bypass routes for registered freight.', 'alt_route', 'High-Altitude Bypass Protocol', 'text-tertiary-container'],
              ].map(([n, nCls, h, p, f, fl, c]) => (
                <div key={n} className="bg-surface p-space-xl rounded-xl shadow-sm flex flex-col gap-space-md border border-struct-border">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-headline-sm text-headline-sm ${nCls}`}>{n}</div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary">{h}</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-2">{p}</p>
                  </div>
                  <div className="mt-auto pt-space-md">
                    <span className={`font-label-sm text-label-sm font-semibold flex items-center gap-1 ${c}`}>
                      <Icon name={f} size={16} /> {fl}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portals showcase */}
        <section className="w-full py-space-3xl px-margin-lg bg-surface">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-2xl">
            <div>
              <span className="font-label-md text-label-md text-primary font-semibold tracking-wider uppercase">Universal Access</span>
              <h2 className="font-headline-lg text-headline-lg text-primary mt-1">Multi-Audience Portals Showcase</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mt-1">Purpose-built interfaces for field truckers, local citizens, commercial transport firms, and ministry disaster command.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-xl items-stretch">
              <Card className="p-space-xl flex flex-col justify-between">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">Citizen &amp; Commuter</span>
                    <Icon name="smartphone" size={20} className="text-outline" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Lightweight Mobile Web App</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Optimized for intermittent 2G/3G connectivity. Features interactive maps with bottom drawer sheets, one-tap vernacular voice-alerts in Assamese, Bengali, and Hindi.
                  </p>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs font-body-sm text-body-sm">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <Icon name="record_voice_over" size={16} />
                      <span>Voice Incident Capture</span>
                    </div>
                    <p className="text-on-surface-variant">Press • Speak sector condition • Auto-geolocated report dispatched to nearest PWD outpost.</p>
                  </div>
                </div>
                <div className="pt-space-lg">
                  <Link to="/citizen" className="w-full py-2.5 px-space-md bg-surface text-primary hover:bg-surface-container rounded-lg font-label-md text-label-md font-semibold text-center block shadow-sm transition-colors border border-struct-border">
                    Launch Mobile Interface
                  </Link>
                </div>
              </Card>
              <Card className="p-space-xl flex flex-col justify-between">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-label-sm text-label-sm font-semibold">Freight Operators</span>
                    <Icon name="rv_hookup" size={20} className="text-outline" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Transporter Fleet Command</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Integrates with the National e-Waybill API. Monitors gross vehicle weight constraints, bridge stability clearances, and road disruption recovery services.
                  </p>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs font-body-sm text-body-sm">
                    <div className="flex items-center gap-2 text-secondary font-semibold">
                      <Icon name="inventory" size={16} />
                      <span>Automated e-Waybill Ingest</span>
                    </div>
                    <p className="text-on-surface-variant">Instantly alerts operators when consignment route overlaps an active IMD Red-Alert mountain sector.</p>
                  </div>
                </div>
                <div className="pt-space-lg">
                  <Link to="/citizen/tracking" className="w-full py-2.5 px-space-md bg-surface text-primary hover:bg-surface-container rounded-lg font-label-md text-label-md font-semibold text-center block shadow-sm transition-colors border border-struct-border">
                    Fleet Partner Sign-In
                  </Link>
                </div>
              </Card>
              <Card className="p-space-xl flex flex-col justify-between">
                <div className="flex flex-col gap-space-md">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary font-label-sm text-label-sm font-semibold">Inter-Agency NOC</span>
                    <Icon name="military_tech" size={20} className="text-outline" />
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Disaster &amp; PWD Command</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Centralized decision dashboard for MDoNER, State Chief Ministers' War Rooms, and NDRF Battalions for mobilizing earth-clearing equipment and air-bridge logistics.
                  </p>
                  <div className="p-space-md rounded-lg bg-surface-container-low flex flex-col gap-space-xs font-body-sm text-body-sm">
                    <div className="flex items-center gap-2 text-tertiary-container font-semibold">
                      <Icon name="published_with_changes" size={16} />
                      <span>Corridor Closure Approval</span>
                    </div>
                    <p className="text-on-surface-variant">Tri-signature digital authorization required for sealing state highways to avert catastrophic traffic stranding.</p>
                  </div>
                </div>
                <div className="pt-space-lg">
                  <Link to="/console" className="w-full py-2.5 px-space-md bg-primary-container text-on-primary hover:bg-primary rounded-lg font-label-md text-label-md font-semibold text-center block shadow transition-colors">
                    Enter Secure NOC (NIC-Auth)
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Inter-agency strip */}
        <section className="w-full py-space-2xl px-margin-lg bg-surface-container-low">
          <div className="max-w-7xl mx-auto flex flex-col gap-space-md text-center">
            <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest font-semibold">Inter-Agency Verification &amp; Geospatial Infrastructure</span>
            <div className="flex flex-wrap items-center justify-center gap-space-xl opacity-80 pt-space-xs">
              {[['account_balance', 'MDoNER'], ['construction', 'BRO & PWD'], ['thunderstorm', 'IMD Grid'], ['satellite_alt', 'ISRO Bhuvan'], ['shield', 'NDMA India'], ['verified_user', 'NIC Cloud']].map(([ic, l]) => (
                <div key={l} className="flex items-center gap-2 font-headline-sm text-headline-sm text-primary">
                  <Icon name={ic} size={24} />
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SMS fallback band */}
        <section className="w-full py-space-2xl px-margin-lg bg-primary-container text-on-primary">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-space-xl">
            <div className="flex items-start gap-space-md max-w-2xl">
              <div className="w-12 h-12 rounded-full bg-surface-container-lowest/10 flex items-center justify-center shrink-0">
                <Icon name="sms" size={24} className="text-primary-fixed" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-semibold">Offline Redundancy Architecture</span>
                <h3 className="font-headline-md text-headline-md text-on-primary">No Internet in Mountain Passes?</h3>
                <p className="font-body-md text-body-md text-surface-variant">
                  Ground conditions, roadblocks, and road collapses can be transmitted via regular SMS without smartphone apps or data connectivity.
                </p>
              </div>
            </div>
            <div className="bg-surface-container-lowest p-space-md rounded-xl text-on-surface shadow-lg max-w-md w-full">
              <div className="flex items-center justify-between pb-1">
                <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Standard SMS Fallback Syntax</span>
                <span className="font-label-sm text-label-sm text-error font-bold">Toll-Free Relay</span>
              </div>
              <div className="bg-surface p-2.5 rounded font-telemetry-num text-telemetry-num text-primary tracking-tight select-all">
                NER REPORT [LOCATION] [TYPE] [SEVERITY]
              </div>
              <div className="mt-2 flex items-center justify-between text-outline font-body-sm text-body-sm">
                <span>Example: <code className="text-on-surface font-semibold">NER REPORT NH10-KM24 SLIP HIGH</code></span>
                <span className="font-bold text-primary">SEND TO 56161</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PortalFooter />
    </div>
  );
}

/* ============================================================
   SCREEN 16 — Official Emblem / Brand asset page
   ============================================================ */
export function Brand() {
  const { actions } = useStore();
  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen">
      <PortalHeader active="" />
      <main className="pt-40 pb-space-3xl px-margin-lg max-w-5xl mx-auto flex flex-col gap-space-xl">
        <Card className="p-space-2xl flex flex-col items-center gap-space-lg text-center">
          <img src="/emblem.svg" alt="NER-Connect Official Emblem" className="w-40 h-40" />
          <div className="flex flex-col gap-1">
            <h1 className="font-headline-lg text-headline-lg text-primary">Official Emblem — NER-Connect</h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">
              Mountain &amp; connectivity network motif: twin ridgelines carry transit nodes joined by an AI satellite beacon pulse. Primary #004349 on a 24px-radius field, Inter wordmark, light mode.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-space-md">
            <button onClick={() => actions.toast('Emblem SVG downloaded to your device.')} className="px-space-lg py-space-md bg-primary-container hover:bg-primary text-on-primary font-label-lg text-label-lg rounded-lg shadow-md transition-all flex items-center gap-space-xs">
              <Icon name="download" size={18} />
              <span>Download Emblem (SVG)</span>
            </button>
            <Link to="/portal" className="px-space-lg py-space-md bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm transition-all flex items-center gap-space-xs border border-struct-border">
              <Icon name="arrow_back" size={18} />
              <span>Back to Portal</span>
            </Link>
          </div>
        </Card>
        <Card className="p-space-xl">
          <h2 className="font-headline-md text-headline-md text-primary mb-space-md">Emblem color roles</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
            {[['#004349', 'Primary field'], ['#0D5C63', 'Ridgeline shade'], ['#006D3D', 'Infrastructure green'], ['#90D2DA', 'Node telemetry'], ['#97F3B5', 'Corridor node'], ['#FFFFFF', 'Transit link']].map(([hex, label]) => (
              <div key={hex} className="rounded-lg border border-struct-border overflow-hidden">
                <div className="h-16" style={{ background: hex }} />
                <div className="p-2 flex flex-col">
                  <span className="font-label-md text-label-md text-on-surface">{label}</span>
                  <span className="font-telemetry-num text-telemetry-num text-on-surface-variant">{hex}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
      <PortalFooter />
    </div>
  );
}
