// React presentation; feature controllers attach after the initial mount.
export default function UserQuizzes() {
  return (
    <>
      {/* Panel 1: Dashboard Home */}
      <div id="tab-panel-quizzes" className="block space-y-6">
        {/* Welcome Panel */}
        <div className="md:flex md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-3xl">
              Welcome back,{' '}
              <span id="welcome-user-name" className="text-blue-600 dark:text-blue-500">
                Student
              </span>
              !
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Review your technical score metrics and challenge active topics.
            </p>
          </div>
        </div>
        {/* Student Stats Counter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="p-4 sm:p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Assessments Finished
            </span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span
                id="stat-completed"
                className="text-3xl font-extrabold font-mono text-neutral-900 dark:text-white"
              >
                0
              </span>
              <span className="text-xs text-neutral-400">Total</span>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Average Accuracy
            </span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span
                id="stat-avg-score"
                className="text-3xl font-extrabold font-mono text-blue-600 dark:text-blue-400"
              >
                0%
              </span>
              <span className="text-xs text-neutral-400">Mean Score</span>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              High Accuracy Bound
            </span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span
                id="stat-high-score"
                className="text-3xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400"
              >
                0%
              </span>
              <span className="text-xs text-neutral-400">Peak Record</span>
            </div>
          </div>
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
              Security Infractions
            </span>
            <div className="flex items-baseline space-x-2 mt-2">
              <span
                id="stat-violations"
                className="text-3xl font-extrabold font-mono text-amber-500"
              >
                0
              </span>
              <span className="text-xs text-neutral-400">Warnings</span>
            </div>
          </div>
        </div>
        <div
          id="available-quizzes-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Loaded dynamically */}
        </div>
      </div>
    </>
  );
}
