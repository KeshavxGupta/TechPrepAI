(function() {
  const container = document.getElementById('component-user-quizzes');
  if (!container) return;

  container.outerHTML = `
  <!-- Panel 1: Dashboard Home -->
  <div id="tab-panel-quizzes" class="block space-y-6">
    <!-- Welcome Panel -->
    <div class="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
      <div>
        <h1 class="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
          Welcome back, <span id="welcome-user-name" class="text-blue-600 dark:text-blue-500">Student</span>!
        </h1>
        <p class="text-xs text-neutral-500 mt-1">Review your technical score metrics and challenge active topics.</p>
      </div>
    </div>

    <!-- Student Stats Counter -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Assessments Finished</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-completed" class="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white">0</span>
          <span class="text-xs text-neutral-400">Total</span>
        </div>
      </div>

      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Average Accuracy</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-avg-score" class="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400">0%</span>
          <span class="text-xs text-neutral-400">Mean Score</span>
        </div>
      </div>

      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">High Accuracy Bound</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-high-score" class="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">0%</span>
          <span class="text-xs text-neutral-400">Peak Record</span>
        </div>
      </div>

      <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
        <span class="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">Security Infractions</span>
        <div class="flex items-baseline space-x-2 mt-2">
          <span id="stat-violations" class="text-3xl font-extrabold font-mono text-amber-500">0</span>
          <span class="text-xs text-neutral-400">Warnings</span>
        </div>
      </div>
    </div>

    <div id="available-quizzes-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Loaded dynamically -->
    </div>
  </div>`;
})();
