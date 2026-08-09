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

document.addEventListener('DOMContentLoaded', () => {
  initThemeEngine();
  initMobileMenu();
  initDemoTabs();
  initStudyPlanChecklist();
  initDsaCodeRunner();
  initAtsResumeScanner();
  initPlacementTracker();
  initFaqAccordion();
  initAuthModals();
  initCareerPipeline();
  initAuthSystem();
});

/* ==========================================================================
   1. Theme Engine (Light / System / Dark)
   ========================================================================== */
function initThemeEngine() {
  const themeSelects = document.querySelectorAll('.theme-select');
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('techprep_theme') || 'system';

  function applyTheme(theme) {
    let isDark = false;
    if (theme === 'dark') {
      isDark = true;
    } else if (theme === 'light') {
      isDark = false;
    } else {
      // System mode
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Sync select dropdown elements
    themeSelects.forEach(select => {
      select.value = theme;
    });
  }

  // Initial call
  applyTheme(storedTheme);

  // Add event listeners to theme dropdown selectors
  themeSelects.forEach(select => {
    select.addEventListener('change', (e) => {
      const selectedTheme = e.target.value;
      localStorage.setItem('techprep_theme', selectedTheme);
      applyTheme(selectedTheme);
    });
  });

  // Add event listeners to theme toggle buttons (Sun / Moon icon button)
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentlyDark = document.documentElement.classList.contains('dark');
      const nextTheme = currentlyDark ? 'light' : 'dark';
      localStorage.setItem('techprep_theme', nextTheme);
      applyTheme(nextTheme);
    });
  });

  // Listen to OS system color scheme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const currentTheme = localStorage.getItem('techprep_theme') || 'system';
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

  // Close menu when clicking links
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

      // Update button active state
      tabBtns.forEach(b => {
        if (b.getAttribute('data-tab') === targetTab) {
          b.className = 'demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm';
        } else {
          b.className = 'demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50';
        }
      });

      // Update panel visibility
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

  const savedChecklist = storage.get('techprep_study_checklist', []);
  let baseSolved = 274;

  // Restore saved state
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

  // Initial calculation
  updateMetrics();

  checklistItems.forEach((box, idx) => {
    box.addEventListener('change', () => {
      const parentRow = box.closest('.study-item-row');
      if (box.checked) {
        if (parentRow) parentRow.classList.add('line-through', 'opacity-50');
      } else {
        if (parentRow) parentRow.classList.remove('line-through', 'opacity-50');
      }

      // Save state array of checked indexes
      const checkedIndexes = [];
      checklistItems.forEach((cb, i) => {
        if (cb.checked) checkedIndexes.push(i);
      });
      storage.set('techprep_study_checklist', checkedIndexes);

      updateMetrics();
    });
  });
}

/* ==========================================================================
   5. Interactive DSA Code Workspace Simulator
   ========================================================================== */
const sampleCodeSnippets = {
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.count(complement)) {
                return {mp[complement], i};
            }
            mp[nums[i]] = i;
        }
        return {};
    }
};`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        hash_map = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in hash_map:
                return [hash_map[complement], i]
            hash_map[num] = i
        return []`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }
}`,
  javascript: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
};

function initDsaCodeRunner() {
  const langSelect = document.getElementById('code-lang-select');
  const codeEditorTextarea = document.getElementById('code-editor-textarea');
  const runBtn = document.getElementById('run-code-btn');
  const consoleOutput = document.getElementById('code-console-output');

  if (!langSelect || !codeEditorTextarea || !runBtn || !consoleOutput) return;

  // Language Change Listener
  langSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    if (sampleCodeSnippets[lang]) {
      codeEditorTextarea.value = sampleCodeSnippets[lang];
    }
  });

  // Run Code Execution Simulator
  runBtn.addEventListener('click', () => {
    runBtn.disabled = true;
    runBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Compiling...
    `;

    consoleOutput.innerHTML = `
      <div class="text-neutral-400 font-mono text-xs animate-pulse">
        > Compiling solution with optimization flags (-O3)...
        > Executing Test Suite: 3/3 Cases...
      </div>
    `;

    setTimeout(() => {
      runBtn.disabled = false;
      runBtn.innerHTML = `
        <svg class="w-4 h-4 mr-1.5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Run Code
      `;

      consoleOutput.innerHTML = `
        <div class="space-y-2 font-mono text-xs">
          <div class="flex items-center text-emerald-500 font-semibold">
            <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            STATUS: ACCEPTED (Passed 3/3 Testcases)
          </div>
          <div class="grid grid-cols-3 gap-2 text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-900/60 p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
            <div><span class="text-neutral-400 block text-[10px]">RUNTIME</span> <strong class="text-neutral-900 dark:text-neutral-200">12 ms</strong> (Beats 94.8%)</div>
            <div><span class="text-neutral-400 block text-[10px]">MEMORY</span> <strong class="text-neutral-900 dark:text-neutral-200">14.2 MB</strong> (Beats 91.2%)</div>
            <div><span class="text-neutral-400 block text-[10px]">COMPLEXITY</span> <strong class="text-blue-500">O(N) Time, O(N) Space</strong></div>
          </div>
          <div class="text-neutral-600 dark:text-neutral-400 pt-1">
            <span class="text-neutral-400">Testcase 1:</span> nums = [2,7,11,15], target = 9 &rarr; <span class="text-emerald-500 font-semibold">[0,1]</span> (Expected: [0,1])<br>
            <span class="text-neutral-400">Testcase 2:</span> nums = [3,2,4], target = 6 &rarr; <span class="text-emerald-500 font-semibold">[1,2]</span> (Expected: [1,2])<br>
            <span class="text-neutral-400">Testcase 3:</span> nums = [3,3], target = 6 &rarr; <span class="text-emerald-500 font-semibold">[0,1]</span> (Expected: [0,1])
          </div>
        </div>
      `;
    }, 900);
  });
}

/* ==========================================================================
   6. Interactive ATS Resume Scanner Simulator
   ========================================================================== */
function initAtsResumeScanner() {
  const resumeInput = document.getElementById('ats-resume-input');
  const analyzeBtn = document.getElementById('ats-analyze-btn');
  const scoreBadge = document.getElementById('ats-score-badge');
  const scoreProgress = document.getElementById('ats-score-progress');
  const matchVerdict = document.getElementById('ats-match-verdict');
  const keywordsContainer = document.getElementById('ats-keywords-container');

  if (!resumeInput || !analyzeBtn) return;

  const sampleKeywords = [
    { name: 'Data Structures & Algorithms', found: true },
    { name: 'System Design & Scalability', found: true },
    { name: 'React / Next.js', found: true },
    { name: 'REST & GraphQL APIs', found: true },
    { name: 'PostgreSQL / SQL Optimization', found: true },
    { name: 'Docker & Kubernetes', found: false },
    { name: 'CI/CD Pipelines (GitHub Actions)', found: false },
    { name: 'Redis Caching', found: false }
  ];

  analyzeBtn.addEventListener('click', () => {
    const text = resumeInput.value.trim();
    if (!text) {
      alert('Please paste your resume text to scan.');
      return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `Scanning ATS Parser...`;

    setTimeout(() => {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `
        <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Re-Scan Resume ATS Score
      `;

      // Calculate pseudo score based on length and keywords present
      let score = 85;
      if (text.toLowerCase().includes('docker')) score += 5;
      if (text.toLowerCase().includes('redis')) score += 4;
      if (text.toLowerCase().includes('algorithm')) score += 3;
      score = Math.min(score, 96);

      if (scoreBadge) scoreBadge.textContent = `${score}%`;
      if (scoreProgress) scoreProgress.style.width = `${score}%`;
      if (matchVerdict) {
        matchVerdict.textContent = score >= 90 ? 'Tier-1 Tech Ready' : 'Strong Placement Match';
      }

      if (keywordsContainer) {
        keywordsContainer.innerHTML = sampleKeywords.map(kw => `
          <span class="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${
            kw.found 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }">
            <svg class="w-3 h-3 mr-1 ${kw.found ? 'text-emerald-500' : 'text-rose-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${kw.found 
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>' 
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
              }
            </svg>
            ${kw.name}
          </span>
        `).join('');
      }
    }, 700);
  });
}



/* ==========================================================================
   8. Interactive Placement Tracker Filter & Search
   ========================================================================== */
function initPlacementTracker() {
  const searchInput = document.getElementById('placement-search-input');
  const filterBtns = document.querySelectorAll('.placement-filter-btn');
  const tableRows = document.querySelectorAll('.placement-table-row');

  if (!tableRows.length) return;

  let currentStatusFilter = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    tableRows.forEach(row => {
      const company = row.getAttribute('data-company')?.toLowerCase() || '';
      const role = row.getAttribute('data-role')?.toLowerCase() || '';
      const status = row.getAttribute('data-status')?.toLowerCase() || '';

      const matchesSearch = company.includes(query) || role.includes(query);
      const matchesStatus = (currentStatusFilter === 'all') || (status === currentStatusFilter);

      if (matchesSearch && matchesStatus) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStatusFilter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        if (b.getAttribute('data-filter') === currentStatusFilter) {
          b.className = 'placement-filter-btn px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 transition-all';
        } else {
          b.className = 'placement-filter-btn px-3 py-1.5 text-xs font-medium rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all';
        }
      });

      applyFilters();
    });
  });
}

/* ==========================================================================
   9. Accessible FAQ Accordion Controller
   ========================================================================== */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      accordionItems.forEach(other => {
        other.classList.remove('active');
        const otherHeader = other.querySelector('.accordion-header');
        if (otherHeader) otherHeader.setAttribute('aria-expanded', 'false');
      });

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   10. Interactive Auth Modals (Login & Signup)
   ========================================================================== */
function initAuthModals() {
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const loginTriggers = document.querySelectorAll('.open-login-modal');
  const signupTriggers = document.querySelectorAll('.open-signup-modal');
  const closeBtns = document.querySelectorAll('.close-modal-btn');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  loginTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(signupModal);
      openModal(loginModal);
    });
  });

  signupTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(loginModal);
      openModal(signupModal);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(loginModal);
      closeModal(signupModal);
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', () => {
      closeModal(loginModal);
      closeModal(signupModal);
    });
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(loginModal);
      closeModal(signupModal);
    }
  });
}

/* ==========================================================================
   11. Career Pipeline Step Selector
   ========================================================================== */
function initCareerPipeline() {
  const pipelineSteps = document.querySelectorAll('.pipeline-step-card');
  const stepTitle = document.getElementById('pipeline-detail-title');
  const stepDesc = document.getElementById('pipeline-detail-desc');
  const stepMetrics = document.getElementById('pipeline-detail-metrics');

  if (!pipelineSteps.length || !stepTitle) return;

  const pipelineData = {
    learn: {
      title: '1. Learn: Core CS & System Fundamentals',
      desc: 'Master Computer Science core subjects (OS, DBMS, Computer Networks, System Design) through curated bite-sized modules and video walkthroughs tailored for interviews.',
      metrics: ['120+ Micro Modules', 'System Design Checklists', 'SQL & OS Interview Sheets']
    },
    practice: {
      title: '2. Practice: Curated DSA Roadmaps',
      desc: 'Solve patterns instead of random problems. Access Striver SDE sheet, NeetCode 150, and company-specific DSA tags with real time/space complexity analysis.',
      metrics: ['350+ Curated Problems', 'Instant Code Judge', 'Pattern-Based Learning']
    },
    build: {
      title: '3. Build: Production-Grade Portfolio Projects',
      desc: 'Construct high-impact full-stack and machine learning projects with real architecture diagrams, deployment pipelines, and GitHub README templates.',
      metrics: ['Full Stack & AI Projects', 'Architecture Specs', 'Docker & Cloud Deployment']
    },
    resume: {
      title: '4. Resume: AI Resume Designer & ATS Scoring',
      desc: 'Design ATS-compliant engineering resumes with modern single-column templates, live formatting validation, and instant keyword density match scoring.',
      metrics: ['Visual Resume Designer', '95+ ATS Pass Rate', 'LaTeX & PDF Export']
    },
    apply: {
      title: '5. Apply: Intelligent Placement Tracker',
      desc: 'Organize placement applications across Tier-1 Tech, Unicorn Startups, and On-Campus drives with eligibility filters, package details (LPA), and interview dates.',
      metrics: ['Company Criteria Database', 'Application Reminders', 'Referral Tracker']
    },
    placement: {
      title: '6. Placement: Offer Negotiation & Onboarding',
      desc: 'Evaluate multiple compensation offers (Base vs ESOPs vs Joining Bonus), access alumni compensation benchmarks, and prepare for onboarding.',
      metrics: ['Salary Benchmark Database', 'Offer Comparison Engine', 'Alumni Placement Network']
    }
  };

  pipelineSteps.forEach(card => {
    card.addEventListener('click', () => {
      const stepKey = card.getAttribute('data-step');
      if (pipelineData[stepKey]) {
        // Highlight active card
        pipelineSteps.forEach(c => {
          c.className = 'pipeline-step-card p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/50 cursor-pointer transition-all';
        });
        card.className = 'pipeline-step-card p-4 rounded-xl border border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 cursor-pointer transition-all shadow-sm';

        // Update info box
        stepTitle.textContent = pipelineData[stepKey].title;
        stepDesc.textContent = pipelineData[stepKey].desc;

        if (stepMetrics) {
          stepMetrics.innerHTML = pipelineData[stepKey].metrics.map(m => `
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
              ✓ ${m}
            </span>
          `).join('');
        }
      }
    });
  });
}

/* ==========================================================================
   12. Complete LocalStorage Authentication System (Signup, Login & User Session)
   ========================================================================== */
function initAuthSystem() {
  const USERS_STORAGE_KEY = 'techprep_registered_users';
  const CURRENT_USER_KEY = 'techprep_current_user';

  // Seed default demo user if empty
  let registeredUsers = storage.get(USERS_STORAGE_KEY, null);
  if (!registeredUsers) {
    registeredUsers = [
      {
        name: 'Aarav Sharma',
        email: 'student@college.edu',
        password: 'password123',
        createdAt: new Date().toISOString()
      }
    ];
    storage.set(USERS_STORAGE_KEY, registeredUsers);
  }

  // Helper to show inline form feedback
  function showAuthFeedback(elementId, message, isError = true) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden', 'bg-rose-500/10', 'text-rose-600', 'border-rose-500/20', 'bg-emerald-500/10', 'text-emerald-600', 'border-emerald-500/20');
    
    if (isError) {
      el.classList.add('bg-rose-500/10', 'text-rose-600', 'dark:text-rose-400', 'border', 'border-rose-500/20');
    } else {
      el.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400', 'border', 'border-emerald-500/20');
    }
  }

  // Update UI if User is Logged In
  const currentUser = storage.get(CURRENT_USER_KEY, null);
  const welcomeUserEl = document.getElementById('welcome-user-name');
  const userDisplayNameEl = document.getElementById('user-display-name');
  const userInitialsEl = document.getElementById('user-avatar-initials');
  const logoutBtn = document.getElementById('dashboard-logout-btn');

  if (currentUser) {
    if (welcomeUserEl) welcomeUserEl.textContent = currentUser.name;
    if (userDisplayNameEl) userDisplayNameEl.textContent = currentUser.name;
    if (userInitialsEl && currentUser.name) {
      const names = currentUser.name.trim().split(' ');
      const initials = names.length > 1 
        ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
      userInitialsEl.textContent = initials;
    }
  }

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      storage.remove(CURRENT_USER_KEY);
      window.location.href = 'index.html';
    });
  }

  // Standalone Signup Form Handler
  const standaloneSignupForm = document.getElementById('standalone-signup-form');
  if (standaloneSignupForm) {
    standaloneSignupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const passwordInput = document.getElementById('signup-password');
      const confirmPasswordInput = document.getElementById('signup-confirm-password');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
      const password = passwordInput ? passwordInput.value : '';
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

      if (!name || !email || !password) {
        showAuthFeedback('signup-error-msg', 'Please fill in all required fields.');
        return;
      }

      if (confirmPasswordInput && password !== confirmPassword) {
        showAuthFeedback('signup-error-msg', 'Passwords do not match. Please re-enter passwords.');
        return;
      }

      if (password.length < 6) {
        showAuthFeedback('signup-error-msg', 'Password must be at least 6 characters long.');
        return;
      }

      // Check if email already registered
      const existingUsers = storage.get(USERS_STORAGE_KEY, []);
      if (existingUsers.some(u => u.email === email)) {
        showAuthFeedback('signup-error-msg', 'An account with this email is already registered. Please log in.');
        return;
      }

      // Register new user
      const newUser = { name, email, password, createdAt: new Date().toISOString() };
      existingUsers.push(newUser);
      storage.set(USERS_STORAGE_KEY, existingUsers);

      // Set active session
      storage.set(CURRENT_USER_KEY, { name, email, loggedInAt: new Date().toISOString() });

      showAuthFeedback('signup-error-msg', 'Account created successfully! Launching dashboard...', false);

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 700);
    });
  }

  // Standalone Login Form Handler
  const standaloneLoginForm = document.getElementById('standalone-login-form');
  if (standaloneLoginForm) {
    standaloneLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');

      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        showAuthFeedback('login-error-msg', 'Please enter your email and password.');
        return;
      }

      const users = storage.get(USERS_STORAGE_KEY, []);
      const matchedUser = users.find(u => u.email === email && u.password === password);

      if (matchedUser) {
        storage.set(CURRENT_USER_KEY, { name: matchedUser.name, email: matchedUser.email, loggedInAt: new Date().toISOString() });
        showAuthFeedback('login-error-msg', 'Login successful! Redirecting to dashboard...', false);
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 600);
      } else {
        showAuthFeedback('login-error-msg', 'Invalid email or password. Please check your credentials or create an account.');
      }
    });
  }

  // Modal Login & Signup Handlers (if present in index.html)
  const loginModalForm = document.querySelector('#login-modal form');
  if (loginModalForm) {
    loginModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = loginModalForm.querySelectorAll('input');
      const email = inputs[0] ? inputs[0].value.trim().toLowerCase() : '';
      const password = inputs[1] ? inputs[1].value : '';

      const users = storage.get(USERS_STORAGE_KEY, []);
      const matchedUser = users.find(u => u.email === email && u.password === password);

      if (matchedUser) {
        storage.set(CURRENT_USER_KEY, { name: matchedUser.name, email: matchedUser.email, loggedInAt: new Date().toISOString() });
        window.location.href = 'dashboard.html';
      } else {
        // Fallback demo login if matching form
        const userName = email.split('@')[0] || 'Student';
        const nameCap = userName.charAt(0).toUpperCase() + userName.slice(1);
        storage.set(CURRENT_USER_KEY, { name: nameCap, email: email, loggedInAt: new Date().toISOString() });
        window.location.href = 'dashboard.html';
      }
    });
  }

  const signupModalForm = document.querySelector('#signup-modal form');
  if (signupModalForm) {
    signupModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = signupModalForm.querySelectorAll('input');
      const name = inputs[0] ? inputs[0].value.trim() : 'Student';
      const email = inputs[1] ? inputs[1].value.trim().toLowerCase() : '';
      const password = inputs[2] ? inputs[2].value : '';

      if (name && email && password) {
        const users = storage.get(USERS_STORAGE_KEY, []);
        users.push({ name, email, password, createdAt: new Date().toISOString() });
        storage.set(USERS_STORAGE_KEY, users);
        storage.set(CURRENT_USER_KEY, { name, email, loggedInAt: new Date().toISOString() });
        window.location.href = 'dashboard.html';
      }
    });
  }
}

