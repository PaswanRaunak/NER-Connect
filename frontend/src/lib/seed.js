/* ============================================================
   NER-Connect | seed.js
   Demo dataset mirroring backend/data/seed.json.
   The backend is authoritative; this copy powers the embedded
   fallback simulator so the demo runs without any server.
   Risk scores and shipments are simulated, coordinates are real.
   ============================================================ */

export const NODES = {
  guwahati:  { name: 'Guwahati',  state: 'Assam',      lat: 26.1445, lon: 91.7362, hub: true },
  nagaon:    { name: 'Nagaon',    state: 'Assam',      lat: 26.3469, lon: 92.6810 },
  tezpur:    { name: 'Tezpur',    state: 'Assam',      lat: 26.6338, lon: 92.7990 },
  jorhat:    { name: 'Jorhat',    state: 'Assam',      lat: 26.7509, lon: 94.2037 },
  dibrugarh: { name: 'Dibrugarh', state: 'Assam',      lat: 27.4728, lon: 94.9120 },
  silchar:   { name: 'Silchar',   state: 'Assam',      lat: 24.8333, lon: 92.7789 },
  haflong:   { name: 'Haflong',   state: 'Assam',      lat: 25.1751, lon: 93.0366 },
  shillong:  { name: 'Shillong',  state: 'Meghalaya',  lat: 25.5788, lon: 91.8933 },
  tura:      { name: 'Tura',      state: 'Meghalaya',  lat: 25.5146, lon: 90.2083 },
  agartala:  { name: 'Agartala',  state: 'Tripura',    lat: 23.8315, lon: 91.2868 },
  aizawl:    { name: 'Aizawl',    state: 'Mizoram',    lat: 23.7271, lon: 92.7176 },
  imphal:    { name: 'Imphal',    state: 'Manipur',    lat: 24.8170, lon: 93.9368 },
  kohima:    { name: 'Kohima',    state: 'Nagaland',   lat: 25.6701, lon: 94.1079 },
  dimapur:   { name: 'Dimapur',   state: 'Nagaland',   lat: 25.9012, lon: 93.7268 },
  itanagar:  { name: 'Itanagar',  state: 'Arunachal',  lat: 27.0844, lon: 93.6053 },
  pasighat:  { name: 'Pasighat',  state: 'Arunachal',  lat: 28.0670, lon: 95.3268 },
  gangtok:   { name: 'Gangtok',   state: 'Sikkim',     lat: 27.3389, lon: 88.6065 },
  siliguri:  { name: 'Siliguri',  state: 'West Bengal (NER Gateway)', lat: 26.71, lon: 88.428, hub: false },
};

export const SEGMENTS = [
  { id: 'NH27-01', road: 'NH-27',  a: 'guwahati',  b: 'nagaon',    km: 121, speed: 58, terrain: 'Plains',        status: 'open',    risk: 12, note: 'Embankment stable, light monsoon showers', source: 'PWD patrol + IMD 24h' },
  { id: 'NH27-02', road: 'NH-27',  a: 'nagaon',    b: 'jorhat',    km: 187, speed: 54, terrain: 'Plains',        status: 'open',    risk: 18, note: 'Kaziranga stretch, fog possible after 18:00', source: 'Bhuvan tile 09-18' },
  { id: 'NH37-01', road: 'NH-37',  a: 'jorhat',    b: 'dibrugarh', km: 134, speed: 52, terrain: 'Riverine',      status: 'open',    risk: 22, note: 'Brahmaputra gauge rising, causeway watched', source: 'CWC gauge + PWD' },
  { id: 'NH15-01', road: 'NH-15',  a: 'guwahati',  b: 'tezpur',    km: 181, speed: 56, terrain: 'Plains',        status: 'open',    risk: 20, note: 'Two-lane, heavy truck traffic near Kaliabor', source: 'NHAI toll feed' },
  { id: 'NH27-03', road: 'NH-27',  a: 'tezpur',    b: 'nagaon',    km: 64,  speed: 41, terrain: 'Riverbank',     status: 'risky',   risk: 55, note: 'Embankment seepage at 3 points, soft shoulder', source: 'ML model v2.4.1 + soil sensors' },
  { id: 'NH415-1', road: 'NH-415', a: 'tezpur',    b: 'itanagar',  km: 87,  speed: 38, terrain: 'Hilly',         status: 'open',    risk: 34, note: 'Cutting slopes greased after rain, single lane at Banderdewa', source: 'BRO daily log' },
  { id: 'NH515-1', road: 'NH-515', a: 'itanagar',  b: 'pasighat',  km: 152, speed: 33, terrain: 'Himalayan',     status: 'risky',   risk: 61, note: 'Active slide zone km 44-52, convoy-only after dark', source: 'ML model v2.4.1 + BRO' },
  { id: 'NH36-01', road: 'NH-36',  a: 'nagaon',    b: 'haflong',   km: 152, speed: 22, terrain: 'Ghat section',  status: 'risky',   risk: 64, note: 'Lumding hairpin series, rockfall netting under repair', source: 'ML model v2.4.1 + PWD' },
  { id: 'NH702A1', road: 'NH-702A', a: 'jorhat',   b: 'dimapur',   km: 172, speed: 36, terrain: 'Ridge road',    status: 'risky',   risk: 68, note: 'Mokokchung ridge: exposed cuttings, dense morning fog', source: 'ML model v2.4.1 + BRO' },
  { id: 'NH715-1', road: 'NH-715', a: 'tezpur',    b: 'jorhat',    km: 210, speed: 40, terrain: 'North-bank',    status: 'risky',   risk: 52, note: 'Embankment crests softening, Bogibeel approach fog', source: 'CWC gauge + NHAI' },
  { id: 'NH913-1', road: 'NH-913', a: 'jorhat',    b: 'pasighat',  km: 264, speed: 31, terrain: 'Riverine/Hilly', status: 'risky',  risk: 57, note: 'Sadiya ghat ferry + hill climb, oversize restricted', source: 'IWAI + BRO' },
  { id: 'NH6-01',  road: 'NH-6',   a: 'guwahati',  b: 'shillong',  km: 99,  speed: 55, terrain: 'Plateau',       status: 'open',    risk: 15, note: 'Umiam ghat section clear, barrier repairs off-peak', source: 'PWD patrol' },
  { id: 'NH6-02',  road: 'NH-6',   a: 'shillong',  b: 'silchar',   km: 341, speed: 39, terrain: 'Hilly',         status: 'risky',   risk: 58, note: 'Sonapur barak ghat: rockfall record this month', source: 'ML model v2.4.1 + NDMA history' },
  { id: 'NH37-02', road: 'NH-37',  a: 'silchar',   b: 'imphal',    km: 269, speed: 0,  terrain: 'Barail hills',  status: 'blocked', risk: 88, note: 'Makru bridge approach washed out, 40 m gap', source: 'Verified: 3 crowd reports + BRO' },
  { id: 'NH2-01',  road: 'NH-2',   a: 'dimapur',   b: 'kohima',    km: 74,  speed: 36, terrain: 'Hilly',         status: 'open',    risk: 41, note: 'Steep ghat near Peducha, chain-up zone active', source: 'PWD patrol' },
  { id: 'NH2-02',  road: 'NH-2',   a: 'kohima',    b: 'imphal',    km: 141, speed: 34, terrain: 'Hilly',         status: 'open',    risk: 49, note: 'Mao gate stretch fog-prone, watch for rockfall', source: 'ML model v2.4.1' },
  { id: 'NH8-01',  road: 'NH-8',   a: 'shillong',  b: 'agartala',  km: 449, speed: 47, terrain: 'Plateau/Hilly', status: 'open',    risk: 26, note: 'Long segment, fuel+rest planning advised', source: 'NHAI feed' },
  { id: 'NH108-1', road: 'NH-108', a: 'agartala',  b: 'aizawl',    km: 362, speed: 35, terrain: 'Hilly',         status: 'risky',   risk: 48, note: 'Lunglei cuttings saturating, rain band inbound', source: 'IMD 48h + ML model' },
  { id: 'NH306-1', road: 'NH-306', a: 'silchar',   b: 'aizawl',    km: 183, speed: 33, terrain: 'Hilly',         status: 'risky',   risk: 47, note: 'Monsoon scars at km 88 reopening, watch overnight rain', source: 'ML model v2.4.1' },
  { id: 'NH54-01', road: 'NH-54',  a: 'silchar',   b: 'haflong',   km: 104, speed: 30, terrain: 'Barail hills',  status: 'risky',   risk: 66, note: 'Retaining wall bulge at Jatinga bend, lanes narrowed', source: 'BRO daily log' },
  { id: 'NH54-02', road: 'NH-54',  a: 'haflong',   b: 'dimapur',   km: 158, speed: 24, terrain: 'Hilly',         status: 'risky',   risk: 61, note: 'Hairpin series near Lumding, convoy advised', source: 'ML model v2.4.1' },
  { id: 'NH10-01', road: 'NH-10',  a: 'guwahati',  b: 'gangtok',   km: 615, speed: 48, terrain: 'Corridor',      status: 'open',    risk: 24, note: 'Via Siliguri corridor, watch seismically active zone', source: 'NHAI + IMD' },
  { id: 'NH10-00', road: 'NH-10',  a: 'siliguri',  b: 'gangtok',   km: 92,  speed: 26, terrain: 'Himalayan',     status: 'risky',   risk: 46, note: 'Melli single-lane crawler during mud clearing, light vehicles passing', source: 'ML model v2.4.1 + Sikkim Police' },
  { id: 'NH51-01', road: 'NH-51',  a: 'guwahati',  b: 'tura',      km: 213, speed: 37, terrain: 'Garo hills',    status: 'risky',   risk: 45, note: 'Dudhnoi ghat debris flow watch, soil at field capacity', source: 'ML model v2.4.1 + soil' },
  { id: 'NH44E-1', road: 'NH-44E', a: 'tura',      b: 'shillong',  km: 321, speed: 40, terrain: 'Plateau',       status: 'open',    risk: 31, note: 'Internal Meghalaya route, lighter traffic', source: 'PWD patrol' },
  { id: 'NH513-1', road: 'NH-513', a: 'dibrugarh', b: 'pasighat',  km: 218, speed: 32, terrain: 'Riverine/Hilly', status: 'risky',  risk: 59, note: 'Ferry link capability uncertain, water level high', source: 'IWAI + Bhuvan' },
];

export const SHIPMENTS = [
  { id: 'NER-0472', type: 'Medical',      goods: 'Cold-chain insulin + vaccines',   origin: 'Guwahati',  dest: 'Imphal',   via: ['guwahati', 'shillong', 'silchar', 'imphal'], status: 'REROUTING', progress: 42, etaHrs: 31, truck: 'AS-23-F-8841', consignee: 'RIMS Imphal' },
  { id: 'NER-0388', type: 'Food',         goods: 'Fortified rice, 18 t',            origin: 'Siliguri',  dest: 'Agartala', via: ['guwahati', 'shillong', 'agartala'],          status: 'IN TRANSIT', progress: 67, etaHrs: 14, truck: 'TR-09-C-2210', consignee: 'FCI Agartala' },
  { id: 'NER-0511', type: 'Construction', goods: 'Bridge girders (oversize)',       origin: 'Jorhat',    dest: 'Pasighat', via: ['jorhat', 'dibrugarh', 'pasighat'],           status: 'IN TRANSIT', progress: 23, etaHrs: 22, truck: 'AR-01-A-5530', consignee: 'Siang bridge works' },
  { id: 'NER-0456', type: 'Medical',      goods: 'Dialysis consumables',            origin: 'Guwahati',  dest: 'Aizawl',   via: ['guwahati', 'shillong', 'silchar', 'aizawl'], status: 'IN TRANSIT', progress: 55, etaHrs: 19, truck: 'MZ-01-D-1174', consignee: 'Civil Hospital Aizawl' },
  { id: 'NER-0499', type: 'General',      goods: 'Consumer FMCG mixed',             origin: 'Guwahati',  dest: 'Gangtok',  via: ['guwahati', 'gangtok'],                       status: 'IN TRANSIT', progress: 74, etaHrs: 9,  truck: 'SK-02-B-9012', consignee: 'Gangtok retail hub' },
  { id: 'NER-0523', type: 'Food',         goods: 'Onion + potato, 12 t',            origin: 'Dibrugarh', dest: 'Imphal',   via: ['dibrugarh', 'jorhat', 'nagaon', 'tezpur', 'guwahati', 'shillong', 'silchar', 'imphal'], status: 'HELD', progress: 31, etaHrs: 44, truck: 'NL-03-E-4402', consignee: 'Imphal mandi board' },
  { id: 'NER-0401', type: 'Medical',      goods: 'Oxygen cylinders (pressurised)',  origin: 'Shillong',  dest: 'Silchar',  via: ['shillong', 'silchar'],                       status: 'IN TRANSIT', progress: 61, etaHrs: 8,  truck: 'ML-05-F-7789', consignee: 'Silchar Medical College' },
  { id: 'NER-0530', type: 'Construction', goods: 'Cement, 24 t',                    origin: 'Guwahati',  dest: 'Itanagar', via: ['guwahati', 'tezpur', 'itanagar'],            status: 'DELAYED', progress: 48, etaHrs: 16, truck: 'AR-06-C-3325', consignee: 'Capital complex PWD' },
  { id: 'NER-0458', type: 'Food',         goods: 'Pulses, 16 t',                    origin: 'Agartala',  dest: 'Aizawl',   via: ['agartala', 'aizawl'],                        status: 'IN TRANSIT', progress: 29, etaHrs: 21, truck: 'MZ-04-A-6618', consignee: 'Mizoram FC supplies' },
  { id: 'NER-0507', type: 'General',      goods: 'LPG bullets (pressurised)',       origin: 'Dimapur',   dest: 'Kohima',   via: ['dimapur', 'kohima'],                         status: 'HELD', progress: 12, etaHrs: 27, truck: 'NL-01-G-2055', consignee: 'Kohima IOC depot' },
];

export const MODEL = {
  name: 'XGBoost segment classifier + Prophet trend',
  version: 'v2.4.1',
  precision: '72%',
  inputs: ['IMD rainfall 24-48 h', 'Bhuvan terrain slope', 'soil saturation', 'NDMA event history', 'crowd reports'],
};

export const DISTRICTS = [
  { name: 'Kamrup (Guwahati)', state: 'Assam',     node: 'guwahati' },
  { name: 'Nagaon',            state: 'Assam',     node: 'nagaon' },
  { name: 'Sonitpur (Tezpur)', state: 'Assam',     node: 'tezpur' },
  { name: 'Jorhat',            state: 'Assam',     node: 'jorhat' },
  { name: 'Dibrugarh',         state: 'Assam',     node: 'dibrugarh' },
  { name: 'Cachar (Silchar)',  state: 'Assam',     node: 'silchar' },
  { name: 'Dima Hasao',        state: 'Assam',     node: 'haflong' },
  { name: 'East Khasi Hills',  state: 'Meghalaya', node: 'shillong' },
  { name: 'West Garo Hills',   state: 'Meghalaya', node: 'tura' },
  { name: 'West Tripura',      state: 'Tripura',   node: 'agartala' },
  { name: 'Aizawl',            state: 'Mizoram',   node: 'aizawl' },
  { name: 'Imphal West',       state: 'Manipur',   node: 'imphal' },
  { name: 'Kohima',            state: 'Nagaland',  node: 'kohima' },
  { name: 'Dimapur',           state: 'Nagaland',  node: 'dimapur' },
  { name: 'Papum Pare',        state: 'Arunachal', node: 'itanagar' },
  { name: 'East Siang',        state: 'Arunachal', node: 'pasighat' },
  { name: 'Gangtok',           state: 'Sikkim',    node: 'gangtok' },
];

export const SMS = {
  number: '5616190',
  format: 'NER REPORT <DISTRICT-CODE> <TYPE> <SEVERITY 1-5>',
  example: 'NER REPORT CCR LANDSLIDE 4',
  codes: 'GHY Kamrup, SLC Cachar, IMP Imphal W, KHM Kohima, AIZ Aizawl, AGT W Tripura, SHL E Khasi, ITA Papum Pare, DIS Dima Hasao',
};

export const SEED_ALERTS = [
  { sev: 'CRITICAL', title: 'NH-37 Makru bridge approach washed out', body: '40 m carriageway gap at the Imphal side approach. Segment NH-37 Silchar-Imphal closed until BRO assessment completes.', route: 'NH37-02', area: 'Barail hills, Tamu stretch', ch: ['PUSH', 'SMS', 'IVR'] },
  { sev: 'WARNING',  title: 'Rockfall record at Sonapur ghat', body: 'NH-6 Shillong to Silchar, km 212. Falling-rock incidents tripled this week. Night convoy only.', route: 'NH6-02', area: 'Jaintia hills', ch: ['PUSH', 'SMS'] },
  { sev: 'WARNING',  title: 'Retaining wall bulge at Jatinga bend', body: 'NH-54 Silchar to Haflong narrowed to single lane. Queue delays averaging 90 min.', route: 'NH54-01', area: 'Dima Hasao', ch: ['PUSH'] },
  { sev: 'ADVISORY', title: 'Embankment seepage, Kaliabor reach', body: 'NH-27 Tezpur to Nagaon. Soil saturation at 91% of model threshold. Reduce speed past marker 71.', route: 'NH27-03', area: 'Koliabor', ch: ['PUSH', 'SMS'] },
  { sev: 'ADVISORY', title: 'Slide zone km 44-52 active', body: 'NH-515 Itanagar to Pasighat. Convoy-only passage after 19:00, escorted by BRO.', route: 'NH515-1', area: 'Papum Pare / East Siang', ch: ['PUSH'] },
  { sev: 'ADVISORY', title: 'Debris-flow watch, Dudhnoi ghat', body: 'NH-51 Guwahati to Tura. Field capacity soil + forecast 110 mm/24h. Stage 1 staging advised.', route: 'NH51-01', area: 'Rongjuli', ch: ['SMS', 'IVR'] },
  { sev: 'INFO',     title: 'Brahmaputra gauge rising at Neematighat', body: 'NH-37 Jorhat to Dibrugarh. Causeway ferry margin reduced. No restriction yet.', route: 'NH37-01', area: 'Majuli approach', ch: ['PUSH'] },
  { sev: 'INFO',     title: 'Ferry uncertainty, Bogibeel approach', body: 'NH-513 Dibrugarh to Pasighat water level high. Oversize loads should confirm before dispatch.', route: 'NH513-1', area: 'Dibrugarh east bank', ch: ['PUSH'] },
];

// Stylised state outlines, hand-simplified lat/lon anchors (not survey data).
export const STATES = [
  { name: 'Assam',     pts: [[89.9, 26.2], [91.5, 26.9], [93.5, 27.4], [95.6, 28.0], [95.4, 26.4], [94.0, 25.1], [92.6, 24.3], [90.8, 24.9]] },
  { name: 'Meghalaya', pts: [[90.2, 25.9], [92.8, 25.4], [92.6, 24.9], [90.8, 24.4], [89.9, 25.3]] },
  { name: 'Tripura',   pts: [[91.3, 24.4], [92.3, 24.4], [92.2, 23.1], [91.4, 22.9]] },
  { name: 'Mizoram',   pts: [[92.5, 24.5], [93.4, 24.2], [93.2, 22.1], [92.3, 23.2], [92.1, 24.1]] },
  { name: 'Manipur',   pts: [[93.1, 25.4], [94.8, 25.5], [94.9, 23.9], [93.4, 23.8]] },
  { name: 'Nagaland',  pts: [[93.6, 26.0], [95.3, 27.1], [95.1, 25.5], [94.1, 25.2]] },
  { name: 'Arunachal', pts: [[91.6, 27.8], [93.5, 28.6], [95.5, 29.3], [97.3, 28.3], [96.2, 27.2], [94.4, 26.9], [93.0, 26.6]] },
  { name: 'Sikkim',    pts: [[88.05, 28.1], [88.9, 28.05], [88.85, 27.15], [88.1, 27.3]] },
];
