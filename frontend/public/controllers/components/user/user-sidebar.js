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

window.switchDashboardTab = function(tabName) {
  const isDashboard = window.location.pathname.includes('dashboard');
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
    } else if (tabName === 'quizzes' && typeof loadStudentPortal === 'function') {
      loadStudentPortal();
    }

    if (window.history && window.history.pushState) {
      const newUrl = window.location.pathname + '?tab=' + tabName;
      window.history.pushState({ tab: tabName }, '', newUrl);
    }
  } else {
    const isSub = window.location.pathname.includes('/pages/');
    window.location.href = isSub ? `../user/dashboard.html?tab=${tabName}` : `pages/user/dashboard.html?tab=${tabName}`;
  }
};
