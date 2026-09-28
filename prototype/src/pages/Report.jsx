import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileShell } from '../components/MobileShell.jsx';
import { Icon } from '../components/ui.jsx';
import { MapCanvas } from '../components/MapCanvas.jsx';
import { useStore } from '../state/store.jsx';

/* ============================================================
   SCREEN 7 — Report Hazard / Disruption (+ submission confirmation)
   ============================================================ */
const TYPES = [
  { id: 'Landslide / Rockfall', icon: 'landslide', sub: 'Slope Failure' },
  { id: 'Flash Flood / Runoff', icon: 'flood', sub: 'Waterlogging' },
  { id: 'Vehicle Stall / Block', icon: 'traffic_jam', sub: 'Convoy Gridlock' },
  { id: 'Bridge / Culvert', icon: 'broken_image', sub: 'Structural Damage' },
];

const SEVERITY = [
  { id: 1, label: 'Minor', icon: 'check', banner: ['Minor Obstruction Detected', 'Single-lane pass with care. PWD outpost notified for routine monitoring.'] },
  { id: 2, label: 'Moderate', icon: 'warning', banner: ['Be Prepared: Single Lane Crawl', 'Heavy vehicles & 10-wheeler logistics halted. Average transit delay expected >2 hrs across corridor.'] },
  { id: 3, label: 'Severe', icon: 'block', banner: ['Take Action: Corridor Severance Likely', 'IMD Tier-4 escalation armed. Convoy halts enforced and BRO clearing unit pre-positioned.'] },
];

export function Report() {
  const navigate = useNavigate();
  const { actions } = useStore();
  const [type, setType] = useState(TYPES[0]);
  const [severity, setSeverity] = useState(SEVERITY[1]);
  const [photoTaken, setPhotoTaken] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  function submit(e) {
    e.preventDefault();
    actions.submitReport({
      type: type.id,
      icon: type.icon,
      severity: severity.id,
      loc: 'NH-10, Pagla Jhora (Km 42.4) • Pakyong',
      detail: `${type.id} reported at verified chainage. ${severity.id >= 3 ? 'Corridor likely severed.' : 'Partial obstruction.'}`,
      advisory: `Your report from ${type.id.toLowerCase()} at NH-10 Km 42.4 is now live to all commuters within 25 km.`,
    });
    setSubmitted(true);
  }

  return (
    <MobileShell title="Home" back>
      <div className="flex flex-col w-full relative select-none">
        {/* Dimmed Contextual GIS Map Backdrop */}
        <div className="relative w-full h-56 bg-surface-container-high overflow-hidden shadow-inner">
          <MapCanvas
            center={[27.18, 88.51]}
            zoom={11}
            interactive="touch"
            corridors={[{ points: [[27.13, 88.48], [27.18, 88.51], [27.23, 88.55]], tier: 4, label: 'NH-10 · Pagla Jhora Km 42.4' }]}
            pins={[{ lat: 27.18, lon: 88.51, label: 'Active chainage · Km 41.5' }]}
          />
          <div className="absolute inset-0 bg-primary/60 backdrop-blur-[2px] flex flex-col justify-between p-margin">
            <div className="flex items-center justify-between w-full">
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-lowest text-on-surface shadow-md">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container">Live Sector Feed</span>
              </div>
              <div className="px-space-md py-space-xs rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-on-surface shadow-md flex items-center gap-space-xs">
                <Icon name="satellite_alt" size={16} className="text-primary" />
                <span className="font-telemetry-num text-telemetry-num">9 Sats Locked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sheet / Form Card */}
        <div className="sheet-up relative -mt-6 w-full bg-surface-container-lowest rounded-t-3xl shadow-[0_-8px_30px_rgba(13,28,46,0.12)] pb-12 flex flex-col">
          <div className="w-full flex items-center justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 rounded-full bg-outline-variant/60" />
          </div>

          {submitted ? (
            /* ---- Submission confirmation state ---- */
            <div className="px-margin flex flex-col gap-space-lg pt-space-md">
              <div className="flex flex-col items-center text-center gap-space-sm py-space-lg">
                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
                  <Icon name="check_circle" size={36} fill className="text-on-secondary-container" />
                </div>
                <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Report Dispatched</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-[300px]">
                  Your verified report is queued with the control room, cross-matched against ISRO Bhuvan imagery, and broadcast to commuters within 25 km.
                </p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm">
                {[
                  { icon: 'sensors', label: 'Geotag locked', value: 'NH-10 Km 42.4 · ±2.4 m' },
                  { icon: 'photo_camera', label: 'Visual evidence', value: '1 photo · EXIF tamper-sealed' },
                  { icon: 'crisis_alert', label: 'IMD severity tier', value: `Stage ${severity.id} of 3 · ${severity.label}` },
                  { icon: 'engineering', label: 'Next action', value: severity.id >= 3 ? 'BRO taskforce auto-paged' : 'PWD outpost review' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center justify-between gap-space-sm">
                    <span className="flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant">
                      <Icon name={r.icon} size={16} className="text-primary" /> {r.label}
                    </span>
                    <span className="font-telemetry-num text-telemetry-num text-on-surface text-right">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-space-sm">
                <button onClick={() => navigate('/citizen')} className="w-full h-12 rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm" type="button">
                  <Icon name="explore" size={20} />
                  <span>Back to Live Corridor Status</span>
                </button>
                <button onClick={() => { setSubmitted(false); setPhotoTaken(true); setSeverity(SEVERITY[1]); setType(TYPES[0]); }} className="w-full py-space-xs text-center font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" type="button">
                  File another field report
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="px-margin flex items-center justify-between pb-space-sm">
                <div className="flex items-center gap-space-sm">
                  <button aria-label="Go Back to Map" onClick={() => navigate('/citizen')} className="w-11 h-11 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors" type="button">
                    <Icon name="arrow_back" size={20} />
                  </button>
                  <div>
                    <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary-container font-semibold">Incident Dispatch C3</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Report Road Disruption</h2>
                  </div>
                </div>
                <a aria-label="Direct Connect Emergency SOS" className="h-11 px-space-md rounded-full bg-error-container text-on-error-container flex items-center gap-space-xs shadow-sm hover:opacity-95 transition-opacity" href="tel:112">
                  <Icon name="e911_emergency" size={18} fill />
                  <span className="font-label-sm text-label-sm tracking-wider">112 SOS</span>
                </a>
              </div>

              <form className="px-margin flex flex-col gap-space-lg pt-space-xs" onSubmit={submit}>
                {/* 1. Photo Upload Tile */}
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface flex items-center gap-space-xs">
                      <span>Visual Verification Tile</span>
                      <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-normal">Mandatory</span>
                    </label>
                    <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                      <Icon name="encrypted" size={14} /> Tamper-proof
                    </span>
                  </div>
                  <div className="w-full rounded-xl bg-surface-container-low p-space-sm shadow-sm flex flex-col gap-space-sm">
                    <div className="relative w-full h-44 rounded-lg overflow-hidden bg-surface-container">
                      {photoTaken ? (
                        <>
                          <div className="w-full h-full bg-gradient-to-br from-[#4a5f50] via-[#5d7263] to-[#8b9682]" />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-transparent to-transparent flex flex-col justify-end p-space-sm text-on-primary">
                            <div className="flex items-center justify-between w-full">
                              <span className="inline-flex items-center gap-space-xs px-space-sm py-1 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm">
                                <Icon name="check_circle" size={14} />
                                Verified EXIF Geospatial Lock
                              </span>
                              <button onClick={() => setPhotoTaken(false)} className="w-9 h-9 rounded-full bg-surface-container-lowest/80 text-on-surface flex items-center justify-center backdrop-blur-sm" type="button">
                                <Icon name="cached" size={18} />
                              </button>
                            </div>
                            <p className="font-telemetry-num text-telemetry-num text-on-primary mt-1 tracking-tight">
                              GPS: 27.1824° N, 88.5132° E • ±2.4m Alt 1,420m
                            </p>
                          </div>
                        </>
                      ) : (
                        <button onClick={() => setPhotoTaken(true)} className="w-full h-full flex flex-col items-center justify-center gap-space-xs text-on-surface-variant" type="button">
                          <Icon name="add_a_photo" size={30} className="text-primary" />
                          <span className="font-label-lg text-label-lg text-primary font-semibold">Capture field photo</span>
                          <span className="font-body-sm text-body-sm">EXIF geospatial lock applies automatically</span>
                        </button>
                      )}
                    </div>
                    <button className="w-full min-h-[48px] py-space-sm px-space-md rounded-lg bg-surface-container-lowest text-primary-container font-label-lg text-label-lg flex items-center justify-center gap-space-sm shadow-sm hover:bg-surface-container transition-colors" type="button">
                      <Icon name="add_a_photo" size={20} />
                      <span>Retake or Add Secondary Angle (Max 3)</span>
                    </button>
                  </div>
                </div>

                {/* 2. Auto-filled GPS Location Field */}
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-lg text-label-lg text-on-surface">Verified Chainage &amp; Highway Corridor</label>
                  <div className="w-full min-h-[48px] px-space-md rounded-lg bg-surface-container flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-space-sm min-w-0 pr-space-xs">
                      <Icon name="pin_drop" size={20} className="text-primary flex-shrink-0" />
                      <span className="font-body-lg text-body-lg text-on-surface truncate">NH-10, Pagla Jhora (Km 42.4) • Pakyong</span>
                    </div>
                    <button className="flex-shrink-0 font-label-md text-label-md text-primary-container font-semibold px-space-sm py-1 rounded bg-surface-container-lowest shadow-sm hover:bg-surface-container-high transition-colors" type="button">
                      Adjust Pin
                    </button>
                  </div>
                </div>

                {/* 3. Disruption Type Grid */}
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-lg text-label-lg text-on-surface">Disruption Classification</label>
                  <div aria-label="Disruption Classification Selection" className="grid grid-cols-2 gap-space-sm" role="radiogroup">
                    {TYPES.map((t) => {
                      const active = type.id === t.id;
                      return (
                        <button
                          key={t.id}
                          aria-checked={active}
                          onClick={() => setType(t)}
                          className={`flex flex-col items-start p-space-md rounded-lg relative min-h-[88px] text-left transition-all ${active ? 'bg-primary-container text-on-primary shadow-md' : 'bg-surface-container-low text-on-surface shadow-sm hover:bg-surface-container'}`}
                          role="radio"
                          type="button"
                        >
                          <div className="flex items-center justify-between w-full">
                            <Icon name={t.icon} size={24} className={active ? 'text-primary-fixed' : 'text-primary'} />
                            {active
                              ? <Icon name="check_circle" size={18} className="text-secondary-fixed" />
                              : <span className="w-4 h-4 rounded-full bg-surface-container-highest" />}
                          </div>
                          <span className="font-headline-sm text-headline-sm mt-space-xs leading-tight">{t.id}</span>
                          <span className={`font-label-sm text-label-sm mt-0.5 ${active ? 'text-primary-fixed-dim' : 'text-on-surface-variant'}`}>{t.sub}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. 3-Step Severity Slider */}
                <div className="flex flex-col gap-space-sm bg-surface-container-low p-space-md rounded-xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="font-label-lg text-label-lg text-on-surface font-semibold">IMD Severity Clearance Tier</label>
                    <span className="font-label-sm text-label-sm px-space-sm py-0.5 rounded-full bg-surface-container-highest text-on-surface font-semibold">Stage {severity.id} of 3</span>
                  </div>
                  <div className="relative flex items-center justify-between w-full py-2">
                    <div className="absolute left-6 right-6 h-1.5 bg-surface-container-highest rounded-full z-0" />
                    <div className={`absolute left-6 h-1.5 rounded-full z-0 transition-all ${severity.id === 1 ? 'w-0' : severity.id === 2 ? 'w-1/2 bg-secondary' : 'w-full bg-error'}`} />
                    {SEVERITY.map((s) => {
                      const active = severity.id === s.id;
                      const past = severity.id > s.id;
                      return (
                        <button key={s.id} onClick={() => setSeverity(s)} className="relative z-10 flex flex-col items-center" type="button">
                          <div className={`${active ? 'w-8 h-8 bg-primary-container text-on-primary shadow-lg ring-4 ring-primary-fixed/50' : past ? 'w-7 h-7 bg-secondary text-on-secondary shadow-md' : 'w-7 h-7 bg-surface-container-highest text-on-surface-variant'} rounded-full flex items-center justify-center`}>
                            <Icon name={s.icon} size={active ? 18 : 16} />
                          </div>
                          <span className={`font-label-sm text-label-sm font-semibold mt-1 ${active ? 'text-primary-container' : past ? 'text-secondary' : 'text-on-surface-variant'}`}>{s.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="p-space-sm rounded-lg bg-surface-container text-on-surface shadow-inner flex items-start gap-space-sm">
                    <Icon name="crisis_alert" size={20} className="text-primary-container flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-headline-sm text-headline-sm text-primary-container font-semibold">{severity.banner[0]}</p>
                      <p className="font-body-md text-body-md text-on-surface mt-0.5">{severity.banner[1]}</p>
                    </div>
                  </div>
                </div>

                {/* 5. Audio Voice Note */}
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-lg text-label-lg text-on-surface">Multilingual Voice Field Dispatch</label>
                  <button className="w-full min-h-[48px] py-space-sm px-space-md rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface flex items-center justify-between shadow-sm active:scale-[0.99] transition-all" type="button">
                    <div className="flex items-center gap-space-sm">
                      <div className="w-8 h-8 rounded-full bg-tertiary-container text-on-tertiary flex items-center justify-center flex-shrink-0">
                        <Icon name="mic" size={18} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="font-headline-sm text-headline-sm leading-tight text-on-surface">Hold to Record Dispatch Note</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Assamese, Bengali, Hindi, Nepali, English</span>
                      </div>
                    </div>
                    <Icon name="graphic_eq" size={20} className="text-on-surface-variant" />
                  </button>
                </div>

                {/* 6. Submit */}
                <div className="pt-space-xs">
                  <button className="w-full h-12 rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm shadow-md hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-space-sm" type="submit">
                    <Icon name="send" size={20} />
                    <span>Submit Verified Field Report</span>
                  </button>
                </div>

                {/* 7. Offline fallback */}
                <div className="w-full p-space-md rounded-xl bg-surface-container-low shadow-sm flex items-start gap-space-sm">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest text-primary-container flex items-center justify-center flex-shrink-0">
                    <Icon name="sms_failed" size={20} />
                  </div>
                  <div className="flex flex-col gap-1 text-on-surface">
                    <div className="flex items-center justify-between">
                      <span className="font-headline-sm text-headline-sm font-semibold">No Network in Mountain Passes?</span>
                      <span className="font-label-sm text-label-sm px-space-xs py-0.5 rounded bg-surface-container-highest text-primary font-semibold">Toll-Free</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Send structured SMS: <span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">NER REPORT &lt;KM&gt; &lt;TYPE&gt; &lt;LEVEL&gt;</span> to <span className="font-telemetry-num text-telemetry-num text-primary-container font-bold">56161</span>
                    </p>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
