import AdminSidebar from '../components/AdminSidebar.jsx';
export default function AdminResumeStudioPage() {
  return (
    <>
      <div className="min-h-screen flex bg-surface-primary">
        {/* Persistent Left Admin Sidebar Component */}
        <AdminSidebar />
        {/* Main Workspace Column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Admin Top Navbar Header */}
          <header className="sticky top-0 z-30 bg-surface-primary/90 subtle-glass border-b border-neutral-200 dark:border-neutral-800 transition-colors">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(event) => {
                      const result = function (event) {
                        toggleAdminSidebar();
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
                  <div className="text-xs font-semibold text-neutral-500">
                    Resume Studio Console
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {/* Student Builder Switcher */}
                  <a
                    href="../user/resume-builder.html"
                    target="_blank"
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Open Student Builder →
                  </a>
                  {/* Theme Toggle */}
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
                  </button>
                </div>
              </div>
            </div>
          </header>
          {/* Main Content Area */}
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 space-y-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  Resume Studio &amp; User Draft Tracker
                </h1>
                <p className="text-xs text-neutral-500 mt-1">
                  Manage Canva-style resume layout designs, default accent color palettes, and
                  inspect student user-wise resumes and ATS scores.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(event) => {
                    const result = function (event) {
                      openAdminTemplateModal();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all"
                >
                  + Add New Layout Design Template
                </button>
              </div>
            </div>
            {/* Sub-Tab Header Bar */}
            <div className="flex items-center space-x-2 border-b border-neutral-200 dark:border-neutral-800 font-sans pb-1">
              <button
                id="res-tab-btn-templates"
                onClick={(event) => {
                  const result = function (event) {
                    switchAdminResumeTab('templates');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-4 py-2 font-semibold text-xs border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 transition-colors"
              >
                Resume Templates Studio
              </button>
              <button
                id="res-tab-btn-user-resumes"
                onClick={(event) => {
                  const result = function (event) {
                    switchAdminResumeTab('user-resumes');
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-4 py-2 font-semibold text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border-b-2 border-transparent"
              >
                User Resumes Directory (User-Wise)
              </button>
            </div>
            {/* Tab 1: Resume Templates Studio */}
            <div id="res-tab-panel-templates" className="block space-y-4">
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono bg-surface-secondary">
                      <th className="py-3 px-4 font-semibold">TEMPLATE TITLE</th>
                      <th className="py-3 px-4 font-semibold">CATEGORY</th>
                      <th className="py-3 px-4 font-semibold">CANVA LAYOUT TYPE</th>
                      <th className="py-3 px-4 font-semibold">FONT FAMILY</th>
                      <th className="py-3 px-4 font-semibold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody
                    id="admin-templates-table-body"
                    className="divide-y divide-neutral-200 dark:divide-neutral-800/60 font-sans"
                  >
                    {/* Loaded dynamically */}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Tab 2: User Resumes Directory */}
            <div id="res-tab-panel-user-resumes" className="hidden space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated">
                <input
                  type="text"
                  id="admin-res-search-input"
                  onInput={(event) => {
                    const result = function (event) {
                      renderAdminUserResumesTable();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  placeholder="Search student name, email, or resume title..."
                  className="p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none w-full sm:w-80 text-neutral-900 dark:text-white"
                />
              </div>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono bg-surface-secondary">
                      <th className="py-3 px-4 font-semibold">STUDENT USER</th>
                      <th className="py-3 px-4 font-semibold">RESUME TITLE</th>
                      <th className="py-3 px-4 font-semibold">TEMPLATE ID</th>
                      <th className="py-3 px-4 font-semibold">ATS SCORE</th>
                      <th className="py-3 px-4 font-semibold">LAST UPDATED</th>
                      <th className="py-3 px-4 font-semibold">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody
                    id="admin-user-resumes-table-body"
                    className="divide-y divide-neutral-200 dark:divide-neutral-800/60 font-sans"
                  >
                    {/* Loaded dynamically */}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>
      {/* Add / Edit Template Modal */}
      <div
        id="admin-template-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
      >
        <div className="w-full max-w-xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 text-left space-y-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h3
              id="admin-template-modal-title"
              className="text-base font-extrabold text-neutral-900 dark:text-white"
            >
              Create New Canva-Style Layout Template
            </h3>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeAdminTemplateModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1"
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
          <form
            id="admin-template-form"
            onSubmit={(event) => {
              const result = function (event) {
                saveAdminTemplateForm(event);
              }.call(event.currentTarget, event);
              if (result === false) {
                event.preventDefault();
              }
            }}
            className="space-y-4 text-xs"
          >
            <input type="hidden" id="tmpl-form-id" />
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Professional Template Title
              </label>
              <input
                type="text"
                id="tmpl-form-title"
                required
                placeholder="e.g. FAANG Senior Software Engineer (Tier-1 Standard)"
                className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white font-sans"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Target Industry Domain
                </label>
                <select
                  id="tmpl-form-cat"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white font-sans"
                >
                  <option value="Software & Cloud Engineering">
                    Software &amp; Cloud Engineering
                  </option>
                  <option value="Quant & Fintech Analytics">Quant &amp; Fintech Analytics</option>
                  <option value="Product Management & Leadership">
                    Product Management &amp; Leadership
                  </option>
                  <option value="AI & Data Science Research">AI &amp; Data Science Research</option>
                  <option value="DevOps & Infrastructure">DevOps &amp; Infrastructure</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  ATS Parser Benchmark
                </label>
                <select
                  id="tmpl-form-ats"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white font-sans"
                >
                  <option value="99.8% Tier-1 Optimized">
                    99.8% Tier-1 Optimized (FAANG Standard)
                  </option>
                  <option value="97.5% Quant Metric Standard">97.5% Quant Metric Standard</option>
                  <option value="95.0% Executive Leadership">95.0% Executive Leadership</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Visual Layout Architecture
                </label>
                <select
                  id="tmpl-form-layout"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white font-sans"
                >
                  <option value="silicon_valley">
                    Silicon Valley Single Column (ATS #1 Standard)
                  </option>
                  <option value="modern_sidebar">Modern Two-Column Sidebar Accent</option>
                  <option value="executive_grid">Executive Lead &amp; Architect Split Grid</option>
                  <option value="ivy_classic">Ivy League Academic Serif Design</option>
                  <option value="terminal_dev">Developer Terminal &amp; Monospace Badges</option>
                  <option value="compact_dense">Compact 1-Page High Density</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Font Family Hierarchy
                </label>
                <select
                  id="tmpl-form-font"
                  className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white font-sans"
                >
                  <option value="Inter, sans-serif">Inter (Sans-Serif - Tech Standard)</option>
                  <option value="Roboto, sans-serif">Roboto (Clean ATS)</option>
                  <option value="'JetBrains Mono', monospace">JetBrains Mono (Developer)</option>
                  <option value="Georgia, serif">Georgia (Academic Serif)</option>
                  <option value="'Outfit', sans-serif">Outfit (Display Modern)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Default Primary Accent Color
                </label>
                <input
                  type="color"
                  id="tmpl-form-color"
                  defaultValue="#2563eb"
                  className="w-full h-10 p-1 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary cursor-pointer"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Section Modules
                </label>
                <div className="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
                  Summary + Skills Matrix + Experience + Projects + Education
                </div>
              </div>
            </div>
            <div>
              <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Industry Description &amp; ATS Recommendations
              </label>
              <textarea
                id="tmpl-form-desc"
                rows={3}
                required
                placeholder="Overview of design architecture, ATS keyword density target, and target role benchmarks..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white font-sans"
                defaultValue={''}
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={(event) => {
                  const result = function (event) {
                    closeAdminTemplateModal();
                  }.call(event.currentTarget, event);
                  if (result === false) {
                    event.preventDefault();
                  }
                }}
                className="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-colors"
              >
                Save Layout Blueprint
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* INSPECT STUDENT RESUME MODAL (USER-WISE) */}
      <div
        id="admin-inspect-resume-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
      >
        <div className="w-full max-w-3xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 text-left space-y-4 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
              Student Resume Inspection View
            </h3>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeAdminInspectResumeModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 p-1"
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
          <div id="admin-inspect-resume-container">{/* Rendered dynamically */}</div>
        </div>
      </div>
      {/* Core Component Scripts */}
    </>
  );
}
