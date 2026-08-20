// TechPrep AI - Student Sidebar Component
window.toggleUserSidebar = window.toggleUserSidebar || function(forceState) {
  const sidebar = document.getElementById('user-sidebar');
  const overlay = document.getElementById('user-sidebar-overlay');
  if (!sidebar || !overlay) return;
  const isClosed = sidebar.classList.contains('-translate-x-full');
  const shouldOpen = forceState !== undefined ? forceState : isClosed;

  if (shouldOpen) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
};

window.switchDashboardTab = window.switchDashboardTab || function(tabName) {
  const isDashboard = window.location.pathname.endsWith('/dashboard.html') || window.location.pathname.endsWith('/dashboard');
  if (isDashboard) {
    const panels = ['quizzes', 'history', 'profile'];
    panels.forEach(p => {
      const panelEl = document.getElementById(`tab-panel-${p}`);
      const sideBtn = document.getElementById(`side-btn-${p}`);
      if (p === tabName) {
        if (panelEl) {
          panelEl.classList.remove('hidden');
          panelEl.classList.add('block');
        }
        if (sideBtn) {
          sideBtn.className = "flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white w-full text-xs font-semibold";
        }
      } else {
        if (panelEl) {
          panelEl.classList.add('hidden');
          panelEl.classList.remove('block');
        }
        if (sideBtn) {
          sideBtn.className = "flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 w-full text-xs font-semibold";
        }
      }
    });

    if (tabName === 'history' && typeof renderHistoryLogs === 'function') {
      renderHistoryLogs();
    } else if (tabName === 'profile' && typeof loadProfileForm === 'function') {
      loadProfileForm();
    }
  } else {
    window.location.href = `/pages/user/dashboard.html?tab=${tabName}`;
  }
};

(function() {
  const container = document.getElementById('component-user-sidebar');
  if (!container) return;

  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get('tab') || 'quizzes';
  
  const isDashboard = currentPath.endsWith('dashboard.html') || currentPath.endsWith('dashboard');
  const isDsa = currentPath.includes('dsa-ide');
  const isResume = currentPath.includes('resume-builder');
  const isPlacements = currentPath.includes('placements');
  const isPlanner = currentPath.includes('planner');

  const activeClass = "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white";
  const defaultClass = "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white";

  container.outerHTML = `
  <!-- Mobile Overlay Backdrop -->
  <div id="user-sidebar-overlay" onclick="toggleUserSidebar(false)" class="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-30 hidden lg:hidden"></div>

  <!-- Left Sidebar -->
  <aside id="user-sidebar" class="fixed lg:sticky top-0 left-0 z-40 w-64 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 subtle-glass flex flex-col justify-between p-5 transition-transform duration-300 -translate-x-full lg:translate-x-0 shrink-0">
    <div class="space-y-6">
      <!-- Logo -->
      <div class="flex items-center justify-between">
        <a href="/index.html" class="flex items-center space-x-2.5 group">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            TP
          </div>
          <span class="font-bold text-base tracking-tight font-sans text-neutral-900 dark:text-white">TechPrep <span class="text-blue-600 dark:text-blue-500 font-bold">AI</span></span>
        </a>
        <button onclick="toggleUserSidebar(false)" class="lg:hidden text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1.5 flex flex-col text-xs font-semibold">
        <!-- Available Quizzes -->
        <button id="side-btn-quizzes" onclick="switchDashboardTab('quizzes'); toggleUserSidebar(false);" 
          class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isDashboard && activeTab === 'quizzes' ? activeClass : defaultClass}">
          <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>Available Quizzes</span>
        </button>

        <!-- Attempt History -->
        <button id="side-btn-history" onclick="switchDashboardTab('history'); toggleUserSidebar(false);" 
          class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isDashboard && activeTab === 'history' ? activeClass : defaultClass}">
          <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Attempt History</span>
        </button>

        <!-- DSA Code IDE -->
        <a href="/pages/user/dsa-ide.html" 
          class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isDsa ? activeClass : defaultClass}">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>DSA Code IDE</span>
        </a>

        <!-- ATS Resume Builder -->
        <a href="/pages/user/resume-builder.html" 
          class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isResume ? activeClass : defaultClass}">
          <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>ATS Resume Builder</span>
        </a>

        <!-- Placement Tracker -->
        <a href="/pages/user/placements.html" 
          class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isPlacements ? activeClass : defaultClass}">
          <svg class="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Placement Tracker</span>
        </a>

        <!-- Daily Planner -->
        <a href="/pages/user/planner.html" 
          class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isPlanner ? activeClass : defaultClass}">
          <svg class="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Daily Planner</span>
        </a>

        <!-- Home Page -->
        <a href="/index.html" 
          class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${defaultClass}">
          <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home Page</span>
        </a>
      </nav>
    </div>

    <!-- Sidebar Bottom Profile Section -->
    <div class="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex flex-col space-y-2">
      <button id="side-btn-profile" onclick="switchDashboardTab('profile'); toggleUserSidebar(false);" 
        class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white w-full text-xs font-semibold ${isDashboard && activeTab === 'profile' ? activeClass : 'text-neutral-600 dark:text-neutral-400'}">
        <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>My Profile</span>
      </button>
      <button onclick="logoutUser()" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 w-full text-xs font-semibold">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>`;
})();
