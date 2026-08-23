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

  function renderSubmissionsHistory() {
    const subContainer = document.getElementById('dsa-submissions-content');
    if (!subContainer) return;

    const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
    const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';

    const allSubs = getDSASubmissions();
    const problemSubs = allSubs.filter(s => s.problemId === activeProblem.id && (s.userEmail === userEmail || !s.userEmail));

    if (!problemSubs.length) {
      subContainer.innerHTML = `
        <div class="text-center py-12 text-neutral-500 font-mono text-xs border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-surface-secondary">
          No submission attempts logged for this problem yet. Write your code and click "Submit Code" to test your solution!
        </div>`;
      return;
    }

    subContainer.innerHTML = `
      <div class="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated text-left">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono bg-surface-secondary">
              <th class="py-2.5 px-3 font-semibold">VERDICT</th>
              <th class="py-2.5 px-3 font-semibold">LANGUAGE</th>
              <th class="py-2.5 px-3 font-semibold">RUNTIME</th>
              <th class="py-2.5 px-3 font-semibold">MEMORY</th>
              <th class="py-2.5 px-3 font-semibold">TIME</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/60 font-sans">
            ${problemSubs.map(s => `
              <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                <td class="py-2.5 px-3">
                  <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    s.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' :
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  }">${escapeHTML(s.status)}</span>
                </td>
                <td class="py-2.5 px-3 font-mono text-[11px] text-neutral-500 uppercase">${escapeHTML(s.language || 'javascript')}</td>
                <td class="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300">${s.runtimeMs} ms</td>
                <td class="py-2.5 px-3 font-mono text-neutral-700 dark:text-neutral-300">${s.memoryMb} MB</td>
                <td class="py-2.5 px-3 font-mono text-[10px] text-neutral-500">${new Date(s.timestamp).toLocaleTimeString()}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>`;
  }

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

  window.runDSACode = function() {
    const textarea = document.getElementById('dsa-code-textarea');
    const code = textarea ? textarea.value : '';
    
    const evaluation = evaluateCodeSubmission(activeProblem, code, activeLanguage, false);
    renderTerminalOutput(evaluation, false);
  };

  window.submitDSACode = function() {
    const textarea = document.getElementById('dsa-code-textarea');
    const code = textarea ? textarea.value : '';

    const evaluation = evaluateCodeSubmission(activeProblem, code, activeLanguage, true);
    
    // Save submission record
    saveDSASubmission({
      problemId: activeProblem.id,
      problemTitle: activeProblem.title,
      difficulty: activeProblem.difficulty,
      language: activeLanguage,
      status: evaluation.status,
      runtimeMs: evaluation.runtimeMs,
      memoryMb: evaluation.memoryMb,
      timestamp: new Date().toISOString()
    });

    renderTerminalOutput(evaluation, true);
    renderSubmissionsHistory();
    updateSolvedCounters();

    // Auto switch to Submissions tab if user submitted code
    switchDSALeftTab('submissions');
  };

  function renderTerminalOutput(evaluation, isSubmit) {
    const terminalDrawer = document.getElementById('dsa-terminal-output');
    if (!terminalDrawer) return;

    terminalDrawer.classList.remove('hidden');

    let verdictBadge = '';
    if (evaluation.status === 'Accepted') {
      verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">ACCEPTED</span>`;
    } else if (evaluation.status === 'Wrong Answer') {
      verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">WRONG ANSWER</span>`;
    } else {
      verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">${evaluation.status.toUpperCase()}</span>`;
    }

    const testResultsHtml = evaluation.testResults.map(r => `
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
            <span class="font-mono text-xs text-neutral-500">Runtime: <strong class="text-neutral-900 dark:text-white">${evaluation.runtimeMs} ms</strong></span>
            <span class="font-mono text-xs text-neutral-500">Memory: <strong class="text-neutral-900 dark:text-white">${evaluation.memoryMb} MB</strong></span>
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



