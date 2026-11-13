// React presentation; feature controllers attach after the initial mount.
export default function AdminUsers() {
  return (
    <>
      {/* Panel 2: User Management */}
      <div id="tab-panel-users" className="hidden space-y-6">
        {/* Header Panel */}
        <div className="mb-8 text-left">
          <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
            User Directory &amp; Telemetry
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Monitor registered students, check academic profiles, reset passwords, and toggle
            suspensions.
          </p>
        </div>
        {/* Telemetry Dashboard Metrics (Horizontal charts) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Chart 1: Completeness */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
              Profile Completeness
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
                  <span>Fully Complete (100%)</span>
                  <span id="chart-complete-count">0</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    id="chart-complete-bar"
                    className="bg-emerald-500 h-full transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
                  <span>Incomplete (&lt;100%)</span>
                  <span id="chart-incomplete-count">0</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    id="chart-incomplete-bar"
                    className="bg-amber-500 h-full transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Chart 2: Suspension status */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
              Account States
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
                  <span>Active Accounts</span>
                  <span id="chart-active-count">0</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    id="chart-active-bar"
                    className="bg-blue-600 h-full transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-semibold text-neutral-500 mb-1">
                  <span>Suspended Accounts</span>
                  <span id="chart-suspended-count">0</span>
                </div>
                <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    id="chart-suspended-bar"
                    className="bg-rose-500 h-full transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Chart 3: Quiz Solving Performance */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
              Student Averages
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Average CGPA
                </span>
                <span
                  id="metrics-avg-cgpa"
                  className="text-xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1 block"
                >
                  0.00
                </span>
              </div>
              <div className="text-center p-3 rounded bg-surface-secondary border border-neutral-200 dark:border-neutral-800">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">
                  Total Attempts
                </span>
                <span
                  id="metrics-total-attempts"
                  className="text-xl font-extrabold font-mono text-neutral-900 dark:text-white mt-1 block"
                >
                  0
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated">
          <div className="w-full sm:w-80 relative">
            <input
              type="text"
              id="user-search"
              onInput={(event) => {
                const result = function (event) {
                  renderUsers();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              placeholder="Search students by name or email..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <svg
              className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div className="text-xs font-mono text-neutral-400" id="user-results-count">
            Showing 0 users
          </div>
        </div>
        {/* User List Grid */}
        <div id="user-list-container" className="space-y-4">
          {/* Rendered dynamically */}
        </div>
      </div>
    </>
  );
}
