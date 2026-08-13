(function() {
  const container = document.getElementById('component-admin-site-mgmt');
  if (!container) return;

  container.outerHTML = `
  <!-- Panel 4: Site Management -->
  <div id="tab-panel-site-mgmt" class="hidden space-y-6">
    <!-- Header Panel -->
    <div class="mb-6 text-left">
      <h1 class="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">Site Management & System Control</h1>
      <p class="text-sm text-neutral-500 mt-1">Manage FAQs, export/restore site database backups, configure security policies, and inspect live audit logs.</p>
    </div>

    <!-- Sub-Tab Navigation Bar -->
    <div class="flex flex-wrap items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 font-sans text-xs">
      <button id="site-sub-btn-faq" onclick="switchSiteMgmtSubTab('faq')" class="px-4 py-2 rounded-lg font-semibold transition-all bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm">
        FAQ Manager
      </button>
      <button id="site-sub-btn-db" onclick="switchSiteMgmtSubTab('db')" class="px-4 py-2 rounded-lg font-semibold transition-all text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
        Database Backup & Restore
      </button>
      <button id="site-sub-btn-security" onclick="switchSiteMgmtSubTab('security')" class="px-4 py-2 rounded-lg font-semibold transition-all text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
        Security Settings
      </button>
      <button id="site-sub-btn-logs" onclick="switchSiteMgmtSubTab('logs')" class="px-4 py-2 rounded-lg font-semibold transition-all text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
        System Audit Logs
      </button>
    </div>

    <!-- ==========================================
         SUB-PANEL 1: FAQ MANAGER
         ========================================== -->
    <div id="site-sub-panel-faq" class="block space-y-6 text-left">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated">
        <div>
          <h2 class="text-base font-bold text-neutral-900 dark:text-white">Landing Page FAQ Directory</h2>
          <p class="text-xs text-neutral-500">FAQs added or updated here automatically update the landing page FAQ accordion in real time.</p>
        </div>
        <button onclick="openFAQModal()" class="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Add New FAQ
        </button>
      </div>

      <!-- FAQ Search -->
      <div class="max-w-md">
        <input type="text" id="faq-search-input" oninput="renderAdminFAQs()" placeholder="Search FAQs by topic or keyword..."
          class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
      </div>

      <!-- FAQ Container list -->
      <div id="admin-faq-list" class="space-y-4">
        <!-- Loaded dynamically -->
      </div>
    </div>

    <!-- ==========================================
         SUB-PANEL 2: DATABASE BACKUP & MAINTENANCE
         ========================================== -->
    <div id="site-sub-panel-db" class="hidden space-y-6 text-left">
      
      <!-- Database Telemetry Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-1">
          <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block font-mono">DATABASE ENGINE</span>
          <div class="text-xl font-extrabold font-mono text-neutral-900 dark:text-white">Indexed Web Storage</div>
          <span class="text-[11px] text-emerald-500 font-mono">100% Client-Side Encryption</span>
        </div>

        <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-1">
          <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block font-mono">TOTAL RECORD ENTRIES</span>
          <div id="db-total-records" class="text-2xl font-extrabold font-mono text-blue-600 dark:text-blue-400">0</div>
          <span class="text-[11px] text-neutral-500">Quizzes, Users, History & Logs</span>
        </div>

        <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-1">
          <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block font-mono">STORAGE ESTIMATE</span>
          <div id="db-storage-size" class="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">0 KB</div>
          <span class="text-[11px] text-neutral-500">Allocated Browser Storage</span>
        </div>
      </div>

      <!-- Backup Actions Card -->
      <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-6">
        <div>
          <h2 class="text-base font-bold text-neutral-900 dark:text-white">Export & Restore Full Database Backup</h2>
          <p class="text-xs text-neutral-500 mt-1">Download a full JSON snapshot of all site data (quizzes, student accounts, exam attempts, FAQs, security logs) or restore from an existing JSON backup file.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Export Card -->
          <div class="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3">
            <div class="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              <span>EXPORT SITE BACKUP</span>
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Generates a timestamped <code class="font-mono bg-neutral-200 dark:bg-neutral-800 px-1 rounded">techprep_db_backup.json</code> file containing all system state.
            </p>
            <button onclick="exportDatabaseBackup()" class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center">
              Download Full Backup JSON
            </button>
          </div>

          <!-- Import Card -->
          <div class="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3">
            <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
              <span>RESTORE DATABASE FROM JSON</span>
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Upload a valid JSON backup file to restore all quizzes, user accounts, and settings.
            </p>
            <label class="inline-block px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs cursor-pointer transition-colors shadow-sm">
              <span>Select Backup File & Restore</span>
              <input type="file" id="db-restore-file-input" accept=".json" class="hidden" onchange="importDatabaseBackup(this)">
            </label>
          </div>
        </div>

        <hr class="border-neutral-200 dark:border-neutral-800">

        <!-- Reset Database Section -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20">
          <div>
            <h3 class="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider font-mono">DANGER ZONE: FACTORY RESET DATABASE</h3>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">Resets all quizzes to seed defaults and clears custom attempt history.</p>
          </div>
          <button onclick="confirmResetDatabase()" class="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-sm transition-colors">
            Reset Database
          </button>
        </div>
      </div>
    </div>

    <!-- ==========================================
         SUB-PANEL 3: SECURITY SETTINGS
         ========================================== -->
    <div id="site-sub-panel-security" class="hidden space-y-6 text-left">
      
      <!-- Security Config Form -->
      <div class="max-w-3xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-6">
        <div>
          <h2 class="text-base font-bold text-neutral-900 dark:text-white">Proctoring & Exam Security Controls</h2>
          <p class="text-xs text-neutral-500">Configure infraction thresholds and security enforcement rules across student assessment sessions.</p>
        </div>

        <form id="security-settings-form" onsubmit="saveSecuritySettings(event)" class="space-y-5 text-xs">
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="sec-max-warnings" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Max Tab Switch Warnings</label>
              <input type="number" id="sec-max-warnings" min="1" max="10" value="3" required
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="sec-penalty-mode" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Warning Infraction Action</label>
              <select id="sec-penalty-mode" class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="auto-submit">Auto-Submit Exam on Max Limit</option>
                <option value="warn-only">Log Warning & Allow Completion</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="sec-session-timeout" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Session Inactivity Timeout</label>
              <select id="sec-session-timeout" class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                <option value="30">30 Minutes</option>
                <option value="60" selected>60 Minutes</option>
                <option value="120">120 Minutes</option>
                <option value="never">Never Timeout</option>
              </select>
            </div>

            <div class="flex items-center justify-between p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary mt-5">
              <div>
                <span class="font-bold text-neutral-800 dark:text-neutral-200">Two-Factor Authentication (2FA)</span>
                <p class="text-[10px] text-neutral-500">Enforce OTP verification for Admin Logins</p>
              </div>
              <input type="checkbox" id="sec-2fa-toggle" class="accent-blue-600 w-4 h-4 cursor-pointer">
            </div>
          </div>

          <div class="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <button type="submit" class="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm">
              Save Security Policies
            </button>
            <span id="sec-save-status" class="text-xs font-mono text-emerald-500 hidden">Policies Updated</span>
          </div>

        </form>
      </div>

      <!-- Admin Password Change Card -->
      <div class="max-w-3xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 space-y-4">
        <div>
          <h2 class="text-base font-bold text-neutral-900 dark:text-white">Admin Password Change</h2>
          <p class="text-xs text-neutral-500">Update your administrative credential security key.</p>
        </div>

        <form id="admin-password-change-form" onsubmit="changeAdminPassword(event)" class="space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="admin-new-pass" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">New Password</label>
              <input type="password" id="admin-new-pass" required placeholder="••••••••"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>

            <div>
              <label for="admin-confirm-pass" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Confirm New Password</label>
              <input type="password" id="admin-confirm-pass" required placeholder="••••••••"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
            </div>
          </div>

          <button type="submit" class="px-5 py-2.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs transition-colors shadow-sm">
            Update Password
          </button>
        </form>
      </div>

    </div>

    <!-- ==========================================
         SUB-PANEL 4: SYSTEM AUDIT LOGS
         ========================================== -->
    <div id="site-sub-panel-logs" class="hidden space-y-6 text-left">
      
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated">
        <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <select id="log-filter-level" onchange="renderAuditLogs()" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none">
            <option value="ALL">All Event Levels</option>
            <option value="INFO">INFO Only</option>
            <option value="SUCCESS">SUCCESS Only</option>
            <option value="WARNING">WARNING Only</option>
            <option value="ERROR">ERROR Only</option>
          </select>

          <input type="text" id="log-search-input" oninput="renderAuditLogs()" placeholder="Search logs..."
            class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none w-full sm:w-48">
        </div>

        <div class="flex items-center gap-2">
          <button onclick="exportAuditLogsCSV()" class="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Export Logs CSV
          </button>
          <button onclick="clearAuditLogs()" class="px-3.5 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors">
            Clear Logs
          </button>
        </div>
      </div>

      <!-- Logs Table -->
      <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono bg-surface-secondary">
              <th class="py-3 px-4 font-semibold">TIMESTAMP</th>
              <th class="py-3 px-4 font-semibold">LEVEL</th>
              <th class="py-3 px-4 font-semibold">EVENT ACTION / DESCRIPTION</th>
              <th class="py-3 px-4 font-semibold">PERFORMER</th>
            </tr>
          </thead>
          <tbody id="audit-logs-table-body" class="divide-y divide-neutral-200 dark:divide-neutral-800/60 font-sans">
            <!-- Logs populated dynamically -->
          </tbody>
        </table>
      </div>
    </div>

  </div>

  <!-- FAQ Add / Edit Modal -->
  <div id="faq-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
    <div class="w-full max-w-lg bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 text-left space-y-4">
      <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <h3 id="faq-modal-title" class="text-base font-extrabold text-neutral-900 dark:text-white">Add FAQ Entry</h3>
        <button onclick="closeFAQModal()" class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 font-mono text-xs p-1" title="Close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form id="faq-form" onsubmit="saveFAQForm(event)" class="space-y-4 text-xs">
        <input type="hidden" id="faq-form-id">
        
        <div>
          <label for="faq-form-category" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Category Tag</label>
          <input type="text" id="faq-form-category" required placeholder="e.g. General, ATS Resume, Proctoring"
            class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
        </div>

        <div>
          <label for="faq-form-question" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Question Text</label>
          <input type="text" id="faq-form-question" required placeholder="e.g. How does the ATS Resume Scoring engine work?"
            class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
        </div>

        <div>
          <label for="faq-form-answer" class="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Answer Content</label>
          <textarea id="faq-form-answer" rows="4" required placeholder="Provide clear explanation for students..."
            class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
        </div>

        <div class="flex items-center justify-end gap-3 pt-2">
          <button type="button" onclick="closeFAQModal()" class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
          <button type="submit" class="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md transition-colors">
            Save FAQ
          </button>
        </div>
      </form>
    </div>
  </div>`;
})();
