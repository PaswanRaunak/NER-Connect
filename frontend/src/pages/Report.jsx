import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../components/Icons.jsx';
import { useStore } from '../state/store.jsx';
import { SMS } from '../lib/seed.js';

const DISRUPTION_TYPES = [
  { id: 'Landslide', title: 'Landslide / Rockfall', sub: 'Mud, slope collapse', icon: 'landslide' },
  { id: 'Flood', title: 'Flash Flood / Water', sub: 'Submerged culvert', icon: 'water' },
  { id: 'Roadblock', title: 'Roadblock / Strike', sub: 'Civil bandh, tree fall', icon: 'traffic' },
  { id: 'Bridge Damage', title: 'Bridge Structural', sub: 'Pier tilt, abutment wash', icon: 'bridge' },
];

export default function Report() {
  const { state, actions } = useStore();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('Landslide');
  const [severity, setSeverity] = useState('severe'); // 'minor' | 'moderate' | 'severe'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const sevScore = severity === 'severe' ? 5 : severity === 'moderate' ? 3 : 1;
    const out = await actions.submitReport({
      segId: 'NH54-01',
      type: selectedType,
      severity: sevScore,
      note: 'Analyzed: High Rockfall Density near KM 42.5. Field verified.',
    });
    setIsSubmitting(false);
    if (out) {
      setSubmittedResult(out);
      actions.toast(`Verification Report Dispatched to BRO Project SEWAK.`, 'ok');
    }
  };

  return (
    <div className="mobile-app-shell">
      {/* Top telemetry sync header */}
      <div style={{ background: '#e0f2fe', borderBottom: '1px solid #bae6fd', padding: '6px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, color: '#0369a1' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284c7' }} />
          <span>SAT-SYNC ACTIVE &bull; IRNSS L5</span>
        </div>
        <span style={{ fontFamily: 'var(--f-mono)' }}>25.792&deg; N, 93.774&deg; E</span>
      </div>

      <div className="report-wizard-wrap">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h1 style={{ fontSize: '17px', fontWeight: 900, color: '#0f2a33' }}>Report Road Disruption</h1>
            <span style={{ background: '#e2e8f0', color: '#334155', fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px' }}>
              BRO-NET
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
            Crowdsourced &amp; Border Roads Org (BRO) Verification Network
          </p>
        </div>

        {submittedResult ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 800, fontSize: '14px' }}>
              <Icon name="shieldCheck" size={20} color="#15803d" />
              <span>Report Authenticated &amp; Dispatched!</span>
            </div>
            <p style={{ fontSize: '12px', color: '#1e293b' }}>
              {submittedResult.seg.road} is now scored <strong className="mono">{submittedResult.seg.risk}%</strong> and autonomous convoy diversion alerts have been triggered.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                className="btn-submit-verification"
                style={{ flex: 1, padding: '10px' }}
                onClick={() => navigate('/?focus=NH54-01')}
              >
                View on Live Map
              </button>
              <button
                type="button"
                className="lang-selector-btn"
                style={{ padding: '10px' }}
                onClick={() => setSubmittedResult(null)}
              >
                File Another
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Step 1: Photographic Evidence */}
            <div>
              <div className="wizard-step-header">1. PHOTOGRAPHIC EVIDENCE</div>
              <div className="photo-evidence-card">
                <div className="photo-preview-box">
                  {/* High fidelity simulation of verified landslide photo */}
                  <svg width="100%" height="160" viewBox="0 0 400 160" fill="none" preserveAspectRatio="none">
                    <rect width="400" height="160" fill="#2d3748" />
                    {/* Mountains & sky */}
                    <path d="M0 100L90 40L180 80L270 20L400 90V160H0Z" fill="#4a5568" />
                    {/* Landslide mud slurry */}
                    <path d="M120 70L240 160H80Z" fill="#744210" opacity="0.8" />
                    {/* Army convoy truck */}
                    <rect x="80" y="105" width="45" height="28" rx="3" fill="#2f855a" />
                    <circle cx="90" cy="135" r="5" fill="#1a202c" />
                    <circle cx="115" cy="135" r="5" fill="#1a202c" />
                  </svg>

                  <div className="photo-ai-badge">
                    <Icon name="warn" size={12} color="#ef4444" />
                    <span>&bull; Analyzed: High Rockfall Density (92% CONF)</span>
                  </div>
                </div>

                <div className="photo-meta-bar">
                  <span style={{ fontWeight: 800, color: '#1e293b' }}>photo_img_01.jpg (2.4 MB) &bull; Verified</span>
                  <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>Geo-stamped</span>
                </div>
              </div>
            </div>

            {/* Step 2: Incident Telemetry Point */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div className="wizard-step-header" style={{ margin: 0 }}>2. INCIDENT TELEMETRY POINT</div>
                <button type="button" style={{ fontSize: '11px', color: '#0c4a4f', fontWeight: 800 }}>Edit Location</button>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid var(--mobile-border)', borderRadius: '12px', padding: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#0e4c52', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="pin" size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f2a33' }}>NH-29, KM Marker 42.5</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Near Chumoukedima Bridge, Dimapur District...</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <span style={{ background: '#ecfdf5', color: '#047857', fontSize: '9.5px', fontWeight: 800, padding: '2px 7px', borderRadius: '4px' }}>
                      &bull; GPS Accuracy &plusmn; 4 meters
                    </span>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', fontSize: '9.5px', fontWeight: 800, padding: '2px 7px', borderRadius: '4px' }}>
                      Elevation 620m MSL
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Disruption Classification */}
            <div>
              <div className="wizard-step-header">3. DISRUPTION CLASSIFICATION</div>
              <div className="classification-grid">
                {DISRUPTION_TYPES.map((dt) => {
                  const isSel = selectedType === dt.id;
                  return (
                    <button
                      key={dt.id}
                      type="button"
                      className={`class-card-btn ${isSel ? 'selected' : ''}`}
                      onClick={() => setSelectedType(dt.id)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Icon name={dt.icon} size={18} color={isSel ? '#ffffff' : '#0c4a4f'} />
                        {isSel && <Icon name="check" size={14} color="#ffffff" />}
                      </div>
                      <div className="class-card-title">{dt.title}</div>
                      <div className="class-card-sub">{dt.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Passage Severity */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div className="wizard-step-header" style={{ margin: 0 }}>4. PASSAGE SEVERITY</div>
                {severity === 'severe' && (
                  <span style={{ color: '#dc2626', fontSize: '10.5px', fontWeight: 800 }}>&bull; Red Status Dispatch</span>
                )}
              </div>

              <div className="severity-pill-selector">
                <button
                  type="button"
                  className={`sev-btn minor ${severity === 'minor' ? 'selected' : ''}`}
                  onClick={() => setSeverity('minor')}
                >
                  &bull; Minor
                </button>
                <button
                  type="button"
                  className={`sev-btn moderate ${severity === 'moderate' ? 'selected' : ''}`}
                  onClick={() => setSeverity('moderate')}
                >
                  &bull; Moderate
                </button>
                <button
                  type="button"
                  className={`sev-btn severe ${severity === 'severe' ? 'selected' : ''}`}
                  onClick={() => setSeverity('severe')}
                >
                  &bull; Severe (Blockage)
                </button>
              </div>

              {severity === 'severe' && (
                <div className="severe-warning-callout" style={{ marginTop: '8px' }}>
                  <Icon name="warn" size={16} color="#991b1b" />
                  <span>
                    <strong>Severe declaration:</strong> Triggers autonomous diversion alerts to all transit freight on Dimapur-Kohima arterial corridor.
                  </span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="btn-submit-verification"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              <Icon name="send" size={16} color="#ffffff" />
              <span>{isSubmitting ? 'DISPATCHING TELEMETRY...' : 'Submit Verification Report'}</span>
            </button>

            <div style={{ textAlign: 'center', fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
              Authenticated by Border Intelligence Unit &bull; Dispatched to BRO Project SEWAK
            </div>

            {/* Offline Hybrid Protocol / SMS */}
            <div className="offline-sms-card">
              <Icon name="satellite" size={18} color="#4338ca" />
              <div>
                <div style={{ fontWeight: 800, color: '#312e81' }}>Offline Hybrid Protocol</div>
                <div style={{ marginTop: '2px', color: '#475569' }}>
                  No mobile internet in mountain gorge? Send SMS: <strong>NER REPORT 42.5 ROCKFALL SEVERE</strong> to <strong>56161</strong> (Toll-Free via BSNL Satellite Trunk).
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
