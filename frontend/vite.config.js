import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev server proxies /api to the FastAPI backend so the demo
// can run as one origin. In production, serve behind NGINX
// (see TDD: API gateway layer).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        // fail fast so the UI falls back to the embedded simulator
        timeout: 2500,
      },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});
