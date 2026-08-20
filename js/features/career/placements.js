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

let placements = (function() {
  const storedStr = localStorage.getItem('techprep_placements');
  if (storedStr === null) {
    localStorage.setItem('techprep_placements', JSON.stringify(DEFAULT_DRIVES_SEED));
    return [...DEFAULT_DRIVES_SEED];
  }
  try {
    const parsed = JSON.parse(storedStr);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
})();

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
        weeklyTarget: localStorage.getItem('techprep_weekly_target') || '10'
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
            localStorage.setItem('techprep_placements', JSON.stringify(placements));
            if (data.weeklyTarget) {
                localStorage.setItem('techprep_weekly_target', data.weeklyTarget);
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
    
    const columns = [
        { id: 'wishlist', title: 'Wishlist', color: 'slate', icon: 'fa-star' },
        { id: 'applied', title: 'Applied', color: 'blue', icon: 'fa-paper-plane' },
        { id: 'assessment', title: 'Assessment (OA)', color: 'purple', icon: 'fa-laptop-code' },
        { id: 'interview', title: 'Interview', color: 'amber', icon: 'fa-comments' },
        { id: 'selected', title: 'Selected / Offer', color: 'emerald', icon: 'fa-check-circle' },
        { id: 'rejected', title: 'Rejected', color: 'rose', icon: 'fa-times-circle' }
    ];

    columns.forEach(col => {
        const colTasks = placements.filter(p => p.status === col.id && !p.isArchived);
        
        // Define color classes based on the tailwind color palette
        const headerBgColor = `bg-${col.color}-100 dark:bg-${col.color}-900/30`;
        const headerTextColor = `text-${col.color}-700 dark:text-${col.color}-400`;
        const borderColor = `border-${col.color}-200 dark:border-${col.color}-800`;
        
        const colEl = document.createElement('div');
        // No fixed min-height — column grows only as tall as its content area (max-h controlled inside)
        colEl.className = `kanban-column w-80 shrink-0 snap-start flex flex-col gap-3 rounded-xl border ${borderColor} bg-bg-secondary/50 p-3`;
        colEl.setAttribute('ondragover', 'allowDrop(event)');
        colEl.setAttribute('ondrop', `drop(event, '${col.id}')`);
        
        colEl.innerHTML = `
            <div class="column-header flex justify-between items-center px-3 py-2 rounded-lg ${headerBgColor} ${headerTextColor} font-semibold text-sm">
                <div class="flex items-center gap-2">
                    <i class="fa-solid ${col.icon}"></i> ${col.title}
                </div>
                <span class="badge bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full text-xs">${colTasks.length}</span>
            </div>
            <div class="column-content relative flex flex-col gap-3 max-h-[420px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] pb-2">
                ${colTasks.length === 0 ? `<div class="text-center text-text-muted text-sm py-4 italic">No applications</div>` : ''}
            </div>
        `;
        
        const contentEl = colEl.querySelector('.column-content');
        
        colTasks.forEach(app => {
            const card = document.createElement('div');
            card.className = "job-card bg-bg-elevated p-4 rounded-xl border border-border shadow-sm flex flex-col gap-2 cursor-grab active:cursor-grabbing hover:border-blue-300 dark:hover:border-blue-500/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 ease-out relative group";
            card.setAttribute('draggable', 'true');
            card.setAttribute('ondragstart', 'drag(event)');
            card.setAttribute('ondragend', 'dragEnd(event)');
            card.setAttribute('data-id', app.id);
            
            const packageBadge = app.package ? `<span class="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold px-2 py-1 rounded-md"><i class="fa-solid fa-indian-rupee-sign text-[0.6rem]"></i> ${app.package} LPA</span>` : '';
            const locationBadge = app.location ? `<span class="bg-slate-100 dark:bg-slate-800/50 text-[0.65rem] text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/50 flex items-center gap-1"><i class="fa-solid fa-map-marker-alt"></i> ${app.location}</span>` : '';
            const eligibilityBadge = app.eligibility ? `<span class="bg-slate-100 dark:bg-slate-800/50 text-[0.65rem] text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700/50">${app.eligibility}</span>` : '';
            const linkBtn = app.link ? `<a href="${app.link}" target="_blank" rel="noopener noreferrer" class="text-text-muted hover:text-accent-primary transition-colors p-1" title="Open Career Portal"><i class="fa-solid fa-external-link-alt text-[0.8rem]"></i></a>` : '';
            
            let appliedStr = 'Not Applied';
            const dateFmt = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            
            const applied = app.appliedDate;
            if (applied) {
                appliedStr = `Applied: ${dateFmt(applied)}`;
            } else if (app.deadline) {
                appliedStr = `Deadline: ${dateFmt(app.deadline)}`;
            }

            const interviewBadge = app.interviewDate ? `<span class="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[0.7rem] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-200 dark:border-amber-800/50"><i class="fa-regular fa-calendar-check"></i> Int: ${dateFmt(app.interviewDate)}</span>` : '';

            const noteIcon = app.notes && app.notes.trim() !== '' ? `<span class="text-accent-primary ml-1" title="Has Notes"><i class="fa-solid fa-file-alt"></i></span>` : '';

            const statusColors = {
                wishlist: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
                applied: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
                assessment: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
                interview: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
                selected: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
                rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400'
            };
            const statusLabels = {
                wishlist: 'Opportunity', applied: 'Applied', assessment: 'OA Round', interview: 'Interview', selected: 'Offer', rejected: 'Rejected'
            };
            
            const statusBadge = `<span class="${statusColors[app.status] || statusColors.wishlist} px-2 py-0.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider">${statusLabels[app.status] || 'Unknown'}</span>`;

            card.innerHTML = `
                <div class="flex items-start gap-3 relative">
                    <div class="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                        <span class="text-sm font-bold text-slate-400 dark:text-slate-500">${app.company.charAt(0).toUpperCase()}</span>
                    </div>
                    
                    <div class="flex-1 min-w-0 pr-6">
                        <h4 class="font-bold text-text-primary text-[0.95rem] leading-tight truncate">${app.role}</h4>
                        <p class="text-[0.8rem] text-text-secondary truncate mt-0.5">${app.company}</p>
                        
                        <div class="flex flex-wrap items-center gap-2 mt-2">
                            ${statusBadge}
                            ${packageBadge}
                        </div>
                        <div class="flex flex-wrap items-center gap-1.5 mt-2">
                            ${locationBadge}
                            ${eligibilityBadge}
                        </div>
                        <div class="mt-2">
                            ${interviewBadge}
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 top-0 bg-bg-elevated pl-1 rounded-l-md">
                        <button class="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 transition-all duration-200 ease-out hover:scale-110 active:scale-95 text-[0.8rem]" onclick="archivePlacement('${app.id}')" title="Archive">
                            <i class="fa-solid fa-archive"></i>
                        </button>
                        <button class="w-6 h-6 flex items-center justify-center rounded text-text-muted hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-danger transition-all duration-200 ease-out hover:scale-110 active:scale-95 text-[0.8rem]" onclick="deleteApplication('${app.id}')" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                    <div class="flex items-center gap-2">
                        <span class="text-[0.75rem] text-text-muted flex items-center gap-1.5"><i class="fa-regular fa-clock"></i> ${appliedStr} ${noteIcon}</span>
                    </div>
                    <div class="flex items-center gap-2">
                        ${app.status === 'wishlist' ? `
                            <button onclick="event.stopPropagation(); studentApplyNow('${app.id}')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-sm transition-all hover:scale-105 active:scale-95" title="Apply to this company">
                                <i class="fa-solid fa-paper-plane text-[9px]"></i> Apply Now
                            </button>
                        ` : ''}
                        ${linkBtn}
                    </div>
                </div>

                <!-- Drag Hint Pill -->
                <div class="drag-hint-pill">
                    <span class="inline-flex items-center gap-1.5 bg-slate-800/80 dark:bg-white/10 backdrop-blur-sm text-white dark:text-slate-200 text-[0.6rem] font-semibold px-2.5 py-1 rounded-full shadow-lg border border-white/10">
                        <i class="fa-solid fa-grip-dots-vertical text-slate-400"></i> Drag to move stage
                    </span>
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
    
    const totalApplied = placements.filter(p => p.status !== 'wishlist').length;
    const pendingOA = placements.filter(p => p.status === 'assessment').length;
    const activeInterviews = placements.filter(p => p.status === 'interview').length;
    const offers = placements.filter(p => p.status === 'selected').length;
    
    summaryStats.innerHTML = `
        <div class="stat-card bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-slate-800/50 relative overflow-hidden group">
            <i class="fa-solid fa-paper-plane absolute top-4 right-4 text-4xl text-blue-500/10 dark:text-blue-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-sm text-text-secondary font-medium mb-1">Total Applied</p>
            <h3 class="text-4xl font-black text-text-primary mb-2">${totalApplied}</h3>
            <span class="text-xs text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full"><i class="fa-solid fa-arrow-trend-up mr-1"></i>+3 this week</span>
        </div>
        <div class="stat-card bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-slate-800/50 relative overflow-hidden group">
            <i class="fa-solid fa-laptop-code absolute top-4 right-4 text-4xl text-purple-500/10 dark:text-purple-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-sm text-text-secondary font-medium mb-1">Pending OAs</p>
            <h3 class="text-4xl font-black text-text-primary mb-2">${pendingOA}</h3>
            <span class="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Needs attention</span>
        </div>
        <div class="stat-card bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-slate-800/50 relative overflow-hidden group">
            <i class="fa-solid fa-comments absolute top-4 right-4 text-4xl text-amber-500/10 dark:text-amber-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-sm text-text-secondary font-medium mb-1">Active Interviews</p>
            <h3 class="text-4xl font-black text-text-primary mb-2">${activeInterviews}</h3>
            <span class="text-xs text-emerald-500 font-medium bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full"><i class="fa-solid fa-arrow-trend-up mr-1"></i>+1 this week</span>
        </div>
        <div class="stat-card bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-slate-800/50 relative overflow-hidden group">
            <i class="fa-solid fa-trophy absolute top-4 right-4 text-4xl text-emerald-500/10 dark:text-emerald-400/10 group-hover:scale-110 transition-transform"></i>
            <p class="text-sm text-text-secondary font-medium mb-1">Offers</p>
            <h3 class="text-4xl font-black text-text-primary mb-2">${offers}</h3>
            <span class="text-xs text-slate-500 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Target: 3</span>
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
        
        localStorage.setItem('techprep_placements', JSON.stringify(placements));
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
        localStorage.setItem('techprep_placements', JSON.stringify(placements));
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

    localStorage.setItem('techprep_placements', JSON.stringify(placements));
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
        localStorage.setItem('techprep_placements', JSON.stringify(placements));
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
        localStorage.setItem('techprep_placements', JSON.stringify(placements));
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
            if(window.showToast) window.showToast("Offer Celebration! 🥳", "success");
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
        interview: 0,
        selected: 0,
        rejected: 0
    };
    
    placements.forEach(p => {
        if(counts[p.status] !== undefined) {
            counts[p.status]++;
        }
    });
    
    return [
        counts.wishlist, 
        counts.applied, 
        counts.assessment, 
        counts.interview, 
        counts.selected, 
        counts.rejected
    ];
};

const renderChart = () => {
    const ctx = document.getElementById('placementFunnelChart');
    if (!ctx) return;
    
    if (funnelChartInstance) {
        funnelChartInstance.destroy();
    }
    
    const data = getChartData();
    const isDark = document.body.classList.contains('dark-theme');
    const textColor = isDark ? 'rgba(255,255,255,0.7)' : '#475569';
    
    // Tailwind Colors (Slate, Blue, Purple, Amber, Emerald, Rose)
    const backgroundColors = [
        '#94a3b8', // Slate-400
        '#3b82f6', // Blue-500
        '#a855f7', // Purple-500
        '#f59e0b', // Amber-500
        '#10b981', // Emerald-500
        '#f43f5e'  // Rose-500
    ];
    
    funnelChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Wishlist', 'Applied', 'Assessment', 'Interview', 'Selected', 'Rejected'],
            datasets: [{
                data: data,
                backgroundColor: backgroundColors,
                borderWidth: isDark ? 2 : 0,
                borderColor: isDark ? '#0f172a' : '#ffffff', // slate-900 or white
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
                    backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    titleColor: isDark ? '#f8fafc' : '#0f172a',
                    bodyColor: isDark ? '#cbd5e1' : '#475569',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
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
    let activeJobs = placements.filter(p => p.status !== 'selected' && p.status !== 'rejected' && p.deadline);
    
    // Sort by deadline (closest first)
    activeJobs.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    // Take top 3
    activeJobs = activeJobs.slice(0, 3);
    
    if (activeJobs.length === 0) {
        listContainer.innerHTML = `<div class="p-4 text-center text-sm text-text-muted bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">No upcoming milestones right now</div>`;
        return;
    }
    
    listContainer.innerHTML = '';
    
    const colors = [
        { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800/50' },
        { bg: 'bg-purple-100 dark:bg-purple-900/40', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800/50' },
        { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800/50' }
    ];
    
    activeJobs.forEach((job, index) => {
        const dateObj = new Date(job.deadline);
        const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
        const day = dateObj.toLocaleDateString('en-US', { day: 'numeric' });
        const c = colors[index % colors.length];
        
        // Map status for friendly text
        const statusLabels = { wishlist: 'Wishlist', applied: 'Applied', assessment: 'Online Assessment (OA)', interview: 'Interview' };
        
        listContainer.innerHTML += `
            <div onclick="openJobDetails('${job.id}')" class="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700">
                <div class="w-12 h-12 rounded-xl ${c.bg} ${c.text} flex flex-col items-center justify-center shrink-0 border ${c.border} shadow-inner">
                    <span class="text-[0.6rem] font-bold uppercase leading-none mb-1">${month}</span>
                    <span class="text-lg font-black leading-none">${day}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-text-primary text-sm truncate">${job.company}</h4>
                    <p class="text-xs text-text-secondary truncate">${statusLabels[job.status] || job.role}</p>
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
    if (Notification.permission === 'default') {
        Notification.requestPermission();
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
        localStorage.setItem('techprep_placements', JSON.stringify(placements));
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
        localStorage.setItem('techprep_placements', JSON.stringify(placements));
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
    
    // Fetch placements from LocalStorage directly as requested, though we already have it in memory
    const stored = JSON.parse(localStorage.getItem('techprep_placements')) || placements;
    const archivedJobs = stored.filter(p => p.isArchived === true);
    
    if (archivedJobs.length === 0) {
        container.innerHTML = `<div class="text-center text-text-muted text-sm py-10 italic">No archived applications.</div>`;
        return;
    }
    
    container.innerHTML = archivedJobs.map(job => {
        return `
            <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden mb-4 transition-all">
                <div class="p-4">
                    <h4 class="text-md font-semibold text-slate-800 dark:text-white">${job.role}</h4>
                    <p class="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1"><i class="fa-regular fa-building"></i> ${job.company}</p>
                </div>
                <div class="bg-slate-50 dark:bg-slate-900/50 px-4 py-3 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                    <button onclick="unarchivePlacement('${job.id}')" class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 rounded-lg transition-colors"><i class="fa-solid fa-undo"></i> Restore</button>
                    <button onclick="deletePlacement('${job.id}')" class="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 rounded-lg transition-colors"><i class="fa-solid fa-trash"></i> Delete</button>
                </div>
            </div>
        `;
    }).join('');
};

window.updateWeeklyTarget = () => {
    // Read user-set target from localStorage, fallback to 10
    const WEEKLY_TARGET = parseInt(localStorage.getItem('techprep_weekly_target') || '10', 10);

    // Calculate start of current week (Monday at 00:00:00)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Fetch placements and count applied this week (non-archived)
    const storedStr = localStorage.getItem('techprep_placements');
    const stored = storedStr ? JSON.parse(storedStr) : placements;

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
            percentageText.innerText = `${Math.round(percentage)}% — So close! Final push! 💪`;
            percentageText.className = 'text-xs text-violet-500 dark:text-violet-400 mt-1 font-medium';
            countText.className = 'text-xs font-bold text-violet-600 dark:text-violet-400';
        } else {
            // 100%+ — emerald "goal crushed!"
            progressBar.style.background = 'linear-gradient(90deg, #059669, #10b981, #34d399, #10b981, #059669)';
            percentageText.innerText = `🎉 Weekly goal crushed! You're unstoppable!`;
            percentageText.className = 'text-xs text-emerald-500 dark:text-emerald-400 mt-1 font-semibold';
            countText.className = 'text-xs font-bold text-emerald-500 dark:text-emerald-400';
        }
    }
};

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
    const savedTarget = localStorage.getItem('techprep_weekly_target') || '10';
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
    localStorage.setItem('techprep_weekly_target', val.toString());
    closeTargetEditor();
    updateWeeklyTarget();
    if(window.showToast) window.showToast(`Weekly target set to ${val} apps!`, 'success');
};

// Start
initApp();
updateWeeklyTarget();

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
startKanbanAutoScroll();


