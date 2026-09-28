/* ============================================================
   NER-Connect | data.js
   Mock dataset — copy and figures mirror the Stitch reference
   screens so every screen renders the designed state.
   ============================================================ */

export const OFFICER = {
  portal: { name: 'Dr. P. Barman, IAS', role: 'Joint Secy · Transit Ops' },
  console: { name: 'Dr. P. Barman, IAS', role: 'Field Dispatch Controller' },
  permits: { name: 'Rajesh Sharma, IAS', role: 'Zonal Dispatch Controller' },
};

export const STATES8 = [
  { name: 'Assam', status: 'OK' },
  { name: 'Arunachal', status: 'Caution (NH-13)' },
  { name: 'Meghalaya', status: 'OK' },
  { name: 'Manipur', status: 'Passable' },
  { name: 'Mizoram', status: 'OK' },
  { name: 'Nagaland', status: 'OK' },
  { name: 'Tripura', status: 'OK' },
  { name: 'Sikkim', status: 'Alert (NH-10)' },
];

/* ---- Corridor health (portal + ops center) ---- */
export const CORRIDORS = [
  { id: 'NH-27', name: 'NH-27 East-West Axis', via: 'Bongaigaon → Silchar', tier: 1, label: 'Clear', segments: [95, 5], cap: '8,400 Trucks/day', speed: 'Avg 54 km/h', foot: 'Capacity: 8,400 Trucks/day' },
  { id: 'NH-10', name: 'NH-10 Teesta Valley', via: 'Siliguri → Gangtok', tier: 2, label: 'Caution', segments: [60, 25, 15], foot: '29th Mile Heavy Seepage', speed: 'Avg 18 km/h' },
  { id: 'NH-37', name: 'NH-37 Kaziranga Stretch', via: 'Jakhalabandha → Bokakhat', tier: 1, label: 'Clear', segments: [100], foot: 'Speed Capped: 40 km/h (Wildlife)', speed: 'Normal Flow' },
  { id: 'NH-29', name: 'NH-29 Chumukedima', via: 'Dimapur → Kohima', tier: 3, label: 'Delay/Prep', segments: [70, 30], foot: 'Controlled convoy release', speed: 'Est Delay: +3.5h' },
];

export const PORTAL_KPIS = [
  { label: 'Active Shipments', icon: 'local_shipping', iconColor: 'text-primary', value: '412', sub: '18 Critical Medical Convoy', subIcon: 'emergency', subColor: 'text-tertiary-container' },
  { label: 'Active Severe Alerts', icon: 'warning', iconColor: 'text-error', value: '09', valueColor: 'text-error', sub: 'Across 3 states (SK, AS, NL)' },
  { label: 'Landslide Warnings', icon: 'landslide', iconColor: 'text-tertiary', value: '03', sub: 'Active radar tilt sensors firing' },
  { label: 'Transit Delay Reduction', icon: 'trending_down', iconColor: 'text-secondary', value: '-28.4%', valueColor: 'text-secondary', sub: 'vs Monsoon 2023 baseline' },
];

/* ---- Live incidents (operations center feed) ---- */
export const INCIDENTS = [
  { id: 'INC-SKM-2024-89', tier: 4, time: '09:14 IST', road: 'NH-10 km 42 (Pagla Jhora Gorge)', title: 'NH-10 km 42 (Pagla Jhora Gorge)', body: 'Catastrophic slope slump triggered by cloudburst runoff. 14 heavy commercial freight trucks stranded on northern apron. PWD JCB-300 clearing unit dispatched from Melli Depot.', team: 'JCB-300 (ETA 22 min)', bypass: 'Lava - Gorubathan (Passable)', lat: 27.16, lon: 88.42 },
  { id: 'INC-SKM-2024-91', tier: 3, time: '11:02 IST', road: 'NH-29 Chumukedima Mountain Pass', title: 'NH-29 Chumukedima Mountain Pass', body: 'Heavy soil liquefied sludge on carriage lane 2. Traffic reduced to single-lane pilot escort. Convoy speed restricted to strictly 20 km/h.', foot: 'Nagaland Police Traffic HQ Controlling', speed: 'Speed Cap: 20 km/h', lat: 25.78, lon: 93.68 },
  { id: 'INC-AS-2024-77', tier: 2, time: '13:40 IST', road: 'NH-37 Jakhalabandha Floodplain', title: 'NH-37 Jakhalabandha Floodplain', body: 'Monsoonal Brahmaputra overflow warning. Low-gradient dips submerged under 12 inches of sheet runoff. High-axle freight passing unhindered.', lat: 26.48, lon: 93.18 },
  { id: 'INC-AS-NOMINAL', tier: 1, time: 'Continuous', road: 'NH-27 Guwahati – Nagaon 4-Lane', title: 'NH-27 Guwahati – Nagaon 4-Lane', body: 'Corridor operational at full velocity. Toll plaza telemetry nominal. Average transit velocity 78 km/h. Zero weather advisories.', lat: 26.25, lon: 92.7 },
];

export const RIBBON_NH10 = [
  { pct: 28, cls: 'bg-imd1', title: 'KM 0-26 (Siliguri - Sevoke): Nominal' },
  { pct: 14, cls: 'bg-imd2-bg border-y border-imd2-border', title: 'KM 27-38 (Sevoke Bridge): Sludge Caution' },
  { pct: 22, cls: 'bg-imd4 animate-pulse', title: 'KM 39-58 (Pagla Jhora / Teesta Lowlands): FULL BLOCKAGE' },
  { pct: 18, cls: 'bg-secondary-fixed-dim', title: 'KM 59-75 (Rangpo Checkpost): Clear' },
  { pct: 18, cls: 'bg-imd1', title: 'KM 76-92 (Ranipool - Gangtok): Operational' },
];

/* ---- Freight telemetry table (ops center) ---- */
export const FREIGHT = [
  { id: 'MED-0982', cargo: 'Oxygen Cryogenic (Highland)', icon: 'emergency', pill: 'bg-tertiary-container text-on-tertiary', route: 'Silchar → Aizawl Civil Hospital', loc: 'NH-306 km 18.4', comms: 'NavIC Satellite Synced', commsDot: 'bg-secondary', commsText: 'text-secondary', risk: { tier: 3, label: 'IMD ORANGE' }, action: { type: 'chip', text: 'Auto-rerouted via bypass-2', cls: 'bg-surface-container text-tertiary' } },
  { id: 'POL-4419', cargo: 'IndianOil Diesel Convoys (x6)', icon: 'local_gas_station', pill: 'bg-surface-container-high text-on-surface', route: 'Numaligarh → Imphal Terminal', loc: 'NH-29 Chumukedima Gorge', comms: 'Cellular LTE (Intermittent)', commsDot: 'bg-imd2', commsText: 'text-imd2-text', risk: { tier: 3, label: 'IMD ORANGE' }, action: { type: 'chip', text: 'Hold at Zubza Staging Depot', cls: 'bg-surface-container text-imd3-text' } },
  { id: 'FCI-8022', cargo: 'FCI Rice Grain Reserves (120 MT)', icon: 'inventory_2', pill: 'bg-surface-container-high text-on-surface', route: 'Guwahati → Gangtok Central Store', loc: 'NH-10 km 38 (Sevoke)', comms: 'RFID Toll Sync', commsDot: 'bg-secondary', commsText: 'text-secondary', risk: { tier: 4, label: 'IMD RED' }, action: { type: 'button', text: 'Divert to Gorubathan Pass' } },
  { id: 'BRO-1190', cargo: 'Modular Bailey Bridge Steel', icon: 'hardware', pill: 'bg-surface-container-high text-on-surface', route: 'Bongaigaon → Tawang Forward Base', loc: 'NH-13 Balemu Sector', comms: 'NavIC Satellite Synced', commsDot: 'bg-secondary', commsText: 'text-secondary', risk: { tier: 1, label: 'IMD GREEN' }, action: { type: 'chip', text: 'Expedited Highland Escort', cls: 'bg-secondary-container text-on-secondary-container' } },
];

/* ---- Moderation queue (admin console) ---- */
export const MOD_QUEUE = [
  { id: '#MOD-8821', flag: 'LIVE CRITICAL', flagCls: 'bg-error-container text-on-error-container', dot: 'bg-error', when: '4 mins ago · via SACHET citizen', loc: 'Pakyong Sector, NH-10 (Km 42.4)', type: 'Landslide / Rockfall', typeIcon: 'landslide', typeColor: 'text-error', detail: 'Debris volume ~180 m³, road severed', extra: '2 Cryo O2 Tankers Trapped', extraCls: 'text-error font-bold', tier: { t: 4, label: 'Tier-4 Action' }, risk: '96%', conf: '96% Confidence', cross: '3 citizen reports + InSAR slope drift +18cm', action: { label: 'Dispatch BRO', primary: true }, photo: { exif: 'EXIF ±3.2m' }, audio: { lang: 'Nepali (Auto-translated to EN)', asr: 'ASR Match: 98.4%', transcript: '“Landslide just happened near Km 42.4 Pagla Jhora. 2 trucks stranded including green oxygen cylinder carrier. Teesta water rising rapidly near road base.”', t: '00:18 / 00:32' }, geotag: 'LAT: 27.2341° N | LON: 88.5833° E', chainage: 'Chainage: Km 42.4 (Pakyong)', elevation: 'Elevation: 1,320m ASL · Grade: 14%' },
  { id: '#MOD-8819', flag: 'HIGH RISK', flagCls: 'bg-error-container text-on-error-container', dot: 'bg-error', when: '11 mins ago · via SMS Gateway', loc: 'Chumukedima, Nagaland (NH-29)', type: 'Flash Flood / Runoff', typeIcon: 'waves', typeColor: 'text-error', detail: 'Water depth 1.2ft over culvert #44', extra: 'Heavy transport queue accumulating', tier: { t: 4, label: 'Tier-4 Action' }, risk: '89%', conf: '92% Confidence', cross: 'IMD Doppler radar echo 64mm/hr cloudburst', action: { label: 'Dispatch BRO', primary: true }, photo: { exif: 'Cell Loc ±12m' } },
  { id: '#MOD-8814', flag: 'PIPELINE ALERT', flagCls: 'bg-surface-container-highest text-primary', dot: 'bg-imd3', when: '24 mins ago · PWD Patrol Unit', loc: 'Teesta Low Dam IV, NH-10', type: 'Bridge Approach Scour', typeIcon: 'water_damage', typeColor: 'text-imd3-text', detail: 'Rani Pool pier 2 scour warning telemetry', extra: 'Heavy load restriction recommended', tier: { t: 3, label: 'Tier-3 Prep' }, risk: '78%', conf: '98% Confidence', cross: 'Direct PWD acoustic sensor + river gauge', action: { label: 'Verify Geofence', primary: false }, photo: { exif: 'EXIF ±1.8m' } },
  { id: '#MOD-8809', flag: null, dot: 'bg-imd2', when: '38 mins ago · Toll Gate Operator', loc: 'Jakhalabandha, Assam (NH-37)', type: 'Tree Collapse / Line', typeIcon: 'park', typeColor: 'text-imd2-text', detail: 'Single lane crawl, BRO team alerted', extra: 'ASEB electric crew engaged', tier: { t: 2, label: 'Tier-2 Watch' }, risk: '52%', conf: '89% Confidence', cross: '2 photo submissions + BSNL tower triangulated', action: { label: 'Clear Lane', primary: false }, photo: { exif: 'EXIF ±5.0m' } },
  { id: '#MOD-8802', flag: 'HIGH RISK', flagCls: 'bg-error-container text-on-error-container', dot: 'bg-error', when: '52 mins ago · Assam Rifles Post', loc: 'Pagla Pahar, NH-29 (Km 128)', type: 'Rockfall Multi-Block', typeIcon: 'report_problem', typeColor: 'text-error', detail: '3x heavy boulders (>25T) spanning corridor', extra: 'Hydraulic breaker rock buster required', extraCls: 'text-error font-medium', tier: { t: 4, label: 'Tier-4 Action' }, risk: '91%', conf: '94% Confidence', cross: 'Assam Rifles satellite beacon + visual telemetry', action: { label: 'Dispatch BRO', primary: true }, photo: { exif: 'EXIF ±2.1m' } },
];

/* ---- Transit permits ---- */
export const PERMITS = [
  { id: 'EP-8841-SIK', plate: 'AS-01-EC-9482', cls: 'Class 1 Cryo O2', clsPill: 'bg-tertiary-fixed text-on-tertiary-fixed', driver: 'Tashi Namgyal', operator: 'Assam Cryogenics Ltd.', uid: 'UID: •••• 9921', route: 'Guwahati → Gangtok', corridor: 'NH-10 Corridor', corridorIcon: 'alt_route', corridorIconCls: 'text-secondary', prog: [66, 34], hazard: { label: 'Low Risk', pill: 'bg-secondary-container text-on-secondary-container' }, note: 'Escorted Convoy', noteCls: 'text-tertiary font-medium', authority: 'Approved', project: 'Project Swastik', clearance: 'Clearance #SW-441', sync: 'Offline Cached', syncCls: 'bg-surface-container text-on-surface-variant', selected: true, driverLine: 'Driver: Tashi Namgyal (Aadhaar Verified)', cargoLine: 'Payload: 18.4 MT Liquid Medical O2', badge: 'bg-tertiary-fixed text-on-tertiary-fixed' },
  { id: 'EP-8839-NAG', plate: 'NL-07-A-3211', cls: 'Class 2 PDS Grain', clsPill: 'bg-surface-container-high text-on-surface', driver: 'R. Kikon', operator: 'FCI Zonal Depot Dimapur', uid: 'UID: •••• 4120', route: 'Dimapur → Kohima', corridor: 'NH-29 Corridor', corridorIcon: 'alt_route', corridorIconCls: 'text-outline', prog: [50, 50], hazard: { label: 'Moderate', pill: 'bg-secondary-fixed text-on-secondary-fixed' }, note: 'Single Lane Ops', noteCls: 'text-on-surface-variant font-medium', authority: 'Approved', project: 'Project Sewak', clearance: 'Clearance #SWK-108', sync: 'Active Net', syncCls: 'bg-secondary-container text-on-secondary-container font-semibold', driverLine: 'Driver: R. Kikon (UID Authenticated)', cargoLine: 'Payload: 22 MT Essential PDS Grain (Class 2)', badge: 'bg-secondary-fixed text-on-secondary-fixed' },
  { id: 'EP-8820-MEG', plate: 'ML-05-D-8829', cls: 'Class 2 POL Petroleum', clsPill: 'bg-error text-on-error', driver: 'B. Marak', operator: 'IOCL Refineries Barapani', uid: 'UID: •••• 7731', route: 'Shillong → Silchar', corridor: 'Sonapur Mudslip Area', corridorIcon: 'landslide', corridorIconCls: 'text-error', prog: [25, 75], rowCls: 'bg-error-container/20', hazard: { label: 'High Hazard', pill: 'bg-error-container text-on-error-container', ping: true }, note: 'Sonapur Tunnel Alert', noteCls: 'text-error font-semibold', authority: 'On Hold', authorityCls: 'text-error font-semibold', project: 'Weather Gate Halt', clearance: 'Retriaging Required', sync: 'Pending Push', syncCls: 'bg-surface-container-high text-on-surface-variant', driverLine: 'Driver: B. Marak (Flagged for Weather Alert)', cargoLine: 'Payload: 24,000L Petroleum POL (Class 2)', badge: 'bg-error-container text-on-error-container' },
  { id: 'EP-8812-ARU', plate: 'AR-01-B-1094', cls: 'Class 3 General Freight', clsPill: 'bg-surface-container text-on-surface-variant', driver: 'K. Riba', operator: 'Arunachal Infra Consortium', uid: 'UID: •••• 5518', route: 'Itanagar → Pasighat', corridor: 'NH-415 / NH-515', corridorIcon: 'alt_route', corridorIconCls: 'text-secondary', prog: [80, 20], hazard: { label: 'Clear', pill: 'bg-secondary-container text-on-secondary-container' }, note: 'Normal Transit', noteCls: '', authority: 'Approved', project: 'Project Brahmank', clearance: 'Clearance #BR-893', sync: 'Active Net', syncCls: 'bg-secondary-container text-on-secondary-container font-semibold', driverLine: 'Driver: K. Riba (Routine Clear)', cargoLine: 'Payload: 16 MT General Freight & Cement', badge: 'bg-surface-container text-on-surface-variant' },
];

/* ---- Onboarding ---- */
export const LANGUAGES = [
  { code: 'en', native: 'English', label: 'National Standard' },
  { code: 'as', native: 'অসমীয়া', label: 'Assamese' },
  { code: 'bn', native: 'বাংলা', label: 'Bengali' },
  { code: 'hi', native: 'हिन्दी', label: 'Hindi' },
  { code: 'ne', native: 'नेपाली', label: 'Nepali' },
  { code: 'mni', native: 'মৈতৈলোন্', label: 'Meitei / Manipuri' },
  { code: 'lus', native: 'Mizo ṭawng', label: 'Mizoram' },
  { code: 'brx', native: "বर'", label: 'Bodo' },
  { code: 'nag', native: 'Nagamese', label: 'Regional Lingua Franca', wide: true },
];

export const ONBOARD_DISTRICTS = [
  { id: 'kamrup', name: 'Kamrup Metropolitan (Guwahati)', sub: 'Hub Sector • Clear Weather', dot: 'bg-secondary', chip: 'Clear', chipCls: 'bg-surface-container-lowest text-secondary' },
  { id: 'pakyong', name: 'Pakyong (NH-10 Teesta Corridor)', sub: 'Mudslide Disruptions at Km 24', dot: 'bg-error', chip: 'Blocked', chipCls: 'bg-error-container text-on-error-container', subCls: 'text-error font-medium' },
  { id: 'shillong', name: 'East Khasi Hills (Shillong)', sub: 'Heavy Rain Fog Advisory (NH-06)', dot: 'bg-tertiary-fixed-dim', chip: 'Watch', chipCls: 'bg-surface-container text-on-surface-variant' },
  { id: 'dimapur', name: 'Dimapur / Kohima (NH-29)', sub: 'Pagla Pahar Regulated Transit', dot: 'bg-on-secondary-container', chip: 'Single Lane', chipCls: 'bg-surface-container text-on-surface' },
];

/* ---- Analytics ---- */
export const SEVERITY_MATRIX = [
  { state: 'Assam', total: 312, segs: [44, 28, 18, 10] },
  { state: 'Arunachal Pradesh', total: 198, segs: [25, 25, 32, 18] },
  { state: 'Nagaland', total: 164, segs: [30, 35, 22, 13] },
  { state: 'Sikkim', total: 142, segs: [20, 26, 34, 20] },
  { state: 'Meghalaya', total: 110, segs: [38, 32, 20, 10] },
  { state: 'Manipur', total: 94, segs: [34, 30, 23, 13] },
  { state: 'Mizoram', total: 76, segs: [42, 31, 19, 8] },
  { state: 'Tripura', total: 32, segs: [58, 25, 12, 5] },
];

export const VULNERABILITY = [
  { hw: 'NH-10 (Sevoke – Teesta Bridge)', icon: 'warning', iconCls: 'text-error', state: 'Sikkim / WB', tier: { label: 'Critical Red', cls: 'bg-imd4-bg text-imd4-text' }, clear: '4.2 hrs', lead: '+4.5 hrs', depot: 'Project Swastik', score: '96.4 / 100', scoreCls: 'text-error' },
  { hw: 'NH-29 (Phesama – Medziphema)', icon: 'warning', iconCls: 'text-imd3', state: 'Nagaland', tier: { label: 'Prep Orange', cls: 'bg-imd3-bg text-imd3-text' }, clear: '2.8 hrs', lead: '+3.8 hrs', depot: 'Project Sewak', score: '88.2 / 100', scoreCls: 'text-imd3' },
  { hw: 'NH-13 (Trans-Arunachal - Ziro Pass)', icon: 'warning', iconCls: 'text-imd3', state: 'Arunachal', tier: { label: 'Prep Orange', cls: 'bg-imd3-bg text-imd3-text' }, clear: '3.5 hrs', lead: '+5.1 hrs', depot: 'Project Vartak', score: '84.7 / 100', scoreCls: 'text-imd3' },
  { hw: 'NH-06 (Umiam – Jowai Corridor)', icon: 'schedule', iconCls: 'text-imd2', state: 'Meghalaya', tier: { label: 'Watch Yellow', cls: 'bg-imd2-bg text-imd2-text' }, clear: '1.9 hrs', lead: '+2.9 hrs', depot: 'Project Setuk', score: '71.0 / 100', scoreCls: 'text-imd2-text' },
  { hw: 'NH-37 (Kaziranga Bypass Sector)', icon: 'check_circle', iconCls: 'text-imd1', state: 'Assam', tier: { label: 'Clear Green', cls: 'bg-imd1-bg text-imd1-text' }, clear: '0.9 hrs', lead: '+6.2 hrs', depot: 'Project Pushpak', score: '38.4 / 100', scoreCls: 'text-secondary' },
];

/* ---- Citizen home ---- */
export const CITIZEN_ADVISORY = 'Meghalaya Border: Flash rain & mud advisory near Nongpoh (38 km away on GS Road). Heavy freight held at Jorabat.';

/* ---- Route planner (Siliguri → Gangtok on NH-10) ---- */
export const ROUTE = {
  origin: 'Siliguri Junction, WB',
  dest: 'Gangtok Central, Sikkim',
  eta: '3 hr 45 min',
  label: 'Fastest',
  km: '92 km via NH-10 Teesta Corridor',
  slowZones: 1,
  advisory: { pre: 'Teesta River road section near ', strong: 'Melli', post: ' has single-lane crawler traffic due to minor mud clearing. Light vehicles passing smoothly.' },
  highlights: [
    { icon: 'local_gas_station', iconCls: 'text-primary', value: '2', label: 'Pumps Open' },
    { icon: 'handyman', iconCls: 'text-primary', value: 'Km 38', label: 'BRO Post Active' },
    { icon: 'signal_cellular_alt', iconCls: 'text-secondary', value: '94%', label: 'Cell Coverage' },
  ],
  medicalNote: 'BRO and Sikkim Traffic Police notified for unhindered transit at Rangpo & Melli checkposts.',
};

/* ---- Convoy tracking ---- */
export const CONVOY = {
  id: 'MED-0982 · O₂ Cryo', corridor: 'NH-10 Teesta Gorge Corridor', navic: 'NavIC · 100%',
  eta: 'Arriving in 1h 45m', status: 'ON SCHEDULE',
  body: 'Transporter Convoy #4 is descending Melli bypass with police escort. Teesta road cleared by BRO; zero landslide blockages reported.',
  chainage: 'Km 38 / 114',
  nodes: [
    { name: 'Guwahati', time: '04:30 AM', state: 'done' },
    { name: 'Siliguri', time: '09:15 AM', state: 'done' },
    { name: 'Melli Br.', time: 'Active', state: 'active' },
    { name: 'Gangtok', time: 'ETA 13:30', state: 'todo', icon: 'local_hospital' },
  ],
  telemetry: [
    { label: 'Cryo Vessel', icon: 'ac_unit', iconCls: 'text-tertiary', value: '-182°C', badge: 'STABLE', badgeCls: 'text-secondary font-semibold', sub: 'Pressurized L-O₂' },
    { label: 'G-Incline', icon: 'speed', iconCls: 'text-secondary', value: '34 km/h', badge: '7° Pitch', badgeCls: 'text-on-surface-variant font-semibold', sub: 'Safe Descent Zone' },
  ],
  truck: 'AS-01-GC-4192 (Tata Signa Cryo)',
  pilot: 'Tenzing Bhutia · BRO Pilot Vehicle #2',
  waypoints: [ { top: 295, left: 172 }, { top: 350, left: 200 }, { top: 410, left: 232 }, { top: 460, left: 255 }, { top: 295, left: 172 } ],
};

/* ---- District detail (Pakyong) ---- */
export const DISTRICT = {
  breadcrumb: ['Operations Center', 'District Matrix', 'Sikkim — Pakyong & Gangtok Corridor'],
  title: 'District Drill-Down: Pakyong & East Sikkim Transit Sector',
  sub: 'NH-10 Himalayan Life-Line Gateway · Teesta Gorge Drainage Basin · High-Velocity Landslide Zone',
  meta: [
    { label: 'PWD Division', value: 'Gangtok IV (Sub-Div Pakyong)' },
    { label: 'In-Charge Executive', value: 'Er. K. Bhutia, SE PWD' },
    { label: 'Emergency Comms System', value: 'NavIC / VHF Ch 08 Active', icon: 'cell_tower', iconCls: 'text-secondary' },
    { label: 'BRO Taskforce Command', value: 'Project Swastik · 758 BRTF', cls: 'text-primary-container' },
  ],
  kpis: [
    { label: 'Total Road Network', icon: 'alt_route', value: '428.5', unit: 'km', foot: ['312 km PWD', '116.5 km BRO Arterial'] },
    { label: 'Critical Blockages', icon: 'landslide', value: '02', unit: 'Major Slumps', tone: 'error', foot: ['NH-10 Km 38 (Singtam)', 'Km 42 (Pagla Jhora)'] },
    { label: 'Stranded Heavy HGVs', icon: 'local_shipping', value: '26', unit: 'trucks halted', foot: ['Includes 2 Cryogenic O₂ Tankers'], footTone: 'warn' },
    { label: 'Inclinometer Alerts', icon: 'sensors', value: '04', unit: 'Nodes > 18°/hr', tone: 'tertiary', foot: ['Telemetry Latency: 1.2s', '9 Sensors Total'] },
    { label: 'Doppler Radar Rain', icon: 'rainy', value: '114', unit: 'mm / last 6h', foot: ['IMD Cloudburst Watch', '+28mm/hr Peak'], footTone: 'error' },
  ],
  sensors: [
    { id: 'SN-04', zone: 'Pagla Jhora Ridge 2', rate: '24.2° / hr', rateCls: 'text-error', status: 'CRITICAL', cls: 'bg-imd4-bg text-imd4-text' },
    { id: 'SN-09', zone: 'Barke Khola Cut', rate: '4.1° / hr', rateCls: 'text-imd3', status: 'WATCH', cls: 'bg-imd3-bg text-imd3-text' },
    { id: 'SN-12', zone: 'Rangpo Gorge Spur', rate: '0.2° / hr', rateCls: 'text-secondary', status: 'NORMAL', cls: 'bg-imd1-bg text-imd1-text' },
    { id: 'SN-15', zone: 'Pakyong Airport Spur', rate: '0.6° / hr', rateCls: 'text-secondary', status: 'NORMAL', cls: 'bg-imd1-bg text-imd1-text' },
  ],
  contacts: [
    { role: 'District Disaster Management Officer', org: 'Pakyong DC Secretariat', phone: '03592-257102' },
    { role: 'NDRF 2nd Battalion Commandant', org: 'Stationed at Rangpo Quick Response', phone: '+91 94340-92811' },
    { role: 'BRO Swastik Project Controller', org: '758 BRTF Operations Bunker', phone: '03592-202318' },
  ],
};
