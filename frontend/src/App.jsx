import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CmdBar } from './components/CmdBar.jsx';
import { Ticker } from './components/Ticker.jsx';
import { Tabs, BottomNav } from './components/Nav.jsx';
import { Toasts } from './components/Toasts.jsx';
import { Icon } from './components/Icons.jsx';
import { useStore } from './state/store.jsx';
import Home from './pages/Home.jsx';
import Planner from './pages/Planner.jsx';
import Report from './pages/Report.jsx';
import Alerts from './pages/Alerts.jsx';
import GovOps from './pages/GovOps.jsx';

function BootGate() {
  return (
    <div className="boot-gate" role="status" aria-label="Loading network state">
      <div className="boot-mark"><Icon name="route" size={34} /></div>
      <p className="boot-line">SYNCING SEGMENT STATE / ML SCORES / SHIPMENT FEED</p>
      <div className="boot-bar"><i /></div>
    </div>
  );
}

export default function App() {
  const { state } = useStore();
  const loc = useLocation();

  if (!state.booted) return <BootGate />;

  return (
    <div className="app">
      <CmdBar />
      <Ticker />
      <Tabs />
      <main className="main" id="main" key={loc.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/report" element={<Report />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/gov" element={<GovOps />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      <Toasts />
    </div>
  );
}
