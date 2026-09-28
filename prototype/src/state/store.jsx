import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { MOD_QUEUE } from '../lib/data.js';

const StoreCtx = createContext(null);

const initial = () => ({
  /* mock auth */
  auth: null,           // { role, credential, credentialType }
  otpSent: false,
  onboarded: false,
  language: 'as',
  district: 'kamrup',

  /* notifications surface */
  toast: null,

  /* moderation pipeline (report submission feeds it) */
  queue: MOD_QUEUE,
  moderationLog: [],

  /* citizen home live advisory (updated after a report is filed) */
  advisory: null,

  /* issued emergency passes */
  issuedPasses: [],
});

function reducer(state, ev) {
  switch (ev.type) {
    case 'AUTH': {
      const credentialType = ev.credential.includes('@') ? 'email' : 'phone';
      return { ...state, auth: { role: ev.role, credential: ev.credential, credentialType }, otpSent: true };
    }
    case 'ONBOARD':
      return { ...state, language: ev.language ?? state.language, district: ev.district ?? state.district, onboarded: true };
    case 'SIGN_OUT':
      return initial();
    case 'TOAST':
      return { ...state, toast: ev.toast || null };
    case 'TOAST_POP':
      return state.toast && state.toast.id === ev.id ? { ...state, toast: null } : state;
    case 'SUBMIT_REPORT': {
      const rep = ev.report;
      const entry = {
        id: `#MOD-${8830 + state.queue.filter((q) => q.userSubmitted).length}`,
        flag: 'LIVE CRITICAL',
        flagCls: 'bg-error-container text-on-error-container',
        dot: 'bg-error',
        when: 'Just now · via SACHET citizen',
        loc: rep.loc,
        type: rep.type,
        typeIcon: rep.icon,
        typeColor: 'text-error',
        detail: rep.detail,
        tier: { t: rep.severity >= 3 ? 4 : 3, label: rep.severity >= 3 ? 'Tier-4 Action' : 'Tier-3 Prep' },
        risk: `${rep.severity >= 3 ? 90 : 72}%`,
        conf: '82% Confidence',
        cross: '1 citizen photo + device GPS ±2.4m',
        action: { label: 'Dispatch BRO', primary: true },
        photo: { exif: 'EXIF ±2.4m' },
        userSubmitted: true,
      };
      return {
        ...state,
        queue: [entry, ...state.queue],
        advisory: rep.advisory,
        toast: 'Field report dispatched to the moderation queue and nearest PWD outpost.',
        moderationLog: [`${new Date().toLocaleTimeString('en-IN')} — ${entry.id} ingested (${rep.type}, severity ${rep.severity}/3)`, ...state.moderationLog].slice(0, 6),
      };
    }
    case 'MODERATE': {
      const { id, action } = ev;
      const item = state.queue.find((q) => q.id === id);
      const log = `${new Date().toLocaleTimeString('en-IN')} — ${id} → ${action}${item ? ` (BRO ${item.action?.label || 'taskforce'} notified)` : ''}`;
      return {
        ...state,
        queue: state.queue.filter((q) => q.id !== id),
        moderationLog: [log, ...state.moderationLog].slice(0, 6),
        toast:
          action === 'dispatch'
            ? `${id} verified — BRO taskforce dispatched, SACHET geofence SMS queued.`
            : `${id} marked as cross-duplicate and merged into the audit ledger.`,
      };
    }
    case 'ISSUE_PASS': {
      const pass = ev.pass;
      return {
        ...state,
        issuedPasses: [pass, ...state.issuedPasses],
        toast: `Emergency monsoonal e-pass ${pass.id} generated; cryptographic seal pushed to gate terminals.`,
      };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, initial);
  const actions = useMemo(() => ({
    signIn: (role, credential) => dispatch({ type: 'AUTH', role, credential }),
    onboard: (language, district) => dispatch({ type: 'ONBOARD', language, district }),
    signOut: () => dispatch({ type: 'SIGN_OUT' }),
    toast: (msg) => {
      const id = Date.now();
      dispatch({ type: 'TOAST', toast: { msg, id } });
      setTimeout(() => dispatch({ type: 'TOAST_POP', id }), 4600);
    },
    submitReport: (report) => dispatch({ type: 'SUBMIT_REPORT', report }),
    moderate: (id, action) => dispatch({ type: 'MODERATE', id, action }),
    issuePass: (pass) => dispatch({ type: 'ISSUE_PASS', pass }),

    // Live routing plan from the FastAPI backend (ORS-validated fastest leg
    // when ORS_API_KEY is set server-side). Returns null offline — callers
    // then keep the designed static corridor.
    async planRoute(origin, dest, cargo) {
      const ctl = new AbortController();
      const t = setTimeout(() => ctl.abort(), 2500);
      try {
        const res = await fetch('/api/routes/optimize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ origin, dest, cargo }),
          signal: ctl.signal,
        });
        if (!res.ok) return null;
        const data = await res.json();
        return data.routes || null;
      } catch {
        return null;
      } finally {
        clearTimeout(t);
      }
    },
  }), []);
  return <StoreCtx.Provider value={{ state, actions }}>{children}</StoreCtx.Provider>;
}

export const useStore = () => useContext(StoreCtx);
