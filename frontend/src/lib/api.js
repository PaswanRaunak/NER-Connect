/* Backend client. Every call fails fast (2.5 s) so the UI can
   fall back to the embedded simulator without hanging the demo. */

const BASE = '/api';

async function call(path, opts = {}) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 2500);
  try {
    const res = await fetch(BASE + path, {
      headers: { 'Content-Type': 'application/json' },
      signal: ctl.signal,
      ...opts,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

export const api = {
  health: () => call('/health'),
  snapshot: () => call('/network/status'),
  plan: (origin, dest, cargo) =>
    call('/routes/optimize', { method: 'POST', body: JSON.stringify({ origin, dest, cargo }) }),
  report: (payload) => call('/reports', { method: 'POST', body: JSON.stringify(payload) }),
  inject: () => call('/simulate/disruption', { method: 'POST' }),
  reroute: (id) => call(`/shipments/${id}/reroute`, { method: 'POST' }),
  reset: () => call('/simulate/reset', { method: 'POST' }),
};
