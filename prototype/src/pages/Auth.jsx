import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon, Emblem, Btn } from '../components/ui.jsx';
import { useStore } from '../state/store.jsx';
import { LANGUAGES, ONBOARD_DISTRICTS } from '../lib/data.js';

/* ============================================================
   SCREEN 2 — Citizen / Official Login
   ============================================================ */
export function Login() {
  const navigate = useNavigate();
  const { actions } = useStore();
  const [mode, setMode] = useState('signin');
  const [role, setRole] = useState('citizen');
  const [emailMode, setEmailMode] = useState(false);
  const [credential, setCredential] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  function pickRole(r) {
    setRole(r);
    if (r === 'official' && !emailMode) setEmailMode(true);
    if (r !== 'official') setEmailMode(false);
  }

  function submit(e) {
    e.preventDefault();
    if (!credential.trim()) return;
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setDone(true);
      actions.signIn(role, credential.trim());
      setTimeout(() => navigate('/otp'), 700);
    }, 900);
  }

  const roles = [
    { id: 'citizen', icon: 'person', title: 'Citizen & Traveler', desc: 'Commuter road status' },
    { id: 'transporter', icon: 'local_shipping', title: 'Transporter', desc: 'Convoy & fleet transit' },
    { id: 'official', icon: 'shield_person', title: 'Govt Official', desc: 'PWD, BRO & NOC' },
  ];

  return (
    <div className="view-enter bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <button aria-label="Go Back" onClick={() => navigate('/')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary rounded-full hover:bg-surface-container transition-colors">
              <Icon name="arrow_back" size={24} />
            </button>
            <Emblem />
            <h1 className="font-headline-sm text-headline-sm text-primary tracking-tight ml-space-xs truncate max-w-[160px]">Citizen Login</h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant">
              <Icon name="verified_user" size={14} className="text-secondary" />
              <span className="font-label-sm text-label-sm font-semibold tracking-wide">NIC SECURE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe flex-1">
        <div className="flex flex-col w-full max-w-[480px] mx-auto px-margin pb-margin-lg space-y-space-md">
          <div className="flex flex-col items-center text-center pt-space-xs pb-space-xs">
            <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-surface-container-high text-on-surface-variant shadow-sm">
              <Icon name="assured_workload" size={16} fill className="text-primary" />
              <span className="font-label-sm text-label-sm uppercase tracking-wide">MDoNER • Govt of India</span>
            </div>
            <p className="font-label-md text-label-md text-on-surface-variant mt-1.5 font-medium">
              Integrated North East Transit &amp; Disaster Logistics Portal
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-md p-space-md flex flex-col space-y-space-md">
            <div className="grid grid-cols-2 p-1 bg-surface-container rounded-lg" role="tablist">
              {['signin', 'register'].map((m) => (
                <button
                  key={m}
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  role="tab"
                  type="button"
                  className={`min-h-[44px] py-2 rounded-lg font-label-lg text-label-lg transition-all flex items-center justify-center gap-1.5 ${mode === m ? 'shadow-sm bg-surface-container-lowest text-primary font-bold' : 'text-on-surface-variant'}`}
                >
                  <Icon name={m === 'signin' ? 'lock_open' : 'person_add'} size={18} />
                  <span>{m === 'signin' ? 'Sign In' : 'Register'}</span>
                </button>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <label className="font-label-md text-label-md text-on-surface font-semibold uppercase tracking-wider">Select Clearance Identity</label>
                <span className="font-label-sm text-label-sm text-primary font-medium flex items-center gap-0.5">
                  <Icon name="tune" size={14} /> Mandated
                </span>
              </div>
              <div aria-label="Portal User Role" className="grid grid-cols-3 gap-2" role="radiogroup">
                {roles.map((r) => {
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      aria-checked={active}
                      onClick={() => pickRole(r.id)}
                      role="radio"
                      type="button"
                      className={`relative flex flex-col text-left p-2.5 rounded-lg shadow-sm min-h-[108px] transition-all ${active ? 'bg-primary-container text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container'}`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <Icon name={r.icon} size={20} className={active ? 'text-primary-fixed' : 'text-primary'} />
                        <Icon name="check_circle" size={16} fill className={`${active ? '' : 'hidden'} text-secondary-fixed`} />
                      </div>
                      <span className={`font-label-lg text-label-lg font-bold leading-tight block ${active ? 'text-white' : ''}`}>{r.title}</span>
                      <span className={`font-body-sm text-body-sm mt-auto block ${active ? 'text-on-primary-container' : 'text-on-surface-variant'}`}>{r.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form className="space-y-space-md" onSubmit={submit}>
              {!emailMode ? (
                <div className="flex flex-col space-y-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="mobile-number">
                    <span>Registered Mobile Number</span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">SMS OTP Auth</span>
                  </label>
                  <div className="flex items-center rounded-lg bg-surface-container-lowest shadow-sm h-12 overflow-hidden px-2 gap-2 focus-within:ring-2 focus-within:ring-primary-container">
                    <div className="flex items-center gap-1 bg-surface-container-high px-2 py-1.5 rounded-lg text-primary select-none">
                      <span className="font-telemetry-num text-telemetry-num font-bold tracking-tight">+91</span>
                    </div>
                    <input
                      className="w-full h-full bg-transparent text-on-surface font-telemetry-num text-telemetry-num tracking-wider focus:outline-none placeholder:text-outline/60 tabular-nums"
                      id="mobile-number"
                      inputMode="numeric"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      placeholder="98765 43210"
                      required
                      type="tel"
                      value={credential}
                      onChange={(e) => setCredential(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    />
                    {credential && (
                      <button type="button" aria-label="Clear number" onClick={() => setCredential('')} className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface">
                        <Icon name="cancel" size={18} />
                      </button>
                    )}
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-0.5">
                    High terrain fallback enabled: SMS routes through local BSNL &amp; V-SAT gateways.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col space-y-1">
                  <label className="font-label-md text-label-md text-on-surface font-semibold flex items-center justify-between" htmlFor="gov-email">
                    <span>Official Government Email ID</span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">Kavach / NIC Validated</span>
                  </label>
                  <div className="flex items-center rounded-lg bg-surface-container-lowest shadow-sm h-12 overflow-hidden px-3 gap-2 focus-within:ring-2 focus-within:ring-primary-container">
                    <Icon name="mail" size={20} className="text-primary" />
                    <input
                      className="w-full h-full bg-transparent text-on-surface font-body-md text-body-md focus:outline-none placeholder:text-outline/60"
                      id="gov-email"
                      placeholder="officer@nic.in / bro.gov.in"
                      type="email"
                      required
                      value={credential}
                      onChange={(e) => setCredential(e.target.value)}
                    />
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pt-0.5">
                    Restricted to authorized domains (*.nic.in, *.gov.in, *.bro.nic.in).
                  </p>
                </div>
              )}

              <div className="pt-0.5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { setEmailMode(!emailMode); setCredential(''); }}
                  className="inline-flex items-center gap-1.5 text-primary-container hover:text-primary font-label-md text-label-md font-semibold transition-colors"
                >
                  <Icon name="domain_verification" size={16} />
                  <span>{emailMode ? 'Use Mobile Number Instead' : 'Use Official Govt Email (nic.in / gov.in)'}</span>
                </button>
              </div>

              <button
                className={`w-full h-12 rounded-lg text-on-primary font-headline-sm text-headline-sm flex items-center justify-center gap-2 shadow-md transition-all ${done ? 'bg-secondary' : 'bg-primary-container hover:bg-primary'} ${busy ? 'opacity-90' : ''}`}
                disabled={busy || done}
                type="submit"
              >
                {busy ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="font-headline-sm text-headline-sm">Routing Gateway...</span>
                  </>
                ) : done ? (
                  <>
                    <Icon name="check_circle" size={20} />
                    <span className="font-headline-sm text-headline-sm">OTP Dispatched (Check SMS)</span>
                  </>
                ) : (
                  <>
                    <span>{mode === 'signin' ? 'Send Verification OTP' : 'Register Identity & Request OTP'}</span>
                    <Icon name="arrow_forward" size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-space-sm p-space-sm rounded-lg bg-surface-container-low text-on-surface">
              <Icon name="security" size={20} fill className="text-secondary" />
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md font-bold text-on-surface">Transit Pass Continuity Guarantee</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Session state syncs offline over NH-37 &amp; NH-10 hill sectors.</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center text-center space-y-space-xs pt-1">
            <div className="flex items-center justify-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm">
              <Icon name="verified" size={15} className="text-secondary" />
              <span>Encrypted Comms • NIC Secure Gateway • 256-bit AES</span>
            </div>
            <div className="bg-surface-container-high px-space-md py-2 rounded-lg w-full text-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant">
                Trouble signing in? Dial <a className="text-primary font-bold underline" href="tel:1070">1070</a> (State Disaster Cell) or SMS <span className="font-telemetry-num text-telemetry-num font-bold text-primary">56161</span>
              </p>
            </div>
            <div className="flex items-center gap-3 pt-1 text-outline font-label-sm text-label-sm">
              <a className="hover:text-primary transition-colors" href="#emergency">Emergency Protocol</a>
              <span>•</span>
              <a className="hover:text-primary transition-colors" href="#offline">Offline Checkpoints</a>
              <span>•</span>
              <a className="hover:text-primary transition-colors" href="#imd">IMD North East Cell</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   SCREEN 3 — Secure OTP Verification
   Demo OTP: any 6 digits (hint shown for judges).
   ============================================================ */
export function OtpVerify() {
  const navigate = useNavigate();
  const { state } = useStore();
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(24);
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const masked = state.auth?.credentialType === 'email'
    ? state.auth?.credential
    : `+91 ${state.auth?.credential?.slice(0, 5) || '98640'} •••••`;

  function setDigit(i, v) {
    const val = v.replace(/\D/g, '').slice(-1);
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  }

  function onKeyDown(i, e) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  }

  function verify(e) {
    e.preventDefault();
    navigate('/onboarding');
  }

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <button aria-label="Go Back" onClick={() => navigate('/login')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary rounded-full hover:bg-surface-container transition-colors">
              <Icon name="arrow_back" size={24} />
            </button>
            <Emblem />
            <h1 className="font-headline-sm text-headline-sm text-primary tracking-tight ml-space-xs truncate max-w-[160px]">Otp Verification</h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant">
              <Icon name="verified_user" size={14} className="text-secondary" />
              <span className="font-label-sm text-label-sm font-semibold tracking-wide">NIC SECURE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe flex-1">
        <div className="flex flex-col w-full max-w-[480px] mx-auto px-margin py-space-md">
          <div className="flex items-center justify-between mb-space-md">
            <button onClick={() => navigate('/login')} className="flex items-center gap-space-xs text-on-surface-variant hover:text-primary transition-colors py-1">
              <Icon name="arrow_back" size={18} />
              <span className="font-label-sm text-label-sm font-semibold uppercase tracking-wider">Back to Login</span>
            </button>
            <div className="flex items-center gap-space-xs bg-surface-container-high px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">SH-04 Comms Link Active</span>
            </div>
          </div>

          <div className="w-full bg-surface-container-lowest rounded-xl shadow-md p-space-lg flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <div className="flex flex-col items-center text-center mt-space-xs mb-space-lg">
              <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary mb-space-sm shadow-sm">
                <Icon name="cell_tower" size={26} />
              </div>
              <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight font-bold">Verify Mobile Number</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1 max-w-[280px]">
                Enter the 6-digit verification code sent via SMS to <span className="font-telemetry-num text-telemetry-num text-on-surface font-semibold">{masked}</span>
              </p>
              <p className="font-label-sm text-label-sm text-primary mt-1.5 bg-surface-container-low px-2 py-0.5 rounded-full">Prototype mode: any 6 digits verify</p>
            </div>

            <form className="flex flex-col w-full gap-space-lg" onSubmit={verify}>
              <div className="flex justify-between items-center w-full gap-1.5 px-0.5">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    aria-label={`Digit ${i + 1}`}
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    autoFocus={i === 0}
                    className="otp-field w-11 h-12 text-center text-on-surface bg-surface-container-low rounded-lg font-telemetry-num text-[20px] font-bold focus:bg-surface-container-lowest focus:outline-none focus:ring-2 focus:ring-primary focus:shadow-sm transition-all caret-primary"
                    inputMode="numeric"
                    maxLength={1}
                    pattern="[0-9]*"
                    type="text"
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => onKeyDown(i, e)}
                  />
                ))}
              </div>

              <div className="flex flex-col items-center gap-space-sm pt-space-xs">
                <div className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
                  <Icon name="schedule" size={16} className="text-primary" />
                  <span>Resend code in <strong className="font-telemetry-num text-telemetry-num text-primary">{`00:${String(timeLeft).padStart(2, '0')}`}</strong></span>
                </div>
                <div className="flex items-center justify-center gap-space-md text-center">
                  <button className={`font-label-md text-label-md flex items-center gap-1 transition-colors ${timeLeft > 0 ? 'text-outline cursor-not-allowed opacity-50' : 'text-primary font-semibold hover:underline'}`} disabled={timeLeft > 0} type="button">
                    <Icon name="sms" size={15} />
                    <span>Resend SMS</span>
                  </button>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <button className="font-label-md text-label-md text-primary font-semibold hover:underline flex items-center gap-1" type="button">
                    <Icon name="call" size={15} />
                    <span>Resend via Voice Call</span>
                  </button>
                </div>
              </div>

              <div className="w-full bg-surface-container-low rounded-lg p-space-sm flex items-start gap-space-sm">
                <div className="w-7 h-7 rounded-md bg-surface-container-highest flex items-center justify-center text-primary shrink-0 mt-0.5">
                  <Icon name="satellite_alt" size={18} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-sm text-label-sm text-on-surface font-semibold">No network on mountain road?</span>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-snug">
                    Receive OTP via Satellite Telemetry Relay (NavIC/Bhuvan SMS) directly to your rugged dispatch unit.
                  </p>
                  <button className="mt-1.5 text-left font-label-sm text-label-sm text-primary font-bold inline-flex items-center gap-1 hover:opacity-80" type="button">
                    <span>Switch to NavIC Relay</span>
                    <Icon name="arrow_forward" size={14} />
                  </button>
                </div>
              </div>

              <Btn type="submit" className="w-full h-12 bg-primary text-on-primary font-semibold shadow hover:opacity-95">
                <Icon name="verified" size={20} />
                <span>Verify &amp; Continue</span>
              </Btn>
            </form>
          </div>

          <div className="mt-space-lg flex flex-col items-center justify-center text-center px-space-sm">
            <div className="flex items-center justify-center gap-space-xs text-on-surface-variant mb-1">
              <Icon name="encrypted" size={15} className="text-secondary" />
              <span className="font-label-sm text-label-sm font-semibold tracking-wide uppercase">NIC Multi-Factor Authentication Gateway</span>
            </div>
            <div className="flex items-center gap-1.5 text-outline">
              <span className="font-label-sm text-label-sm">STQC Certified Level-3 Assurance</span>
              <span className="inline-block w-1 h-1 rounded-full bg-outline-variant" />
              <span className="font-label-sm text-label-sm font-telemetry-num">AES-256 GCM</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   SCREEN 4 — Onboarding: Language & Corridor Node
   ============================================================ */
export function Onboarding() {
  const navigate = useNavigate();
  const { state, actions } = useStore();
  const [lang, setLang] = useState(state.language || 'as');
  const [district, setDistrict] = useState(state.district || 'kamrup');
  const [query, setQuery] = useState('');
  const [perms, setPerms] = useState({ alerts: true, gps: true, sms: true });

  const filtered = ONBOARD_DISTRICTS.filter((d) => `${d.name} ${d.sub}`.toLowerCase().includes(query.toLowerCase()));

  function complete() {
    actions.onboard(lang, district);
    navigate(state.auth?.role === 'transporter' ? '/citizen/tracking' : '/citizen');
  }

  const permRows = [
    { key: 'alerts', icon: 'warning', title: 'Live Monsoonal Disaster Alerts', sub: 'IMD Flash flood & slide warnings' },
    { key: 'gps', icon: 'fmd_good', title: 'GPS Geofenced Corridor Updates', sub: 'Real-time highway chainage checks' },
    { key: 'sms', icon: 'sms', title: 'Offline Emergency SMS Gateway', sub: 'Low-frequency telemetry without data' },
  ];

  return (
    <div className="bg-surface font-body-md text-on-surface flex flex-col min-h-screen">
      <header className="fixed top-0 w-full z-50 pt-safe bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="h-16 px-space-sm flex items-center justify-between">
          <div className="flex items-center gap-space-xs">
            <button aria-label="Go Back" onClick={() => navigate('/otp')} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary rounded-full hover:bg-surface-container transition-colors">
              <Icon name="arrow_back" size={24} />
            </button>
            <Emblem />
            <h1 className="font-headline-sm text-headline-sm text-primary tracking-tight ml-space-xs truncate max-w-[160px]">Citizen Login</h1>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-space-xs px-space-sm py-1 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant">
              <Icon name="verified_user" size={14} className="text-secondary" />
              <span className="font-label-sm text-label-sm font-semibold tracking-wide">NIC SECURE</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Icon name="person" size={18} className="text-on-primary" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col relative w-full pt-16 pb-safe flex-1">
        <div className="flex flex-col w-full max-w-[480px] mx-auto">
          <div className="px-margin pt-space-md pb-space-lg flex flex-col gap-space-lg">
            <div className="flex flex-col gap-space-xs">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase tracking-wider">Onboarding Setup</span>
                <span className="font-label-sm text-label-sm text-primary font-bold">Step 1 of 3</span>
              </div>
              <p className="font-headline-sm text-headline-sm text-on-surface tracking-tight">Regional Language &amp; Corridor Node</p>
              <div className="flex items-center gap-space-xs mt-space-xs w-full">
                <div className="h-1.5 flex-1 rounded-full bg-primary-container transition-all duration-300" />
                <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest transition-all duration-300" />
                <div className="h-1.5 flex-1 rounded-full bg-surface-container-highest transition-all duration-300" />
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex items-center gap-space-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 text-primary">
                <Icon name="cell_tower" size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-on-surface">SACHET Integrated Alert Feed</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">High-priority civil disaster broadcasts for NE India</span>
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface flex items-center gap-space-xs">
                  <span>Native-Script Operating Language</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container" />
                </label>
                <span className="font-label-sm text-label-sm text-on-surface-variant">Tap to switch</span>
              </div>
              <div className="grid grid-cols-2 gap-space-xs">
                {LANGUAGES.map((l) => {
                  const active = lang === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`text-left p-space-sm rounded-lg shadow-sm flex items-center justify-between transition-all ${l.wide ? 'col-span-2' : ''} ${active ? 'bg-surface-container-high' : 'bg-surface-container-lowest'}`}
                      type="button"
                    >
                      <div className="flex flex-col min-w-0">
                        <span className={`font-label-md text-label-md truncate ${active ? 'text-primary font-bold' : 'text-on-surface'}`}>{l.native}</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{l.label}</span>
                      </div>
                      <Icon name="check_circle" size={18} fill={active} className={active ? 'text-primary-container' : 'hidden'} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex flex-col gap-space-xs">
                <label className="font-label-md text-label-md text-on-surface">Primary Operational District / Corridor</label>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Live passability tracking anchored to your deployment zone</span>
              </div>
              <div className="relative flex items-center">
                <Icon name="search" size={20} className="absolute left-space-md text-on-surface-variant" />
                <input
                  className="w-full h-11 pl-10 pr-space-md bg-surface-container-lowest rounded-lg font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-low shadow-sm transition-all"
                  id="corridor-search"
                  placeholder="Search your district or transit highway..."
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-space-xs mt-space-xs">
                {filtered.map((d) => {
                  const active = district === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDistrict(d.id)}
                      className={`p-space-sm rounded-lg shadow-sm flex items-center justify-between cursor-pointer transition-colors ${active ? 'bg-surface-container-high' : 'bg-surface-container-lowest'}`}
                    >
                      <div className="flex items-center gap-space-sm min-w-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${d.dot} shrink-0`} />
                        <div className="flex flex-col min-w-0 text-left">
                          <span className="font-label-md text-label-md text-on-surface truncate">{d.name}</span>
                          <span className={`font-body-sm text-body-sm truncate ${d.subCls || 'text-on-surface-variant'}`}>{d.sub}</span>
                        </div>
                      </div>
                      <span className={`px-space-xs py-0.5 rounded-full font-label-sm text-label-sm font-bold shrink-0 ${d.chipCls}`}>{d.chip}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-space-sm">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface">Critical Alerts &amp; Sensor Permissions</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Required for zero-network emergency clearance beacons</span>
              </div>
              <div className="flex flex-col gap-space-xs">
                {permRows.map((p) => {
                  const on = perms[p.key];
                  return (
                    <div key={p.key} className="p-space-sm rounded-lg bg-surface-container-lowest shadow-sm flex items-center justify-between gap-space-sm">
                      <div className="flex items-center gap-space-sm min-w-0">
                        <div className="w-9 h-9 rounded-md bg-surface-container flex items-center justify-center shrink-0 text-primary">
                          <Icon name={p.icon} size={20} />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-label-md text-label-md text-on-surface truncate">{p.title}</span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant">{p.sub}</span>
                        </div>
                      </div>
                      <button
                        aria-checked={on}
                        onClick={() => setPerms((x) => ({ ...x, [p.key]: !x[p.key] }))}
                        className={`shrink-0 w-12 h-6 rounded-full relative p-0.5 transition-colors focus:outline-none ${on ? 'bg-primary-container' : 'bg-surface-container-highest'}`}
                        role="switch"
                        type="button"
                      >
                        <span className={`w-5 h-5 rounded-full bg-on-primary block shadow-sm transform transition-transform ${on ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-space-sm pt-space-xs pb-space-md">
              <button
                onClick={complete}
                className="w-full h-12 rounded-lg bg-primary-container text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-space-xs shadow-md active:bg-primary transition-colors"
                type="button"
              >
                <span>Complete Setup &amp; Enter NER-Connect</span>
                <Icon name="arrow_forward" size={20} />
              </button>
              <button onClick={complete} className="w-full py-space-xs text-center font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors" type="button">
                Skip for now (Defaults to English &amp; National Corridor)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
