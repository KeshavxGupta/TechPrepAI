// React presentation; feature controllers attach after the initial mount.
export default function UserSidebar() {
  const currentPath = window.location.pathname;
  const urlParams = new URLSearchParams(window.location.search);
  const activeTab = urlParams.get('tab') || 'quizzes';
  const isDashboard = currentPath.endsWith('dashboard.html') || currentPath.endsWith('dashboard');
  const isDsa = currentPath.includes('dsa-ide');
  const isResume = currentPath.includes('resume-builder');
  const isPlacements = currentPath.includes('placements');
  const isPlanner = currentPath.includes('planner');
  const activeClass = 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white';
  const defaultClass =
    'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white';
  return (
    <>
      {/* Mobile Overlay Backdrop */}
      <div
        id="user-sidebar-overlay"
        onClick={(event) => {
          const result = function (event) {
            toggleUserSidebar(false);
          }.call(event.currentTarget, event);
          if (result === false) {
            event.preventDefault();
          }
        }}
        className="fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-30 hidden lg:hidden"
      />
      {/* Left Sidebar */}
      <aside
        id="user-sidebar"
        className="fixed lg:sticky top-0 left-0 z-40 w-64 h-screen border-r border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 subtle-glass flex flex-col justify-between p-5 transition-transform duration-300 -translate-x-full lg:translate-x-0 shrink-0"
      >
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center justify-between">
            <a
              href="../../index.html"
              className="flex items-center gap-2.5 cursor-pointer select-none group"
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
            <button
              onClick={(event) => {
                const result = function (event) {
                  toggleUserSidebar(false);
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="lg:hidden text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1"
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
          <nav className="space-y-1.5 flex flex-col text-xs font-semibold">
            {/* Available Quizzes */}
            <button
              id="side-btn-quizzes"
              onClick={(event) => {
                const result = function (event) {
                  switchDashboardTab('quizzes');
                  toggleUserSidebar(false);
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isDashboard && activeTab === 'quizzes' ? activeClass : defaultClass}`}
            >
              <svg
                className="w-4 h-4 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              <span>Available Quizzes</span>
            </button>
            {/* Attempt History */}
            <button
              id="side-btn-history"
              onClick={(event) => {
                const result = function (event) {
                  switchDashboardTab('history');
                  toggleUserSidebar(false);
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isDashboard && activeTab === 'history' ? activeClass : defaultClass}`}
            >
              <svg
                className="w-4 h-4 text-amber-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Attempt History</span>
            </button>
            {/* DSA Code IDE */}
            <a
              href="../user/dsa-ide.html"
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isDsa ? activeClass : defaultClass}`}
            >
              <svg
                className="w-4 h-4 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                />
              </svg>
              <span>DSA Code IDE</span>
            </a>
            {/* ATS Resume Builder */}
            <a
              href="../user/resume-builder.html"
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isResume ? activeClass : defaultClass}`}
            >
              <svg
                className="w-4 h-4 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span>ATS Resume Builder</span>
            </a>
            {/* Placement Tracker */}
            <a
              href="../user/placements.html"
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isPlacements ? activeClass : defaultClass}`}
            >
              <svg
                className="w-4 h-4 text-cyan-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Placement Tracker</span>
            </a>
            {/* Daily Planner */}
            <a
              href="../user/planner.html"
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${isPlanner ? activeClass : defaultClass}`}
            >
              <svg
                className="w-4 h-4 text-rose-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>Daily Planner</span>
            </a>
            {/* Home Page */}
            <a
              href="../../index.html"
              className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold ${defaultClass}`}
            >
              <svg
                className="w-4 h-4 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Home Page</span>
            </a>
          </nav>
        </div>
        {/* Sidebar Bottom Profile Section */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex flex-col space-y-2">
          <button
            id="side-btn-profile"
            onClick={(event) => {
              const result = function (event) {
                switchDashboardTab('profile');
                toggleUserSidebar(false);
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className={`flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white w-full text-xs font-semibold ${isDashboard && activeTab === 'profile' ? activeClass : 'text-neutral-600 dark:text-neutral-400'}`}
          >
            <svg
              className="w-4 h-4 text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>My Profile</span>
          </button>
          <button
            onClick={(event) => {
              const result = function (event) {
                logoutUser();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 w-full text-xs font-semibold"
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
    </>
  );
}
