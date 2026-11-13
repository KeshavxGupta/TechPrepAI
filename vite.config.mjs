import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
function entries(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = resolve(dir, entry.name);
    return entry.isDirectory() &&
      !['node_modules', 'src'].includes(entry.name) &&
      file !== resolve('frontend/public')
      ? entries(file)
      : entry.name.endsWith('.html')
        ? [file]
        : [];
  });
}
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve('frontend'), '');
  return {
    root: 'frontend',
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: '../dist',
      emptyOutDir: true,
      rollupOptions: { input: entries(resolve('frontend')) }
    }
  };
});
