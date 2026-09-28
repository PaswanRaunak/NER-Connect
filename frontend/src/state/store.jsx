/* ============================================================
   NER-Connect | store.jsx
   Single app store: backend-first with embedded-simulator
   fallback. Mutating actions return a full snapshot, which is
   what keeps map, alerts, shipments and recommendations in sync.
   ============================================================ */

import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import { api } from '../lib/api.js';
import * as engine from '../lib/engine.js';
import { MODEL } from '../lib/seed.js';

const StoreCtx = createContext(null);

const initial = () => ({
  booted: false,
  live: false,
  role: 'field',
  segments: [],
  alerts: [],
  shipments: [],
  reports: [],
  recs: [],
  model: MODEL,
  toasts: [],
});

function reducer(state, ev) {
  switch (ev.type) {
    case 'BOOT': {
      const s = ev.snapshot;
      return { ...state, booted: true, live: ev.live, segments: s.segments, alerts: s.alerts, shipments: s.shipments, reports: s.reports || [], recs: s.recs, model: s.model || MODEL };
    }
    case 'SNAPSHOT': {
      const s = ev.snapshot;
      return { ...state, live: ev.live ?? state.live, segments: s.segments, alerts: s.alerts, shipments: s.shipments, reports: s.reports || state.reports, recs: s.recs };
    }
    case 'SET_LIVE':
      return { ...state, live: ev.live };
    case 'SET_ROLE':
      return { ...state, role: ev.role };
    case 'TOAST_PUSH':
      return { ...state, toasts: [...state.toasts, ev.toast] };
    case 'TOAST_POP':
      return { ...state, toasts: state.toasts.filter((t) => t.id !== ev.id) };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const toastSeq = useRef(0);

  const toast = (msg, kind = 'info') => {
    const id = `t-${++toastSeq.current}`;
    dispatch({ type: 'TOAST_PUSH', toast: { id, msg, kind } });
    setTimeout(() => dispatch({ type: 'TOAST_POP', id }), 4200);
  };

  const actions = {
    toast,
    setRole: (role) => dispatch({ type: 'SET_ROLE', role }),

    async boot() {
      try {
        const snap = await api.snapshot();
        dispatch({ type: 'BOOT', snapshot: snap, live: true });
      } catch {
        dispatch({ type: 'BOOT', snapshot: engine.initialState(), live: false });
      }
    },

    async injectDisruption() {
      try {
        const snap = await api.inject();
        dispatch({ type: 'SNAPSHOT', snapshot: snap, live: true });
        return snap.lastEvent || null;
      } catch {
        const s = { segments: clone(state.segments), alerts: [...state.alerts], shipments: clone(state.shipments), reports: state.reports, seq: 1, recs: state.recs };
        const ev = engine.injectDisruption(s);
        dispatch({ type: 'SNAPSHOT', snapshot: { segments: s.segments, alerts: s.alerts, shipments: s.shipments, recs: s.recs, reports: s.reports, lastEvent: ev }, live: false });
        return ev;
      }
    },

    async submitReport(payload) {
      try {
        const snap = await api.report(payload);
        dispatch({ type: 'SNAPSHOT', snapshot: snap, live: true });
        return snap.lastReport || null;
      } catch {
        const s = { segments: clone(state.segments), alerts: [...state.alerts], shipments: clone(state.shipments), reports: [...state.reports], seq: 1, recs: state.recs };
        const out = engine.applyReport(s, payload);
        dispatch({ type: 'SNAPSHOT', snapshot: { segments: s.segments, alerts: s.alerts, shipments: s.shipments, recs: s.recs, reports: s.reports, lastReport: out }, live: false });
        return out;
      }
    },

    async reroute(shipmentId) {
      try {
        const snap = await api.reroute(shipmentId);
        dispatch({ type: 'SNAPSHOT', snapshot: snap, live: true });
        return true;
      } catch {
        const s = { segments: clone(state.segments), alerts: [...state.alerts], shipments: clone(state.shipments), reports: state.reports, seq: 1, recs: clone(state.recs) };
        const sh = engine.rerouteShipment(s, shipmentId);
        dispatch({ type: 'SNAPSHOT', snapshot: { segments: s.segments, alerts: s.alerts, shipments: s.shipments, recs: s.recs, reports: s.reports }, live: false });
        return !!sh;
      }
    },

    async resetDemo() {
      try {
        const snap = await api.reset();
        dispatch({ type: 'SNAPSHOT', snapshot: snap, live: state.live });
      } catch {
        dispatch({ type: 'SNAPSHOT', snapshot: engine.initialState(), live: state.live });
      }
    },

    async planRoute(origin, dest, cargo) {
      try {
        const res = await api.plan(origin, dest, cargo);
        return res.routes;
      } catch {
        return engine.planRoutes({ segments: state.segments }, origin, dest, cargo);
      }
    },
  };

  useEffect(() => { actions.boot(); /* eslint-disable-line */ }, []);

  return <StoreCtx.Provider value={{ state, actions }}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);

function clone(x) { return JSON.parse(JSON.stringify(x)); }
