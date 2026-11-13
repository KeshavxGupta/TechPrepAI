import UserSidebar from '../components/UserSidebar.jsx';
export default function PlannerPage() {
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
                    Notes &amp; Study Planner
                  </span>
                </div>
              </div>
            </div>
            {/* Right Header Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* New Note Button */}
              <button
                onClick={(event) => {
                  const result = function (event) {
                    openModal('note-modal');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="hidden sm:inline">New Note</span>
                <span className="sm:hidden">Note</span>
              </button>
              {/* Add Task Button */}
              <button
                onClick={(event) => {
                  const result = function (event) {
                    openModal('task-modal');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center space-x-1.5"
              >
                <i className="fa-solid fa-plus text-xs text-blue-500" />
                <span className="hidden sm:inline">Add Task</span>
                <span className="sm:hidden">Task</span>
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
        {/* Main Content Area */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1 w-full text-left max-w-7xl mx-auto space-y-6">
          {/* Page Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <svg
                  className="w-6 h-6 text-rose-500"
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
                Notes &amp; Daily Study Planner
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                Organize core CS notes, structure daily practice milestones, and track your active
                study streak.
              </p>
            </div>
          </div>
          {/* 2-Column Responsive Layout: Smart Notes + Study Planner */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            {/* Left Column: Smart Notes */}
            <section className="p-5 sm:p-6 rounded-2xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col gap-5">
              <div className="flex flex-wrap gap-3 justify-between items-center">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-note-sticky text-blue-500" /> Smart Revision Notes
                </h2>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {/* Search Bar */}
                  <div className="flex-1 sm:flex-none flex items-center bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg py-1.5 px-3 w-full sm:w-56 focus-within:border-blue-500 transition-colors">
                    <i className="fa-solid fa-search text-neutral-400 mr-2 text-xs" />
                    <input
                      type="text"
                      id="global-search"
                      placeholder="Search notes..."
                      className="bg-transparent border-none text-neutral-900 dark:text-white w-full outline-none text-xs"
                    />
                  </div>
                  <button
                    onClick={(event) => {
                      const result = function (event) {
                        openModal('note-modal');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
                  >
                    <i className="fa-solid fa-plus" /> New Note
                  </button>
                </div>
              </div>
              {/* Category Pill Filters */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                <button
                  className="filter-btn active py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="all"
                >
                  All
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="dsa"
                >
                  DSA
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="core"
                >
                  Core CS
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="interview"
                >
                  Interview
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="system_design"
                >
                  System Design
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="webdev"
                >
                  Web Dev
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="database"
                >
                  Database
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="os"
                >
                  OS
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="aiml"
                >
                  AI / ML
                </button>
                <button
                  className="filter-btn py-1 px-3 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue-500 hover:text-blue-500 transition-colors whitespace-nowrap text-[11px]"
                  data-filter="other"
                >
                  Other
                </button>
              </div>
              {/* Notes Cards Container */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[620px] overflow-y-auto pr-1"
                id="notes-container"
              >
                {/* Dynamically populated by script.js */}
              </div>
            </section>
            {/* Right Column: Study Planner & Tracker */}
            <section className="p-5 sm:p-6 rounded-2xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                  <i className="fa-solid fa-calendar-check text-rose-500" /> Daily Study Planner
                </h2>
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      openModal('task-modal');
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <i className="fa-solid fa-plus text-xs text-blue-500" /> Add Task
                </button>
              </div>
              {/* Activity Streak Heatmap */}
              <div className="p-4 rounded-xl bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                    <svg
                      className="w-3.5 h-3.5 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                      />
                    </svg>
                    <span>Activity Streak</span>
                  </h3>
                  <span className="text-[10px] text-neutral-500 font-mono">Last 12 Weeks</span>
                </div>
                <div className="overflow-x-auto w-full pb-1">
                  <div id="heatmap-grid" className="inline-grid grid-rows-7 grid-flow-col gap-1" />
                </div>
              </div>
              {/* Planner Tabs */}
              <div className="flex bg-surface-secondary rounded-xl p-1 border border-neutral-200 dark:border-neutral-700 text-xs">
                <button
                  className="tab-btn active flex-1 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 transition-all font-medium"
                  data-tab="daily"
                >
                  Daily Goals
                </button>
                <button
                  className="tab-btn flex-1 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 transition-all font-medium"
                  data-tab="weekly"
                >
                  Weekly Targets
                </button>
                <button
                  className="tab-btn flex-1 py-1.5 rounded-lg text-neutral-600 dark:text-neutral-400 transition-all font-medium"
                  data-tab="monthly"
                >
                  Milestones
                </button>
              </div>
              {/* Tasks List Container */}
              <div
                className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1"
                id="tasks-container"
              >
                {/* Dynamically populated by script.js */}
              </div>
              {/* Progress Bar & Analytics */}
              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex justify-between items-center text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <i className="fa-solid fa-chart-pie text-blue-500" /> Plan Completion
                  </span>
                  <span
                    id="progress-text"
                    className="text-blue-600 dark:text-blue-400 font-mono font-bold"
                  >
                    0%
                  </span>
                </div>
                <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    id="progress-fill"
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </section>
          </div>
        </main>
        {/* Footer */}
        <footer className="py-6 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 transition-colors">
          © 2026 TechPrep AI, Inc. All rights reserved. • Student Technical Hub
        </footer>
      </div>
      {/* Modals & Slide-Over Drawer */}
      {/* Note Modal (Fullscreen on mobile, large centered dialog on desktop) */}
      <div
        className="modal-overlay fixed inset-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center z-[1000] opacity-0 pointer-events-none transition-opacity duration-300"
        id="note-modal"
      >
        <div className="modal-card bg-surface-elevated w-full h-full max-w-5xl md:h-[90vh] md:rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex flex-col transition-transform duration-300">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3
              id="note-modal-title"
              className="text-base font-bold text-neutral-900 dark:text-white"
            >
              Create New Revision Note
            </h3>
            <button
              className="close-btn text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-lg p-1"
              data-modal="note-modal"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            {/* Title Input */}
            <input
              type="text"
              id="note-title"
              placeholder="Note Title (e.g. Dynamic Programming Patterns)"
              className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white text-base font-semibold outline-none focus:border-blue-500 transition-all shrink-0"
            />
            {/* Editor Toolbar & Textarea */}
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden flex flex-col relative flex-1 min-h-[160px] bg-surface-primary">
              <div className="p-2 border-b border-neutral-200 dark:border-neutral-700 bg-surface-secondary flex items-center gap-2 flex-wrap text-xs text-neutral-700 dark:text-neutral-300">
                <select
                  className="toolbar-select bg-surface-primary border border-neutral-200 dark:border-neutral-700 rounded p-1 text-xs outline-none"
                  data-action="fontSize"
                >
                  <option value={3}>Normal Size</option>
                  <option value={1}>Small Size</option>
                  <option value={5}>Heading</option>
                </select>
                <span className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700" />
                <button
                  type="button"
                  className="toolbar-btn w-6 h-6 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                  data-action="bold"
                  title="Bold"
                >
                  <i className="fa-solid fa-bold" />
                </button>
                <button
                  type="button"
                  className="toolbar-btn w-6 h-6 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                  data-action="italic"
                  title="Italic"
                >
                  <i className="fa-solid fa-italic" />
                </button>
                <button
                  type="button"
                  className="toolbar-btn w-6 h-6 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                  data-action="underline"
                  title="Underline"
                >
                  <i className="fa-solid fa-underline" />
                </button>
                <span className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700" />
                <button
                  type="button"
                  className="toolbar-btn w-6 h-6 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                  data-action="justifyLeft"
                  title="Align Left"
                >
                  <i className="fa-solid fa-align-left" />
                </button>
                <button
                  type="button"
                  className="toolbar-btn w-6 h-6 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                  data-action="justifyCenter"
                  title="Align Center"
                >
                  <i className="fa-solid fa-align-center" />
                </button>
                <span className="w-[1px] h-4 bg-neutral-300 dark:bg-neutral-700" />
                <button
                  type="button"
                  className="toolbar-btn w-6 h-6 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                  data-action="insertTable"
                  title="Insert Table"
                >
                  <i className="fa-solid fa-table" />
                </button>
                <button
                  type="button"
                  className="toolbar-btn w-6 h-6 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center"
                  id="insert-image-btn"
                  title="Insert Image"
                >
                  <i className="fa-solid fa-image" />
                </button>
              </div>
              <div
                id="note-editor"
                contentEditable="true"
                className="flex-1 p-4 outline-none overflow-y-auto text-xs sm:text-sm text-neutral-900 dark:text-white prose dark:prose-invert max-w-none"
                placeholder="Write your notes here (supports markdown & LaTeX $$)..."
              />
              <input type="file" id="image-upload-input" accept="image/*" className="hidden" />
            </div>
            {/* Meta Options: Category, Theme Color, Spaced Repetition */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs shrink-0">
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Category
                </label>
                <select
                  id="note-category"
                  className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white outline-none"
                >
                  <option value="dsa">DSA</option>
                  <option value="core">Core CS</option>
                  <option value="interview">Interview</option>
                  <option value="system_design">System Design</option>
                  <option value="webdev">Web Dev</option>
                  <option value="database">Database &amp; SQL</option>
                  <option value="networking">Networking</option>
                  <option value="os">Operating Systems</option>
                  <option value="aiml">AI / ML</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Color Tag
                </label>
                <div className="flex items-center gap-2 pt-1" id="color-swatches">
                  <button
                    type="button"
                    className="color-swatch active w-6 h-6 rounded-full"
                    data-color="#4f46e5"
                    style={{ backgroundColor: '#4f46e5' }}
                  />
                  <button
                    type="button"
                    className="color-swatch w-6 h-6 rounded-full"
                    data-color="#059669"
                    style={{ backgroundColor: '#059669' }}
                  />
                  <button
                    type="button"
                    className="color-swatch w-6 h-6 rounded-full"
                    data-color="#e11d48"
                    style={{ backgroundColor: '#e11d48' }}
                  />
                  <button
                    type="button"
                    className="color-swatch w-6 h-6 rounded-full"
                    data-color="#d97706"
                    style={{ backgroundColor: '#d97706' }}
                  />
                  <button
                    type="button"
                    className="color-swatch w-6 h-6 rounded-full"
                    data-color="#0891b2"
                    style={{ backgroundColor: '#0891b2' }}
                  />
                  <input type="hidden" id="note-color" defaultValue="#4f46e5" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Active Recall / Revision
                </label>
                <div className="flex items-center gap-2 pt-0.5">
                  <input
                    type="checkbox"
                    id="note-active-recall"
                    className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    defaultChecked
                  />
                  <select
                    id="sr-interval"
                    className="p-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white text-xs outline-none flex-1"
                  >
                    <option value="standard">Standard (3, 7, 14d)</option>
                    <option value="weekly">Weekly (7, 14, 21d)</option>
                    <option value="monthly">Monthly (30, 60d)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2.5 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              className="close-btn px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              data-modal="note-modal"
            >
              Cancel
            </button>
            <button
              id="save-note-btn"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
      {/* Task Modal */}
      <div
        className="modal-overlay fixed inset-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center z-[1000] opacity-0 pointer-events-none transition-opacity duration-300"
        id="task-modal"
      >
        <div className="modal-card bg-surface-elevated rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-[92%] max-w-md p-6 scale-95 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-800">
            <h3
              id="task-modal-title"
              className="text-base font-bold text-neutral-900 dark:text-white"
            >
              Add Study Task
            </h3>
            <button
              className="close-btn text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-lg p-1"
              data-modal="task-modal"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
          <div className="space-y-4 text-xs font-medium text-neutral-700 dark:text-neutral-300">
            <div className="space-y-1.5">
              <label className="block">Task Description *</label>
              <textarea
                id="task-title"
                placeholder="e.g. Solve 3 LeetCode Binary Search Tree problems..."
                rows="2.5"
                className="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white outline-none focus:border-blue-500"
                defaultValue={''}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="block">Timeline</label>
                <select
                  id="task-type"
                  className="w-full p-2 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white outline-none"
                >
                  <option value="daily">Daily Goal</option>
                  <option value="weekly">Weekly Target</option>
                  <option value="monthly">Milestone</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block">Priority</label>
                <select
                  id="task-priority"
                  className="w-full p-2 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white outline-none"
                >
                  <option value="high">High</option>
                  <option value="medium" selected>
                    Medium
                  </option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block">Deadline</label>
                <input
                  type="date"
                  id="task-deadline"
                  className="w-full p-2 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white outline-none"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block">Resource Link (Optional)</label>
              <input
                type="url"
                id="task-resource"
                placeholder="https://leetcode.com/problem..."
                className="w-full p-2.5 bg-surface-secondary border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2.5 mt-5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <button
              className="close-btn px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              data-modal="task-modal"
            >
              Cancel
            </button>
            <button
              id="save-task-btn"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              Add Task
            </button>
          </div>
        </div>
      </div>
      {/* Image Upload Modal */}
      <div
        className="modal-overlay fixed inset-0 bg-neutral-950/60 backdrop-blur-sm flex items-center justify-center z-[1000] opacity-0 pointer-events-none transition-opacity duration-300"
        id="image-modal"
      >
        <div className="modal-card bg-surface-elevated rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 w-[92%] max-w-md p-6 scale-95 transition-transform duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Insert Image</h3>
            <button
              className="close-btn text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-lg p-1"
              data-modal="image-modal"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
          <div
            id="image-dropzone"
            className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-8 flex flex-col items-center justify-center gap-2 text-center bg-surface-secondary hover:border-blue-500 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-cloud-arrow-up text-3xl text-blue-500 mb-1" />
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
              Drag &amp; drop an image here
            </p>
            <p className="text-[10px] text-neutral-500">or click to browse files</p>
            <button
              id="dropzone-click-btn"
              className="mt-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold border border-blue-500/20"
            >
              Browse
            </button>
          </div>
        </div>
      </div>
      {/* Note Preview Slide-Over Drawer */}
      <div
        className="drawer-overlay fixed inset-0 bg-neutral-950/60 backdrop-blur-sm z-[990] opacity-0 pointer-events-none transition-opacity duration-300"
        id="drawer-overlay"
        onClick={(event) => {
          const result = function (event) {
            closeDrawer();
          }.call(event.currentTarget, event);
          if (result === false) {
            event.preventDefault();
          }
        }}
      />
      <div
        className="note-drawer fixed top-0 right-0 h-screen w-full max-w-lg bg-surface-elevated shadow-2xl z-[1000] transform translate-x-full transition-transform duration-300 flex flex-col border-l border-neutral-200 dark:border-neutral-800"
        id="note-drawer"
      >
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-surface-secondary sticky top-0 z-10">
          <h2
            id="drawer-title"
            className="text-base font-bold text-neutral-900 dark:text-white truncate pr-3"
          >
            Note Title
          </h2>
          <div className="flex items-center gap-3">
            <button
              id="fullscreen-drawer-btn"
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-sm"
              title="Toggle Fullscreen"
            >
              <i className="fa-solid fa-expand" />
            </button>
            <button
              id="download-drawer-btn"
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-sm"
              title="Download Note (.md)"
            >
              <i className="fa-solid fa-download" />
            </button>
            <button
              id="close-drawer-btn"
              onClick={(event) => {
                const result = function (event) {
                  closeDrawer();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-400 hover:text-rose-500 text-lg leading-none p-1"
            >
              <i className="fa-solid fa-times" />
            </button>
          </div>
        </div>
        <div
          className="p-6 overflow-y-auto flex-1 prose dark:prose-invert max-w-none text-xs sm:text-sm text-neutral-800 dark:text-neutral-200"
          id="drawer-content"
        />
      </div>
      {/* Marked.js & MathJax Scripts */}
      {/* Core Scripts */}
    </>
  );
}
