import UserHistory from '../components/UserHistory.jsx';
import UserProfile from '../components/UserProfile.jsx';
import UserQuizzes from '../components/UserQuizzes.jsx';
import UserSidebar from '../components/UserSidebar.jsx';
export default function DashboardPage() {
  return (
    <>
      {/* Student Sidebar Component */}
      <UserSidebar />
      {/* Right Dashboard Content Wrapper */}
      <div className="flex-1 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-surface-primary/90 subtle-glass border-b border-neutral-200 dark:border-neutral-800 transition-colors w-full">
          <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
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
              <div className="text-xs font-semibold text-neutral-500">Student Portal Dashboard</div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Home Link */}
              <a
                href="../../index.html"
                className="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
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
              {/* User initials Avatar click triggers Profile tab */}
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
        <main className="p-6 sm:p-8 flex-1 w-full text-left max-w-7xl mx-auto space-y-6">
          {/* Available Quizzes Component */}
          <UserQuizzes />
          {/* History Component */}
          <UserHistory />
          {/* Profile Component */}
          <UserProfile />
        </main>
        {/* Footer */}
        <footer className="py-6 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-800 bg-surface-primary/95 transition-colors">
          © 2026 TechPrep AI, Inc. All rights reserved. • Student Technical Hub
        </footer>
      </div>
      {/* Include Core Scripts */}
    </>
  );
}
