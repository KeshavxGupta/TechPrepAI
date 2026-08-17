/* Safe LocalStorage Helper Utility */
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn('Storage read error:', e);
      return defaultValue;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage write error:', e);
      return false;
    }
  },
  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('Storage remove error:', e);
    }
  }
};

function getThemeStorageKey() {
  const currentUser = storage.get('techprep_current_user', null);
  return currentUser ? `techprep_theme_${currentUser.email}` : 'techprep_theme';
}

function getChecklistStorageKey() {
  const currentUser = storage.get('techprep_current_user', null);
  return currentUser ? `techprep_study_checklist_${currentUser.email}` : 'techprep_study_checklist_guest';
}

// Beautiful Custom Alert and Confirm Dialog System
window.customAlert = function(title, message, type = 'info') {
  return new Promise((resolve) => {
    // Remove existing modal if any
    const existing = document.getElementById('custom-alert-modal');
    if (existing) existing.remove();

    // Icon mapping
    let iconColor = 'text-blue-500 bg-blue-500/10';
    let iconSvg = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    if (type === 'error') {
      iconColor = 'text-rose-500 bg-rose-500/10';
      iconSvg = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
    } else if (type === 'success') {
      iconColor = 'text-emerald-500 bg-emerald-500/10';
      iconSvg = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`;
    } else if (type === 'warning') {
      iconColor = 'text-amber-500 bg-amber-500/10';
      iconSvg = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>`;
    }

    const modal = document.createElement('div');
    modal.id = 'custom-alert-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in';
    modal.innerHTML = `
      <div class="w-full max-w-sm bg-surface-elevated border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl shadow-2xl p-6 text-left animate-modal-scale-in">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconColor}">
            ${iconSvg}
          </div>
          <h3 class="text-sm font-extrabold text-neutral-900 dark:text-white leading-snug">${title}</h3>
        </div>
        <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">${message}</p>
        <div class="flex justify-end">
          <button id="custom-alert-ok-btn" class="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors">
            OK
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('custom-alert-ok-btn').focus();

    document.getElementById('custom-alert-ok-btn').addEventListener('click', () => {
      modal.remove();
      resolve(true);
    });
  });
};

window.customConfirm = function(title, message) {
  return new Promise((resolve) => {
    // Remove existing modal if any
    const existing = document.getElementById('custom-confirm-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'custom-confirm-modal';
    modal.className = 'fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in';
    modal.innerHTML = `
      <div class="w-full max-w-sm bg-surface-elevated border border-neutral-200/80 dark:border-neutral-800/80 rounded-xl shadow-2xl p-6 text-left animate-modal-scale-in">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 class="text-sm font-extrabold text-neutral-900 dark:text-white leading-snug">${title}</h3>
        </div>
        <p class="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">${message}</p>
        <div class="flex justify-end space-x-3">
          <button id="custom-confirm-cancel-btn" class="px-4 py-2.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            Cancel
          </button>
          <button id="custom-confirm-yes-btn" class="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors">
            Confirm
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('custom-confirm-cancel-btn').focus();

    document.getElementById('custom-confirm-cancel-btn').addEventListener('click', () => {
      modal.remove();
      resolve(false);
    });

    document.getElementById('custom-confirm-yes-btn').addEventListener('click', () => {
      modal.remove();
      resolve(true);
    });
  });
};

/* ==========================================================================
   1. Theme Engine (Light / System / Dark)
   ========================================================================== */
function initThemeEngine() {
  const themeSelects = document.querySelectorAll('.theme-select');
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem(getThemeStorageKey()) || 'system';

  function applyTheme(theme) {
    let isDark = false;
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    themeSelects.forEach(select => {
      select.value = theme;
    });
  }

  applyTheme(storedTheme);

  themeSelects.forEach(select => {
    select.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      localStorage.setItem(getThemeStorageKey(), selectedTheme);
      applyTheme(selectedTheme);
    });
  });

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentlyDark = document.documentElement.classList.contains('dark');
      const nextTheme = currentlyDark ? 'light' : 'dark';
      localStorage.setItem(getThemeStorageKey(), nextTheme);
      applyTheme(nextTheme);
    });
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem(getThemeStorageKey()) || 'system';
    if (currentTheme === 'system') {
      applyTheme('system');
    }
  });
}

/* ==========================================================================
   2. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu() {
    mobileMenu.classList.toggle('hidden');
  }

  toggleBtn.addEventListener('click', toggleMenu);
  if (closeBtn) closeBtn.addEventListener('click', toggleMenu);

  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   3. Interactive Product Demo Tabs Switcher
   ========================================================================== */
function initDemoTabs() {
  const tabBtns = document.querySelectorAll('.demo-tab-btn');
  const tabPanels = document.querySelectorAll('.demo-tab-panel');

  if (!tabBtns.length || !tabPanels.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => {
        if (b.getAttribute('data-tab') === targetTab) {
          b.className = 'demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-sm';
        } else {
          b.className = 'demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50';
        }
      });

      tabPanels.forEach(panel => {
        if (panel.id === `demo-panel-${targetTab}`) {
          panel.classList.remove('hidden');
          panel.classList.add('block');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('block');
        }
      });
    });
  });
}

/* ==========================================================================
   4. Today's Study Plan Checklist (Hero Dashboard)
   ========================================================================== */
function initStudyPlanChecklist() {
  const checklistItems = document.querySelectorAll('.study-item-checkbox');
  const prepScoreVal = document.getElementById('hero-prep-score') || document.getElementById('dashboard-prep-score');
  const solvedCountVal = document.getElementById('hero-solved-count') || document.getElementById('dashboard-solved-count');

  if (!checklistItems.length) return;

  const savedChecklist = storage.get(getChecklistStorageKey(), []);
  let baseSolved = 274;

  checklistItems.forEach((box, idx) => {
    if (savedChecklist.includes(idx)) {
      box.checked = true;
      const parentRow = box.closest('.study-item-row');
      if (parentRow) parentRow.classList.add('line-through', 'opacity-50');
    }
  });

  function updateMetrics() {
    const checkedCount = document.querySelectorAll('.study-item-checkbox:checked').length;
    if (prepScoreVal) {
      const newScore = 88 + (checkedCount * 3);
      prepScoreVal.textContent = Math.min(newScore, 100);
    }
    if (solvedCountVal) {
      solvedCountVal.textContent = baseSolved + checkedCount;
    }
  }

  updateMetrics();

  checklistItems.forEach((box, idx) => {
    box.addEventListener('change', () => {
      const parentRow = box.closest('.study-item-row');
      if (box.checked) {
        if (parentRow) parentRow.classList.add('line-through', 'opacity-50');
      } else {
        if (parentRow) parentRow.classList.remove('line-through', 'opacity-50');
      }

      const checkedIndexes = [];
      checklistItems.forEach((cb, i) => {
        if (cb.checked) checkedIndexes.push(i);
      });
      storage.set(getChecklistStorageKey(), checkedIndexes);

      updateMetrics();
    });
  });
}

/* ==========================================================================
   5. Accessible FAQ Accordion Controller
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      accordionItems.forEach(other => {
        other.classList.remove('active');
        const otherHeader = other.querySelector('.accordion-header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initMobileMenu();
  initDemoTabs();
  initStudyPlanChecklist();
  initFaqAccordion();
});



