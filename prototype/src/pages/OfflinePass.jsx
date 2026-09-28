import React, { useEffect, useState } from 'react';
import { MobileShell } from '../components/MobileShell.jsx';
import { Icon } from '../components/ui.jsx';
import { useStore } from '../state/store.jsx';

/* ============================================================
   SCREEN 9 — Offline Mode / Emergency Transit Pass
   ============================================================ */

/* Decorative cryptographic QR surface — same vector modules as the design */
function PassQr() {
  return (
    <svg className="w-44 h-44 text-on-surface" fill="currentColor" viewBox="0 0 160 160">
      <rect fill="currentColor" height="38" width="38" x="10" y="10" />
      <rect fill="#ffffff" height="26" width="26" x="16" y="16" />
      <rect fill="currentColor" height="14" width="14" x="22" y="22" />
      <rect fill="currentColor" height="38" width="38" x="112" y="10" />
      <rect fill="#ffffff" height="26" width="26" x="118" y="16" />
      <rect fill="currentColor" height="14" width="14" x="124" y="22" />
      <rect fill="currentColor" height="38" width="38" x="10" y="112" />
      <rect fill="#ffffff" height="26" width="26" x="16" y="118" />
      <rect fill="currentColor" height="14" width="14" x="22" y="124" />
      <rect height="6" width="6" x="54" y="14" /><rect height="6" width="6" x="66" y="14" /><rect height="6" width="12" x="78" y="14" /><rect height="6" width="6" x="96" y="14" />
      <rect height="6" width="18" x="54" y="26" /><rect height="6" width="6" x="78" y="26" /><rect height="6" width="12" x="90" y="26" />
      <rect height="12" width="6" x="54" y="38" /><rect height="6" width="12" x="66" y="38" /><rect height="6" width="18" x="84" y="38" />
      <rect height="6" width="18" x="14" y="54" /><rect height="6" width="18" x="38" y="54" /><rect height="12" width="6" x="62" y="54" /><rect height="6" width="18" x="74" y="54" /><rect height="6" width="12" x="98" y="54" /><rect height="12" width="6" x="116" y="54" /><rect height="6" width="18" x="128" y="54" />
      <rect height="18" width="6" x="14" y="66" /><rect height="6" width="12" x="26" y="66" /><rect height="6" width="12" x="44" y="66" /><rect height="12" width="12" x="98" y="66" /><rect height="6" width="18" x="122" y="66" />
      <rect fill="#004349" height="32" rx="4" width="32" x="64" y="64" />
      <path d="M76 80h8m-4-4v8" stroke="#ffffff" strokeLinecap="round" strokeWidth="2.5" />
      <rect height="6" width="18" x="14" y="90" /><rect height="12" width="6" x="38" y="90" /><rect height="6" width="18" x="116" y="90" /><rect height="18" width="6" x="140" y="90" />
      <rect height="6" width="18" x="54" y="102" /><rect height="12" width="6" x="78" y="102" /><rect height="6" width="18" x="90" y="102" /><rect height="6" width="12" x="114" y="102" />
      <rect height="12" width="6" x="54" y="114" /><rect height="6" width="18" x="66" y="114" /><rect height="12" width="6" x="90" y="114" /><rect height="6" width="24" x="102" y="114" /><rect height="6" width="14" x="132" y="114" />
      <rect height="14" width="12" x="54" y="132" /><rect height="6" width="18" x="72" y="132" /><rect height="14" width="6" x="96" y="132" /><rect height="6" width="18" x="108" y="132" /><rect height="14" width="14" x="132" y="132" />
      <rect height="6" width="18" x="72" y="144" /><rect height="6" width="18" x="108" y="144" />
    </svg>
  );
}

export function OfflinePass() {
  const { actions } = useStore();
  const [torch, setTorch] = useState(false);
  const [siren, setSiren] = useState(false);
  const [beacon, setBeacon] = useState('idle'); // idle | sending | ack
  const [left, setLeft] = useState(31 * 3600 + 41 * 60 + 58);

  useEffect(() => {
    const t = setInterval(() => setLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = Math.floor(left / 3600);
  const mm = Math.floor((left % 3600) / 60);
  const ss = left % 60;

  function fireBeacon() {
    if (beacon !== 'idle') return;
    setBeacon('sending');
    setTimeout(() => setBeacon('ack'), 2400);
  }

  return (
    <MobileShell title="Offline Pass" subtitle="NER-Connect">
      <div className="flex flex-col w-full pb-6 px-margin">
        {/* Offline status banner */}
        <div className="w-full mt-2 rounded-xl bg-surface-container-highest shadow-sm p-space-sm flex flex-col gap-1.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-error animate-pulse flex-shrink-0" />
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-bold truncate">Offline Mode Active</span>
            </div>
            <div className="flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded-full">
              <Icon name="signal_cellular_connected_no_internet_0_bar" size={14} className="text-outline" />
              <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">GSM 0%</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-on-surface-variant pt-1 border-t-0">
            <div className="flex items-center gap-1 min-w-0">
              <Icon name="satellite_alt" size={16} className="text-secondary flex-shrink-0" />
              <span className="font-body-sm text-body-sm truncate">NavIC Satellite Mesh: <strong className="font-semibold text-on-surface">Synced 18m ago</strong></span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-1.5 py-0.5 rounded font-bold">L5 Signal High</span>
          </div>
        </div>

        {/* Torch / siren toggles */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <button
            onClick={() => setTorch((t) => !t)}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg shadow-sm active:scale-95 transition-transform ${torch ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}
          >
            <Icon name={torch ? 'flashlight_off' : 'flashlight_on'} size={20} className={torch ? 'text-primary-fixed' : 'text-primary'} />
            <span className="font-label-md text-label-md truncate">Mountain Torch</span>
          </button>
          <button
            onClick={() => setSiren((s) => !s)}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg shadow-sm active:scale-95 transition-transform ${siren ? 'bg-tertiary-container text-on-tertiary-container' : 'bg-surface-container text-on-surface'}`}
          >
            <Icon name={siren ? 'volume_off' : 'volume_up'} size={20} className={siren ? '' : 'text-tertiary-container'} />
            <span className="font-label-md text-label-md truncate">Fog Horn Siren</span>
          </button>
        </div>

        {/* ACTIVE DIGITAL E-PASS CARD */}
        <div className="mt-3 w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden relative">
          <div className="bg-primary text-on-primary px-3.5 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Icon name="verified_user" size={20} className="text-primary-fixed" />
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider font-bold">Inter-State Transit Corridor</span>
                <span className="font-telemetry-num text-telemetry-num font-bold tracking-tight text-on-primary truncate">#NER-PASS-2024-8841</span>
              </div>
            </div>
            <div className="bg-secondary text-on-secondary px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-on-secondary" />
              Priority A
            </div>
          </div>

          <div className="bg-secondary-container/30 px-3.5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <Icon name="lock" size={16} className="text-secondary" />
              <span className="font-label-sm text-label-sm text-on-secondary-container font-semibold truncate">ED25519 Cryptographically Signed</span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <Icon name="timer" size={14} className="text-on-secondary-container" />
              <span className="font-telemetry-num text-telemetry-num text-on-secondary-container font-bold">{hh}h {mm}m {ss < 10 ? '0' : ''}{ss}s</span>
            </div>
          </div>

          <div className="p-3.5 flex flex-col gap-3">
            <div className="bg-surface-container-low rounded-lg p-2.5 flex items-center justify-between gap-2">
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Origin</span>
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">Kamrup, AS</span>
                <span className="font-body-sm text-body-sm text-outline">Guwahati Logistics Hub</span>
              </div>
              <div className="flex flex-col items-center flex-shrink-0 px-1">
                <Icon name="sync_alt" size={20} className="text-primary" />
                <span className="font-label-sm text-label-sm text-on-surface-variant font-bold">NH-10</span>
              </div>
              <div className="flex flex-col items-center text-right min-w-0">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">Destination</span>
                <span className="font-headline-sm text-headline-sm text-on-surface truncate">Gangtok, SK</span>
                <span className="font-body-sm text-body-sm text-outline">STNM State Depot</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-on-surface">
              <div className="bg-surface-container rounded-lg p-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Consignment</span>
                <span className="font-label-lg text-label-lg font-bold block truncate text-tertiary-container">Cryo Medical Oxygen</span>
                <span className="font-body-sm text-body-sm text-outline">16,200 L Liquid Gas</span>
              </div>
              <div className="bg-surface-container rounded-lg p-2">
                <span className="font-label-sm text-label-sm text-on-surface-variant block">Vehicle &amp; Pilot</span>
                <span className="font-label-lg text-label-lg font-bold block truncate">AS-01-EC-9482</span>
                <span className="font-body-sm text-body-sm text-outline truncate">Tashi Namgyal (ID 982)</span>
              </div>
            </div>

            <div className="w-full bg-surface-container-lowest rounded-xl p-3 flex flex-col items-center justify-center shadow-inner">
              <div className="p-2 bg-surface-container-lowest rounded-lg shadow-sm flex items-center justify-center">
                <PassQr />
              </div>
              <div className="mt-2 text-center">
                <p className="font-telemetry-num text-body-sm tracking-wider font-semibold text-on-surface">HASH: 9B4F-78A1-CC02-EE84</p>
                <p className="font-body-sm text-body-sm text-outline">Screen brightness locked at 100% for laser gate scanners</p>
              </div>
            </div>
          </div>
        </div>

        {/* CACHED VECTOR TOPO MAP */}
        <div className="mt-4 w-full bg-surface-container-lowest rounded-xl shadow-md overflow-hidden">
          <div className="p-3.5 bg-surface-container-low flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Icon name="terrain" size={20} className="text-primary" />
              <span className="font-headline-sm text-headline-sm text-on-surface">NH-10 Cached Topo Profile</span>
            </div>
            <span className="font-label-sm text-label-sm text-secondary font-bold bg-secondary-container px-2 py-0.5 rounded-full">Offline Vector Cache</span>
          </div>
          <div className="p-3.5 flex flex-col gap-2">
            <div className="relative w-full h-32 bg-surface-container rounded-lg p-2 overflow-hidden flex flex-col justify-between">
              <div className="flex items-center justify-between text-outline z-10">
                <span className="font-label-sm text-label-sm">Coronation Brg (120m)</span>
                <span className="font-label-sm text-label-sm">Teesta Bazaar (210m)</span>
                <span className="font-label-sm text-label-sm">Rangpo (350m)</span>
                <span className="font-label-sm text-label-sm">Pakyong (1,320m)</span>
              </div>
              <svg className="absolute inset-0 w-full h-full pt-6 pb-4 px-2" preserveAspectRatio="none" viewBox="0 0 320 80">
                <defs>
                  <linearGradient id="elevationGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#004349" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#004349" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                <polygon fill="url(#elevationGrad)" points="0,75 40,68 90,62 140,55 180,48 230,35 280,20 320,10 320,80 0,80" />
                <polyline fill="none" points="0,75 40,68 90,62 140,55 180,48 230,35 280,20 320,10" stroke="#004349" strokeWidth="2.5" />
                <circle className="animate-ping" cx="95" cy="62" fill="#ba1a1a" opacity="0.6" r="5" />
                <circle cx="95" cy="62" fill="#ba1a1a" r="4" />
                <circle cx="180" cy="48" fill="#006d3d" r="4" />
                <circle cx="230" cy="35" fill="#2c18b5" r="4" />
              </svg>
              <div className="flex items-center justify-between z-10 text-on-surface-variant font-label-sm text-label-sm">
                <span>Km 0</span>
                <span>Km 24 Hazard</span>
                <span>Km 42 Melli</span>
                <span>Km 51 Rangpo</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-1">
              <div className="bg-error-container/40 rounded-lg p-2.5 flex items-start gap-2">
                <Icon name="report_problem" size={18} className="text-error flex-shrink-0 mt-0.5" />
                <div className="flex flex-col min-w-0">
                  <span className="font-label-md text-label-md text-on-error-container font-bold">Km 24 (Teesta Riverine): Mudflow Clearance</span>
                  <span className="font-body-sm text-body-sm text-on-error-container">Project Swastik (BRO) bulldozer ops. Single-lane convoy release every 30m. Cryo tankers given escort Priority A.</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-on-surface">
                <div className="bg-surface-container-low rounded-lg p-2 flex flex-col">
                  <div className="flex items-center gap-1 text-secondary">
                    <Icon name="local_police" size={16} />
                    <span className="font-label-sm text-label-sm font-bold">Km 42 Refuge</span>
                  </div>
                  <span className="font-body-md text-body-md font-semibold mt-0.5">Melli Outpost</span>
                  <span className="font-body-sm text-body-sm text-outline">Satellite VHF Link Ready</span>
                </div>
                <div className="bg-surface-container-low rounded-lg p-2 flex flex-col">
                  <div className="flex items-center gap-1 text-tertiary">
                    <Icon name="shield" size={16} />
                    <span className="font-label-sm text-label-sm font-bold">Km 51 State Gate</span>
                  </div>
                  <span className="font-body-md text-body-md font-semibold mt-0.5">Rangpo Inspection</span>
                  <span className="font-body-sm text-body-sm text-outline">Laser E-Pass Scanner Sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ZERO-NETWORK EMERGENCY TRIGGERS */}
        <div className="mt-4 flex flex-col gap-2">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold px-1">Emergency Zero-GSM Triggers</span>
          <button
            onClick={fireBeacon}
            className="w-full bg-error text-on-error rounded-xl p-3 flex items-center justify-between active:scale-[0.98] transition-transform shadow-md"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container-lowest/20 flex items-center justify-center flex-shrink-0">
                {beacon === 'idle' ? <Icon name="satellite" size={24} /> : beacon === 'sending' ? <Icon name="sync" size={24} className="animate-spin" /> : <Icon name="check_circle" size={24} />}
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-headline-sm text-headline-sm font-bold truncate">
                  {beacon === 'idle' ? 'Broadcast NavIC Distress Beacon' : beacon === 'sending' ? 'Transmitting NavIC L5 Packet...' : 'Beacon Acknowledged (SDR-Mesh)'}
                </span>
                <span className="font-body-sm text-body-sm text-on-error/80">
                  {beacon === 'idle' ? 'Sends 28-byte burst payload via IRNSS sat mesh' : beacon === 'sending' ? '27.1294° N, 88.5132° E • Priority Oxygen Distress' : 'Melli BRO HQ & Disaster Dispatch Alerted'}
                </span>
              </div>
            </div>
            <Icon name={beacon === 'ack' ? 'broadcast_on_home' : 'cell_tower'} size={20} className="flex-shrink-0" />
          </button>
          <button
            onClick={() => actions.toast('56161 packet synthesized: NER-SOS|PASS-8841|AS-01-EC-9482|CRYO-O2|LOC:27.1294N,88.5132E')}
            className="w-full bg-surface-container-lowest text-on-surface rounded-xl p-3 flex items-center justify-between shadow-sm active:scale-[0.98] transition-transform border border-struct-border"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                <Icon name="sms" size={24} className="text-primary" />
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="font-headline-sm text-headline-sm font-bold truncate">Offline SMS Relay Synthesizer</span>
                <span className="font-body-sm text-body-sm text-outline">Formats low-signal 56161 packet for BSNL microtowers</span>
              </div>
            </div>
            <Icon name="chevron_right" size={20} className="text-outline flex-shrink-0" />
          </button>
        </div>

        {/* CHECKPOINT VERIFICATION PROTOCOL */}
        <div className="mt-4 bg-surface-container-low rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center gap-1.5 text-primary">
            <Icon name="verified" size={18} />
            <h2 className="font-headline-sm text-headline-sm">Physical Inspection Protocols</h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Guidelines for <strong>BRO, Assam Rifles, &amp; Sikkim Police</strong> gate checkposts:
          </p>
          <div className="space-y-1.5 text-on-surface">
            {[
              'Scan offline cryptographic QR code using the handheld NER-Vetting POS terminal. No cell tower connection is required.',
              'Verify Vehicle RC (AS-01-EC-9482) matches driver physical photo ID (Tashi Namgyal) before clearing bypass barricade.',
              'Medical Oxygen priority tankers must be granted immediate military escort precedence past Km 24 landslide slipway.',
            ].map((line, i) => (
              <div key={i} className="flex items-start gap-2 bg-surface-container-lowest rounded-lg p-2">
                <span className="font-telemetry-num text-label-sm font-bold text-primary flex-shrink-0 bg-primary-fixed rounded-full w-4 h-4 flex items-center justify-center">{i + 1}</span>
                <span className="font-body-sm text-body-sm">{line}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 p-2.5 rounded-xl bg-surface-container-highest flex items-center justify-between text-on-surface-variant">
          <div className="flex items-center gap-2">
            <Icon name="sensors" size={16} className="text-secondary" />
            <span className="font-label-sm text-label-sm font-semibold">Device NavIC Sensor: Active</span>
          </div>
          <div className="flex items-center gap-3 font-telemetry-num text-label-sm font-bold">
            <span>LAT 27.1294° N</span>
            <span>LON 88.5132° E</span>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
