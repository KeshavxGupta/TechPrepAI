(function() {
  const container = document.getElementById('component-user-history');
  if (!container) return;

  container.outerHTML = `
  <!-- Tab Section 2: Attempts Logs table -->
  <div id="tab-panel-history" class="hidden">
    <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
      <table class="w-full text-left text-xs border-collapse">
        <thead>
          <tr class="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono bg-surface-secondary">
            <th class="py-3 px-4 font-semibold">DATE & TIMESTAMP</th>
            <th class="py-3 px-4 font-semibold">ASSESSMENT TOPIC</th>
            <th class="py-3 px-4 font-semibold">SCORE RESOLUTION</th>
            <th class="py-3 px-4 font-semibold">TAB WARNINGS</th>
            <th class="py-3 px-4 font-semibold">STATUS</th>
            <th class="py-3 px-4 font-semibold">SUBMISSION INFO</th>
          </tr>
        </thead>
        <tbody id="history-table-body" class="divide-y divide-neutral-200 dark:divide-neutral-800/60 font-sans">
          <!-- Dynamically populated -->
        </tbody>
      </table>
    </div>

    <!-- Empty logs -->
    <div id="history-empty" class="hidden text-center py-12 text-neutral-500">
      <p class="text-xs">No examination attempts logged in this profile history yet.</p>
    </div>
  </div>`;
})();
