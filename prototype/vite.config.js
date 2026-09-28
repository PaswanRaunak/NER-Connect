import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    proxy: {
      // FastAPI backend (route optimizer + ORS live-road validation).
      // Fail fast so the UI falls back to the offline engine when the
      // backend isn't running — the demo never breaks on stage.
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        timeout: 2500,
      },
    },
  },
  build: { outDir: 'dist' },
});
