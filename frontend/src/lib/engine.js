/* ============================================================
   NER-Connect | engine.js
   Embedded fallback engine. Implements the same logic as the
   FastAPI backend (risk-weighted routing, disruption injection,
   report ingestion, heatmap synthesis) so the UI works with or
   without the backend. The backend remains authoritative.
   ============================================================ */

import { NODES, SEGMENTS, SHIPMENTS, SEED_ALERTS, STATES, DISTRICTS } from './seed.js';

const clone = (x) => JSON.parse(JSON.stringify(x));

export const now = () => Date.now();

const segMinutesAgo = { 0: 34, 1: 96, 2: 141, 3: 219, 4: 302, 5: 388, 6: 512, 7: 631 };

export function initialState() {
  const alerts = SEED_ALERTS.map((a, i) => ({
    ...a,
    id: `A-${String(1000 + i)}`,
    ts: now() - segMinutesAgo[i] * 60000,
    origin: 'MODEL',
  }));
  const segments = clone(SEGMENTS);
  const shipments = clone(SHIPMENTS);
  return { segments, alerts, shipments, reports: [], recs: buildRecs(segments, shipments), seq: 1 };
}

/* ---------------- routing ---------------- */

// Risk-aversion multiplier per cargo type (TC-03: medical minimizes risk
// even when the safe corridor is longer).
const CARGO_AVERSION = { Medical: 2.0, Food: 1.5, Construction: 1.0, General: 1.0 };

const segHrs = (s) => {
  const h = s.km / Math.max(s.speed, 1);
  return h + (s.status === 'risky' ? 0.35 * h : 0);
};

// Enumerates simple paths (small graph, hard caps keep it instant).
function enumeratePaths(segments, src, dst, cap = 80) {
  const adj = new Map(Object.keys(NODES).map((k) => [k, []]));
  for (const s of segments) {
    adj.get(s.a).push([s.b, s]);
    adj.get(s.b).push([s.a, s]);
  }
  const results = [];
  const stack = [];
  const onPath = new Set([src]);
  const dfs = (node, cost) => {
    if (results.length >= cap || cost > 40) return;
    if (node === dst) { results.push([...stack]); return; }
    for (const [nxt, seg] of adj.get(node)) {
      if (onPath.has(nxt)) continue;
      onPath.add(nxt);
      stack.push(seg);
      dfs(nxt, cost + seg.km / Math.max(seg.speed, 1));
      stack.pop();
      onPath.delete(nxt);
    }
  };
  dfs(src, 0);
  return results;
}

function scorePath(segs, mult) {
  const km = segs.reduce((a, s) => a + s.km, 0);
  const hrs = segs.reduce((a, s) => a + segHrs(s), 0);
  const riskPct = km ? Math.round(segs.reduce((a, s) => a + s.risk * s.km, 0) / km) : 0;
  const recCost = hrs + mult * 0.25 * riskPct;
  return {
    km, hrs: Math.round(hrs * 10) / 10, riskPct, recCost,
    segIds: segs.map((s) => s.id),
    segs: segs.map((s) => ({ id: s.id, road: s.road, a: s.a, b: s.b, km: s.km, risk: s.risk, status: s.status, terrain: s.terrain })),
  };
}

const chainToNodes = (segments, segIds) => {
  const byId = new Map(segments.map((s) => [s.id, s]));
  const path = [byId.get(segIds[0]).a];
  for (const id of segIds) {
    const s = byId.get(id);
    path.push(path[path.length - 1] === s.a ? s.b : s.a);
  }
  return path;
};

export function planRoutes(state, origin, dest, cargo) {
  const mult = CARGO_AVERSION[cargo] ?? 1;
  const cands = enumeratePaths(state.segments, origin, dest).map((c) => scorePath(c, mult));
  if (!cands.length) return [];

  const bestRec = [...cands].sort((a, b) => a.recCost - b.recCost)[0];
  const bestTime = [...cands].sort((a, b) => a.hrs - b.hrs)[0];
  const bestRisk = [...cands].sort((a, b) => a.riskPct - b.riskPct)[0];

  const used = [];
  const pick = (sorter) => {
    for (const c of [...cands].sort(sorter)) {
      if (used.some((u) => u.join('>') === c.segIds.join('>'))) continue;
      used.push(c.segIds);
      return c;
    }
    return null;
  };

  const recommended = pick((a, b) => a.recCost - b.recCost);
  const fastest = pick((a, b) => a.hrs - b.hrs);
  const safest = pick((a, b) => a.riskPct - b.riskPct);

  const out = [];
  for (const [card, kind] of [[recommended, 'Recommended'], [fastest, 'Fastest'], [safest, 'Safest']]) {
    if (!card) continue;
    const eq = (x) => x && x.segIds.join('>') === card.segIds.join('>');
    out.push({
      kind,
      path: chainToNodes(state.segments, card.segIds),
      ...card,
      cargo, mult,
      alsoFastest: eq(bestTime),
      alsoSafest: eq(bestRisk),
    });
  }
  return out;
}

/* ---------------- disruption simulation ---------------- */

const HAZARDS = [
  { type: 'Landslide', detail: 'debris runout across both lanes' },
  { type: 'Flood', detail: 'water over carriageway, shoulder eroded' },
  { type: 'Roadblock', detail: 'felled tree + protest blockade reported' },
  { type: 'Bridge Damage', detail: 'approach slab cracked, load restriction feared' },
];

export function injectDisruption(state) {
  const pool = state.segments.filter((s) => s.status === 'open' && s.risk >= 34);
  const pool2 = state.segments.filter((s) => s.status === 'open');
  const candidates = pool.length ? pool : pool2;
  const seg = candidates[Math.floor(Math.random() * candidates.length)];
  const hazard = HAZARDS[Math.floor(Math.random() * HAZARDS.length)];
  const sev = Math.random() > 0.45 ? 'CRITICAL' : 'WARNING';

  seg.status = 'blocked';
  seg.risk = Math.min(98, Math.max(seg.risk, sev === 'CRITICAL' ? 86 : 72));
  seg.note = `${hazard.type}: ${hazard.detail}. Field teams dispatched.`;
  seg.source = 'Simulated event (demo)';

  const touched = affectedShipments(state.shipments, seg);
  for (const sh of touched) {
    sh.status = 'REROUTING';
    sh.etaHrs += Math.round(6 + Math.random() * 8);
    sh.holdReason = `${hazard.type} on ${seg.road}`;
  }

  const alert = {
    id: `A-${1000 + state.alerts.length + state.seq}`,
    sev,
    title: `${hazard.type} closes ${seg.road} ${NODES[seg.a].name}-${NODES[seg.b].name}`,
    body: `Injected demo event: ${hazard.detail}. ${touched.length} shipment(s) flagged for reroute. Model risk for this segment jumped to ${seg.risk}%.`,
    route: seg.id,
    area: `${NODES[seg.a].state} / ${seg.terrain}`,
    ch: ['PUSH', 'SMS'],
    ts: now(),
    origin: 'SIM',
  };
  state.alerts.unshift(alert);
  state.recs = buildRecs(state.segments, state.shipments);
  state.seq += 1;
  return { seg, alert, touched };
}

function affectedShipments(shipments, seg) {
  return shipments.filter((sh) => {
    if (sh.status === 'DELIVERED') return false;
    const viaNames = sh.via.map((v) => NODES[v].name);
    return viaNames.includes(NODES[seg.a].name) && viaNames.includes(NODES[seg.b].name);
  });
}

/* ---------------- citizen reports ---------------- */

const SEV_LABELS = { 1: 'MINOR', 2: 'MODERATE', 3: 'MODERATE', 4: 'SEVERE', 5: 'CATASTROPHIC' };

export function applyReport(state, { segId, type, severity, note }) {
  const seg = state.segments.find((s) => s.id === segId);
  if (!seg) return null;
  const bump = severity * 7;
  seg.risk = Math.min(99, seg.risk + bump);
  if (severity >= 4 || seg.risk >= 85) seg.status = 'blocked';
  else if (seg.risk >= 45) seg.status = 'risky';
  seg.note = `Crowd report (${type.toLowerCase()}, ${SEV_LABELS[severity].toLowerCase()}): ${note || 'no further detail'}.`;
  seg.source = `Crowd report + model v2.4.1`;

  const alert = {
    id: `A-${1000 + state.alerts.length + state.seq}`,
    sev: severity >= 4 ? 'CRITICAL' : 'WARNING',
    title: `${type} reported on ${seg.road} ${NODES[seg.a].name}-${NODES[seg.b].name}`,
    body: `Citizen report, severity ${severity}/5 (${SEV_LABELS[severity]}). Segment risk re-scored to ${seg.risk}% pending verification.`,
    route: seg.id,
    area: `${NODES[seg.a].state} / ${seg.terrain}`,
    ch: ['PUSH', 'SMS'],
    ts: now(),
    origin: 'CROWD',
  };
  state.alerts.unshift(alert);
  state.reports.unshift({ segId: seg.id, type, severity, ts: now() });
  state.recs = buildRecs(state.segments, state.shipments);
  state.seq += 1;
  return { seg, alert };
}

/* ---------------- AI recommendations ---------------- */

export function buildRecs(segments, shipments) {
  const recs = [];
  for (const seg of segments) {
    if (seg.status !== 'blocked') continue;
    const touched = affectedShipments(shipments, seg);
    if (touched.length) {
      recs.push({
        id: `R-${seg.id}`,
        sev: 'CRITICAL',
        action: 'REROUTE',
        title: `Reroute ${touched.map((t) => t.id).join(', ')} off ${seg.road}`,
        body: `${seg.road} ${NODES[seg.a].name}-${NODES[seg.b].name} is blocked (${seg.note}) ${seg.risk}% risk. Diversion via alternate corridor keeps ${touched[0].dest} delivery inside SLA.`,
        shipments: touched.map((t) => t.id),
      });
    } else {
      recs.push({
        id: `R-${seg.id}`,
        sev: 'WARNING',
        action: 'MONITOR',
        title: `Stage crew near ${seg.road} closure`,
        body: `Blocked segment carries no live cargo. Pre-position earthmovers at the ${NODES[seg.b].name} end; clearance window improves after 48 h dry spell.`,
        shipments: [],
      });
    }
  }
  for (const seg of segments) {
    if (seg.status !== 'risky' || seg.risk < 55) continue;
    const touched = affectedShipments(shipments, seg);
    if (touched.length) {
      recs.push({
        id: `R-${seg.id}`,
        sev: 'ADVISORY',
        action: 'STAGE',
        title: `Pre-stage fuel + convoy escort on ${seg.road}`,
        body: `${seg.risk}% model risk with ${touched.length} shipment(s) committed, including ${touched[0].id} (${touched[0].type.toLowerCase()}). Rain band inbound within 24 h.`,
        shipments: touched.map((t) => t.id),
      });
    }
  }
  return recs;
}

export function rerouteShipment(state, shipmentId) {
  const sh = state.shipments.find((s) => s.id === shipmentId);
  if (!sh) return null;
  const from = guessKey(sh.origin);
  const to = guessKey(sh.dest);
  const mult = CARGO_AVERSION[sh.type] ?? 1;
  const cands = enumeratePaths(state.segments, from, to).map((c) => scorePath(c, mult));
  if (!cands.length) return null;
  const best = [...cands].sort((a, b) => a.recCost - b.recCost)[0];
  sh.via = chainToNodes(state.segments, best.segIds);
  sh.status = 'REROUTED';
  sh.holdReason = undefined;
  state.recs = state.recs.filter((r) => !(r.shipments || []).includes(sh.id));
  return sh;
}

function guessKey(name) {
  return Object.keys(NODES).find((k) => NODES[k].name === name) || 'guwahati';
}

/* ---------------- derived analytics ---------------- */

export function districtRisk(state) {
  return DISTRICTS.map((d) => {
    const touching = state.segments.filter((s) => s.a === d.node || s.b === d.node);
    let risk = touching.length ? Math.round(touching.reduce((a, s) => a + s.risk, 0) / touching.length) : 15;
    if (touching.some((s) => s.status === 'blocked')) risk = Math.min(97, risk + 38);
    const tag = risk >= 70 ? 'SEVERE' : risk >= 50 ? 'HIGH' : risk >= 30 ? 'MODERATE' : 'LOW';
    const blocked = touching.filter((s) => s.status === 'blocked').length;
    const risky = touching.filter((s) => s.status === 'risky').length;
    return { ...d, risk, tag, blocked, risky, segCount: touching.length };
  }).sort((a, b) => b.risk - a.risk);
}

const CELL = 0.5;

export function heatCells(state, horizon) {
  const inflate = horizon === 'h48' ? 1.9 : horizon === 'h24' ? 1.35 : 1.0;
  const cells = [];
  for (let lat = 22.25; lat <= 29.25; lat += CELL) {
    for (let lon = 88.25; lon <= 97.25; lon += CELL) {
      let i = 0;
      for (const s of state.segments) {
        const mLat = (NODES[s.a].lat + NODES[s.b].lat) / 2;
        const mLon = (NODES[s.a].lon + NODES[s.b].lon) / 2;
        const d = Math.hypot(mLat - lat, (mLon - lon) * 0.9);
        if (d > 1.1) continue;
        const amp = (s.risk / 100) * (s.status === 'blocked' ? 1.15 : s.status === 'risky' ? 0.8 : 0.4) * Math.exp(-((d * d) / 0.42)) * inflate;
        i = Math.max(i, amp);
      }
      if (i > 0.12) {
        cells.push({ lat, lon, i: Math.min(1, i), band: i >= 0.72 ? 'sev' : i >= 0.5 ? 'high' : i >= 0.3 ? 'mod' : 'low' });
      }
    }
  }
  return cells;
}

export function stats(state) {
  const open = state.segments.filter((s) => s.status === 'open').length;
  const risky = state.segments.filter((s) => s.status === 'risky').length;
  const blocked = state.segments.filter((s) => s.status === 'blocked').length;
  const inTransit = state.shipments.filter((s) => ['IN TRANSIT', 'REROUTING', 'REROUTED', 'DELAYED', 'HELD'].includes(s.status)).length;
  const critical = state.alerts.filter((a) => a.sev === 'CRITICAL').length;
  return { open, risky, blocked, inTransit, critical };
}

export { NODES, STATES, DISTRICTS };
