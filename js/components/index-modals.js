(function() {
  const container = document.getElementById('component-index-modals');
  if (!container) return;

  container.outerHTML = `
  <!-- LOGIN MODAL -->
  <div id="login-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"></div>
    <div
      class="animate-modal-scale-in relative w-full max-w-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-surface-elevated subtle-glass shadow-2xl overflow-hidden font-sans text-left z-10">
      
      <!-- Top Decorative Gradient Glow -->
      <div class="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-500 dark:via-sky-400 dark:to-indigo-500"></div>
      
      <div class="p-6 sm:p-8 space-y-6">
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <h2 class="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              Welcome Back
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">Sign in to your student placement prep dashboard</p>
          </div>
          <button
            class="close-modal-btn p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all text-xs" title="Close modal">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="space-y-4 text-xs">
          <div class="space-y-1">
            <label class="block text-neutral-700 dark:text-neutral-300 font-semibold">Email Address</label>
            <input type="email" required placeholder="student@college.edu"
              class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
          </div>
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="block text-neutral-700 dark:text-neutral-300 font-semibold">Password</label>
            </div>
            <div class="relative">
              <input type="password" required placeholder="••••••••"
                class="w-full p-3 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none" title="Toggle password visibility">
                <svg class="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <button type="submit"
            class="w-full py-3.5 mt-2 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-bold transition-all hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm tracking-wide">
            Sign In
          </button>
        </form>

        <div class="text-center text-xs text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          Don't have an account? <a href="#" class="open-signup-modal text-blue-500 font-semibold hover:underline">Sign up free</a>
        </div>
      </div>
    </div>
  </div>

  <!-- SIGNUP MODAL -->
  <div id="signup-modal" class="fixed inset-0 z-50 hidden items-center justify-center p-4">
    <div class="modal-backdrop fixed inset-0 bg-neutral-950/70 backdrop-blur-sm transition-opacity"></div>
    <div
      class="animate-modal-scale-in relative w-full max-w-md rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-surface-elevated subtle-glass shadow-2xl overflow-hidden font-sans text-left z-10">
      
      <!-- Top Decorative Gradient Glow -->
      <div class="h-1.5 w-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 dark:from-blue-500 dark:via-sky-400 dark:to-indigo-500"></div>

      <div class="p-6 sm:p-8 space-y-5">
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <h2 class="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
              Create Account
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">Join 50,000+ engineering students mastering prep</p>
          </div>
          <button
            class="close-modal-btn p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all text-xs" title="Close modal">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form class="space-y-3.5 text-xs">
          <div class="space-y-1">
            <label class="block text-neutral-700 dark:text-neutral-300 font-semibold">Full Name</label>
            <input type="text" required placeholder="Aarav Sharma"
              class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
          </div>
          <div class="space-y-1">
            <label class="block text-neutral-700 dark:text-neutral-300 font-semibold">Email Address</label>
            <input type="email" required placeholder="student@college.edu"
              class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
          </div>
          <div class="space-y-1">
            <label class="block text-neutral-700 dark:text-neutral-300 font-semibold">Create Password</label>
            <div class="relative">
              <input type="password" required placeholder="••••••••"
                class="w-full p-3 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none" title="Toggle password visibility">
                <svg class="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <div class="space-y-1">
            <label class="block text-neutral-700 dark:text-neutral-300 font-semibold">Confirm Password</label>
            <div class="relative">
              <input type="password" required placeholder="••••••••"
                class="w-full p-3 pr-10 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
              <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 focus:outline-none" title="Toggle password visibility">
                <svg class="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          <button type="submit"
            class="w-full py-3.5 mt-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm tracking-wide">
            Create Free Account
          </button>
        </form>

        <div class="text-center text-xs text-neutral-500 pt-4 border-t border-neutral-200 dark:border-neutral-800">
          Already registered? <a href="#" class="open-login-modal text-blue-500 font-semibold hover:underline">Log in here</a>
        </div>
      </div>
    </div>
  </div>`;
})();
