/**
 * TechPrep AI - User Resume Builder & Live Interactive Canvas Controller
 * Inspired by Reactive Resume, FlowCV, Resume.io & Canva
 */

(function() {
  let currentResume = null;
  let activeTemplates = [];
  let currentZoom = 0.85;
  let autoSaveTimeout = null;

  // Initialize Resume Workspace
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

    // Ensure backwards compatibility with older stored resumes
    ensureResumeDataIntegrity();

    populateFormInputs();
    renderTemplateOptions();
    renderColorPaletteBar();
    renderLiveResumePreview();
    updateTopATSBadge();
    initCanvasZoomResponsive();

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#res-sample-menu-btn') && !e.target.closest('#res-sample-dropdown')) {
        document.getElementById('res-sample-dropdown')?.classList.add('hidden');
      }
      if (!e.target.closest('#res-export-dropdown') && !e.target.closest('button[onclick*="toggleExportDropdown"]')) {
        document.getElementById('res-export-dropdown')?.classList.add('hidden');
      }
    });
  };

  function ensureResumeDataIntegrity() {
    if (!currentResume) return;
    if (!currentResume.certifications) currentResume.certifications = [];
    if (!currentResume.achievements) currentResume.achievements = [];
    if (!currentResume.fontFamily) currentResume.fontFamily = 'Inter, sans-serif';
    if (!currentResume.fontSize) currentResume.fontSize = 'medium';
    if (!currentResume.lineSpacing) currentResume.lineSpacing = 'normal';
    if (!currentResume.templateId) currentResume.templateId = 'tmpl_silicon_valley';
    if (!currentResume.accentColor) currentResume.accentColor = '#0f172a';
  }

  // Populate Form Fields from Current Resume Data
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

    const fontSelect = document.getElementById('res-font-select');
    if (fontSelect && currentResume.fontFamily) fontSelect.value = currentResume.fontFamily;

    const spacingSelect = document.getElementById('res-spacing-select');
    if (spacingSelect && currentResume.lineSpacing) spacingSelect.value = currentResume.lineSpacing;

    const tmplSelect = document.getElementById('res-template-select');
    if (tmplSelect && currentResume.templateId) tmplSelect.value = currentResume.templateId;

    renderExperienceFormList();
    renderProjectsFormList();
    renderEducationFormList();
    renderCertificationsFormList();
    renderAchievementsFormList();
  }

  function setInputValue(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  }

  // Sync Form Input back into Resume Data with Debounced Auto-Save
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
    updateTopATSBadge();
    triggerDebouncedAutoSave();
  };

  window.handleResumeTitleChange = function(val) {
    if (!currentResume) return;
    currentResume.title = val || 'Untitled Resume';
    triggerDebouncedAutoSave();
  };

  function triggerDebouncedAutoSave() {
    const indicator = document.getElementById('res-autosave-indicator');
    if (indicator) {
      indicator.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span><span>Saving...</span>`;
    }

    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
      saveUserResume(currentResume);
      if (indicator) {
        indicator.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Saved</span>`;
      }
    }, 600);
  }

  // --- TEMPLATE & STYLING CONTROLS ---
  function renderTemplateOptions() {
    const select = document.getElementById('res-template-select');
    if (!select) return;

    const templates = getResumeTemplates();
    select.innerHTML = templates.map(t => `
      <option value="${t.id}" ${currentResume.templateId === t.id ? 'selected' : ''}>
        ${escapeHTML(t.title)} (${escapeHTML(t.badge || t.layoutType)})
      </option>
    `).join('');
  }

  window.selectResumeTemplate = function(templateId) {
    if (!currentResume) return;
    currentResume.templateId = templateId;

    const templates = getResumeTemplates();
    const target = templates.find(t => t.id === templateId);
    if (target && target.defaultColor && !currentResume.customColorChosen) {
      currentResume.accentColor = target.defaultColor;
      renderColorPaletteBar();
    }

    renderLiveResumePreview();
    triggerDebouncedAutoSave();
  };

  function renderColorPaletteBar() {
    const container = document.getElementById('res-color-palette-bar');
    if (!container) return;

    const currentColor = currentResume.accentColor || '#0f172a';
    container.innerHTML = COLOR_PALETTES.map(p => `
      <button type="button" onclick="selectResumeAccentColor('${p.hex}')" title="${p.name}"
        class="w-5 h-5 rounded-full border transition-all ${currentColor.toLowerCase() === p.hex.toLowerCase() ? 'scale-125 border-white ring-2 ring-blue-500 shadow-md' : 'border-neutral-700/60 hover:scale-110 opacity-80 hover:opacity-100'}"
        style="background-color: ${p.hex}">
      </button>
    `).join('');

    const picker = document.getElementById('res-custom-color-picker');
    if (picker) picker.value = currentColor.startsWith('#') && currentColor.length === 7 ? currentColor : '#2563eb';
  }

  window.selectResumeAccentColor = function(hexColor) {
    if (!currentResume) return;
    currentResume.accentColor = hexColor;
    currentResume.customColorChosen = true;
    renderColorPaletteBar();
    renderLiveResumePreview();
    triggerDebouncedAutoSave();
  };

  window.selectResumeFont = function(fontVal) {
    if (!currentResume) return;
    currentResume.fontFamily = fontVal;
    renderLiveResumePreview();
    triggerDebouncedAutoSave();
  };

  window.selectResumeSpacing = function(spacingVal) {
    if (!currentResume) return;
    currentResume.lineSpacing = spacingVal;
    renderLiveResumePreview();
    triggerDebouncedAutoSave();
  };

  // --- ZOOM & CANVAS CONTROLLER ---
  window.zoomPreview = function(delta) {
    currentZoom = Math.min(Math.max(currentZoom + delta, 0.4), 1.5);
    applyZoomScale();
  };

  window.resetZoomPreview = function() {
    const container = document.getElementById('res-canvas-scroll-container');
    if (container) {
      const containerWidth = container.clientWidth - 32;
      const containerHeight = container.clientHeight - 32;
      const scaleW = containerWidth / 800;
      const scaleH = containerHeight / 1130;
      const targetScale = Math.min(scaleW, scaleH);
      currentZoom = Math.min(Math.max(targetScale, 0.45), 1.0);
    } else {
      currentZoom = 0.75;
    }
    applyZoomScale();
  };

  function applyZoomScale() {
    const scaler = document.getElementById('resume-canvas-scaler');
    const label = document.getElementById('res-zoom-label');
    const preview = document.getElementById('resume-live-preview');
    if (scaler) {
      scaler.style.transform = `scale(${currentZoom})`;
      scaler.style.transformOrigin = 'top center';
      const actualHeight = (preview && preview.offsetHeight > 500) ? preview.offsetHeight : 1123;
      scaler.style.height = `${Math.round(actualHeight * currentZoom) + 24}px`;
    }
    if (label) {
      label.textContent = `${Math.round(currentZoom * 100)}%`;
    }
  }

  function initCanvasZoomResponsive() {
    window.resetZoomPreview();
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024) {
        window.resetZoomPreview();
      }
    });
  }

  // --- MULTI-TEMPLATE LIVE PREVIEW RENDERER ---
  window.renderLiveResumePreview = function() {
    const previewContainer = document.getElementById('resume-live-preview');
    if (!previewContainer || !currentResume) return;

    const templates = getResumeTemplates();
    const tmpl = templates.find(t => t.id === currentResume.templateId) || templates[0];
    const color = currentResume.accentColor || tmpl.defaultColor || '#0f172a';
    const layout = tmpl.layoutType || 'silicon_valley';
    const font = currentResume.fontFamily || tmpl.fontFamily || 'Inter, sans-serif';
    const spacing = currentResume.lineSpacing || 'normal';

    const info = currentResume.personalInfo || {};
    const skills = currentResume.skills || {};
    const experience = currentResume.experience || [];
    const projects = currentResume.projects || [];
    const education = currentResume.education || [];
    const certifications = currentResume.certifications || [];
    const achievements = currentResume.achievements || [];

    // Density padding & spacing multiplier classes
    const pDensity = spacing === 'compact' ? 'p-6 space-y-3' : (spacing === 'spacious' ? 'p-10 space-y-6' : 'p-8 space-y-4');
    const sectionSpacing = spacing === 'compact' ? 'space-y-2' : (spacing === 'spacious' ? 'space-y-4' : 'space-y-3');
    const itemMargin = spacing === 'compact' ? 'mb-2' : (spacing === 'spacious' ? 'mb-4' : 'mb-3');
    const bulletLeading = spacing === 'compact' ? 'leading-tight' : (spacing === 'spacious' ? 'leading-relaxed' : 'leading-normal');

    let previewHTML = '';

    if (layout === 'silicon_valley') {
      // TEMPLATE 1: Silicon Valley Gold-Standard ATS Single Column
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl font-sans text-left ${pDensity}" style="font-family: ${font}; min-height: 1080px;">
          <!-- Header -->
          <div class="border-b-2 pb-3 text-center" style="border-color: ${color}">
            <h1 class="text-2xl font-black uppercase tracking-tight text-gray-900 leading-tight">${escapeHTML(info.name || 'Your Full Name')}</h1>
            <div class="text-xs font-bold uppercase tracking-wider mt-0.5" style="color: ${color}">${escapeHTML(info.title || 'Software Engineer')}</div>
            <div class="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10px] text-gray-600 font-mono mt-2">
              ${info.email ? `<span>${escapeHTML(info.email)}</span>` : ''}
              ${info.phone ? `<span>${info.email ? '• ' : ''}${escapeHTML(info.phone)}</span>` : ''}
              ${info.location ? `<span>• ${escapeHTML(info.location)}</span>` : ''}
              ${info.linkedin ? `<span>• <a href="${formatUrl(info.linkedin)}" class="underline" style="color: ${color}">${escapeHTML(info.linkedin)}</a></span>` : ''}
              ${info.github ? `<span>• <a href="${formatUrl(info.github)}" class="underline" style="color: ${color}">${escapeHTML(info.github)}</a></span>` : ''}
              ${info.portfolio ? `<span>• <a href="${formatUrl(info.portfolio)}" class="underline" style="color: ${color}">${escapeHTML(info.portfolio)}</a></span>` : ''}
            </div>
          </div>

          <!-- Summary -->
          ${info.summary ? `
          <div>
            <h2 class="text-xs font-bold uppercase tracking-wider font-mono mb-1 pb-0.5 border-b border-gray-300" style="color: ${color}">Professional Profile</h2>
            <p class="text-[11px] text-gray-700 ${bulletLeading}">${escapeHTML(info.summary)}</p>
          </div>` : ''}

          <!-- Experience -->
          ${experience.length ? `
          <div class="${sectionSpacing}">
            <h2 class="text-xs font-bold uppercase tracking-wider font-mono pb-0.5 border-b border-gray-300" style="color: ${color}">Work Experience</h2>
            ${experience.map(exp => `
              <div class="${itemMargin}">
                <div class="flex justify-between items-baseline">
                  <div class="font-bold text-xs text-gray-900">${escapeHTML(exp.jobTitle)} <span class="font-semibold text-gray-700">— ${escapeHTML(exp.company)}</span></div>
                  <div class="text-[10px] text-gray-600 font-mono">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div>
                </div>
                ${exp.location ? `<div class="text-[10px] text-gray-500 italic mb-1">${escapeHTML(exp.location)}</div>` : ''}
                <div class="text-[11px] text-gray-700 whitespace-pre-line ${bulletLeading} pl-3 mt-1 border-l-2" style="border-color: ${color}">${escapeHTML(exp.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Projects -->
          ${projects.length ? `
          <div class="${sectionSpacing}">
            <h2 class="text-xs font-bold uppercase tracking-wider font-mono pb-0.5 border-b border-gray-300" style="color: ${color}">Technical Projects</h2>
            ${projects.map(p => `
              <div class="${itemMargin}">
                <div class="flex justify-between items-baseline">
                  <div class="font-bold text-xs text-gray-900">${escapeHTML(p.title)} ${p.link ? `<span class="font-normal text-[10px] text-blue-600 underline ml-1">[${escapeHTML(p.link)}]</span>` : ''}</div>
                  <div class="text-[10px] text-gray-600 font-mono">${escapeHTML(p.techStack)}</div>
                </div>
                <div class="text-[11px] text-gray-700 whitespace-pre-line ${bulletLeading} pl-3 mt-1 border-l-2" style="border-color: ${color}">${escapeHTML(p.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Skills -->
          <div>
            <h2 class="text-xs font-bold uppercase tracking-wider font-mono pb-0.5 border-b border-gray-300 mb-2" style="color: ${color}">Technical Skills</h2>
            <div class="text-[11px] text-gray-800 space-y-1">
              ${skills.languages ? `<div><strong class="text-gray-900">Languages:</strong> ${escapeHTML(skills.languages)}</div>` : ''}
              ${skills.frameworks ? `<div><strong class="text-gray-900">Frameworks & Libraries:</strong> ${escapeHTML(skills.frameworks)}</div>` : ''}
              ${skills.tools ? `<div><strong class="text-gray-900">Cloud & Tools:</strong> ${escapeHTML(skills.tools)}</div>` : ''}
              ${skills.coreCS ? `<div><strong class="text-gray-900">Core CS:</strong> ${escapeHTML(skills.coreCS)}</div>` : ''}
            </div>
          </div>

          <!-- Education -->
          ${education.length ? `
          <div>
            <h2 class="text-xs font-bold uppercase tracking-wider font-mono pb-0.5 border-b border-gray-300 mb-2" style="color: ${color}">Education</h2>
            ${education.map(edu => `
              <div class="flex justify-between items-baseline text-[11px] mb-1.5">
                <div>
                  <strong class="text-gray-900">${escapeHTML(edu.degree)}</strong> — <span>${escapeHTML(edu.institution)}</span>
                  ${edu.coursework ? `<div class="text-[10px] text-gray-600 italic">Coursework: ${escapeHTML(edu.coursework)}</div>` : ''}
                </div>
                <div class="text-right text-[10px] font-mono text-gray-600 shrink-0">
                  <div>${escapeHTML(edu.gradYear)}</div>
                  ${edu.cgpa ? `<div class="font-bold text-gray-800">CGPA: ${escapeHTML(edu.cgpa)}</div>` : ''}
                </div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Certifications & Achievements (if present) -->
          ${(certifications.length || achievements.length) ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            ${certifications.length ? `
            <div>
              <h2 class="text-xs font-bold uppercase tracking-wider font-mono pb-0.5 border-b border-gray-300 mb-1.5" style="color: ${color}">Certifications</h2>
              <ul class="text-[10px] text-gray-700 space-y-1">
                ${certifications.map(c => `<li>• <strong>${escapeHTML(c.name)}</strong> (${escapeHTML(c.issuer)}, ${escapeHTML(c.year)})</li>`).join('')}
              </ul>
            </div>` : ''}

            ${achievements.length ? `
            <div>
              <h2 class="text-xs font-bold uppercase tracking-wider font-mono pb-0.5 border-b border-gray-300 mb-1.5" style="color: ${color}">Honors & Awards</h2>
              <ul class="text-[10px] text-gray-700 space-y-1">
                ${achievements.map(a => `<li>• <strong>${escapeHTML(a.title)}</strong> (${escapeHTML(a.year)}): ${escapeHTML(a.description)}</li>`).join('')}
              </ul>
            </div>` : ''}
          </div>` : ''}
        </div>`;

    } else if (layout === 'modern_sidebar') {
      // TEMPLATE 2: Modern Two-Column Accent Sidebar
      const initials = (info.name || 'AR').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl font-sans text-left grid grid-cols-12 overflow-hidden" style="font-family: ${font}; min-height: 1080px;">
          <!-- Left Color Accent Sidebar (38% width) -->
          <div class="col-span-4 p-6 text-white space-y-5 flex flex-col justify-between" style="background-color: ${color}">
            <div class="space-y-4">
              <!-- Avatar Initials & Header -->
              <div class="space-y-2">
                <div class="w-14 h-14 rounded-xl bg-white/20 text-white font-mono font-extrabold text-lg flex items-center justify-center ring-2 ring-white/30 shadow-inner">
                  ${initials}
                </div>
                <h1 class="text-xl font-extrabold uppercase tracking-tight text-white leading-tight">${escapeHTML(info.name || 'Your Name')}</h1>
                <div class="text-[11px] font-semibold text-white/90 uppercase font-mono">${escapeHTML(info.title || 'Developer')}</div>
              </div>

              <!-- Contact List -->
              <div class="space-y-1.5 text-[10px] text-white/90 font-mono border-t border-white/20 pt-3">
                <h3 class="font-bold uppercase tracking-wider text-white text-[9px]">Contact Details</h3>
                ${info.email ? `<div class="break-all"><span class="text-white/60">Email:</span> ${escapeHTML(info.email)}</div>` : ''}
                ${info.phone ? `<div><span class="text-white/60">Phone:</span> ${escapeHTML(info.phone)}</div>` : ''}
                ${info.location ? `<div><span class="text-white/60">Location:</span> ${escapeHTML(info.location)}</div>` : ''}
                ${info.linkedin ? `<div class="break-all"><a href="${formatUrl(info.linkedin)}" class="underline text-white/90 hover:text-white">${escapeHTML(info.linkedin)}</a></div>` : ''}
                ${info.github ? `<div class="break-all"><a href="${formatUrl(info.github)}" class="underline text-white/90 hover:text-white">${escapeHTML(info.github)}</a></div>` : ''}
              </div>

              <!-- Skill Matrix Badges -->
              <div class="space-y-2 border-t border-white/20 pt-3 text-[10px]">
                <h3 class="font-bold uppercase tracking-wider text-white font-mono text-[9px]">Skills Matrix</h3>
                ${skills.languages ? `<div><strong class="block text-white/70 text-[9px] uppercase">Languages:</strong>${escapeHTML(skills.languages)}</div>` : ''}
                ${skills.frameworks ? `<div><strong class="block text-white/70 text-[9px] uppercase">Frameworks:</strong>${escapeHTML(skills.frameworks)}</div>` : ''}
                ${skills.tools ? `<div><strong class="block text-white/70 text-[9px] uppercase">Tools & Cloud:</strong>${escapeHTML(skills.tools)}</div>` : ''}
                ${skills.coreCS ? `<div><strong class="block text-white/70 text-[9px] uppercase">Core CS:</strong>${escapeHTML(skills.coreCS)}</div>` : ''}
              </div>

              <!-- Education -->
              ${education.length ? `
              <div class="space-y-2 border-t border-white/20 pt-3 text-[10px]">
                <h3 class="font-bold uppercase tracking-wider text-white font-mono text-[9px]">Education</h3>
                ${education.map(edu => `
                  <div class="mb-1">
                    <div class="font-bold text-white">${escapeHTML(edu.degree)}</div>
                    <div class="text-white/80 text-[9px]">${escapeHTML(edu.institution)} (${escapeHTML(edu.gradYear)})</div>
                    ${edu.cgpa ? `<div class="text-white/90 text-[9px] font-mono">CGPA: ${escapeHTML(edu.cgpa)}</div>` : ''}
                  </div>
                `).join('')}
              </div>` : ''}

              <!-- Certifications in sidebar -->
              ${certifications.length ? `
              <div class="space-y-1.5 border-t border-white/20 pt-3 text-[10px]">
                <h3 class="font-bold uppercase tracking-wider text-white font-mono text-[9px]">Certifications</h3>
                ${certifications.map(c => `
                  <div class="text-[9px] leading-tight">
                    <span class="font-bold text-white">• ${escapeHTML(c.name)}</span>
                    <span class="text-white/70 block">(${escapeHTML(c.issuer)})</span>
                  </div>
                `).join('')}
              </div>` : ''}
            </div>
          </div>

          <!-- Right Content Area (62% width) -->
          <div class="col-span-8 p-6 space-y-4 text-gray-800 text-xs">
            ${info.summary ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-1" style="color: ${color}">Professional Profile</h2>
              <p class="text-[11px] text-gray-600 leading-relaxed">${escapeHTML(info.summary)}</p>
            </div>` : ''}

            ${experience.length ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2 pb-1 border-b border-gray-200" style="color: ${color}">Work Experience</h2>
              ${experience.map(exp => `
                <div class="mb-3 space-y-0.5">
                  <div class="flex justify-between items-baseline font-bold text-xs">
                    <span class="text-gray-900">${escapeHTML(exp.jobTitle)}</span>
                    <span class="text-[9px] text-gray-500 font-mono">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
                  </div>
                  <div class="text-[10px] text-gray-600 font-semibold italic mb-1">${escapeHTML(exp.company)}</div>
                  <div class="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l-2" style="border-color: ${color}">${escapeHTML(exp.description)}</div>
                </div>
              `).join('')}
            </div>` : ''}

            ${projects.length ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2 pb-1 border-b border-gray-200" style="color: ${color}">Key Projects</h2>
              ${projects.map(proj => `
                <div class="mb-2.5 space-y-0.5">
                  <div class="flex justify-between items-baseline font-bold text-xs">
                    <span class="text-gray-900">${escapeHTML(proj.title)}</span>
                    <span class="text-[9px] text-gray-500 font-mono">${escapeHTML(proj.techStack)}</span>
                  </div>
                  <div class="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed pl-2 border-l-2" style="border-color: ${color}">${escapeHTML(proj.description)}</div>
                </div>
              `).join('')}
            </div>` : ''}

            ${achievements.length ? `
            <div>
              <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-1.5 pb-1 border-b border-gray-200" style="color: ${color}">Achievements & Awards</h2>
              <ul class="text-[10px] text-gray-700 space-y-1">
                ${achievements.map(a => `<li>• <strong>${escapeHTML(a.title)}</strong> (${escapeHTML(a.year)}): ${escapeHTML(a.description)}</li>`).join('')}
              </ul>
            </div>` : ''}
          </div>
        </div>`;

    } else if (layout === 'executive_grid') {
      // TEMPLATE 3: Executive Lead & Architect Split Grid
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl font-sans text-left ${pDensity}" style="font-family: ${font}; min-height: 1080px;">
          <!-- Top Executive Banner -->
          <div class="p-6 rounded-xl text-white space-y-2" style="background-color: ${color}">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h1 class="text-2xl font-extrabold uppercase tracking-tight text-white">${escapeHTML(info.name || 'Executive Name')}</h1>
                <div class="text-xs font-mono font-semibold uppercase tracking-wider text-white/90">${escapeHTML(info.title || 'Lead Architect')}</div>
              </div>
              <div class="text-right text-[10px] font-mono text-white/90 space-y-0.5">
                ${info.email ? `<div>${escapeHTML(info.email)}</div>` : ''}
                ${info.phone ? `<div>${escapeHTML(info.phone)}</div>` : ''}
                ${info.location ? `<div>${escapeHTML(info.location)}</div>` : ''}
              </div>
            </div>
            <div class="flex flex-wrap gap-3 pt-2 text-[10px] font-mono text-white/80 border-t border-white/20">
              ${info.linkedin ? `<span>LinkedIn: ${escapeHTML(info.linkedin)}</span>` : ''}
              ${info.github ? `<span>GitHub: ${escapeHTML(info.github)}</span>` : ''}
              ${info.portfolio ? `<span>Portfolio: ${escapeHTML(info.portfolio)}</span>` : ''}
            </div>
          </div>

          <!-- Profile Summary -->
          ${info.summary ? `
          <div class="p-4 rounded-xl border-l-4 bg-gray-50 text-[11px] text-gray-700 leading-relaxed" style="border-color: ${color}">
            ${escapeHTML(info.summary)}
          </div>` : ''}

          <!-- Grid Section: Experience (Left) & Competencies/Education (Right) -->
          <div class="grid grid-cols-12 gap-5 text-xs">
            <!-- Left Main Column (7 cols) -->
            <div class="col-span-7 space-y-4">
              ${experience.length ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Career Milestones</h2>
                ${experience.map(exp => `
                  <div class="mb-3 space-y-1">
                    <div class="font-bold text-xs text-gray-900">${escapeHTML(exp.jobTitle)} — <span style="color: ${color}">${escapeHTML(exp.company)}</span></div>
                    <div class="text-[9px] font-mono text-gray-500">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</div>
                    <div class="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed mt-1">${escapeHTML(exp.description)}</div>
                  </div>
                `).join('')}
              </div>` : ''}

              ${projects.length ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Architectural Initiatives</h2>
                ${projects.map(proj => `
                  <div class="mb-2.5 space-y-0.5">
                    <div class="font-bold text-xs text-gray-900">${escapeHTML(proj.title)} <span class="text-[9px] font-mono text-gray-500 font-normal">(${escapeHTML(proj.techStack)})</span></div>
                    <div class="text-[10px] text-gray-700 whitespace-pre-line leading-relaxed">${escapeHTML(proj.description)}</div>
                  </div>
                `).join('')}
              </div>` : ''}
            </div>

            <!-- Right Column (5 cols) -->
            <div class="col-span-5 space-y-4 border-l border-gray-200 pl-4">
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Core Competencies</h2>
                <div class="text-[10px] text-gray-700 space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                  ${skills.languages ? `<div><strong class="block text-gray-900">Languages:</strong> ${escapeHTML(skills.languages)}</div>` : ''}
                  ${skills.frameworks ? `<div><strong class="block text-gray-900">Frameworks:</strong> ${escapeHTML(skills.frameworks)}</div>` : ''}
                  ${skills.tools ? `<div><strong class="block text-gray-900">Cloud & Tools:</strong> ${escapeHTML(skills.tools)}</div>` : ''}
                  ${skills.coreCS ? `<div><strong class="block text-gray-900">System Design:</strong> ${escapeHTML(skills.coreCS)}</div>` : ''}
                </div>
              </div>

              ${education.length ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Education</h2>
                ${education.map(edu => `
                  <div class="text-[10px] mb-2">
                    <div class="font-bold text-gray-900">${escapeHTML(edu.degree)}</div>
                    <div class="text-gray-600">${escapeHTML(edu.institution)} (${escapeHTML(edu.gradYear)})</div>
                  </div>
                `).join('')}
              </div>` : ''}

              ${certifications.length ? `
              <div>
                <h2 class="text-xs font-bold font-mono uppercase tracking-wider mb-2" style="color: ${color}">Certifications</h2>
                <ul class="text-[10px] text-gray-700 space-y-1">
                  ${certifications.map(c => `<li>• <strong>${escapeHTML(c.name)}</strong></li>`).join('')}
                </ul>
              </div>` : ''}
            </div>
          </div>
        </div>`;

    } else if (layout === 'ivy_classic') {
      // TEMPLATE 4: Ivy League Academic Serif Classic
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl font-serif text-left ${pDensity} border-4 border-double" style="font-family: Georgia, serif; border-color: ${color}; min-height: 1080px;">
          <!-- Centered Classic Header -->
          <div class="text-center border-b pb-3" style="border-color: ${color}">
            <h1 class="text-2xl font-bold uppercase tracking-wide text-gray-900">${escapeHTML(info.name || 'Your Full Name')}</h1>
            <div class="text-xs font-semibold italic text-gray-700 mt-0.5">${escapeHTML(info.title || 'Technical Specialist')}</div>
            <div class="flex justify-center flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-600 font-mono mt-2">
              ${info.email ? `<span>${escapeHTML(info.email)}</span>` : ''}
              ${info.phone ? `<span>• ${escapeHTML(info.phone)}</span>` : ''}
              ${info.location ? `<span>• ${escapeHTML(info.location)}</span>` : ''}
              ${info.linkedin ? `<span>• ${escapeHTML(info.linkedin)}</span>` : ''}
            </div>
          </div>

          <!-- Academic / Professional Summary -->
          ${info.summary ? `
          <div class="text-center px-4">
            <h2 class="text-xs font-bold uppercase tracking-widest mb-1" style="color: ${color}">— Academic & Professional Summary —</h2>
            <p class="text-[11px] text-gray-700 leading-relaxed italic">${escapeHTML(info.summary)}</p>
          </div>` : ''}

          <!-- Experience -->
          ${experience.length ? `
          <div class="${sectionSpacing}">
            <h2 class="text-xs font-bold uppercase tracking-widest pb-0.5 border-b" style="color: ${color}">Professional Appointments</h2>
            ${experience.map(exp => `
              <div class="${itemMargin}">
                <div class="flex justify-between font-bold text-xs text-gray-900">
                  <span>${escapeHTML(exp.jobTitle)}, ${escapeHTML(exp.company)}</span>
                  <span class="font-mono font-normal text-[10px] text-gray-600">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
                </div>
                <div class="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed mt-1 font-sans pl-2">${escapeHTML(exp.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Projects -->
          ${projects.length ? `
          <div class="${sectionSpacing}">
            <h2 class="text-xs font-bold uppercase tracking-widest pb-0.5 border-b" style="color: ${color}">Research & Technical Projects</h2>
            ${projects.map(proj => `
              <div class="${itemMargin}">
                <div class="flex justify-between font-bold text-xs text-gray-900">
                  <span>${escapeHTML(proj.title)}</span>
                  <span class="font-mono font-normal text-[10px] text-gray-600">${escapeHTML(proj.techStack)}</span>
                </div>
                <div class="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed mt-1 font-sans pl-2">${escapeHTML(proj.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Skills -->
          <div>
            <h2 class="text-xs font-bold uppercase tracking-widest pb-0.5 border-b mb-1.5" style="color: ${color}">Technical Competencies</h2>
            <div class="text-[11px] text-gray-800 space-y-1">
              <div><strong>Core Languages & Frameworks:</strong> ${escapeHTML(skills.languages)} | ${escapeHTML(skills.frameworks)}</div>
              <div><strong>Tools & Infrastructure:</strong> ${escapeHTML(skills.tools)} | ${escapeHTML(skills.coreCS)}</div>
            </div>
          </div>

          <!-- Education -->
          ${education.length ? `
          <div>
            <h2 class="text-xs font-bold uppercase tracking-widest pb-0.5 border-b mb-1.5" style="color: ${color}">Education & Credentials</h2>
            ${education.map(edu => `
              <div class="flex justify-between text-[11px] mb-1">
                <div><strong>${escapeHTML(edu.degree)}</strong> — ${escapeHTML(edu.institution)}</div>
                <div class="font-mono text-[10px] text-gray-600">${escapeHTML(edu.gradYear)} ${edu.cgpa ? `(CGPA: ${escapeHTML(edu.cgpa)})` : ''}</div>
              </div>
            `).join('')}
          </div>` : ''}
        </div>`;

    } else if (layout === 'terminal_dev') {
      // TEMPLATE 5: Developer Terminal & Badges
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl font-mono text-left ${pDensity}" style="font-family: 'JetBrains Mono', monospace; min-height: 1080px;">
          <!-- Top Terminal Header Bar -->
          <div class="p-4 rounded-lg bg-gray-900 text-white space-y-2 border-l-4" style="border-color: ${color}">
            <div class="flex justify-between items-center text-xs">
              <span class="text-emerald-400 font-bold">● developer@terminal:~$ whoami</span>
              <span class="text-[10px] text-gray-400">STATUS: OPEN_TO_WORK</span>
            </div>
            <h1 class="text-xl font-bold text-white tracking-tight">${escapeHTML(info.name || 'Developer Name')}</h1>
            <div class="text-xs font-semibold" style="color: ${color}">${escapeHTML(info.title || 'Systems Engineer')}</div>
            <div class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-300 pt-1 border-t border-gray-800">
              ${info.email ? `<span>[email: ${escapeHTML(info.email)}]</span>` : ''}
              ${info.github ? `<span>[gh: ${escapeHTML(info.github)}]</span>` : ''}
              ${info.linkedin ? `<span>[in: ${escapeHTML(info.linkedin)}]</span>` : ''}
              ${info.location ? `<span>[loc: ${escapeHTML(info.location)}]</span>` : ''}
            </div>
          </div>

          <!-- Summary -->
          ${info.summary ? `
          <div class="p-3 bg-gray-50 rounded-lg border border-gray-200 text-[11px] text-gray-800 leading-relaxed font-sans">
            <span class="font-mono text-[10px] font-bold text-gray-500 block mb-0.5">// ABOUT ME</span>
            ${escapeHTML(info.summary)}
          </div>` : ''}

          <!-- Experience -->
          ${experience.length ? `
          <div class="${sectionSpacing}">
            <div class="text-xs font-bold text-gray-900 flex items-center space-x-2 border-b pb-1" style="border-color: ${color}">
              <span style="color: ${color}">#</span>
              <span class="uppercase tracking-wider">Experience & Contributions</span>
            </div>
            ${experience.map(exp => `
              <div class="${itemMargin}">
                <div class="flex justify-between items-baseline text-xs font-bold text-gray-900">
                  <span>${escapeHTML(exp.jobTitle)} @ <span style="color: ${color}">${escapeHTML(exp.company)}</span></span>
                  <span class="text-[10px] text-gray-500">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
                </div>
                <div class="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed font-sans mt-1 pl-3 border-l-2" style="border-color: ${color}">${escapeHTML(exp.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Projects -->
          ${projects.length ? `
          <div class="${sectionSpacing}">
            <div class="text-xs font-bold text-gray-900 flex items-center space-x-2 border-b pb-1" style="border-color: ${color}">
              <span style="color: ${color}">#</span>
              <span class="uppercase tracking-wider">Featured Repositories & Projects</span>
            </div>
            ${projects.map(proj => `
              <div class="${itemMargin}">
                <div class="flex justify-between items-baseline text-xs font-bold text-gray-900">
                  <span>repo: <span class="underline" style="color: ${color}">${escapeHTML(proj.title)}</span></span>
                  <span class="text-[10px] text-gray-500 font-normal">[${escapeHTML(proj.techStack)}]</span>
                </div>
                <div class="text-[11px] text-gray-700 whitespace-pre-line leading-relaxed font-sans mt-1 pl-3 border-l-2" style="border-color: ${color}">${escapeHTML(proj.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Skills Matrix -->
          <div>
            <div class="text-xs font-bold text-gray-900 flex items-center space-x-2 border-b pb-1 mb-2" style="border-color: ${color}">
              <span style="color: ${color}">#</span>
              <span class="uppercase tracking-wider">Tech Stack & Packages</span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-[10px]">
              <div class="p-2 bg-gray-50 rounded border border-gray-200">
                <strong class="block text-gray-900">LANGUAGES:</strong> ${escapeHTML(skills.languages)}
              </div>
              <div class="p-2 bg-gray-50 rounded border border-gray-200">
                <strong class="block text-gray-900">FRAMEWORKS:</strong> ${escapeHTML(skills.frameworks)}
              </div>
              <div class="p-2 bg-gray-50 rounded border border-gray-200">
                <strong class="block text-gray-900">INFRA & CLOUD:</strong> ${escapeHTML(skills.tools)}
              </div>
              <div class="p-2 bg-gray-50 rounded border border-gray-200">
                <strong class="block text-gray-900">CORE CS:</strong> ${escapeHTML(skills.coreCS)}
              </div>
            </div>
          </div>

          <!-- Education -->
          ${education.length ? `
          <div>
            <div class="text-xs font-bold text-gray-900 flex items-center space-x-2 border-b pb-1 mb-1.5" style="border-color: ${color}">
              <span style="color: ${color}">#</span>
              <span class="uppercase tracking-wider">Academic Background</span>
            </div>
            ${education.map(edu => `
              <div class="flex justify-between text-[10px] text-gray-800">
                <div><strong>${escapeHTML(edu.degree)}</strong> — ${escapeHTML(edu.institution)}</div>
                <div class="text-gray-500">${escapeHTML(edu.gradYear)} ${edu.cgpa ? `(CGPA: ${escapeHTML(edu.cgpa)})` : ''}</div>
              </div>
            `).join('')}
          </div>` : ''}
        </div>`;

    } else {
      // TEMPLATE 6: Compact High-Density (1-Page Optimized)
      previewHTML = `
        <div class="bg-white text-gray-900 shadow-2xl font-sans text-left p-6 space-y-2.5 text-xs" style="font-family: ${font}; min-height: 1080px;">
          <!-- Compact Header -->
          <div class="flex justify-between items-center border-b-2 pb-2" style="border-color: ${color}">
            <div>
              <h1 class="text-xl font-extrabold uppercase tracking-tight text-gray-900">${escapeHTML(info.name || 'Candidate Name')}</h1>
              <div class="text-xs font-bold uppercase font-mono" style="color: ${color}">${escapeHTML(info.title || 'SDE Candidate')}</div>
            </div>
            <div class="text-right text-[10px] font-mono text-gray-600 space-y-0.5">
              <div>${escapeHTML(info.email)} | ${escapeHTML(info.phone)}</div>
              <div>${escapeHTML(info.location)} | ${escapeHTML(info.linkedin || info.github)}</div>
            </div>
          </div>

          <!-- Summary -->
          ${info.summary ? `
          <p class="text-[10px] text-gray-700 leading-tight">${escapeHTML(info.summary)}</p>
          ` : ''}

          <!-- Skills Table Compact -->
          <div>
            <h2 class="text-[11px] font-bold uppercase font-mono tracking-wider pb-0.5 border-b" style="color: ${color}">Technical Skills</h2>
            <div class="text-[10px] text-gray-800 space-y-0.5 pt-1">
              <div><strong>Languages:</strong> ${escapeHTML(skills.languages)}</div>
              <div><strong>Frameworks & Libraries:</strong> ${escapeHTML(skills.frameworks)}</div>
              <div><strong>Tools & Databases:</strong> ${escapeHTML(skills.tools)}</div>
              <div><strong>Core Topics:</strong> ${escapeHTML(skills.coreCS)}</div>
            </div>
          </div>

          <!-- Experience -->
          ${experience.length ? `
          <div>
            <h2 class="text-[11px] font-bold uppercase font-mono tracking-wider pb-0.5 border-b" style="color: ${color}">Experience</h2>
            ${experience.map(exp => `
              <div class="mt-1.5 space-y-0.5">
                <div class="flex justify-between font-bold text-[11px] text-gray-900">
                  <span>${escapeHTML(exp.jobTitle)} — ${escapeHTML(exp.company)}</span>
                  <span class="text-[9px] font-mono text-gray-500 font-normal">${escapeHTML(exp.startDate)} – ${exp.current ? 'Present' : escapeHTML(exp.endDate)}</span>
                </div>
                <div class="text-[10px] text-gray-700 whitespace-pre-line leading-tight pl-2 border-l" style="border-color: ${color}">${escapeHTML(exp.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Projects -->
          ${projects.length ? `
          <div>
            <h2 class="text-[11px] font-bold uppercase font-mono tracking-wider pb-0.5 border-b" style="color: ${color}">Projects</h2>
            ${projects.map(proj => `
              <div class="mt-1.5 space-y-0.5">
                <div class="flex justify-between font-bold text-[11px] text-gray-900">
                  <span>${escapeHTML(proj.title)}</span>
                  <span class="text-[9px] font-mono text-gray-500 font-normal">${escapeHTML(proj.techStack)}</span>
                </div>
                <div class="text-[10px] text-gray-700 whitespace-pre-line leading-tight pl-2 border-l" style="border-color: ${color}">${escapeHTML(proj.description)}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Education -->
          ${education.length ? `
          <div>
            <h2 class="text-[11px] font-bold uppercase font-mono tracking-wider pb-0.5 border-b" style="color: ${color}">Education</h2>
            ${education.map(edu => `
              <div class="flex justify-between text-[10px] mt-1">
                <div><strong>${escapeHTML(edu.degree)}</strong>, ${escapeHTML(edu.institution)}</div>
                <div class="font-mono text-gray-600">${escapeHTML(edu.gradYear)} ${edu.cgpa ? `(CGPA: ${escapeHTML(edu.cgpa)})` : ''}</div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- Honors & Certs -->
          ${(certifications.length || achievements.length) ? `
          <div class="grid grid-cols-2 gap-2 pt-1 text-[9px]">
            ${certifications.length ? `
            <div>
              <strong class="block font-mono text-[10px] uppercase" style="color: ${color}">Certifications</strong>
              ${certifications.map(c => `<div>• ${escapeHTML(c.name)} (${escapeHTML(c.issuer)})</div>`).join('')}
            </div>` : ''}
            ${achievements.length ? `
            <div>
              <strong class="block font-mono text-[10px] uppercase" style="color: ${color}">Achievements</strong>
              ${achievements.map(a => `<div>• ${escapeHTML(a.title)} (${escapeHTML(a.year)})</div>`).join('')}
            </div>` : ''}
          </div>` : ''}
        </div>`;
    }

    previewContainer.innerHTML = previewHTML;
    applyZoomScale();
  };

  // --- ITEM LIST BUILDERS (Experience, Projects, Education, Certs, Achievements) ---

  // Experience
  function renderExperienceFormList() {
    const container = document.getElementById('res-exp-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.experience || []).map((exp, idx) => `
      <div class="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3 relative text-left transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 font-mono text-xs flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-400">${idx + 1}</span>
            <span class="font-bold text-xs text-neutral-900 dark:text-white">${escapeHTML(exp.jobTitle || 'Role Title')}</span>
          </div>
          <div class="flex items-center space-x-2 text-xs">
            ${idx > 0 ? `<button type="button" onclick="moveExperienceItem(${idx}, -1)" class="text-neutral-400 hover:text-neutral-700 dark:hover:text-white" title="Move Up">↑</button>` : ''}
            ${idx < currentResume.experience.length - 1 ? `<button type="button" onclick="moveExperienceItem(${idx}, 1)" class="text-neutral-400 hover:text-neutral-700 dark:hover:text-white" title="Move Down">↓</button>` : ''}
            <button type="button" onclick="removeExperienceItem(${idx})" class="text-rose-500 font-mono text-[11px] hover:underline font-bold">Remove</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input type="text" value="${escapeHTML(exp.jobTitle)}" oninput="updateExperienceItem(${idx}, 'jobTitle', this.value)" placeholder="Job Title (e.g. Software Engineer)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(exp.company)}" oninput="updateExperienceItem(${idx}, 'company', this.value)" placeholder="Company Name" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(exp.location || '')}" oninput="updateExperienceItem(${idx}, 'location', this.value)" placeholder="Location (e.g. San Francisco, CA)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <div class="grid grid-cols-2 gap-2">
            <input type="text" value="${escapeHTML(exp.startDate)}" oninput="updateExperienceItem(${idx}, 'startDate', this.value)" placeholder="Start (e.g. Jun 2024)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <input type="text" value="${escapeHTML(exp.endDate)}" oninput="updateExperienceItem(${idx}, 'endDate', this.value)" placeholder="End (e.g. Present)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] font-mono uppercase text-neutral-400 font-semibold">Bullet Point Achievements</label>
            <button type="button" onclick="openBulletEnhancerModal()" class="text-[10px] text-purple-600 dark:text-purple-400 font-bold hover:underline flex items-center space-x-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              <span>AI Bullet Helper</span>
            </button>
          </div>
          <textarea rows="3" oninput="updateExperienceItem(${idx}, 'description', this.value)" placeholder="• Architected RESTful microservices in Node.js, reducing latency by 35%...\n• Spearheaded frontend migration to React..." class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs leading-relaxed font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">${escapeHTML(exp.description)}</textarea>
        </div>
      </div>
    `).join('');
  }

  window.addExperienceItem = function() {
    currentResume.experience = currentResume.experience || [];
    currentResume.experience.push({
      id: 'exp_' + Date.now(),
      jobTitle: 'Software Development Engineer',
      company: 'Tech Company Inc.',
      location: 'Remote / Hybrid',
      startDate: 'Jan 2025',
      endDate: 'Present',
      current: true,
      description: '• Engineered scalable full-stack features using React, Node.js, and PostgreSQL, increasing user throughput by 30%.\n• Optimized database query performance and implemented automated unit tests with 90% branch coverage.'
    });
    renderExperienceFormList();
    renderLiveResumePreview();
    updateTopATSBadge();
    triggerDebouncedAutoSave();
  };

  window.updateExperienceItem = function(idx, field, val) {
    if (currentResume.experience && currentResume.experience[idx]) {
      currentResume.experience[idx][field] = val;
      renderLiveResumePreview();
      updateTopATSBadge();
      triggerDebouncedAutoSave();
    }
  };

  window.removeExperienceItem = function(idx) {
    if (currentResume.experience) {
      currentResume.experience.splice(idx, 1);
      renderExperienceFormList();
      renderLiveResumePreview();
      updateTopATSBadge();
      triggerDebouncedAutoSave();
    }
  };

  window.moveExperienceItem = function(idx, dir) {
    const list = currentResume.experience;
    const targetIdx = idx + dir;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      renderExperienceFormList();
      renderLiveResumePreview();
      triggerDebouncedAutoSave();
    }
  };

  // Projects
  function renderProjectsFormList() {
    const container = document.getElementById('res-proj-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.projects || []).map((proj, idx) => `
      <div class="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3 relative text-left transition-all">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <span class="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-800 font-mono text-xs flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-400">${idx + 1}</span>
            <span class="font-bold text-xs text-neutral-900 dark:text-white">${escapeHTML(proj.title || 'Project Title')}</span>
          </div>
          <div class="flex items-center space-x-2 text-xs">
            ${idx > 0 ? `<button type="button" onclick="moveProjectItem(${idx}, -1)" class="text-neutral-400 hover:text-neutral-700 dark:hover:text-white" title="Move Up">↑</button>` : ''}
            ${idx < currentResume.projects.length - 1 ? `<button type="button" onclick="moveProjectItem(${idx}, 1)" class="text-neutral-400 hover:text-neutral-700 dark:hover:text-white" title="Move Down">↓</button>` : ''}
            <button type="button" onclick="removeProjectItem(${idx})" class="text-rose-500 font-mono text-[11px] hover:underline font-bold">Remove</button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input type="text" value="${escapeHTML(proj.title)}" oninput="updateProjectItem(${idx}, 'title', this.value)" placeholder="Project Title (e.g. Distributed IDE)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(proj.techStack)}" oninput="updateProjectItem(${idx}, 'techStack', this.value)" placeholder="Tech Stack (e.g. React, Docker, Redis)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(proj.link || '')}" oninput="updateProjectItem(${idx}, 'link', this.value)" placeholder="Live Demo Link (e.g. https://myproject.dev)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(proj.github || '')}" oninput="updateProjectItem(${idx}, 'github', this.value)" placeholder="GitHub URL (e.g. github.com/user/repo)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
        </div>

        <div>
          <textarea rows="2" oninput="updateProjectItem(${idx}, 'description', this.value)" placeholder="• Built real-time collaborative workspace with WebSockets, maintaining <50ms sync latency..." class="w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs leading-relaxed font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">${escapeHTML(proj.description)}</textarea>
        </div>
      </div>
    `).join('');
  }

  window.addProjectItem = function() {
    currentResume.projects = currentResume.projects || [];
    currentResume.projects.push({
      id: 'proj_' + Date.now(),
      title: 'Cloud Analytics Platform',
      techStack: 'React, Node.js, PostgreSQL, Docker',
      link: 'https://demo.project.dev',
      github: 'github.com/alexrivera/analytics-hub',
      description: '• Architected an open-source telemetry engine processing 500k+ events daily with sub-second dashboard rendering.\n• Integrated OAuth authentication and Docker containerization for automated deployment.'
    });
    renderProjectsFormList();
    renderLiveResumePreview();
    updateTopATSBadge();
    triggerDebouncedAutoSave();
  };

  window.updateProjectItem = function(idx, field, val) {
    if (currentResume.projects && currentResume.projects[idx]) {
      currentResume.projects[idx][field] = val;
      renderLiveResumePreview();
      updateTopATSBadge();
      triggerDebouncedAutoSave();
    }
  };

  window.removeProjectItem = function(idx) {
    if (currentResume.projects) {
      currentResume.projects.splice(idx, 1);
      renderProjectsFormList();
      renderLiveResumePreview();
      updateTopATSBadge();
      triggerDebouncedAutoSave();
    }
  };

  window.moveProjectItem = function(idx, dir) {
    const list = currentResume.projects;
    const targetIdx = idx + dir;
    if (targetIdx >= 0 && targetIdx < list.length) {
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      renderProjectsFormList();
      renderLiveResumePreview();
      triggerDebouncedAutoSave();
    }
  };

  // Education
  function renderEducationFormList() {
    const container = document.getElementById('res-edu-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.education || []).map((edu, idx) => `
      <div class="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3 relative text-left">
        <div class="flex items-center justify-between">
          <span class="font-bold text-xs text-neutral-900 dark:text-white">Degree Entry #${idx + 1}</span>
          <button type="button" onclick="removeEducationItem(${idx})" class="text-rose-500 font-mono text-[11px] hover:underline font-bold">Remove</button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <input type="text" value="${escapeHTML(edu.degree)}" oninput="updateEducationItem(${idx}, 'degree', this.value)" placeholder="Degree (e.g. B.S. in Computer Science)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(edu.institution)}" oninput="updateEducationItem(${idx}, 'institution', this.value)" placeholder="University / College" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(edu.gradYear)}" oninput="updateEducationItem(${idx}, 'gradYear', this.value)" placeholder="Graduation Year (e.g. 2026)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
          <input type="text" value="${escapeHTML(edu.cgpa)}" oninput="updateEducationItem(${idx}, 'cgpa', this.value)" placeholder="CGPA (e.g. 3.85 / 4.0)" class="p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
        </div>
        <input type="text" value="${escapeHTML(edu.coursework || '')}" oninput="updateEducationItem(${idx}, 'coursework', this.value)" placeholder="Relevant Coursework (e.g. Algorithms, Distributed Systems, DBMS)" class="w-full p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white focus:ring-1 focus:ring-blue-500 focus:outline-none">
      </div>
    `).join('');
  }

  window.addEducationItem = function() {
    currentResume.education = currentResume.education || [];
    currentResume.education.push({
      id: 'edu_' + Date.now(),
      degree: 'B.S. in Computer Science & Engineering',
      institution: 'University of Technology',
      gradYear: '2026',
      cgpa: '3.85 / 4.0',
      coursework: 'Data Structures & Algorithms, Operating Systems, Database Architecture'
    });
    renderEducationFormList();
    renderLiveResumePreview();
    updateTopATSBadge();
    triggerDebouncedAutoSave();
  };

  window.updateEducationItem = function(idx, field, val) {
    if (currentResume.education && currentResume.education[idx]) {
      currentResume.education[idx][field] = val;
      renderLiveResumePreview();
      updateTopATSBadge();
      triggerDebouncedAutoSave();
    }
  };

  window.removeEducationItem = function(idx) {
    if (currentResume.education) {
      currentResume.education.splice(idx, 1);
      renderEducationFormList();
      renderLiveResumePreview();
      updateTopATSBadge();
      triggerDebouncedAutoSave();
    }
  };

  // Certifications
  function renderCertificationsFormList() {
    const container = document.getElementById('res-cert-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.certifications || []).map((c, idx) => `
      <div class="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex items-center gap-2 text-xs">
        <input type="text" value="${escapeHTML(c.name)}" oninput="updateCertificationItem(${idx}, 'name', this.value)" placeholder="Certification Name" class="flex-1 p-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
        <input type="text" value="${escapeHTML(c.issuer)}" oninput="updateCertificationItem(${idx}, 'issuer', this.value)" placeholder="Issuer" class="w-28 p-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
        <input type="text" value="${escapeHTML(c.year)}" oninput="updateCertificationItem(${idx}, 'year', this.value)" placeholder="Year" class="w-16 p-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">
        <button type="button" onclick="removeCertificationItem(${idx})" class="text-neutral-400 hover:text-rose-500 p-1" title="Remove">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');
  }

  window.addCertificationItem = function() {
    currentResume.certifications = currentResume.certifications || [];
    currentResume.certifications.push({
      id: 'cert_' + Date.now(),
      name: 'AWS Solutions Architect Associate',
      issuer: 'Amazon Web Services',
      year: '2025'
    });
    renderCertificationsFormList();
    renderLiveResumePreview();
    triggerDebouncedAutoSave();
  };

  window.updateCertificationItem = function(idx, field, val) {
    if (currentResume.certifications && currentResume.certifications[idx]) {
      currentResume.certifications[idx][field] = val;
      renderLiveResumePreview();
      triggerDebouncedAutoSave();
    }
  };

  window.removeCertificationItem = function(idx) {
    if (currentResume.certifications) {
      currentResume.certifications.splice(idx, 1);
      renderCertificationsFormList();
      renderLiveResumePreview();
      triggerDebouncedAutoSave();
    }
  };

  // Achievements
  function renderAchievementsFormList() {
    const container = document.getElementById('res-ach-list-container');
    if (!container) return;

    container.innerHTML = (currentResume.achievements || []).map((a, idx) => `
      <div class="p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary flex items-center gap-2 text-xs">
        <input type="text" value="${escapeHTML(a.title)}" oninput="updateAchievementItem(${idx}, 'title', this.value)" placeholder="Honor / Award Title" class="flex-1 p-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
        <input type="text" value="${escapeHTML(a.year)}" oninput="updateAchievementItem(${idx}, 'year', this.value)" placeholder="Year" class="w-16 p-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs font-mono text-neutral-900 dark:text-white">
        <input type="text" value="${escapeHTML(a.description || '')}" oninput="updateAchievementItem(${idx}, 'description', this.value)" placeholder="Brief Context" class="flex-1 p-1.5 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs text-neutral-900 dark:text-white">
        <button type="button" onclick="removeAchievementItem(${idx})" class="text-neutral-400 hover:text-rose-500 p-1" title="Remove">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>
    `).join('');
  }

  window.addAchievementItem = function() {
    currentResume.achievements = currentResume.achievements || [];
    currentResume.achievements.push({
      id: 'ach_' + Date.now(),
      title: 'LeetCode Knight (Top 4% Global)',
      year: '2025',
      description: 'Solved 700+ Data Structures & Algorithms problems.'
    });
    renderAchievementsFormList();
    renderLiveResumePreview();
    triggerDebouncedAutoSave();
  };

  window.updateAchievementItem = function(idx, field, val) {
    if (currentResume.achievements && currentResume.achievements[idx]) {
      currentResume.achievements[idx][field] = val;
      renderLiveResumePreview();
      triggerDebouncedAutoSave();
    }
  };

  window.removeAchievementItem = function(idx) {
    if (currentResume.achievements) {
      currentResume.achievements.splice(idx, 1);
      renderAchievementsFormList();
      renderLiveResumePreview();
      triggerDebouncedAutoSave();
    }
  };

  // --- ACCORDION CONTROLLER ---
  window.toggleAccordion = function(sectionId) {
    const content = document.getElementById(`content-${sectionId}`);
    const chevron = document.getElementById(`chevron-${sectionId}`);
    if (!content) return;

    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      if (chevron) chevron.classList.add('rotate-180');
    } else {
      content.classList.add('hidden');
      if (chevron) chevron.classList.remove('rotate-180');
    }
  };

  window.toggleAllAccordions = function(expand = true) {
    const sections = ['sec-personal', 'sec-exp', 'sec-proj', 'sec-skills', 'sec-edu', 'sec-extra'];
    sections.forEach(sec => {
      const content = document.getElementById(`content-${sec}`);
      const chevron = document.getElementById(`chevron-${sec}`);
      if (content) {
        if (expand) {
          content.classList.remove('hidden');
          if (chevron) chevron.classList.add('rotate-180');
        } else {
          content.classList.add('hidden');
          if (chevron) chevron.classList.remove('rotate-180');
        }
      }
    });
  };

  // --- STARTER PROFILE PRESET LOADER ---
  window.toggleSampleProfileDropdown = function() {
    const dropdown = document.getElementById('res-sample-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
  };

  window.loadSampleProfilePreset = function(presetKey) {
    const preset = SAMPLE_PROFILES[presetKey];
    if (!preset) return;

    const proceed = () => {
      const cloned = JSON.parse(JSON.stringify(preset));
      cloned.id = currentResume ? currentResume.id : ('res_' + Date.now());
      currentResume = cloned;
      
      populateFormInputs();
      renderTemplateOptions();
      renderColorPaletteBar();
      renderLiveResumePreview();
      updateTopATSBadge();
      triggerDebouncedAutoSave();

      document.getElementById('res-sample-dropdown')?.classList.add('hidden');

      if (window.customAlert) {
        window.customAlert('Sample Profile Loaded', `Loaded "${preset.title}" template with verified ATS metric bullets.`, 'success');
      }
    };

    if (window.customConfirm) {
      window.customConfirm('Load Starter Profile', 'This will populate the form with a high-scoring sample profile. Any unsaved edits will be replaced. Proceed?').then(yes => {
        if (yes) proceed();
      });
    } else {
      proceed();
    }
  };

  // --- REAL-TIME ATS SCORE CONTROLLER ---
  function updateTopATSBadge() {
    if (!currentResume) return;
    const analysis = analyzeATSCompatibility(currentResume, document.getElementById('res-jd-input')?.value || '');
    
    const topScoreEl = document.getElementById('top-ats-score-text');
    if (topScoreEl) topScoreEl.textContent = `${analysis.score}%`;

    const mobPill = document.getElementById('mob-ats-pill');
    if (mobPill) mobPill.textContent = `${analysis.score}%`;
  }

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
    const verdictEl = document.getElementById('ats-report-verdict');
    const matchesEl = document.getElementById('ats-report-matches');
    const missingEl = document.getElementById('ats-report-missing');
    const suggestionsEl = document.getElementById('ats-report-suggestions');

    const quantScore = document.getElementById('ats-quantifier-score');
    const verbsScore = document.getElementById('ats-verbs-score');
    const techScore = document.getElementById('ats-tech-score');
    const contactScore = document.getElementById('ats-contact-score');

    if (scoreEl) scoreEl.textContent = `${result.score}%`;
    if (barEl) barEl.style.width = `${result.score}%`;

    if (verdictEl) {
      if (result.score >= 90) {
        verdictEl.textContent = 'Tier-1 Tech Ready';
        verdictEl.className = 'text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20';
      } else if (result.score >= 75) {
        verdictEl.textContent = 'Strong Competitive Match';
        verdictEl.className = 'text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20';
      } else {
        verdictEl.textContent = 'Needs Optimization';
        verdictEl.className = 'text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20';
      }
    }

    if (quantScore) quantScore.textContent = `${result.matchDetails.categories.impact.score} / 25 pts`;
    if (verbsScore) verbsScore.textContent = `${result.matchDetails.categories.actionVerbs.score} / 25 pts`;
    if (techScore) techScore.textContent = `${result.matchDetails.categories.technicalKeywords.score} / 20 pts`;
    if (contactScore) contactScore.textContent = `${result.matchDetails.categories.contact.score} / 15 pts`;

    if (matchesEl) {
      matchesEl.innerHTML = result.matchDetails.keywordMatches.map(k => `
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          ${escapeHTML(k)}
        </span>
      `).join('');
      const countEl = document.getElementById('ats-found-count');
      if (countEl) countEl.textContent = `${result.matchDetails.keywordMatches.length} found`;
    }

    if (missingEl) {
      missingEl.innerHTML = result.matchDetails.missingKeywords.slice(0, 15).map(k => `
        <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
          + ${escapeHTML(k)}
        </span>
      `).join('');
      const missCountEl = document.getElementById('ats-missing-count');
      if (missCountEl) missCountEl.textContent = `${result.matchDetails.missingKeywords.length} recommended`;
    }

    if (suggestionsEl) {
      if (result.matchDetails.suggestions.length === 0) {
        suggestionsEl.innerHTML = `<li class="text-emerald-600 dark:text-emerald-400">Your resume meets high-scoring ATS formatting standards with strong action verbs and quantified impact metrics!</li>`;
      } else {
        suggestionsEl.innerHTML = result.matchDetails.suggestions.map(s => `
          <li>${escapeHTML(s)}</li>
        `).join('');
      }
    }
  }

  // --- AI BULLET POINT ENHANCER MODAL ---
  window.openBulletEnhancerModal = function() {
    const modal = document.getElementById('res-bullet-modal');
    if (modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
    }
  };

  window.closeBulletEnhancerModal = function() {
    const modal = document.getElementById('res-bullet-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.copyActionVerb = function(verb) {
    navigator.clipboard.writeText(verb);
    if (window.customAlert) window.customAlert('Copied to Clipboard', `Action verb "${verb}" copied. Paste it at the start of your bullet point!`, 'success');
  };

  window.copyBulletSnippet = function(el) {
    const text = el.innerText.trim();
    navigator.clipboard.writeText(text);
    if (window.customAlert) window.customAlert('Copied to Clipboard', 'Sample bullet point copied to clipboard!', 'success');
  };

  window.generateSummaryPrompt = function() {
    const title = document.getElementById('res-form-jobtitle')?.value || 'Software Engineer';
    const skills = document.getElementById('res-form-skills-lang')?.value || 'Modern Web Stacks';
    const suggested = `Results-driven ${title} with expertise in ${skills}. Proven track record of architecting scalable distributed systems, optimizing backend latency, and delivering high-impact product features in agile engineering environments.`;
    
    const summaryEl = document.getElementById('res-form-summary');
    if (summaryEl) {
      summaryEl.value = suggested;
      updateResumeDataFromForm();
      if (window.customAlert) window.customAlert('Summary Generated', 'Inserted an executive summary tailored to your role and tech stack.', 'success');
    }
  };

  // --- IMPORT / EXPORT & BACKUP CONTROLLER ---
  window.toggleExportDropdown = function() {
    const dropdown = document.getElementById('res-export-dropdown');
    if (dropdown) dropdown.classList.toggle('hidden');
  };

  window.openImportExportModal = function(mode = 'export-json') {
    const modal = document.getElementById('res-import-export-modal');
    const importContainer = document.getElementById('import-json-container');
    const exportContainer = document.getElementById('export-json-container');
    const title = document.getElementById('import-export-modal-title');

    if (!modal) return;

    if (mode === 'import-json') {
      if (title) title.textContent = 'Import Resume from JSON Backup';
      if (importContainer) importContainer.classList.remove('hidden');
      if (exportContainer) exportContainer.classList.add('hidden');
    } else {
      if (title) title.textContent = 'Export Resume Data (JSON)';
      if (importContainer) importContainer.classList.add('hidden');
      if (exportContainer) exportContainer.classList.remove('hidden');
      
      const preview = document.getElementById('res-json-export-preview');
      if (preview) preview.value = JSON.stringify(currentResume, null, 2);
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeImportExportModal = function() {
    const modal = document.getElementById('res-import-export-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  window.downloadResumeJsonFile = function() {
    if (!currentResume) return;
    const jsonStr = JSON.stringify(currentResume, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(currentResume.title || 'resume').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    closeImportExportModal();
  };

  window.handleJsonFileImport = function() {
    const fileInput = document.getElementById('res-json-file-input');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
      if (window.customAlert) window.customAlert('Import Error', 'Please select a valid .json resume file to import.', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.personalInfo) {
          throw new Error('Invalid resume data structure');
        }
        imported.id = 'res_' + Date.now();
        currentResume = imported;
        ensureResumeDataIntegrity();
        saveUserResume(currentResume);

        populateFormInputs();
        renderTemplateOptions();
        renderColorPaletteBar();
        renderLiveResumePreview();
        updateTopATSBadge();
        closeImportExportModal();

        if (window.customAlert) window.customAlert('Resume Imported', 'Resume data imported and loaded successfully!', 'success');
      } catch (err) {
        if (window.customAlert) window.customAlert('Import Failed', 'Failed to parse JSON file: ' + err.message, 'error');
      }
    };
    reader.readAsText(fileInput.files[0]);
  };

  window.copyResumeAsMarkdown = function() {
    if (!currentResume) return;
    const md = resumeToMarkdown(currentResume);
    navigator.clipboard.writeText(md);
    if (window.customAlert) window.customAlert('Copied as Plain Text', 'Resume copied in clean text/markdown format, ready to paste into job applications!', 'success');
  };

  window.exportResumePDF = function() {
    window.print();
  };

  // --- SAVED DRAFTS HISTORY ---
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

  window.createNewResumeDraft = function() {
    const fresh = createEmptyResumeData();
    fresh.title = `Software Engineer Resume #${Math.floor(Math.random() * 900 + 100)}`;
    saveUserResume(fresh);
    currentResume = fresh;

    populateFormInputs();
    renderTemplateOptions();
    renderColorPaletteBar();
    renderLiveResumePreview();
    updateTopATSBadge();
    closeDraftsHistoryModal();

    if (window.customAlert) window.customAlert('New Draft Created', 'Created a fresh new resume draft.', 'success');
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
      <div class="p-3.5 rounded-xl border ${currentResume && currentResume.id === d.id ? 'border-blue-600 bg-blue-500/10' : 'border-neutral-200 dark:border-neutral-800 bg-surface-secondary'} flex items-center justify-between text-left">
        <div>
          <h4 class="font-bold text-xs text-neutral-900 dark:text-white flex items-center space-x-2">
            <span>${escapeHTML(d.title)}</span>
            ${currentResume && currentResume.id === d.id ? '<span class="text-[9px] font-mono bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">ACTIVE</span>' : ''}
          </h4>
          <span class="text-[10px] font-mono text-neutral-500">Updated: ${new Date(d.lastUpdated || Date.now()).toLocaleDateString()}</span>
        </div>
        <div class="flex items-center space-x-2">
          <button onclick="loadUserResumeDraft('${d.id}')" class="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700">Load</button>
          <button onclick="deleteUserResumeDraft('${d.id}')" class="px-2.5 py-1 text-xs font-semibold rounded-lg border border-rose-500/20 text-rose-600 hover:bg-rose-500/10">Delete</button>
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
      ensureResumeDataIntegrity();
      populateFormInputs();
      renderTemplateOptions();
      renderColorPaletteBar();
      renderLiveResumePreview();
      updateTopATSBadge();
      closeDraftsHistoryModal();
    }
  };

  window.deleteUserResumeDraft = function(draftId) {
    const proceed = () => {
      deleteUserResume(draftId);
      renderDraftsHistoryList();
      const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
      const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';
      const remaining = getUserResumes(userEmail);
      if (currentResume && currentResume.id === draftId) {
        currentResume = remaining.length > 0 ? remaining[0] : createEmptyResumeData();
        populateFormInputs();
        renderLiveResumePreview();
      }
    };

    if (window.customConfirm) {
      window.customConfirm('Delete Draft', 'Are you sure you want to delete this resume draft?').then(yes => {
        if (yes) proceed();
      });
    } else {
      proceed();
    }
  };

  // --- FULLSCREEN PREVIEW MODAL ---
  window.openFullscreenModal = function() {
    const modal = document.getElementById('res-fullscreen-modal');
    const content = document.getElementById('res-fullscreen-content');
    const live = document.getElementById('resume-live-preview');
    if (!modal || !content || !live) return;

    content.innerHTML = live.innerHTML;
    content.className = live.className;
    content.style.fontFamily = live.style.fontFamily;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
  };

  window.closeFullscreenModal = function() {
    const modal = document.getElementById('res-fullscreen-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  };

  // --- MOBILE VIEWPORT SWITCHER ---
  window.switchMobileWorkspaceTab = function(tabName) {
    const editor = document.getElementById('res-editor-panel');
    const preview = document.getElementById('res-preview-panel');
    const btnEdit = document.getElementById('mob-tab-editor');
    const btnPrev = document.getElementById('mob-tab-preview');

    if (tabName === 'editor') {
      if (editor) editor.classList.remove('hidden');
      if (preview) preview.classList.add('hidden');
      if (btnEdit) {
        btnEdit.className = "px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm transition-all";
      }
      if (btnPrev) {
        btnPrev.className = "px-4 py-1.5 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all";
      }
    } else {
      if (editor) editor.classList.add('hidden');
      if (preview) preview.classList.remove('hidden');
      if (btnPrev) {
        btnPrev.className = "px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm transition-all";
      }
      if (btnEdit) {
        btnEdit.className = "px-4 py-1.5 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-all";
      }
      window.resetZoomPreview();
    }
  };

  // --- UTILITY HELPERS ---
  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function formatUrl(url) {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return 'https://' + url;
  }

})();
