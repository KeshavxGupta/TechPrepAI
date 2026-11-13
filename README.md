# TechPrepAI

Full Stack Developer Preparation Platform with separate Frontend and Backend architectures.

---

## Frontend development

The frontend uses Vite, React, and build-time Tailwind CSS. Use Node.js 20.19+ or 22.12+.

```bash
npm ci
cp backend/.env.example backend/.env
# Configure your existing MongoDB URI and JWT secret in backend/.env.
```

Run the backend and frontend in separate terminals:

```bash
npm run dev:backend   # Express API on port 5000
npm run dev           # Vite frontend on port 5173
```

Vite proxies `/api` to Express. `API_PROXY_TARGET` can override the development target.
Set `VITE_API_BASE_URL` only when deploying the browser and API on different origins.
Do not put secrets in variables prefixed `VITE_`; they are public browser configuration.

```bash
npm run build        # Creates dist/ with all 19 existing page URLs
npm start            # Express serves dist/ and /api
npm run preview      # Preview the built frontend (without an API server)
npm test             # DOM rendering and controller regression tests; build first
npm run test:browser # Playwright browser checks; build first
npm run test:api     # Existing API integration suite; requires backend/database
```

For browser tests, install Chromium once with `npx playwright install chromium`.
CI installs it automatically. API tests and live persistence require your database configuration.

## Project structure

- `frontend/src/pages/`: React page components, loaded per URL.
- `frontend/src/components/`: reusable React presentation components.
- `frontend/src/styles/`: compiled utilities, workbench design tokens, and page-specific styles.
- `frontend/src/runtime/`: page manifest and controller initialization.
- `frontend/public/controllers/`: existing feature controllers and domain logic.
- `docs/examples/`: sample quiz import files (not shipped as frontend assets).
- `frontend/pages/`: Vite HTML entry shells preserving existing deep links.
- `backend/`: existing Express routes, MongoDB models, and execution services.
- `tests/`: DOM regression tests and Playwright browser checks.

The home page uses React hooks for the example editor and mobile navigation. Existing
quiz, editor, resume, planner, placement, and admin controllers initialize after React's
initial mount using `techprep:ready`. Their API contracts, saved-session keys, and global
handler names are retained. Those controllers still use imperative DOM updates; this is
an incremental React migration, not a claim that every feature is now implemented with
hooks. Do not rerender a controller-owned subtree while it is active. Page navigation
intentionally performs a full document load to clean up existing timers and listeners.
See [migration notes](docs/FRONTEND_MIGRATION.md) for boundaries and validation.

## Key links

- Frontend development: <http://localhost:5173>
- API health: <http://localhost:5000/api/health>
- DSA IDE: <http://localhost:5173/pages/user/dsa-ide.html>
- Quiz portal: <http://localhost:5173/pages/user/quiz-user.html>

## REST API Reference

Base URLs:
* **Local Development**: `http://localhost:5000`
* **Production**: `https://tech-prep-ai-three.vercel.app`

### 1. System & Health
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health, uptime, and MongoDB connection status |
| `ALL` | `/api/keepalive` | MongoDB Atlas heartbeat ping to prevent cluster idle sleep |

### 2. Authentication & User Management (`/api/auth`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new student or admin account |
| `POST` | `/api/auth/login` | Authenticate credentials and receive JWT token |
| `GET` | `/api/auth/me?email=:email` | Get user profile details |
| `PUT` | `/api/auth/profile` | Update profile details, skills, and portfolio links |
| `GET` | `/api/auth/users` | List all registered users (Admin) |
| `PUT` | `/api/auth/users/:id/toggle-suspend` | Toggle account suspension status |
| `PUT` | `/api/auth/users/:id/reset-password` | Reset user password (Admin) |

### 3. Quizzes & Assessments (`/api/quizzes`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/quizzes` | List all available quizzes |
| `POST` | `/api/quizzes` | Create or update a technical quiz |
| `GET` | `/api/quizzes/:id` | Get quiz details by ID or customId |
| `DELETE` | `/api/quizzes/:id` | Delete a quiz |
| `POST` | `/api/quizzes/results` | Submit quiz attempt with answers and score |
| `GET` | `/api/quizzes/results` | Retrieve all student quiz attempts (Admin) |
| `GET` | `/api/quizzes/results/user/:email` | Get quiz submission history for a student |

### 4. Placement Tracker (`/api/placements`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/placements` | Get master placement drives |
| `POST` | `/api/placements` | Create a new campus placement drive |
| `GET` | `/api/placements/user/:email` | Get student-specific placement drives |
| `PUT` | `/api/placements/:id` | Update placement drive information |
| `PATCH` | `/api/placements/:id/status` | Update drive stage (`wishlist`, `applied`, `interview`, `offered`, `rejected`) |
| `POST` | `/api/placements/sync` | Bulk synchronize student placement drives |
| `DELETE` | `/api/placements/:id` | Remove a placement drive |

### 5. Resumes & ATS Scanner (`/api/resumes`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/resumes` | Create or update a resume |
| `POST` | `/api/resumes/scan-ats` | Score resume text against keywords & job descriptions |
| `GET` | `/api/resumes/user/:email` | Retrieve all resumes for a student |
| `GET` | `/api/resumes/:id` | Get a single resume by ID |
| `DELETE` | `/api/resumes/:id` | Delete a saved resume |

### 6. DSA & Compiler Sandbox (`/api/dsa`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dsa/problems` | List all DSA problems |
| `GET` | `/api/dsa/problems/:problemId` | Get problem description, starter code, and test cases |
| `POST` | `/api/dsa/run` | Execute code against test cases in compiler sandbox |
| `POST` | `/api/dsa/submit` | Submit code solution & record evaluation verdict |
| `GET` | `/api/dsa/submissions/user/:email` | Retrieve user submissions and solved problem IDs |

### 7. Study Planner & Notes (`/api/planner`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/planner/tasks` | Create a study task |
| `GET` | `/api/planner/tasks/user/:email` | Get all tasks for a student |
| `PATCH` | `/api/planner/tasks/:id/toggle` | Toggle task completion |
| `DELETE` | `/api/planner/tasks/:id` | Delete a study task |
| `GET` | `/api/planner/notes/user/:email` | Retrieve active recall study notes |
| `POST` | `/api/planner/notes` | Create a note with tags and pinning |
| `PUT` | `/api/planner/notes/:id` | Update note content, title, or tags |
| `PATCH` | `/api/planner/notes/:id/pin` | Toggle note pinned status |
| `DELETE` | `/api/planner/notes/:id` | Delete a study note |

### 8. Admin Telemetry (`/api/admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/telemetry` | Aggregated metrics for users, quizzes, drives, and system health |

---

## Testing API Endpoints

* **Automated Test Runner**:
  ```bash
  npm run test:api
  ```
  *(Verifies all 44 endpoints against local or deployed server)*
* **Postman Collection**: Importable collection available at [`docs/techprep_ai_postman_collection.json`](docs/techprep_ai_postman_collection.json).
* **Testing Guide**: Detailed request payloads and examples in [`docs/POSTMAN_TESTING_GUIDE.md`](docs/POSTMAN_TESTING_GUIDE.md).
