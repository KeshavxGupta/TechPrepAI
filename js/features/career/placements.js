// --- State Management ---
const DEFAULT_DRIVES_SEED = [
  {
    id: "drive-1",
    company: "Google",
    role: "Software Development Engineer (SWE-1)",
    package: "32.0",
    deadline: "2026-09-30",
    interviewDate: "2026-10-15",
    eligibility: "B.Tech/M.Tech CS/IT with 8.0+ CGPA",
    location: "Bengaluru / Hyderabad (Hybrid)",
    status: "wishlist",
    link: "https://careers.google.com",
    notes: "Focus on Graph algorithms, Dynamic Programming, and System Design fundamentals.",
    isArchived: false,
    createdAt: new Date().toISOString(),
    appliedDate: null,
    statusUpdatedAt: new Date().toISOString()
  },
  {
    id: "drive-2",
    company: "Microsoft",
    role: "Software Engineer - Cloud & AI",
    package: "28.5",
    deadline: "2026-09-25",
    interviewDate: "2026-10-10",
    eligibility: "7.5+ CGPA, All Engineering Branches",
    location: "Noida / Hyderabad / Remote",
    status: "wishlist",
    link: "https://careers.microsoft.com",
    notes: "Round 1: Codility OA (3 DSA Questions), Round 2: Architecture & Systems.",
    isArchived: false,
    createdAt: new Date().toISOString(),
    appliedDate: null,
    statusUpdatedAt: new Date().toISOString()
  },
  {
    id: "drive-3",
    company: "Amazon",
    role: "SDE-1 (AWS Services)",
    package: "26.0",
    deadline: "2026-10-05",
    interviewDate: "2026-10-20",
    eligibility: "7.0+ CGPA, 2026 Batch",
    location: "Bengaluru / Chennai",
    status: "wishlist",
    link: "https://amazon.jobs",
    notes: "Amazon Leadership Principles + 2 DSA Technical Interview rounds.",
    isArchived: false,
    createdAt: new Date().toISOString(),
    appliedDate: null,
    statusUpdatedAt: new Date().toISOString()
  },
  {
    id: "drive-4",
    company: "Atlassian",
    role: "Software Engineer (Full Stack / Java)",
    package: "38.0",
    deadline: "2026-10-12",
    interviewDate: "2026-10-28",
    eligibility: "8.0+ CGPA, CS/IT/ECE",
    location: "Bengaluru (Remote Friendly)",
    status: "wishlist",
    link: "https://www.atlassian.com/company/careers",
    notes: "Craftsmanship & Values interview + Code design round.",
    isArchived: false,
    createdAt: new Date().toISOString(),
    appliedDate: null,
    statusUpdatedAt: new Date().toISOString()
  },
  {
    id: "drive-5",
    company: "Goldman Sachs",
    role: "Summer Analyst / Tech Analyst",
    package: "24.0",
    deadline: "2026-09-18",
    interviewDate: "2026-09-28",
    eligibility: "7.5+ CGPA, Strong Math & Coding",
    location: "Bengaluru / Mumbai",
    status: "wishlist",
    link: "https://www.goldmansachs.com/careers",
    notes: "Aptitude + Advanced Data Structures + Core CS (OS/DBMS/CN).",
    isArchived: false,
    createdAt: new Date().toISOString(),
    appliedDate: null,
    statusUpdatedAt: new Date().toISOString()
  }
];

// --- User Data Isolation & Storage Keys ---
function getUserPlacementsKey() {
  const user = (window.getCurrentUser && window.getCurrentUser()) || JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  const email = user ? user.email : 'guest@techprepai.com';
  return `techprep_user_placements_${email}`;
}

function getUserWeeklyTargetKey() {
  const user = (window.getCurrentUser && window.getCurrentUser()) || JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  const email = user ? user.email : 'guest@techprepai.com';
  return `techprep_weekly_target_${email}`;
}

function loadUserPlacementsData() {
  const key = getUserPlacementsKey();
  const storedStr = localStorage.getItem(key);
  if (storedStr !== null) {
    try {
      const parsed = JSON.parse(storedStr);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  // Seed from master techprep_placements or DEFAULT_DRIVES_SEED if user has no record yet
  let master = [];
  try {
    master = JSON.parse(localStorage.getItem('techprep_placements') || '[]');
  } catch {}
  if (!Array.isArray(master) || master.length === 0) {
    master = DEFAULT_DRIVES_SEED;
    localStorage.setItem('techprep_placements', JSON.stringify(DEFAULT_DRIVES_SEED));
  }

  const userSeed = master.map(d => ({
    ...d,
    status: d.status || 'wishlist',
    appliedDate: d.appliedDate || null
  }));

  localStorage.setItem(key, JSON.stringify(userSeed));
  return userSeed;
}

function saveUserPlacementsData(data) {
  const key = getUserPlacementsKey();
  localStorage.setItem(key, JSON.stringify(data));
}

let placements = loadUserPlacementsData();

// --- DOM Elements ---
const summaryStats = document.getElementById('summary-stats');
const kanbanBoard = document.getElementById('kanban-board');

// Sidebar toggle
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Global Theme
const themeToggle = document.getElementById('theme-toggle');

// Modals
const closeBtns = document.querySelectorAll('.close-btn');

// --- Initialize App ---
const initApp = () => {
    // Set theme based on local storage
    if (localStorage.getItem('techprep_theme') === 'dark') {
        document.body.classList.add('dark-theme');
        document.body.classList.add('dark');
        if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        if (themeToggle) themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }

    renderStats();
    renderPlacements();
    renderChart();
    renderUpcomingJobs();
    checkUpcomingReminders();
};

// --- Theme Toggle ---
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark-theme');
        localStorage.setItem('techprep_theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    });
}

// --- Modal Logic ---
window.openModal = function(modalId) {
    const modalOverlay = document.getElementById('app-modal-overlay') || document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.add('active', 'opacity-100', 'pointer-events-auto');
        modalOverlay.classList.remove('opacity-0', 'pointer-events-none');
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
        modal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
    }
};

window.closeModal = function(modalId) {
    const modalOverlay = document.getElementById('app-modal-overlay') || document.getElementById('modal-overlay');
    if (modalOverlay) {
        modalOverlay.classList.remove('active', 'opacity-100', 'pointer-events-auto');
        modalOverlay.classList.add('opacity-0', 'pointer-events-none');
    }
    
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
        modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
        
        // Reset form inputs if application-modal
        if (modalId === 'application-modal') {
            const elComp = document.getElementById('app-company');
            if (elComp) elComp.value = '';
            const elRole = document.getElementById('app-role');
            if (elRole) elRole.value = '';
            const elPkg = document.getElementById('app-package');
            if (elPkg) elPkg.value = '';
            const elDead = document.getElementById('app-deadline');
            if (elDead) elDead.value = '';
            const elStat = document.getElementById('app-status');
            if (elStat) elStat.value = 'wishlist';
            const elLink = document.getElementById('app-link');
            if (elLink) elLink.value = '';
            const elLoc = document.getElementById('app-location');
            if (elLoc) elLoc.value = '';
            const elElig = document.getElementById('app-eligibility');
            if (elElig) elElig.value = '';
            const elInt = document.getElementById('app-interview-date');
            if (elInt) elInt.value = '';
        }
    }
};

window.exportData = function() {
    const backup = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        placements: placements,
        weeklyTarget: localStorage.getItem(getUserWeeklyTargetKey()) || '10'
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TechPrepAI_Placements_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    if (window.showToast) window.showToast("Placements backup exported successfully!", "success");
};

window.importData = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!data || !Array.isArray(data.placements)) {
                throw new Error("Invalid backup format: missing placements list.");
            }
            placements = data.placements;
            saveUserPlacementsData(placements);
            if (data.weeklyTarget) {
                localStorage.setItem(getUserWeeklyTargetKey(), data.weeklyTarget);
            }
            renderStats();
            renderPlacements();
            renderChart();
            renderUpcomingJobs();
            updateWeeklyTarget();
            checkUpcomingReminders();
            if (window.showToast) window.showToast("Placements data restored successfully!", "success");
        } catch (err) {
            console.error(err);
            if (window.showToast) window.showToast("Failed to import backup: Invalid JSON structure", "error");
        } finally {
            event.target.value = '';
        }
    };
    reader.readAsText(file);
};

closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalId = e.target.closest('.close-btn')?.dataset?.modal;
        if (modalId) closeModal(modalId);
    });
});

// For older modal overlay class compatibility if needed
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay') && e.target.classList.contains('active')) {
        const activeModal = document.querySelector('.modal.opacity-100');
        if (activeModal) closeModal(activeModal.id);
    }
});


// --- Kanban Board Logic ---
const renderPlacements = () => {
    if (!kanbanBoard) return;
    
    kanbanBoard.innerHTML = '';
    
    // Active recruitment stages (removed unnecessary selected/rejected columns)
    const columns = [
        { id: 'wishlist', title: 'Available Jobs & Wishlist', color: 'blue', icon: 'fa-briefcase', headerClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
        { id: 'applied', title: 'Applied', color: 'cyan', icon: 'fa-paper-plane', headerClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
        { id: 'assessment', title: 'Assessment (OA)', color: 'purple', icon: 'fa-laptop-code', headerClass: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
        { id: 'interview', title: 'Interview Rounds', color: 'amber', icon: 'fa-comments', headerClass: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' }
    ];

    columns.forEach(col => {
        const colTasks = placements.filter(p => p.status === col.id && !p.isArchived);
        
        const colEl = document.createElement('div');
        colEl.className = "kanban-column w-84 sm:w-92 shrink-0 snap-start flex flex-col gap-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-surface-elevated/80 subtle-glass p-4 shadow-sm transition-all";
        colEl.setAttribute('ondragover', 'allowDrop(event)');
        colEl.setAttribute('ondrop', `drop(event, '${col.id}')`);
        
        colEl.innerHTML = `
            <div class="column-header flex justify-between items-center px-3.5 py-2.5 rounded-xl border ${col.headerClass} font-bold text-xs">
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${col.icon}"></i> 
                    <span>${col.title}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-surface-primary shadow-xs">${colTasks.length}</span>
            </div>
            <div class="column-content relative flex flex-col gap-3.5 max-h-[580px] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700 [&::-webkit-scrollbar-thumb]:rounded-full pb-2 pt-1 pr-1">
                ${colTasks.length === 0 ? `<div class="text-center text-neutral-400 dark:text-neutral-500 text-xs py-10 italic border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">No active applications in this stage</div>` : ''}
            </div>
        `;
        
        const contentEl = colEl.querySelector('.column-content');
        
        colTasks.forEach(app => {
            const card = document.createElement('div');
            card.className = "job-card bg-surface-primary p-4 rounded-xl border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm flex flex-col gap-3.5 cursor-grab active:cursor-grabbing hover:border-blue-500/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 relative group";
            card.setAttribute('draggable', 'true');
            card.setAttribute('ondragstart', 'drag(event)');
            card.setAttribute('ondragend', 'dragEnd(event)');
            card.setAttribute('data-id', app.id);
            
            const packageBadge = app.package ? `<span class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg flex items-center gap-1"><i class="fa-solid fa-indian-rupee-sign text-[9px]"></i> ${app.package} LPA</span>` : '';
            const locationBadge = app.location ? `<span class="bg-surface-secondary text-[11px] text-neutral-600 dark:text-neutral-400 font-medium px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center gap-1 truncate max-w-[140px]"><i class="fa-solid fa-map-marker-alt text-[9px] text-neutral-400"></i> ${app.location}</span>` : '';
            const eligibilityBadge = app.eligibility ? `<span class="bg-surface-secondary text-[11px] text-neutral-600 dark:text-neutral-400 font-medium px-2.5 py-1 rounded-lg border border-neutral-200 dark:border-neutral-800 truncate max-w-[130px]">${app.eligibility}</span>` : '';
            const linkBtn = app.link ? `<a href="${app.link}" target="_blank" rel="noopener noreferrer" class="p-1.5 rounded-lg text-neutral-400 hover:text-blue-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" title="Open Career Portal"><i class="fa-solid fa-arrow-up-right-from-square text-xs"></i></a>` : '';
            
            let appliedStr = 'No deadline';
            const dateFmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            
            const applied = app.appliedDate;
            if (applied) {
                appliedStr = `Applied: ${dateFmt(applied)}`;
            } else if (app.deadline) {
                appliedStr = `Due: ${dateFmt(app.deadline)}`;
            }

            const interviewBadge = app.interviewDate ? `<span class="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border border-amber-500/20"><i class="fa-regular fa-calendar-check text-[9px]"></i> Round: ${dateFmt(app.interviewDate)}</span>` : '';

            card.innerHTML = `
                <div class="flex items-start gap-3 relative">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner">
                        <span class="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono">${app.company.charAt(0).toUpperCase()}</span>
                    </div>
                    
                    <div class="flex-1 min-w-0 pr-12">
                        <h4 class="font-bold text-neutral-900 dark:text-white text-sm leading-tight truncate">${app.role}</h4>
                        <p class="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate mt-0.5">${app.company}</p>
                    </div>
                    
                    <div class="flex items-center gap-1 absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity bg-surface-primary pl-1 py-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
                        <button class="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs" onclick="archivePlacement('${app.id}')" title="Archive application">
                            <i class="fa-solid fa-box-archive"></i>
                        </button>
                        <button class="w-6 h-6 flex items-center justify-center rounded text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all text-xs" onclick="deleteApplication('${app.id}')" title="Delete application">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>

                <div class="flex flex-wrap items-center gap-1.5 pt-1">
                    ${packageBadge}
                    ${locationBadge}
                    ${eligibilityBadge}
                </div>

                ${interviewBadge ? `<div class="pt-0.5">${interviewBadge}</div>` : ''}
                
                <div class="flex items-center justify-between pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 text-[11px] text-neutral-500">
                    <span class="flex items-center gap-1 font-mono text-[10px]">
                        <i class="fa-regular fa-clock"></i> ${appliedStr}
                    </span>

                    <div class="flex items-center gap-1.5">
                        ${app.status === 'wishlist' ? `
                            <button onclick="event.stopPropagation(); studentApplyNow('${app.id}')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer" title="Apply to this company">
                                <i class="fa-solid fa-paper-plane text-[9px]"></i> Apply Now
                            </button>
                        ` : ''}
                        ${linkBtn}
                    </div>
                </div>
            `;
            contentEl.appendChild(card);
        });

        kanbanBoard.appendChild(colEl);
    });
};

// --- Summary Stats Logic ---
const renderStats = () => {
    if (!summaryStats) return;
    
    const unarchived = placements.filter(p => !p.isArchived);
    const totalAvailable = unarchived.filter(p => p.status === 'wishlist').length;
    const totalApplied = unarchived.filter(p => p.status === 'applied').length;
    const pendingOA = unarchived.filter(p => p.status === 'assessment').length;
    const activeInterviews = unarchived.filter(p => p.status === 'interview').length;
    
    summaryStats.innerHTML = `
        <div class="stat-card bg-surface-elevated/70 subtle-glass p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-all hover:-translate-y-1 relative overflow-hidden group">
            <i class="fa-solid fa-briefcase absolute top-3 right-3 text-3xl text-blue-500/10 dark:text-blue-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">Available Drives</p>
            <h3 class="text-3xl font-black text-neutral-900 dark:text-white mb-1 font-mono">${totalAvailable}</h3>
            <span class="text-[11px] text-blue-600 dark:text-blue-400 font-mono">Open Opportunities</span>
        </div>
        <div class="stat-card bg-surface-elevated/70 subtle-glass p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-all hover:-translate-y-1 relative overflow-hidden group">
            <i class="fa-solid fa-paper-plane absolute top-3 right-3 text-3xl text-cyan-500/10 dark:text-cyan-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">Total Applied</p>
            <h3 class="text-3xl font-black text-neutral-900 dark:text-white mb-1 font-mono">${totalApplied}</h3>
            <span class="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono">Applications Sent</span>
        </div>
        <div class="stat-card bg-surface-elevated/70 subtle-glass p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-all hover:-translate-y-1 relative overflow-hidden group">
            <i class="fa-solid fa-laptop-code absolute top-3 right-3 text-3xl text-purple-500/10 dark:text-purple-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">Pending OAs</p>
            <h3 class="text-3xl font-black text-neutral-900 dark:text-white mb-1 font-mono">${pendingOA}</h3>
            <span class="text-[11px] text-purple-600 dark:text-purple-400 font-mono">Online Assessments</span>
        </div>
        <div class="stat-card bg-surface-elevated/70 subtle-glass p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm transition-all hover:-translate-y-1 relative overflow-hidden group">
            <i class="fa-solid fa-comments absolute top-3 right-3 text-3xl text-amber-500/10 dark:text-amber-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-xs text-neutral-500 font-semibold uppercase tracking-wider mb-1">Active Interviews</p>
            <h3 class="text-3xl font-black text-neutral-900 dark:text-white mb-1 font-mono">${activeInterviews}</h3>
            <span class="text-[11px] text-amber-600 dark:text-amber-400 font-mono">Live Rounds</span>
        </div>
    `;
};


// --- CRUD Operations (User can edit tracking notes, stages & archive) ---

window.openEditModal = (id) => {
    const app = placements.find(p => p.id === id);
    if (!app) return;
    
    document.getElementById('edit-app-id').value = app.id;
    document.getElementById('edit-app-company').value = app.company || '';
    document.getElementById('edit-app-role').value = app.role || '';
    document.getElementById('edit-app-package').value = app.package || '';
    document.getElementById('edit-app-deadline').value = app.deadline || '';
    document.getElementById('edit-app-interview-date').value = app.interviewDate || '';
    document.getElementById('edit-app-eligibility').value = app.eligibility || '';
    document.getElementById('edit-app-location').value = app.location || '';
    document.getElementById('edit-app-status').value = app.status || 'wishlist';
    document.getElementById('edit-app-link').value = app.link || '';
    document.getElementById('edit-app-notes').value = app.notes || '';
    
    openModal('edit-job-modal');
};

const saveEditedJob = () => {
    const id = document.getElementById('edit-app-id').value;
    const company = document.getElementById('edit-app-company').value.trim();
    const role = document.getElementById('edit-app-role').value.trim();
    const pkg = document.getElementById('edit-app-package').value.trim();
    const deadline = document.getElementById('edit-app-deadline').value;
    const interviewDate = document.getElementById('edit-app-interview-date').value;
    const eligibility = document.getElementById('edit-app-eligibility').value.trim();
    const location = document.getElementById('edit-app-location').value.trim();
    const status = document.getElementById('edit-app-status').value;
    const link = document.getElementById('edit-app-link').value.trim();
    const notes = document.getElementById('edit-app-notes').value;
    
    if (!company || !role) {
        if(window.showToast) window.showToast("Please enter Company Name and Job Role.", "error");
        return;
    }
    
    const placementIndex = placements.findIndex(p => p.id === id);
    if (placementIndex !== -1) {
        placements[placementIndex] = {
            ...placements[placementIndex],
            company,
            role,
            package: pkg,
            deadline,
            interviewDate,
            eligibility,
            location,
            status,
            link,
            notes,
            statusUpdatedAt: new Date().toISOString()
        };
        
        saveUserPlacementsData(placements);
        closeModal('edit-job-modal');
        renderPlacements();
        renderStats();
        renderChart();
        renderUpcomingJobs();
        updateWeeklyTarget();
        checkUpcomingReminders();
        if(window.showToast) window.showToast('Application updated successfully!', 'success');
    }
};

const saveEditedAppBtn = document.getElementById('save-edited-app-btn');
if (saveEditedAppBtn) {
    saveEditedAppBtn.addEventListener('click', saveEditedJob);
}

window.deleteApplication = async (id) => {
    const confirmed = await showConfirmModal({
        title: 'Delete Application?',
        message: 'Are you sure you want to permanently delete this job application? This action cannot be undone.',
        confirmText: 'Delete',
        isDangerous: true
    });

    if (confirmed) {
        placements = placements.filter(p => p.id !== id);
        saveUserPlacementsData(placements);
        renderPlacements();
        renderStats();
        renderChart();
        renderUpcomingJobs();
        updateWeeklyTarget();
        checkUpcomingReminders();
        if(window.showToast) window.showToast('Application deleted', 'error');
    }
};

// --- Drag and Drop Logic ---
window.allowDrop = (event) => {
    event.preventDefault();
};

window.drag = (event) => {
    // Determine the closest job-card element (in case the drag started from an inner element)
    const card = event.target.closest('.job-card');
    if (!card) return;
    
    event.dataTransfer.setData("text", card.getAttribute('data-id'));
    card.classList.add('opacity-50');
};

window.dragEnd = (event) => {
    const card = event.target.closest('.job-card');
    if (card) {
        card.classList.remove('opacity-50');
    }
};

// ============================================================
// MASTER LIST VIEW LOGIC
// ============================================================

window.openMasterListView = (filterStatus = 'All') => {
    document.getElementById('master-list-modal').classList.remove('hidden');
    renderMasterList(filterStatus);
};

window.closeMasterListView = () => {
    document.getElementById('master-list-modal').classList.add('hidden');
    renderPlacements();
    renderStats();
};

const renderMasterList = (filterStatus = 'All') => {
    const tabsContainer = document.getElementById('master-list-tabs');
    const gridContainer = document.getElementById('master-list-grid');
    
    // Safety check in case HTML is missing
    if (!tabsContainer || !gridContainer) return;

    tabsContainer.innerHTML = '';
    gridContainer.innerHTML = '';
    
    const unarchivedJobs = placements.filter(p => !p.isArchived);

    // 1. Generate Tabs
    const categories = [
        { label: 'All', value: 'All' },
        { label: 'Wishlist', value: 'wishlist' },
        { label: 'Applied', value: 'applied' },
        { label: 'Assessment', value: 'assessment' },
        { label: 'Interview', value: 'interview' },
        { label: 'Selected', value: 'selected' },
        { label: 'Rejected', value: 'rejected' }
    ];

    categories.forEach(cat => {
        let count = 0;
        if (cat.value === 'All') {
            count = unarchivedJobs.length;
        } else {
            count = unarchivedJobs.filter(j => j.status === cat.value).length;
        }

        const isActive = filterStatus === cat.value;
        const activeClass = isActive 
            ? 'border-b-2 border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 font-semibold pb-3'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 pb-3 transition-colors border-b-2 border-transparent';

        const btn = document.createElement('button');
        btn.className = `whitespace-nowrap flex-shrink-0 ${activeClass}`;
        btn.innerHTML = `${cat.label} (${count})`;
        btn.onclick = () => renderMasterList(cat.value);
        tabsContainer.appendChild(btn);
    });

    // 2. Filter Jobs for Grid
    let filteredJobs = [];
    if (filterStatus === 'All') {
        filteredJobs = unarchivedJobs;
    } else {
        filteredJobs = unarchivedJobs.filter(job => job.status === filterStatus);
    }
    
    if (filteredJobs.length === 0) {
        gridContainer.innerHTML = '<div class="col-span-full text-center py-12 text-slate-500 dark:text-slate-400">No applications found in this category.</div>';
        return;
    }

    // 3. Render Cards
    const columnsDef = [
        { id: 'wishlist', title: 'Wishlist', color: 'slate' },
        { id: 'applied', title: 'Applied', color: 'blue' },
        { id: 'assessment', title: 'Assessment (OA)', color: 'purple' },
        { id: 'interview', title: 'Interview', color: 'amber' },
        { id: 'selected', title: 'Selected / Offer', color: 'emerald' },
        { id: 'rejected', title: 'Rejected', color: 'rose' }
    ];

    let gridHTML = '';

    filteredJobs.forEach(job => {
        const colDef = columnsDef.find(c => c.id === job.status) || { title: job.status, color: 'slate' };
        const logoChar = job.company.charAt(0).toUpperCase();

        const badgeBg = `bg-${colDef.color}-100 dark:bg-${colDef.color}-900/30`;
        const badgeText = `text-${colDef.color}-700 dark:text-${colDef.color}-400`;
        
        let appliedDateStr = 'N/A';
        if (job.appliedDate) {
            const d = new Date(job.appliedDate);
            appliedDateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }

        gridHTML += `
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl hover:-translate-y-1 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-center gap-3">
                            <div class="bg-slate-100 dark:bg-slate-800 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-slate-500 dark:text-slate-400 shrink-0">
                                ${logoChar}
                            </div>
                            <span class="text-slate-800 dark:text-white font-semibold">${job.company}</span>
                        </div>
                        <span class="px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider ${badgeBg} ${badgeText}">
                            ${colDef.title}
                        </span>
                    </div>
                    <h3 class="text-lg font-bold mt-3 mb-1 text-slate-900 dark:text-white line-clamp-1">${job.role}</h3>
                    <div class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-3 mt-2">
                        ${job.package ? `<span><i class="fa-solid fa-indian-rupee-sign mr-1"></i> ${job.package} LPA</span>` : ''}
                        ${job.package && job.eligibility ? `<span class="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>` : ''}
                        ${job.eligibility ? `<span class="line-clamp-1"><i class="fa-solid fa-graduation-cap mr-1"></i> ${job.eligibility}</span>` : ''}
                    </div>
                </div>
                <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <i class="fa-regular fa-calendar"></i> ${appliedDateStr}
                    </span>
                    <button onclick="openJobDetails('${job.id}')" class="px-4 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-sm font-medium rounded-lg transition-colors text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm">
                        View Details
                    </button>
                </div>
            </div>
        `;
    });

    gridContainer.innerHTML = gridHTML;
};

window.studentApplyNow = (jobId) => {
    const job = placements.find(p => String(p.id) === String(jobId));
    if (!job) return;

    if (job.link) {
        window.open(job.link, '_blank', 'noopener,noreferrer');
    }

    job.status = 'applied';
    job.appliedDate = new Date().toISOString().split('T')[0];
    job.statusUpdatedAt = new Date().toISOString();

    saveUserPlacementsData(placements);
    renderPlacements();
    renderStats();
    renderChart();
    renderUpcomingJobs();
    checkUpcomingReminders();

    if (window.showToast) {
        window.showToast(`Applied for ${job.company}! Moved to Applied stage.`, 'success');
    }
};

window.updateJobStatusFromList = (jobId, newStatus) => {
    const job = placements.find(p => String(p.id) === String(jobId));
    if (job) {
        job.status = newStatus;
        if (newStatus === 'applied' && !job.appliedDate) {
            job.appliedDate = new Date().toISOString().split('T')[0];
        }
        job.statusUpdatedAt = new Date().toISOString();
        saveUserPlacementsData(placements);
        renderMasterList('All');
        renderPlacements();
        renderStats();
        renderChart();
        if(window.showToast) window.showToast(`Status updated to ${newStatus}`, 'success');
    }
};

window.drop = (event, newStatus) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text");
    if (!id) return;

    // Find the placement and update its status
    const placementIndex = placements.findIndex(p => String(p.id) === String(id));
    if (placementIndex !== -1 && placements[placementIndex].status !== newStatus) {
        placements[placementIndex].status = newStatus;
        if (newStatus === 'applied' && !placements[placementIndex].appliedDate) {
            placements[placementIndex].appliedDate = new Date().toISOString().split('T')[0];
        }
        placements[placementIndex].statusUpdatedAt = new Date().toISOString();
        saveUserPlacementsData(placements);
        renderPlacements();
        renderStats();
        renderChart();
        renderUpcomingJobs();
        checkUpcomingReminders();
        
        if (newStatus === 'selected') {
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    spread: 80,
                    origin: { y: 0.6 },
                    colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
                });
            }
            if(window.showToast) window.showToast("Offer Celebration!", "success");
        } else {
            if(window.showToast) window.showToast("Application status updated", "success");
        }
    }
};

// --- Toast Notification System ---
window.showToast = (message, type = 'success') => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    
    const toast = document.createElement('div');
    const isError = type === 'error';
    const bgColor = isError ? 'bg-rose-100 dark:bg-rose-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30';
    const textColor = isError ? 'text-rose-700 dark:text-rose-400' : 'text-emerald-700 dark:text-emerald-400';
    const borderColor = isError ? 'border-rose-200 dark:border-rose-800' : 'border-emerald-200 dark:border-emerald-800';
    const icon = isError ? 'fa-circle-xmark' : 'fa-circle-check';
    
    toast.className = `flex items-center gap-3 px-4 py-3 rounded-lg border ${borderColor} ${bgColor} ${textColor} shadow-lg transform transition-all duration-300 translate-x-full opacity-0 backdrop-blur-md font-medium text-sm`;
    
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);
    
    // Animate out and remove
    setTimeout(() => {
        toast.classList.remove('translate-x-0', 'opacity-100');
        toast.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if(toast.parentNode) toast.parentNode.removeChild(toast);
        }, 300);
    }, 3000);
};

// --- Chart.js Integration ---
let funnelChartInstance = null;

const getChartData = () => {
    // Expected funnel order: Applied -> Assessment -> Interview -> Selected
    // Note: We might also want to show Rejected or Wishlist, but for a true funnel we usually track progression.
    // Based on user request: Wishlist, Applied, Assessment, Interview, Selected, and Rejected.
    
    const counts = {
        wishlist: 0,
        applied: 0,
        assessment: 0,
        interview: 0
    };
    
    placements.forEach(p => {
        if (!p.isArchived && counts[p.status] !== undefined) {
            counts[p.status]++;
        }
    });
    
    return [
        counts.wishlist, 
        counts.applied, 
        counts.assessment, 
        counts.interview
    ];
};

const renderChart = () => {
    const ctx = document.getElementById('placementFunnelChart');
    if (!ctx) return;
    
    if (funnelChartInstance) {
        funnelChartInstance.destroy();
    }
    
    const data = getChartData();
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#475569';
    
    // Tailwind Colors: Blue, Cyan, Purple, Amber
    const backgroundColors = [
        '#3b82f6', // Blue-500
        '#06b6d4', // Cyan-500
        '#a855f7', // Purple-500
        '#f59e0b'  // Amber-500
    ];
    
    funnelChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Available', 'Applied', 'Assessment', 'Interview'],
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: isDark ? 2 : 0,
                borderColor: isDark ? '#18181b' : '#ffffff',
                hoverOffset: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: textColor,
                        font: {
                            family: "'Inter', sans-serif",
                            size: 11
                        },
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
                tooltip: {
                    backgroundColor: isDark ? 'rgba(24, 24, 27, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    titleColor: isDark ? '#f8fafc' : '#0f172a',
                    bodyColor: isDark ? '#cbd5e1' : '#475569',
                    borderColor: isDark ? '#27272a' : '#e2e8f0',
                    borderWidth: 1,
                    padding: 10,
                    boxPadding: 4,
                    usePointStyle: true,
                    bodyFont: {
                        family: "'Inter', sans-serif"
                    }
                }
            }
        }
    });
};

// --- Upcoming Widgets Logic ---
const renderUpcomingJobs = () => {
    const listContainer = document.getElementById('upcoming-jobs-list');
    if (!listContainer) return;
    
    // Filter active pipeline jobs
    let activeJobs = placements.filter(p => !p.isArchived && p.deadline);
    
    // Sort by deadline (closest first)
    activeJobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    // Take top 3
    activeJobs = activeJobs.slice(0, 3);
    
    if (activeJobs.length === 0) {
        listContainer.innerHTML = `<div class="sm:col-span-3 p-6 text-center text-xs text-neutral-400 dark:text-neutral-500 bg-surface-primary rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 italic">No upcoming deadlines or milestones scheduled</div>`;
        return;
    }
    
    listContainer.innerHTML = '';
    
    const colors = [
        { bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20', badge: 'text-blue-500' },
        { bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20', badge: 'text-purple-500' },
        { bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20', badge: 'text-amber-500' }
    ];
    
    activeJobs.forEach((job, index) => {
        const dateObj = new Date(job.deadline);
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
        const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
        const c = colors[index % colors.length];
        
        const statusLabels = { wishlist: 'Available', applied: 'Applied', assessment: 'OA Round', interview: 'Interview' };
        
        listContainer.innerHTML += `
            <div onclick="openJobDetails('${job.id}')" class="flex items-center gap-3 p-3.5 rounded-xl bg-surface-primary border border-neutral-200/80 dark:border-neutral-800/80 hover:border-blue-500/40 hover:shadow-md transition-all cursor-pointer group">
                <div class="w-11 h-11 rounded-xl ${c.bg} flex flex-col items-center justify-center shrink-0 border shadow-xs">
                    <span class="text-[9px] font-bold uppercase leading-none font-mono">${month}</span>
                    <span class="text-base font-black leading-none mt-0.5 font-mono">${day}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1">
                        <h4 class="font-bold text-neutral-900 dark:text-white text-xs truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">${job.company}</h4>
                        <span class="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-surface-secondary text-neutral-500">${statusLabels[job.status] || 'Active'}</span>
                    </div>
                    <p class="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">${job.role}</p>
                </div>
            </div>
        `;
    });
};

window.openJobDetails = (id) => {
    const job = placements.find(p => p.id === id);
    if (!job) return;
    
    document.getElementById('view-job-logo').innerText = job.company.charAt(0).toUpperCase();
    document.getElementById('view-job-company').innerText = job.company;
    document.getElementById('view-job-role').innerText = job.role;
    
    // Location and Eligibility
    const locBadge = document.getElementById('view-job-location-badge');
    const locText = document.getElementById('view-job-location');
    if (job.location) {
        locText.innerText = job.location;
        locBadge.classList.remove('hidden');
    } else {
        locBadge.classList.add('hidden');
    }
    
    const elBadge = document.getElementById('view-job-eligibility');
    if (job.eligibility) {
        elBadge.innerText = job.eligibility;
        elBadge.classList.remove('hidden');
    } else {
        elBadge.classList.add('hidden');
    }

    const dateFmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const applied = job.appliedDate || job.createdAt;
    document.getElementById('view-job-applied-date').innerText = applied ? dateFmt(applied) : 'N/A';
    
    const updated = job.statusUpdatedAt || job.createdAt;
    document.getElementById('view-job-updated-date').innerText = updated ? dateFmt(updated) : 'N/A';
    
    document.getElementById('view-job-deadline-date').innerText = job.deadline ? dateFmt(job.deadline) : 'No Deadline';

    document.getElementById('view-job-package').innerText = job.package ? `${job.package} LPA` : 'N/A';
    
    const notesEl = document.getElementById('view-job-notes');
    if (job.notes && job.notes.trim() !== '') {
        notesEl.innerText = job.notes;
        notesEl.classList.remove('text-text-muted', 'italic');
        notesEl.classList.add('text-text-primary');
    } else {
        notesEl.innerText = 'No notes provided.';
        notesEl.classList.add('text-text-muted', 'italic');
        notesEl.classList.remove('text-text-primary');
    }
    
    const linkContainer = document.getElementById('view-job-link-container');
    const linkEl = document.getElementById('view-job-link');
    if (job.link) {
        linkEl.href = job.link;
        linkContainer.classList.remove('hidden');
    } else {
        linkContainer.classList.add('hidden');
    }
    
    // Badges
    const statusColors = {
        wishlist: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
        applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
        assessment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
        interview: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
        selected: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
        rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
    };
    const statusLabels = { wishlist: 'Wishlist', applied: 'Applied', assessment: 'OA', interview: 'Interview', selected: 'Offer', rejected: 'Rejected' };
    
    const badgeHTML = `<span class="${statusColors[job.status] || statusColors.wishlist} px-2.5 py-1 rounded-md text-[0.7rem] font-bold uppercase tracking-wider">${statusLabels[job.status] || 'Unknown'}</span>`;
    document.getElementById('view-job-badges').innerHTML = badgeHTML;
    
    // Update Edit button
    const editBtn = document.getElementById('view-job-edit-btn');
    editBtn.onclick = () => {
        closeJobDetails();
        openEditModal(job.id);
    };
    
    // Show Modal
    document.getElementById('view-job-overlay').classList.add('active', 'opacity-100', 'pointer-events-auto');
    document.getElementById('view-job-overlay').classList.remove('opacity-0', 'pointer-events-none');
    
    const modal = document.getElementById('view-job-modal');
    modal.classList.add('opacity-100', 'pointer-events-auto', 'scale-100');
    modal.classList.remove('opacity-0', 'pointer-events-none', 'scale-95');
};

window.closeJobDetails = () => {
    const overlay = document.getElementById('view-job-overlay');
    if (overlay) {
        overlay.classList.remove('active', 'opacity-100', 'pointer-events-auto');
        overlay.classList.add('opacity-0', 'pointer-events-none');
    }
    const modal = document.getElementById('view-job-modal');
    if (modal) {
        modal.classList.remove('opacity-100', 'pointer-events-auto', 'scale-100');
        modal.classList.add('opacity-0', 'pointer-events-none', 'scale-95');
    }
};

const checkUpcomingReminders = () => {
    const bannerContainer = document.getElementById('reminder-banner-container');
    if (!bannerContainer) return;
    
    // Clear old banners and hide
    bannerContainer.innerHTML = '';
    bannerContainer.classList.add('hidden');
    
    // Request Notification permission if needed
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        try { Notification.requestPermission(); } catch {}
    }
    
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const activeJobs = placements.filter(p => p.status !== 'selected' && p.status !== 'rejected');
    
    const activeReminders = [];
    
    activeJobs.forEach(job => {
        let isToday = false;
        let isTomorrow = false;
        let eventType = '';
        
        if (job.interviewDate) {
            if (job.interviewDate === todayStr) { isToday = true; eventType = 'Interview/OA'; }
            if (job.interviewDate === tomorrowStr) { isTomorrow = true; eventType = 'Interview/OA'; }
        }
        if (job.deadline && !isToday && !isTomorrow) {
            if (job.deadline === todayStr) { isToday = true; eventType = 'Application Deadline'; }
            if (job.deadline === tomorrowStr) { isTomorrow = true; eventType = 'Application Deadline'; }
        }
        
        if (isToday || isTomorrow) {
            activeReminders.push({
                company: job.company,
                eventType,
                timeStr: isToday ? 'TODAY' : 'Tomorrow'
            });
        }
    });

    if (activeReminders.length === 0) {
        return;
    }
    
    // Show banner
    bannerContainer.classList.remove('hidden');

    if (activeReminders.length === 1) {
        const rem = activeReminders[0];
        bannerContainer.innerHTML = `
            <div class="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xl"></i>
                    <div>
                        <p class="text-[0.9rem] text-amber-800 dark:text-amber-200 font-medium"><strong>Reminder:</strong> You have an ${rem.eventType} for <span class="font-bold">${rem.company}</span> scheduled for ${rem.timeStr}!</p>
                    </div>
                </div>
            </div>
        `;
        if (Notification.permission === 'granted') {
            new Notification(`Upcoming ${rem.eventType}!`, { body: `Your ${rem.eventType.toLowerCase()} for ${rem.company} is scheduled for ${rem.timeStr.toLowerCase()}.` });
        }
    } else {
        let listHtml = '<ul class="list-disc pl-5 space-y-1 mt-1">';
        activeReminders.forEach(rem => {
            listHtml += `<li class="text-[0.9rem] text-amber-800 dark:text-amber-200"><strong>${rem.company}</strong>: ${rem.eventType} scheduled for ${rem.timeStr}</li>`;
            
            if (Notification.permission === 'granted') {
                new Notification(`Upcoming ${rem.eventType}!`, { body: `Your ${rem.eventType.toLowerCase()} for ${rem.company} is scheduled for ${rem.timeStr.toLowerCase()}.` });
            }
        });
        listHtml += '</ul>';

        bannerContainer.innerHTML = `
            <div class="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-sm flex items-start justify-between">
                <div class="flex items-start gap-3">
                    <i class="fa-solid fa-triangle-exclamation text-amber-500 text-xl mt-0.5"></i>
                    <div>
                        <p class="text-[0.9rem] text-amber-800 dark:text-amber-200 font-bold mb-1">You have ${activeReminders.length} upcoming events:</p>
                        ${listHtml}
                    </div>
                </div>
            </div>
        `;
    }
};

window.showConfirmModal = ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = true }) => {
    return new Promise((resolve) => {
        const modal = document.getElementById('custom-confirm-modal');
        const titleEl = document.getElementById('confirm-modal-title');
        const messageEl = document.getElementById('confirm-modal-message');
        const actionBtn = document.getElementById('confirm-action-btn');
        const cancelBtn = document.getElementById('confirm-cancel-btn');
        
        if(title) titleEl.innerText = title;
        if(message) messageEl.innerText = message;
        actionBtn.innerText = confirmText;
        cancelBtn.innerText = cancelText;
        
        if (isDangerous) {
            actionBtn.className = "flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-xl transition-colors shadow-lg shadow-red-500/20";
        } else {
            actionBtn.className = "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl transition-colors shadow-lg shadow-blue-500/20";
        }
        
        modal.classList.remove('hidden');
        
        const cleanup = () => {
            modal.classList.add('hidden');
            actionBtn.onclick = null;
            cancelBtn.onclick = null;
            modal.onclick = null;
        };
        
        actionBtn.onclick = () => {
            cleanup();
            resolve(true);
        };
        
        cancelBtn.onclick = () => {
            cleanup();
            resolve(false);
        };
        
        modal.onclick = (e) => {
            if (e.target === modal) {
                cleanup();
                resolve(false);
            }
        };
    });
};

window.toggleArchivePanel = (show) => {
    const panel = document.getElementById('archive-panel');
    if (show) {
        panel.classList.remove('hidden');
        renderArchivedJobs();
    } else {
        panel.classList.add('hidden');
    }
};

window.archivePlacement = (id) => {
    const placementIndex = placements.findIndex(p => p.id === id);
    if (placementIndex !== -1) {
        placements[placementIndex].isArchived = true;
        saveUserPlacementsData(placements);
        renderPlacements();
        renderStats();
        renderChart();
        renderUpcomingJobs();
        updateWeeklyTarget();
        checkUpcomingReminders();
        if(window.showToast) window.showToast('Application archived', 'success');
    }
};

window.unarchivePlacement = (id) => {
    const placementIndex = placements.findIndex(p => p.id === id);
    if (placementIndex !== -1) {
        placements[placementIndex].isArchived = false;
        saveUserPlacementsData(placements);
        renderPlacements();
        updateWeeklyTarget();
        renderArchivedJobs();
        if(window.showToast) window.showToast('Application restored', 'success');
    }
};

window.deletePlacement = (id) => {
    deleteApplication(id);
    renderArchivedJobs();
};

window.renderArchivedJobs = () => {
    const container = document.getElementById('archived-jobs-list');
    if (!container) return;
    
    const stored = loadUserPlacementsData();
    const archivedJobs = stored.filter(p => p.isArchived === true);
    
    if (archivedJobs.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 px-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <div class="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-3 text-neutral-400">
                    <i class="fa-solid fa-box-open text-lg"></i>
                </div>
                <p class="text-xs font-semibold text-neutral-800 dark:text-neutral-200">No Archived Applications</p>
                <p class="text-[11px] text-neutral-500 mt-0.5">When you archive an application, it will appear here with an instant option to restore.</p>
            </div>`;
        return;
    }
    
    container.innerHTML = archivedJobs.map(job => {
        const pkgBadge = job.package ? `<span class="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">₹ ${job.package} LPA</span>` : '';
        const locBadge = job.location ? `<span class="text-[10px] text-neutral-500 bg-surface-secondary border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded truncate max-w-[120px]">${job.location}</span>` : '';

        return `
            <div class="bg-surface-primary rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col overflow-hidden transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                <div class="p-4 space-y-2">
                    <div class="flex items-start justify-between gap-2">
                        <div class="flex items-start gap-2.5 min-w-0">
                            <div class="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-xs text-neutral-600 dark:text-neutral-300 shrink-0 border border-neutral-200 dark:border-neutral-700">
                                ${job.company.charAt(0).toUpperCase()}
                            </div>
                            <div class="min-w-0">
                                <h4 class="text-xs font-bold text-neutral-900 dark:text-white leading-tight truncate">${job.role}</h4>
                                <p class="text-[11px] text-neutral-500 font-medium truncate mt-0.5">${job.company}</p>
                            </div>
                        </div>
                    </div>

                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                        ${pkgBadge}
                        ${locBadge}
                    </div>
                </div>

                <div class="bg-surface-secondary/70 px-4 py-2.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-2">
                    <span class="text-[10px] font-mono text-neutral-400">Archived Record</span>
                    <div class="flex items-center gap-2">
                        <button onclick="unarchivePlacement('${job.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-all cursor-pointer">
                            <i class="fa-solid fa-arrow-rotate-left text-[10px]"></i>
                            <span>Unarchive / Restore</span>
                        </button>
                        <button onclick="deletePlacement('${job.id}')" class="p-1.5 text-xs text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors" title="Delete permanently">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
};

function updateWeeklyTarget() {
    // Read user-set target from localStorage, fallback to 10
    const WEEKLY_TARGET = parseInt(localStorage.getItem(getUserWeeklyTargetKey()) || '10', 10);

    // Calculate start of current week (Monday at 00:00:00)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Fetch placements and count applied this week (non-archived)
    const stored = loadUserPlacementsData();

    let appliedThisWeek = 0;
    stored.forEach(p => {
        if (!p.isArchived) {
            const appliedDate = new Date(p.appliedDate || p.createdAt);
            if (appliedDate >= startOfWeek) appliedThisWeek++;
        }
    });

    const percentage = Math.min((appliedThisWeek / WEEKLY_TARGET) * 100, 100);

    const progressBar = document.getElementById('weekly-progress-bar');
    const percentageText = document.getElementById('weekly-percentage-text');
    const countText = document.getElementById('weekly-count-text');

    if (progressBar) progressBar.style.width = `${percentage}%`;
    if (countText) {
        countText.innerText = `${appliedThisWeek} / ${WEEKLY_TARGET} Apps`;
    }

    // Dynamic tiered styling based on progress percentage
    if (progressBar && percentageText) {
        // Remove all tier classes first
        progressBar.className = 'h-2.5 rounded-full transition-all duration-700 ease-out';

        if (percentage === 0) {
            // No progress — neutral grey
            progressBar.style.background = 'linear-gradient(90deg, #94a3b8, #cbd5e1, #94a3b8)';
            percentageText.innerText = `No applications yet this week. Start strong!`;
            percentageText.className = 'text-xs text-slate-400 dark:text-slate-500 mt-1 font-medium';
            countText.className = 'text-xs font-bold text-slate-400 dark:text-slate-500';
        } else if (percentage < 30) {
            // Early stage (1–29%) — amber "warming up"
            progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d, #fbbf24, #f59e0b)';
            percentageText.innerText = `${Math.round(percentage)}% — Just getting started. Keep the momentum!`;
            percentageText.className = 'text-xs text-amber-500 dark:text-amber-400 mt-1 font-medium';
            countText.className = 'text-xs font-bold text-amber-500 dark:text-amber-400';
        } else if (percentage < 70) {
            // Mid-range (30–69%) — blue "in the zone"
            progressBar.style.background = 'linear-gradient(90deg, #2563eb, #3b82f6, #60a5fa, #3b82f6, #2563eb)';
            percentageText.innerText = `${Math.round(percentage)}% — In the zone. Keep going!`;
            percentageText.className = 'text-xs text-blue-500 dark:text-blue-400 mt-1 font-medium';
            countText.className = 'text-xs font-bold text-blue-600 dark:text-blue-400';
        } else if (percentage < 100) {
            // Almost there (70–99%) — violet "almost there!"
            progressBar.style.background = 'linear-gradient(90deg, #6d28d9, #7c3aed, #a78bfa, #8b5cf6, #6d28d9)';
            percentageText.innerText = `${Math.round(percentage)}% — So close! Final push!`;
            percentageText.className = 'text-xs text-violet-500 dark:text-violet-400 mt-1 font-medium';
            countText.className = 'text-xs font-bold text-violet-600 dark:text-violet-400';
        } else {
            // 100%+ — emerald "goal crushed!"
            progressBar.style.background = 'linear-gradient(90deg, #059669, #10b981, #34d399, #10b981, #059669)';
            percentageText.innerText = `Weekly goal crushed! You're unstoppable!`;
            percentageText.className = 'text-xs text-emerald-500 dark:text-emerald-400 mt-1 font-semibold';
            countText.className = 'text-xs font-bold text-emerald-500 dark:text-emerald-400';
        }
    }
}
window.updateWeeklyTarget = updateWeeklyTarget;

window.openWeeklyInfoModal = () => {
    document.getElementById('weekly-info-modal').classList.remove('hidden');
};

window.scrollKanban = (direction) => {
    const container = document.getElementById('kanban-scroll-container');
    if (!container) return;
    // ~280px column + 24px gap = ~304px per step
    const SCROLL_AMOUNT = 310;
    container.scrollBy({ left: direction === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT, behavior: 'smooth' });
};

window.closeWeeklyInfoModal = () => {
    document.getElementById('weekly-info-modal').classList.add('hidden');
};

window.openTargetEditor = () => {
    const editor = document.getElementById('weekly-target-editor');
    const input = document.getElementById('weekly-target-input');
    const savedTarget = localStorage.getItem(getUserWeeklyTargetKey()) || '10';
    input.value = savedTarget;
    editor.classList.remove('hidden');
    input.focus();
};

window.closeTargetEditor = () => {
    document.getElementById('weekly-target-editor').classList.add('hidden');
};

window.saveWeeklyTarget = () => {
    const input = document.getElementById('weekly-target-input');
    const val = parseInt(input.value, 10);
    if (!val || val < 1 || val > 100) {
        if(window.showToast) window.showToast('Please enter a target between 1 and 100.', 'error');
        return;
    }
    localStorage.setItem(getUserWeeklyTargetKey(), val.toString());
    closeTargetEditor();
    updateWeeklyTarget();
    if(window.showToast) window.showToast(`Weekly target set to ${val} apps!`, 'success');
};

// Start
initApp();
if (window.updateWeeklyTarget) window.updateWeeklyTarget();

// ============================================================
//  KANBAN AUTO-SCROLL ENGINE  (simple & clean)
//  - Starts automatically on page load
//  - Pauses when mouse/touch enters the board
//  - Resumes when mouse/touch leaves the board
//  - Wraps back to start when it reaches the end
// ============================================================

let kanbanAutoScrollTimer = null;

/**
 * startKanbanAutoScroll()
 * Begins (or resumes) the auto-scroll interval.
 * Every 2.5s it advances one column to the right,
 * or wraps back to the start if already at the far right.
 */
window.startKanbanAutoScroll = () => {
    // Prevent stacking multiple intervals if called repeatedly
    if (kanbanAutoScrollTimer) clearInterval(kanbanAutoScrollTimer);

    kanbanAutoScrollTimer = setInterval(() => {
        const container = document.getElementById('kanban-scroll-container');
        if (!container) return;

        // Math.ceil handles sub-pixel fractional values that cause browsers to
        // report scrollLeft as e.g. 1279.6 instead of a clean integer.
        // The -20px buffer gives a safe landing zone before the true scroll end,
        // guaranteeing the wrap fires before any browser rendering oddity can
        // prevent it (e.g. snap inertia still settling after the last column).
        const isAtEnd = Math.ceil(container.scrollLeft + container.clientWidth) >= (container.scrollWidth - 20);

        if (isAtEnd) {
            // Smoothly glide back to Wishlist (column 1) to begin the loop again.
            // The setInterval keeps running — 2.5s after this fires, it will
            // detect scrollLeft === 0 and start advancing right again automatically.
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            // Advance exactly one column (w-80 = 320px) + one gap (24px) = 344px.
            // CSS snap-mandatory ensures it lands cleanly on the next column boundary.
            container.scrollBy({ left: 344, behavior: 'smooth' });
        }
    }, 2500);
};

/**
 * stopKanbanAutoScroll()
 * Immediately halts the auto-scroll interval.
 * Called on mouseenter / touchstart — user is in control.
 */
window.stopKanbanAutoScroll = () => {
    clearInterval(kanbanAutoScrollTimer);
    kanbanAutoScrollTimer = null;
};

// Kick off as soon as the script runs (page is already loaded at this point)
if (window.startKanbanAutoScroll) {
    window.startKanbanAutoScroll();
}
