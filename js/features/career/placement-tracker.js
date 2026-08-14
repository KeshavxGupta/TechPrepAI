function initPlacementTracker() {
  const searchInput = document.getElementById('placement-search-input');
  const filterBtns = document.querySelectorAll('.placement-filter-btn');
  const tableRows = document.querySelectorAll('.placement-table-row');

  if (!tableRows.length) return;

  let currentStatusFilter = 'all';

  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    tableRows.forEach(row => {
      const company = row.getAttribute('data-company')?.toLowerCase() || '';
      const role = row.getAttribute('data-role')?.toLowerCase() || '';
      const status = row.getAttribute('data-status')?.toLowerCase() || '';

      const matchesSearch = company.includes(query) || role.includes(query);
      const matchesStatus = (currentStatusFilter === 'all') || (status === currentStatusFilter);

      if (matchesSearch && matchesStatus) {
        row.classList.remove('hidden');
      } else {
        row.classList.add('hidden');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentStatusFilter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => {
        if (b.getAttribute('data-filter') === currentStatusFilter) {
          b.className = 'placement-filter-btn px-3 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 transition-all';
        } else {
          b.className = 'placement-filter-btn px-3 py-1.5 text-xs font-medium rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all';
        }
      });

      applyFilters();
    });
  });
}

function initCareerPipeline() {
  const pipelineSteps = document.querySelectorAll('.pipeline-step-card');
  const stepTitle = document.getElementById('pipeline-detail-title');
  const stepDesc = document.getElementById('pipeline-detail-desc');
  const stepMetrics = document.getElementById('pipeline-detail-metrics');

  if (!pipelineSteps.length || !stepTitle) return;

  const pipelineData = {
    learn: {
      title: '1. Learn: Core CS & System Fundamentals',
      desc: 'Master Computer Science core subjects (OS, DBMS, Computer Networks, System Design) through curated bite-sized modules and video walkthroughs tailored for interviews.',
      metrics: ['120+ Micro Modules', 'System Design Checklists', 'SQL & OS Interview Sheets']
    },
    practice: {
      title: '2. Practice: Curated DSA Roadmaps',
      desc: 'Solve patterns instead of random problems. Access Striver SDE sheet, NeetCode 150, and company-specific DSA tags with real time/space complexity analysis.',
      metrics: ['350+ Curated Problems', 'Instant Code Judge', 'Pattern-Based Learning']
    },
    build: {
      title: '3. Build: Production-Grade Portfolio Projects',
      desc: 'Construct high-impact full-stack and machine learning projects with real architecture diagrams, deployment pipelines, and GitHub README templates.',
      metrics: ['Full Stack & AI Projects', 'Architecture Specs', 'Docker & Cloud Deployment']
    },
    resume: {
      title: '4. Resume: AI Resume Designer & ATS Scoring',
      desc: 'Design ATS-compliant engineering resumes with modern single-column templates, live formatting validation, and instant keyword density match scoring.',
      metrics: ['Visual Resume Designer', '95+ ATS Pass Rate', 'LaTeX & PDF Export']
    },
    apply: {
      title: '5. Apply: Intelligent Placement Tracker',
      desc: 'Organize placement applications across Tier-1 Tech, Unicorn Startups, and On-Campus drives with eligibility filters, package details (LPA), and interview dates.',
      metrics: ['Company Criteria Database', 'Application Reminders', 'Referral Tracker']
    },
    placement: {
      title: '6. Placement: Offer Negotiation & Onboarding',
      desc: 'Evaluate multiple compensation offers (Base vs ESOPs vs Joining Bonus), access alumni compensation benchmarks, and prepare for onboarding.',
      metrics: ['Salary Benchmark Database', 'Offer Comparison Engine', 'Alumni Placement Network']
    }
  };

  pipelineSteps.forEach(card => {
    card.addEventListener('click', () => {
      const stepKey = card.getAttribute('data-step');
      if (pipelineData[stepKey]) {
        pipelineSteps.forEach(c => {
          c.className = 'pipeline-step-card p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/50 cursor-pointer transition-all';
        });
        card.className = 'pipeline-step-card p-4 rounded-xl border border-blue-500 bg-blue-500/5 dark:bg-blue-500/10 cursor-pointer transition-all shadow-sm';

        stepTitle.textContent = pipelineData[stepKey].title;
        stepDesc.textContent = pipelineData[stepKey].desc;

        if (stepMetrics) {
          stepMetrics.innerHTML = pipelineData[stepKey].metrics.map(m => `
            <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
              ${m}
            </span>
          `).join('');
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initPlacementTracker();
  initCareerPipeline();
});



