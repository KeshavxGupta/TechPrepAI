/**
 * TechPrep AI - User Resume Builder & Live Preview Controller
 * Canva-style radically distinct template cover designs & fixed viewport preview.
 */

(function() {
  let currentResume = null;
  let activeTemplates = [];

  window.initResumeBuilder = function() {
    activeTemplates = getResumeTemplates();
    
    const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
    const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';
    const userResumes = getUserResumes(userEmail);

    if (userResumes.length > 0) {
      currentResume = userResumes[0];
    } else {
      currentResume = createEmptyResumeData();
    }

    populateFormInputs();
    renderTemplateSelector();
    renderColorPaletteBar();
    renderLiveResumePreview();
    renderDraftsHistoryList();
  };

  function populateFormInputs() {
    if (!currentResume) return;

    const titleInput = document.getElementById('res-title-input');
    if (titleInput) titleInput.value = currentResume.title || 'Software Engineer Resume';

    const info = currentResume.personalInfo || {};
    setInputValue('res-form-name', info.name);
    setInputValue('res-form-jobtitle', info.title);
    setInputValue('res-form-email', info.email);
    setInputValue('res-form-phone', info.phone);
    setInputValue('res-form-location', info.location);
    setInputValue('res-form-linkedin', info.linkedin);
    setInputValue('res-form-github', info.github);
    setInputValue('res-form-portfolio', info.portfolio);
    setInputValue('res-form-summary', info.summary);

    const skills = currentResume.skills || {};
    setInputValue('res-form-skills-lang', skills.languages);
    setInputValue('res-form-skills-frameworks', skills.frameworks);
    setInputValue('res-form-skills-tools', skills.tools);
    setInputValue('res-form-skills-core', skills.coreCS);

    renderExperienceFormList();
    renderProjectsFormList();
    renderEducationFormList();
  }

  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  window.updateResumeDataFromForm = function() {
    if (!currentResume) return;

    currentResume.title = document.getElementById('res-title-input')?.value || 'Untitled Resume';

    currentResume.personalInfo = {
      name: document.getElementById('res-form-name')?.value || '',
      title: document.getElementById('res-form-jobtitle')?.value || '',
      email: document.getElementById('res-form-email')?.value || '',
      phone: document.getElementById('res-form-phone')?.value || '',
      location: document.getElementById('res-form-location')?.value || '',
      linkedin: document.getElementById('res-form-linkedin')?.value || '',
      github: document.getElementById('res-form-github')?.value || '',
      portfolio: document.getElementById('res-form-portfolio')?.value || '',
      summary: document.getElementById('res-form-summary')?.value || ''
    };

    currentResume.skills = {
      languages: document.getElementById('res-form-skills-lang')?.value || '',
      frameworks: document.getElementById('res-form-skills-frameworks')?.value || '',
      tools: document.getElementById('res-form-skills-tools')?.value || '',
      coreCS: document.getElementById('res-form-skills-core')?.value || ''
    };

    renderLiveResumePreview();
  };

  // Color Palette Bar
  function renderColorPaletteBar() {
    const container = document.getElementById('res-color-palette-bar');
    if (!container) return;

    const currentColor = currentResume.accentColor || '#2563eb';
    container.innerHTML = COLOR_PALETTES.map(p => `
      <button type="button" onclick="selectResumeAccentColor('${p.hex}')" title="${p.name}"
        class="w-5 h-5 rounded-full border-2 transition-all ${currentColor === p.hex ? 'scale-125 border-white shadow-lg ring-2 ring-blue-500' : 'border-transparent hover:scale-110'}"
        style="background-color: ${p.hex}">
      </button>
    `).join('');
  }

  window.selectResumeAccentColor = function(hexColor) {
    if (!currentResume) return;
    currentResume.accentColor = hexColor;
    renderColorPaletteBar();
    renderLiveResumePreview();
  };

  // Render Live Resume Preview with 4 Radically Distinct Canva-Style Cover Designs
  window.renderLiveResumePreview = function() {
    const previewContainer = document.getElementById('resume-live-preview');
    if (!previewContainer || !currentResume) return;

    const templates = getResumeTemplates();
    const tmpl = templates.find(t => t.id === currentResume.templateId) || templates[0];
    const color = currentResume.accentColor || tmpl.defaultColor || '#2563eb';
    const layout = tmpl.layoutType || 'modern_sidebar';

    const info = currentResume.personalInfo || {};
    const skills = currentResume.skills || {};

    const initials = (info.name || 'AR').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    let previewHTML = '';

    if (layout === 'modern_sidebar') {
      // DESIGN 1: Canva Modern Two-Column Accent Sidebar Design
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl rounded-lg font-sans text-left grid grid-cols-12 overflow-hidden min-h-[920px]">
          <!-- Left Color Accent Sidebar (35% width) -->
          <div class="col-span-4 p-5 text-white space-y-5 flex flex-col justify-between" style="background-color: ${color}">
            <div class="space-y-5">
              <!-- Avatar Circle & Name -->
              <div class="space-y-2">
                <div class="w-12 h-12 rounded-full bg-white/20 text-white font-mono font-bold text-base flex items-center justify-center ring-2 ring-white/30">
                  ${initials}
                </div>
                <h1 class="text-lg font-extrabold uppercase tracking-tight text-white leading-tight">${escapeHTML(info.name)}</h1>
                <div class="text-[11px] font-semibold text-white/90 uppercase font-mono">${escapeHTML(info.title)}</div>
              </div>

              <!-- Contact List -->
              <div class="space-y-1.5 text-[10px] text-white/90 font-mono border-t border-white/20 pt-3">
                <h3 class="font-bold uppercase tracking-wider text-white text-[9px]">Contact Details</h3>
                ${info.email ? `<div class="truncate">âœ‰ ${escapeHTML(info.email)}</div>` : ''}
                ${info.phone ? `<div>ðŸ“± ${escapeHTML(info.phone)}</div>` : ''}
                ${info.location ? `<div>ðŸ“ ${escapeHTML(info.location)}</div>` : ''}
                ${info.linkedin ? `<div class="truncate">ðŸ”— ${escapeHTML(info.linkedin)}</div>` : ''}
                ${info.github ? `<div class="truncate">ðŸ’» ${escapeHTML(info.github)}</div>` : ''}
              </div>

              <!-- Skill Badges -->
              <div class="space-y-2 border-t border-white/20 pt-3 text-[10px]">
                <h3 class="font-bold uppercase tracking-wider text-white font-mono text-[9px]">Skills Matrix</h3>
                ${skills.languages ? `<div><strong class="block text-white/70 text-[9px]">Languages:</strong>${escapeHTML(skills.languages)}</div>` : ''}
                ${skills.frameworks ? `<div><strong class="block text-white/70 text-[9px]">Frameworks:</strong>${escapeHTML(skills.frameworks)}</div>` : ''}
                ${skills.tools ? `<div><strong class="block text-white/70 text-[9px]">Tools:</strong>${escapeHTML(skills.tools)}</div>` : ''}
              </div>

              <!-- Education -->
              ${currentResume.education && currentResume.education.length ? `
              <div class="space-y-2 border-t border-white/20 pt-3 text-[10px]">
                <h3 class="font-bold uppercase tracking-wider text-white font-mono text-[9px]">Education</h3>
                ${currentResume.education.map(edu => `
                  <div>
                    <div class="font-bold text-white">${escapeHTML(edu.degree)}</div>
                    <div class="text-white/80 text-[9px]">${escapeHTML(edu.institution)} (${escapeHTML(edu.gradYear)})</div>
                  </div>
                `).join('')}
              </div>` : ''}
            </div>
          </div>

          <!-- Right Content Area (65% width) -->
          <div class="col-span-8 p-5 space-y-4 text-gray-800 text-xs">
            ${info.summary ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-1" style="color: ${color}">Professional Profile</h2>
              <p class="text-[11px] text-gray-600 leading-relaxed">${escapeHTML(info.summary)}</p>
            </div>` : ''}

            ${currentResume.experience && currentResume.experience.length ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2 pb-1 border-b border-gray-200" style="color: ${color}">Work Experience</h2>
              ${currentResume.experience.map(exp => `
                <div class="mb-3 space-y-0.5">
                  <div class="flex justify-between items-baseline font-bold text-xs">
                    <span class="text-gray-900">${escapeHTML(exp.jobTitle)}</span>
                    <span class="text-[9px] text-gray-500 font-mono">${escapeHTML(exp.startDate)} â€“ ${escapeHTML(exp.endDate)}</span>
                  </div>
                  <div class="text-[10px] text-gray-600 font-semibold italic mb-1">${escapeHTML(exp.company)}</div>
                  <div class="text-[10px] text-gray-600 whitespace-pre-line leading-relaxed pl-2 border-l-2" style="border-color: ${color}">${escapeHTML(exp.description)}</div>
                </div>
              `).join('')}
            </div>` : ''}

            ${currentResume.projects && currentResume.projects.length ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2 pb-1 border-b border-gray-200" style="color: ${color}">Key Projects</h2>
              ${currentResume.projects.map(proj => `
                <div class="mb-2 space-y-0.5">
                  <div class="flex justify-between items-baseline font-bold text-xs">
                    <span class="text-gray-900">${escapeHTML(proj.title)}</span>
                    <span class="text-[9px] text-gray-500 font-mono">${escapeHTML(proj.techStack)}</span>
                  </div>
                  <div class="text-[10px] text-gray-600 whitespace-pre-line leading-relaxed pl-2 border-l-2" style="border-color: ${color}">${escapeHTML(proj.description)}</div>
                </div>
              `).join('')}
            </div>` : ''}
          </div>
        </div>`;
    } else if (layout === 'minimalist_sv') {
      // DESIGN 2: Silicon Valley Top Hero Banner Card Design
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl rounded-lg font-sans text-left min-h-[920px] overflow-hidden">
          <!-- Top Hero Banner Card -->
          <div class="p-6 text-white space-y-2 text-center" style="background-color: ${color}">
            <h1 class="text-2xl font-extrabold uppercase tracking-tight text-white">${escapeHTML(info.name)}</h1>
            <div class="text-xs font-mono font-semibold uppercase tracking-wider text-white/90">${escapeHTML(info.title)}</div>
            <div class="flex flex-wrap justify-center gap-2 pt-2 text-[10px] font-mono">
              ${info.email ? `<span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white">${escapeHTML(info.email)}</span>` : ''}
              ${info.phone ? `<span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white">${escapeHTML(info.phone)}</span>` : ''}
              ${info.location ? `<span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white">${escapeHTML(info.location)}</span>` : ''}
              ${info.linkedin ? `<span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white">${escapeHTML(info.linkedin)}</span>` : ''}
            </div>
          </div>

          <div class="p-6 space-y-4 text-xs">
            ${info.summary ? `
            <div class="p-3 rounded-lg border-l-4 bg-gray-50 text-[11px] text-gray-700 leading-relaxed" style="border-color: ${color}">
              ${escapeHTML(info.summary)}
            </div>` : ''}

            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Technical Competencies</h2>
              <div class="grid grid-cols-2 gap-2 text-[10px] bg-gray-50 p-3 rounded-lg border border-gray-200">
                ${skills.languages ? `<div><strong>Languages:</strong> ${escapeHTML(skills.languages)}</div>` : ''}
                ${skills.frameworks ? `<div><strong>Frameworks:</strong> ${escapeHTML(skills.frameworks)}</div>` : ''}
                ${skills.tools ? `<div><strong>Tools:</strong> ${escapeHTML(skills.tools)}</div>` : ''}
                ${skills.coreCS ? `<div><strong>Core CS:</strong> ${escapeHTML(skills.coreCS)}</div>` : ''}
              </div>
            </div>

            ${currentResume.experience && currentResume.experience.length ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Experience & Achievements</h2>
              ${currentResume.experience.map(exp => `
                <div class="mb-3 space-y-1">
                  <div class="flex justify-between font-bold text-xs">
                    <span>${escapeHTML(exp.jobTitle)} â€” <span style="color: ${color}">${escapeHTML(exp.company)}</span></span>
                    <span class="text-[9px] text-gray-500 font-mono">${escapeHTML(exp.startDate)} â€“ ${escapeHTML(exp.endDate)}</span>
                  </div>
                  <div class="text-[10px] text-gray-600 whitespace-pre-line leading-relaxed pl-2 border-l-2" style="border-color: ${color}">${escapeHTML(exp.description)}</div>
                </div>
              `).join('')}
            </div>` : ''}

            ${currentResume.projects && currentResume.projects.length ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Project Portfolio</h2>
              ${currentResume.projects.map(proj => `
                <div class="mb-2 space-y-1">
                  <div class="flex justify-between font-bold text-xs">
                    <span>${escapeHTML(proj.title)}</span>
                    <span class="text-[9px] font-mono text-gray-500">${escapeHTML(proj.techStack)}</span>
                  </div>
                  <div class="text-[10px] text-gray-600 whitespace-pre-line leading-relaxed pl-2 border-l-2" style="border-color: ${color}">${escapeHTML(proj.description)}</div>
                </div>
              `).join('')}
            </div>` : ''}
          </div>
        </div>`;
    } else if (layout === 'executive_split') {
      // DESIGN 3: Executive Modern Split-Grid Layout Design
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl rounded-lg font-sans text-left min-h-[920px] p-6 space-y-4">
          <div class="flex justify-between items-center border-b-2 pb-4" style="border-color: ${color}">
            <div>
              <h1 class="text-2xl font-extrabold uppercase tracking-tight text-gray-900">${escapeHTML(info.name)}</h1>
              <div class="text-xs font-bold uppercase tracking-wider font-mono" style="color: ${color}">${escapeHTML(info.title)}</div>
            </div>
            <div class="text-right text-[10px] font-mono text-gray-600 space-y-0.5">
              <div>${escapeHTML(info.email)}</div>
              <div>${escapeHTML(info.phone)}</div>
              <div>${escapeHTML(info.location)}</div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-5 text-xs">
            <div class="col-span-7 space-y-4">
              ${info.summary ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-1" style="color: ${color}">Summary</h2>
                <p class="text-[10px] text-gray-600 leading-relaxed">${escapeHTML(info.summary)}</p>
              </div>` : ''}

              ${currentResume.experience && currentResume.experience.length ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Leadership Experience</h2>
                ${currentResume.experience.map(exp => `
                  <div class="mb-3 space-y-0.5">
                    <div class="font-bold text-xs text-gray-900">${escapeHTML(exp.jobTitle)} (${escapeHTML(exp.company)})</div>
                    <div class="text-[9px] font-mono text-gray-500">${escapeHTML(exp.startDate)} â€“ ${escapeHTML(exp.endDate)}</div>
                    <div class="text-[10px] text-gray-600 whitespace-pre-line leading-relaxed mt-1">${escapeHTML(exp.description)}</div>
                  </div>
                `).join('')}
              </div>` : ''}
            </div>

            <div class="col-span-5 space-y-4 border-l border-gray-200 pl-4">
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Competencies</h2>
                <div class="text-[10px] text-gray-700 space-y-1">
                  <div><strong>Languages:</strong> ${escapeHTML(skills.languages)}</div>
                  <div><strong>Frameworks:</strong> ${escapeHTML(skills.frameworks)}</div>
                  <div><strong>Tools:</strong> ${escapeHTML(skills.tools)}</div>
                </div>
              </div>

              ${currentResume.projects && currentResume.projects.length ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Key Projects</h2>
                ${currentResume.projects.map(proj => `
                  <div class="mb-2">
                    <div class="font-bold text-xs">${escapeHTML(proj.title)}</div>
                    <div class="text-[9px] text-gray-600 whitespace-pre-line leading-relaxed">${escapeHTML(proj.description)}</div>
                  </div>
                `).join('')}
              </div>` : ''}

              ${currentResume.education && currentResume.education.length ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Education</h2>
                ${currentResume.education.map(edu => `
                  <div class="text-[10px] mb-1">
                    <div class="font-bold">${escapeHTML(edu.degree)}</div>
                    <div class="text-gray-600">${escapeHTML(edu.institution)} (${escapeHTML(edu.gradYear)})</div>
                  </div>
                `).join('')}
              </div>` : ''}
            </div>
          </div>
        </div>`;
    } else {
      // DESIGN 4: Ivy League Academic Serif Double-Frame Design
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl rounded-lg font-serif text-left min-h-[920px] p-6 space-y-4 border-4 border-double" style="border-color: ${color}">
          <div class="text-center border-b pb-3" style="border-color: ${color}">
            <h1 class="text-2xl font-bold uppercase tracking-wide text-gray-900">${escapeHTML(info.name)}</h1>
            <div class="text-xs font-semibold italic text-gray-700 mt-0.5">${escapeHTML(info.title)}</div>
            <div class="flex justify-center gap-3 text-[10px] text-gray-600 font-mono mt-2">
              <span>${escapeHTML(info.email)}</span> â€¢ 
              <span>${escapeHTML(info.phone)}</span> â€¢ 
              <span>${escapeHTML(info.location)}</span>
            </div>
          </div>

          ${info.summary ? `
          <div>
            <h2 class="text-xs font-bold uppercase tracking-widest text-center mb-1" style="color: ${color}">â€” Academic & Professional Summary â€”</h2>
            <p class="text-[10px] text-gray-700 leading-relaxed italic text-center px-4">${escapeHTML(info.summary)}</p>
          </div>` : ''}

          ${currentResume.experience && currentResume.experience.length ? `
          <div>
            <h2 class="text-xs font-bold uppercase tracking-widest mb-2 border-b pb-0.5" style="color: ${color}">Professional Appointments</h2>
            ${currentResume.experience.map(exp => `
              <div class="mb-3 text-[10px]">
                <div class="flex justify-between font-bold text-xs">
                  <span>${escapeHTML(exp.jobTitle)}, ${escapeHTML(exp.company)}</span>
                  <span class="font-mono font-normal">${escapeHTML(exp.startDate)} â€“ ${escapeHTML(exp.endDate)}</span>
                </div>
                <div class="text-[10px] text-gray-700 whitespace-pre-line leading-relaxed mt-1">${escapeHTML(exp.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <div class="text-[10px]">
            <h2 class="text-xs font-bold uppercase tracking-widest mb-2 border-b pb-0.5" style="color: ${color}">Technical Qualifications</h2>
            <div class="grid grid-cols-2 gap-2 text-gray-700">
              <div><strong>Core Languages:</strong> ${escapeHTML(skills.languages)}</div>
              <div><strong>Frameworks:</strong> ${escapeHTML(skills.frameworks)}</div>
            </div>
          </div>
        </div>`;
    }

    previewContainer.innerHTML = previewHTML;
  };

  // Item list builders
  function renderExperienceFormList() {
    const container = document.getElementById('res-exp-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.experience || []).map((exp, idx) => `
      <div class="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3 relative text-left">
        <button type="button" onclick="removeExperienceItem(${idx})" class="absolute top-3 right-3 text-rose-500 font-mono text-[11px] hover:underline font-bold">Remove</button>
        <div class="font-mono text-xs font-bold text-neutral-400">Job Entry #${idx + 1}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value="${escapeHTML(exp.jobTitle)}" oninput="updateExperienceItem(${idx}, 'jobTitle', this.value)" placeholder="Job Title" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
          <input type="text" value="${escapeHTML(exp.company)}" oninput="updateExperienceItem(${idx}, 'company', this.value)" placeholder="Company Name" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
          <input type="text" value="${escapeHTML(exp.startDate)}" oninput="updateExperienceItem(${idx}, 'startDate', this.value)" placeholder="Start Date" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">
          <input type="text" value="${escapeHTML(exp.endDate)}" oninput="updateExperienceItem(${idx}, 'endDate', this.value)" placeholder="End Date" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">
        </div>
        <textarea rows="3" oninput="updateExperienceItem(${idx}, 'description', this.value)" placeholder="Bullet point achievements..." class="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">${escapeHTML(exp.description)}</textarea>
      </div>
    `).join('');
  }

  window.addExperienceItem = function() {
    currentResume.experience = currentResume.experience || [];
    currentResume.experience.push({
      id: 'exp_' + Date.now(),
      jobTitle: 'Software Engineer',
      company: 'Tech Company',
      startDate: 'Jan 2026',
      endDate: 'Present',
      description: 'â€¢ Developed high performance features.'
    });
    renderExperienceFormList();
    renderLiveResumePreview();
  };

  window.updateExperienceItem = function(idx, field, val) {
    if (currentResume.experience && currentResume.experience[idx]) {
      currentResume.experience[idx][field] = val;
      renderLiveResumePreview();
    }
  };

  window.removeExperienceItem = function(idx) {
    if (currentResume.experience) {
      currentResume.experience.splice(idx, 1);
      renderExperienceFormList();
      renderLiveResumePreview();
    }
  };

  // Projects
  function renderProjectsFormList() {
    const container = document.getElementById('res-proj-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.projects || []).map((proj, idx) => `
      <div class="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3 relative text-left">
        <button type="button" onclick="removeProjectItem(${idx})" class="absolute top-3 right-3 text-rose-500 font-mono text-[11px] hover:underline font-bold">Remove</button>
        <div class="font-mono text-xs font-bold text-neutral-400">Project #${idx + 1}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value="${escapeHTML(proj.title)}" oninput="updateProjectItem(${idx}, 'title', this.value)" placeholder="Project Title" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
          <input type="text" value="${escapeHTML(proj.techStack)}" oninput="updateProjectItem(${idx}, 'techStack', this.value)" placeholder="Tech Stack" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">
        </div>
        <textarea rows="2" oninput="updateProjectItem(${idx}, 'description', this.value)" placeholder="Project description & key metrics..." class="w-full p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">${escapeHTML(proj.description)}</textarea>
      </div>
    `).join('');
  }

  window.addProjectItem = function() {
    currentResume.projects = currentResume.projects || [];
    currentResume.projects.push({
      id: 'proj_' + Date.now(),
      title: 'Full Stack App',
      techStack: 'React, PostgreSQL',
      link: 'github.com/project',
      description: 'â€¢ Built scalable features with 99.9% uptime.'
    });
    renderProjectsFormList();
    renderLiveResumePreview();
  };

  window.updateProjectItem = function(idx, field, val) {
    if (currentResume.projects && currentResume.projects[idx]) {
      currentResume.projects[idx][field] = val;
      renderLiveResumePreview();
    }
  };

  window.removeProjectItem = function(idx) {
    if (currentResume.projects) {
      currentResume.projects.splice(idx, 1);
      renderProjectsFormList();
      renderLiveResumePreview();
    }
  };

  // Education
  function renderEducationFormList() {
    const container = document.getElementById('res-edu-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.education || []).map((edu, idx) => `
      <div class="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3 relative text-left">
        <button type="button" onclick="removeEducationItem(${idx})" class="absolute top-3 right-3 text-rose-500 font-mono text-[11px] hover:underline font-bold">Remove</button>
        <div class="font-mono text-xs font-bold text-neutral-400">Education #${idx + 1}</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" value="${escapeHTML(edu.degree)}" oninput="updateEducationItem(${idx}, 'degree', this.value)" placeholder="Degree Name" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
          <input type="text" value="${escapeHTML(edu.institution)}" oninput="updateEducationItem(${idx}, 'institution', this.value)" placeholder="University / College" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
          <input type="text" value="${escapeHTML(edu.gradYear)}" oninput="updateEducationItem(${idx}, 'gradYear', this.value)" placeholder="Graduation Year" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">
          <input type="text" value="${escapeHTML(edu.cgpa)}" oninput="updateEducationItem(${idx}, 'cgpa', this.value)" placeholder="CGPA" class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">
        </div>
      </div>
    `).join('');
  }

  window.addEducationItem = function() {
    currentResume.education = currentResume.education || [];
    currentResume.education.push({
      id: 'edu_' + Date.now(),
      degree: 'B.Tech in Computer Science',
      institution: 'Engineering University',
      gradYear: '2026',
      cgpa: '8.5 / 10'
    });
    renderEducationFormList();
    renderLiveResumePreview();
  };

  window.updateEducationItem = function(idx, field, val) {
    if (currentResume.education && currentResume.education[idx]) {
      currentResume.education[idx][field] = val;
      renderLiveResumePreview();
    }
  };

  window.removeEducationItem = function(idx) {
    if (currentResume.education) {
      currentResume.education.splice(idx, 1);
      renderEducationFormList();
      renderLiveResumePreview();
    }
  };

  // Template Picker Grid
  function renderTemplateSelector() {
    const container = document.getElementById('res-template-picker-container');
    if (!container) return;

    const templates = getResumeTemplates();
    container.innerHTML = templates.map(t => `
      <div onclick="selectResumeTemplate('${t.id}')" class="cursor-pointer p-3.5 rounded-xl border ${currentResume.templateId === t.id ? 'border-blue-600 bg-blue-500/10 ring-2 ring-blue-500/50' : 'border-neutral-200 dark:border-neutral-800 bg-surface-secondary'} hover:border-blue-500 transition-all text-left space-y-2">
        <div class="flex items-center justify-between font-bold text-xs">
          <span class="text-neutral-900 dark:text-white font-sans">${escapeHTML(t.title)}</span>
          <span class="text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">${escapeHTML(t.layoutType)}</span>
        </div>
        <p class="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">${escapeHTML(t.description)}</p>
      </div>
    `).join('');
  }

  window.selectResumeTemplate = function(templateId) {
    if (!currentResume) return;
    currentResume.templateId = templateId;
    renderTemplateSelector();
    renderLiveResumePreview();
  };

  // Save Draft
  window.saveCurrentResumeDraft = function() {
    updateResumeDataFromForm();
    const saved = saveUserResume(currentResume);
    currentResume = saved;
    renderDraftsHistoryList();
    if (window.customAlert) {
      window.customAlert('Draft Saved', 'Resume draft saved successfully!', 'success');
    }
  };

  // Drafts Modal
  window.openDraftsHistoryModal = function() {
    const modal = document.getElementById('res-drafts-modal');
    if (!modal) return;
    renderDraftsHistoryList();
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeDraftsHistoryModal = function() {
    const modal = document.getElementById('res-drafts-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  function renderDraftsHistoryList() {
    const container = document.getElementById('res-drafts-list-container');
    if (!container) return;

    const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
    const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';
    const drafts = getUserResumes(userEmail);

    if (!drafts.length) {
      container.innerHTML = `<p class="text-xs text-neutral-500 py-6 text-center font-mono">No saved resume drafts found.</p>`;
      return;
    }

    container.innerHTML = drafts.map(d => `
      <div class="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex items-center justify-between text-left">
        <div>
          <h4 class="font-bold text-xs text-neutral-900 dark:text-white">${escapeHTML(d.title)}</h4>
          <span class="text-[10px] font-mono text-neutral-500">Updated: ${new Date(d.lastUpdated).toLocaleDateString()}</span>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="loadUserResumeDraft('${d.id}')" class="px-3 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700">Load</button>
          <button onclick="deleteUserResumeDraft('${d.id}')" class="px-2.5 py-1 text-xs font-semibold rounded border border-rose-500/20 text-rose-600 hover:bg-rose-500/10">Delete</button>
        </div>
      </div>
    `).join('');
  }

  window.loadUserResumeDraft = function(draftId) {
    const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
    const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';
    const drafts = getUserResumes(userEmail);
    const target = drafts.find(d => d.id === draftId);
    if (target) {
      currentResume = target;
      populateFormInputs();
      renderTemplateSelector();
      renderColorPaletteBar();
      renderLiveResumePreview();
      closeDraftsHistoryModal();
    }
  };

  window.deleteUserResumeDraft = function(draftId) {
    if (window.customConfirm) {
      window.customConfirm("Delete Resume Draft", "Are you sure you want to delete this saved draft?").then(approved => {
        if (approved) {
          deleteUserResume(draftId);
          renderDraftsHistoryList();
          if (window.customAlert) window.customAlert('Draft Deleted', 'Resume draft deleted.', 'info');
        }
      });
    } else {
      deleteUserResume(draftId);
      renderDraftsHistoryList();
    }
  };

  // ATS Checker Modal
  window.openATSCheckerModal = function() {
    const modal = document.getElementById('res-ats-modal');
    if (!modal) return;
    
    updateResumeDataFromForm();
    const result = analyzeATSCompatibility(currentResume, document.getElementById('res-jd-input')?.value || '');
    renderATSAnalysisReport(result);

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeATSCheckerModal = function() {
    const modal = document.getElementById('res-ats-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.runATSJobAnalysis = function() {
    updateResumeDataFromForm();
    const jdText = document.getElementById('res-jd-input')?.value || '';
    const result = analyzeATSCompatibility(currentResume, jdText);
    renderATSAnalysisReport(result);
  };

  function renderATSAnalysisReport(result) {
    const scoreEl = document.getElementById('ats-report-score');
    const barEl = document.getElementById('ats-report-bar');
    const matchesEl = document.getElementById('ats-report-matches');
    const missingEl = document.getElementById('ats-report-missing');
    const suggestionsEl = document.getElementById('ats-report-suggestions');

    if (scoreEl) scoreEl.textContent = `${result.score}%`;
    if (barEl) barEl.style.width = `${result.score}%`;

    if (matchesEl) {
      matchesEl.innerHTML = result.matchDetails.keywordMatches.map(k => `
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          âœ“ ${escapeHTML(k)}
        </span>
      `).join('');
    }

    if (missingEl) {
      missingEl.innerHTML = result.matchDetails.missingKeywords.map(k => `
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          + ${escapeHTML(k)}
        </span>
      `).join('');
    }

    if (suggestionsEl) {
      suggestionsEl.innerHTML = result.matchDetails.suggestions.map(s => `
        <li class="text-xs text-neutral-700 dark:text-neutral-300">â€¢ ${escapeHTML(s)}</li>
      `).join('');
    }
  }

  // Export PDF
  window.exportResumePDF = function() {
    window.print();
  };

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
})();



