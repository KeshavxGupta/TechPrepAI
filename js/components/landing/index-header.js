(function() {
  const container = document.getElementById('component-index-header');
  if (!container) return;

  container.outerHTML = `
  <header
    class="sticky top-0 z-50 bg-surface-primary/90 subtle-glass border-b border-neutral-200 dark:border-neutral-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">

        <!-- Brand Logo & Live Badge -->
        <div class="flex items-center space-x-3">
          <a href="#" class="flex items-center space-x-2.5">
            <div
              class="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-sm shadow-sm">
              TP
            </div>
            <span class="font-bold text-base tracking-tight font-sans">TechPrep <span
                class="text-blue-600 dark:text-blue-500">AI</span></span>
          </a>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="hidden md:flex items-center space-x-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <a href="#home" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Home</a>
          <a href="#features" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Features</a>
          <a href="#about" class="hover:text-neutral-900 dark:hover:text-white transition-colors">About</a>
          <a href="#testimonials" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Testimonials</a>
          <a href="#contact" class="hover:text-neutral-900 dark:hover:text-white transition-colors">Contact</a>
        </nav>

        <!-- Right Controls: Theme Selector + Auth Buttons -->
        <div class="hidden md:flex items-center space-x-3">
          <!-- Theme Switcher Toggle -->
          <div class="relative flex items-center">
            <button class="theme-toggle-btn p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 transition-colors flex items-center space-x-1.5 text-xs font-medium" title="Toggle Light / Dark mode">
              <svg class="w-4 h-4 hidden dark:block text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <svg class="w-4 h-4 block dark:hidden text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <span class="hidden lg:inline text-[11px] font-mono">Theme</span>
            </button>
          </div>

          <div id="nav-auth-container" class="flex items-center space-x-3">
            <button
              class="open-login-modal px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
              Login
            </button>

            <button
              class="open-signup-modal px-4 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm">
              Sign Up
            </button>
          </div>
        </div>

        <!-- Mobile Hamburger Button -->
        <div class="flex items-center md:hidden space-x-2">
          <!-- Mobile Theme Switcher -->
          <button class="theme-toggle-btn p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            <svg class="w-4 h-4 hidden dark:block text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg class="w-4 h-4 block dark:hidden text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <button id="mobile-menu-toggle"
            class="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div id="mobile-menu"
      class="hidden md:hidden border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary px-4 pt-3 pb-5 space-y-3">
      <a href="#home" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 py-1">Home</a>
      <a href="#features" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 py-1">Features</a>
      <a href="#about" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 py-1">About</a>
      <a href="#testimonials" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 py-1">Testimonials</a>
      <a href="#contact" class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 py-1">Contact</a>
      <div id="mobile-nav-auth-container" class="pt-2 flex flex-col space-y-2 border-t border-neutral-200 dark:border-neutral-800">
        <button
          class="open-login-modal w-full text-center px-4 py-2 text-sm font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">
          Login
        </button>
        <button
          class="open-signup-modal w-full text-center px-4 py-2 text-sm font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
          Sign Up
        </button>
      </div>
    </div>
  </header>`;
})();



