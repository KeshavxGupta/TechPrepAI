export default function DsaSheetsPage() {
  return (
    <>
      {/* Navbar Header */}
      <header className="sticky top-0 z-50 bg-surface-primary/90 subtle-glass border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a
              href="../../index.html"
              className="flex items-center gap-3 cursor-pointer select-none group"
            >
              {/* Shield & Brain Vector Mark */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0D1520] border border-[#00FFC2]/30 shadow-[0_0_15px_rgba(0,255,194,0.15)] shrink-0">
                <svg
                  className="w-6 h-6 text-[#00FFC2]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Shield Outline */}
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    fill="#00FFC2"
                    fillOpacity="0.08"
                  />
                  {/* Internal Neural Network / Circuit Nodes */}
                  <path d="M12 8v4" stroke="#38BDF8" />
                  <path d="M9.5 10.5l5 3" stroke="#38BDF8" />
                  <circle cx={12} cy={7} r="1.2" fill="#00FFC2" />
                  <circle cx="8.5" cy={11} r="1.2" fill="#00FFC2" />
                  <circle cx="15.5" cy={11} r="1.2" fill="#00FFC2" />
                  <circle cx={12} cy={16} r="1.2" fill="#00FFC2" />
                  <path d="M10 14.5l2 1.5 2-1.5" stroke="#38BDF8" />
                </svg>
              </div>
              {/* Brand Typography */}
              <div className="flex flex-col text-left">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
                  TechPrep <span className="text-[#00FFC2]">AI</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                  Empowering Technical Careers
                </span>
              </div>
            </a>
            <div className="flex items-center space-x-4">
              <a
                href="../admin/admin-hub.html"
                className="px-3 py-1.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 text-blue-600 dark:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Admin Console
              </a>
              <button
                className="theme-toggle-btn p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center space-x-1 text-xs"
                title="Toggle Light / Dark mode"
              >
                <svg
                  className="w-4 h-4 hidden dark:block text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <svg
                  className="w-4 h-4 block dark:hidden text-slate-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
                <span className="hidden sm:inline font-mono">Theme</span>
              </button>
              <a
                href="../../index.html"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 space-y-10 text-left">
        <div className="space-y-3 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            TECHNICAL INTERVIEW ROADMAPS
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Curated DSA &amp; System Design Sheets
          </h1>
          <p className="text-sm text-neutral-500">
            Industry-standard problem sets tailored for MAANG and Tier-1 engineering placements.
          </p>
        </div>
        {/* Sheet Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sheet 1: Striver */}
          <div
            id="striver"
            className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                190 PROBLEMS
              </span>
              <span className="text-xs text-neutral-500 font-mono">TOP PATTERNS</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Striver SDE Sheet
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Comprehensive collection covering Arrays, Matrix, Linked List, Greedy, Recursion,
              Binary Search, Trees, Graphs, and Dynamic Programming.
            </p>
            <a
              href="../../index.html#interactive-demo"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold"
            >
              Solve in DSA IDE →
            </a>
          </div>
          {/* Sheet 2: NeetCode 150 */}
          <div
            id="neetcode"
            className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                150 PROBLEMS
              </span>
              <span className="text-xs text-neutral-500 font-mono">PATTERN ROADMAP</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">NeetCode 150</h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Structured pattern-first roadmap: Two Pointers, Sliding Window, Stack, Binary Search,
              Backtracking, Graphs, and Advanced DP.
            </p>
            <a
              href="../../index.html#interactive-demo"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold"
            >
              Solve in DSA IDE →
            </a>
          </div>
          {/* Sheet 3: Blind 75 */}
          <div
            id="blind75"
            className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                75 ESSENTIALS
              </span>
              <span className="text-xs text-neutral-500 font-mono">HIGH YIELD</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Blind 75 Must-Do List
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The legendary 75 questions most frequently asked in Meta, Amazon, Apple, Netflix, and
              Google technical rounds.
            </p>
            <a
              href="../../index.html#interactive-demo"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold"
            >
              Solve in DSA IDE →
            </a>
          </div>
          {/* Sheet 4: System Design 101 */}
          <div
            id="system-design"
            className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded text-xs font-mono font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                ARCHITECTURE
              </span>
              <span className="text-xs text-neutral-500 font-mono">HLD &amp; LLD</span>
            </div>
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              System Design 101
            </h2>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Master Load Balancers, Distributed Caching (Redis), Database Sharding, Rate Limiters,
              Message Queues (Kafka), and Microservices architecture.
            </p>
            <a
              href="../../index.html#interactive-demo"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold"
            >
              Explore System Design →
            </a>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800 bg-surface-primary text-xs text-neutral-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© 2026 TechPrep AI, Inc. All rights reserved.</div>
          <div className="flex space-x-4 font-mono text-[11px]">
            <a href="../public/privacy.html" className="hover:underline">
              Privacy Policy
            </a>
            <a href="../public/terms.html" className="hover:underline">
              Terms of Service
            </a>
            <a
              href="../public/dsa-sheets.html"
              className="text-neutral-900 dark:text-white font-bold underline"
            >
              DSA Sheets
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
