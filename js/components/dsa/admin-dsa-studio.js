/**
 * TechPrep AI - Admin DSA Studio Component & Controller
 */

(function() {
  window.initAdminDSAStudio = function() {
    renderAdminDSAProblemTable();
  };

  window.renderAdminDSAProblemTable = function() {
    const container = document.getElementById('admin-dsa-problem-table-body');
    if (!container) return;

    const problems = getDSAProblems();
    const searchQuery = (document.getElementById('admin-dsa-search-input')?.value || '').trim().toLowerCase();
    const diffFilter = document.getElementById('admin-dsa-diff-filter')?.value || 'ALL';

    const filtered = problems.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery) || p.category.toLowerCase().includes(searchQuery);
      const matchesDiff = diffFilter === 'ALL' || p.difficulty === diffFilter;
      return matchesSearch && matchesDiff;
    });

    if (!filtered.length) {
      container.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-10 text-neutral-500 font-mono text-xs">
            No DSA problems matching search filter.
          </td>
        </tr>`;
      return;
    }

    container.innerHTML = filtered.map(p => {
      let diffBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      if (p.difficulty === 'Medium') diffBadge = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      else if (p.difficulty === 'Hard') diffBadge = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";

      return `
        <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
          <td class="py-3 px-4 font-bold text-neutral-900 dark:text-white">${escapeHTML(p.title)}</td>
          <td class="py-3 px-4">
            <span class="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold border ${diffBadge}">
              ${escapeHTML(p.difficulty)}
            </span>
          </td>
          <td class="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400 text-xs">${escapeHTML(p.category || 'General')}</td>
          <td class="py-3 px-4 font-mono text-neutral-500">${p.testCases ? p.testCases.length : 0} Testcases</td>
          <td class="py-3 px-4 font-mono text-neutral-500">${p.acceptanceRate || '50.0%'}</td>
          <td class="py-3 px-4">
            <div class="flex items-center space-x-2">
              <a href="../user/dsa-ide.html?p=${p.slug}" target="_blank" class="px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium">
                Test
              </a>
              <button onclick="openAdminDSAModal('${p.id}')" class="px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium">
                Edit
              </button>
              <button onclick="deleteDSAProblem('${p.id}')" class="px-2.5 py-1 text-xs rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors font-medium">
                Delete
              </button>
            </div>
          </td>
        </tr>`;
    }).join('');
  };

  window.openAdminDSAModal = function(problemId) {
    const modal = document.getElementById('admin-dsa-modal');
    const title = document.getElementById('admin-dsa-modal-title');
    const idInput = document.getElementById('dsa-form-id');
    const titleInput = document.getElementById('dsa-form-title');
    const slugInput = document.getElementById('dsa-form-slug');
    const diffInput = document.getElementById('dsa-form-diff');
    const catInput = document.getElementById('dsa-form-cat');
    const tagsInput = document.getElementById('dsa-form-tags');
    const descInput = document.getElementById('dsa-form-desc');
    const constraintsInput = document.getElementById('dsa-form-constraints');
    const hintsInput = document.getElementById('dsa-form-hints');

    // Language starter code
    const jsInput = document.getElementById('dsa-form-tmpl-js');
    const pyInput = document.getElementById('dsa-form-tmpl-py');
    const cppInput = document.getElementById('dsa-form-tmpl-cpp');
    const javaInput = document.getElementById('dsa-form-tmpl-java');

    // Editorial
    const edApproachInput = document.getElementById('dsa-form-ed-approach');
    const edTimeInput = document.getElementById('dsa-form-ed-time');
    const edSpaceInput = document.getElementById('dsa-form-ed-space');

    // Testcase JSON
    const tcJsonInput = document.getElementById('dsa-form-testcases-json');

    if (!modal) return;

    if (problemId) {
      const problems = getDSAProblems();
      const p = problems.find(item => item.id === problemId);
      if (p) {
        if (title) title.textContent = 'Edit DSA Problem';
        if (idInput) idInput.value = p.id;
        if (titleInput) titleInput.value = p.title;
        if (slugInput) slugInput.value = p.slug;
        if (diffInput) diffInput.value = p.difficulty;
        if (catInput) catInput.value = p.category;
        if (tagsInput) tagsInput.value = (p.companyTags || []).join(', ');
        if (descInput) descInput.value = p.description;
        if (constraintsInput) constraintsInput.value = (p.constraints || []).join('\n');
        if (hintsInput) hintsInput.value = (p.hints || []).join('\n');

        const tmpl = p.templates || {};
        if (jsInput) jsInput.value = tmpl.javascript || '';
        if (pyInput) pyInput.value = tmpl.python || '';
        if (cppInput) cppInput.value = tmpl.cpp || '';
        if (javaInput) javaInput.value = tmpl.java || '';

        const ed = p.editorial || {};
        if (edApproachInput) edApproachInput.value = ed.approach || '';
        if (edTimeInput) edTimeInput.value = ed.timeComplexity || 'O(N)';
        if (edSpaceInput) edSpaceInput.value = ed.spaceComplexity || 'O(1)';

        if (tcJsonInput) tcJsonInput.value = JSON.stringify(p.testCases || [], null, 2);
      }
    } else {
      if (title) title.textContent = 'Create New DSA Problem';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (slugInput) slugInput.value = '';
      if (diffInput) diffInput.value = 'Easy';
      if (catInput) catInput.value = 'Arrays';
      if (tagsInput) tagsInput.value = 'Google, Amazon';
      if (descInput) descInput.value = 'Given an array...';
      if (constraintsInput) constraintsInput.value = '1 <= n <= 10^4';
      if (hintsInput) hintsInput.value = 'Think about hash map lookup';

      if (jsInput) jsInput.value = `function solve(input) {\n  return input;\n}`;
      if (pyInput) pyInput.value = `def solve(input):\n    return input`;
      if (cppInput) cppInput.value = `class Solution {\npublic:\n    int solve() {\n        return 0;\n    }\n};`;
      if (javaInput) javaInput.value = `class Solution {\n    public int solve() {\n        return 0;\n    }\n}`;

      if (edApproachInput) edApproachInput.value = 'Use hash map for linear lookup.';
      if (edTimeInput) edTimeInput.value = 'O(N)';
      if (edSpaceInput) edSpaceInput.value = 'O(N)';

      if (tcJsonInput) tcJsonInput.value = JSON.stringify([
        { input: '[1,2,3]\n4', expectedOutput: '[0,1]', isSample: true }
      ], null, 2);
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeAdminDSAModal = function() {
    const modal = document.getElementById('admin-dsa-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.saveDSAProblemForm = function(e) {
    e.preventDefault();
    const id = document.getElementById('dsa-form-id').value;
    const title = document.getElementById('dsa-form-title').value.trim();
    let slug = document.getElementById('dsa-form-slug').value.trim();
    if (!slug) slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const difficulty = document.getElementById('dsa-form-diff').value;
    const category = document.getElementById('dsa-form-cat').value.trim();
    const companyTags = document.getElementById('dsa-form-tags').value.split(',').map(t => t.trim()).filter(Boolean);
    const description = document.getElementById('dsa-form-desc').value.trim();
    const constraints = document.getElementById('dsa-form-constraints').value.split('\n').map(c => c.trim()).filter(Boolean);
    const hints = document.getElementById('dsa-form-hints').value.split('\n').map(h => h.trim()).filter(Boolean);

    const templates = {
      javascript: document.getElementById('dsa-form-tmpl-js').value,
      python: document.getElementById('dsa-form-tmpl-py').value,
      cpp: document.getElementById('dsa-form-tmpl-cpp').value,
      java: document.getElementById('dsa-form-tmpl-java').value
    };

    const editorial = {
      approach: document.getElementById('dsa-form-ed-approach').value,
      timeComplexity: document.getElementById('dsa-form-ed-time').value,
      spaceComplexity: document.getElementById('dsa-form-ed-space').value
    };

    let testCases = [];
    try {
      testCases = JSON.parse(document.getElementById('dsa-form-testcases-json').value);
    } catch (err) {
      if (window.customAlert) {
        window.customAlert("Invalid Testcases JSON", "Error parsing testcases JSON: " + err.message, "error");
      } else if (window.showToast) {
        window.showToast("Invalid JSON format in Testcases", "error");
      }
      return;
    }

    let problems = getDSAProblems();
    if (id) {
      const idx = problems.findIndex(p => p.id === id);
      if (idx !== -1) {
        problems[idx] = { ...problems[idx], title, slug, difficulty, category, companyTags, description, constraints, hints, templates, editorial, testCases };
      }
    } else {
      const newProblem = {
        id: 'p_' + Date.now(),
        title, slug, difficulty, category, companyTags, description, constraints, hints, templates, editorial, testCases,
        acceptanceRate: '50.0%'
      };
      problems.push(newProblem);
    }

    saveDSAProblems(problems);
    closeAdminDSAModal();
    renderAdminDSAProblemTable();
    if (window.showToast) {
      window.showToast("DSA problem saved successfully!", "success");
    } else if (window.customAlert) {
      window.customAlert("Saved", "DSA problem saved successfully!", "success");
    }
  };

  window.deleteDSAProblem = function(problemId) {
    const doDelete = () => {
      let problems = getDSAProblems();
      problems = problems.filter(p => p.id !== problemId);
      saveDSAProblems(problems);
      renderAdminDSAProblemTable();
      if (window.showToast) window.showToast("DSA problem deleted", "success");
    };

    if (window.customConfirm) {
      window.customConfirm("Delete Problem", "Are you sure you want to delete this DSA problem?").then(confirmed => {
        if (confirmed) doDelete();
      });
    } else {
      doDelete();
    }
  };

  window.exportDSAProblemsJSON = function() {
    const data = getDSAProblems();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `techprep_dsa_problems_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    if (window.showToast) window.showToast("DSA problems exported successfully", "success");
  };

  window.importDSAProblemsJSON = function(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data)) {
          saveDSAProblems(data);
          renderAdminDSAProblemTable();
          if (window.showToast) window.showToast("DSA problem dataset restored successfully!", "success");
          else if (window.customAlert) window.customAlert("Data Restored", "DSA problem dataset restored successfully!", "success");
        }
      } catch (err) {
        if (window.customAlert) window.customAlert("Import Error", "Failed to parse JSON: " + err.message, "error");
        else if (window.showToast) window.showToast("Failed to parse JSON", "error");
      }
    };
    reader.readAsText(file);
    input.value = '';
  };

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
})();



