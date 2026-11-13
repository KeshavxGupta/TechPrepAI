import UserSidebar from '../components/UserSidebar.jsx';
export default function PlacementsPage() {
  return (
    <>
      {/* Student Sidebar Component */}
      <UserSidebar />
      {/* Right Dashboard Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        {/* Top Navbar Header */}
        <header className="sticky top-0 z-20 bg-surface-primary/90 subtle-glass border-b border-neutral-200 dark:border-neutral-800 transition-colors w-full">
          <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
            {/* Left: Hamburger Toggle & Page Breadcrumb */}
            <div className="flex items-center space-x-3">
              <button
                onClick={(event) => {
                  const result = function (event) {
                    toggleUserSidebar();
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
              <div>
                <div className="text-xs font-semibold text-neutral-500 flex items-center gap-1.5">
                  <span>Student Portal</span>
                  <span className="text-neutral-400">/</span>
                  <span className="text-neutral-900 dark:text-white font-bold">
                    Placement Tracker
                  </span>
                </div>
              </div>
            </div>
            {/* Right Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Archived Jobs Button */}
              <button
                onClick={(event) => {
                  const result = function (event) {
                    toggleArchivePanel(true);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center space-x-1.5"
                title="View Archived Applications"
              >
                <i className="fa-solid fa-archive text-neutral-400 text-xs" />
                <span className="hidden md:inline">Archived</span>
              </button>
              {/* Backup Dropdown */}
              <div className="relative group">
                <button
                  className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors"
                  title="Backup & Restore Options"
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
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 z-50 hidden group-hover:block py-1">
                  <button
                    onClick={(event) => {
                      const result = function (event) {
                        exportData();
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-download text-blue-500" /> Export Backup (.json)
                  </button>
                  <button
                    onClick={(event) => {
                      const result = function (event) {
                        document.getElementById('import-file').click();
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                  >
                    <i className="fa-solid fa-upload text-purple-500" /> Import Backup (.json)
                  </button>
                </div>
                <input
                  type="file"
                  id="import-file"
                  accept=".json"
                  className="hidden"
                  onChange={(event) => {
                    const result = function (event) {
                      importData(event);
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                />
              </div>
              {/* Home Link */}
              <a
                href="../../index.html"
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:block"
              >
                Home
              </a>
              {/* Theme Toggle */}
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
              <button
                onClick={(event) => {
                  const result = function (event) {
                    switchDashboardTab('profile');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="flex items-center space-x-2 pl-2 border-l border-neutral-200 dark:border-neutral-800 hover:opacity-80 transition-all"
              >
                <div
                  id="user-avatar-initials"
                  className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono select-none"
                >
                  ST
                </div>
                <span
                  id="user-display-name"
                  className="hidden sm:block text-xs font-semibold text-neutral-800 dark:text-neutral-200"
                >
                  Student
                </span>
              </button>
            </div>
          </div>
        </header>
        {/* Main Content Container */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full text-left max-w-7xl mx-auto space-y-6">
          {/* Page Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
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
                Placement Application Tracker
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                Organize job applications, track technical assessments, and monitor your interview
                pipelines.
              </p>
            </div>
          </div>
          {/* Reminder Banner Container */}
          <div id="reminder-banner-container" className="w-full flex flex-col gap-3 empty:hidden" />
          {/* Top Section: Stats & Funnel Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Summary Statistics (8 Cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4" id="summary-stats">
              {/* Dynamic Stats injected here by placements.js */}
            </div>
            {/* Weekly Target Tracker (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-surface-elevated/70 subtle-glass border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between gap-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <i className="fa-solid fa-bullseye text-blue-500" />
                  <span>Weekly Target Goal</span>
                  <i
                    className="fa-solid fa-circle-info text-neutral-400 hover:text-blue-500 cursor-pointer text-xs ml-1"
                    onClick={(event) => {
                      const result = function (event) {
                        openWeeklyInfoModal();
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  />
                </h3>
                <div className="flex items-center gap-2">
                  <span
                    id="weekly-count-text"
                    className="text-xs font-bold font-mono text-blue-600 dark:text-blue-400"
                  >
                    0 / 10 Apps
                  </span>
                  <button
                    onClick={(event) => {
                      const result = function (event) {
                        openTargetEditor();
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                    title="Edit Target"
                    className="p-1 rounded text-neutral-400 hover:text-blue-500 transition-colors text-xs"
                  >
                    <i className="fa-solid fa-pen-to-square" />
                  </button>
                </div>
              </div>
              {/* Inline Target Editor */}
              <div
                id="weekly-target-editor"
                className="hidden flex items-center gap-2 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-xl p-2"
              >
                <label className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
                  Target:
                </label>
                <input
                  type="number"
                  id="weekly-target-input"
                  min={1}
                  max={100}
                  defaultValue={10}
                  className="w-full px-2 py-1 text-xs rounded-lg bg-surface-primary border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:border-blue-500 font-mono"
                />
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      saveWeeklyTarget();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="px-2.5 py-1 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      closeTargetEditor();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  <i className="fa-solid fa-times" />
                </button>
              </div>
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    id="weekly-progress-bar"
                    className="h-2.5 rounded-full bg-blue-600 transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
                <p id="weekly-percentage-text" className="text-[11px] text-neutral-500 font-medium">
                  0% Completed this week. Keep going!
                </p>
              </div>
            </div>
          </div>
          {/* Main Full-Width Kanban Board Workspace */}
          <div className="w-full space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
                  Active Recruitment Pipeline
                </h2>
                <span className="text-xs text-neutral-500">(Drag cards between stages)</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      scrollKanban('left');
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                  title="Scroll Left"
                >
                  <i className="fa-solid fa-chevron-left text-xs" />
                </button>
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      scrollKanban('right');
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
                  title="Scroll Right"
                >
                  <i className="fa-solid fa-chevron-right text-xs" />
                </button>
              </div>
            </div>
            <div className="relative w-full overflow-hidden group">
              {/* Scrollable Kanban Container */}
              <div
                className="flex flex-nowrap gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full px-1"
                id="kanban-scroll-container"
                onMouseEnter={(event) => {
                  const result = function (event) {
                    stopKanbanAutoScroll();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                onMouseLeave={(event) => {
                  const result = function (event) {
                    startKanbanAutoScroll();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                onTouchStart={(event) => {
                  const result = function (event) {
                    stopKanbanAutoScroll();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                onTouchEnd={(event) => {
                  const result = function (event) {
                    startKanbanAutoScroll();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
              >
                <div className="flex flex-nowrap gap-5 min-w-max" id="kanban-board">
                  {/* Columns dynamically injected here by placements.js */}
                </div>
              </div>
            </div>
          </div>
          {/* Bottom Milestones & Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
            {/* Upcoming Deadlines & Interviews (8 Cols) */}
            <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-surface-elevated/70 subtle-glass border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                  <i className="fa-regular fa-calendar-check text-blue-500" /> Upcoming Deadlines
                  &amp; Interview Rounds
                </h3>
                <span className="text-[11px] font-mono text-neutral-400">Nearest milestones</span>
              </div>
              <div id="upcoming-jobs-list" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Dynamically populated by placements.js */}
              </div>
            </div>
            {/* Funnel Doughnut Chart (4 Cols) */}
            <div className="lg:col-span-4 p-5 rounded-2xl bg-surface-elevated/70 subtle-glass border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col items-center justify-center min-h-[180px]">
              <canvas id="placementFunnelChart" className="w-full h-full max-h-[160px]" />
            </div>
          </div>
        </main>
        {/* Footer */}
        <footer className="py-6 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 transition-colors">
          © 2026 TechPrep AI, Inc. All rights reserved. • Student Technical Hub
        </footer>
      </div>
      {/* Modals & Drawers */}
      {/* Modal Backdrop Overlay */}
      <div
        className="modal-overlay fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[990] opacity-0 pointer-events-none transition-opacity duration-300"
        id="app-modal-overlay"
      />
      {/* View Job Details Modal */}
      <div
        className="modal-overlay fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[1050] opacity-0 pointer-events-none transition-opacity duration-300"
        id="view-job-overlay"
        onClick={(event) => {
          const result = function (event) {
            closeJobDetails();
          }.call(event.currentTarget, event);
          if (result === false) {
            event.preventDefault();
          }
        }}
      />
      <div
        className="modal fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-lg bg-surface-elevated rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 z-[1100] opacity-0 pointer-events-none scale-95 transition-all duration-300 flex flex-col max-h-[90vh]"
        id="view-job-modal"
      >
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div
              id="view-job-logo"
              className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-lg text-blue-600 dark:text-blue-400 border border-neutral-200 dark:border-neutral-700 shrink-0"
            >
              C
            </div>
            <div>
              <h3
                id="view-job-role"
                className="text-base font-bold text-neutral-900 dark:text-white leading-tight"
              >
                Role
              </h3>
              <p id="view-job-company" className="text-xs text-neutral-500 font-medium mt-0.5">
                Company
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span
                  id="view-job-location-badge"
                  className="hidden text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                >
                  <span id="view-job-location">Remote</span>
                </span>
                <span
                  id="view-job-eligibility"
                  className="hidden text-[10px] px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                />
              </div>
              <div className="flex gap-2 mt-2" id="view-job-badges" />
            </div>
          </div>
          <button
            onClick={(event) => {
              const result = function (event) {
                closeJobDetails();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-lg p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Package
              </span>
              <span
                id="view-job-package"
                className="text-lg font-black text-emerald-600 dark:text-emerald-400"
              >
                N/A
              </span>
            </div>
            <div className="p-3 rounded-xl bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                Timeline
              </span>
              <div className="text-[11px] text-neutral-600 dark:text-neutral-400 space-y-0.5">
                <p>
                  Applied:{' '}
                  <span
                    id="view-job-applied-date"
                    className="font-semibold text-neutral-900 dark:text-white"
                  >
                    N/A
                  </span>
                </p>
                <p>
                  Updated:{' '}
                  <span
                    id="view-job-updated-date"
                    className="font-semibold text-neutral-900 dark:text-white"
                  >
                    N/A
                  </span>
                </p>
                <p>
                  Deadline:{' '}
                  <span
                    id="view-job-deadline-date"
                    className="font-semibold text-neutral-900 dark:text-white"
                  >
                    N/A
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Notes &amp; Details
            </span>
            <div
              id="view-job-notes"
              className="p-3 rounded-xl bg-surface-secondary border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap min-h-[60px]"
            >
              No notes provided.
            </div>
          </div>
          <div id="view-job-link-container" className="hidden">
            <a
              id="view-job-link"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
            >
              <span>Open Job Portal</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-2.5 bg-surface-secondary rounded-b-2xl">
          <button
            onClick={(event) => {
              const result = function (event) {
                closeJobDetails();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
      {/* Archived Applications Panel */}
      <div
        id="archive-panel"
        className="hidden fixed inset-0 z-[1050] bg-neutral-950/60 backdrop-blur-sm flex justify-end"
        onClick={(event) => {
          const result = function (event) {
            if (event.target === this) toggleArchivePanel(false);
          }.call(event.currentTarget, event);
          if (result === false) {
            event.preventDefault();
          }
        }}
      >
        <div className="bg-surface-elevated w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto flex flex-col border-l border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold flex items-center gap-2 text-neutral-900 dark:text-white">
              <i className="fa-solid fa-archive text-blue-500" /> Archived Applications
            </h3>
            <button
              onClick={(event) => {
                const result = function (event) {
                  toggleArchivePanel(false);
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-lg p-1"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
          <div id="archived-jobs-list" className="flex flex-col gap-3 mt-4 flex-1">
            {/* Injected dynamically */}
          </div>
        </div>
      </div>
      {/* Master List View Modal */}
      <div
        id="master-list-modal"
        className="fixed inset-0 z-[1050] bg-surface-primary hidden overflow-y-auto"
      >
        <div className="sticky top-0 z-10 bg-surface-primary/95 subtle-glass border-b border-neutral-200 dark:border-neutral-800 p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeMasterListView();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-arrow-left" /> Back to Dashboard
            </button>
            <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
              All Applications (Master Grid)
            </h2>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeMasterListView();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
        </div>
        <div id="master-list-container" className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
          <div
            id="master-list-tabs"
            className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto"
          />
          <div id="master-list-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12" />
        </div>
      </div>
      {/* Custom Confirmation Modal */}
      <div
        id="custom-confirm-modal"
        className="fixed inset-0 z-[1150] bg-neutral-950/60 backdrop-blur-sm hidden flex items-center justify-center p-4"
      >
        <div className="bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
          <div className="mx-auto w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center mb-3">
            <i className="fa-solid fa-triangle-exclamation text-lg" />
          </div>
          <h3
            id="confirm-modal-title"
            className="text-base font-bold text-neutral-900 dark:text-white mb-1"
          >
            Delete Item?
          </h3>
          <p id="confirm-modal-message" className="text-xs text-neutral-500 mb-5">
            Are you sure you want to delete this?
          </p>
          <div className="flex gap-2.5">
            <button
              id="confirm-cancel-btn"
              className="flex-1 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-action-btn"
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      {/* Weekly Info Modal */}
      <div
        id="weekly-info-modal"
        className="fixed inset-0 z-[1050] bg-neutral-950/60 backdrop-blur-sm hidden flex items-center justify-center p-4"
        onClick={(event) => {
          const result = function (event) {
            if (event.target === this) closeWeeklyInfoModal();
          }.call(event.currentTarget, event);
          if (result === false) {
            event.preventDefault();
          }
        }}
      >
        <div className="bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-left">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-3">
            Weekly Applications Goal
          </h3>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
            Maintaining steady consistency in applying to Tier-1, startups, and on-campus
            recruitment drives drastically boosts interview conversion rates. Set a weekly target
            (e.g. 10 applications) to stay accountable.
          </p>
          <div className="flex justify-end">
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeWeeklyInfoModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
      {/* Toast Notification Container */}
      <div
        id="toast-container"
        className="fixed bottom-5 right-5 z-[1200] flex flex-col gap-2.5 pointer-events-none"
      />
      {/* Core Scripts */}
    </>
  );
}
