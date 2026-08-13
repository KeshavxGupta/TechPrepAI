/**
 * TechPrep AI - Admin Resume Studio Component & Controller
 * Canva-style layout management & user-wise resume inspection.
 */

(function() {
  window.initAdminResumeStudio = function() {
    renderAdminTemplatesTable();
    renderAdminUserResumesTable();
  };

  window.switchAdminResumeTab = function(tabName) {
    const panels = ['templates', 'user-resumes'];
    panels.forEach(p => {
      const panel = document.getElementById(`res-tab-panel-${p}`);
      const btn = document.getElementById(`res-tab-btn-${p}`);
      if (p === tabName) {
        if (panel) panel.classList.remove('hidden');
        if (btn) btn.className = "px-4 py-2 font-semibold text-xs border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 transition-colors";
      } else {
        if (panel) panel.classList.add('hidden');
        if (btn) btn.className = "px-4 py-2 font-semibold text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors border-b-2 border-transparent";
      }
    });
  };

  // --- TEMPLATES CONTROL ---
  window.renderAdminTemplatesTable = function() {
    const container = document.getElementById('admin-templates-table-body');
    if (!container) return;

    const templates = getResumeTemplates();
    if (!templates.length) {
      container.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-neutral-500 font-mono text-xs">No resume templates found.</td></tr>`;
      return;
    }

    container.innerHTML = templates.map(t => `
      <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
        <td class="py-3 px-4 font-bold text-neutral-900 dark:text-white flex items-center space-x-2">
          <span class="w-3.5 h-3.5 rounded-full border border-white/20" style="background-color: ${t.defaultColor || '#2563eb'}"></span>
          <span>${escapeHTML(t.title)}</span>
        </td>
        <td class="py-3 px-4 font-mono text-xs text-neutral-600 dark:text-neutral-400">${escapeHTML(t.category || 'General')}</td>
        <td class="py-3 px-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">${escapeHTML(t.layoutType)}</td>
        <td class="py-3 px-4 font-mono text-xs text-neutral-500">${t.fontFamily}</td>
        <td class="py-3 px-4">
          <div class="flex items-center space-x-2">
            <button onclick="openAdminTemplateModal('${t.id}')" class="px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
              Edit Layout
            </button>
            <button onclick="deleteAdminTemplate('${t.id}')" class="px-2.5 py-1 text-xs rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.openAdminTemplateModal = function(templateId) {
    const modal = document.getElementById('admin-template-modal');
    const title = document.getElementById('admin-template-modal-title');
    const idInput = document.getElementById('tmpl-form-id');
    const titleInput = document.getElementById('tmpl-form-title');
    const catInput = document.getElementById('tmpl-form-cat');
    const descInput = document.getElementById('tmpl-form-desc');
    const colorInput = document.getElementById('tmpl-form-color');
    const fontInput = document.getElementById('tmpl-form-font');
    const layoutInput = document.getElementById('tmpl-form-layout');

    if (!modal) return;

    if (templateId) {
      const templates = getResumeTemplates();
      const t = templates.find(item => item.id === templateId);
      if (t) {
        if (title) title.textContent = 'Edit Layout Template Blueprint';
        if (idInput) idInput.value = t.id;
        if (titleInput) titleInput.value = t.title;
        if (catInput) catInput.value = t.category;
        if (descInput) descInput.value = t.description;
        if (colorInput) colorInput.value = t.defaultColor || '#2563eb';
        if (fontInput) fontInput.value = t.fontFamily || 'Inter, sans-serif';
        if (layoutInput) layoutInput.value = t.layoutType || 'modern_sidebar';
      }
    } else {
      if (title) title.textContent = 'Create New Canva-Style Layout Template';
      if (idInput) idInput.value = '';
      if (titleInput) titleInput.value = '';
      if (catInput) catInput.value = 'Software Engineering';
      if (descInput) descInput.value = 'Two column design layout with customizable accent color palette.';
      if (colorInput) colorInput.value = '#2563eb';
      if (fontInput) fontInput.value = 'Inter, sans-serif';
      if (layoutInput) layoutInput.value = 'modern_sidebar';
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeAdminTemplateModal = function() {
    const modal = document.getElementById('admin-template-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.saveAdminTemplateForm = function(e) {
    e.preventDefault();
    const id = document.getElementById('tmpl-form-id').value;
    const title = document.getElementById('tmpl-form-title').value.trim();
    const category = document.getElementById('tmpl-form-cat').value.trim();
    const description = document.getElementById('tmpl-form-desc').value.trim();
    const defaultColor = document.getElementById('tmpl-form-color').value;
    const fontFamily = document.getElementById('tmpl-form-font').value;
    const layoutType = document.getElementById('tmpl-form-layout').value;

    let templates = getResumeTemplates();
    if (id) {
      const idx = templates.findIndex(t => t.id === id);
      if (idx !== -1) {
        templates[idx] = { ...templates[idx], title, category, description, defaultColor, fontFamily, layoutType };
      }
    } else {
      templates.push({
        id: 'tmpl_' + Date.now(),
        title, category, description, defaultColor, fontFamily, layoutType
      });
    }

    saveResumeTemplates(templates);
    closeAdminTemplateModal();
    renderAdminTemplatesTable();
    if (window.customAlert) {
      window.customAlert('Template Saved', 'Resume template design blueprint saved successfully!', 'success');
    }
  };

  window.deleteAdminTemplate = function(templateId) {
    if (window.customConfirm) {
      window.customConfirm("Delete Template Blueprint", "Are you sure you want to delete this resume template design?").then(approved => {
        if (approved) {
          let templates = getResumeTemplates();
          templates = templates.filter(t => t.id !== templateId);
          saveResumeTemplates(templates);
          renderAdminTemplatesTable();
          if (window.customAlert) window.customAlert('Template Deleted', 'Resume template deleted.', 'info');
        }
      });
    } else {
      let templates = getResumeTemplates();
      templates = templates.filter(t => t.id !== templateId);
      saveResumeTemplates(templates);
      renderAdminTemplatesTable();
    }
  };

  // --- USER RESUMES DIRECTORY & INSPECTION (USER-WISE) ---
  window.renderAdminUserResumesTable = function() {
    const container = document.getElementById('admin-user-resumes-table-body');
    if (!container) return;

    const resumes = getAllUserResumes();
    const searchQuery = (document.getElementById('admin-res-search-input')?.value || '').trim().toLowerCase();

    const filtered = resumes.filter(r => {
      return (r.userName || '').toLowerCase().includes(searchQuery) ||
             (r.userEmail || '').toLowerCase().includes(searchQuery) ||
             (r.title || '').toLowerCase().includes(searchQuery);
    });

    if (!filtered.length) {
      container.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-neutral-500 font-mono text-xs">No student user resumes recorded.</td></tr>`;
      return;
    }

    container.innerHTML = filtered.map(r => `
      <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
        <td class="py-3 px-4">
          <div class="font-bold text-neutral-900 dark:text-white text-xs">${escapeHTML(r.userName || 'Student')}</div>
          <div class="text-[10px] font-mono text-neutral-500">${escapeHTML(r.userEmail || 'N/A')}</div>
        </td>
        <td class="py-3 px-4 font-bold text-neutral-800 dark:text-neutral-200 text-xs">${escapeHTML(r.title)}</td>
        <td class="py-3 px-4 font-mono text-neutral-500 text-xs">${escapeHTML(r.templateId)}</td>
        <td class="py-3 px-4 font-mono text-xs text-blue-600 dark:text-blue-400 font-bold">${r.atsScore ? r.atsScore + '%' : '85%'}</td>
        <td class="py-3 px-4 font-mono text-[10px] text-neutral-500">${new Date(r.lastUpdated).toLocaleDateString()}</td>
        <td class="py-3 px-4">
          <div class="flex items-center space-x-2">
            <button onclick="inspectAdminUserResume('${r.id}')" class="px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium">
              Inspect Resume
            </button>
            <button onclick="deleteAdminUserResume('${r.id}')" class="px-2.5 py-1 text-xs rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors font-medium">
              Delete
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  };

  window.inspectAdminUserResume = function(resumeId) {
    const modal = document.getElementById('admin-inspect-resume-modal');
    const container = document.getElementById('admin-inspect-resume-container');
    if (!modal || !container) return;

    const resumes = getAllUserResumes();
    const target = resumes.find(r => r.id === resumeId);
    if (!target) return;

    const info = target.personalInfo || {};
    const skills = target.skills || {};

    container.innerHTML = `
      <div class="p-6 bg-white text-gray-900 rounded-lg shadow font-sans text-xs text-left leading-relaxed space-y-4">
        <div class="border-b-2 border-blue-600 pb-3">
          <h2 class="text-xl font-bold uppercase tracking-tight text-gray-900">${escapeHTML(info.name)}</h2>
          <div class="text-xs font-semibold text-blue-600 uppercase font-mono">${escapeHTML(info.title)}</div>
          <div class="flex flex-wrap gap-3 text-[11px] text-gray-600 font-mono mt-1">
            <span>Email: ${escapeHTML(info.email)}</span>
            <span>Phone: ${escapeHTML(info.phone)}</span>
            <span>Location: ${escapeHTML(info.location)}</span>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-xs uppercase font-mono text-blue-600">Professional Summary</h3>
          <p class="text-[11px] text-gray-700 mt-1">${escapeHTML(info.summary)}</p>
        </div>

        <div>
          <h3 class="font-bold text-xs uppercase font-mono text-blue-600">Technical Skills</h3>
          <div class="text-[11px] text-gray-700 mt-1">
            <div><strong>Languages:</strong> ${escapeHTML(skills.languages)}</div>
            <div><strong>Frameworks:</strong> ${escapeHTML(skills.frameworks)}</div>
            <div><strong>Tools:</strong> ${escapeHTML(skills.tools)}</div>
          </div>
        </div>

        <div>
          <h3 class="font-bold text-xs uppercase font-mono text-blue-600">Work Experience (${(target.experience || []).length} entries)</h3>
          ${(target.experience || []).map(e => `
            <div class="mt-2 text-[11px]">
              <div class="font-bold">${escapeHTML(e.jobTitle)} – ${escapeHTML(e.company)}</div>
              <div class="text-gray-600">${escapeHTML(e.description)}</div>
            </div>
          `).join('')}
        </div>
      </div>`;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeAdminInspectResumeModal = function() {
    const modal = document.getElementById('admin-inspect-resume-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.deleteAdminUserResume = function(resumeId) {
    if (window.customConfirm) {
      window.customConfirm("Delete Student Resume", "Delete this student's saved resume draft permanently?").then(approved => {
        if (approved) {
          deleteUserResume(resumeId);
          renderAdminUserResumesTable();
          if (window.customAlert) window.customAlert('Resume Deleted', 'Student resume deleted.', 'info');
        }
      });
    } else {
      deleteUserResume(resumeId);
      renderAdminUserResumesTable();
    }
  };

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
})();
