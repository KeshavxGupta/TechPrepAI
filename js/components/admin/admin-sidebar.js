(function() {
  const container = document.getElementById('component-admin-sidebar');
  if (!container) return;

  container.outerHTML = `
  <!-- Mobile Overlay Backdrop -->
  <div id="admin-sidebar-overlay" onclick="toggleAdminSidebar()" class="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-30 hidden lg:hidden"></div>

  <!-- Left Sidebar -->
  <aside id="admin-sidebar" class="fixed lg:sticky top-0 left-0 z-40 w-64 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 subtle-glass flex flex-col justify-between p-5 transition-transform duration-300 -translate-x-full lg:translate-x-0 shrink-0">
    <div class="space-y-6">
      <!-- Logo -->
      <div class="flex items-center justify-between">
        <a href="/index.html" class="flex items-center space-x-2.5 group">
          <div class="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
            TP
          </div>
          <span class="font-bold text-base tracking-tight font-sans text-neutral-900 dark:text-white">TechPrep <span class="text-blue-600 dark:text-blue-500 font-bold">AI</span></span>
        </a>
        <button onclick="toggleAdminSidebar()" class="lg:hidden text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1.5 flex flex-col text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        <button id="side-btn-quizzes" onclick="handleAdminSidebarNav('quizzes')" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Quiz Management</span>
        </button>
        <button id="side-btn-placements" onclick="handleAdminSidebarNav('placements')" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <span>Placement Drives</span>
        </button>
        <button id="side-btn-users" onclick="handleAdminSidebarNav('users')" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <span>User Management</span>
        </button>
        <button id="side-btn-site-mgmt" onclick="handleAdminSidebarNav('site-mgmt')" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.595 15.12a2 2 0 00-1.802.72L2.53 17.472A2 2 0 004.095 20.6h15.81a2 2 0 001.565-3.128l-1.264-1.633zM12 4a4 4 0 100 8 4 4 0 000-8z" />
          </svg>
          <span>Site Management</span>
        </button>
        <a href="/pages/admin/admin-dsa.html" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          <span>DSA Problem Studio</span>
        </a>
        <a href="/pages/admin/admin-resume-studio.html" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Resume Studio</span>
        </a>
        <a href="/index.html" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
          <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home Page</span>
        </a>
      </nav>
    </div>

    <!-- Sidebar Bottom Profile Section -->
    <div class="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex flex-col space-y-2">
      <button id="side-btn-profile" onclick="handleAdminSidebarNav('profile')" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>Admin Profile</span>
      </button>
      <button onclick="logoutUser()" class="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 w-full text-xs font-semibold">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </aside>`;

  window.handleAdminSidebarNav = function(tabName) {
    const isHub = window.location.pathname.includes('admin-hub') || window.location.pathname.endsWith('admin') || window.location.pathname.endsWith('admin/');
    if (isHub && typeof window.switchAdminTab === 'function') {
      window.switchAdminTab(tabName);
    } else {
      window.location.href = `/pages/admin/admin-hub.html?tab=${tabName}`;
    }
    if (typeof window.toggleAdminSidebar === 'function') {
      window.toggleAdminSidebar(false);
    }
  };
})();
