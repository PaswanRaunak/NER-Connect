import React from 'react';

export function Logo({ size = 32, showText = true, className = '', subtitle = 'NORTH EAST LOGISTICS & TRANSIT' }) {
  return (
    <div className={`brand-logo-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <rect width="48" height="48" rx="12" fill="#0c4a4f" />
        {/* Route chart polyline */}
        <path d="M10 32L19 20L28 26L38 14" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Green origin node */}
        <circle cx="10" cy="32" r="4" fill="#32d796" />
        {/* Amber waypoint node */}
        <circle cx="28" cy="26" r="4.5" fill="#f5b841" />
        {/* White target node */}
        <circle cx="38" cy="14" r="4" fill="#ffffff" />
        {/* Dashed water/road line underneath */}
        <path d="M12 39C16 38 20 40 24 39C28 38 32 40 36 39" stroke="#31d3c0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
      </svg>
      {showText && (
        <div className="brand-text-block" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
          <div className="brand-main-title" style={{ display: 'flex', alignItems: 'center', fontWeight: 900, fontSize: '17px', letterSpacing: '0.02em', color: '#094246' }}>
            NER<span style={{ color: '#0088cc', margin: '0 1px' }}>-</span>CONNECT
          </div>
          <div className="brand-sub-title" style={{ fontSize: '7.5px', fontWeight: 700, letterSpacing: '0.11em', color: '#567a82', marginTop: '2px', textTransform: 'uppercase' }}>
            {subtitle}
          </div>
        </div>
      )}
    </div>
  );
}
