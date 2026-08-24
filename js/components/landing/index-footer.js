/**
 * TechPrep AI - Landing Page Premium Footer Component
 */
(function () {
  const container = document.getElementById('component-index-footer');
  if (!container) return;

  const isSubPage = window.location.pathname.includes('/pages/');
  const root = isSubPage ? '../../' : '';
  const pages = isSubPage ? '../' : 'pages/';

  container.outerHTML = `
  <footer class="relative bg-surface-primary text-neutral-600 dark:text-neutral-400 text-xs pt-16 pb-12 border-t border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden font-sans transition-colors">
    
    <!-- Top Ambient Radiant Glow Divider -->
    <div class="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#00FFC2]/50 via-blue-500/50 to-transparent"></div>
    <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-24 bg-blue-500/10 dark:bg-[#00FFC2]/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Top Callout / Newsletter Banner -->
      <div class="mb-14 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-surface-elevated/70 subtle-glass shadow-xl relative overflow-hidden">
        <div class="absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div class="lg:col-span-7 space-y-2">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Placement Season 2026 Ready
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white tracking-tight">
              Master Technical Interviews with Confidence
            </h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl">
              Get weekly curated DSA question sets, verified campus drive alerts, and ATS score optimization tips straight to your inbox.
            </p>
          </div>

          <div class="lg:col-span-5">
            <form id="footer-newsletter-form" onsubmit="event.preventDefault(); window.handleFooterNewsletter(event);" class="flex flex-col sm:flex-row gap-2">
              <div class="relative flex-1">
                <input 
                  type="email" 
                  id="footer-newsletter-email" 
                  placeholder="Enter your college email..." 
                  required
                  class="w-full px-4 py-2.5 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all placeholder:text-neutral-400"
                />
              </div>
              <button 
                type="submit" 
                class="px-5 py-2.5 text-xs font-bold rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md shrink-0 flex items-center justify-center gap-1.5 cursor-pointer">
                <span>Subscribe</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                </svg>
              </button>
            </form>
            <p id="footer-newsletter-status" class="hidden text-[11px] font-mono mt-2 text-emerald-600 dark:text-emerald-400">
              ✓ You're subscribed! Welcome to TechPrep AI updates.
            </p>
          </div>

        </div>
      </div>

      <!-- Main Navigation Grid -->
      <div class="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-10 mb-12">

        <!-- Column 1: Brand & Identity (Spans 4 columns on desktop) -->
        <div class="col-span-2 md:col-span-4 space-y-4">
          <a href="${root}index.html" class="inline-flex items-center gap-3 cursor-pointer select-none group">
            <!-- Shield & Brain Vector Mark -->
            <div class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[#0D1520] border border-[#00FFC2]/30 shadow-[0_0_15px_rgba(0,255,194,0.15)] shrink-0 transition-transform group-hover:scale-105">
              <svg class="w-6 h-6 text-[#00FFC2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#00FFC2" fill-opacity="0.08"/>
                <path d="M12 8v4" stroke="#38BDF8"/>
                <path d="M9.5 10.5l5 3" stroke="#38BDF8"/>
                <circle cx="12" cy="7" r="1.2" fill="#00FFC2"/>
                <circle cx="8.5" cy="11" r="1.2" fill="#00FFC2"/>
                <circle cx="15.5" cy="11" r="1.2" fill="#00FFC2"/>
                <circle cx="12" cy="16" r="1.2" fill="#00FFC2"/>
                <path d="M10 14.5l2 1.5 2-1.5" stroke="#38BDF8"/>
              </svg>
            </div>

            <!-- Brand Typography -->
            <div class="flex flex-col text-left">
              <span class="text-lg sm:text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-none">
                TechPrep <span class="text-[#00FFC2]">AI</span>
              </span>
              <span class="text-[8px] sm:text-[9px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                Empowering Technical Careers
              </span>
            </div>
          </a>

          <p class="text-neutral-500 dark:text-neutral-400 leading-relaxed text-xs max-w-sm">
            The all-in-one developer workspace engineered for engineering students to master Data Structures & Algorithms, craft ATS-optimized resumes, and manage campus placements.
          </p>

          <!-- System Status & Metrics Pill -->
          <div class="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-neutral-700 dark:text-neutral-300">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Live</span>
            </div>
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-neutral-700 dark:text-neutral-300">
              <span class="text-blue-500 font-bold">50k+</span> Students Active
            </div>
          </div>

          <!-- Social Icons Row -->
          <div class="flex items-center space-x-2 pt-2 text-neutral-500 dark:text-neutral-400">
            <!-- GitHub -->
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-surface-secondary hover:text-neutral-900 dark:hover:text-white hover:border-neutral-400 dark:hover:border-neutral-600 transition-all" title="GitHub">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <!-- LinkedIn -->
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-surface-secondary hover:text-blue-500 hover:border-blue-500/40 transition-all" title="LinkedIn">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.22a1.62 1.62 0 0 0-1.62 1.62c0 .9.72 1.63 1.62 1.63.9 0 1.63-.73 1.63-1.63 0-.9-.73-1.62-1.63-1.62z"/>
              </svg>
            </a>
            <!-- Twitter/X -->
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-surface-secondary hover:text-sky-400 hover:border-sky-400/40 transition-all" title="Twitter / X">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <!-- Discord -->
            <a href="https://discord.com" target="_blank" rel="noopener noreferrer" class="w-8 h-8 rounded-lg flex items-center justify-center border border-neutral-200 dark:border-neutral-800 bg-surface-secondary hover:text-indigo-500 hover:border-indigo-500/40 transition-all" title="Discord Community">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Column 2: Platform Modules -->
        <div class="col-span-1 md:col-span-2 space-y-3">
          <div class="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Platform
          </div>
          <ul class="space-y-2 text-xs">
            <li>
              <a href="${pages}user/dsa-ide.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> DSA Code IDE
              </a>
            </li>
            <li>
              <a href="${pages}user/resume-builder.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> ATS Resume Studio
              </a>
            </li>
            <li>
              <a href="${pages}user/placements.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Placement Tracker
              </a>
            </li>
            <li>
              <a href="${pages}user/quiz-user.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Daily MCQ Quizzes
              </a>
            </li>
            <li>
              <a href="${pages}user/planner.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Study Planner
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 3: Curated Sheets -->
        <div class="col-span-1 md:col-span-2 space-y-3">
          <div class="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Curated Sheets
          </div>
          <ul class="space-y-2 text-xs">
            <li>
              <a href="${pages}public/dsa-sheets.html#striver" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Striver SDE Sheet
              </a>
            </li>
            <li>
              <a href="${pages}public/dsa-sheets.html#neetcode" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> NeetCode 150
              </a>
            </li>
            <li>
              <a href="${pages}public/dsa-sheets.html#blind75" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Blind 75 List
              </a>
            </li>
            <li>
              <a href="${pages}public/dsa-sheets.html#system-design" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> System Design 101
              </a>
            </li>
            <li>
              <a href="${pages}public/dsa-sheets.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> View All 450+
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 4: Portals & Resources -->
        <div class="col-span-1 md:col-span-2 space-y-3">
          <div class="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Portals
          </div>
          <ul class="space-y-2 text-xs">
            <li>
              <a href="${pages}user/dashboard.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Student Portal
              </a>
            </li>
            <li>
              <a href="${pages}admin/admin-hub.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Admin Console
              </a>
            </li>
            <li>
              <a href="${pages}public/docs.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Documentation
              </a>
            </li>
            <li>
              <a href="${pages}public/partners.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> College Partners
              </a>
            </li>
            <li>
              <a href="${root}index.html#faq" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> FAQs & Help
              </a>
            </li>
          </ul>
        </div>

        <!-- Column 5: Trust & Legal -->
        <div class="col-span-1 md:col-span-2 space-y-3">
          <div class="font-bold text-neutral-900 dark:text-white uppercase tracking-wider text-[11px] font-mono flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> Trust & Legal
          </div>
          <ul class="space-y-2 text-xs">
            <li>
              <a href="${pages}public/security.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Security Center
              </a>
            </li>
            <li>
              <a href="${pages}public/privacy.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Privacy Policy
              </a>
            </li>
            <li>
              <a href="${pages}public/terms.html" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Terms of Service
              </a>
            </li>
            <li>
              <a href="${pages}public/partners.html#recruiters" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> For Recruiters
              </a>
            </li>
            <li>
              <a href="mailto:support@techprep.ai" class="hover:text-blue-500 dark:hover:text-[#00FFC2] transition-colors flex items-center gap-1.5 group">
                <span class="text-neutral-400 group-hover:translate-x-0.5 transition-transform">›</span> Help Support
              </a>
            </li>
          </ul>
        </div>

      </div>

      <!-- Bottom Bar Divider -->
      <div class="pt-8 border-t border-neutral-200 dark:border-neutral-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500 dark:text-neutral-400">
        
        <div class="flex items-center gap-2 text-center md:text-left">
          <span>© 2026 TechPrep AI, Inc. Built with precision for engineering aspirants.</span>
        </div>

        <div class="flex items-center flex-wrap justify-center gap-3 font-mono text-[10px]">
          <span class="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">AES-256 Encrypted</span>
          <span class="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">ATS Compatible</span>
          <span class="px-2 py-0.5 rounded border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">v2.4.0 Live</span>
        </div>

        <!-- Back to top button -->
        <div>
          <button onclick="window.scrollTo({ top: 0, behavior: 'smooth' })" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-all font-mono text-[11px] group cursor-pointer" title="Scroll back to top">
            <span>Back to top</span>
            <svg class="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>
            </svg>
          </button>
        </div>

      </div>

    </div>
  </footer>`;

  window.handleFooterNewsletter = function(e) {
    const input = document.getElementById('footer-newsletter-email');
    const status = document.getElementById('footer-newsletter-status');
    if (!input || !input.value.trim()) return;
    
    if (status) {
      status.classList.remove('hidden');
      status.textContent = "✓ Subscribed! Welcome to TechPrep AI updates.";
      input.value = '';
      setTimeout(() => {
        status.classList.add('hidden');
      }, 5000);
    }
  };
})();
