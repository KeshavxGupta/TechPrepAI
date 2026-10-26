/**
 * TechPrep AI - User DSA IDE Component & Controller
 */

(function() {
  let currentProblems = [];
  let activeProblem = null;
  let activeLanguage = 'javascript';
  let activeLeftTab = 'description';

  window.initDSAIDE = function() {
    currentProblems = getDSAProblems();
    if (!currentProblems.length) return;

    // Load problem by URL parameter or default to first
    const urlParams = new URLSearchParams(window.location.search);
    const problemSlug = urlParams.get('p');
    if (problemSlug) {
      activeProblem = currentProblems.find(p => p.slug === problemSlug) || currentProblems[0];
    } else {
      activeProblem = currentProblems[0];
    }

    renderProblemSelectorDropdown();
    loadProblemDetails(activeProblem.id);
    updateSolvedCounters();
  };

  function renderProblemSelectorDropdown() {
    const selector = document.getElementById('dsa-problem-select');
    if (!selector) return;

    selector.innerHTML = currentProblems.map(p => `
      <option value="${p.id}" ${p.id === activeProblem.id ? 'selected' : ''}>
        ${p.title} (${p.difficulty})
      </option>
    `).join('');
  }

  window.onProblemSelectChange = function(selectEl) {
    const selectedId = selectEl.value;
    loadProblemDetails(selectedId);
  };

  window.loadProblemDetails = function(problemId) {
    activeProblem = currentProblems.find(p => p.id === problemId) || currentProblems[0];
    
    // Update URL parameter without page reload
    if (history.pushState) {
      const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?p=' + activeProblem.slug;
      window.history.pushState({ path: newurl }, '', newurl);
    }

    // Update Header info
    const titleEl = document.getElementById('dsa-header-title');
    const diffEl = document.getElementById('dsa-header-diff');
    if (titleEl) titleEl.textContent = activeProblem.title;
    if (diffEl) {
      diffEl.textContent = activeProblem.difficulty;
      diffEl.className = `px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
        activeProblem.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
        activeProblem.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' :
        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
      }`;
    }

    // Update Dropdown if present
    const selector = document.getElementById('dsa-problem-select');
    if (selector) selector.value = activeProblem.id;

    // Populate Left Description Tab
    renderProblemDescription();
    renderProblemEditorial();
    renderSubmissionsHistory();
    
    // Load starter code for selected language
    changeDSALanguage(activeLanguage);
  };

  function renderProblemDescription() {
    const descContainer = document.getElementById('dsa-desc-content');
    if (!descContainer) return;

    const tagsHtml = (activeProblem.companyTags || []).map(t => `
      <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700">
        ${escapeHTML(t)}
      </span>
    `).join('');

    const examplesHtml = (activeProblem.examples || []).map((ex, idx) => `
      <div class="space-y-1.5 p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs">
        <div class="font-mono font-bold text-neutral-500">Example ${idx + 1}:</div>
        <div><strong class="font-mono text-neutral-700 dark:text-neutral-300">Input:</strong> <code class="font-mono bg-surface-primary px-1.5 py-0.5 rounded text-blue-600 dark:text-blue-400">${escapeHTML(ex.input)}</code></div>
        <div><strong class="font-mono text-neutral-700 dark:text-neutral-300">Output:</strong> <code class="font-mono bg-surface-primary px-1.5 py-0.5 rounded text-emerald-600 dark:text-emerald-400">${escapeHTML(ex.output)}</code></div>
        ${ex.explanation ? `<div class="text-neutral-500 text-[11px]"><strong class="text-neutral-600 dark:text-neutral-400">Explanation:</strong> ${escapeHTML(ex.explanation)}</div>` : ''}
      </div>
    `).join('');

    const constraintsHtml = (activeProblem.constraints || []).map(c => `
      <li class="font-mono text-[11px] text-neutral-600 dark:text-neutral-400">${escapeHTML(c)}</li>
    `).join('');

    const hintsHtml = (activeProblem.hints || []).map((h, i) => `
      <details class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs">
        <summary class="font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer font-mono">Hint ${i + 1}</summary>
        <p class="mt-2 text-neutral-500 leading-relaxed text-[11px]">${escapeHTML(h)}</p>
      </details>
    `).join('');

    descContainer.innerHTML = `
      <div class="space-y-5 text-left">
        <div>
          <div class="flex items-center space-x-3 mb-2">
            <h1 class="text-xl font-extrabold text-neutral-900 dark:text-white">${escapeHTML(activeProblem.title)}</h1>
            <span class="text-xs font-mono text-neutral-500">Acceptance Rate: ${activeProblem.acceptanceRate || '50%'}</span>
          </div>
          <div class="flex flex-wrap items-center gap-1.5">${tagsHtml}</div>
        </div>

        <div class="prose dark:prose-invert text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
          ${escapeHTML(activeProblem.description)}
        </div>

        <div class="space-y-3">
          <h3 class="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">Sample Testcases</h3>
          ${examplesHtml}
        </div>

        <div class="space-y-2">
          <h3 class="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">Constraints</h3>
          <ul class="list-disc pl-5 space-y-1">${constraintsHtml}</ul>
        </div>

        ${activeProblem.hints && activeProblem.hints.length ? `
        <div class="space-y-2">
          <h3 class="text-xs font-bold font-mono text-neutral-500 uppercase tracking-wider">Hints</h3>
          <div class="space-y-2">${hintsHtml}</div>
        </div>` : ''}
      </div>`;
  }

  function renderProblemEditorial() {
    const edContainer = document.getElementById('dsa-editorial-content');
    if (!edContainer) return;

    const ed = activeProblem.editorial || { approach: 'No solution editorial posted yet.', timeComplexity: 'O(N)', spaceComplexity: 'O(1)' };
    
    edContainer.innerHTML = `
      <div class="space-y-4 text-left">
        <h2 class="text-sm font-bold text-neutral-900 dark:text-white font-mono">Official Editorial & Algorithm Walkthrough</h2>
        <div class="p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
          ${escapeHTML(ed.approach)}
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono text-xs">
            <span class="text-neutral-500 text-[10px] uppercase block">TIME COMPLEXITY</span>
            <span class="font-bold text-blue-600 dark:text-blue-400 text-sm">${escapeHTML(ed.timeComplexity)}</span>
          </div>
          <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-elevated font-mono text-xs">
            <span class="text-neutral-500 text-[10px] uppercase block">SPACE COMPLEXITY</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400 text-sm">${escapeHTML(ed.spaceComplexity)}</span>
          </div>
        </div>
      </div>`;
  }

  let currentSubmissionFilter = 'all';

  function renderSubmissionsHistory(forceLiveFetch = false) {
    const subContainer = document.getElementById('dsa-submissions-content');
    if (!subContainer) return;

    const currentUser = (window.TechPrepAuth && window.TechPrepAuth.getCurrentUser ? window.TechPrepAuth.getCurrentUser() : null) || 
                        (window.getCurrentUser ? window.getCurrentUser() : null) || 
                        (typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem('techprep_current_user') || 'null'));
    const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';

    // Live sync from MongoDB Atlas if available
    if (forceLiveFetch && window.TechPrepAPI && window.TechPrepAPI.getUserDsaSubmissions && activeProblem) {
      window.TechPrepAPI.getUserDsaSubmissions(userEmail, {
        problemId: activeProblem.slug || activeProblem.id,
        source: 'ide'
      }).then(res => {
        if (res && res.submissions && Array.isArray(res.submissions)) {
          res.submissions.forEach(sub => {
            saveDSASubmission({
              _id: sub._id,
              problemId: activeProblem.id,
              problemTitle: sub.problemTitle || activeProblem.title,
              difficulty: activeProblem.difficulty,
              language: sub.language,
              code: sub.code,
              status: sub.status,
              actionType: sub.actionType || 'submit',
              source: sub.source || 'ide',
              runtimeMs: sub.runtimeMs || (parseInt(sub.runtime) || 0),
              memoryMb: sub.memoryMb || (parseFloat(sub.memory) || 40),
              passedCases: sub.passedCases !== undefined ? sub.passedCases : 0,
              totalCases: sub.totalCases !== undefined ? sub.totalCases : 0,
              testResults: sub.testResults || [],
              timestamp: sub.createdAt || sub.timestamp || new Date().toISOString(),
              _backendSynced: true
            });
          });
          drawSubmissionsTable();
        }
      }).catch(err => {
        console.warn('Could not sync DSA submissions from MongoDB:', err.message);
      });
    }

    drawSubmissionsTable();
  }

  function drawSubmissionsTable() {
    const subContainer = document.getElementById('dsa-submissions-content');
    if (!subContainer) return;

    const currentUser = (window.TechPrepAuth && window.TechPrepAuth.getCurrentUser ? window.TechPrepAuth.getCurrentUser() : null) || 
                        (window.getCurrentUser ? window.getCurrentUser() : null) || 
                        (typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem('techprep_current_user') || 'null'));
    const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';

    const allSubs = getDSASubmissions();
    const problemSubs = allSubs.filter(s => {
      const matchProblem = s.problemId === activeProblem.id || s.problemId === (activeProblem.slug || activeProblem.id);
      const matchUser = s.userEmail === userEmail || !s.userEmail;
      const matchFilter = currentSubmissionFilter === 'all' || s.actionType === currentSubmissionFilter;
      return matchProblem && matchUser && matchFilter;
    });

    if (!problemSubs.length) {
      subContainer.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Filter:</span>
              <button onclick="setDsaHistoryFilter('all')" class="px-2.5 py-1 rounded text-xs font-mono ${currentSubmissionFilter === 'all' ? 'bg-blue-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'}">All</button>
              <button onclick="setDsaHistoryFilter('run')" class="px-2.5 py-1 rounded text-xs font-mono ${currentSubmissionFilter === 'run' ? 'bg-blue-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'}">Runs</button>
              <button onclick="setDsaHistoryFilter('submit')" class="px-2.5 py-1 rounded text-xs font-mono ${currentSubmissionFilter === 'submit' ? 'bg-blue-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'}">Submissions</button>
            </div>
            <button onclick="renderSubmissionsHistory(true)" class="text-xs font-mono text-blue-500 hover:text-blue-400 flex items-center gap-1" title="Sync with MongoDB Atlas">
              <svg class="w-3.5 h-3.5 inline animate-spin-hover" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Sync Atlas
            </button>
          </div>
          <div class="text-center py-12 text-neutral-500 font-mono text-xs border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-surface-secondary">
            No ${currentSubmissionFilter === 'all' ? 'attempts' : currentSubmissionFilter + 's'} recorded yet for this problem. Click "Run Code" or "Submit Code" to test!
          </div>
        </div>`;
      return;
    }

    subContainer.innerHTML = `
      <div class="space-y-3">
        <div class="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="text-xs font-mono font-bold text-neutral-400 uppercase tracking-wider">Filter:</span>
            <button onclick="setDsaHistoryFilter('all')" class="px-2.5 py-1 rounded text-xs font-mono ${currentSubmissionFilter === 'all' ? 'bg-blue-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'}">All (${allSubs.filter(s => (s.problemId === activeProblem.id || s.problemId === activeProblem.slug) && (s.userEmail === userEmail || !s.userEmail)).length})</button>
            <button onclick="setDsaHistoryFilter('run')" class="px-2.5 py-1 rounded text-xs font-mono ${currentSubmissionFilter === 'run' ? 'bg-blue-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'}">Runs</button>
            <button onclick="setDsaHistoryFilter('submit')" class="px-2.5 py-1 rounded text-xs font-mono ${currentSubmissionFilter === 'submit' ? 'bg-blue-600 text-white font-bold' : 'bg-neutral-800 text-neutral-400 hover:text-white'}">Submissions</button>
          </div>
          <button onclick="renderSubmissionsHistory(true)" class="text-xs font-mono text-blue-500 hover:text-blue-400 flex items-center gap-1" title="Sync with MongoDB Atlas">
            <svg class="w-3.5 h-3.5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            Sync Atlas
          </button>
        </div>

        <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated text-left">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono bg-surface-secondary">
                <th class="py-2.5 px-3 font-semibold">TYPE</th>
                <th class="py-2.5 px-3 font-semibold">VERDICT</th>
                <th class="py-2.5 px-3 font-semibold">TESTCASES</th>
                <th class="py-2.5 px-3 font-semibold">LANG</th>
                <th class="py-2.5 px-3 font-semibold">RUNTIME</th>
                <th class="py-2.5 px-3 font-semibold">MEMORY</th>
                <th class="py-2.5 px-3 font-semibold">TIME</th>
                <th class="py-2.5 px-3 font-semibold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/60 font-sans">
              ${problemSubs.map((s, idx) => {
                const subId = s._id || `sub_${idx}`;
                const isRun = s.actionType === 'run';
                const isAccepted = s.status === 'Accepted';
                const isCompileErr = s.status === 'Compile Error';
                const passed = s.passedCases !== undefined ? s.passedCases : (isAccepted ? (s.totalCases || 1) : 0);
                const total = s.totalCases !== undefined ? s.totalCases : (s.testResults ? s.testResults.length : 1);

                return `
                  <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isRun ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }">${isRun ? 'RUN' : 'SUBMIT'}</span>
                    </td>
                    <td class="py-2.5 px-3">
                      <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        isAccepted ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                        isCompileErr ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      }">${escapeHTML(s.status || 'Evaluated')}</span>
                    </td>
                    <td class="py-2.5 px-3 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                      ${passed} / ${total}
                    </td>
                    <td class="py-2.5 px-3 font-mono text-[11px] text-neutral-500 uppercase">${escapeHTML(s.language || 'javascript')}</td>
                    <td class="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300">${s.runtimeMs || 0} ms</td>
                    <td class="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300">${s.memoryMb || 40} MB</td>
                    <td class="py-2.5 px-3 font-mono text-[10px] text-neutral-500">${new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                    <td class="py-2.5 px-3 text-right space-x-1 whitespace-nowrap">
                      <button onclick="viewDsaSubmissionModal('${subId}')" class="px-2 py-1 rounded bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 font-mono text-[11px] font-bold transition-colors">
                        Inspect
                      </button>
                      <button onclick="loadDsaHistoryCode('${subId}')" class="px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-white font-mono text-[11px] transition-colors" title="Load code into editor">
                        Restore
                      </button>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>`;
  }

  window.setDsaHistoryFilter = function(filter) {
    currentSubmissionFilter = filter;
    drawSubmissionsTable();
  };

  window.viewDsaSubmissionModal = function(subId) {
    const allSubs = getDSASubmissions();
    const sub = allSubs.find(s => (s._id && s._id === subId) || `sub_${allSubs.indexOf(s)}` === subId);
    if (!sub) return;

    let modal = document.getElementById('dsa-history-detail-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dsa-history-detail-modal';
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm';
      document.body.appendChild(modal);
    }

    const isRun = sub.actionType === 'run';
    const isAccepted = sub.status === 'Accepted';
    const isCompileErr = sub.status === 'Compile Error';
    const testcases = sub.testResults || [];
    const passed = sub.passedCases !== undefined ? sub.passedCases : (isAccepted ? testcases.length : 0);
    const total = sub.totalCases !== undefined ? sub.totalCases : (testcases.length || 1);

    const testcasesHtml = testcases.length > 0 ? testcases.map(tc => `
      <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs space-y-1.5">
        <div class="flex items-center justify-between font-mono font-bold">
          <span>Test Case ${tc.testCaseIndex}:</span>
          <span class="${tc.status === 'Passed' ? 'text-emerald-500' : 'text-rose-500'}">${tc.status} (${tc.runtimeMs || 0} ms)</span>
        </div>
        <div class="font-mono text-[11px] text-neutral-500">Input: <code class="text-neutral-800 dark:text-neutral-200">${escapeHTML(tc.input || '')}</code></div>
        <div class="font-mono text-[11px] text-neutral-500">Expected: <code class="text-emerald-600 dark:text-emerald-400">${escapeHTML(tc.expectedOutput || '')}</code></div>
        <div class="font-mono text-[11px] text-neutral-500">Actual Output: <code class="${tc.status === 'Passed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}">${escapeHTML(tc.actualOutput || '')}</code></div>
      </div>
    `).join('') : `
      <div class="p-3 rounded bg-neutral-900 font-mono text-xs text-neutral-400">
        ${sub.stdout ? `<div class="text-emerald-400 mb-1">Standard Output:</div><pre class="whitespace-pre-wrap">${escapeHTML(sub.stdout)}</pre>` : 'No custom test cases were evaluated.'}
        ${sub.stderr ? `<div class="text-rose-400 mt-2 mb-1">Standard Error:</div><pre class="whitespace-pre-wrap">${escapeHTML(sub.stderr)}</pre>` : ''}
      </div>
    `;

    modal.innerHTML = `
      <div class="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-surface-primary shadow-2xl overflow-hidden animate-scale-up">
        <!-- Header -->
        <div class="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="px-2.5 py-1 rounded text-xs font-mono font-bold ${
              isRun ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
            }">${isRun ? 'RUN EXECUTION' : 'SUBMISSION'}</span>
            <span class="px-2.5 py-1 rounded text-xs font-mono font-bold ${
              isAccepted ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
              isCompileErr ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
            }">${escapeHTML(sub.status || 'Evaluated')}</span>
            <span class="font-mono text-xs text-neutral-500">${passed}/${total} test cases passed</span>
          </div>
          <button onclick="closeDsaSubmissionModal()" class="text-neutral-400 hover:text-white p-1 rounded">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 space-y-4 overflow-y-auto flex-1 font-sans">
          <!-- Metrics Bar -->
          <div class="grid grid-cols-4 gap-2 text-center font-mono">
            <div class="p-2.5 rounded-lg bg-surface-elevated border border-neutral-200 dark:border-neutral-800">
              <span class="text-[10px] text-neutral-400 block uppercase">Language</span>
              <span class="text-xs font-bold text-neutral-200 uppercase">${escapeHTML(sub.language || 'javascript')}</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-elevated border border-neutral-200 dark:border-neutral-800">
              <span class="text-[10px] text-neutral-400 block uppercase">Runtime</span>
              <span class="text-xs font-bold text-neutral-200">${sub.runtimeMs || 0} ms</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-elevated border border-neutral-200 dark:border-neutral-800">
              <span class="text-[10px] text-neutral-400 block uppercase">Memory</span>
              <span class="text-xs font-bold text-neutral-200">${sub.memoryMb || 40} MB</span>
            </div>
            <div class="p-2.5 rounded-lg bg-surface-elevated border border-neutral-200 dark:border-neutral-800">
              <span class="text-[10px] text-neutral-400 block uppercase">Date</span>
              <span class="text-xs font-bold text-neutral-200">${new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <!-- Test Cases Details -->
          <div>
            <div class="text-xs font-mono font-bold text-neutral-400 uppercase mb-2">Test Cases Breakdown:</div>
            <div class="space-y-2 max-h-48 overflow-y-auto">${testcasesHtml}</div>
          </div>

          <!-- Code Snapshot -->
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-xs font-mono font-bold text-neutral-400 uppercase">Code Executed:</span>
              <div class="flex items-center gap-2">
                <button onclick="copyDsaHistoryCode('${subId}')" class="px-2.5 py-1 text-xs font-mono rounded border border-neutral-700 hover:bg-neutral-800 text-neutral-300">Copy Code</button>
                <button onclick="loadDsaHistoryCode('${subId}')" class="px-3 py-1 text-xs font-mono font-bold rounded bg-blue-600 hover:bg-blue-500 text-white">Restore into Editor</button>
              </div>
            </div>
            <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-lg font-mono text-xs text-neutral-200 max-h-48 overflow-y-auto whitespace-pre leading-relaxed">${escapeHTML(sub.code || '// No code stored')}</pre>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex items-center justify-end space-x-2">
          <button onclick="closeDsaSubmissionModal()" class="px-4 py-1.5 rounded-lg border border-neutral-700 text-xs font-mono text-neutral-300 hover:bg-neutral-800">Close</button>
          <button onclick="loadDsaHistoryCode('${subId}')" class="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-mono font-bold text-white">Load into Editor</button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeDsaSubmissionModal = function() {
    const modal = document.getElementById('dsa-history-detail-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.loadDsaHistoryCode = function(subId) {
    const allSubs = getDSASubmissions();
    const sub = allSubs.find(s => (s._id && s._id === subId) || `sub_${allSubs.indexOf(s)}` === subId);
    if (!sub || !sub.code) return;

    const textarea = document.getElementById('dsa-code-textarea');
    if (textarea) {
      textarea.value = sub.code;
      if (sub.language && sub.language !== activeLanguage) {
        const langSelect = document.getElementById('dsa-lang-select');
        if (langSelect) langSelect.value = sub.language;
        activeLanguage = sub.language;
      }
      if (window.updateDSALineNumbers) window.updateDSALineNumbers();
      closeDsaSubmissionModal();
      if (window.showToast) {
        window.showToast(`Restored code from ${sub.actionType.toUpperCase()} (${new Date(sub.timestamp).toLocaleTimeString()})!`);
      }
    }
  };

  window.copyDsaHistoryCode = function(subId) {
    const allSubs = getDSASubmissions();
    const sub = allSubs.find(s => (s._id && s._id === subId) || `sub_${allSubs.indexOf(s)}` === subId);
    if (!sub || !sub.code) return;
    navigator.clipboard.writeText(sub.code).then(() => {
      if (window.showToast) window.showToast('Code copied to clipboard!');
    });
  };

  window.switchDSALeftTab = function(tabName) {
    activeLeftTab = tabName;
    const tabs = ['description', 'editorial', 'submissions'];
    tabs.forEach(t => {
      const panel = document.getElementById(`dsa-tab-panel-${t}`);
      const btn = document.getElementById(`dsa-tab-btn-${t}`);
      if (t === tabName) {
        if (panel) panel.classList.remove('hidden');
        if (btn) btn.className = "px-3 py-2 font-semibold text-xs border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 transition-colors";
      } else {
        if (panel) panel.classList.add('hidden');
        if (btn) btn.className = "px-3 py-2 font-semibold text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border-b-2 border-transparent";
      }
    });

    if (tabName === 'submissions') {
      renderSubmissionsHistory(true);
    }
  };

  window.changeDSALanguage = function(lang) {
    activeLanguage = lang;
    const textarea = document.getElementById('dsa-code-textarea');
    if (!textarea || !activeProblem) return;

    const templates = activeProblem.templates || {};
    let codeTemplate = templates[lang];

    if (!codeTemplate || String(codeTemplate).trim() === '') {
      if (lang === 'python') {
        codeTemplate = `def solution():\n    # Write your solution here\n    pass`;
      } else if (lang === 'cpp') {
        codeTemplate = `class Solution {\npublic:\n    void solution() {\n        // Write your solution here\n    }\n};`;
      } else if (lang === 'java') {
        codeTemplate = `class Solution {\n    public void solution() {\n        // Write your solution here\n    }\n}`;
      } else {
        codeTemplate = `/**\n * Write your solution here\n */\nfunction solution() {\n  // Write your solution here\n}`;
      }
    }

    textarea.value = codeTemplate;
    updateLineNumbers();
  };

  window.confirmResetDSACode = function() {
    const modal = document.getElementById('dsa-reset-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.closeDSAResetModal = function() {
    const modal = document.getElementById('dsa-reset-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.executeDSAResetCode = function() {
    changeDSALanguage(activeLanguage);
    closeDSAResetModal();
  };

  window.updateLineNumbers = function() {
    const textarea = document.getElementById('dsa-code-textarea');
    const lineGutter = document.getElementById('dsa-line-numbers');
    if (!textarea || !lineGutter) return;

    const lines = textarea.value.split('\n').length;
    let lineNumsStr = '';
    for (let i = 1; i <= lines; i++) {
      lineNumsStr += `<div>${i}</div>`;
    }
    lineGutter.innerHTML = lineNumsStr;
  };

  window.toggleCustomInput = function() {
    const container = document.getElementById('dsa-custom-input-container');
    const btn = document.getElementById('dsa-custom-input-toggle-btn');
    if (!container) return;
    const isHidden = container.classList.contains('hidden');
    if (isHidden) {
      container.classList.remove('hidden');
      if (btn) btn.classList.add('bg-blue-500/20', 'border-blue-500', 'text-blue-400', 'font-bold');
      const inputEl = document.getElementById('dsa-custom-input');
      if (inputEl) inputEl.focus();
    } else {
      container.classList.add('hidden');
      if (btn) btn.classList.remove('bg-blue-500/20', 'border-blue-500', 'text-blue-400', 'font-bold');
    }
  };

  window.runDSACode = async function() {
    const textarea = document.getElementById('dsa-code-textarea');
    const code = textarea ? textarea.value : '';
    const customInputEl = document.getElementById('dsa-custom-input');
    const customInput = (customInputEl && !customInputEl.closest('#dsa-custom-input-container').classList.contains('hidden'))
      ? customInputEl.value : null;

    const runBtn = document.getElementById('dsa-run-btn');
    const statusEl = document.getElementById('dsa-compiler-running-status');
    const terminalDrawer = document.getElementById('dsa-terminal-output');

    if (runBtn) {
      runBtn.disabled = true;
      runBtn.innerHTML = `
        <svg class="animate-spin h-3.5 w-3.5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Compiling...</span>
      `;
    }

    if (statusEl) {
      statusEl.textContent = `Compiling ${activeLanguage.toUpperCase()} on host...`;
      statusEl.classList.remove('hidden');
    }

    if (terminalDrawer) {
      terminalDrawer.classList.remove('hidden');
      terminalDrawer.innerHTML = `
        <div class="p-4 space-y-2 text-left font-mono text-xs text-neutral-400 animate-pulse">
          <div class="flex items-center gap-2 text-blue-400">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
            <strong>Invoking host ${activeLanguage.toUpperCase()} compiler/runtime...</strong>
          </div>
          <div class="text-[11px] text-neutral-500">> Executing testcases with safety limits...</div>
        </div>
      `;
    }

    try {
      const problemSlug = activeProblem.slug || activeProblem.id;
      let res;
      if (window.TechPrepAPI && window.TechPrepAPI.runDsaCode) {
        res = await window.TechPrepAPI.runDsaCode({
          problemId: problemSlug,
          problemTitle: activeProblem.title,
          language: activeLanguage,
          code,
          customInput: customInput && customInput.trim() !== '' ? customInput : undefined,
          source: 'ide',
          actionType: 'run'
        });
      }

      let evaluation = null;
      if (res && res.result) {
        evaluation = res.result;
      } else {
        evaluation = evaluateCodeSubmission(activeProblem, code, activeLanguage, false);
      }

      // Persist run execution to history (MongoDB Atlas via backend and client store)
      saveDSASubmission({
        _id: res && res.submission ? res.submission._id : undefined,
        _backendSynced: Boolean(res && res.submission),
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        difficulty: activeProblem.difficulty,
        language: activeLanguage,
        code,
        actionType: 'run',
        source: 'ide',
        status: evaluation.status || 'Accepted',
        runtimeMs: evaluation.runtimeMs || (parseInt(evaluation.runtime) || 45),
        memoryMb: evaluation.memoryMb || 40.2,
        passedCases: evaluation.passedCases !== undefined ? evaluation.passedCases : (evaluation.testResults ? evaluation.testResults.filter(r => r.status === 'Passed').length : 0),
        totalCases: evaluation.totalCases !== undefined ? evaluation.totalCases : (evaluation.testResults ? evaluation.testResults.length : 0),
        testResults: evaluation.testResults || [],
        timestamp: new Date().toISOString()
      });

      renderTerminalOutput(evaluation, false);
      renderSubmissionsHistory();
    } catch (err) {
      console.warn('Host compiler request failed, falling back:', err.message);
      const evaluation = evaluateCodeSubmission(activeProblem, code, activeLanguage, false);
      saveDSASubmission({
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        difficulty: activeProblem.difficulty,
        language: activeLanguage,
        code,
        actionType: 'run',
        source: 'ide',
        status: evaluation.status || 'Accepted',
        runtimeMs: evaluation.runtimeMs || (parseInt(evaluation.runtime) || 45),
        memoryMb: evaluation.memoryMb || 40.2,
        passedCases: evaluation.passedCases !== undefined ? evaluation.passedCases : (evaluation.testResults ? evaluation.testResults.filter(r => r.status === 'Passed').length : 0),
        totalCases: evaluation.totalCases !== undefined ? evaluation.totalCases : (evaluation.testResults ? evaluation.testResults.length : 0),
        testResults: evaluation.testResults || [],
        timestamp: new Date().toISOString()
      });
      renderTerminalOutput(evaluation, false);
      renderSubmissionsHistory();
    } finally {
      if (runBtn) {
        runBtn.disabled = false;
        runBtn.innerHTML = `<span>Run Code</span>`;
      }
      if (statusEl) statusEl.classList.add('hidden');
    }
  };

  window.submitDSACode = async function() {
    const textarea = document.getElementById('dsa-code-textarea');
    const code = textarea ? textarea.value : '';

    const submitBtn = document.getElementById('dsa-submit-btn');
    const statusEl = document.getElementById('dsa-compiler-running-status');
    const terminalDrawer = document.getElementById('dsa-terminal-output');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-3.5 w-3.5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Evaluating...</span>
      `;
    }

    if (statusEl) {
      statusEl.textContent = `Testing all test cases on host compiler...`;
      statusEl.classList.remove('hidden');
    }

    if (terminalDrawer) {
      terminalDrawer.classList.remove('hidden');
      terminalDrawer.innerHTML = `
        <div class="p-4 space-y-2 text-left font-mono text-xs text-neutral-400 animate-pulse">
          <div class="flex items-center gap-2 text-emerald-400">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <strong>Running full test suite on ${activeLanguage.toUpperCase()} toolchain...</strong>
          </div>
          <div class="text-[11px] text-neutral-500">> Verifying all testcases and bounds...</div>
        </div>
      `;
    }

    try {
      const problemSlug = activeProblem.slug || activeProblem.id;
      const currentUser = (window.TechPrepAuth && window.TechPrepAuth.getCurrentUser ? window.TechPrepAuth.getCurrentUser() : null) || 
                          (window.getCurrentUser ? window.getCurrentUser() : null) || 
                          (typeof sessionStorage !== 'undefined' && JSON.parse(sessionStorage.getItem('techprep_current_user') || 'null'));
      let res;

      if (window.TechPrepAPI && window.TechPrepAPI.submitDsaSolution) {
        res = await window.TechPrepAPI.submitDsaSolution({
          studentEmail: currentUser ? currentUser.email : 'guest@techprepai.com',
          problemId: problemSlug,
          problemTitle: activeProblem.title,
          language: activeLanguage,
          code,
          source: 'ide',
          actionType: 'submit'
        });
      }

      const evaluation = (res && (res.evaluation || res.submission)) ? (res.evaluation || res.submission) : evaluateCodeSubmission(activeProblem, code, activeLanguage, true);

      // Save submission record
      saveDSASubmission({
        _id: res && res.submission ? res.submission._id : undefined,
        _backendSynced: Boolean(res && res.submission),
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        difficulty: activeProblem.difficulty,
        language: activeLanguage,
        code,
        actionType: 'submit',
        source: 'ide',
        status: evaluation.status || 'Accepted',
        runtimeMs: evaluation.runtimeMs || (parseInt(evaluation.runtime) || 45),
        memoryMb: evaluation.memoryMb || 40.2,
        passedCases: evaluation.passedCases !== undefined ? evaluation.passedCases : (evaluation.testResults ? evaluation.testResults.filter(r => r.status === 'Passed').length : 0),
        totalCases: evaluation.totalCases !== undefined ? evaluation.totalCases : (evaluation.testResults ? evaluation.testResults.length : 0),
        testResults: evaluation.testResults || [],
        timestamp: new Date().toISOString()
      });

      renderTerminalOutput(evaluation, true);
      renderSubmissionsHistory(true);
      updateSolvedCounters();

      switchDSALeftTab('submissions');
    } catch (err) {
      console.warn('Submission request failed, falling back:', err.message);
      const evaluation = evaluateCodeSubmission(activeProblem, code, activeLanguage, true);
      saveDSASubmission({
        problemId: activeProblem.id,
        problemTitle: activeProblem.title,
        difficulty: activeProblem.difficulty,
        language: activeLanguage,
        code,
        actionType: 'submit',
        source: 'ide',
        status: evaluation.status || 'Accepted',
        runtimeMs: evaluation.runtimeMs || (parseInt(evaluation.runtime) || 45),
        memoryMb: evaluation.memoryMb || 40.2,
        passedCases: evaluation.passedCases !== undefined ? evaluation.passedCases : (evaluation.testResults ? evaluation.testResults.filter(r => r.status === 'Passed').length : 0),
        totalCases: evaluation.totalCases !== undefined ? evaluation.totalCases : (evaluation.testResults ? evaluation.testResults.length : 0),
        testResults: evaluation.testResults || [],
        timestamp: new Date().toISOString()
      });
      renderTerminalOutput(evaluation, true);
      renderSubmissionsHistory();
      updateSolvedCounters();
      switchDSALeftTab('submissions');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Submit Code</span>`;
      }
      if (statusEl) statusEl.classList.add('hidden');
    }
  };

  function renderTerminalOutput(evaluation, isSubmit) {
    const terminalDrawer = document.getElementById('dsa-terminal-output');
    if (!terminalDrawer) return;

    terminalDrawer.classList.remove('hidden');

    // Check for Compile Error
    if (evaluation.status === 'Compile Error') {
      terminalDrawer.innerHTML = `
        <div class="p-4 space-y-3 text-left">
          <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                COMPILE ERROR
              </span>
              <span class="font-mono text-xs text-neutral-500">Compiler: <strong>${escapeHTML(evaluation.compiler || activeLanguage)}</strong></span>
            </div>
            <button onclick="document.getElementById('dsa-terminal-output').classList.add('hidden')" class="text-neutral-400 hover:text-neutral-200 font-mono text-xs">
              Close
            </button>
          </div>
          <div class="p-3.5 rounded-lg bg-neutral-900 border border-amber-500/30 text-amber-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
            ${escapeHTML(evaluation.error || evaluation.stderr || 'Compilation failed with syntax error.')}
          </div>
        </div>
      `;
      return;
    }

    // Check for Custom Stdin Input Execution output
    if (evaluation.stdout !== undefined && (!evaluation.testResults || evaluation.testResults.length === 0)) {
      const isSuccess = evaluation.status === 'Success';
      terminalDrawer.innerHTML = `
        <div class="p-4 space-y-3 text-left">
          <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <div class="flex items-center space-x-3">
              <span class="px-3 py-1 rounded text-xs font-mono font-bold ${isSuccess ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}">
                ${evaluation.status.toUpperCase()}
              </span>
              <span class="font-mono text-xs text-neutral-500">Runtime: <strong class="text-white">${evaluation.runtime || '0 ms'}</strong></span>
              <span class="font-mono text-xs text-neutral-500">Memory: <strong class="text-white">${evaluation.memory || '40 MB'}</strong></span>
            </div>
            <button onclick="document.getElementById('dsa-terminal-output').classList.add('hidden')" class="text-neutral-400 hover:text-neutral-200 font-mono text-xs">
              Close
            </button>
          </div>
          <div class="space-y-2">
            <div class="text-[11px] font-mono text-neutral-400">Standard Output (stdout):</div>
            <pre class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-xs whitespace-pre-wrap">${escapeHTML(evaluation.stdout || '(No output)')}</pre>
            ${evaluation.stderr ? `
              <div class="text-[11px] font-mono text-rose-400 mt-2">Standard Error (stderr):</div>
              <pre class="p-3 rounded-lg bg-neutral-900 border border-rose-800/40 text-rose-300 font-mono text-xs whitespace-pre-wrap">${escapeHTML(evaluation.stderr)}</pre>
            ` : ''}
          </div>
        </div>
      `;
      return;
    }

    let verdictBadge = '';
    if (evaluation.status === 'Accepted') {
      verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">ACCEPTED</span>`;
    } else if (evaluation.status === 'Wrong Answer') {
      verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">WRONG ANSWER</span>`;
    } else {
      verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">${(evaluation.status || 'UNKNOWN').toUpperCase()}</span>`;
    }

    const testResults = evaluation.testResults || [];
    const testResultsHtml = testResults.map(r => `
      <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs space-y-1">
        <div class="flex items-center justify-between font-mono font-bold">
          <span>Test Case ${r.testCaseIndex}:</span>
          <span class="${r.status === 'Passed' ? 'text-emerald-500' : 'text-rose-500'}">${r.status} (${r.runtimeMs} ms)</span>
        </div>
        <div class="font-mono text-[11px] text-neutral-500">Input: <code class="text-neutral-700 dark:text-neutral-300">${escapeHTML(r.input)}</code></div>
        <div class="font-mono text-[11px] text-neutral-500">Expected: <code class="text-emerald-600 dark:text-emerald-400">${escapeHTML(r.expectedOutput)}</code></div>
        <div class="font-mono text-[11px] text-neutral-500">Output: <code class="${r.status === 'Passed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}">${escapeHTML(r.actualOutput)}</code></div>
      </div>
    `).join('');

    terminalDrawer.innerHTML = `
      <div class="p-4 space-y-3 text-left">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <div class="flex items-center space-x-3">
            ${verdictBadge}
            <span class="font-mono text-xs text-neutral-500">Runtime: <strong class="text-neutral-900 dark:text-white">${evaluation.runtime || (evaluation.runtimeMs + ' ms')}</strong></span>
            <span class="font-mono text-xs text-neutral-500">Memory: <strong class="text-neutral-900 dark:text-white">${evaluation.memory || (evaluation.memoryMb + ' MB')}</strong></span>
            ${evaluation.compiler ? `<span class="hidden sm:inline-block font-mono text-[11px] text-neutral-400">(${escapeHTML(evaluation.compiler)})</span>` : ''}
          </div>
          <button onclick="document.getElementById('dsa-terminal-output').classList.add('hidden')" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-mono text-xs flex items-center gap-1">
            <svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            Close
          </button>
        </div>
        <div class="space-y-2 max-h-48 overflow-y-auto">${testResultsHtml}</div>
      </div>`;
  }

  function updateSolvedCounters() {
    const progress = getDSAProgress();
    const solvedIds = progress.solved || [];
    const problems = getDSAProblems();

    let easyCount = 0, medCount = 0, hardCount = 0;
    solvedIds.forEach(id => {
      const p = problems.find(item => item.id === id);
      if (p) {
        if (p.difficulty === 'Easy') easyCount++;
        else if (p.difficulty === 'Medium') medCount++;
        else if (p.difficulty === 'Hard') hardCount++;
      }
    });

    const easyEl = document.getElementById('dsa-metric-easy');
    const medEl = document.getElementById('dsa-metric-med');
    const hardEl = document.getElementById('dsa-metric-hard');

    if (easyEl) easyEl.textContent = `${easyCount} Easy`;
    if (medEl) medEl.textContent = `${medCount} Medium`;
    if (hardEl) hardEl.textContent = `${hardCount} Hard`;
  }

  // --- PROBLEM EXPLORER MODAL CONTROLLER ---
  window.openDSAProblemExplorer = function() {
    const modal = document.getElementById('dsa-problem-explorer-modal');
    if (!modal) return;
    renderDSAProblemExplorerTable();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeDSAProblemExplorer = function() {
    const modal = document.getElementById('dsa-problem-explorer-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.renderDSAProblemExplorerTable = function() {
    const container = document.getElementById('dsa-explorer-table-body');
    if (!container) return;

    const problems = getDSAProblems();
    const progress = getDSAProgress();
    const solvedIds = progress.solved || [];

    const searchQuery = (document.getElementById('dsa-explorer-search')?.value || '').trim().toLowerCase();
    const diffFilter = document.getElementById('dsa-explorer-diff-filter')?.value || 'ALL';

    const filtered = problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
      const matchesDiff = diffFilter === 'ALL' || p.difficulty === diffFilter;
      return matchesSearch && matchesDiff;
    });

    if (!filtered.length) {
      container.innerHTML = `
        <tr>
          <td colspan="5" class="text-center py-10 text-neutral-500 font-mono text-xs">
            No problems matching search filter.
          </td>
        </tr>`;
      return;
    }

    container.innerHTML = filtered.map(p => {
      const isSolved = solvedIds.includes(p.id);
      let diffBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      if (p.difficulty === 'Medium') diffBadge = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      else if (p.difficulty === 'Hard') diffBadge = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";

      return `
        <tr onclick="selectExplorerProblem('${p.id}')" class="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors ${p.id === activeProblem.id ? 'bg-blue-500/5 font-semibold' : ''}">
          <td class="py-3 px-4 font-mono text-center">
            ${isSolved ? '<svg class="w-3.5 h-3.5 text-emerald-500 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>' : '<span class="text-neutral-400">-</span>'}
          </td>
          <td class="py-3 px-4">
            <div class="font-bold text-neutral-900 dark:text-white text-xs">${escapeHTML(p.title)}</div>
            <div class="text-[10px] font-mono text-neutral-500">${escapeHTML(p.category)}</div>
          </td>
          <td class="py-3 px-4">
            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${diffBadge}">
              ${escapeHTML(p.difficulty)}
            </span>
          </td>
          <td class="py-3 px-4 font-mono text-neutral-500 text-xs">${p.acceptanceRate || '50.0%'}</td>
          <td class="py-3 px-4 text-right">
            <button onclick="event.stopPropagation(); selectExplorerProblem('${p.id}')" class="px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-colors">
              Solve →
            </button>
          </td>
        </tr>`;
    }).join('');
  };

  window.selectExplorerProblem = function(problemId) {
    loadProblemDetails(problemId);
    closeDSAProblemExplorer();
  };

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
})();



