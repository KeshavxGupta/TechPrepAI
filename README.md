# TechPrepAI

Full Stack Developer Preparation Platform with separate Frontend and Backend architectures.

---

## Project Structure

```text
TechPrepAI/
├── frontend/                     # Client-side web application
│   ├── index.html                # Main landing page
│   ├── 404.html                  # Error fallback page
│   ├── css/
│   │   └── styles.css            # Global CSS styles & design tokens
│   ├── js/
│   │   ├── core/                 # Shared runtime (api.js, auth.js, theme.js, ui.js)
│   │   ├── components/           # UI components (landing, admin, user, dsa, resume)
│   │   └── features/             # Business modules (admin, user, quiz, dsa, resume, career)
│   ├── pages/
│   │   ├── admin/                # Admin dashboards & studio pages
│   │   ├── user/                 # Student portal (dashboard, dsa-ide, quiz, planner, placements)
│   │   └── public/               # Public pages (docs, login, signup, privacy, terms)
│   └── data/                     # Sample quiz datasets
│
├── backend/                      # Server-side REST API & database service
│   ├── server.js                 # Express server & static hosting entry point
│   ├── package.json              # Backend dependencies (express, mongoose, cors, etc.)
│   ├── .env                      # Environment config (MONGODB_URI, JWT_SECRET, PORT)
│   ├── .env.example              # Example environment template
│   └── server/
│       ├── config/               # DB connection & multi-language compiler configuration
│       ├── controllers/          # Request handlers (auth, dsa, quiz, placement, planner)
│       ├── middleware/           # JWT auth & centralized error handling
│       ├── models/               # Mongoose schemas (User, Quiz, Placement, DsaProblem, etc.)
│       ├── routes/               # Express API routes (/api/*)
│       ├── seed/                 # Database seed scripts
│       └── services/             # Code compilation & test execution engine
│
├── package.json                  # Root orchestration scripts
├── .gitignore                    # Git ignore rules for node_modules, temp, and .env
└── README.md                     # Project documentation
```

---

## Quick Start

### 1. Configure Environment
In `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/techprep_ai?retryWrites=true&w=majority
JWT_SECRET=techprep_ai_super_secret_jwt_key_2026_production
NODE_ENV=development
```

### 2. Run Commands (From Root Directory)
* **Start Development Server** (with live reload):
  ```bash
  npm run dev
  ```
* **Seed Database** (Populate initial quizzes, problems & drives):
  ```bash
  npm run seed
  ```
* **Run Tests**:
  ```bash
  npm test
  ```
* **Test All API Endpoints**:
  ```bash
  npm run test:api
  ```
* **Production Start**:
  ```bash
  npm start
  ```

---

## Key Links & Portals
* **Web Frontend**: [http://localhost:5000](http://localhost:5000)
* **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
* **DSA IDE**: [http://localhost:5000/pages/user/dsa-ide.html](http://localhost:5000/pages/user/dsa-ide.html)
* **Quiz Portal**: [http://localhost:5000/pages/user/quiz-user.html](http://localhost:5000/pages/user/quiz-user.html)

---

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
