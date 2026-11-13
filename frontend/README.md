# TechPrepAI frontend

This folder is a standalone Vite + React project. Use Node.js 20.19+ or 22.12+.

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. Vite serves the pages and proxies `/api` to the Express
backend at http://127.0.0.1:5000. Run that backend separately from the repository root:

```bash
npm run dev:backend
```

For another backend, copy `.env.example` to `.env` here and edit `API_PROXY_TARGET`.
Without a running, configured backend, the frontend can render but login and saved
quiz/resume/planner/placement data cannot work. Never place server secrets in `VITE_*` variables.

```bash
npm run build    # Production files in frontend/dist/
npm run preview  # Preview the production build on port 4173
```

`package.json`, `package-lock.json`, Vite, PostCSS and Tailwind configuration all live
in this folder. No root installation is needed for frontend-only development.
The small HTML files preserve the existing page URLs. `src/` contains React and styles;
`public/controllers/` contains the existing feature controllers required by those pages.
