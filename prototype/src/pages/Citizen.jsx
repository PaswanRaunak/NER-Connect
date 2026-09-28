import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileShell } from '../components/MobileShell.jsx';
import { Icon, Emblem } from '../components/ui.jsx';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { useStore } from '../state/store.jsx';
import { CITIZEN_ADVISORY, ONBOARD_DISTRICTS, LANGUAGES } from '../lib/data.js';

/* ============================================================
   SCREEN 5 — Citizen Home: Live Corridor Status
   ============================================================ */
export function CitizenHome() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [speaking, setSpeaking] = useState(false);
  const district = ONBOARD_DISTRICTS.find((d) => d.id === state.district) || ONBOARD_DISTRICTS[0];
  const advisory = state.advisory || CITIZEN_ADVISORY;
  const advisoryMeta = state.advisory ? 'Updated just now · SACHET Field Feed' : 'Updated 14 mins ago · IMD Shillong';

  function speak() {
    setSpeaking((s) => !s);
    try {
      if (!('speechSynthesis' in window)) return;
      if (!speaking) {
        const u = new SpeechSynthesisUtterance(advisory);
        u.onend = () => setSpeaking(false);
        window.speechSynthesis.speak(u);
      } else {
        window.speechSynthesis.cancel();
      }
    } catch { /* autoplay-blocked browsers */ }
  }

  return (
    <MobileShell title="Home">
      <div className="flex flex-col w-full relative select-none">
        {/* Map View Container (immersive backdrop) */}
        <div className="relative w-full h-[380px] overflow-hidden bg-surface-container">
          <MapCanvas
            center={[26.05, 91.9]}
            zoom={9}
            interactive="touch"
            corridors={[
              { points: [[26.32, 91.7], [26.0, 92.2], [25.6, 92.4]], tier: 1, label: 'NH-27 ARTERIAL (CLEAR)' },
              { points: [[26.14, 91.74], [25.9, 91.9], [25.58, 91.89]], tier: 2, label: 'GS ROAD → MEGHALAYA' },
            ]}
            pins={[{ lat: 26.14, lon: 91.74, label: 'Dispur, Kamrup Metro' }]}
          />
          {/* Map Ambience Gradient Scrim */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/30 via-transparent to-primary/60 pointer-events-none" />

          {/* Floating Top Utility Badges over Map */}
          <div className="absolute top-space-md left-space-md right-space-md flex items-center justify-between">
            <div className="px-space-sm py-1.5 bg-surface-container-lowest/95 backdrop-blur-md rounded-full shadow-sm flex items-center gap-space-xs">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-label-sm text-on-surface">GPS Monitored · 8 States</span>
            </div>
            <div className="flex items-center gap-space-xs">
              <button aria-label="Recenter on current location" className="min-w-[48px] min-h-[48px] h-11 w-11 rounded-full bg-surface-container-lowest/95 backdrop-blur-md text-on-surface shadow-sm flex items-center justify-center transition-transform active:scale-95">
                <Icon name="my_location" size={20} className="text-primary-container" />
              </button>
              <button aria-label="Toggle Highway Layer" className="min-w-[48px] min-h-[48px] px-space-sm h-11 rounded-full bg-surface-container-lowest/95 backdrop-blur-md text-on-surface shadow-sm flex items-center gap-1 transition-transform active:scale-95">
                <Icon name="layers" size={18} className="text-primary-container" />
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">Corridors</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sheet: Mission-Critical Citizen Status Card */}
        <div className="relative -mt-6 z-20 w-full bg-surface-container-lowest rounded-t-[24px] shadow-[0_-8px_30px_rgba(15,23,42,0.12)] px-margin pb-space-2xl pt-space-sm flex flex-col gap-space-md">
          <div className="w-full flex items-center justify-center pt-space-xs pb-space-xs">
            <div className="w-9 h-1 bg-outline-variant/60 rounded-full" />
          </div>

          <div className="flex items-center justify-between gap-space-sm">
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-secondary-container/40 text-on-secondary-container">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm tracking-wide uppercase">No Action Needed — Clear</span>
            </div>
            <button
              aria-label="Listen to advisory in Assamese, Hindi or English"
              onClick={speak}
              className={`min-w-[48px] min-h-[48px] h-12 px-space-sm rounded-full text-on-surface flex items-center gap-space-xs shadow-sm active:bg-surface-container-high transition-colors ${speaking ? 'bg-primary-fixed' : 'bg-surface-container'}`}
            >
              <Icon name={speaking ? 'record_voice_over' : 'volume_up'} size={20} fill={speaking} className="text-primary-container" />
              <span className="font-label-sm text-label-sm font-semibold text-primary-container">অসমীয়া / EN</span>
            </button>
          </div>

          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs">
              <Icon name="location_on" size={22} className="text-primary-container" />
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Your Area: {district.name.split('(')[0].trim()}</h2>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {state.advisory
                ? 'Your fresh field report is being cross-verified by three citizen sensors and ISRO Bhuvan optical imagery.'
                : 'All arterial highways near you are open and safe for transit. No active landslide or flash-flood alerts detected within 25 km.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-space-sm p-space-sm bg-surface-container-low rounded-xl">
            <div className="flex items-center gap-space-sm p-space-xs">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                <Icon name="rainy" size={22} className="text-primary-container" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-outline">Weather &amp; Sky</span>
                <span className="font-telemetry-num text-telemetry-num text-on-surface">26°C · Drizzle</span>
              </div>
            </div>
            <div className="flex items-center gap-space-sm p-space-xs">
              <div className="w-10 h-10 rounded-full bg-secondary-container/60 flex items-center justify-center flex-shrink-0">
                <Icon name="speed" size={22} className="text-secondary" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-sm text-label-sm text-outline">NH-27 Flow Rate</span>
                <span className="font-telemetry-num text-telemetry-num text-on-surface">Clear · 48 km/h</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm pt-space-xs">
            <button onClick={() => navigate('/citizen/report')} className="flex flex-col justify-between p-space-md h-[124px] bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-left group min-w-[48px] min-h-[48px] relative overflow-hidden border border-struct-border">
              <div className="w-11 h-11 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                <Icon name="add_a_photo" size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">Report Hazard</span>
                <span className="font-label-sm text-label-sm text-outline truncate">Landslide, road blocks</span>
              </div>
              <Icon name="chevron_right" size={18} className="absolute top-3 right-3 text-outline" />
            </button>
            <button onClick={() => navigate('/citizen/route')} className="flex flex-col justify-between p-space-md h-[124px] bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all active:scale-[0.98] text-left group min-w-[48px] min-h-[48px] relative overflow-hidden border border-struct-border">
              <div className="w-11 h-11 rounded-lg bg-secondary-container/70 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
                <Icon name="alt_route" size={24} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold truncate">Safe Route</span>
                <span className="font-label-sm text-label-sm text-outline truncate">AI monsoonal check</span>
              </div>
              <Icon name="chevron_right" size={18} className="absolute top-3 right-3 text-outline" />
            </button>
          </div>

          <div className="w-full mt-space-xs p-space-sm bg-surface-container-low rounded-xl flex items-start gap-space-sm">
            <div className={`mt-0.5 px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0 ${state.advisory ? 'bg-tertiary-container text-on-tertiary' : 'bg-error-container text-on-error-container'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${state.advisory ? 'bg-on-tertiary' : 'bg-error'}`} />
              <span className="font-label-sm text-label-sm uppercase">{state.advisory ? 'Filed' : 'Watch'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body-sm text-body-sm text-on-surface font-medium leading-snug">{advisory}</p>
              <span className="font-label-sm text-label-sm text-outline mt-0.5 block">{advisoryMeta}</span>
            </div>
            <button aria-label="View advisory details" onClick={() => navigate('/citizen/route')} className="min-w-[48px] min-h-[48px] flex items-center justify-center text-primary-container self-center flex-shrink-0">
              <Icon name="arrow_forward" size={20} />
            </button>
          </div>

          <div className="flex items-center justify-between pt-space-xs text-outline">
            <div className="flex items-center gap-1">
              <Icon name="verified" size={16} className="text-secondary" />
              <span className="font-label-sm text-label-sm">Field-verified by Assam Police Logistics</span>
            </div>
            <span className="font-label-sm text-label-sm font-semibold">10:42 AM IST</span>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

/* ============================================================
   Bottom-nav target — Profile / Settings sheet
   ============================================================ */
export function Profile() {
  const { state, actions } = useStore();
  const navigate = useNavigate();
  const district = ONBOARD_DISTRICTS.find((d) => d.id === state.district) || ONBOARD_DISTRICTS[0];
  const lang = LANGUAGES.find((l) => l.code === state.language) || LANGUAGES[0];

  return (
    <MobileShell title="Profile">
      <div className="px-margin py-space-md flex flex-col gap-space-md">
        <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex items-center gap-space-md border border-struct-border">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
            <Icon name="person" size={28} className="text-on-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-headline-sm text-headline-sm text-on-surface">Signed-in Traveler</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
              {state.auth?.credentialType === 'email' ? state.auth?.credential : state.auth ? `+91 ${state.auth.credential}` : 'NIC OTP session'}
            </span>
          </div>
        </div>

        {[
          { icon: 'translate', label: 'Operating Language', value: `${lang.native} · ${lang.label}` },
          { icon: 'location_on', label: 'Operational District', value: district.name },
          { icon: 'notifications', label: 'SACHET Disaster Alerts', value: 'Enabled · Push + SMS fallback' },
          { icon: 'satellite_alt', label: 'Offline NavIC Relay', value: 'Armed for zero-GSM sectors' },
        ].map((row) => (
          <div key={row.label} className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md flex items-center justify-between border border-struct-border">
            <div className="flex items-center gap-space-md min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <Icon name={row.icon} size={20} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface">{row.label}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{row.value}</span>
              </div>
            </div>
            <Icon name="chevron_right" size={18} className="text-outline" />
          </div>
        ))}

        <button
          onClick={() => navigate('/')}
          className="w-full h-12 rounded-lg bg-error-container text-on-error-container font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-sm active:scale-[0.99] transition-all"
          type="button"
        >
          <Icon name="home" size={20} />
          <span>Back to Portal</span>
        </button>

        <div className="flex items-center justify-center gap-1.5 text-outline font-label-sm text-label-sm pt-1">
          <Icon name="verified" size={14} className="text-secondary" />
          <span>NER-Connect · MDoNER · NIC Cloud v4.12</span>
        </div>
      </div>
    </MobileShell>
  );
}
