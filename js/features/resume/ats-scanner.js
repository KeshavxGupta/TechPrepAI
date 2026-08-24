function initAtsResumeScanner() {
  const resumeInput = document.getElementById('ats-resume-input');
  const analyzeBtn = document.getElementById('ats-analyze-btn');
  const scoreBadge = document.getElementById('ats-score-badge');
  const scoreProgress = document.getElementById('ats-score-progress');
  const matchVerdict = document.getElementById('ats-match-verdict');
  const keywordsContainer = document.getElementById('ats-keywords-container');

  if (!resumeInput || !analyzeBtn) return;

  const sampleKeywords = [
    { name: 'Data Structures & Algorithms', found: true },
    { name: 'System Design & Scalability', found: true },
    { name: 'React / Next.js', found: true },
    { name: 'REST & GraphQL APIs', found: true },
    { name: 'PostgreSQL / SQL Optimization', found: true },
    { name: 'Docker & Kubernetes', found: false },
    { name: 'CI/CD Pipelines (GitHub Actions)', found: false },
    { name: 'Redis Caching', found: false }
  ];

  analyzeBtn.addEventListener('click', () => {
    const text = resumeInput.value.trim();
    if (!text) {
      window.customAlert('Scan Error', 'Please paste your resume text to scan.', 'warning');
      return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = `Scanning ATS Parser...`;

    setTimeout(() => {
      analyzeBtn.disabled = false;
      analyzeBtn.innerHTML = `
        <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        Re-Scan Resume ATS Score
      `;

      let score = 85;
      if (text.toLowerCase().includes('docker')) score += 5;
      if (text.toLowerCase().includes('redis')) score += 4;
      if (text.toLowerCase().includes('algorithm')) score += 3;
      score = Math.min(score, 96);

      if (scoreBadge) scoreBadge.textContent = `${score}%`;
      if (scoreProgress) scoreProgress.style.width = `${score}%`;
      if (matchVerdict) {
        matchVerdict.textContent = score >= 90 ? 'Tier-1 Tech Ready' : 'Strong Placement Match';
      }

      if (keywordsContainer) {
        keywordsContainer.innerHTML = sampleKeywords.map(kw => `
          <span class="inline-flex items-center px-2.5 py-1 rounded text-xs font-medium ${kw.found
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
          }">
            <svg class="w-3 h-3 mr-1 ${kw.found ? 'text-emerald-500' : 'text-rose-500'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              ${kw.found
            ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>'
            : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
          }
            </svg>
            ${kw.name}
          </span>
        `).join('');
      }
    }, 700);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initAtsResumeScanner();
});



