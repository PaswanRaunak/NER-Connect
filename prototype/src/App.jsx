import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './state/store.jsx';
import { Login, OtpVerify, Onboarding } from './pages/Auth.jsx';
import { CitizenHome, Profile } from './pages/Citizen.jsx';
import { RoutePlanner } from './pages/RoutePlanner.jsx';
import { Report } from './pages/Report.jsx';
import { Tracking } from './pages/Tracking.jsx';
import { OfflinePass } from './pages/OfflinePass.jsx';
import { CommandCenter } from './pages/Console.jsx';
import { DistrictDetail, Analytics } from './pages/ConsoleData.jsx';
import { Moderation, Permits } from './pages/ConsoleOps.jsx';
import { Portal, Brand } from './pages/Portal.jsx';

export default function App() {
  return (
    <StoreProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/citizen" replace />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/citizen" element={<CitizenHome />} />
        <Route path="/citizen/route" element={<RoutePlanner />} />
        <Route path="/citizen/report" element={<Report />} />
        <Route path="/citizen/tracking" element={<Tracking />} />
        <Route path="/citizen/offline-pass" element={<OfflinePass />} />
        <Route path="/citizen/profile" element={<Profile />} />
        <Route path="/console" element={<CommandCenter />} />
        <Route path="/console/district" element={<DistrictDetail />} />
        <Route path="/console/analytics" element={<Analytics />} />
        <Route path="/console/moderation" element={<Moderation />} />
        <Route path="/console/permits" element={<Permits />} />
        <Route path="*" element={<Navigate to="/portal" replace />} />
      </Routes>
    </StoreProvider>
  );
}
