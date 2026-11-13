export default function ResumeBuilderPage() {
  return (
    <>
      {/* TOP WORKSPACE NAVIGATION HEADER */}
      <header className="h-14 border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 subtle-glass px-3 sm:px-4 flex items-center justify-between shrink-0 no-print relative z-40 gap-2">
        {/* Left: Logo & Editable Title */}
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
          <a href="../../index.html" className="flex items-center gap-2 shrink-0 select-none group">
            {/* Shield & Brain Vector Mark */}
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-[#0D1520] border border-[#00FFC2]/30 shadow-[0_0_12px_rgba(0,255,194,0.15)] shrink-0">
              <svg
                className="w-5 h-5 text-[#00FFC2]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path
                  d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  fill="#00FFC2"
                  fillOpacity="0.08"
                />
                <path d="M12 8v4" stroke="#38BDF8" />
                <path d="M9.5 10.5l5 3" stroke="#38BDF8" />
                <circle cx={12} cy={7} r="1.2" fill="#00FFC2" />
                <circle cx="8.5" cy={11} r="1.2" fill="#00FFC2" />
                <circle cx="15.5" cy={11} r="1.2" fill="#00FFC2" />
                <circle cx={12} cy={16} r="1.2" fill="#00FFC2" />
                <path d="M10 14.5l2 1.5 2-1.5" stroke="#38BDF8" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-tight font-sans text-neutral-900 dark:text-white hidden lg:inline">
              TechPrep <span className="text-[#00FFC2]">AI</span>
            </span>
          </a>
          {/* Title Input with Auto-Save Badge */}
          <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-neutral-200 dark:border-neutral-800 min-w-0">
            <input
              type="text"
              id="res-title-input"
              onInput={(event) => {
                const result = function (event) {
                  handleResumeTitleChange(this.value);
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              defaultValue="Software Engineer Resume"
              className="p-1 rounded-md border border-transparent hover:border-neutral-300 dark:hover:border-neutral-700 focus:border-blue-500 bg-transparent text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none w-28 sm:w-44 truncate"
              title="Click to rename resume"
            />
            <span
              id="res-autosave-indicator"
              className="hidden sm:inline-flex items-center space-x-1 text-[10px] font-mono text-neutral-400 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Saved</span>
            </span>
          </div>
        </div>
        {/* Center: Main Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative z-50">
          {/* Sample Profiles Dropdown */}
          <div className="relative inline-block text-left">
            <button
              id="res-sample-menu-btn"
              onClick={(event) => {
                const result = function (event) {
                  toggleSampleProfileDropdown();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors shadow-sm flex items-center space-x-1"
            >
              <svg
                className="w-3.5 h-3.5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <span className="hidden sm:inline">Load Sample</span>
              <svg
                className="w-3 h-3 ml-0.5 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id="res-sample-dropdown"
              className="origin-top-left sm:origin-top-right absolute left-0 sm:right-auto mt-2 w-56 rounded-xl shadow-2xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 ring-1 ring-black/10 z-[100] hidden py-1 animate-modal-scale-in"
            >
              <div className="px-3 py-2 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-400 font-bold uppercase">
                Starter ATS Profiles
              </div>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    loadSampleProfilePreset('fullstack');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-blue-500 shrink-0"
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
                <span>Full-Stack SDE (Mid-Senior)</span>
              </button>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    loadSampleProfilePreset('aiml');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-purple-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>AI &amp; Machine Learning Eng</span>
              </button>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    loadSampleProfilePreset('devops');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-cyan-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 00-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
                <span>Cloud &amp; DevOps Platform Eng</span>
              </button>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    loadSampleProfilePreset('intern');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
                <span>CS Student / SDE Intern</span>
              </button>
            </div>
          </div>
          {/* AI Bullet Enhancer Button */}
          <button
            onClick={(event) => {
              const result = function (event) {
                openBulletEnhancerModal();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="px-2.5 py-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs transition-colors shadow-sm flex items-center space-x-1"
            title="AI Action Verbs & Bullet Formula Generator"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="hidden md:inline">AI Bullet Helper</span>
          </button>
          {/* ATS Score Badge Button */}
          <button
            onClick={(event) => {
              const result = function (event) {
                openATSCheckerModal();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            id="top-ats-badge-btn"
            className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-md flex items-center space-x-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="hidden sm:inline">ATS Score:</span>
            <span
              id="top-ats-score-text"
              className="font-mono bg-blue-800/80 px-1.5 py-0.5 rounded text-[11px]"
            >
              94%
            </span>
          </button>
          {/* Import / Export Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={(event) => {
                const result = function (event) {
                  toggleExportDropdown();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-md flex items-center space-x-1"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Export</span>
              <svg className="w-3 h-3 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              id="res-export-dropdown"
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-xl shadow-2xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 ring-1 ring-black/10 z-[100] hidden py-1 animate-modal-scale-in"
            >
              <button
                onClick={(event) => {
                  const result = function (event) {
                    exportResumePDF();
                    toggleExportDropdown();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-emerald-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                <span>Print / Export PDF</span>
              </button>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    openImportExportModal('export-json');
                    toggleExportDropdown();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span>Save Data (JSON)</span>
              </button>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    openImportExportModal('import-json');
                    toggleExportDropdown();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l4-4m0 0l4 4m-4-4v12"
                  />
                </svg>
                <span>Import Data (JSON)</span>
              </button>
              <button
                onClick={(event) => {
                  const result = function (event) {
                    copyResumeAsMarkdown();
                    toggleExportDropdown();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="w-full text-left px-3 py-2 text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center space-x-2"
              >
                <svg
                  className="w-3.5 h-3.5 text-neutral-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
                <span>Copy as Plain Text</span>
              </button>
            </div>
          </div>
        </div>
        {/* Right Controls: History, Theme, Dashboard */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={(event) => {
              const result = function (event) {
                openDraftsHistoryModal();
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="hidden sm:inline-flex px-2.5 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors shadow-sm"
            title="Manage Saved Resumes"
          >
            Drafts
          </button>
          {/* Theme Switcher */}
          <button
            className="theme-toggle-btn p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 transition-colors text-xs"
            title="Toggle Theme"
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
          <a
            href="../user/dashboard.html"
            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Dashboard
          </a>
        </div>
      </header>
      {/* MOBILE / TABLET VIEWPORT TAB SWITCHER (Hidden on lg screens) */}
      <div className="lg:hidden flex items-center justify-around border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary px-2 py-1.5 no-print shrink-0">
        <button
          onClick={(event) => {
            const result = function (event) {
              switchMobileWorkspaceTab('editor');
            }.call(event.currentTarget, event);
            if (result === false) {
              event.preventDefault();
            }
          }}
          id="mob-tab-editor"
          className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm transition-all"
        >
          Form Editor
        </button>
        <button
          onClick={(event) => {
            const result = function (event) {
              switchMobileWorkspaceTab('preview');
            }.call(event.currentTarget, event);
            if (result === false) {
              event.preventDefault();
            }
          }}
          id="mob-tab-preview"
          className="px-4 py-1.5 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all"
        >
          Live Preview
        </button>
        <button
          onClick={(event) => {
            const result = function (event) {
              openATSCheckerModal();
            }.call(event.currentTarget, event);
            if (result === false) {
              event.preventDefault();
            }
          }}
          className="px-3 py-1.5 text-xs font-medium rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 transition-all flex items-center space-x-1"
        >
          <span>ATS Audit</span>
          <span
            id="mob-ats-pill"
            className="text-[10px] font-mono bg-blue-500/20 px-1 py-0.2 rounded font-bold"
          >
            94%
          </span>
        </button>
      </div>
      {/* MAIN DUAL-PANEL WORKSPACE GRID */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden h-[calc(100vh-3.5rem)] min-h-0">
        {/* LEFT PANEL: Clean Continuous Form Sections (Scrollable & Fully Visible) */}
        <div
          id="res-editor-panel"
          className="lg:col-span-6 flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-surface-elevated overflow-y-auto h-full p-4 sm:p-6 space-y-6 text-left no-print resume-scroll-area overscroll-contain min-h-0"
        >
          {/* Top Form Header */}
          <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">
                Resume Information
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                (Live auto-syncs with preview)
              </span>
            </div>
          </div>
          {/* SECTION 1: Personal Contact Details */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Personal Info &amp; Contact
                </h3>
                <p className="text-[10px] text-neutral-500">
                  Name, target role, contact channels, and portfolio links
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="res-form-name"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. Alex Rivera"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Job Title
                </label>
                <input
                  type="text"
                  id="res-form-jobtitle"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. Full Stack Software Engineer"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="res-form-email"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. alex.rivera@example.com"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="res-form-phone"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. +1 (415) 890-2415"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Location (City, State / Country)
                </label>
                <input
                  type="text"
                  id="res-form-location"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  id="res-form-linkedin"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. linkedin.com/in/alexrivera"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  GitHub Profile
                </label>
                <input
                  type="text"
                  id="res-form-github"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. github.com/alexrivera"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Portfolio / Personal Website
                </label>
                <input
                  type="text"
                  id="res-form-portfolio"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. alexrivera.dev"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                  Professional Summary
                </label>
                <button
                  type="button"
                  onClick={(event) => {
                    const result = function (event) {
                      generateSummaryPrompt();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="text-[10px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center space-x-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span>Suggest Summary</span>
                </button>
              </div>
              <textarea
                id="res-form-summary"
                rows={3}
                onInput={(event) => {
                  const result = function (event) {
                    updateResumeDataFromForm();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                placeholder="High-impact 2-3 sentence executive summary showcasing your years of experience, core tech stack, and key metrics..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs leading-relaxed text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                defaultValue={''}
              />
            </div>
          </div>
          {/* SECTION 2: Work Experience */}
          <div className="space-y-3 pt-5 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Work Experience
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    Employment history, internships, roles &amp; quantified achievements
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  const result = function (event) {
                    addExperienceItem();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center space-x-1"
              >
                <span>+ Add Work Experience</span>
              </button>
            </div>
            <div id="res-exp-list-container" className="space-y-3">
              {/* Rendered dynamically */}
            </div>
          </div>
          {/* SECTION 3: Technical Projects */}
          <div className="space-y-3 pt-5 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Key Technical Projects
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    Full-stack apps, open source tools, system design prototypes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  const result = function (event) {
                    addProjectItem();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center space-x-1"
              >
                <span>+ Add Key Project</span>
              </button>
            </div>
            <div id="res-proj-list-container" className="space-y-3">
              {/* Rendered dynamically */}
            </div>
          </div>
          {/* SECTION 4: Categorized Technical Skills */}
          <div className="space-y-3 pt-5 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Categorized Skills Matrix
                </h3>
                <p className="text-[10px] text-neutral-500">
                  Languages, frameworks, cloud infrastructure, and core CS
                </p>
              </div>
            </div>
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Programming Languages
                </label>
                <input
                  type="text"
                  id="res-form-skills-lang"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. JavaScript (ES6+), TypeScript, Python, Go, C++, SQL"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Frameworks &amp; Libraries
                </label>
                <input
                  type="text"
                  id="res-form-skills-frameworks"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. React, Next.js, Node.js, Express, Tailwind CSS, FastAPI, Redux"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tools, Databases &amp; Cloud
                </label>
                <input
                  type="text"
                  id="res-form-skills-tools"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. Git, Docker, Kubernetes, AWS, PostgreSQL, Redis, GitHub Actions"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Core CS &amp; Architecture
                </label>
                <input
                  type="text"
                  id="res-form-skills-core"
                  onInput={(event) => {
                    const result = function (event) {
                      updateResumeDataFromForm();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="e.g. Data Structures & Algorithms, System Design, Microservices, REST APIs, OOP"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
          {/* SECTION 5: Education & Academics */}
          <div className="space-y-3 pt-5 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-xs">
                  5
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Education &amp; Academics
                  </h3>
                  <p className="text-[10px] text-neutral-500">
                    Degrees, colleges, graduation dates, CGPA, and coursework
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(event) => {
                  const result = function (event) {
                    addEducationItem();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center space-x-1"
              >
                <span>+ Add Education Entry</span>
              </button>
            </div>
            <div id="res-edu-list-container" className="space-y-3">
              {/* Rendered dynamically */}
            </div>
          </div>
          {/* SECTION 6: Certifications & Achievements */}
          <div className="space-y-4 pt-5 pb-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-md bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-xs">
                6
              </div>
              <div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Certifications &amp; Achievements
                </h3>
                <p className="text-[10px] text-neutral-500">
                  AWS/GCP certifications, Hackathons, LeetCode/CodeChef ratings
                </p>
              </div>
            </div>
            {/* Certifications */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 font-mono uppercase">
                  Certifications
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    const result = function (event) {
                      addCertificationItem();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  + Add Certification
                </button>
              </div>
              <div id="res-cert-list-container" className="space-y-2">
                {/* Rendered dynamically */}
              </div>
            </div>
            {/* Achievements */}
            <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 font-mono uppercase">
                  Honors &amp; Achievements
                </span>
                <button
                  type="button"
                  onClick={(event) => {
                    const result = function (event) {
                      addAchievementItem();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                >
                  + Add Achievement
                </button>
              </div>
              <div id="res-ach-list-container" className="space-y-2">
                {/* Rendered dynamically */}
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT PANEL: Fixed Live Canvas with Floating Customization Toolbar & Zoom (Stationary) */}
        <div
          id="res-preview-panel"
          className="lg:col-span-6 flex flex-col bg-neutral-950 h-full overflow-hidden relative min-h-0"
        >
          {/* Canvas Control Toolbar */}
          <div className="px-3 sm:px-4 py-2 bg-surface-elevated border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between shrink-0 no-print z-20 gap-2">
            {/* Left: Template Selector & Font Selector */}
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              {/* Template Picker Dropdown */}
              <select
                id="res-template-select"
                onChange={(event) => {
                  const result = function (event) {
                    selectResumeTemplate(this.value);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none"
              >
                {/* Loaded dynamically */}
              </select>
              {/* Font Picker */}
              <select
                id="res-font-select"
                onChange={(event) => {
                  const result = function (event) {
                    selectResumeFont(this.value);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
              >
                <option value="Inter, sans-serif">Inter (Modern)</option>
                <option value="Roboto, sans-serif">Roboto (Clean)</option>
                <option value="'JetBrains Mono', monospace">JetBrains Mono</option>
                <option value="Georgia, serif">Georgia (Serif)</option>
                <option value="'Outfit', sans-serif">Outfit (Display)</option>
              </select>
              {/* Spacing Density */}
              <select
                id="res-spacing-select"
                onChange={(event) => {
                  const result = function (event) {
                    selectResumeSpacing(this.value);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-medium text-neutral-900 dark:text-white focus:outline-none"
              >
                <option value="compact">Density: Compact</option>
                <option value="normal" selected>
                  Density: Normal
                </option>
                <option value="spacious">Density: Spacious</option>
              </select>
            </div>
            {/* Right: Color Swatches & Zoom Controls */}
            <div className="flex items-center space-x-3">
              {/* Color Swatches */}
              <div className="flex items-center space-x-1">
                <div id="res-color-palette-bar" className="flex items-center space-x-1">
                  {/* Loaded dynamically */}
                </div>
                {/* Custom Color Picker */}
                <input
                  type="color"
                  id="res-custom-color-picker"
                  onChange={(event) => {
                    const result = function (event) {
                      selectResumeAccentColor(this.value);
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="w-5 h-5 rounded-full border-0 cursor-pointer p-0 bg-transparent"
                  title="Custom Hex Color"
                />
              </div>
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 pl-2 border-l border-neutral-200 dark:border-neutral-800">
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      zoomPreview(-0.05);
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  title="Zoom Out"
                >
                  -
                </button>
                <span
                  id="res-zoom-label"
                  className="text-[11px] font-mono text-neutral-400 w-9 text-center"
                >
                  85%
                </span>
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      zoomPreview(0.05);
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      resetZoomPreview();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-[10px] font-mono hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  title="Fit to Screen"
                >
                  Fit
                </button>
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      openFullscreenModal();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="p-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                  title="Fullscreen View"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {/* Canvas Viewport (Stationary, Perfectly Fitted, Scroll-Isolated) */}
          <div
            id="res-canvas-scroll-container"
            className="flex-1 overflow-auto p-3 sm:p-5 flex items-start justify-center relative bg-grid-pattern resume-scroll-area overscroll-contain min-h-0"
          >
            <div
              id="resume-canvas-scaler"
              className="transition-transform duration-150 origin-top flex flex-col items-center"
            >
              {/* A4 Sheet Paper Container (794px standard width) */}
              <div
                id="resume-live-preview"
                className="w-[794px] min-h-[1123px] bg-white text-gray-900 rounded-sm shadow-2xl transition-all select-text text-left"
              >
                {/* Rendered dynamically */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ATS SCANNER & OPTIMIZER MODAL */}
      <div
        id="res-ats-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm no-print"
      >
        <div className="w-full max-w-3xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-left space-y-5 max-h-[90vh] overflow-y-auto resume-scroll-area animate-modal-scale-in">
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                  Real-Time ATS Compatibility &amp; Keyword Optimizer
                </h3>
                <p className="text-xs text-neutral-500">
                  Benchmark your resume against algorithmic applicant tracking systems (Workday,
                  Lever, Greenhouse)
                </p>
              </div>
            </div>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeATSCheckerModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
              title="Close"
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
          {/* Score Overview Hero */}
          <div className="p-5 rounded-xl bg-surface-secondary border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider block">
                Calculated ATS Compatibility
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span
                  id="ats-report-score"
                  className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 font-mono"
                >
                  94%
                </span>
                <span
                  id="ats-report-verdict"
                  className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                >
                  Tier-1 Tech Ready
                </span>
              </div>
            </div>
            <div className="w-full sm:w-64 space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-neutral-400">
                <span>Pass Threshold</span>
                <span>85%+ Target</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-3 rounded-full overflow-hidden">
                <div
                  id="ats-report-bar"
                  className="bg-blue-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: '94%' }}
                />
              </div>
            </div>
          </div>
          {/* 5-Dimensional Metric Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                Quantifiers &amp; Metrics
              </span>
              <div
                id="ats-quantifier-score"
                className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono"
              >
                25 / 25 pts
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                Numbers, %, scale, metrics detected
              </p>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                Action Verbs
              </span>
              <div
                id="ats-verbs-score"
                className="text-base font-bold text-blue-600 dark:text-blue-400 font-mono"
              >
                25 / 25 pts
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                Strong power verbs at bullet heads
              </p>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                Tech Keywords
              </span>
              <div
                id="ats-tech-score"
                className="text-base font-bold text-purple-600 dark:text-purple-400 font-mono"
              >
                18 / 20 pts
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                High-demand industry stacks
              </p>
            </div>
            <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 uppercase block">
                Contact &amp; Links
              </span>
              <div
                id="ats-contact-score"
                className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono"
              >
                15 / 15 pts
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                Email, phone, LinkedIn/GitHub
              </p>
            </div>
          </div>
          {/* Target Job Description Scanner */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-neutral-900 dark:text-white text-xs">
                Target Job Description Analyzer
              </label>
              <span className="text-[10px] text-neutral-400 font-mono">
                Paste JD to compare keyword overlap
              </span>
            </div>
            <textarea
              id="res-jd-input"
              rows={3}
              placeholder="Paste the job requirements / qualifications text here to run instant keyword overlap matching..."
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              defaultValue={''}
            />
            <div className="flex justify-end">
              <button
                onClick={(event) => {
                  const result = function (event) {
                    runATSJobAnalysis();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center space-x-1"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span>Scan Job Overlap</span>
              </button>
            </div>
          </div>
          {/* Keyword Overlap Badges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                  Found Tech Keywords
                </h4>
                <span id="ats-found-count" className="text-[10px] font-mono text-emerald-500">
                  14 found
                </span>
              </div>
              <div
                id="ats-report-matches"
                className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto"
              >
                {/* Loaded dynamically */}
              </div>
            </div>
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400 uppercase">
                  Recommended Keywords to Add
                </h4>
                <span id="ats-missing-count" className="text-[10px] font-mono text-rose-500">
                  4 recommended
                </span>
              </div>
              <div
                id="ats-report-missing"
                className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto"
              >
                {/* Loaded dynamically */}
              </div>
            </div>
          </div>
          {/* Actionable Suggestions */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-2">
            <h4 className="text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300 uppercase">
              Actionable ATS Suggestions
            </h4>
            <ul
              id="ats-report-suggestions"
              className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside"
            >
              {/* Loaded dynamically */}
            </ul>
          </div>
        </div>
      </div>
      {/* AI BULLET POINT ENHANCER MODAL */}
      <div
        id="res-bullet-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm no-print"
      >
        <div className="w-full max-w-2xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-left space-y-5 max-h-[85vh] overflow-y-auto resume-scroll-area animate-modal-scale-in">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                  Action Verbs &amp; High-Impact Bullet Generator
                </h3>
                <p className="text-xs text-neutral-500">
                  Formulate MAANG-standard metric bullets: [Action Verb] + [What You Built] +
                  [Quantifiable Metric]
                </p>
              </div>
            </div>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeBulletEnhancerModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
              title="Close"
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
          {/* High Impact Formula Reference Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-xs space-y-1.5">
            <div className="font-bold text-blue-600 dark:text-blue-400 font-mono text-[11px] uppercase">
              The High-Converting Bullet Formula
            </div>
            <div className="font-semibold text-neutral-800 dark:text-neutral-200">
              <span className="text-purple-600 dark:text-purple-400">[Strong Action Verb]</span> +
              <span className="text-blue-600 dark:text-blue-400">[Core System/Feature Built]</span>{' '}
              +
              <span className="text-emerald-600 dark:text-emerald-400">
                [Quantifiable Metric / % Result]
              </span>{' '}
              +<span className="text-amber-600 dark:text-amber-400">[Tech Stack Used]</span>
            </div>
          </div>
          {/* Action Verbs Explorer */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase">
              1. Powerful Action Verbs by Category
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1.5">
                <span className="font-bold text-blue-600 dark:text-blue-400 block font-mono text-[11px]">
                  Engineering &amp; Architecture
                </span>
                <div className="flex flex-wrap gap-1">
                  <span
                    className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] cursor-pointer hover:bg-blue-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Architected');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Architected
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] cursor-pointer hover:bg-blue-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Engineered');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Engineered
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] cursor-pointer hover:bg-blue-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Implemented');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Implemented
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-[10px] cursor-pointer hover:bg-blue-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Constructed');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Constructed
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1.5">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block font-mono text-[11px]">
                  Performance &amp; Optimization
                </span>
                <div className="flex flex-wrap gap-1">
                  <span
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] cursor-pointer hover:bg-emerald-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Optimized');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Optimized
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] cursor-pointer hover:bg-emerald-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Accelerated');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Accelerated
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] cursor-pointer hover:bg-emerald-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Refactored');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Refactored
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] cursor-pointer hover:bg-emerald-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Streamlined');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Streamlined
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1.5">
                <span className="font-bold text-purple-600 dark:text-purple-400 block font-mono text-[11px]">
                  Leadership &amp; Initiative
                </span>
                <div className="flex flex-wrap gap-1">
                  <span
                    className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] cursor-pointer hover:bg-purple-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Spearheaded');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Spearheaded
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] cursor-pointer hover:bg-purple-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Orchestrated');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Orchestrated
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] cursor-pointer hover:bg-purple-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Pioneered');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Pioneered
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono text-[10px] cursor-pointer hover:bg-purple-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Mentored');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Mentored
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary space-y-1.5">
                <span className="font-bold text-amber-600 dark:text-amber-400 block font-mono text-[11px]">
                  DevOps &amp; Automation
                </span>
                <div className="flex flex-wrap gap-1">
                  <span
                    className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] cursor-pointer hover:bg-amber-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Automated');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Automated
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] cursor-pointer hover:bg-amber-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Containerized');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Containerized
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] cursor-pointer hover:bg-amber-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Instituted');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Instituted
                  </span>
                  <span
                    className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[10px] cursor-pointer hover:bg-amber-500/20"
                    onClick={(event) => {
                      const result = function (event) {
                        copyActionVerb('Provisioned');
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  >
                    Provisioned
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* 2. Ready-to-use Sample Snippets */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-neutral-400 uppercase">
              2. Ready-To-Use Metric Bullet Examples (Click to Copy)
            </h4>
            <div className="space-y-2 text-xs">
              <div
                onClick={(event) => {
                  const result = function (event) {
                    copyBulletSnippet(this);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary hover:border-blue-500 cursor-pointer transition-colors group"
              >
                <p className="text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  • Architected RESTful microservice endpoints in Go &amp; Node.js, reducing API p99
                  response time by 42% across 10M+ daily transactions.
                </p>
              </div>
              <div
                onClick={(event) => {
                  const result = function (event) {
                    copyBulletSnippet(this);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary hover:border-blue-500 cursor-pointer transition-colors group"
              >
                <p className="text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  • Engineered automated Redis caching layer that decreased PostgreSQL database
                  query load by 55% during high concurrency surges.
                </p>
              </div>
              <div
                onClick={(event) => {
                  const result = function (event) {
                    copyBulletSnippet(this);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary hover:border-blue-500 cursor-pointer transition-colors group"
              >
                <p className="text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  • Fine-tuned open-source LLM transformer models using LoRA and 4-bit AWQ
                  quantization, improving inference throughput by 3.4x.
                </p>
              </div>
              <div
                onClick={(event) => {
                  const result = function (event) {
                    copyBulletSnippet(this);
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-primary hover:border-blue-500 cursor-pointer transition-colors group"
              >
                <p className="text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  • Spearheaded CI/CD automated deployment pipelines with Docker and GitHub Actions,
                  achieving 94% test branch coverage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* IMPORT / EXPORT MODAL */}
      <div
        id="res-import-export-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm no-print"
      >
        <div className="w-full max-w-xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-left space-y-4 max-h-[85vh] overflow-y-auto animate-modal-scale-in">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h3
              className="text-base font-extrabold text-neutral-900 dark:text-white"
              id="import-export-modal-title"
            >
              Import &amp; Export Resume
            </h3>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeImportExportModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
              title="Close"
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
          <div id="import-json-container" className="space-y-3">
            <label className="block font-semibold text-xs text-neutral-700 dark:text-neutral-300">
              Upload JSON Resume Data
            </label>
            <input
              type="file"
              id="res-json-file-input"
              accept=".json"
              className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs text-neutral-900 dark:text-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
            />
            <div className="text-right">
              <button
                onClick={(event) => {
                  const result = function (event) {
                    handleJsonFileImport();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
              >
                Import Resume Data
              </button>
            </div>
          </div>
          <div id="export-json-container" className="space-y-3">
            <label className="block font-semibold text-xs text-neutral-700 dark:text-neutral-300">
              JSON Resume Data Backup
            </label>
            <textarea
              id="res-json-export-preview"
              rows={6}
              readOnly
              className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary font-mono text-[11px] text-neutral-900 dark:text-white focus:outline-none"
              defaultValue={''}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={(event) => {
                  const result = function (event) {
                    downloadResumeJsonFile();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                Download .json File
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* SAVED DRAFTS HISTORY MODAL */}
      <div
        id="res-drafts-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm no-print"
      >
        <div className="w-full max-w-2xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 text-left space-y-4 max-h-[85vh] overflow-y-auto animate-modal-scale-in">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div className="flex items-center space-x-2">
              <svg
                className="w-5 h-5 text-blue-600"
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
              <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Saved Resume Drafts
              </h3>
            </div>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeDraftsHistoryModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-1"
              title="Close"
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
          <div className="flex justify-between items-center pb-2">
            <span className="text-xs text-neutral-500">
              Switch between different resumes or role variations
            </span>
            <button
              onClick={(event) => {
                const result = function (event) {
                  createNewResumeDraft();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
            >
              + Create New Draft
            </button>
          </div>
          <div id="res-drafts-list-container" className="space-y-3">
            {/* Loaded dynamically */}
          </div>
        </div>
      </div>
      {/* FULLSCREEN PREVIEW MODAL */}
      <div
        id="res-fullscreen-modal"
        className="fixed inset-0 z-50 hidden flex-col bg-neutral-950/95 p-4 sm:p-6 backdrop-blur-md no-print animate-fade-in"
      >
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-bold text-white font-mono">
              Fullscreen Document Inspection
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={(event) => {
                const result = function (event) {
                  exportResumePDF();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
            >
              Print / Export PDF
            </button>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeFullscreenModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-800 text-white text-xs font-semibold hover:bg-neutral-700"
            >
              Close Fullscreen
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto flex justify-center items-start p-4 sm:p-8 resume-scroll-area">
          <div
            id="res-fullscreen-content"
            className="w-[794px] min-h-[1123px] bg-white text-gray-900 rounded shadow-2xl origin-top"
          >
            {/* Cloned dynamically */}
          </div>
        </div>
      </div>
      {/* Core Scripts */}
    </>
  );
}
