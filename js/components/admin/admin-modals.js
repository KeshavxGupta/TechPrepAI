(function() {
  const container = document.getElementById('component-admin-modals');
  if (!container) return;

  container.outerHTML = `
  <!-- Quiz Overlay Modal (Create / Edit) -->
  <div id="quiz-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto">
    <div class="w-full max-w-4xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left">
      
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-surface-secondary">
        <div>
          <h2 id="modal-title" class="text-base font-extrabold text-neutral-900 dark:text-white">Create New Quiz</h2>
          <p class="text-[11px] text-neutral-500">Specify details, settings, and build your list of questions.</p>
        </div>
        <button onclick="closeQuizModal()" class="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Body (Scrollable form) -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6">
        
        <!-- Error Banner inside modal -->
        <div id="modal-error-banner" class="hidden p-3 rounded-lg border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs font-semibold"></div>

        <!-- Section 1: Basic Info -->
        <div class="space-y-4">
          <h3 class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">1. Quiz Parameters</h3>
          
          <input type="hidden" id="form-quiz-id">

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-3">
              <label for="form-quiz-title" class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Quiz Title</label>
              <input type="text" id="form-quiz-title" placeholder="e.g. Tree Node Deletions & Traversals"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
            </div>

            <div class="md:col-span-3">
              <label for="form-quiz-desc" class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Description</label>
              <textarea id="form-quiz-desc" rows="2" placeholder="Describe the topics covered in this quiz..."
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white"></textarea>
            </div>

            <div>
              <label for="form-quiz-time" class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Time Limit (Minutes)</label>
              <input type="number" id="form-quiz-time" min="1" max="180" placeholder="10"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
            </div>

            <div>
              <label for="form-quiz-pass" class="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">Passing Percentage (%)</label>
              <input type="number" id="form-quiz-pass" min="10" max="100" placeholder="60"
                class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
            </div>
          </div>
        </div>

        <hr class="border-neutral-200 dark:border-neutral-800">

        <!-- Bulk Question Importer -->
        <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">Bulk Import Questions</h3>
            <span class="text-[10px] text-neutral-400 font-mono">Excel, CSV, Word, or TXT</span>
          </div>
          
          <div class="flex items-center justify-center w-full">
            <label class="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer bg-surface-primary hover:border-blue-500/50 transition-all">
              <div class="flex flex-col items-center justify-center pt-4 pb-4 px-2 text-center">
                <svg class="w-6 h-6 mb-2 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                <p class="text-[11px] text-neutral-500"><span class="font-semibold text-blue-600 dark:text-blue-500">Click to upload</span> or drag and drop</p>
                <p class="text-[9px] text-neutral-400 mt-0.5">XLSX, XLS, CSV, DOCX, TXT (Aiken format)</p>
              </div>
              <input type="file" id="bulk-file-input" accept=".xlsx,.xls,.csv,.docx,.txt" class="hidden" onchange="handleBulkImport(this)" />
            </label>
          </div>
        </div>

        <hr class="border-neutral-200 dark:border-neutral-800">

        <!-- Section 2: Questions Dynamic Builder -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">2. Questions Inventory</h3>
            <button type="button" onclick="addQuestionDOM()" class="px-3 py-1.5 text-xs font-semibold rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-blue-600 dark:text-blue-400 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center">
              + Add Question
            </button>
          </div>

          <div id="form-questions-container" class="space-y-6">
            <!-- Questions rendered here -->
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end bg-surface-secondary gap-3">
        <button onclick="closeQuizModal()" class="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          Cancel
        </button>
        <button onclick="saveQuizForm()" class="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors">
          Save Quiz
        </button>
      </div>

    </div>
  </div>

  <!-- Delete Confirmation Modal -->
  <div id="delete-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
    <div class="w-full max-w-md bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 text-left">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center text-lg font-bold">!</div>
        <h3 class="text-base font-extrabold text-neutral-900 dark:text-white">Delete Quiz</h3>
      </div>
      <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-6">Are you sure you want to permanently delete <strong id="delete-quiz-name" class="text-neutral-800 dark:text-neutral-200"></strong>? This action cannot be undone and will delete user records matching this quiz.</p>
      
      <div class="flex items-center justify-end gap-3">
        <button onclick="closeDeleteModal()" class="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          Cancel
        </button>
        <button id="confirm-delete-btn" class="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors">
          Delete Quiz
        </button>
      </div>
    </div>
  </div>

  <!-- Student Resume Inspection Modal (in Admin Console) -->
  <div id="admin-inspect-resume-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
    <div class="w-full max-w-3xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 text-left space-y-4 max-h-[85vh] overflow-y-auto">
      
      <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <h3 class="text-base font-extrabold text-neutral-900 dark:text-white">Student Resume Inspection View</h3>
        <button onclick="closeAdminInspectResumeModal()" class="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1" title="Close">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <div id="admin-inspect-resume-container">
        <!-- Rendered dynamically -->
      </div>

    </div>
  </div>`;
})();



