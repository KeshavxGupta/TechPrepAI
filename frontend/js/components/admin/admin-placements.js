(function() {
  const container = document.getElementById('component-admin-placements');
  if (!container) return;

  container.outerHTML = `
  <!-- Panel: Placement Drives Management -->
  <div id="tab-panel-placements" class="hidden space-y-6 text-left">
    
    <!-- Header Panel -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl flex items-center gap-2">
          <svg class="w-7 h-7 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Placement Drives & Opportunities
        </h1>
        <p class="text-xs sm:text-sm text-neutral-500 mt-1">
          Publish company placement drives, update eligibility requirements, manage compensation packages, and monitor student pipelines.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center gap-2.5 flex-wrap">
        <button onclick="openAdminPlacementModal()" 
          class="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add Placement Drive</span>
        </button>

        <div class="relative group">
          <button class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors" title="Backup & Restore">
            <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
          <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 z-50 hidden group-hover:block py-1">
            <button onclick="exportAdminPlacements()" class="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Export Drives (.json)
            </button>
            <button onclick="document.getElementById('admin-import-placements-file').click()" class="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2">
              <svg class="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"/></svg>
              Import Drives (.json)
            </button>
          </div>
          <input type="file" id="admin-import-placements-file" accept=".json" class="hidden" onchange="importAdminPlacements(event)">
        </div>
      </div>
    </div>

    <!-- Stat Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Total Drives</p>
          <h3 id="admin-stat-total-drives" class="text-2xl font-black text-neutral-900 dark:text-white mt-1">0</h3>
        </div>
        <div class="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
        </div>
      </div>

      <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Open / Active</p>
          <h3 id="admin-stat-open-drives" class="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0</h3>
        </div>
        <div class="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      </div>

      <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Highest CTC</p>
          <h3 id="admin-stat-highest-package" class="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">₹0 LPA</h3>
        </div>
        <div class="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
      </div>

      <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm flex items-center justify-between">
        <div>
          <p class="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Average CTC</p>
          <h3 id="admin-stat-avg-package" class="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">₹0 LPA</h3>
        </div>
        <div class="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        </div>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <div class="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated flex flex-col sm:flex-row gap-3 justify-between items-center">
      <div class="flex-1 w-full sm:w-auto relative">
        <input type="text" id="admin-placement-search" oninput="renderAdminPlacements()" placeholder="Search by company, role, eligibility, or location..."
          class="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
        <svg class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select id="admin-placement-status-filter" onchange="renderAdminPlacements()"
          class="px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-neutral-800 dark:text-neutral-200 outline-none w-full sm:w-auto">
          <option value="all">All Stages</option>
          <option value="wishlist">Wishlist / Announced</option>
          <option value="applied">Applied / Open</option>
          <option value="assessment">Assessment (OA)</option>
          <option value="interview">Interview</option>
          <option value="selected">Offer / Selected</option>
          <option value="rejected">Closed / Rejected</option>
        </select>
        <span id="admin-placement-count-badge" class="text-xs font-mono text-neutral-400 shrink-0">0 drives</span>
      </div>
    </div>

    <!-- Placement Drives List Container -->
    <div id="admin-placement-list-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Dynamically populated by hub.js -->
    </div>

  </div>

  <!-- Admin Placement Modal (Create / Edit Drive) -->
  <div id="admin-placement-modal-overlay" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto">
    <div id="admin-placement-modal" class="w-full max-w-xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left">
      <div class="p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-surface-secondary rounded-t-2xl">
        <h3 id="admin-placement-modal-title" class="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
          <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
          </svg>
          Add Placement Drive
        </h3>
        <button onclick="closeAdminPlacementModal()" class="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="p-6 overflow-y-auto space-y-4 text-xs font-medium text-neutral-700 dark:text-neutral-300 flex-1">
        <!-- Error Banner -->
        <div id="admin-placement-error-banner" class="hidden p-3 rounded-lg border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs font-semibold"></div>

        <input type="hidden" id="admin-placement-id">

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block font-semibold">Company Name *</label>
            <input type="text" id="admin-placement-company" placeholder="e.g. Google, Microsoft, Adobe"
              class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
          <div class="space-y-1.5">
            <label class="block font-semibold">Job Role *</label>
            <input type="text" id="admin-placement-role" placeholder="e.g. Software Development Engineer"
              class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block font-semibold">Package (LPA in ₹) *</label>
            <input type="text" id="admin-placement-package" placeholder="e.g. 24.5"
              class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
          <div class="space-y-1.5">
            <label class="block font-semibold">Eligibility Criteria</label>
            <input type="text" id="admin-placement-eligibility" placeholder="e.g. 7.5+ CGPA, B.Tech/M.Tech 2026"
              class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block font-semibold">Location</label>
            <input type="text" id="admin-placement-location" placeholder="e.g. Bengaluru, Hyderabad, Remote"
              class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
          <div class="space-y-1.5">
            <label class="block font-semibold">Initial Stage / Status</label>
            <select id="admin-placement-status" class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
              <option value="wishlist" selected>Wishlist / Announced Opportunity</option>
              <option value="applied">Applied / In Progress</option>
              <option value="assessment">Assessment (OA Round)</option>
              <option value="interview">Interview Rounds</option>
              <option value="selected">Offer / Selected</option>
              <option value="rejected">Closed / Rejected</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1.5">
            <label class="block font-semibold">Application Deadline</label>
            <input type="date" id="admin-placement-deadline"
              class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
          <div class="space-y-1.5">
            <label class="block font-semibold">Interview / OA Date</label>
            <input type="date" id="admin-placement-interview-date"
              class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="block font-semibold">Official Career / Application Link</label>
          <input type="url" id="admin-placement-link" placeholder="https://careers.company.com/job/..."
            class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500">
        </div>

        <div class="space-y-1.5">
          <label class="block font-semibold">Drive Notes, Selection Rounds & Syllabus (Optional)</label>
          <textarea id="admin-placement-notes" rows="3" placeholder="e.g. Round 1: Online Coding (DSA + Aptitude), Round 2: Technical Interview on Graphs and System Design..."
            class="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:border-blue-500"></textarea>
        </div>
      </div>

      <div class="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2.5 bg-surface-secondary rounded-b-2xl">
        <button onclick="closeAdminPlacementModal()" class="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Cancel</button>
        <button onclick="saveAdminPlacement()" id="admin-save-placement-btn" class="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors">Publish Drive</button>
      </div>
    </div>
  </div>`;
})();
