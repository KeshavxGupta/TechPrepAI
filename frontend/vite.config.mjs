import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendRoot = dirname(fileURLToPath(import.meta.url));
function entries(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      return ['node_modules', 'src', 'public', 'dist'].includes(entry.name) && dir === frontendRoot
        ? []
        : entries(file);
    }
    return entry.name.endsWith('.html') ? [file] : [];
  });
}
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, frontendRoot, '');
  return {
    root: frontendRoot,
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 5173,
      proxy: {
        '/api': {
          target: process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'http://127.0.0.1:5000',
          changeOrigin: true
        }
      }
    },
    preview: { host: '127.0.0.1', port: 4173 },
    build: {
      outDir: resolve(frontendRoot, 'dist'),
      emptyOutDir: true,
      rollupOptions: { input: entries(frontendRoot) }
    }
  };
});
