import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import pages from './runtime/pages.json';
import { startControllers, showStartupError } from './runtime/bootstrap.js';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './styles/utilities.css';
import './styles/base.css';
import './styles/workbench.css';

const modules = import.meta.glob('./pages/*.jsx');
const pageStyles = import.meta.glob([
  './styles/*.css',
  '!./styles/base.css',
  '!./styles/utilities.css',
  '!./styles/workbench.css'
]);
async function mount() {
  // Preserve deep links, .html URLs, query strings, and full-page lifecycle cleanup.
  let path = location.pathname === '/' ? '/index.html' : location.pathname;
  if (!path.endsWith('.html')) path = `${path.replace(/\/$/, '')}.html`;
  const page = pages[path] || pages['/404.html'];
  const filename = path.split('/').pop().replace('.html', '');
  const style = pageStyles[`./styles/${filename}.css`];
  if (style) await style();
  if (/placements|planner/.test(filename))
    await import('@fortawesome/fontawesome-free/css/all.min.css');
  try {
    const stored = sessionStorage.getItem('techprep_theme');
    const dark =
      stored === 'dark' ||
      (stored === 'system' && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  } catch {
    /* Use the accessible dark default when storage is unavailable. */
  }
  window.__TECHPREP_API_BASE__ = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');
  document.body.className = `${page.bodyClass} workbench`;
  const { default: Page } = await modules[`./pages/${page.module}.jsx`]();
  flushSync(() =>
    createRoot(document.getElementById('root'), { onUncaughtError: showStartupError }).render(
      <Page mode={page.redirect} />
    )
  );
  // Hash targets may not exist until the lazy-loaded React page has mounted.
  if (location.hash) {
    try {
      document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
    } catch {
      /* A malformed fragment must not block page startup. */
    }
  }
  await startControllers(page.scripts, page.initialize);
  // Retire the previous static cache, which can otherwise serve stale HTML/scripts.
  if ('serviceWorker' in navigator) {
    for (const registration of await navigator.serviceWorker.getRegistrations()) {
      if (registration.active?.scriptURL === `${location.origin}/sw.js`)
        await registration.unregister();
    }
  }
}
mount().catch(showStartupError);
