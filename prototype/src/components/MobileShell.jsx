import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icon, Emblem, Toast } from './ui.jsx';
import { useStore } from '../state/store.jsx';

/* Citizen / transporter mobile app shell. The reference screens are
   mobile_stack mocks: on desktop the app renders as a centered phone
   column so the layout matches the designed canvas. */

const NAVS = [
  { to: '/citizen', icon: 'explore', label: 'Home' },
  { to: '/citizen/route', icon: 'alt_route', label: 'Route' },
  { to: '/citizen/report', icon: 'add_a_photo', label: 'Report' },
  { to: '/citizen/tracking', icon: 'local_shipping', label: 'Track' },
  { to: '/citizen/offline-pass', icon: 'qr_code_2', label: 'Pass' },
];

export function MobileTopBar({ title = 'Home', back = false, subtitle = 'NER-Connect' }) {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 px-margin flex items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-sm min-w-0">
          {back && (
            <button aria-label="Go Back" onClick={() => navigate(-1)} className="min-w-[44px] min-h-[44px] flex items-center justify-center text-primary rounded-full hover:bg-surface-container transition-colors">
              <Icon name="arrow_back" size={24} />
            </button>
          )}
          <Emblem className="h-8 w-auto object-contain flex-shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-label-sm text-label-sm uppercase tracking-wide text-primary-container truncate">{subtitle}</span>
            <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <button aria-label="SOS Emergency Distress" className="h-11 px-space-sm rounded-full bg-error-container text-on-error-container flex items-center gap-space-xs min-h-[44px] min-w-[44px] justify-center">
            <Icon name="sos" size={18} />
            <span className="font-label-sm text-label-sm hidden sm:inline">SOS</span>
          </button>
          <button aria-label="Switch Language" className="h-11 px-space-sm rounded-full bg-surface-container-high text-on-surface flex items-center gap-space-xs min-h-[44px] min-w-[44px] justify-center">
            <Icon name="translate" size={18} />
            <span className="font-label-sm text-label-sm">EN/অসমীয়া</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <Icon name="person" size={18} className="text-on-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function MobileShell({ title, back, children }) {
  const nav = NAVS;
  return (
    <div className="min-h-screen bg-[#dbe4f0] sm:py-6 flex justify-center">
      <div className="relative w-full sm:max-w-[420px] bg-surface sm:rounded-[28px] sm:shadow-[0_20px_60px_rgba(13,28,46,0.25)] sm:overflow-hidden flex flex-col min-h-[100dvh] sm:min-h-[860px] sm:max-h-[92vh]">
        <div className="flex flex-col h-full sm:overflow-y-auto no-scrollbar">
          <MobileTopBar title={title} back={back} />
          <main className="flex-1 flex flex-col relative w-full pt-16 pb-20 bg-surface">{children}</main>
          <nav className="fixed sm:absolute bottom-0 w-full z-50 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-around h-16 px-space-xs">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end
                  className={({ isActive }) =>
                    `flex flex-col items-center justify-center min-w-[48px] min-h-[48px] px-space-xs py-space-xs transition-colors ${
                      isActive ? 'text-primary-container font-headline-sm' : 'text-on-surface-variant'
                    }`
                  }
                >
                  <Icon name={n.icon} size={24} />
                  <span className="font-label-sm text-label-sm mt-space-xs">{n.label}</span>
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
      <Toast />
    </div>
  );
}
