import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../state/store.jsx';
import emblemUrl from '../assets/emblem.svg';

/* Material Symbols glyph (the design system's only icon family) */
export function Icon({ name, size = 20, fill = false, className = '', style }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontSize: size, fontVariationSettings: fill ? "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" : undefined, ...style }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

/* Official emblem (inline SVG asset from the design kit) */
export function Emblem({ className = 'h-8 w-auto' }) {
  return <img src={emblemUrl} alt="NER-Connect Official Emblem" className={`${className} object-contain`} />;
}

/* IMD 4-tier status pill: 9999px pill, 4px 10px padding, label-sm,
   explicit 6px left indicator dot for color-blind operators. */
const TIER = {
  1: { bg: 'bg-imd1-bg', text: 'text-imd1-text', dot: 'bg-imd1-text' },
  2: { bg: 'bg-imd2-bg', text: 'text-imd2-text', dot: 'bg-imd2-text' },
  3: { bg: 'bg-imd3-bg', text: 'text-imd3-text', dot: 'bg-imd3-text' },
  4: { bg: 'bg-imd4-bg', text: 'text-imd4-text', dot: 'bg-imd4-text' },
};

export function StatusPill({ tier, label, className = '', ping = false }) {
  const t = TIER[tier] ?? TIER[1];
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full ${t.bg} ${t.text} font-label-sm text-label-sm font-bold ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${t.dot} ${ping ? 'animate-ping' : ''}`} />
      {label}
    </span>
  );
}

/* Level-1 data card: white, 10px radius, 1px #E2E8F0, spec shadow */
export function Card({ className = '', children, ...rest }) {
  return (
    <div className={`rise bg-surface-container-lowest rounded-[10px] shadow-[0_1px_2px_0_rgba(15,23,42,0.05)] ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* Level-2 card (active alerts, hover, floating panels) */
export function CardL2({ className = '', children, ...rest }) {
  return (
    <div className={`bg-surface-container-lowest rounded-[10px] border border-struct-border-strong shadow-[0_4px_6px_-1px_rgba(15,23,42,0.08),0_2px_4px_-2px_rgba(15,23,42,0.04)] ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* Buttons per DESIGN.md component spec */
export function Btn({ variant = 'primary', className = '', children, ...rest }) {
  const styles = {
    primary: 'bg-primary-container text-on-primary hover:bg-primary active:bg-[#002E32]',
    secondary: 'bg-surface-container-lowest text-ink border border-struct-border-strong hover:bg-canvas hover:border-[#94A3B8]',
    tertiary: 'bg-tertiary-container text-on-tertiary hover:bg-tertiary',
    emergency: 'bg-error text-on-error hover:bg-on-error-container',
  }[variant];
  return (
    <button
      className={`rounded-lg font-label-lg text-label-lg inline-flex items-center justify-center gap-space-xs transition-all active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#90D2DA] disabled:opacity-50 ${styles} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

/* Photo evidence placeholder — offline-safe stand-in for the field photos
   used in the reference, styled as a deliberate forensic asset. */
export function PhotoEvidence({ label = 'Landslide / Rockfall', exif = 'EXIF ±3.2m', className = 'w-24 h-16', tone = 'error' }) {
  return (
    <div className={`relative rounded-lg overflow-hidden shadow-sm bg-gradient-to-br from-[#3f5a4b] via-[#546b57] to-[#7c8a76] ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-transparent to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <Icon name="landslide" size={22} fill className="text-white/85" />
      </div>
      <span className="absolute top-0.5 right-0.5 px-1 py-0.5 rounded bg-surface-container-lowest/90 font-telemetry-num text-[8px] text-primary">{exif}</span>
      <span className="absolute bottom-0.5 left-1 font-label-sm text-[8px] text-white/90 truncate w-[85%]">{label}</span>
    </div>
  );
}

/* Global toast (replaces alert() from the reference scripts) */
export function Toast() {
  const { state, actions } = useStore();
  if (!state.toast) return null;
  return (
    <button
      type="button"
      onClick={() => actions.toast(null)}
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] max-w-[92vw] sm:max-w-lg flex items-center gap-space-sm bg-inverse-surface text-inverse-on-surface rounded-lg px-space-lg py-space-md shadow-[0_20px_25px_-5px_rgba(15,23,42,0.35)] text-body-md text-left"
    >
      <Icon name="check_circle" size={18} className="text-secondary-fixed shrink-0" />
      <span className="truncate">{state.toast.msg}</span>
      <Icon name="close" size={16} className="opacity-70 shrink-0" />
    </button>
  );
}

/* ---------- Desktop console shell (fixed 288px sidebar + twin top bars) ---------- */

const CONSOLE_NAV = [
  { to: '/portal', label: 'Overview', icon: 'grid_view', end: true },
  { to: '/console', label: 'Operations Center', icon: 'radar' },
  { to: '/console/district', label: 'District Matrix', icon: 'lan' },
  { to: '/console/analytics', label: 'Analytics & Impact', icon: 'monitoring' },
  { to: '/console/moderation', label: 'Dispatch Moderation', icon: 'local_shipping' },
  { to: '/console/permits', label: 'Transit Permits / E-Pass', icon: 'badge' },
];

export function ConsoleShell({ children, office = 'Operations Command', officer }) {
  return (
    <div className="bg-background text-on-surface font-body-md text-body-md min-h-screen">
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[1px_0_8px_rgba(0,0,0,0.03)]">
        <div className="p-space-lg bg-surface flex flex-col gap-space-sm">
          <div className="flex items-center gap-space-sm">
            <Emblem />
            <div className="flex flex-col">
              <span className="font-headline-sm text-headline-sm text-primary uppercase">NER-Connect</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{office}</span>
            </div>
          </div>
          <div className="flex items-center gap-space-xs bg-primary text-on-primary px-space-sm py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-ping" />
            <span className="font-label-sm text-label-sm uppercase tracking-wider font-semibold">State Grid Synchronized</span>
          </div>
        </div>
        <div className="px-space-lg py-space-sm">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">Console Navigation</span>
        </div>
        <nav className="flex-1 px-space-md flex flex-col gap-space-xs overflow-y-auto">
          {CONSOLE_NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-space-md px-space-md py-space-sm rounded-lg transition-colors font-label-lg text-label-lg ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              <Icon name={n.icon} size={20} />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-space-md bg-surface mt-auto">
          <div className="p-space-sm bg-surface-container rounded-lg flex flex-col gap-space-xs">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-label-sm text-primary font-semibold">DISASTER HOTLINE</span>
              <Icon name="emergency" size={16} className="text-error" />
            </div>
            <span className="font-telemetry-num text-telemetry-num text-on-surface">1070 / 0361-2237054</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">NE State Emergency Cell</span>
          </div>
        </div>
      </aside>

      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 z-40 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
          <div className="bg-primary text-on-primary px-space-xl">
            <div className="flex items-center justify-between h-8">
              <div className="flex items-center gap-space-md min-w-0">
                <span className="font-label-sm text-label-sm tracking-wide uppercase truncate">Ministry of Development of North Eastern Region · Govt of India</span>
                <span className="text-outline-variant font-label-sm text-label-sm hidden lg:inline">|</span>
                <span className="font-label-sm text-label-sm text-secondary-fixed items-center gap-space-xs hidden lg:flex">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse" /> NIC SECURED
                </span>
              </div>
              <div className="flex items-center gap-space-lg">
                <span className="font-telemetry-num text-telemetry-num text-on-primary-container text-xs hidden md:inline">STATION: NERC-GUW-CTRL-01</span>
                <div className="flex items-center gap-space-xs">
                  <Icon name="language" size={13} className="text-on-primary" />
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
          <div className="h-16 px-space-xl flex items-center justify-between">
            <div className="flex items-center gap-space-md min-w-0">
              <Icon name="satellite_alt" size={24} className="text-primary" />
              <div className="flex flex-col min-w-0">
                <span className="font-label-md text-label-md text-primary font-semibold">ISRO BHUVAN SPATIAL SYNCED</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Active Monsoonal Radar &amp; Landslide Geofencing</span>
              </div>
            </div>
            <div className="flex items-center gap-space-lg">
              <div className="hidden md:flex items-center gap-space-xs bg-error-container text-on-error-container px-space-md py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                <span className="font-label-sm text-label-sm font-semibold whitespace-nowrap">Critical Alert: Sikkim NH-10 Disrupted</span>
              </div>
              <div className="flex items-center gap-space-md">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="font-label-md text-label-md text-on-surface">{officer?.name}</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">{officer?.role}</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Icon name="person" size={18} className="text-on-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="view-enter w-full pt-24 bg-background">{children}</main>
      </div>
      <Toast />
    </div>
  );
}
