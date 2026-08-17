(function() {
  const container = document.getElementById('component-index-footer');
  if (!container) return;

  container.outerHTML = `
  <footer
    class="bg-surface-primary text-neutral-600 dark:text-neutral-400 text-xs py-12 border-t border-neutral-200 dark:border-neutral-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-2 md:grid-cols-6 gap-8 mb-10">

        <!-- Brand Info Column -->
        <div class="col-span-2 space-y-3">
          <div class="flex items-center space-x-2">
            <div
              class="w-7 h-7 rounded bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center font-mono font-bold text-xs">
              TP
            </div>
            <span class="font-bold text-sm text-neutral-900 dark:text-white">TechPrep AI</span>
          </div>
          <p class="text-neutral-500 leading-relaxed max-w-xs">
            The intelligent developer platform for DSA coding practice, ATS resumes, and campus placement tracking.
          </p>
          <div class="flex items-center space-x-2 font-mono text-[11px] text-emerald-500">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> All Systems Operational
          </div>
        </div>

        <!-- Col 1: Product -->
        <div class="space-y-2">
          <div class="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">Product</div>
          <ul class="space-y-1.5">
            <li><a href="#interactive-demo" class="hover:text-neutral-900 dark:hover:text-white">Overview</a></li>
            <li><a href="#dsa-section" class="hover:text-neutral-900 dark:hover:text-white">DSA IDE</a></li>
            <li><a href="#resume-section" class="hover:text-neutral-900 dark:hover:text-white">ATS Resume</a></li>
            <li><a href="#placement-section" class="hover:text-neutral-900 dark:hover:text-white">Placement Tracker</a></li>
            <li><a href="#about" class="hover:text-neutral-900 dark:hover:text-white">About Platform</a></li>
          </ul>
        </div>

        <!-- Col 2: DSA & Prep -->
        <div class="space-y-2">
          <div class="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">DSA Prep</div>
          <ul class="space-y-1.5">
            <li><a href="/pages/public/dsa-sheets.html#striver" class="hover:text-neutral-900 dark:hover:text-white">Striver SDE Sheet</a></li>
            <li><a href="/pages/public/dsa-sheets.html#neetcode" class="hover:text-neutral-900 dark:hover:text-white">NeetCode 150</a></li>
            <li><a href="/pages/public/dsa-sheets.html#blind75" class="hover:text-neutral-900 dark:hover:text-white">Blind 75</a></li>
            <li><a href="/pages/public/dsa-sheets.html#system-design" class="hover:text-neutral-900 dark:hover:text-white">System Design 101</a></li>
          </ul>
        </div>

        <!-- Col 3: Resources -->
        <div class="space-y-2">
          <div class="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">Resources</div>
          <ul class="space-y-1.5">
            <li><a href="/pages/public/login.html" class="hover:text-neutral-900 dark:hover:text-white">Student Login</a></li>
            <li><a href="/pages/admin/admin-hub.html" class="hover:text-neutral-900 dark:hover:text-white">Admin Panel</a></li>
            <li><a href="/pages/public/docs.html" class="hover:text-neutral-900 dark:hover:text-white">Documentation</a></li>
            <li><a href="/pages/public/partners.html" class="hover:text-neutral-900 dark:hover:text-white">College Partners</a></li>
          </ul>
        </div>

        <!-- Col 4: Legal & Social -->
        <div class="space-y-2">
          <div class="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px]">Connect</div>
          <ul class="space-y-1.5">
            <li><a href="https://github.com" target="_blank" class="hover:text-neutral-900 dark:hover:text-white">GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank" class="hover:text-neutral-900 dark:hover:text-white">LinkedIn</a></li>
            <li><a href="https://twitter.com" target="_blank" class="hover:text-neutral-900 dark:hover:text-white">Twitter / X</a></li>
            <li><a href="https://instagram.com" target="_blank" class="hover:text-neutral-900 dark:hover:text-white">Instagram</a></li>
          </ul>
        </div>

      </div>

      <div
        class="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500">
        <div>Â© 2026 TechPrep AI, Inc. All rights reserved.</div>
        <div class="flex space-x-4 mt-2 sm:mt-0 font-mono text-[11px]">
          <a href="/pages/public/privacy.html" class="hover:underline">Privacy Policy</a>
          <a href="/pages/public/terms.html" class="hover:underline">Terms of Service</a>
          <a href="/pages/public/security.html" class="hover:underline">Security</a>
        </div>
      </div>
    </div>
  </footer>`;
})();



