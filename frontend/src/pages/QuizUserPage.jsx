export default function QuizUserPage() {
  return (
    <>
      {' '}
      {/* Mobile Overlay Backdrop */}
      <div
        id="quiz-sidebar-overlay"
        onClick={(event) => {
          const result = function (event) {
            toggleQuizSidebar();
          }.call(event.currentTarget, event);
          if (result === false) {
            event.preventDefault();
          }
        }}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-30 hidden lg:hidden"
      />
      {/* Left Sidebar */}
      <aside
        id="quiz-sidebar"
        className="fixed lg:sticky top-0 left-0 z-40 w-64 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 subtle-glass flex flex-col justify-between p-5 transition-transform duration-300 -translate-x-full lg:translate-x-0 shrink-0"
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <a href="../../index.html" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-sm shadow-sm">
                TP
              </div>
              <span className="font-bold text-base tracking-tight font-sans text-neutral-900 dark:text-white">
                TechPrep <span className="text-blue-600 dark:text-blue-500 font-bold">AI</span>
              </span>
            </a>
            <button
              onClick={(event) => {
                const result = function (event) {
                  toggleQuizSidebar();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="lg:hidden text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          {/* Navigation Links */}
          <nav className="space-y-1.5 flex flex-col text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            <a
              href="../user/dashboard.html"
              onClick={(event) => {
                const result = function (event) {
                  toggleQuizSidebar(false);
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="sidebar-link flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span>Available Quizzes</span>
            </a>
            <a
              href="../user/dashboard.html?tab=history"
              onClick={(event) => {
                const result = function (event) {
                  toggleQuizSidebar(false);
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="sidebar-link flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Attempt History</span>
            </a>
          </nav>
        </div>
        {/* Sidebar Bottom Profile Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex flex-col space-y-2">
          <a
            href="../user/dashboard.html?tab=profile"
            onClick={(event) => {
              const result = function (event) {
                toggleQuizSidebar(false);
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="sidebar-link flex items-center space-x-2.5 px-3 py-2.5 rounded-lg transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white w-full text-xs font-semibold text-neutral-600 dark:text-neutral-400"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>My Profile</span>
          </a>
          <button
            onClick={(event) => {
              const result = function (event) {
                logoutUser();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 text-rose-600 dark:text-rose-400 w-full text-xs font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>
      {/* Right Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-surface-primary/90 subtle-glass border-b border-neutral-200 dark:border-neutral-800 transition-colors w-full">
          <div className="px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <button
                id="quiz-sidebar-toggle-btn"
                onClick={(event) => {
                  const result = function (event) {
                    toggleQuizSidebar();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="lg:hidden p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                title="Toggle Sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <div className="text-[11px] sm:text-xs font-semibold text-neutral-500 hidden md:block">
                Strict Examination Environment
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 shrink-0">
              {/* Active Proctor Status Badge */}
              <div
                id="exam-proctor-active-badge"
                className="hidden items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">SECURE PROCTOR ACTIVE</span>
                <span className="sm:hidden">SECURE</span>
              </div>
              {/* Active Timer Display */}
              <div
                id="quiz-timer-container"
                className="hidden items-center space-x-1.5 sm:space-x-2 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg shadow-sm"
              >
                <span className="text-[9px] sm:text-[10px] font-bold text-neutral-500 font-mono hidden sm:inline">
                  TIME LEFT
                </span>
                <span
                  id="quiz-timer"
                  className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400"
                >
                  00:00
                </span>
              </div>
              {/* Exit Exam Early link */}
              <button
                id="exit-exam-early"
                onClick={(event) => {
                  const result = function (event) {
                    confirmExitEarly();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="hidden items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all shadow-sm"
              >
                <svg
                  className="w-3.5 h-3.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Exit &amp; Terminate Exam</span>
                <span className="sm:hidden">Exit</span>
              </button>
              {/* Theme Switcher Button */}
              <button
                className="theme-toggle-btn p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center space-x-1"
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
              </button>
              {/* User initials Avatar */}
              <div className="flex items-center space-x-2 pl-2 border-l border-neutral-200 dark:border-neutral-800">
                <div
                  id="user-avatar-initials"
                  className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono select-none"
                >
                  ST
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="p-3 sm:p-6 lg:p-8 flex-1 w-full flex items-center justify-center max-w-7xl mx-auto">
          {/* View 1: Quiz Selector (Fallback if no query param) */}
          <div id="view-selector" className="hidden w-full max-w-4xl space-y-6 text-left">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
                Tech Hub Quiz Zone
              </h1>
              <p className="text-sm text-neutral-500">
                Select a technical assessment below to begin in a strict proctored session.
              </p>
            </div>
            <div
              id="selector-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Rendered dynamically */}
            </div>
          </div>
          {/* View 2: Instructions & Fullscreen Prompt */}
          <div
            id="view-instructions"
            className="hidden w-full max-w-2xl text-left bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-2xl space-y-6"
          >
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
              <h1
                id="ins-quiz-title"
                className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white"
              >
                Loading Quiz...
              </h1>
              <p id="ins-quiz-desc" className="text-xs text-neutral-500 mt-2 leading-relaxed">
                Please wait while we retrieve parameters.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
                Strict Exam Rules
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-surface-secondary border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center">
                    Time Allocation
                  </span>
                  <p id="ins-quiz-time" className="text-[11px] text-neutral-500 leading-normal">
                    Quiz duration: -- minutes. The exam auto-submits when expired.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-surface-secondary border border-neutral-200 dark:border-neutral-800 space-y-2">
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center">
                    Passing Criteria
                  </span>
                  <p id="ins-quiz-pass" className="text-[11px] text-neutral-500 leading-normal">
                    Minimum score: --% correct answers required to pass.
                  </p>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10 space-y-2.5 text-xs">
                <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400 font-bold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span>Strict Anti-Cheat &amp; Proctoring Telemetry Active</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300 list-disc list-inside">
                  <li>
                    <strong>Mandatory Fullscreen:</strong> The exam is locked into fullscreen.
                    Exiting fullscreen logs a security violation.
                  </li>
                  <li>
                    <strong>Early Exit Policy:</strong> Exiting, navigating away, closing or
                    reloading the browser will immediately{' '}
                    <strong>TERMINATE the session and mark the quiz as FAILED (0% score)</strong>.
                  </li>
                  <li>
                    <strong>Focus &amp; Tab Switching:</strong> Changing windows or switching
                    browser tabs increments a strike. On the <strong>3rd strike</strong>, your
                    assessment is automatically terminated and marked <strong>FAILED</strong>.
                  </li>
                  <li>
                    <strong>Input Locks:</strong> Copy, paste, inspect (F12/DevTools), and
                    right-click are strictly disabled.
                  </li>
                </ul>
              </div>
            </div>
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <a
                href="../user/dashboard.html"
                className="px-5 py-2.5 text-xs font-semibold text-center rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel &amp; Return
              </a>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    startExamFullscreen();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-6 py-2.5 text-xs font-bold text-center rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Enter Strict Proctored Session</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </div>
          {/* View 3: Active Exam Environment */}
          <div id="view-exam" className="hidden w-full text-left unselectable">
            {/* Layout A: Standard MCQ View (proctoring on left, options on right) */}
            <div
              id="exam-mcq-container"
              className="w-full max-w-5xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-5 lg:gap-8"
            >
              {/* Left Panel: Proctoring + Question Grid Navigator (4 cols on lg, bottom on mobile) */}
              <div className="order-2 lg:order-1 lg:col-span-4 space-y-5 lg:space-y-6">
                {/* Proctoring Command Center */}
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
                      Proctoring Telemetry
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      ACTIVE
                    </span>
                  </div>
                  {/* AI Optical / Webcam Feed HUD */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-700/60 shadow-inner flex items-center justify-center">
                    <video
                      id="proctor-video-feed"
                      autoPlay
                      muted
                      playsInline
                      className="w-full h-full object-cover hidden"
                    />
                    <div
                      id="proctor-radar-view"
                      className="w-full h-full flex flex-col items-center justify-center bg-radial from-blue-900/20 to-neutral-950 p-3 text-center"
                    >
                      <div className="relative w-10 h-10 mb-1.5 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full border border-blue-500/40 animate-ping" />
                        <span className="absolute inset-1.5 rounded-full border border-emerald-500/60 animate-pulse" />
                        <svg
                          className="w-5 h-5 text-emerald-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-neutral-300 tracking-wider">
                        AI OPTICAL PROCTOR
                      </span>
                      <span
                        id="proctor-hud-status"
                        className="text-[9px] font-mono text-emerald-400 mt-0.5"
                      >
                        Focus: Verified • Fullscreen Lock
                      </span>
                    </div>
                    {/* HUD Overlays */}
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>MONITORED</span>
                    </div>
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur text-[9px] font-mono text-neutral-400 border border-white/10">
                      100% SECURE
                    </div>
                  </div>
                  {/* 3 Strikes Visual Indicators */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-neutral-500 font-medium">Infractions Limit:</span>
                      <span
                        id="exam-warning-count"
                        className="font-mono font-bold text-emerald-500"
                      >
                        0 / 3 Strikes
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                      <div
                        id="strike-badge-1"
                        className="py-1.5 px-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-center text-neutral-400 font-semibold transition-all"
                      >
                        Strike 1: OK
                      </div>
                      <div
                        id="strike-badge-2"
                        className="py-1.5 px-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-center text-neutral-400 font-semibold transition-all"
                      >
                        Strike 2: OK
                      </div>
                      <div
                        id="strike-badge-3"
                        className="py-1.5 px-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-center text-neutral-400 font-semibold transition-all"
                      >
                        Strike 3: OK
                      </div>
                    </div>
                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        id="exam-warning-bar"
                        className="bg-emerald-500 h-full w-0 transition-all duration-300"
                      />
                    </div>
                  </div>
                  {/* Live Audit Telemetry Log */}
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 font-mono text-[10px] space-y-1.5">
                    <div className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold flex items-center justify-between">
                      <span>Security Audit Log</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    </div>
                    <div
                      id="proctor-telemetry-feed"
                      className="h-16 overflow-y-auto space-y-1 text-neutral-300 text-[10px] leading-tight"
                    >
                      <div className="text-emerald-400">[00:00] Proctoring stream initialized</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-rose-500/90 font-medium">
                    ⚠️ Exiting window or session terminates exam as FAILED.
                  </p>
                </div>
                {/* Question Grid */}
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
                    Assessment Progress
                  </h3>
                  <div id="question-nav-grid" className="grid grid-cols-5 gap-2.5 font-mono">
                    {/* Dynamically populated numbers */}
                  </div>
                  {/* Color guidelines */}
                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800/60 grid grid-cols-2 gap-2 text-[10px] text-neutral-500">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-blue-600" />
                      <span>Saved Answer</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                      <span>Marked Review</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-secondary" />
                      <span>Unvisited</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded ring-2 ring-blue-500 border border-neutral-300 dark:border-neutral-700 bg-surface-secondary" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Panel: Active Question Content (8 cols on lg, top on mobile) */}
              <div className="order-1 lg:order-2 lg:col-span-8 flex flex-col justify-between p-4 sm:p-6 lg:p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm min-h-[350px] sm:min-h-[450px]">
                {/* Question Text */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800/60 pb-3">
                    <span
                      id="exam-question-number"
                      className="text-xs font-bold text-neutral-500 font-mono"
                    >
                      QUESTION -- OF --
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      Single Choice
                    </span>
                  </div>
                  <h2
                    id="exam-question-text"
                    className="text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed font-sans"
                  >
                    Question text loading...
                  </h2>
                  {/* Options container */}
                  <div id="exam-options-container" className="space-y-3">
                    {/* Radio cards */}
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex space-x-2">
                    <button
                      onClick={(event) => {
                        const result = function (event) {
                          prevQuestion();
                        }.call(event.currentTarget, event);
                        if (result === false) {
                          event.preventDefault();
                        }
                      }}
                      id="btn-prev"
                      className="px-4 py-2 font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Previous
                    </button>
                    <button
                      onClick={(event) => {
                        const result = function (event) {
                          markForReview();
                        }.call(event.currentTarget, event);
                        if (result === false) {
                          event.preventDefault();
                        }
                      }}
                      className="px-4 py-2 font-medium rounded-lg border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                    >
                      Mark for Review
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={(event) => {
                        const result = function (event) {
                          clearAnswerSelection();
                        }.call(event.currentTarget, event);
                        if (result === false) {
                          event.preventDefault();
                        }
                      }}
                      className="px-4 py-2 font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                    >
                      Clear Answer
                    </button>
                    <button
                      onClick={(event) => {
                        const result = function (event) {
                          nextQuestion();
                        }.call(event.currentTarget, event);
                        if (result === false) {
                          event.preventDefault();
                        }
                      }}
                      id="btn-next"
                      className="px-5 py-2 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                    >
                      Save &amp; Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Layout B: Full LeetCode Split-Screen Workspace (for Coding Challenge questions) */}
            <div
              id="exam-coding-container"
              className="hidden w-full max-w-7xl mx-auto flex flex-col lg:h-[calc(100vh-6.5rem)] min-h-[550px] rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary shadow-2xl overflow-hidden"
            >
              {/* Top Exam Header Bar for Coding Mode */}
              <div className="h-auto min-h-12 py-2 px-3 sm:px-4 border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex flex-wrap items-center justify-between gap-2 shrink-0 font-sans text-xs">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <span
                    className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold font-mono text-[10px] sm:text-[11px]"
                    id="exam-coding-q-badge"
                  >
                    QUESTION 1 OF 3 • CODING CHALLENGE
                  </span>
                  <span
                    id="exam-coding-warning-pill"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] sm:text-[11px] font-mono bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Proctoring Telemetry:{' '}
                    <strong id="exam-coding-warning-count" className="ml-1">
                      0 / 3
                    </strong>
                  </span>
                </div>
                {/* Question Quick Jump Nav Buttons Row */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(event) => {
                      const result = function (event) {
                        confirmExitEarly();
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                    className="px-2.5 py-1 rounded text-[11px] font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all flex items-center gap-1"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7"
                      />
                    </svg>
                    <span>Exit &amp; Fail</span>
                  </button>
                  <span className="text-neutral-500 font-mono hidden sm:inline text-[11px]">
                    Jump to:
                  </span>
                  <div id="exam-coding-nav-pills" className="flex items-center space-x-1.5">
                    {/* Dynamically populated question numbers (1, 2, 3...) */}
                  </div>
                </div>
              </div>
              {/* Main Split Panels Grid: 5 cols Left (Description & Testcases), 7 cols Right (Multi-lang IDE) */}
              <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden h-auto lg:h-full">
                {/* LEFT PANEL: Problem Details, Sample Cases, Constraints */}
                <div className="lg:col-span-5 flex flex-col border-b lg:border-b-0 lg:border-r border-neutral-200 dark:border-neutral-800 bg-surface-elevated overflow-y-auto p-4 sm:p-5 text-left space-y-5 max-h-[45vh] lg:max-h-none">
                  <div id="exam-coding-desc-header">
                    <h2
                      id="exam-coding-title"
                      className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-white"
                    >
                      Loading Coding Problem...
                    </h2>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span
                        id="exam-coding-diff"
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      >
                        Easy
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-mono text-neutral-500">
                        Auto-Evaluated on Host Toolchain
                      </span>
                    </div>
                  </div>
                  <div
                    id="exam-coding-text"
                    className="prose dark:prose-invert text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line"
                  >
                    {/* Problem description text */}
                  </div>
                  {/* Sample Testcases Section */}
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">
                      Sample Testcases
                    </h3>
                    <div id="exam-coding-samples" className="space-y-2">
                      {/* Dynamically populated sample test cases */}
                    </div>
                  </div>
                  {/* Constraints */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">
                      Constraints &amp; Rules
                    </h3>
                    <ul
                      id="exam-coding-constraints"
                      className="list-disc pl-5 space-y-1 text-[11px] font-mono text-neutral-600 dark:text-neutral-400"
                    >
                      <li>Time limit per test execution: 6000 ms</li>
                      <li>Memory limit: 512 MB</li>
                      <li>
                        Supports JavaScript (Node.js 22), Python 3.12, C++ 20 (G++ 14.2), and Java
                        21 (Adoptium OpenJDK)
                      </li>
                    </ul>
                  </div>
                </div>
                {/* RIGHT PANEL: Multi-Language Code Editor & Terminal Execution Drawer */}
                <div className="lg:col-span-7 flex flex-col bg-surface-primary overflow-hidden min-h-[380px] lg:min-h-0 h-auto lg:h-full">
                  {/* Editor Toolbar Header */}
                  <div className="h-auto min-h-10 py-1.5 px-3 sm:px-4 border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex flex-wrap items-center justify-between gap-2 shrink-0 font-sans text-xs">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="font-mono text-neutral-500 font-bold text-[11px] sm:text-xs">
                        Language:
                      </span>
                      <select
                        id="exam-lang-select"
                        onChange={(event) => {
                          const result = function (event) {
                            changeExamLanguage(this.value);
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        className="p-1 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-[11px] sm:text-xs font-semibold focus:outline-none"
                      >
                        <option value="javascript">JavaScript (Node.js 22)</option>
                        <option value="python">Python 3.12</option>
                        <option value="cpp">C++ 20 (G++ 14.2)</option>
                        <option value="java">Java 21 (Adoptium OpenJDK)</option>
                      </select>
                      <span
                        id="exam-compiler-badge"
                        className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Host Compiler Active
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(event) => {
                          const result = function (event) {
                            toggleExamCustomInput();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        id="exam-custom-input-toggle-btn"
                        className="px-2 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      >
                        Custom Input
                      </button>
                      <button
                        onClick={(event) => {
                          const result = function (event) {
                            confirmResetExamCode();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Reset Starter Code"
                      >
                        Reset Starter Code
                      </button>
                      <button
                        onClick={(event) => {
                          const result = function (event) {
                            clearExamCodingCode();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        className="px-2.5 py-1 rounded border border-neutral-300 dark:border-neutral-700 text-[11px] font-mono text-neutral-500 hover:text-rose-500 hover:border-rose-500/40 transition-colors"
                        title="Clear All Code"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                  {/* Custom Input Drawer (Collapsible) */}
                  <div
                    id="exam-custom-input-container"
                    className="hidden border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary p-3"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <label
                        htmlFor="exam-custom-input"
                        className="text-[11px] font-mono font-bold text-neutral-500 uppercase"
                      >
                        Test with Custom Stdin Input
                      </label>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        Passed directly to compiler stdin
                      </span>
                    </div>
                    <textarea
                      id="exam-custom-input"
                      rows={3}
                      placeholder="e.g. [2,7,11,15]
9"
                      className="w-full p-2 bg-neutral-900 text-neutral-100 font-mono text-xs rounded border border-neutral-700 focus:outline-none focus:border-blue-500 resize-none"
                      defaultValue={''}
                    />
                  </div>
                  {/* Code Editor Body with Line Numbers Gutter */}
                  <div className="flex-1 flex overflow-hidden relative bg-neutral-950 font-mono text-xs text-neutral-100 min-h-[260px]">
                    {/* Line Numbers Gutter */}
                    <div
                      id="exam-line-numbers"
                      className="w-10 py-3 text-right pr-3 select-none text-neutral-600 bg-neutral-900 border-r border-neutral-800 font-mono text-[11px] leading-6 shrink-0"
                    >
                      <div>1</div>
                    </div>
                    {/* Textarea Code Input */}
                    <textarea
                      id="exam-code-textarea"
                      onInput={(event) => {
                        const result = function (event) {
                          updateExamLineNumbers();
                        }.call(event.currentTarget, event);
                        if (result === false) {
                          event.preventDefault();
                        }
                      }}
                      onScroll={(event) => {
                        const result = function (event) {
                          syncExamLineScroll();
                        }.call(event.currentTarget, event);
                        if (result === false) {
                          event.preventDefault();
                        }
                      }}
                      spellCheck="false"
                      className="flex-1 p-3 bg-neutral-950 text-neutral-100 font-mono text-xs leading-6 resize-none focus:outline-none selection:bg-blue-600 selection:text-white whitespace-pre tab-4"
                      defaultValue={''}
                    />
                  </div>
                  {/* Execution Terminal Drawer (Outputs & Testcases) */}
                  <div
                    id="exam-terminal-output"
                    className="hidden border-t border-neutral-200 dark:border-neutral-800 bg-surface-elevated max-h-64 overflow-y-auto font-sans"
                  >
                    {/* Filled dynamically on Run/Submit */}
                  </div>
                  {/* Action Footer Toolbar (Run Code, Submit Code & Quiz Navigation) */}
                  <div className="h-auto min-h-16 py-2.5 px-3 sm:px-4 border-t border-neutral-200 dark:border-neutral-800 bg-surface-primary flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 shrink-0 z-10 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(event) => {
                          const result = function (event) {
                            document
                              .getElementById('exam-terminal-output')
                              .classList.toggle('hidden');
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        className="text-xs font-mono text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center space-x-1.5"
                      >
                        <span>Console &amp; Test Results</span>
                      </button>
                      <span
                        id="exam-compiler-running-status"
                        className="hidden font-mono text-[11px] text-blue-500 animate-pulse"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        onClick={(event) => {
                          const result = function (event) {
                            prevQuestion();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        id="exam-coding-btn-prev"
                        className="px-3 py-1.5 text-xs font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                      >
                        Previous
                      </button>
                      <button
                        onClick={(event) => {
                          const result = function (event) {
                            markForReview();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        className="hidden sm:inline-block px-3 py-1.5 text-xs font-medium rounded-lg border border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                      >
                        Review
                      </button>
                      <button
                        id="exam-run-btn"
                        onClick={(event) => {
                          const result = function (event) {
                            runExamCodingCode();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-neutral-800 dark:bg-neutral-700 hover:bg-neutral-700 dark:hover:bg-neutral-600 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <span>Run Code</span>
                      </button>
                      <button
                        id="exam-submit-btn"
                        onClick={(event) => {
                          const result = function (event) {
                            submitExamCodingCode();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                      >
                        <span>Submit Code</span>
                      </button>
                      <button
                        onClick={(event) => {
                          const result = function (event) {
                            nextQuestion();
                          }.call(event.currentTarget, event);
                          if (result === false) {
                            event.preventDefault();
                          }
                        }}
                        id="exam-coding-btn-next"
                        className="px-3.5 sm:px-4 py-1.5 sm:py-2 font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors text-xs"
                      >
                        Save &amp; Next
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* View 4: Results & Score Report */}
          <div id="view-result" className="hidden w-full max-w-4xl text-left space-y-8">
            {/* Score summary card */}
            <div
              id="result-summary-card"
              className="p-6 sm:p-8 rounded-xl border bg-surface-elevated shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
            >
              <div className="space-y-3 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span
                    id="result-status-badge"
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  />
                  <span
                    id="result-infraction-alert"
                    className="hidden px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20"
                  >
                    Terminated early
                  </span>
                </div>
                <h1
                  id="result-title"
                  className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white"
                >
                  Exam Report
                </h1>
                <p id="result-desc" className="text-xs text-neutral-500 max-w-md leading-relaxed" />
              </div>
              {/* Big percentage circular dial (mock) */}
              <div className="flex flex-col items-center justify-center text-center p-6 rounded-lg bg-surface-secondary border border-neutral-200 dark:border-neutral-800 min-w-[160px]">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  FINAL SCORE
                </span>
                <span
                  id="result-score-val"
                  className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1"
                >
                  0%
                </span>
                <span id="result-score-fraction" className="text-[11px] text-neutral-400 mt-0.5">
                  0 / 0 Points
                </span>
              </div>
            </div>
            {/* Performance analytics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
                <span className="text-xs font-semibold text-neutral-500">Time Taken</span>
                <div
                  id="result-time-taken"
                  className="text-xl font-bold font-mono text-neutral-900 dark:text-white mt-1"
                >
                  00:00
                </div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
                <span className="text-xs font-semibold text-neutral-500">Security infractions</span>
                <div
                  id="result-violations"
                  className="text-xl font-bold font-mono text-amber-500 mt-1"
                >
                  0 Warnings
                </div>
              </div>
              <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
                <span className="text-xs font-semibold text-neutral-500">Passing Threshold</span>
                <div
                  id="result-pass-threshold"
                  className="text-xl font-bold font-mono text-neutral-900 dark:text-white mt-1"
                >
                  0%
                </div>
              </div>
            </div>
            {/* Detail Answers Review */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Itemized Answer Review
              </h2>
              <div id="result-questions-review" className="space-y-4">
                {/* Reviewed questions items */}
              </div>
            </div>
            {/* Dashboard exit */}
            <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end">
              <a
                href="../user/dashboard.html"
                className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-md"
              >
                Return to Dashboard
              </a>
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className="py-6 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 transition-colors w-full">
          © 2026 TechPrep AI, Inc. All rights reserved. • Secure Proctoring System
        </footer>
      </div>
      {/* High-Stakes Early Exit / Terminate Modal */}
      <div
        id="exit-confirm-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-3 sm:p-4 bg-neutral-950/85 backdrop-blur-md transition-all"
      >
        <div className="w-full max-w-md bg-surface-elevated border-2 border-rose-500/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-left space-y-4 font-sans animate-in fade-in zoom-in duration-200 max-h-[92vh] overflow-y-auto">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center font-bold shrink-0 text-xl font-mono">
              ⚠️
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Terminate Proctored Exam?
              </h3>
              <p className="text-xs text-rose-500 font-semibold mt-0.5">
                Attempt will be permanently recorded as FAILED
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-surface-secondary p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
            Exiting this proctored session will immediately <strong>END</strong> your examination.
            Your assessment will be recorded as <strong>FAILED with a void score (0%)</strong> and
            synced to your academic transcript. This action is irreversible.
          </p>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeExitConfirmModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel &amp; Continue Exam
            </button>
            <button
              onClick={(event) => {
                const result = function (event) {
                  executeExitAndFailExam();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Yes, Terminate &amp; Fail Quiz
            </button>
          </div>
        </div>
      </div>
      {/* Proctoring Warnings alert overlay */}
      <div
        id="proctoring-warning-overlay"
        className="fixed inset-0 z-50 hidden items-center justify-center p-3 sm:p-4 bg-neutral-950/90 backdrop-blur-md transition-all"
      >
        <div className="w-full max-w-md bg-surface-elevated border-2 border-amber-500/50 rounded-2xl shadow-2xl p-5 sm:p-6 text-center space-y-4 max-h-[92vh] overflow-y-auto">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500 flex items-center justify-center text-2xl font-bold mx-auto font-mono">
            !
          </div>
          <div>
            <h3
              id="overlay-warning-title"
              className="text-base font-extrabold text-neutral-900 dark:text-white"
            >
              Security Infraction Detected
            </h3>
            <p
              id="overlay-warning-desc"
              className="text-xs text-neutral-600 dark:text-neutral-400 mt-1"
            >
              Window focus was lost or you attempted to switch tabs. Navigating outside the active
              proctored exam is strictly prohibited.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs font-mono font-bold text-amber-600 dark:text-amber-400 flex items-center justify-center gap-2">
            <span>STRIKE RECORDED:</span>
            <span id="overlay-warning-count" className="text-sm font-extrabold text-amber-500">
              1
            </span>
            <span>/ 3 STRIKES</span>
          </div>
          <p className="text-[11px] text-neutral-400">
            On the 3rd strike, your examination will automatically terminate and be marked as{' '}
            <strong>FAILED</strong>.
          </p>
          <button
            onClick={(event) => {
              const result = function (event) {
                resumeExamFullscreen();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="w-full py-3 text-xs font-bold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md"
          >
            Re-enter Fullscreen &amp; Resume Exam
          </button>
        </div>
      </div>
      {/* Submit confirmation modal */}
      <div
        id="submit-confirm-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
      >
        <div className="w-full max-w-md bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 text-left space-y-4">
          <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
            Submit Assessment
          </h3>
          <p id="submit-confirm-text" className="text-xs text-neutral-600 dark:text-neutral-400">
            Are you sure you want to finalize and submit your responses?
          </p>
          <div className="flex items-center justify-end gap-3 pt-2 text-xs">
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeSubmitConfirmModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-4 py-2 font-medium rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(event) => {
                const result = function (event) {
                  submitExam();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-4 py-2 font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
      {/* RESET STARTER CODE CONFIRMATION MODAL */}
      <div
        id="exam-reset-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm transition-opacity"
      >
        <div className="w-full max-w-md bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-left space-y-4 font-sans animate-in fade-in zoom-in duration-200">
          <div className="flex items-center space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-bold shrink-0 text-base font-mono">
              !
            </div>
            <div>
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white tracking-tight">
                Reset Starter Code?
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Restore default starter code template
              </p>
            </div>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed bg-surface-secondary p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 font-sans">
            Are you sure you want to reset your code to the default starter template for the
            selected language? All unsubmitted changes in the code editor will be replaced.
          </p>
          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeResetExamModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(event) => {
                const result = function (event) {
                  executeResetExamCode();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Reset Code
            </button>
          </div>
        </div>
      </div>
      {/* Page End */}
    </>
  );
}
