(function() {
  const container = document.getElementById('component-user-sidebar');
  if (!container) return;

  container.outerHTML = `
  <!-- Mobile Overlay Backdrop -->
  <div id="user-sidebar-overlay" onclick="toggleUserSidebar()" class="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-30 hidden lg:hidden"></div>

  <!-- Left Sidebar -->
  <aside id="user-sidebar" class="fixed lg:sticky top-0 left-0 z-40 w-64 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 subtle-glass flex flex-col justify-between p-5 transition-transform duration-300 -translate-x-full lg:translate-x-0 shrink-0">
    <div class="space-y-6">
      <!-- Logo -->
      <div class="flex items-center justify-between">
        <a href="index.html" class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-sm shadow-sm">
            TP
          </div>
          <span class="font-bold text-base tracking-tight font-sans text-neutral-900 dark:text-white">TechPrep <span class="text-blue-600 dark:text-blue-500 font-bold">AI</span></span>
        </a>
        <button onclick="toggleUserSidebar()" class="lg:hidden text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1.5 flex flex-col text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        <button id="side-btn-quizzes" onclick="switchDashboardTab('quizzes'); toggleUserSidebar(false);" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>Available Quizzes</span>
        </button>
        <button id="side-btn-history" onclick="switchDashboardTab('history'); toggleUserSidebar(false);" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Attempt History</span>
        </button>
        <a href="dsa-ide.html" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>DSA Code IDE</span>
        </a>
        <a href="resume-builder.html" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>ATS Resume Builder</span>
        </a>
        <a href="index.html" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home Page</span>
        </a>
      </nav>
    </div>

    <!-- Sidebar Bottom Profile Section -->
    <div class="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex flex-col space-y-2">
      <button id="side-btn-profile" onclick="switchDashboardTab('profile'); toggleUserSidebar(false);" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white w-full text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>My Profile</span>
      </button>
      <button onclick="logoutUser()" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 text-rose-600 dark:text-rose-400 w-full text-xs font-semibold">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>`;
})();
