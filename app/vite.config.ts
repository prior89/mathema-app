import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.io'],
    proxy: {
      '/api': { target: 'http://localhost:4000', changeOrigin: true },
    },
  },
  build: {
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        // 큰 의존성은 별도 chunk 로 분리 — 모바일 첫 진입 부담 완화 + 캐시 hit 향상.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react'],
          'vendor-sentry': ['@sentry/react'],
          // KaTeX (~260KB) is only needed where MathText renders math —
          // ConceptLesson, Notes, Review queue, Mock play. Splitting it
          // explicitly keeps it out of the cold-start payload for Home
          // (which never touches LaTeX) and makes it cache independently
          // of the rest of the vendor surface.
          'vendor-katex': ['katex'],
        },
      },
    },
  },
});
