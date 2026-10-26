/**
 * TechPrep AI - Centralized Backend API Client
 * Connects Vanilla JS Frontend to the Express / MongoDB REST Backend
 */

(function () {
  function getApiBase() {
    if (typeof window !== 'undefined' && window.location) {
      const hostname = window.location.hostname;
      // If developing locally on a non-5000 dev server (e.g. VS Code Live Server on 5500, Vite on 5173),
      // forward requests to the local Express backend server running on port 5000:
      if ((hostname === 'localhost' || hostname === '127.0.0.1') && window.location.port !== '5000' && window.location.port !== '') {
        return 'http://localhost:5000/api';
      }
      // On deployed domains (Vercel, custom domain, production) or when served directly from Express:
      // Always use the relative /api path so requests stay on HTTPS and same-origin.
      return '/api';
    }
    return '/api';
  }

  const API_BASE = getApiBase();

  // Helper to read active session user from sessionStorage or cookie (no localStorage)
  function getSessionUser() {
    try {
      if (typeof window !== 'undefined') {
        const sessionRaw = sessionStorage.getItem('techprep_current_user');
        if (sessionRaw) return JSON.parse(sessionRaw);

        // Fallback to cookie for cross-tab persistence
        const match = document.cookie.match(/(?:^|; )techprep_current_user=([^;]*)/);
        if (match && match[1]) {
          return JSON.parse(decodeURIComponent(match[1]));
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  // Helper to get stored auth token
  function getAuthToken() {
    const user = getSessionUser();
    return user && user.token ? user.token : null;
  }

  // Helper to get current user email for header propagation
  function getCurrentUserEmail() {
    const user = getSessionUser();
    return user && user.email ? user.email : '';
  }

  // Base HTTP Request Wrapper with JSON handling and timeout
  async function request(endpoint, options = {}) {
    const base = getApiBase();
    const url = `${base}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-user-email': getCurrentUserEmail(),
      ...(options.headers || {})
    };

    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutMs = options.timeout || 12000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...options,
        signal: options.signal || controller.signal,
        headers
      });
      clearTimeout(timeoutId);

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        return {
          success: false,
          status: res.status,
          message: data.message || 'Request failed',
          ...data
        };
      }
      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn(`[TechPrep API] Network/Offline request to ${endpoint}:`, err.message);
      return {
        success: false,
        isNetworkError: true,
        message: err.message
      };
    }
  }

  const TechPrepAPI = {
    // --- Auth Endpoints ---
    async register(userData) {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });
    },

    async login(email, password) {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
    },

    async getMe(email) {
      return await request(`/auth/me?email=${encodeURIComponent(email || getCurrentUserEmail())}`);
    },

    async updateProfile(profileData) {
      return await request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });
    },

    async getAllUsers() {
      return await request('/auth/users');
    },

    async toggleSuspendUser(userId) {
      return await request(`/auth/users/${encodeURIComponent(userId)}/toggle-suspend`, {
        method: 'PUT'
      });
    },

    async resetUserPassword(userId, newPassword) {
      return await request(`/auth/users/${encodeURIComponent(userId)}/reset-password`, {
        method: 'PUT',
        body: JSON.stringify({ newPassword })
      });
    },

    // --- Quiz Endpoints ---
    async getQuizzes() {
      return await request('/quizzes');
    },

    async getQuizById(id) {
      return await request(`/quizzes/${id}`);
    },

    async saveQuiz(quizData) {
      return await request('/quizzes', {
        method: 'POST',
        body: JSON.stringify(quizData)
      });
    },

    async deleteQuiz(id) {
      return await request(`/quizzes/${id}`, {
        method: 'DELETE'
      });
    },

    async submitQuizResult(resultData) {
      return await request('/quizzes/results', {
        method: 'POST',
        body: JSON.stringify(resultData)
      });
    },

    async getStudentQuizResults(email) {
      return await request(`/quizzes/results/user/${encodeURIComponent(email || getCurrentUserEmail())}`);
    },

    async getUserQuizResults(email) {
      return await this.getStudentQuizResults(email);
    },

    async getAllQuizResults() {
      return await request('/quizzes/results');
    },

    // --- Placement Drives Endpoints ---
    async getPlacements(email) {
      const q = email ? `?email=${encodeURIComponent(email)}` : '';
      return await request(`/placements${q}`);
    },

    async getUserPlacements(email) {
      return await request(`/placements/user/${encodeURIComponent(email || getCurrentUserEmail())}`);
    },

    async createPlacement(placementData) {
      return await request('/placements', {
        method: 'POST',
        body: JSON.stringify(placementData)
      });
    },

    async updatePlacement(id, updateData) {
      return await request(`/placements/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });
    },

    async updatePlacementStatus(id, status, studentEmail) {
      return await request(`/placements/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, studentEmail: studentEmail || getCurrentUserEmail() })
      });
    },

    async deletePlacement(id) {
      return await request(`/placements/${id}`, {
        method: 'DELETE'
      });
    },

    async syncUserPlacements(email, placements) {
      return await request('/placements/sync', {
        method: 'POST',
        body: JSON.stringify({ email: email || getCurrentUserEmail(), placements })
      });
    },

    // --- Resume Builder & ATS Scanner ---
    async getUserResumes(email) {
      return await request(`/resumes/user/${encodeURIComponent(email || getCurrentUserEmail())}`);
    },

    async saveResume(resumeData) {
      return await request('/resumes', {
        method: 'POST',
        body: JSON.stringify(resumeData)
      });
    },

    async scanAts(scanPayload) {
      return await request('/resumes/scan-ats', {
        method: 'POST',
        body: JSON.stringify(scanPayload)
      });
    },

    async deleteResume(id) {
      return await request(`/resumes/${id}`, {
        method: 'DELETE'
      });
    },

    // --- DSA Endpoints ---
    async getDsaProblems() {
      return await request('/dsa/problems');
    },

    async getDsaProblemById(problemId) {
      return await request(`/dsa/problems/${problemId}`);
    },

    async runDsaCode(codePayload) {
      const email = getCurrentUserEmail() || 'guest@techprepai.com';
      const payload = {
        studentEmail: email,
        ...codePayload
      };
      return await request('/dsa/run', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async submitDsaSolution(submissionPayload) {
      const email = getCurrentUserEmail() || 'guest@techprepai.com';
      const payload = {
        studentEmail: email,
        ...submissionPayload
      };
      return await request('/dsa/submit', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    },

    async getUserDsaSubmissions(email, options = {}) {
      const activeEmail = email || getCurrentUserEmail() || 'guest@techprepai.com';
      const params = new URLSearchParams();
      if (options.problemId) params.append('problemId', options.problemId);
      if (options.source) params.append('source', options.source);
      if (options.actionType) params.append('actionType', options.actionType);
      if (options.quizId) params.append('quizId', options.quizId);
      if (options.questionIdx !== undefined && options.questionIdx !== '') params.append('questionIdx', options.questionIdx);
      const q = params.toString() ? `?${params.toString()}` : '';
      return await request(`/dsa/submissions/user/${encodeURIComponent(activeEmail)}${q}`);
    },

    // --- Planner Endpoints ---
    async getUserPlannerTasks(email) {
      return await request(`/planner/tasks/user/${encodeURIComponent(email || getCurrentUserEmail())}`);
    },

    async createPlannerTask(taskData) {
      return await request('/planner/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
    },

    async togglePlannerTask(taskId) {
      return await request(`/planner/tasks/${taskId}/toggle`, {
        method: 'PATCH'
      });
    },

    async deletePlannerTask(taskId) {
      return await request(`/planner/tasks/${taskId}`, {
        method: 'DELETE'
      });
    },

    // --- Study Notes Endpoints (100% MongoDB Atlas) ---
    async getUserNotes(email) {
      return await request(`/planner/notes/user/${encodeURIComponent(email || getCurrentUserEmail())}`);
    },

    async createNote(noteData) {
      return await request('/planner/notes', {
        method: 'POST',
        body: JSON.stringify(noteData)
      });
    },

    async updateNote(id, noteData) {
      return await request(`/planner/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(noteData)
      });
    },

    async togglePinNote(id) {
      return await request(`/planner/notes/${id}/pin`, {
        method: 'PATCH'
      });
    },

    async deleteNote(id) {
      return await request(`/planner/notes/${id}`, {
        method: 'DELETE'
      });
    },

    // --- Admin Endpoints ---
    async getAdminTelemetry() {
      return await request('/admin/telemetry');
    },

    // --- Keep-Alive / Heartbeat Endpoints ---
    async pingKeepAlive() {
      return await request('/keepalive');
    },

    async checkHealth() {
      return await request('/health');
    }
  };

  // Background pulse: ping Atlas every 4 minutes while browser tab is active so DB never sleeps
  if (typeof window !== 'undefined') {
    setInterval(() => {
      TechPrepAPI.pingKeepAlive().catch(() => {});
    }, 240000);
  }

  window.TechPrepAPI = TechPrepAPI;
})();
