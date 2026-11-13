# Vite + React migration

## What changed

All 19 HTML routes now boot a lazy-loaded React page. Presentation previously
injected from component template strings is checked-in JSX. The home page is a
custom, responsive technical workbench with React language tabs, an explicit example
walkthrough, mobile navigation, native FAQ disclosures, and the existing auth forms.
Shared typography, surfaces, accent colors, focus indicators, and reduced-motion rules
apply across the application. Resume preview/print styling remains separate.

Vite compiles Tailwind instead of loading the Tailwind CDN. Fonts are self-hosted.
Chart.js, marked, confetti, Mammoth, XLSX and icon CSS load from pinned npm dependencies.
MathJax remains an optional, nonblocking external enhancement. Failed core script loads
show a reload notice rather than silently leaving the app partially initialized.

The root build produces `dist/`. Express and Vercel serve that output. Existing `.html`
paths, search parameters, form selectors, session storage, `/api` contracts, and classic
script scope are preserved. Vite proxies `/api` during development. An old-cache retirement
worker at `/sw.js` clears only `techprep-cache-*` caches.

## Deliberate migration boundary

Feature controllers in `frontend/public/js` still own imperative behavior, including
runtime-rendered editor/results/forms, timers, and document-level listeners. React renders
the initial page once, before controller startup, using `flushSync`. Controllers subscribe
to `techprep:ready`; the bootstrap dispatches it only after loading their dependencies in
order. These are not hooks-based rewrites of all domain features. Existing inline JSX event
handlers delegate to those controller contracts. Runtime-generated controller markup still
contains native event attributes as before.

Do not add root-level state rerenders around controller-owned content. Convert a complete
feature's state/rendering/events together when removing that boundary. Full document
navigation provides lifecycle cleanup for legacy listeners and intervals. This avoids
pretending those controllers are safe to run repeatedly under client-side routing or
React StrictMode.

The backend's security/auth policy and database schema have not been redesigned here.
Existing capability limitations and service dependencies remain. No account credentials
or production data were supplied for live end-to-end persistence checks.

## Verification

- `npm run build`: compile all 19 entry points and lazy chunks.
- `npm test`: mount React pages, initialize controllers with mocked API responses,
  check UI interactions and expected production assets.
- `npm run test:browser`: browser smoke tests for all nonredirect pages, auth entry
  points, interactive examples, theme changes, and mobile overflow/menu behavior.
- `npm run test:api`: existing live backend integration suite (separate setup).

DOM tests use JSDOM; they do not establish visual correctness, canvas rendering, real
compiler execution, authentication validity, or production persistence. Browser tests
run in GitHub Actions with Chromium. In the authoring environment Chromium startup was
blocked by socket restrictions, so a local browser pass must not be claimed.

Before merging, review the browser CI results and perform an authenticated check against
a configured test backend: login/signup, profile save, quiz start/submit/history, DSA
run/submit, resume save/ATS/export, planner note/task mutations, placement mutations,
and admin imports/CRUD. Do not use production records for that check.
