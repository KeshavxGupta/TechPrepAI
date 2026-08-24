/**
 * TechPrep AI - Centralized Backend API Client
 * Connects Vanilla JS Frontend to the Express / MongoDB REST Backend
 */

(function () {
  function getApiBase() {
    if (typeof window !== 'undefined' && window.location) {
      // If hosted directly on express server (e.g. port 5000), use relative /api
      if (window.location.port === '5000' || window.location.pathname.startsWith('/pages/')) {
        return window.location.origin.includes('5000') ? '/api' : 'http://localhost:5000/api';
      }
      return window.location.origin.startsWith('http') && window.location.port !== '5000' ? 'http://localhost:5000/api' : '/api';
    }
    return 'http://localhost:5000/api';
  }

  const API_BASE = getApiBase();

  // Helper to get stored auth token
  function getAuthToken() {
    try {
      const user = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
      return user && user.token ? user.token : null;
    } catch {
      return null;
    }
  }

  // Helper to get current user email for header propagation
  function getCurrentUserEmail() {
    try {
      const user = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
      return user && user.email ? user.email : '';
    } catch {
      return '';
    }
  }

  // Base HTTP Request Wrapper with JSON handling
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

    try {
      const res = await fetch(url, {
        ...options,
        headers
      });

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
      return await request('/dsa/run', {
        method: 'POST',
        body: JSON.stringify(codePayload)
      });
    },

    async submitDsaSolution(submissionPayload) {
      return await request('/dsa/submit', {
        method: 'POST',
        body: JSON.stringify(submissionPayload)
      });
    },

    async getUserDsaSubmissions(email) {
      return await request(`/dsa/submissions/user/${encodeURIComponent(email || getCurrentUserEmail())}`);
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

    // --- Admin Endpoints ---
    async getAdminTelemetry() {
      return await request('/admin/telemetry');
    }
  };

  window.TechPrepAPI = TechPrepAPI;
})();
