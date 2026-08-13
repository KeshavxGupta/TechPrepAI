(function() {
  const container = document.getElementById('component-admin-users');
  if (!container) return;

  container.outerHTML = `
  <!-- Panel 2: User Management -->
  <div id="tab-panel-users" class="hidden space-y-6">
    <!-- Header Panel -->
    <div class="mb-8 text-left">
      <h1 class="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">User Directory & Telemetry</h1>
      <p class="text-sm text-neutral-500 mt-1">Monitor registered students, check academic profiles, reset passwords, and toggle suspensions.</p>
    </div>

    <!-- Telemetry Dashboard Metrics (Horizontal charts) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <!-- Chart 1: Completeness -->
      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Profile Completeness</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Fully Complete (100%)</span>
              <span id="chart-complete-count">0</span>
            </div>
            <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div id="chart-complete-bar" class="bg-emerald-500 h-full transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Incomplete (&lt;100%)</span>
              <span id="chart-incomplete-count">0</span>
            </div>
            <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div id="chart-incomplete-bar" class="bg-amber-500 h-full transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart 2: Suspension status -->
      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Account States</h3>
        <div class="space-y-3">
          <div>
            <div class="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Active Accounts</span>
              <span id="chart-active-count">0</span>
            </div>
            <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div id="chart-active-bar" class="bg-blue-600 h-full transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
              <span>Suspended Accounts</span>
              <span id="chart-suspended-count">0</span>
            </div>
            <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div id="chart-suspended-bar" class="bg-rose-500 h-full transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart 3: Quiz Solving Performance -->
      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
        <h3 class="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">Student Averages</h3>
        <div class="grid grid-cols-2 gap-4">
          <div class="text-center p-3 rounded bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
            <span class="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Average CGPA</span>
            <span id="metrics-avg-cgpa" class="text-xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1 block">0.00</span>
          </div>
          <div class="text-center p-3 rounded bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
            <span class="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Total Attempts</span>
            <span id="metrics-total-attempts" class="text-xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1 block">0</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Search & Filters -->
    <div class="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated">
      <div class="w-full sm:w-80 relative">
        <input type="text" id="user-search" oninput="renderUsers()" placeholder="Search students by name or email..."
          class="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
        <svg class="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div class="text-xs font-mono text-neutral-400" id="user-results-count">
        Showing 0 users
      </div>
    </div>

    <!-- User List Grid -->
    <div id="user-list-container" class="space-y-4">
      <!-- Rendered dynamically -->
    </div>
  </div>`;
})();
