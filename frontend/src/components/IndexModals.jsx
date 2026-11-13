// React presentation; feature controllers attach after the initial mount.
export default function IndexModals() {
  return (
    <>
      {/* LOGIN MODAL */}
      <div
        id="login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4"
      >
        <div className="modal-backdrop fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity" />
        <div className="animate-modal-scale-in relative w-full max-w-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-surface-elevated subtle-glass shadow-2xl overflow-hidden font-sans text-left z-10">
          {/* Top Decorative Gradient Glow */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-500 dark:via-sky-400 dark:to-indigo-500" />
          <div className="p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2
                  id="login-title"
                  className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  Welcome Back
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Sign in to your student placement prep dashboard
                </p>
              </div>
              <button
                className="close-modal-btn p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all text-xs"
                title="Close modal"
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
            <form className="space-y-4 text-xs">
              <div className="space-y-1">
                <label
                  htmlFor="modal-login-email-address"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Email Address
                </label>
                <input
                  id="modal-login-email-address"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="student@college.edu"
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="modal-login-password"
                    className="block text-neutral-700 dark:text-neutral-300 font-semibold"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="modal-login-password"
                    autoComplete="current-password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    className="w-full p-3 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    className="toggle-password absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none"
                    title="Toggle password visibility"
                  >
                    <svg
                      className="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold transition-all hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm tracking-wide"
              >
                Sign In
              </button>
            </form>
            <div className="text-center text-xs text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              Don't have an account?{' '}
              <a href="#" className="open-signup-modal text-blue-500 font-semibold hover:underline">
                Sign up free
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* SIGNUP MODAL */}
      <div
        id="signup-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signup-title"
        className="fixed inset-0 z-50 hidden items-center justify-center p-4"
      >
        <div className="modal-backdrop fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity" />
        <div className="animate-modal-scale-in relative w-full max-w-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-surface-elevated subtle-glass shadow-2xl overflow-hidden font-sans text-left z-10">
          {/* Top Decorative Gradient Glow */}
          <div className="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-500 dark:via-sky-400 dark:to-indigo-500" />
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h2
                  id="signup-title"
                  className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2"
                >
                  <svg
                    className="w-5 h-5 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                    />
                  </svg>
                  Create Account
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Create your student preparation workspace
                </p>
              </div>
              <button
                className="close-modal-btn p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all text-xs"
                title="Close modal"
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
            <form className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label
                  htmlFor="modal-signup-full-name"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Full Name
                </label>
                <input
                  id="modal-signup-full-name"
                  autoComplete="name"
                  type="text"
                  required
                  placeholder="Aarav Sharma"
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="modal-signup-email-address"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Email Address
                </label>
                <input
                  id="modal-signup-email-address"
                  autoComplete="email"
                  type="email"
                  required
                  placeholder="student@college.edu"
                  className="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="modal-signup-create-password"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Create Password
                </label>
                <div className="relative">
                  <input
                    id="modal-signup-create-password"
                    autoComplete="new-password"
                    type="password"
                    required
                    placeholder="Create a password"
                    className="w-full p-3 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    className="toggle-password absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none"
                    title="Toggle password visibility"
                  >
                    <svg
                      className="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label
                  htmlFor="modal-signup-confirm-password"
                  className="block text-neutral-700 dark:text-neutral-300 font-semibold"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="modal-signup-confirm-password"
                    autoComplete="new-password"
                    type="password"
                    required
                    placeholder="Confirm your password"
                    className="w-full p-3 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    className="toggle-password absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none"
                    title="Toggle password visibility"
                  >
                    <svg
                      className="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm tracking-wide"
              >
                Create Free Account
              </button>
            </form>
            <div className="text-center text-xs text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              Already registered?{' '}
              <a href="#" className="open-login-modal text-blue-500 font-semibold hover:underline">
                Log in here
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
