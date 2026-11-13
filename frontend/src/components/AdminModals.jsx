// React presentation; feature controllers attach after the initial mount.
export default function AdminModals() {
  return (
    <>
      {/* Quiz Overlay Modal (Create / Edit) */}
      <div
        id="quiz-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm overflow-y-auto"
      >
        <div className="w-full max-w-4xl bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-left">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between bg-surface-secondary">
            <div>
              <h2
                id="modal-title"
                className="text-base font-extrabold text-neutral-900 dark:text-white"
              >
                Create New Quiz
              </h2>
              <p className="text-[11px] text-neutral-500">
                Specify details, settings, and build your list of questions.
              </p>
            </div>
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeQuizModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
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
          {/* Modal Body (Scrollable form) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Error Banner inside modal */}
            <div
              id="modal-error-banner"
              className="hidden p-3 rounded-lg border bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20 text-xs font-semibold"
            />
            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
                1. Quiz Parameters
              </h3>
              <input type="hidden" id="form-quiz-id" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                  <label
                    htmlFor="form-quiz-title"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Quiz Title
                  </label>
                  <input
                    type="text"
                    id="form-quiz-title"
                    placeholder="e.g. Tree Node Deletions & Traversals"
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white"
                  />
                </div>
                <div className="md:col-span-3">
                  <label
                    htmlFor="form-quiz-desc"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="form-quiz-desc"
                    rows={2}
                    placeholder="Describe the topics covered in this quiz..."
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white"
                    defaultValue={''}
                  />
                </div>
                <div>
                  <label
                    htmlFor="form-quiz-time"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Time Limit (Minutes)
                  </label>
                  <input
                    type="number"
                    id="form-quiz-time"
                    min={1}
                    max={180}
                    placeholder={10}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="form-quiz-pass"
                    className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1"
                  >
                    Passing Percentage (%)
                  </label>
                  <input
                    type="number"
                    id="form-quiz-pass"
                    min={10}
                    max={100}
                    placeholder={60}
                    className="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
            <hr className="border-neutral-200 dark:border-neutral-800" />
            {/* Bulk Question Importer */}
            <div className="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
                  Bulk Import Questions
                </h3>
                <span className="text-[10px] text-neutral-400 font-mono">
                  Excel, CSV, Word, or TXT
                </span>
              </div>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer bg-surface-primary hover:border-blue-500/50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-4 pb-4 px-2 text-center">
                    <svg
                      className="w-6 h-6 mb-2 text-neutral-400 dark:text-neutral-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-[11px] text-neutral-500">
                      <span className="font-semibold text-blue-600 dark:text-blue-500">
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className="text-[9px] text-neutral-400 mt-0.5">
                      XLSX, XLS, CSV, DOCX, TXT (Aiken format)
                    </p>
                  </div>
                  <input
                    type="file"
                    id="bulk-file-input"
                    accept=".xlsx,.xls,.csv,.docx,.txt"
                    className="hidden"
                    onChange={(event) => {
                      const result = function (event) {
                        handleBulkImport(this);
                      }.call(event.currentTarget, event);
                      if (result === false) {
                        event.preventDefault();
                      }
                    }}
                  />
                </label>
              </div>
            </div>
            <hr className="border-neutral-200 dark:border-neutral-800" />
            {/* Section 2: Questions Dynamic Builder */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-500">
                  2. Questions Inventory
                </h3>
                <button
                  type="button"
                  onClick={(event) => {
                    const result = function (event) {
                      addQuestionDOM();
                    }.call(event.currentTarget, event);
                    if (result === false) {
                      event.preventDefault();
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-blue-600 dark:text-blue-400 border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center"
                >
                  + Add Question
                </button>
              </div>
              <div id="form-questions-container" className="space-y-6">
                {/* Questions rendered here */}
              </div>
            </div>
          </div>
          {/* Modal Footer */}
          <div className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end bg-surface-secondary gap-3">
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeQuizModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(event) => {
                const result = function (event) {
                  saveQuizForm();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
            >
              Save Quiz
            </button>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Modal */}
      <div
        id="delete-modal"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm"
      >
        <div className="w-full max-w-md bg-surface-elevated border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl p-6 text-left">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-600 flex items-center justify-center text-lg font-bold">
              !
            </div>
            <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
              Delete Quiz
            </h3>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6">
            Are you sure you want to permanently delete{' '}
            <strong id="delete-quiz-name" className="text-neutral-800 dark:text-neutral-200" />?
            This action cannot be undone and will delete user records matching this quiz.
          </p>
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={(event) => {
                const result = function (event) {
                  closeDeleteModal();
                }.call(event.currentTarget, event);
                if (result === false) {
                  event.preventDefault();
                }
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-btn"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors"
            >
              Delete Quiz
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
