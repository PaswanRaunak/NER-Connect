import React from 'react';
import { Icon } from './Icons.jsx';
import { useStore } from '../state/store.jsx';

export function Toasts() {
  const { state } = useStore();
  return (
    <div className="toasts" role="status" aria-live="polite">
      {state.toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.kind}`}>
          <Icon name={t.kind === 'alert' ? 'warn' : t.kind === 'ok' ? 'check' : 'info'} size={16} />
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
}
