(function() {
  const container = document.getElementById('component-index-sections');
  if (!container) return;

  container.outerHTML = `
  <!-- ABOUT TECHPREP AI SECTION -->
  <section id="about" class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Header -->
      <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
        <h2 class="text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase">
          About TechPrep AI
        </h2>
        <p class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Built By Engineers, For Engineering Placement Success
        </p>
        <p class="text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Traditional college placement preparation is fragmented and outdated. TechPrep AI brings coding practice, resume parsing, and placement analytics into a single intelligent workspace.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- Left Column: Mission & 4 Core Pillars -->
        <div class="lg:col-span-6 space-y-6 text-left">
          <div class="space-y-4">
            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-elevated flex items-start space-x-3.5">
              <div class="w-9 h-9 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                01
              </div>
              <div>
                <h3 class="font-bold text-sm text-neutral-900 dark:text-white">Pattern-Based DSA Mastery</h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Learn data structures and algorithms structured by reusable patterns (Sliding Window, Two Pointers, Dynamic Programming) rather than overwhelming question dumps.
                </p>
              </div>
            </div>

            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-elevated flex items-start space-x-3.5">
              <div class="w-9 h-9 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                02
              </div>
              <div>
                <h3 class="font-bold text-sm text-neutral-900 dark:text-white">ATS-Optimized Resume Engine</h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Real-time keyword matching and format validation that guarantees your resume passes Workday, Greenhouse, and Lever enterprise screening algorithms.
                </p>
              </div>
            </div>

            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-elevated flex items-start space-x-3.5">
              <div class="w-9 h-9 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                03
              </div>
              <div>
                <h3 class="font-bold text-sm text-neutral-900 dark:text-white">System Design & Core CS Prep</h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Master Operating Systems, DBMS, Computer Networks, and System Architecture with curated interview drill sheets.
                </p>
              </div>
            </div>

            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-elevated flex items-start space-x-3.5">
              <div class="w-9 h-9 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm shrink-0">
                04
              </div>
              <div>
                <h3 class="font-bold text-sm text-neutral-900 dark:text-white">Campus Placement Tracker</h3>
                <p class="text-xs text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                  Stay ahead of college TPO deadlines, CGPA eligibility thresholds, backlog filters, and multi-stage hiring pipeline statuses.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Visual Skill Radar & Stats Strip -->
        <div class="lg:col-span-6 space-y-6">
          
          <!-- Placement Skill Radar Card -->
          <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-lg space-y-5 text-left">
            <div class="flex items-center justify-between">
              <div class="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-wider">PLACEMENT READINESS RADAR</div>
              <span class="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">READY • 91.2%</span>
            </div>

            <div class="space-y-3.5 text-xs">
              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span>Data Structures & Algorithms</span>
                  <span class="font-mono text-blue-500">92%</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-blue-600 h-full w-[92%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span>System Design & Architecture</span>
                  <span class="font-mono text-blue-500">78%</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-blue-500 h-full w-[78%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span>Resume ATS Verification</span>
                  <span class="font-mono text-emerald-500">95%</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-emerald-500 h-full w-[95%]"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between font-semibold mb-1">
                  <span>Core CS & Technical Speed</span>
                  <span class="font-mono text-purple-500">88%</span>
                </div>
                <div class="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div class="bg-purple-500 h-full w-[88%]"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Impact Metrics Grid -->
          <div class="grid grid-cols-2 gap-4 text-left">
            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
              <div class="text-2xl font-bold font-mono text-neutral-900 dark:text-white">50,000+</div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Active Engineering Students</div>
            </div>
            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
              <div class="text-2xl font-bold font-mono text-neutral-900 dark:text-white">400+</div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">College Campus Partners</div>
            </div>
            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
              <div class="text-2xl font-bold font-mono text-neutral-900 dark:text-white">1,200+</div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Hiring Partners</div>
            </div>
            <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
              <div class="text-2xl font-bold font-mono text-neutral-900 dark:text-white">₹18.4 LPA</div>
              <div class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Avg. Tier-1 Package</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>


  <!-- VERIFIED STUDENT TESTIMONIALS & HIRING PARTNERS SECTION -->
  <section id="testimonials" class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

      <!-- Hiring Partners Strip -->
      <div class="text-center space-y-4">
        <div class="text-xs font-mono font-semibold text-neutral-500 uppercase tracking-widest">
          STUDENTS HIRED AT TOP TECH ENTERPRISES & PRODUCT UNICORNS
        </div>
        <div class="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1">
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Google</span>
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Microsoft</span>
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Amazon</span>
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Atlassian</span>
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Uber</span>
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Adobe</span>
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Flipkart</span>
          <span class="px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono font-bold text-xs text-neutral-700 dark:text-neutral-300">Swiggy</span>
        </div>
      </div>

      <div class="text-center max-w-3xl mx-auto space-y-3 pt-6">
        <h2 class="text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase">
          Testimonials & Success Stories
        </h2>
        <p class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Engineers Who Cracked Tier-1 Offers
        </p>
        <p class="text-base text-neutral-600 dark:text-neutral-400">
          Read real stories from students who used TechPrep AI to land top engineering packages.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <!-- Card 1 -->
        <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              AR
            </div>
            <div>
              <div class="font-bold text-sm text-neutral-900 dark:text-white">Aarav Sharma</div>
              <div class="text-xs text-neutral-500">IIT Bombay • CSE '25</div>
            </div>
          </div>
          <p class="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "The DSA roadmaps and ATS resume generator were game changers. I cleared Google SDE-1 with a 32.5 LPA
            package after fixing my resume keyword gaps."
          </p>
          <div
            class="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            <span class="text-neutral-500">PLACED AT</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">Google (32.5 LPA)</span>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              PK
            </div>
            <div>
              <div class="font-bold text-sm text-neutral-900 dark:text-white">Priya Kulkarni</div>
              <div class="text-xs text-neutral-500">BITS Pilani • ECE '25</div>
            </div>
          </div>
          <p class="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "Practicing with the System Design sheets and DSA roadmaps gave me the confidence to answer technical questions clearly. Landed my dream offer at Atlassian."
          </p>
          <div
            class="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            <span class="text-neutral-500">PLACED AT</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">Atlassian (52.0 LPA)</span>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4">
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              RV
            </div>
            <div>
              <div class="font-bold text-sm text-neutral-900 dark:text-white">Rohan Verma</div>
              <div class="text-xs text-neutral-500">VIT Vellore • IT '25</div>
            </div>
          </div>
          <p class="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
            "The Campus Placement Tracker kept me on top of 18+ application deadlines. I received 3 offers and accepted
            Microsoft Security!"
          </p>
          <div
            class="pt-2 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            <span class="text-neutral-500">PLACED AT</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">Microsoft (45.0 LPA)</span>
          </div>
        </div>

      </div>
    </div>
  </section>


  <!-- FREQUENTLY ASKED QUESTIONS (ACCORDION) -->
  <section id="faq" class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-primary">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="text-center space-y-3 mb-12">
        <h2 class="text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase">Frequently
          Asked Questions</h2>
        <p class="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">Everything You Need To Know</p>
      </div>

      <div id="landing-faq-accordion" class="space-y-4">
        <!-- FAQs rendered dynamically -->
      </div>
    </div>
  </section>

  <!-- CONTACT US & GET STARTED SECTION -->
  <section id="contact" class="py-16 lg:py-24 border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto space-y-3 mb-16">
        <h2 class="text-xs font-mono font-bold tracking-widest text-blue-600 dark:text-blue-500 uppercase">
          Contact Us & Support
        </h2>
        <p class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Get In Touch With The TechPrep AI Team
        </p>
        <p class="text-base text-neutral-600 dark:text-neutral-400">
          Have questions about student access, college campus partnerships, or platform features? We're here to help.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        <!-- Left Column: Contact Cards -->
        <div class="lg:col-span-5 space-y-6 text-left">
          
          <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4">
            <div class="flex items-center space-x-3 text-blue-600 dark:text-blue-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span class="font-bold text-sm text-neutral-900 dark:text-white">Student & General Support</span>
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Reach our support team for platform help, feature requests, or technical assistance.
            </p>
            <a href="mailto:support@techprep.ai" class="inline-block text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              support@techprep.ai →
            </a>
          </div>

          <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4">
            <div class="flex items-center space-x-3 text-emerald-600 dark:text-emerald-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <span class="font-bold text-sm text-neutral-900 dark:text-white">College TPO & Campus Partners</span>
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Bring TechPrep AI to your engineering college or placement office with custom student analytics.
            </p>
            <a href="mailto:tpo@techprep.ai" class="inline-block text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
              tpo@techprep.ai →
            </a>
          </div>

          <div class="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-4">
            <div class="flex items-center space-x-3 text-purple-600 dark:text-purple-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/>
              </svg>
              <span class="font-bold text-sm text-neutral-900 dark:text-white">Developer Community</span>
            </div>
            <p class="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              Join 50,000+ engineers discussing daily DSA problems, system design, and placement experiences.
            </p>
            <a href="#" onclick="if(window.customAlert) window.customAlert('Community Forum', 'Connecting to TechPrep AI community channels...', 'info'); return false;" class="inline-block text-xs font-mono text-purple-600 dark:text-purple-400 font-semibold hover:underline">
              discord.gg/techprep-ai →
            </a>
          </div>

        </div>

        <!-- Right Column: Interactive Form -->
        <div class="lg:col-span-7">
          <div class="p-8 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-xl space-y-6 text-left">
            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white">Send Us A Message</h3>
              <p class="text-xs text-neutral-500 mt-1">Fill out the form below and our team will get back to you within 24 hours.</p>
            </div>

            <form onsubmit="event.preventDefault(); if(window.customAlert) window.customAlert('Message Sent', 'Thank you for reaching out! A TechPrep AI representative will contact you shortly.', 'success'); this.reset();" class="space-y-4 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Full Name</label>
                  <input type="text" required placeholder="Aarav Sharma" class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                </div>
                <div>
                  <label class="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Email Address</label>
                  <input type="email" required placeholder="student@college.edu" class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                </div>
              </div>

              <div>
                <label class="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Inquiry Type</label>
                <select class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="student">Student Account / Free Trial</option>
                  <option value="tpo">College Placement Officer (TPO)</option>
                  <option value="recruiter">Corporate Recruiter</option>
                  <option value="support">Technical Support</option>
                </select>
              </div>

              <div>
                <label class="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">Message</label>
                <textarea rows="4" required placeholder="How can we help your placement prep..." class="w-full p-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>

              <button type="submit" class="w-full py-3.5 px-6 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-semibold text-xs hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm">
                Send Message & Get Started
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  </section>`;

  // Initialize and Render Landing FAQs from LocalStorage
  setTimeout(() => {
    const faqContainer = document.getElementById('landing-faq-accordion');
    if (!faqContainer) return;

    const escapeHTML = (str) => {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
    };

    const defaultFaqs = [
      {
        id: 'faq_1',
        question: 'Is TechPrep AI free for engineering students?',
        category: 'General',
        answer: 'Yes! TechPrep AI offers a comprehensive free tier that includes access to the core 350 DSA roadmap, 5 ATS resume scans per month, and campus placement application tracking. Advanced features are unlocked with TechPrep Pro.'
      },
      {
        id: 'faq_2',
        question: 'How does the ATS Resume Scoring engine work?',
        category: 'Resume',
        answer: 'Our ATS engine simulates parsing algorithms used by Enterprise ATS software (Workday, Greenhouse, Lever). It extracts technical skills, verifies bullet structure impact, measures keyword density against job descriptions, and checks for unparseable columns or tables.'
      },
      {
        id: 'faq_3',
        question: 'Can I track college campus placement eligibility?',
        category: 'Placements',
        answer: 'Absolutely. You can input your branch, CGPA, and backlog history to filter companies that meet your specific college placement office eligibility rules.'
      },
      {
        id: 'faq_4',
        question: 'How is the DSA roadmap structured?',
        category: 'DSA',
        answer: 'The DSA roadmap is grouped by pattern rather than topic order. It covers Arrays, Strings, Hashing, Two Pointers, Sliding Window, Stacks/Queues, Trees, Graphs, Heap/Priority Queue, and Dynamic Programming with complexity analysis.'
      }
    ];

    let faqs = null;
    try {
      faqs = JSON.parse(localStorage.getItem('techprep_faqs'));
    } catch (e) {}

    if (!Array.isArray(faqs) || faqs.length === 0) {
      faqs = defaultFaqs;
      localStorage.setItem('techprep_faqs', JSON.stringify(defaultFaqs));
    }

    faqContainer.innerHTML = faqs.map((f, i) => `
      <div class="accordion-item rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated overflow-hidden">
        <button class="accordion-header w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none" aria-expanded="${i === 0 ? 'true' : 'false'}">
          <span class="font-semibold text-sm sm:text-base text-neutral-900 dark:text-white">${escapeHTML(f.question)}</span>
          <svg class="chevron-icon w-5 h-5 text-neutral-400 shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <div class="accordion-content px-6 pb-5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
          ${escapeHTML(f.answer)}
        </div>
      </div>
    `).join('');

    if (window.initFaqAccordion) {
      window.initFaqAccordion();
    }
  }, 10);
})();
