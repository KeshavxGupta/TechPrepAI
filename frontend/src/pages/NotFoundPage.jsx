export default function NotFoundPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary/90 subtle-glass px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="index.html" className="flex items-center gap-3 cursor-pointer select-none group">
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
          <a
            href="index.html"
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Return Home
          </a>
        </div>
      </header>
      {/* Main 404 Hero */}
      <main className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 font-mono font-extrabold text-3xl shadow-inner">
            404
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
              Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
              The requested page could not be found. It may have been moved or you might have
              followed an outdated link.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="index.html"
              className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Back to Landing Page</span>
            </a>
            <a
              href="pages/user/dashboard.html"
              className="px-5 py-2.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center justify-center gap-2"
            >
              <span>Student Portal</span>
            </a>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="py-6 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 bg-surface-primary/95">
        © 2026 TechPrep AI, Inc. All rights reserved. • Developer Preparation Platform
      </footer>
    </>
  );
}
