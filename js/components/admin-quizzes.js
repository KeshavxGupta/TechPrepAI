(function() {
  const container = document.getElementById('component-admin-quizzes');
  if (!container) return;

  container.outerHTML = `
  <!-- Panel 1: Quiz Management -->
  <div id="tab-panel-quizzes" class="block space-y-6">
    <!-- Header Panel -->
    <div class="mb-8 md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">Tech Hub Management</h1>
        <p class="text-sm text-neutral-500 mt-1">Add, modify, and delete custom quizzes for student technical preparation.</p>
      </div>
      <div class="flex flex-wrap items-center gap-3">
        <button onclick="resetQuizzes()" class="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
          Reset Seeds
        </button>
        <button onclick="openQuizModal()" class="px-4 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all flex items-center">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create New Quiz
        </button>
      </div>
    </div>

    <!-- Quick Telemetry Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Total Quizzes</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-total-quizzes" class="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">0</span>
        </div>
      </div>

      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Questions Seeded</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-total-questions" class="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">0</span>
        </div>
      </div>

      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Average Duration</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-avg-duration" class="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">0m</span>
        </div>
      </div>

      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Avg Pass Score</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-avg-pass" class="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">0%</span>
        </div>
      </div>
    </div>

    <!-- Search Quizzes -->
    <div class="mb-6 max-w-md text-left">
      <label for="search-quiz" class="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 font-mono">Search Assessments</label>
      <div class="relative">
        <input type="text" id="search-quiz" oninput="renderQuizzes()" placeholder="Search quizzes by title or description..."
          class="w-full p-3 pl-10 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs shadow-sm">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Quizzes Grid -->
    <div id="quizzes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Rendered dynamically -->
    </div>
    
    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-16 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-surface-secondary">
      <svg class="w-12 h-12 mx-auto text-neutral-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
      <h3 class="text-sm font-semibold text-neutral-900 dark:text-white">No Quizzes Found</h3>
      <p class="text-xs text-neutral-500 mt-1">Get started by creating a new quiz or click "Reset Seeds".</p>
    </div>
  </div>`;
})();
