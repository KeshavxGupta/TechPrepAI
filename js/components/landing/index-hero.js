(function() {
  const container = document.getElementById('component-index-hero');
  if (!container) return;

  container.outerHTML = `
  <section id="home"
    class="relative pt-12 pb-16 lg:pt-20 lg:pb-24 border-b border-neutral-200 dark:border-neutral-800 bg-grid-pattern overflow-hidden">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        <!-- Hero Left Column: Copy & CTAs -->
        <div class="lg:col-span-6 space-y-6 text-left">

          <!-- Social Proof Tag -->
          <div
            class="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-300">
            <span class="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Trusted by 50,000+ Students across 400+ Engineering Colleges</span>
          </div>

          <!-- Main Headline -->
          <h1
            class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-[1.1]">
            Master DSA. <br class="hidden sm:inline">
            Crack Placements. <br>
            <span class="text-blue-600 dark:text-blue-500">Build Your Tech Career.</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-xl leading-relaxed">
            One intelligent workspace for coding practice, ATS resumes, skill development, and placement tracking. Built for engineers, not sales pages.
          </p>

          <!-- Buttons & Action Bar -->
          <div class="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <a href="/pages/user/dsa-ide.html"
              class="px-6 py-3 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md flex items-center justify-center group">
              Solve DSA Code IDE
              <svg class="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>

            <button
              class="open-signup-modal px-6 py-3 text-sm font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm flex items-center justify-center">
              Get Started Free
            </button>
          </div>

          <!-- Stats Strip -->
          <div class="pt-6 grid grid-cols-3 gap-4 border-t border-neutral-200 dark:border-neutral-800 text-left">
            <div>
              <div class="text-xl sm:text-2xl font-bold font-mono text-neutral-900 dark:text-white">94%</div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400">Placement Rate</div>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-bold font-mono text-neutral-900 dark:text-white">1,200+</div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400">Hiring Partners</div>
            </div>
            <div>
              <div class="text-xl sm:text-2xl font-bold font-mono text-neutral-900 dark:text-white">₹18.4 LPA</div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400">Avg. Tech Package</div>
            </div>
          </div>

        </div>

        <div class="lg:col-span-6">
          <div
            class="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-xl overflow-hidden text-left font-sans">

            <div
              class="px-4 py-3 bg-neutral-100 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span
                  class="ml-2 font-mono text-xs text-neutral-500 dark:text-neutral-400">app.techprep.ai/dashboard</span>
              </div>
              <div class="flex items-center space-x-2">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1 animate-pulse"></span> SYNCED
                </span>
              </div>
            </div>

            <div class="p-5 space-y-5 bg-surface-secondary">
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div class="p-3 rounded-lg bg-surface-primary border border-neutral-200 dark:border-neutral-800">
                  <div class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">PREP READINESS</div>
                  <div class="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 mt-1"><span
                      id="hero-prep-score">88</span><span class="text-xs text-neutral-400">/100</span></div>
                  <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">Tier-1 Ready</div>
                </div>

                <div class="p-3 rounded-lg bg-surface-primary border border-neutral-200 dark:border-neutral-800">
                  <div class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">DSA SOLVED</div>
                  <div class="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1"><span
                      id="hero-solved-count">274</span><span class="text-xs text-neutral-400">/350</span></div>
                  <div class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Easy: 142 | Med: 98 | H: 34
                  </div>
                </div>

                <div class="p-3 rounded-lg bg-surface-primary border border-neutral-200 dark:border-neutral-800">
                  <div class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">ATS RESUME</div>
                  <div class="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">92%</div>
                  <div class="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">Verified SDE Template</div>
                </div>

                <div class="p-3 rounded-lg bg-surface-primary border border-neutral-200 dark:border-neutral-800">
                  <div class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">APPLICATIONS</div>
                  <div class="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-1">14</div>
                  <div class="text-[10px] text-blue-600 dark:text-blue-400 mt-0.5">3 Active Placement Rounds</div>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4">

                <div
                  class="sm:col-span-7 p-4 rounded-lg bg-surface-primary border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-semibold text-neutral-900 dark:text-white tracking-wide">TODAY'S AI STUDY
                      PLAN</span>
                    <span class="text-[10px] font-mono text-neutral-500">DAILY</span>
                  </div>

                  <div class="space-y-2 text-xs">
                    <label
                      class="study-item-row flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/60 cursor-pointer hover:border-blue-500/50 transition-colors">
                      <div class="flex items-center space-x-2">
                        <input type="checkbox" class="study-item-checkbox accent-blue-600 rounded">
                        <span class="text-neutral-800 dark:text-neutral-200">Solve 2 Dynamic Programming Problems</span>
                      </div>
                      <span class="font-mono text-[10px] text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">+15
                        Prep</span>
                    </label>

                    <label
                      class="study-item-row flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/60 cursor-pointer hover:border-blue-500/50 transition-colors">
                      <div class="flex items-center space-x-2">
                        <input type="checkbox" class="study-item-checkbox accent-blue-600 rounded">
                        <span class="text-neutral-800 dark:text-neutral-200">System Design: Read Redis Caching
                          Specs</span>
                      </div>
                      <span class="font-mono text-[10px] text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded">+10
                        Prep</span>
                    </label>

                    <label
                      class="study-item-row flex items-center justify-between p-2 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/60 cursor-pointer hover:border-blue-500/50 transition-colors">
                      <div class="flex items-center space-x-2">
                        <input type="checkbox" class="study-item-checkbox accent-blue-600 rounded" checked>
                        <span class="text-neutral-800 dark:text-neutral-200 line-through opacity-60">Mock Interview:
                          Technical Round (20m)</span>
                      </div>
                      <span
                        class="font-mono text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">DONE</span>
                    </label>
                  </div>
                </div>

                <div
                  class="sm:col-span-5 p-4 rounded-lg bg-surface-primary border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div class="text-xs font-semibold text-neutral-900 dark:text-white tracking-wide">ACTIVE DRIVES</div>

                  <div class="space-y-2.5 text-xs">
                    <div
                      class="p-2 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <div class="font-semibold text-neutral-900 dark:text-white">Google</div>
                        <div class="text-[10px] text-neutral-500">SDE-1 • 32.5 LPA</div>
                      </div>
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        Interview R2
                      </span>
                    </div>

                    <div
                      class="p-2 rounded bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div>
                        <div class="font-semibold text-neutral-900 dark:text-white">Atlassian</div>
                        <div class="text-[10px] text-neutral-500">Backend • 28 LPA</div>
                      </div>
                      <span
                        class="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        Shortlisted
                      </span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            <div
              class="px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500">
              <span>ACTIVE STREAK: 42 DAYS</span>
              <span>PLACEMENT READINESS: 91%</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  </section>`;
})();
