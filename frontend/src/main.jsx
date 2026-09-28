import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import './styles.css';
import App from './App.jsx';
import { StoreProvider } from './state/store.jsx';

// NOTE: deliberately no React.StrictMode. Its dev-only double-mount breaks
// react-leaflet child effects (they bind to the first, disposed map
// instance), which silently disabled map fit/fly behaviors.
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreProvider>
      <App />
    </StoreProvider>
  </BrowserRouter>,
);
