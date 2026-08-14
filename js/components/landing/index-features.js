(function() {
  const container = document.getElementById('component-index-features');
  if (!container) return;

  container.outerHTML = `
  <section id="features" class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="text-center max-w-3xl mx-auto space-y-4 mb-12">
        <h2 class="text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase">
          Platform Features & Tools
        </h2>
        <p class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          The Complete Engineering Placement Pipeline
        </p>
        <p class="text-base text-neutral-600 dark:text-neutral-400">
          A clear, step-by-step roadmap from college fundamentals to signing your dream tech offer.
        </p>
        <div class="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-medium">
          <a href="#dsa-section" class="px-3 py-1 rounded-full bg-surface-elevated border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            DSA IDE Workspace
          </a>
          <a href="#resume-section" class="px-3 py-1 rounded-full bg-surface-elevated border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
            AI Resume Designer & ATS Scoring
          </a>
          <a href="#placement-section" class="px-3 py-1 rounded-full bg-surface-elevated border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Campus Placement Tracker
          </a>
          <a href="#about" class="px-3 py-1 rounded-full bg-surface-elevated border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Skill Gap Analytics Radar
          </a>
        </div>
      </div>

      <!-- Horizontal Steps Grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div data-step="learn"
          class="pipeline-step-card p-3.5 rounded-xl border border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 cursor-pointer transition-all">
          <div class="text-xs font-mono font-bold text-blue-500">STEP 1</div>
          <div class="text-sm font-bold text-neutral-900 dark:text-white mt-1">Learn</div>
          <div class="text-[11px] text-neutral-500 mt-1">Core CS & OS</div>
        </div>

        <div data-step="practice"
          class="pipeline-step-card p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/50 cursor-pointer transition-all">
          <div class="text-xs font-mono font-bold text-neutral-500">STEP 2</div>
          <div class="text-sm font-bold text-neutral-900 dark:text-white mt-1">Practice</div>
          <div class="text-[11px] text-neutral-500 mt-1">DSA Roadmaps</div>
        </div>

        <div data-step="build"
          class="pipeline-step-card p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/50 cursor-pointer transition-all">
          <div class="text-xs font-mono font-bold text-neutral-500">STEP 3</div>
          <div class="text-sm font-bold text-neutral-900 dark:text-white mt-1">Build</div>
          <div class="text-[11px] text-neutral-500 mt-1">Full-Stack Projects</div>
        </div>

        <div data-step="resume"
          class="pipeline-step-card p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/50 cursor-pointer transition-all">
          <div class="text-xs font-mono font-bold text-neutral-500">STEP 4</div>
          <div class="text-sm font-bold text-neutral-900 dark:text-white mt-1">Resume</div>
          <div class="text-[11px] text-neutral-500 mt-1">AI ATS Optimization</div>
        </div>

        <div data-step="apply"
          class="pipeline-step-card p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/50 cursor-pointer transition-all">
          <div class="text-xs font-mono font-bold text-neutral-500">STEP 5</div>
          <div class="text-sm font-bold text-neutral-900 dark:text-white mt-1">Apply</div>
          <div class="text-[11px] text-neutral-500 mt-1">Drive Tracker</div>
        </div>

        <div data-step="placement"
          class="pipeline-step-card p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/50 cursor-pointer transition-all">
          <div class="text-xs font-mono font-bold text-neutral-500">STEP 6</div>
          <div class="text-sm font-bold text-neutral-900 dark:text-white mt-1">Placement</div>
          <div class="text-[11px] text-neutral-500 mt-1">Offer & Onboard</div>
        </div>
      </div>

      <!-- Pipeline Detail Info Card -->
      <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4">
        <h3 id="pipeline-detail-title" class="text-lg font-bold text-neutral-900 dark:text-white">1. Learn: Core CS &
          System Fundamentals</h3>
        <p id="pipeline-detail-desc" class="text-sm text-neutral-600 dark:text-neutral-400">Master Computer Science core
          subjects (Operating Systems, DBMS, Computer Networks, System Design) through curated bite-sized modules and
          video walkthroughs tailored for interviews.</p>
        <div id="pipeline-detail-metrics" class="flex flex-wrap gap-2 pt-2">
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
            120+ Micro Modules</span>
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
            System Design Checklists</span>
          <span
            class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
            SQL & OS Interview Sheets</span>
        </div>
      </div>

    </div>
  </section>

  <!-- FEATURE 1: AI RESUME DESIGNER & ATS SCORING -->
  <section id="resume-section"
    class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- Copy Column -->
        <div class="lg:col-span-5 space-y-5 text-left">
          <div
            class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            01 / RESUME DESIGNER & ATS SCORING
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            AI Resume Designer & Real-Time ATS Scoring
          </h2>
          <p class="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Generic resumes get rejected by automated recruiters. TechPrep AI provides a visual Resume Designer with single-column templates, live formatting checks, role-matched keyword suggestions, and instant ATS score benchmarks.
          </p>
          <ul class="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Visual Resume Designer</strong>: Clean single-column templates engineered for Workday, Greenhouse, and Lever recruiters.</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>Real-Time ATS Scoring</strong>: Instant match calculation and keyword density audit against target SDE job descriptions.</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span><strong>One-Click PDF & LaTeX Export</strong>: Export clean, error-free resumes preferred by MAANG technical screeners.</span>
            </li>
          </ul>
        </div>

        <!-- Interface Visual Column -->
        <div class="lg:col-span-7">
          <div
            class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-lg space-y-4">
            <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-rose-500"></div>
                <div class="w-3 h-3 rounded-full bg-amber-500"></div>
                <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span class="font-mono text-xs text-neutral-500 ml-2">techprep_ats_engine.py</span>
              </div>
              <span class="text-xs font-mono text-emerald-500 font-bold">MATCH: 94.2%</span>
            </div>

            <!-- Dashboard Mock Inside Card -->
            <div class="grid grid-cols-2 gap-3 text-xs">
              <div class="p-3 rounded bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
                <div class="text-neutral-500">Target Role</div>
                <div class="font-bold text-neutral-900 dark:text-white mt-1">Backend Engineer (SDE-1)</div>
              </div>
              <div class="p-3 rounded bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
                <div class="text-neutral-500">ATS Parsing Index</div>
                <div class="font-bold text-emerald-600 dark:text-emerald-400 mt-1">Passed (0 Format Errors)</div>
              </div>
            </div>

            <div
              class="p-3 rounded bg-surface-secondary border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
              <div class="font-semibold text-neutral-900 dark:text-white">RECOMMENDED KEYWORD INSERTIONS</div>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-mono text-[11px]">+ System
                  Design</span>
                <span class="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-mono text-[11px]">+ Distributed
                  Caching</span>
                <span class="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-mono text-[11px]">+
                  Microservices</span>
                <span class="px-2 py-1 rounded bg-blue-500/10 text-blue-500 font-mono text-[11px]">+ CI/CD
                  Automation</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- FEATURE 2: DSA + CODE WORKSPACE -->
  <section id="dsa-section"
    class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- Interface Visual Column (Left for Asymmetry) -->
        <div class="lg:col-span-7 order-2 lg:order-1">
          <div
            class="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 p-5 text-neutral-100 font-mono text-xs space-y-4 shadow-xl">
            <div class="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div class="flex items-center space-x-2">
                <span class="px-2 py-0.5 rounded bg-blue-600 text-white font-bold">C++20</span>
                <span class="text-neutral-400">Problem: Merge K Sorted Lists (Hard)</span>
              </div>
              <span class="text-emerald-400 font-bold">Passed (45/45 Testcases)</span>
            </div>

            <div class="text-neutral-300 leading-relaxed font-mono">
              <span class="token-keyword">struct</span> <span class="token-type">Compare</span> {<br>
              &nbsp;&nbsp;<span class="token-keyword">bool</span> <span
                class="token-function">operator()</span>(ListNode* a, ListNode* b) {<br>
              &nbsp;&nbsp;&nbsp;&nbsp;<span class="token-keyword">return</span> a-&gt;val &gt; b-&gt;val;<br>
              &nbsp;&nbsp;}<br>
              };
            </div>

            <div
              class="p-3 rounded bg-neutral-900 border border-neutral-800 grid grid-cols-3 gap-2 text-center text-[11px]">
              <div><span class="text-neutral-500 block">TIME COMPLEXITY</span> <strong class="text-emerald-400">O(N log
                  K)</strong></div>
              <div><span class="text-neutral-500 block">SPACE COMPLEXITY</span> <strong
                  class="text-emerald-400">O(K)</strong></div>
              <div><span class="text-neutral-500 block">PERCENTILE</span> <strong class="text-blue-400">Beats
                  98.4%</strong></div>
            </div>
          </div>
        </div>

        <!-- Copy Column -->
        <div class="lg:col-span-5 order-1 lg:order-2 space-y-5 text-left">
          <div
            class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            02 / DSA WORKSPACE
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Curated Problem Sheets, Not Endless Grinding
          </h2>
          <p class="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Stop wasting time solving 1,500 random problems. TechPrep AI curates the essential 350 Data Structures &
            Algorithms patterns tested in Tier-1 technical interviews.
          </p>
          <ul class="space-y-3 text-sm text-neutral-700 dark:text-neutral-300">
            <li class="flex items-start">
              <svg class="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Pattern-based roadmaps: Sliding Window, Two Pointers, Graphs, Dynamic Programming.</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Instant multi-language execution in C++, Python, Java, and JavaScript.</span>
            </li>
            <li class="flex items-start">
              <svg class="w-5 h-5 text-emerald-500 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Automatic time & space complexity feedback with memory bottleneck alerts.</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </section>

  <!-- FEATURE 3: PLACEMENT TRACKER -->
  <section id="placement-section"
    class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- Copy Column -->
        <div class="lg:col-span-5 space-y-5 text-left">
          <div
            class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            03 / CAMPUS PLACEMENT TRACKER
          </div>
          <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Never Miss Application Deadlines Again
          </h2>
          <p class="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Manage your entire placement season in one organized dashboard. Filter target tech companies by package
            (LPA), eligibility criteria, CGPA cutoffs, and application stages.
          </p>
          <div class="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
            <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
              <div class="text-neutral-500">MAANG & TIER 1</div>
              <div class="text-lg font-bold text-neutral-900 dark:text-white mt-1">â‚¹24 - â‚¹55 LPA</div>
            </div>
            <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
              <div class="text-neutral-500">PRODUCT UNICORNS</div>
              <div class="text-lg font-bold text-neutral-900 dark:text-white mt-1">â‚¹14 - â‚¹30 LPA</div>
            </div>
          </div>
        </div>

        <!-- Interactive Search & Table Column -->
        <div class="lg:col-span-7">
          <div
            class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-lg space-y-4">

            <div class="flex items-center justify-between">
              <input id="placement-search-input" type="text" placeholder="Search company (e.g. Google, Amazon)..."
                class="w-full max-w-xs px-3 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-surface-secondary focus:outline-none">
              <span class="text-xs font-mono text-neutral-500">Live Campus Drive Directory</span>
            </div>

            <div class="space-y-2 text-xs">
              <div
                class="p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex items-center justify-between">
                <div>
                  <div class="font-bold text-neutral-900 dark:text-white">Microsoft Security</div>
                  <div class="text-[11px] text-neutral-500">Software Engineer 1 â€¢ Hyderabad</div>
                </div>
                <div class="text-right">
                  <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400">â‚¹45.0 LPA</div>
                  <span class="text-[10px] text-blue-500">Shortlisted for OA</span>
                </div>
              </div>

              <div
                class="p-3 rounded border border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex items-center justify-between">
                <div>
                  <div class="font-bold text-neutral-900 dark:text-white">Uber Technologies</div>
                  <div class="text-[11px] text-neutral-500">Backend Systems Engineer â€¢ Bangalore</div>
                </div>
                <div class="text-right">
                  <div class="font-mono font-bold text-emerald-600 dark:text-emerald-400">â‚¹38.0 LPA</div>
                  <span class="text-[10px] text-emerald-500">Interview Scheduled</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>`;
})();



