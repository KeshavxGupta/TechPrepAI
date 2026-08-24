(function() {
  const container = document.getElementById('component-index-demo');
  if (!container) return;

  container.outerHTML = `
  <section id="interactive-demo"
    class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="text-center max-w-3xl mx-auto space-y-3 mb-10">
        <h2 class="text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase">Interactive
          Workspace Preview</h2>
        <p class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">Experience TechPrep AI
          In Action</p>
        <p class="text-base text-neutral-600 dark:text-neutral-400">Switch between tools below to test real developer
          features directly in your browser.</p>
      </div>

      <div class="flex justify-center mb-8">
        <div
          class="inline-flex p-1.5 rounded-lg bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 space-x-1">
          <button data-tab="dashboard"
            class="demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm">
            Dashboard
          </button>
          <button data-tab="resume"
            class="demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50">
            Resume Designer & ATS
          </button>
          <button data-tab="dsa"
            class="demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50">
            DSA IDE
          </button>
          <button data-tab="placements"
            class="demo-tab-btn px-4 py-2 text-sm font-medium rounded-md transition-all text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50">
            Placements
          </button>
        </div>
      </div>

      <div
        class="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated p-6 sm:p-8 shadow-lg min-h-[460px]">

        <div id="demo-panel-dashboard" class="demo-tab-panel block space-y-6">
          <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white">Engineering Preparation Overview</h3>
              <p class="text-xs text-neutral-500">Real-time telemetry across DSA, Resume ATS, and Placements</p>
            </div>
            <span
              class="font-mono text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-500/20">TARGET:
              MAANG SDE-1</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              class="p-4 rounded-lg bg-surface-secondary border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span class="text-xs font-mono text-neutral-500">DSA PROBLEM DISTRIBUTION</span>
              <div class="text-3xl font-bold font-mono text-neutral-900 dark:text-white">274 / 350</div>
              <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-600 h-full w-[78%]"></div>
              </div>
              <div class="text-xs text-neutral-500 pt-1">78% of Target SDE Sheet Completed</div>
            </div>

            <div
              class="p-4 rounded-lg bg-surface-secondary border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span class="text-xs font-mono text-neutral-500">ATS MATCH INDEX</span>
              <div class="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">92 / 100</div>
              <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full w-[92%]"></div>
              </div>
              <div class="text-xs text-neutral-500 pt-1">High compatibility with Tier-1 ATS filters</div>
            </div>

            <div
              class="p-4 rounded-lg bg-surface-secondary border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span class="text-xs font-mono text-neutral-500">PLACEMENT DRIVE READINESS</span>
              <div class="text-3xl font-bold font-mono text-blue-600 dark:text-blue-400">89%</div>
              <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div class="bg-blue-500 h-full w-[89%]"></div>
              </div>
              <div class="text-xs text-neutral-500 pt-1">High eligibility across 18+ active drives</div>
            </div>
          </div>

          <div
            class="p-4 rounded-lg bg-surface-secondary border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div>
                <div class="text-sm font-semibold text-neutral-900 dark:text-white">Upcoming Campus Placement Drive</div>
                <div class="text-xs text-neutral-500">Google SDE-1 On-Campus Drive • Registration Deadline Today</div>
              </div>
            </div>
            <button
              class="open-signup-modal px-4 py-2 text-xs font-semibold rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
              View Drive Details
            </button>
          </div>
        </div>
        <div id="demo-panel-resume" class="demo-tab-panel hidden space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-7 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-semibold text-neutral-900 dark:text-white">AI RESUME DESIGNER & LATEX EDITOR</label>
                <div class="flex space-x-1.5 text-[11px] font-mono">
                  <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">LaTeX SDE</span>
                  <span class="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">Single Column</span>
                </div>
              </div>
              <textarea id="ats-resume-input" rows="8"
                class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-mono focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Design and paste your resume content here...">B.Tech Computer Science student with expertise in Data Structures, Algorithms, React.js, REST APIs, and PostgreSQL. Built scalable web applications with 10k+ active users. Developed machine learning model for sentiment analysis using Python and PyTorch.</textarea>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <button id="ats-analyze-btn"
                  class="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Design & Calculate ATS Score
                </button>
                <span class="text-[11px] text-neutral-500 font-mono">PDF & LaTeX Export Ready</span>
              </div>
            </div>

            <div
              class="lg:col-span-5 p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-4">
              <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
                <div>
                  <span class="text-xs text-neutral-500 font-mono">LIVE ATS MATCH SCORE</span>
                  <div id="ats-score-badge" class="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    92%</div>
                </div>
                <div class="text-right">
                  <span id="ats-match-verdict"
                    class="inline-block px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Tier-1 Tech Ready
                  </span>
                </div>
              </div>

              <div class="space-y-2">
                <div class="text-xs font-semibold text-neutral-900 dark:text-white">KEYWORD MATCH & DESIGN CHECK</div>
                <div id="ats-keywords-container" class="flex flex-wrap gap-1.5">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">MATCH: Single Column ATS Format</span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">MATCH: Data Structures</span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">MATCH: React.js & REST APIs</span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">MATCH: PostgreSQL</span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">MISSING: Docker & K8s</span>
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">MISSING: System Design</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="demo-panel-dsa" class="demo-tab-panel hidden space-y-4">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3 gap-2">
            <div>
              <span class="text-xs font-mono text-blue-500">PROBLEM #001</span>
              <h3 class="text-base font-bold text-neutral-900 dark:text-white">Two Sum — Array & Hash Table</h3>
            </div>

            <div class="flex items-center space-x-3">

              <select id="code-lang-select"
                class="px-2.5 py-1 text-xs font-mono rounded border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-800 dark:text-neutral-200 focus:outline-none">
                <option value="cpp">C++ (GCC 11)</option>
                <option value="python">Python 3.10</option>
                <option value="java">Java 17</option>
                <option value="javascript">JavaScript (Node 18)</option>
              </select>

              <button id="run-code-btn"
                class="px-4 py-1.5 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center">
                <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                </svg>
                Run Code
              </button>
            </div>
          </div>

          <div
            class="rounded-lg border border-neutral-300 dark:border-neutral-800 overflow-hidden font-mono text-xs bg-neutral-950 text-neutral-100">
            <textarea id="code-editor-textarea" rows="7"
              class="w-full p-4 bg-transparent resize-none focus:outline-none text-emerald-400 font-mono leading-relaxed"
              spellcheck="false">class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> mp;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (mp.count(complement)) return {mp[complement], i};
            mp[nums[i]] = i;
        }
        return {};
    }
};</textarea>
          </div>
          <div id="code-console-output"
            class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs">
            <span class="text-neutral-500 font-mono">> Press "Run Code" to compile and execute against testcases.</span>
          </div>
        </div>

        <div id="demo-panel-placements" class="demo-tab-panel hidden space-y-4">
          <div
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h3 class="text-base font-bold text-neutral-900 dark:text-white">Campus Placement Tracker</h3>
              <p class="text-xs text-neutral-500">Track company applications, eligibility rules, and interview stages
              </p>
            </div>


            <div
              class="flex items-center space-x-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-md border border-neutral-200 dark:border-neutral-800">
              <button data-filter="all"
                class="placement-filter-btn px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">All</button>
              <button data-filter="applied"
                class="placement-filter-btn px-3 py-1.5 text-xs font-medium rounded-md text-neutral-600 dark:text-neutral-400">Applied</button>
              <button data-filter="shortlisted"
                class="placement-filter-btn px-3 py-1.5 text-xs font-medium rounded-md text-neutral-600 dark:text-neutral-400">Shortlisted</button>
              <button data-filter="offer"
                class="placement-filter-btn px-3 py-1.5 text-xs font-medium rounded-md text-neutral-600 dark:text-neutral-400">Offers</button>
            </div>
          </div>


          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border-collapse">
              <thead>
                <tr class="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono">
                  <th class="py-2.5 px-3">COMPANY</th>
                  <th class="py-2.5 px-3">TARGET ROLE</th>
                  <th class="py-2.5 px-3">PACKAGE</th>
                  <th class="py-2.5 px-3">ELIGIBILITY</th>
                  <th class="py-2.5 px-3">STATUS</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/60 font-sans">
                <tr class="placement-table-row hover:bg-neutral-50 dark:hover:bg-neutral-900/50" data-company="google"
                  data-role="sde-1" data-status="shortlisted">
                  <td class="py-3 px-3 font-semibold text-neutral-900 dark:text-white">Google India</td>
                  <td class="py-3 px-3">Software Development Engineer 1</td>
                  <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">32.5 LPA</td>
                  <td class="py-3 px-3 text-neutral-500">CGPA ≥ 8.0 • CSE/ECE</td>
                  <td class="py-3 px-3">
                    <span
                      class="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Shortlisted
                      for Tech R2</span>
                  </td>
                </tr>

                <tr class="placement-table-row hover:bg-neutral-50 dark:hover:bg-neutral-900/50" data-company="amazon"
                  data-role="sde" data-status="applied">
                  <td class="py-3 px-3 font-semibold text-neutral-900 dark:text-white">Amazon AWS</td>
                  <td class="py-3 px-3">Cloud Systems Engineer</td>
                  <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">28.0 LPA</td>
                  <td class="py-3 px-3 text-neutral-500">CGPA ≥ 7.5 • All B.Tech</td>
                  <td class="py-3 px-3">
                    <span
                      class="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">OA
                      Assessment Submitted</span>
                  </td>
                </tr>

                <tr class="placement-table-row hover:bg-neutral-50 dark:hover:bg-neutral-900/50"
                  data-company="atlassian" data-role="backend" data-status="offer">
                  <td class="py-3 px-3 font-semibold text-neutral-900 dark:text-white">Atlassian</td>
                  <td class="py-3 px-3">Graduate Backend Engineer</td>
                  <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">52.0 LPA</td>
                  <td class="py-3 px-3 text-neutral-500">CGPA ≥ 8.5 • CSE Only</td>
                  <td class="py-3 px-3">
                    <span
                      class="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Offer Extended</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  </section>`;
})();
