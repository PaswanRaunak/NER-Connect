import React, { useMemo, useState } from 'react';
import { ConsoleShell, Icon, StatusPill, Card, PhotoEvidence, Btn } from '../components/ui.jsx';
import { useStore } from '../state/store.jsx';
import { OFFICER, MOD_QUEUE, PERMITS } from '../lib/data.js';

/* ============================================================
   SCREEN 13 — Admin Field-Report Moderation Console
   ============================================================ */
export function Moderation() {
  const { state, actions } = useStore();
  const [tab, setTab] = useState('pending');
  const [selected, setSelected] = useState(MOD_QUEUE[0].id);
  const [query, setQuery] = useState('');
  const item = state.queue.find((q) => q.id === selected) || state.queue[0];

  const rows = useMemo(() => state.queue.filter((q) => `${q.id} ${q.loc} ${q.type}`.toLowerCase().includes(query.toLowerCase())), [state.queue, query]);

  return (
    <ConsoleShell officer={OFFICER.console}>
      <div className="p-margin-lg flex flex-col gap-space-xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
              <span>Console Navigation</span>
              <Icon name="chevron_right" size={13} className="text-outline" />
              <span>Dispatch Moderation</span>
              <Icon name="chevron_right" size={13} className="text-outline" />
              <span className="text-primary font-semibold">Live Queue</span>
            </div>
            <div className="flex items-center gap-space-md">
              <h1 className="font-headline-lg text-headline-lg text-primary">Crowdsourced Field Telemetry Moderation</h1>
              <span className="px-space-sm py-0.5 rounded-full bg-surface-container-highest text-primary font-telemetry-num text-label-sm">LIVE FEED 40Hz</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-4xl">
              Real-time multi-sensor validation, ISRO Bhuvan satellite cross-verification, and Border Roads Organisation (BRO) heavy engineering equipment dispatch pipeline across North Eastern state corridors.
            </p>
          </div>
          <div className="flex items-center gap-space-md flex-wrap">
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-sm rounded-lg shadow-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="font-label-sm text-label-sm text-primary font-semibold tracking-wide">Auto-Triage Active (AI Guardrail v2.4)</span>
            </div>
            <button onClick={() => actions.toast('Filtered audit log exported (CSV + signed PDF) to NIC secure storage.')} className="flex items-center gap-space-xs bg-surface-container-lowest text-on-surface px-space-md py-space-sm rounded-lg shadow-sm hover:bg-surface-container-high transition-colors font-label-md text-label-md border border-struct-border">
              <Icon name="download" size={18} className="text-primary" />
              <span>Export Filtered Audit Log (CSV/PDF)</span>
            </button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {[
            { label: 'Pending Review', icon: 'pending_actions', iconCls: 'text-error/30', bg: 'bg-error/5', value: String(state.queue.length), unit: 'Incidents', foot: `${state.queue.filter((q) => q.tier?.t === 4).length} flagged as High Priority / Cryo Blockage`, footCls: 'bg-error-container/30 text-on-error-container', dot: true },
            { label: 'AI Verification Confidence', icon: 'radar', iconCls: 'text-secondary/30', bg: 'bg-secondary/5', value: '94.2%', delta: '+1.8%', deltaCls: 'text-secondary font-semibold', foot: 'ISRO Bhuvan Optical & SAR Cross-Match', footCls: 'bg-surface-container text-on-surface-variant font-medium' },
            { label: 'Avg Triage Latency', icon: 'timer', iconCls: 'text-primary/30', bg: 'bg-primary/5', value: '2m 45s', foot: 'Target < 5m SLA for Monsoonal Red Alerts', footCls: 'bg-surface-container text-secondary font-semibold' },
            { label: 'Automated BRO Deployments', icon: 'engineering', iconCls: 'text-tertiary-container/30', bg: 'bg-tertiary-container/5', value: '38', unit: 'Units Active', foot: 'Project Swastik (NH-10), Sewak (NH-29)', footCls: 'bg-surface-container text-on-surface-variant font-medium truncate' },
          ].map((k) => (
            <Card key={k.label} className="p-space-lg flex flex-col justify-between relative overflow-hidden">
              <div className={`absolute -right-3 -top-3 w-16 h-16 rounded-full ${k.bg} flex items-center justify-center`}>
                <Icon name={k.icon} size={36} className={k.iconCls} />
              </div>
              <div className="flex flex-col gap-space-xs">
                <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider">{k.label}</span>
                <div className="flex items-baseline gap-space-xs">
                  <span className="font-display text-display text-primary [font-variant-numeric:tabular-nums]">{k.value}</span>
                  {k.unit && <span className="font-headline-sm text-headline-sm text-on-surface-variant font-normal">{k.unit}</span>}
                  {k.delta && <span className={`font-label-sm text-label-sm ${k.deltaCls}`}>{k.delta}</span>}
                </div>
              </div>
              <div className={`mt-space-md pt-space-xs flex items-center gap-space-xs px-space-sm py-1 rounded ${k.footCls}`}>
                {k.dot && <span className="w-1.5 h-1.5 rounded-full bg-error" />}
                {k.label === 'Avg Triage Latency' && <Icon name="check_circle" size={14} className="text-secondary" />}
                {k.label === 'AI Verification Confidence' && <Icon name="satellite" size={14} className="text-primary" />}
                {k.label === 'Automated BRO Deployments' && <Icon name="local_shipping" size={14} className="text-primary" />}
                <span className="font-label-sm text-label-sm font-semibold truncate">{k.foot}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter strip */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col lg:flex-row gap-space-md items-stretch lg:items-center justify-between">
          <div className="flex items-center gap-space-xs overflow-x-auto pb-1 lg:pb-0">
            {[['Pending Review', String(state.queue.length)], ['Approved & Dispatched', '182'], ['False Positive / Rejected', '19'], ['SMS 56161 Ingest', '6']].map(([label, count], i) => (
              <button
                key={label}
                onClick={() => setTab(i)}
                className={`px-space-md py-space-sm rounded-lg font-label-md text-label-md flex items-center gap-space-xs whitespace-nowrap ${tab === i ? 'bg-primary-container text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}
              >
                <span>{label}</span>
                <span className={`px-1.5 py-0.2 rounded-full font-telemetry-num text-label-sm ${i === 0 ? 'bg-error text-on-error' : i === 3 ? 'bg-surface-variant text-primary' : 'bg-surface-container-highest text-on-surface-variant'}`}>{count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-space-sm flex-wrap lg:flex-nowrap">
            <div className="relative flex-1 sm:w-80">
              <Icon name="search" size={18} className="absolute left-3 top-2.5 text-outline" />
              <input
                className="w-full pl-9 pr-space-md py-2 bg-surface-container-low rounded-lg text-on-surface font-body-md text-body-md outline-none focus:bg-surface-container-lowest shadow-inner"
                placeholder="Filter by chainage, incident ID, district..."
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <select className="px-space-md py-2 bg-surface-container-low rounded-lg font-label-sm text-label-sm text-on-surface outline-none cursor-pointer">
              <option>All Corridors (NH-10, NH-29, NH-37, NH-13)</option>
              <option>NH-10 (Siliguri - Gangtok)</option>
              <option>NH-29 (Dimapur - Kohima)</option>
              <option>NH-37 (Guwahati - Kaziranga)</option>
              <option>NH-13 (Trans-Arunachal)</option>
            </select>
            <select className="px-space-md py-2 bg-surface-container-low rounded-lg font-label-sm text-label-sm text-on-surface outline-none cursor-pointer">
              <option>All Severities (IMD 4-Tier)</option>
              <option>Tier-4: Take Action (Red)</option>
              <option>Tier-3: Be Prepared (Orange)</option>
              <option>Tier-2: Watch (Yellow)</option>
              <option>Tier-1: Clear (Green)</option>
            </select>
          </div>
        </div>

        {/* Workspace split */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
          <div className="xl:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-space-md bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <Icon name="dynamic_feed" size={20} className="text-primary" />
                <span className="font-headline-sm text-headline-sm text-primary">Active Ingestion Queue (Sorted by Severe Risk Index)</span>
              </div>
              <span className="font-label-sm text-label-sm text-outline">Refreshed: 12 seconds ago</span>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                    <th className="py-space-sm px-space-md">Incident &amp; Location</th>
                    <th className="py-space-sm px-space-md">Visual Evidence</th>
                    <th className="py-space-sm px-space-md">Classification</th>
                    <th className="py-space-sm px-space-md text-center">IMD Risk</th>
                    <th className="py-space-sm px-space-md">Cross-Match</th>
                    <th className="py-space-sm px-space-md text-right">Moderation Action</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md divide-y divide-surface-container">
                  {rows.map((q, idx) => (
                    <tr
                      key={q.id}
                      onClick={() => setSelected(q.id)}
                      className={`transition-colors cursor-pointer ${q.id === item?.id ? 'bg-surface-container-high/40' : 'hover:bg-surface-container/50'}`}
                    >
                      <td className="py-space-md px-space-md">
                        <div className="flex items-start gap-space-xs">
                          <span className={`w-2 h-2 rounded-full ${q.dot} mt-1.5 flex-shrink-0`} />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-space-xs">
                              <span className="font-telemetry-num text-telemetry-num text-primary font-bold">{q.id}</span>
                              {q.flag && <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${q.flagCls}`}>{q.flag}</span>}
                            </div>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{q.when}</span>
                            <span className="font-label-sm text-label-sm text-primary font-medium mt-1">{q.loc}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md"><PhotoEvidence label={q.type} exif={q.photo.exif} /></td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col">
                          <span className={`font-label-md text-label-md font-semibold flex items-center gap-1 ${q.typeColor}`}>
                            <Icon name={q.typeIcon} size={16} /> {q.type}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface max-w-xs line-clamp-1">{q.detail}</span>
                          <span className={`font-label-sm text-label-sm mt-0.5 ${q.extraCls || 'text-on-surface-variant'}`}>{q.extra}</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <StatusPill tier={q.tier.t} label={q.tier.label} />
                          <span className="font-telemetry-num text-telemetry-num text-error font-bold [font-variant-numeric:tabular-nums]">{q.risk} Risk</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-label-sm text-label-sm text-secondary font-bold flex items-center gap-1">
                            <Icon name="verified" size={15} /> {q.conf}
                          </span>
                          <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">{q.cross}</span>
                        </div>
                      </td>
                      <td className="py-space-md px-space-md text-right">
                        <div className="flex flex-col gap-space-xs items-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); actions.moderate(q.id, 'dispatch'); }}
                            className={`px-space-md py-1.5 rounded-lg font-label-sm text-label-sm font-semibold shadow-sm flex items-center gap-1 ${q.action.primary ? 'bg-primary text-on-primary hover:bg-primary-container' : 'bg-surface-container-highest text-primary hover:bg-surface-container'}`}
                          >
                            <Icon name={q.action.primary ? 'engineering' : 'visibility'} size={16} />
                            {q.action.label}
                          </button>
                          <div className="flex items-center gap-space-xs">
                            <button onClick={(e) => { e.stopPropagation(); actions.toast(`Secondary verification photo requested for ${q.id} — nearest patrol unit pinged.`); }} className="p-1 rounded text-on-surface-variant hover:bg-surface-container" title="Request Secondary Verification Photo">
                              <Icon name="add_a_photo" size={18} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); actions.moderate(q.id, 'reject'); }} className="p-1 rounded text-on-surface-variant hover:bg-surface-container hover:text-error" title="Reject False Alarm">
                              <Icon name="cancel" size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rows.length === 0 && (
                    <tr><td colSpan={6} className="py-space-xl text-center text-on-surface-variant font-body-md">Queue clear — all field telemetry triaged. New citizen reports land here in real time.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-sm">
              <div className="flex items-center gap-space-xs font-body-sm text-body-sm text-on-surface-variant">
                <span>Showing</span>
                <span className="font-telemetry-num text-primary font-bold">1 - {rows.length}</span>
                <span>of</span>
                <span className="font-telemetry-num text-primary font-bold">{rows.length} pending reports</span>
                <span className="text-outline">|</span>
                <span className="text-secondary font-medium">Automatic queue re-order based on IMD Live Doppler Stream</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm disabled:opacity-50" disabled>Previous</button>
                <span className="px-space-sm py-1 rounded bg-primary text-on-primary font-telemetry-num text-label-sm font-bold">1</span>
                <button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm">2</button>
                <button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm">3</button>
                <button className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm">Next</button>
              </div>
            </div>
          </div>

          {/* Verification inspector */}
          <div className="xl:col-span-4 flex flex-col gap-space-md">
            {item && (
              <div className="bg-surface-container-lowest rounded-xl shadow-md overflow-hidden flex flex-col">
                <div className="p-space-md bg-primary text-on-primary flex items-center justify-between">
                  <div className="flex items-center gap-space-sm">
                    <Icon name="fact_check" size={20} className="text-secondary-fixed" />
                    <div className="flex flex-col">
                      <span className="font-headline-sm text-headline-sm text-on-primary">Verification Inspector</span>
                      <span className="font-telemetry-num text-on-primary-container text-[11px]">ACTIVE INCIDENT: {item.id}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-lowest/10 px-space-xs py-0.5 rounded">
                    <span className="w-2 h-2 rounded-full bg-error animate-ping" />
                    <span className="font-label-sm text-label-sm text-on-primary font-bold">SLA: 02:15 REMAINING</span>
                  </div>
                </div>
                <div className="p-space-md flex flex-col gap-space-md">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-inner">
                    <PhotoEvidence label={item.type} exif={item.photo.exif} className="w-full h-full rounded-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex flex-col justify-between p-space-sm pointer-events-none">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-primary/80 text-on-primary font-telemetry-num text-[11px] rounded backdrop-blur">{item.geotag || 'LAT: 27.2341° N | LON: 88.5833° E'}</span>
                        <span className="px-2 py-0.5 bg-secondary text-on-secondary font-label-sm text-label-sm rounded font-bold">EXIF VERIFIED</span>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex flex-col text-on-primary">
                          <span className="font-telemetry-num text-[13px] font-bold">{item.chainage || `Chainage: ${item.loc}`}</span>
                          <span className="font-body-sm text-[11px] opacity-90">{item.elevation || 'Elevation: 1,320m ASL · Grade: 14%'}</span>
                        </div>
                        <span className="font-label-sm text-[11px] text-primary-fixed bg-primary/90 px-1.5 py-0.5 rounded">ISRO Cartosat-3 Calibrated</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-container-low p-space-md rounded-lg flex flex-col gap-space-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-space-xs text-primary font-label-sm text-label-sm font-semibold">
                        <Icon name="record_voice_over" size={18} />
                        <span>Citizen Audio Distress Transmission</span>
                      </div>
                      <span className="font-telemetry-num text-on-surface-variant text-[11px]">{item.audio?.t || '00:18 / 00:32'}</span>
                    </div>
                    <div className="flex items-center gap-1 h-8 px-space-xs py-1 bg-surface-container rounded">
                      <button onClick={() => actions.toast('Audio playback started (Nepali ASR stream).')} className="w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center flex-shrink-0">
                        <Icon name="play_arrow" size={14} />
                      </button>
                      <div className="flex-1 flex items-center gap-0.5 h-full">
                        {[2, 4, 6, 3, 7, 5].map((h, i) => <span key={`p${i}`} className="w-1 bg-primary rounded-full" style={{ height: h * 4 }} />)}
                        {[6, 4, 2].map((h, i) => <span key={`s${i}`} className="w-1 bg-secondary rounded-full" style={{ height: h * 4 }} />)}
                        {[4, 5, 2, 3, 6, 2, 1].map((h, i) => <span key={`o${i}`} className="w-1 bg-outline-variant rounded-full" style={{ height: h * 4 }} />)}
                      </div>
                      <Icon name="volume_up" size={16} className="text-outline" />
                    </div>
                    <div className="p-space-xs bg-surface-container-lowest rounded text-on-surface-variant font-body-sm text-body-sm italic">
                      {item.audio?.transcript || '“Heavy water flowing over the culvert near Chumukedima. Trucks queued for two hours now, water rising slowly.”'}
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-label-sm">
                      <span>Language: {item.audio?.lang || 'Nagamese (Auto-translated to EN)'}</span>
                      <span className="text-secondary font-bold">{item.audio?.asr || 'ASR Match: 92.1%'}</span>
                    </div>
                  </div>

                  <div className="p-space-md bg-surface-container-low rounded-lg flex flex-col gap-space-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider">Nearest Civil Engineering Assets</span>
                      <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-[10px] font-bold">STANDBY READY</span>
                    </div>
                    <div className="flex items-start gap-space-sm">
                      <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0">
                        <Icon name="construction" size={22} className="text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-headline-sm text-headline-sm text-on-surface">Project Swastik - Melli Base</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant">Distance: 14.2 km · Est. Transit: 28 mins</span>
                        <div className="flex items-center gap-space-xs mt-1 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-telemetry-num text-[11px] font-semibold">1x CAT D6 Dozer (#SW-12)</span>
                          <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-telemetry-num text-[11px] font-semibold">1x JCB 3DX Backhoe</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-space-xs">
                      <Icon name="satellite_alt" size={20} className="text-secondary" />
                      <div className="flex flex-col">
                        <span className="font-label-sm text-label-sm text-primary font-semibold">ISRO Bhuvan SAR Slope Displacement</span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">Sub-surface shear strain detected: +18cm slope drift</span>
                      </div>
                    </div>
                    <span className="font-telemetry-num text-error font-bold text-label-sm">UNSTABLE</span>
                  </div>

                  <div className="flex flex-col gap-space-xs mt-space-xs">
                    <button onClick={() => actions.moderate(item.id, 'dispatch')} className="w-full py-space-sm px-space-md rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-all shadow-md flex items-center justify-center gap-space-xs">
                      <Icon name="send_time_extension" size={18} />
                      <span>Confirm Verification &amp; Dispatch BRO Taskforce</span>
                    </button>
                    <div className="grid grid-cols-2 gap-space-xs">
                      <button onClick={() => actions.toast('NDRF cryo mobilization ordered: 2 oxygen tanker escorts rolling to site.')} className="py-space-sm px-space-xs rounded-lg bg-tertiary-container text-on-tertiary font-label-sm text-label-sm font-semibold hover:bg-tertiary transition-colors flex items-center justify-center gap-1 shadow-sm">
                        <Icon name="local_hospital" size={16} />
                        <span>Mobilize NDRF Cryo</span>
                      </button>
                      <button onClick={() => actions.toast('SACHET geofence SMS queued for 34,200 residents within 15 km of the incident grid.')} className="py-space-sm px-space-xs rounded-lg bg-error text-on-error font-label-sm text-label-sm font-semibold hover:bg-on-error-container transition-colors flex items-center justify-center gap-1 shadow-sm">
                        <Icon name="cell_tower" size={16} />
                        <span>SACHET Geofence SMS</span>
                      </button>
                    </div>
                    <button onClick={() => actions.moderate(item.id, 'merge')} className="w-full py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm transition-colors mt-1">
                      Mark as Cross-Duplicate / Merge with Incident #MOD-8818
                    </button>
                  </div>
                </div>
              </div>
            )}

            <Card className="p-space-md flex flex-col gap-space-xs">
              <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Incident Controller Log</span>
              {state.moderationLog.length > 0 ? (
                <ul className="flex flex-col gap-1">
                  {state.moderationLog.map((l, i) => <li key={i} className="font-body-sm text-body-sm text-on-surface">{l}</li>)}
                </ul>
              ) : (
                <p className="font-body-sm text-body-sm text-on-surface">
                  Control Room Officer Barman logged: Medical Oxygen container convoy from Durgapur rerouted via Coronation Bridge &amp; Lava Sector pending NH-10 clearing operations.
                </p>
              )}
              <div className="flex items-center justify-between text-outline text-[11px] pt-1">
                <span>Logged: Today {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</span>
                <span>Security Hash: 7b8f-MDoNER</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ConsoleShell>
  );
}

/* ============================================================
   SCREEN 14 — Digital Transit Permits / Inter-State Clearance
   ============================================================ */
function QrGlyph({ className = 'w-full h-full text-primary' }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm8-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm11-2h1v1h-1v-1zm2 0h2v2h-1v-1h-1v-1zm-3 2h2v1h-2v-1zm4 1h1v2h-2v-1h1v-1zm-3 1h1v2h-1v-2zm-1 2h2v1h-2v-1zm4 0h2v1h-2v-1zm-1 1h1v1h-1v-1z" />
    </svg>
  );
}

export function Permits() {
  const { state, actions } = useStore();
  const [permits, setPermits] = useState(PERMITS);
  const [active, setActive] = useState(PERMITS[0].id);
  const [qrFor, setQrFor] = useState(null);
  const [newPass, setNewPass] = useState(false);
  const [search, setSearch] = useState('');
  const [checkpoint, setCheckpoint] = useState('ALL');

  const all = [...state.issuedPasses.map((p) => ({ ...p, userIssued: true })), ...permits];
  const rows = all.filter((p) => `${p.id} ${p.plate} ${p.route} ${p.corridor}`.toLowerCase().includes(search.toLowerCase()) && (checkpoint === 'ALL' || p.corridor.includes(checkpoint)));
  const sel = all.find((p) => p.id === active) || all[0];

  function issue(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const id = `#EP-${8850 + state.issuedPasses.length}-EMG`;
    actions.issuePass({
      id, plate: f.get('plate'), cls: 'Class 1 Emergency', clsPill: 'bg-tertiary-fixed text-on-tertiary-fixed',
      driver: f.get('authority') || 'Emergency Desk', operator: 'Monsoonal Emergency Issue', uid: 'UID: verified',
      route: f.get('corridor').split('(')[0].trim(), corridor: f.get('corridor'), corridorIcon: 'alt_route', corridorIconCls: 'text-secondary',
      prog: [10, 90], hazard: { label: 'New Issue', pill: 'bg-secondary-container text-on-secondary-container' }, note: 'Emergency Corridor',
      noteCls: 'text-tertiary font-semibold', authority: 'Approved', project: f.get('authority') || 'BRO Liaison', clearance: 'Auto-cleared',
      sync: 'Active Net', syncCls: 'bg-secondary-container text-on-secondary-container font-semibold',
      driverLine: `Driver: Aadhaar ${String(f.get('aadhaar')).replace(/.(?=.)/g, '•')} (Verified)`, cargoLine: 'Payload: Priority emergency consignment',
      badge: 'bg-tertiary-fixed text-on-tertiary-fixed',
    });
    setActive(id);
    setNewPass(false);
  }

  return (
    <ConsoleShell office="Transit & Logistics Grid" officer={OFFICER.permits}>
      <div className="w-full px-space-xl pb-space-3xl flex-1">
        <div className="flex flex-col w-full gap-space-xl">
          {/* Header */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-lg bg-surface-container-lowest p-space-xl rounded-xl shadow-sm">
            <div className="flex flex-col gap-space-xs">
              <div className="flex flex-wrap items-center gap-space-sm">
                <span className="px-space-sm py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm uppercase tracking-wider font-semibold">NIC e-Pramaan Live Sync</span>
                <span className="inline-flex items-center gap-1.5 px-space-sm py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                  Node: AS-GHY-09 Active
                </span>
                <span className="font-telemetry-num text-body-sm text-on-surface-variant font-medium">Synced 14s ago</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Inter-State Transit Pass &amp; Special Monsoonal Clearance</h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl">Command Desk for Section D5: Authorizing heavy-freight conduits, BRO landslide clearance protocols, and cryogenic oxygen priority convoys across the 8 NE States.</p>
            </div>
            <div className="flex flex-wrap items-center gap-space-md self-start xl:self-center">
              <button onClick={() => actions.toast('Encrypted CSV ledger queued for the State Transport Commission review node.')} className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md">
                <Icon name="download" size={18} />
                <span>Export Inspection Ledger (CSV)</span>
              </button>
              <button onClick={() => actions.toast('All pending permits traversing [NH-06-SONAPUR] transitioned to HOLD status.')} className="flex items-center gap-space-xs px-space-md py-space-sm rounded-lg bg-error-container text-on-error-container hover:opacity-90 transition-opacity font-label-md text-label-md">
                <Icon name="warning" size={18} />
                <span>Bulk Corridor Revocation</span>
              </button>
              <button onClick={() => setNewPass(true)} className="flex items-center gap-space-xs px-space-lg py-space-sm rounded-lg bg-primary-container text-on-primary hover:bg-primary transition-colors font-label-md text-label-md shadow-sm">
                <Icon name="add_circle" size={18} />
                <span>Issue Emergency Pass (+)</span>
              </button>
            </div>
          </div>

          {/* KPI ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-lg">
            {[
              { label: 'Active Transit Passes', icon: 'badge', iconCls: 'bg-surface-container text-primary', value: '2,845', delta: '+8.4%', deltaCls: 'text-secondary', sub: 'Across all 8 North Eastern states', pct: 82, bar: 'bg-primary' },
              { label: 'Priority Cryo/Medical NOCs', icon: 'medical_services', iconCls: 'bg-tertiary-fixed text-on-tertiary-fixed', value: '142', valueCls: 'text-tertiary', delta: 'Active', deltaCls: 'text-tertiary', sub: '100% Green Corridor Escorted', pct: 100, bar: 'bg-tertiary-container' },
              { label: 'Flagged / Checkpoint Holds', icon: 'report_problem', iconCls: 'bg-error-container text-on-error-container', value: '19', valueCls: 'text-error', delta: 'Holds', deltaCls: 'text-error', sub: 'Pakyong & Chumukedima gates', pct: 24, bar: 'bg-error' },
              { label: 'Avg Clearance Processing', icon: 'bolt', iconCls: 'bg-secondary-container text-on-secondary-container', value: '4m 12s', delta: '-48s vs MoM', deltaCls: 'text-secondary', sub: 'Automated AI fitness & route verification', pct: 94, bar: 'bg-secondary' },
            ].map((k) => (
              <div key={k.label} className="flex flex-col justify-between p-space-lg rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold">{k.label}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${k.iconCls}`}>
                    <Icon name={k.icon} size={20} />
                  </div>
                </div>
                <div className="mt-space-md">
                  <div className="flex items-baseline gap-space-xs">
                    <span className={`font-display text-display ${k.valueCls ?? 'text-primary'}`}>{k.value}</span>
                    <span className={`font-label-md text-label-md font-semibold ${k.deltaCls}`}>{k.delta}</span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{k.sub}</p>
                </div>
                <div className="w-full bg-surface-container-high h-1 rounded-full mt-space-md overflow-hidden">
                  <div className={`h-full rounded-full ${k.bar}`} style={{ width: `${k.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Search / filters */}
          <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-md">
              <div className="relative flex-1">
                <Icon name="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
                <input
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-fixed-dim transition-all"
                  placeholder="Search by Vehicle Registration, Aadhaar Token, Pass ID (#EP-...), or Consignor..."
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="relative">
                  <select className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim cursor-pointer" value={checkpoint} onChange={(e) => setCheckpoint(e.target.value)}>
                    <option value="ALL">All State Checkpoints</option>
                    <option value="NH-10">Sikkim Rangpo Gate (NH-10)</option>
                    <option value="NH-17">Assam Boxirhat (NH-17)</option>
                    <option value="NH-06">Meghalaya Byrnihat (NH-06)</option>
                    <option value="NH-29">Nagaland New Field (NH-29)</option>
                  </select>
                  <Icon name="arrow_drop_down" size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-surface-container-low text-on-surface font-label-md text-label-md py-2.5 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim cursor-pointer">
                    <option value="ALL">All Cargo Tiers</option>
                    <option value="CLASS1">Class 1: Cryogenic Medical / Liquid O2</option>
                    <option value="CLASS2">Class 2: Petroleum &amp; PDS Rations</option>
                    <option value="CLASS3">Class 3: General Heavy Freight / Steel</option>
                    <option value="CLASS4">Class 4: Private Commuter / Light Utility</option>
                  </select>
                  <Icon name="arrow_drop_down" size={18} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
                </div>
                <button onClick={() => { setSearch(''); setCheckpoint('ALL'); }} className="p-2.5 rounded-lg bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors" title="Reset Filters">
                  <Icon name="filter_alt_off" size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-xs pt-space-xs">
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold mr-space-xs">Strategic Corridors:</span>
              {[['NH-10 (Sevoke-Gangtok)', 'Active Convoy', 'bg-secondary', false], ['NH-06 (Sonapur Tunnel)', 'Mudslip Watch', 'bg-error', true], ['NH-29 (Dimapur-Kohima)', 'Single-lane', 'bg-secondary', false], ['NH-515 (Pasighat Link)', 'Open', 'bg-secondary', false]].map(([n, s, dot, ping]) => (
                <button key={n} className="px-space-md py-1 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm flex items-center gap-1.5 hover:bg-primary-fixed transition-colors">
                  <span className={`w-2 h-2 rounded-full ${dot} ${ping ? 'animate-ping' : ''}`} /> {n} <span className={`font-telemetry-num ${ping ? 'text-error font-semibold' : 'text-on-surface-variant font-normal'}`}>{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Roster */}
            <div className="lg:col-span-8 flex flex-col bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
              <div className="p-space-lg flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <Icon name="view_timeline" size={22} className="text-primary" />
                  <h2 className="font-headline-sm text-headline-sm text-primary">Live Transit Roster &amp; Clearance Feed</h2>
                </div>
                <div className="flex items-center gap-space-sm">
                  <span className="px-2 py-0.5 rounded bg-surface-container font-telemetry-num text-body-sm text-on-surface-variant">Showing {rows.length} of 2,845</span>
                  <button onClick={() => actions.toast('Roster refreshed from NIC-NE-HUB-GHY edge cache.')} className="p-1 rounded text-on-surface-variant hover:text-on-surface"><Icon name="refresh" size={20} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
                      <th className="py-space-md px-space-lg">Permit ID &amp; Vehicle</th>
                      <th className="py-space-md px-space-md">Consignor &amp; Operator</th>
                      <th className="py-space-md px-space-md">Corridor Path</th>
                      <th className="py-space-md px-space-md">Hazard Matrix</th>
                      <th className="py-space-md px-space-md">BRO / Authority</th>
                      <th className="py-space-md px-space-md">Sync Node</th>
                      <th className="py-space-md px-space-lg text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container-low font-body-md text-body-md">
                    {rows.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setActive(p.id)}
                        className={`transition-colors cursor-pointer group ${p.rowCls || ''} ${p.id === active ? 'bg-surface-container-high/40' : 'hover:bg-surface-container-low/60'}`}
                      >
                        <td className="py-space-md px-space-lg">
                          <div className="flex flex-col">
                            <span className="font-telemetry-num text-primary font-bold">{p.id}</span>
                            <span className="font-label-sm text-label-sm text-on-surface font-semibold tracking-wide">{p.plate}</span>
                            <span className={`mt-1 inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${p.clsPill}`}>{p.cls}</span>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md">
                          <div className="flex flex-col">
                            <span className="font-body-md text-body-md text-on-surface font-medium">{p.driver}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{p.operator}</span>
                            <span className="font-label-sm text-label-sm text-outline">{p.uid}</span>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md">
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md text-primary font-semibold">{p.route}</span>
                            <span className="font-body-sm text-body-sm flex items-center gap-1 text-on-surface-variant">
                              <Icon name={p.corridorIcon} size={14} className={p.corridorIconCls} /> {p.corridor}
                            </span>
                            <div className="w-24 bg-surface-container h-1 rounded-full mt-1.5 overflow-hidden flex">
                              <div className={`h-full ${p.prog[0] >= 66 ? 'bg-secondary' : p.prog[0] >= 40 ? 'bg-secondary-fixed-dim' : 'bg-error'}`} style={{ width: `${p.prog[0]}%` }} />
                              <div className="bg-surface-dim h-full" style={{ width: `${p.prog[1]}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold w-fit ${p.hazard.pill}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${p.hazard.ping ? 'bg-error animate-ping' : p.hazard.pill.includes('error') ? 'bg-error' : 'bg-secondary'}`} /> {p.hazard.label}
                            </span>
                            <span className={`font-label-sm text-label-sm ${p.noteCls}`}>{p.note}</span>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md">
                          <div className="flex flex-col">
                            <span className={`font-label-md text-label-md font-semibold ${p.authorityCls ?? 'text-on-surface'}`}>{p.authority}</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant">{p.project}</span>
                            <span className="font-label-sm text-label-sm text-secondary font-medium">{p.clearance}</span>
                          </div>
                        </td>
                        <td className="py-space-md px-space-md">
                          <span className={`px-2 py-1 rounded font-label-sm text-label-sm ${p.syncCls}`}>{p.sync}</span>
                        </td>
                        <td className="py-space-md px-space-lg text-right">
                          <div className="flex items-center justify-end gap-space-xs">
                            {p.rowCls ? (
                              <button onClick={(e) => { e.stopPropagation(); setActive(p.id); }} className="px-2.5 py-1 rounded bg-primary-container text-on-primary font-label-sm text-label-sm hover:bg-primary transition-colors">Inspect &amp; Release</button>
                            ) : (
                              <>
                                <button onClick={(e) => { e.stopPropagation(); setQrFor(p.id); }} className="p-1.5 rounded hover:bg-surface-container-high text-primary" title="Show QR Code"><Icon name="qr_code_2" size={18} /></button>
                                <button onClick={(e) => { e.stopPropagation(); actions.toast(`NIC e-Audit Ledger for ${p.id}: registered Dispur Core (AS-01), biometric check Rangpo Unit 03, SHA-256 verified [OK].`); }} className="p-1.5 rounded hover:bg-surface-container-high text-on-surface-variant" title="Audit Trail"><Icon name="history" size={18} /></button>
                                <button onClick={(e) => { e.stopPropagation(); actions.toast(`Corridor clearance revoked for ${p.id}. Status pushed to offline edge caches.`); }} className="p-1.5 rounded hover:bg-error-container text-error" title="Emergency Revocation"><Icon name="block" size={18} /></button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-space-md bg-surface-container-low flex flex-col sm:flex-row items-center justify-between gap-space-md text-on-surface-variant font-label-sm text-label-sm">
                <span>Showing Page 1 of 712 (Active Monsoonal Registry)</span>
                <div className="flex items-center gap-1">
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface disabled:opacity-50" disabled>Previous</button>
                  <button className="px-2.5 py-1 rounded bg-primary-container text-on-primary font-bold">1</button>
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">2</button>
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">3</button>
                  <span className="px-1">...</span>
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">712</button>
                  <button className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface">Next</button>
                </div>
              </div>
            </div>

            {/* Inspector drawer */}
            <div className="lg:col-span-4 flex flex-col gap-space-lg">
              <div className="bg-surface-container-lowest p-space-xl rounded-xl shadow-sm flex flex-col gap-space-lg">
                <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
                  <div className="flex items-center gap-space-xs">
                    <Icon name="verified_user" size={22} className="text-primary" />
                    <span className="font-headline-sm text-headline-sm text-primary">Clearance Inspector</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-telemetry-num text-label-sm font-bold ${sel.badge}`}>{sel.id}</span>
                </div>
                <div className="flex items-start gap-space-md bg-surface-container-low p-space-md rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                    <Icon name="local_shipping" size={28} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">{sel.plate}</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{sel.driverLine}</span>
                    <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-0.5">{sel.cargoLine}</span>
                  </div>
                </div>
                <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface uppercase font-semibold flex items-center gap-1">
                      <Icon name="lock" size={16} className="text-secondary" /> NIC SHA-256 Seal
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">VALID</span>
                  </div>
                  <p className="font-telemetry-num text-[11px] leading-tight text-on-surface-variant break-all select-all">
                    4e8b10f27c95a3d70659db02e3a479c882194f107cfa28e08d66042db60807fa
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[11px] text-on-surface-variant">
                    <span>Timestamp: 2024-09-18 04:31:02 IST</span>
                    <span>Node: NIC-NE-HUB-GHY</span>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm text-on-surface uppercase font-semibold flex items-center gap-1">
                      <Icon name="cloud_sync" size={16} className="text-primary" /> IMD Doppler Corridor Feed
                    </span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium">NH-10 Live: Minor Rain</span>
                  </div>
                  <div className="w-full h-36 rounded-lg relative overflow-hidden flex flex-col justify-end p-2 bg-gradient-to-br from-[#5d7263] to-[#39544a]">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
                    <div className="relative z-10 flex items-center justify-between text-on-primary">
                      <div>
                        <div className="font-label-sm text-label-sm uppercase tracking-wide opacity-80">Sector 4 (Kalijhora-Teesta)</div>
                        <div className="font-telemetry-num text-body-md font-bold">Precip: 4.2 mm/hr | Wind: 14 km/h</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-secondary text-on-secondary font-label-sm text-label-sm font-semibold">Passable</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-space-xs bg-surface-container-low p-space-md rounded-lg">
                  <span className="font-label-sm text-label-sm text-on-surface uppercase font-semibold">Gate Inspection Protocol</span>
                  {['Vehicle Gross Laden Weight < 28 MT (NH-10 Cap)', 'Driver Aadhaar Biometrics Authenticated', 'Cryogenic Telemetry Seal Intact (Pressure: 4.2 Bar)'].map((c) => (
                    <label key={c} className="flex items-center gap-space-sm cursor-pointer">
                      <input defaultChecked className="w-4 h-4 rounded text-primary focus:ring-0" type="checkbox" />
                      <span className="font-body-sm text-body-sm text-on-surface">{c}</span>
                    </label>
                  ))}
                </div>
                <div className="flex flex-col gap-space-sm pt-space-xs">
                  <button onClick={() => actions.toast(`GREEN CORRIDOR BROADCAST: Police pilot and emergency lights clearance transmitted to all traffic outposts for pass ${sel.id}.`)} className="w-full py-3 px-space-md rounded-lg bg-tertiary-container text-on-tertiary font-label-md text-label-md font-semibold flex items-center justify-center gap-space-sm hover:opacity-95 transition-opacity shadow-sm">
                    <Icon name="traffic" size={20} />
                    <span>Grant Green Corridor Escort</span>
                  </button>
                  <button onClick={() => actions.toast(`Thermal pass slip for ${sel.id} sent to the gate printer pool.`)} className="w-full py-2.5 px-space-md rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-label-md text-label-md flex items-center justify-center gap-space-sm">
                    <Icon name="receipt_long" size={18} />
                    <span>Print Thermal Official Pass Slip</span>
                  </button>
                </div>
                <div className="flex items-center gap-space-md p-space-md bg-surface-container-lowest rounded-lg border border-struct-border">
                  <div className="w-16 h-16 bg-surface-container p-1 rounded flex items-center justify-center flex-shrink-0">
                    <QrGlyph className="w-full h-full text-primary" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold uppercase">Checkpoint Offline Handshake</span>
                    <span className="font-body-sm text-body-sm text-on-surface truncate">Scan via Rugged POS Terminal</span>
                    <span className="font-label-sm text-label-sm text-secondary font-medium mt-0.5">RSA-4096 Certified</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-low p-space-lg rounded-xl flex flex-col gap-space-sm">
                <div className="flex items-center justify-between">
                  <span className="font-label-sm text-label-sm text-error uppercase font-bold flex items-center gap-1">
                    <Icon name="warning" size={18} /> Live Weather Advisory
                  </span>
                  <span className="font-telemetry-num text-label-sm text-on-surface-variant">Update: 10m ago</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">NH-06 Sonapur Tunnel vicinity experienced 85mm localized downpour. All Class 2 Heavy Hydrocarbon Tankers held at Meghalaya border until 16:00 IST clearance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR modal */}
        {qrFor && (
          <div className="fixed inset-0 z-[80] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-lg">
            <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-2xl shadow-2xl flex flex-col gap-space-lg">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-primary">Transit Permit Barcode &amp; QR</span>
                  <span className="font-telemetry-num text-body-sm text-on-surface-variant font-bold">{qrFor}</span>
                </div>
                <button onClick={() => setQrFor(null)} className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <Icon name="close" size={20} />
                </button>
              </div>
              <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-low rounded-xl">
                <div className="w-48 h-48 bg-surface-container-lowest p-3 rounded-lg shadow-sm flex items-center justify-center">
                  <QrGlyph className="w-full h-full text-primary" />
                </div>
                <span className="font-telemetry-num text-label-sm text-on-surface-variant mt-3 tracking-widest font-semibold">NIC-QR-2024-8841-SECURE</span>
              </div>
              <div className="flex flex-col gap-1 text-center">
                <span className="font-headline-sm text-headline-sm text-on-surface">Vehicle {all.find((p) => p.id === qrFor)?.plate}</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Authenticated for {all.find((p) => p.id === qrFor)?.route} Checkpost</span>
              </div>
              <div className="flex items-center gap-space-sm">
                <Btn variant="secondary" className="flex-1 py-2.5" onClick={() => setQrFor(null)}>Close</Btn>
                <Btn className="flex-1 py-2.5" onClick={() => { setQrFor(null); actions.toast(`Thermal pass slip for ${qrFor} sent to the gate printer pool.`); }}>Print Pass</Btn>
              </div>
            </div>
          </div>
        )}

        {/* Issue pass modal */}
        {newPass && (
          <div className="fixed inset-0 z-[80] bg-inverse-surface/60 backdrop-blur-sm flex items-center justify-center p-space-lg">
            <div className="bg-surface-container-lowest max-w-xl w-full rounded-2xl p-space-2xl shadow-2xl flex flex-col gap-space-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <Icon name="add_task" size={24} className="text-primary" />
                  <h3 className="font-headline-sm text-headline-sm text-primary">Issue Emergency Monsoonal Pass</h3>
                </div>
                <button onClick={() => setNewPass(false)} className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <Icon name="close" size={20} />
                </button>
              </div>
              <form className="flex flex-col gap-space-md" onSubmit={issue}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="plate">Vehicle Registration</label>
                    <input name="plate" required className="px-3 py-2 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim" placeholder="e.g. AS-01-XX-0000" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="aadhaar">Driver Aadhaar Number</label>
                    <input name="aadhaar" required maxLength={12} className="px-3 py-2 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim" placeholder="12 Digit UID" type="password" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="corridor">Corridor Route</label>
                    <select name="corridor" className="px-3 py-2 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim">
                      <option>NH-10 (Sevoke to Gangtok)</option>
                      <option>NH-29 (Dimapur to Kohima)</option>
                      <option>NH-06 (Shillong to Silchar)</option>
                      <option>NH-415 (Bandardewa to Itanagar)</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="cargo">Cargo Classification</label>
                    <select name="cargo" className="px-3 py-2 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim">
                      <option>Class 1: Cryogenic Liquid Oxygen</option>
                      <option>Class 2: Petroleum &amp; POL Rations</option>
                      <option>Class 2: PDS Food Grain Supply</option>
                      <option>Class 3: Essential Structural Steel</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm text-on-surface font-semibold" htmlFor="authority">Issuing Clearance Authority / BRO Liaison</label>
                  <input name="authority" className="px-3 py-2 bg-surface-container-low rounded-lg font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-fixed-dim" placeholder="e.g. BRO Project Swastik / Disaster Cell Dispur" />
                </div>
                <div className="p-space-md rounded-lg bg-surface-container flex items-start gap-space-xs text-on-surface-variant">
                  <Icon name="verified" size={18} className="text-secondary" />
                  <span className="font-body-sm text-body-sm">Emergency issuance bypasses 24h standard clearance window and flags all highway tolls for automated boom lift.</span>
                </div>
                <div className="flex items-center justify-end gap-space-sm pt-space-xs">
                  <button className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md" onClick={() => setNewPass(false)} type="button">Cancel</button>
                  <button className="px-5 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md font-semibold hover:bg-primary transition-colors" type="submit">Generate e-Pass</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ConsoleShell>
  );
}
