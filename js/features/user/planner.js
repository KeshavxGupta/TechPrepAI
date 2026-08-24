// --- State Management ---
let notes = JSON.parse(localStorage.getItem('techprep_notes')) || [];
let tasks = JSON.parse(localStorage.getItem('techprep_tasks')) || [];
let plannerTasks = JSON.parse(localStorage.getItem('techprep_planner_tasks')) || [];

// --- DOM Elements ---
// Notes Elements
const notesContainer = document.getElementById('notes-container');
const addNoteBtn = document.getElementById('add-note-btn');
const noteModal = document.getElementById('note-modal');
const saveNoteBtn = document.getElementById('save-note-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Task Elements
const tasksContainer = document.getElementById('tasks-container');
const addTaskBtn = document.getElementById('add-task-btn');
const taskModal = document.getElementById('task-modal');
const saveTaskBtn = document.getElementById('save-task-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');

// Global Search & Theme
const globalSearch = document.getElementById('global-search');
const themeToggle = document.getElementById('theme-toggle');

// Sidebar toggle (guarded)
const menuToggle = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');

if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
}

// Modals
const closeBtns = document.querySelectorAll('.close-btn');

// Drawer
const drawerOverlay = document.getElementById('drawer-overlay');
const noteDrawer = document.getElementById('note-drawer');
const closeDrawerBtn = document.getElementById('close-drawer-btn');
const drawerTitle = document.getElementById('drawer-title');
const drawerContent = document.getElementById('drawer-content');

// Current State variables
let currentNoteFilter = 'all';
let currentTaskTab = 'daily';
let currentEditingNoteId = null;

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

    renderNotes();
    renderTasks();
    updateProgress();
    renderHeatmap();
};

// --- Theme Toggle (guarded) ---
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
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('active', 'opacity-100', 'pointer-events-auto');
    modal.classList.remove('opacity-0', 'pointer-events-none');
    const card = modal.querySelector('.modal-card');
    if (card) {
        card.classList.add('scale-100');
        card.classList.remove('scale-95');
    }
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('active', 'opacity-100', 'pointer-events-auto');
    modal.classList.add('opacity-0', 'pointer-events-none');
    const card = modal.querySelector('.modal-card');
    if (card) {
        card.classList.remove('scale-100');
        card.classList.add('scale-95');
    }
    
    // Reset forms
    if (modalId === 'note-modal') {
        const titleEl = document.getElementById('note-title');
        if (titleEl) titleEl.value = '';
        const edEl = document.getElementById('note-editor');
        if (edEl) edEl.innerHTML = '';
        const catEl = document.getElementById('note-category');
        if (catEl) catEl.value = 'dsa';
        const colEl = document.getElementById('note-color');
        if (colEl) colEl.value = '#4f46e5';
        
        const activeRecallToggle = document.getElementById('note-active-recall');
        const srIntervalSelect = document.getElementById('sr-interval');
        if (activeRecallToggle) {
            activeRecallToggle.checked = true;
            if (srIntervalSelect) {
                srIntervalSelect.style.display = 'block';
                srIntervalSelect.value = 'standard';
            }
        }
        
        // Reset swatches
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        const defaultSwatch = document.querySelector('.color-swatch[data-color="#4f46e5"]');
        if (defaultSwatch) defaultSwatch.classList.add('active');
        const wheel = document.getElementById('custom-color-wheel');
        if (wheel) wheel.value = '#ffffff';

        const modalTitle = document.getElementById('note-modal-title');
        if (modalTitle) modalTitle.innerText = 'Create New Note';
        currentEditingNoteId = null;
    } else if (modalId === 'task-modal') {
        const tTitle = document.getElementById('task-title');
        if (tTitle) tTitle.value = '';
        const tDead = document.getElementById('task-deadline');
        if (tDead) tDead.value = '';
        const tRes = document.getElementById('task-resource');
        if (tRes) tRes.value = '';
    }
};

closeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalId = e.target.closest('.close-btn')?.dataset?.modal;
        if (modalId) closeModal(modalId);
    });
});

if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => openModal('note-modal'));
}
if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => openModal('task-modal'));
}

const activeRecallToggle = document.getElementById('note-active-recall');
const srIntervalSelect = document.getElementById('sr-interval');
if (activeRecallToggle && srIntervalSelect) {
    activeRecallToggle.addEventListener('change', (e) => {
        srIntervalSelect.style.display = e.target.checked ? 'block' : 'none';
    });
}

// --- Drawer Logic ---
let currentViewNoteId = null;

window.openDrawer = function(id) {
    const note = notes.find(n => n.id === id);
    if (note) {
        currentViewNoteId = id;
        drawerTitle.innerText = note.title;
        drawerContent.innerHTML = note.content || '<em>No content</em>';
        if (window.MathJax) {
            MathJax.typesetPromise([drawerContent]).catch((err) => console.log(err.message));
        }
        drawerOverlay.classList.add('active', 'opacity-100', 'pointer-events-auto');
        drawerOverlay.classList.remove('opacity-0', 'pointer-events-none');
        noteDrawer.classList.add('open');
        noteDrawer.classList.remove('translate-x-full');
    }
};

window.closeDrawer = function() {
    if (drawerOverlay) {
        drawerOverlay.classList.remove('active', 'opacity-100', 'pointer-events-auto');
        drawerOverlay.classList.add('opacity-0', 'pointer-events-none');
    }
    if (noteDrawer) {
        noteDrawer.classList.remove('open');
        noteDrawer.classList.add('translate-x-full');
    }
};

if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', window.closeDrawer);
if (drawerOverlay) drawerOverlay.addEventListener('click', window.closeDrawer);

const downloadDrawerBtn = document.getElementById('download-drawer-btn');
if (downloadDrawerBtn) {
    downloadDrawerBtn.addEventListener('click', () => {
        if (currentViewNoteId) downloadNote(currentViewNoteId);
    });
}

const fullscreenDrawerBtn = document.getElementById('fullscreen-drawer-btn');
if (fullscreenDrawerBtn) {
    fullscreenDrawerBtn.addEventListener('click', () => {
        noteDrawer.classList.toggle('fullscreen');
        const icon = fullscreenDrawerBtn.querySelector('i');
        if (noteDrawer.classList.contains('fullscreen')) {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        } else {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
    });
}

// --- Rich Text Toolbar & Color Swatches ---
const colorSwatches = document.querySelectorAll('.color-swatch:not(.custom-wheel)');
const noteColorInput = document.getElementById('note-color');
const customColorWheel = document.getElementById('custom-color-wheel');

colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', (e) => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        noteColorInput.value = e.target.dataset.color;
    });
});

if (customColorWheel) {
    customColorWheel.addEventListener('input', (e) => {
        document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        noteColorInput.value = e.target.value;
    });
}

const toolbarBtns = document.querySelectorAll('.toolbar-btn');
const noteEditor = document.getElementById('note-editor');

const scrollBottomBtn = document.getElementById('scroll-bottom-btn');
if (scrollBottomBtn && noteEditor) {
    noteEditor.addEventListener('scroll', () => {
        if (noteEditor.scrollTop > 50 && (noteEditor.scrollTop + noteEditor.clientHeight < noteEditor.scrollHeight - 50)) {
            scrollBottomBtn.classList.add('visible');
        } else {
            scrollBottomBtn.classList.remove('visible');
        }
    });

    scrollBottomBtn.addEventListener('click', () => {
        noteEditor.scrollTo({ top: noteEditor.scrollHeight, behavior: 'smooth' });
    });
}

const insertImageBtn = document.getElementById('insert-image-btn');
const imageUploadInput = document.getElementById('image-upload-input');
const imageModal = document.getElementById('image-modal');
const imageDropzone = document.getElementById('image-dropzone');
const dropzoneClickBtn = document.getElementById('dropzone-click-btn');

if (insertImageBtn) {
    insertImageBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal('image-modal');
    });
}

const handleImageInsert = (file) => {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const imgHTML = `<img src="${event.target.result}" alt="Inserted Image">`;
            document.execCommand('insertHTML', false, imgHTML);
            closeModal('image-modal');
            noteEditor.focus();
        };
        reader.readAsDataURL(file);
    }
};

if (dropzoneClickBtn && imageUploadInput) {
    dropzoneClickBtn.addEventListener('click', (e) => {
        e.preventDefault();
        imageUploadInput.click();
    });
}

if (imageUploadInput) {
    imageUploadInput.addEventListener('change', (e) => {
        handleImageInsert(e.target.files[0]);
        imageUploadInput.value = '';
    });
}

if (imageDropzone) {
    imageDropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        imageDropzone.classList.add('dragover');
    });
    imageDropzone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        imageDropzone.classList.remove('dragover');
    });
    imageDropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        imageDropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleImageInsert(e.dataTransfer.files[0]);
        }
    });
}

if (noteEditor) {
    noteEditor.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let item of items) {
            if (item.type.indexOf('image') === 0) {
                e.preventDefault();
                const file = item.getAsFile();
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgHTML = `<img src="${event.target.result}" alt="Pasted Image">`;
                    document.execCommand('insertHTML', false, imgHTML);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    noteEditor.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    noteEditor.addEventListener('drop', (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const imgHTML = `<img src="${event.target.result}" alt="Dropped Image">`;
                    document.execCommand('insertHTML', false, imgHTML);
                };
                reader.readAsDataURL(file);
            }
        }
    });
}

toolbarBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = e.currentTarget.dataset.action;
        if (action === 'insertTable') {
            const tableHTML = `
                <table border="1" style="width: 100%; border-collapse: collapse;">
                    <tbody>
                        <tr><th data-placeholder="Header"></th><th data-placeholder="Header"></th><th data-placeholder="Header"></th></tr>
                        <tr><td data-placeholder="Data"></td><td data-placeholder="Data"></td><td data-placeholder="Data"></td></tr>
                        <tr><td data-placeholder="Data"></td><td data-placeholder="Data"></td><td data-placeholder="Data"></td></tr>
                    </tbody>
                </table><br>
            `;
            document.execCommand('insertHTML', false, tableHTML);
        } else {
            document.execCommand(action, false, null);
        }
        noteEditor.focus();
    });
});

const toolbarSelects = document.querySelectorAll('.toolbar-select');
toolbarSelects.forEach(select => {
    select.addEventListener('change', (e) => {
        const action = e.target.dataset.action;
        const value = e.target.value;
        document.execCommand(action, false, value);
        noteEditor.focus();
    });
});

// --- Floating Table Menu Logic ---
const floatingTableMenu = document.getElementById('floating-table-menu');
let currentTableNode = null;

noteEditor.addEventListener('click', (e) => {
    let node = e.target;
    while (node && node.id !== 'note-editor' && node.tagName !== 'TD' && node.tagName !== 'TH') {
        node = node.parentNode;
    }
    if (node && (node.tagName === 'TD' || node.tagName === 'TH')) {
        currentTableNode = node;
        const table = node.closest('table');
        const editorContainer = noteEditor.closest('.note-editor-container');
        
        // Calculate position relative to container
        const tableRect = table.getBoundingClientRect();
        const containerRect = editorContainer.getBoundingClientRect();
        
        let topPos = tableRect.top - containerRect.top - 45;
        if (topPos < 10) topPos = 10; // Prevent it from going above the container
        
        floatingTableMenu.style.top = `${topPos}px`;
        floatingTableMenu.style.left = `${tableRect.left - containerRect.left + 10}px`;
        floatingTableMenu.classList.add('active');
    } else {
        floatingTableMenu.classList.remove('active');
        currentTableNode = null;
    }
});

const floatingBtns = document.querySelectorAll('.floating-btn');
floatingBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!currentTableNode) return;
        const action = e.currentTarget.dataset.tableAction;
        const tr = currentTableNode.parentNode;
        const tbody = tr.parentNode;
        const cellIndex = Array.from(tr.children).indexOf(currentTableNode);
        
        if (action === 'addRow') {
            const newTr = document.createElement('tr');
            for (let i = 0; i < tr.children.length; i++) {
                const newTd = document.createElement('td');
                newTd.dataset.placeholder = 'Data';
                newTr.appendChild(newTd);
            }
            tbody.insertBefore(newTr, tr.nextSibling);
        } else if (action === 'deleteRow') {
            if (tbody.children.length > 1) tbody.removeChild(tr);
            floatingTableMenu.classList.remove('active');
        } else if (action === 'addColumn') {
            Array.from(tbody.children).forEach(row => {
                const cell = document.createElement(row.children[0].tagName);
                cell.dataset.placeholder = row.children[0].tagName === 'TH' ? 'Header' : 'Data';
                row.insertBefore(cell, row.children[cellIndex].nextSibling);
            });
        } else if (action === 'deleteColumn') {
            if (tr.children.length > 1) {
                Array.from(tbody.children).forEach(row => {
                    if (row.children[cellIndex]) row.removeChild(row.children[cellIndex]);
                });
            }
            floatingTableMenu.classList.remove('active');
        } else if (action === 'deleteTable') {
            const table = currentTableNode.closest('table');
            if (table) table.remove();
            floatingTableMenu.classList.remove('active');
        }
    });
});

// --- Note Functions ---
const saveNote = () => {
    const title = document.getElementById('note-title').value.trim();
    const content = document.getElementById('note-editor').innerHTML.trim();
    const category = document.getElementById('note-category').value;
    const color = document.getElementById('note-color').value;
    const activeRecallToggle = document.getElementById('note-active-recall');
    const activeRecall = activeRecallToggle ? activeRecallToggle.checked : false;

    if (!title) {
        if (window.customAlert) {
            window.customAlert('Missing Title', 'Please enter a title for your note.', 'warning');
        } else if (window.showToast) {
            window.showToast('Please enter a note title', 'warning');
        }
        return;
    }

    const generateSRTask = (days, label, priority, frequency) => {
        const d = new Date();
        d.setDate(d.getDate() + days);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        
        plannerTasks.push({
            id: Date.now().toString() + Math.random().toString(36).substring(7),
            title: `${label}: ${title}`,
            date: `${yyyy}-${mm}-${dd}`,
            priority: priority,
            category: frequency,
            completed: false
        });
    };

    let shouldGenerateTasks = false;
    let oldInterval = 'standard';
    if (currentEditingNoteId) {
        const noteIndex = notes.findIndex(n => n.id === currentEditingNoteId);
        if (noteIndex > -1) {
            const oldActiveRecall = notes[noteIndex].activeRecall;
            oldInterval = notes[noteIndex].srInterval || 'standard';
            if (!oldActiveRecall && activeRecall) shouldGenerateTasks = true;
        }
    } else {
        shouldGenerateTasks = activeRecall;
    }

    const intervalSelect = document.getElementById('sr-interval');
    const selectedInterval = intervalSelect ? intervalSelect.value : 'daily';

    if (shouldGenerateTasks) {
        // Parse user selected interval as frequency: daily, weekly, monthly
        // We fallback to standard if not one of these, but daily/weekly/monthly are standard.
        // Actually the dropdown might have value: standard, weekly, fifteen, monthly
        // We will map 'standard' to 'daily'
        let frequency = selectedInterval;
        if (frequency === 'standard') frequency = 'daily';
        if (frequency === 'fifteen') frequency = 'monthly';

        let intervals = [1, 3, 7]; // daily
        if (frequency === 'weekly') intervals = [7, 14, 21];
        else if (frequency === 'monthly') intervals = [30, 60, 90];

        generateSRTask(intervals[0], '1st Review', 'High', frequency);
        generateSRTask(intervals[1], '2nd Review', 'Medium', frequency);
        generateSRTask(intervals[2], 'Final Review', 'Low', frequency);
        
        localStorage.setItem('techprep_planner_tasks', JSON.stringify(plannerTasks));
        if (typeof renderPlannerTasks === 'function') renderPlannerTasks(frequency);
    }

    if (currentEditingNoteId) {
        // Edit existing
        const noteIndex = notes.findIndex(n => n.id === currentEditingNoteId);
        if (noteIndex > -1) {
            notes[noteIndex] = { ...notes[noteIndex], title, content, category, color, activeRecall, srInterval: selectedInterval, updatedAt: new Date().toISOString() };
        }
    } else {
        // Create new
        const newNote = {
            id: Date.now().toString(),
            title,
            content,
            category,
            color,
            activeRecall,
            srInterval: selectedInterval,
            isPinned: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        notes.unshift(newNote); // Add to top
    }

    localStorage.setItem('techprep_notes', JSON.stringify(notes));
    closeModal('note-modal');
    renderNotes();
};

const deleteNote = (id) => {
    const doDelete = () => {
        notes = notes.filter(n => n.id !== id);
        localStorage.setItem('techprep_notes', JSON.stringify(notes));
        renderNotes();
        if (window.showToast) window.showToast('Note deleted', 'success');
    };

    if (window.customConfirm) {
        window.customConfirm('Delete Note', 'Are you sure you want to delete this study note?').then(confirmed => {
            if (confirmed) doDelete();
        });
    } else {
        doDelete();
    }
};

const togglePinNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.isPinned = !note.isPinned;
        // Sort notes: pinned first, then by date
        notes.sort((a, b) => {
            if (a.isPinned === b.isPinned) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }
            return a.isPinned ? -1 : 1;
        });
        localStorage.setItem('techprep_notes', JSON.stringify(notes));
        renderNotes();
    }
};

const editNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-editor').innerHTML = note.content;
        document.getElementById('note-category').value = note.category;
        document.getElementById('note-color').value = note.color;
        
        const activeRecallToggle = document.getElementById('note-active-recall');
        const srIntervalSelect = document.getElementById('sr-interval');
        if (activeRecallToggle) {
            activeRecallToggle.checked = !!note.activeRecall;
            if (srIntervalSelect) {
                srIntervalSelect.value = note.srInterval || 'standard';
                srIntervalSelect.style.display = activeRecallToggle.checked ? 'block' : 'none';
            }
        }
        
        // Update active swatch
        let found = false;
        document.querySelectorAll('.color-swatch:not(.custom-wheel)').forEach(s => {
            if(s.dataset.color === note.color) {
                s.classList.add('active');
                found = true;
            } else {
                s.classList.remove('active');
            }
        });
        const wheel = document.getElementById('custom-color-wheel');
        if (!found && wheel) {
            wheel.classList.add('active');
            wheel.value = note.color;
        } else if (wheel) {
            wheel.classList.remove('active');
        }

        document.getElementById('note-modal-title').innerText = 'Edit Note';
        currentEditingNoteId = id;
        openModal('note-modal');
    }
};

const downloadNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (note) {
        const isDark = document.body.classList.contains('dark-theme');
        const bgColor = isDark ? '#121215' : '#f3f4f6';
        const cardColor = isDark ? '#1c1c21' : '#ffffff';
        const textColor = isDark ? '#f4f4f5' : '#1a1a1a';
        const metaColor = isDark ? '#a1a1aa' : '#6b7280';
        const borderColor = isDark ? '#3f3f46' : '#d1d5db';
        const thColor = isDark ? '#27272a' : '#f9fafb';

        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${note.title}</title>
    <script>
      window.MathJax = {
        tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']] }
      };
    </script>
    <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    <style>
        body {
            font-family: 'Segoe UI', system-ui, sans-serif;
            line-height: 1.6;
            color: ${textColor};
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            background-color: ${bgColor};
        }
        .note-container {
            background-color: ${cardColor};
            padding: 3rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        h1 {
            border-bottom: 3px solid ${note.color || '#3b82f6'};
            padding-bottom: 0.5rem;
            margin-top: 0;
            margin-bottom: 0.5rem;
        }
        .note-meta {
            color: ${metaColor};
            font-size: 0.9rem;
            margin-bottom: 2rem;
        }
        .content {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .content img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 8px;
            margin: 1rem 0;
            display: block;
        }
        .content table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            display: block;
            overflow-x: auto;
            white-space: nowrap;
        }
        .content th, .content td {
            border: 1px solid ${borderColor};
            padding: 0.75rem;
            text-align: left;
        }
        .content th {
            background-color: ${thColor};
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="note-container">
        <h1>${note.title}</h1>
        <div class="note-meta">
            <strong>Category:</strong> ${note.category} &nbsp;|&nbsp; 
            <strong>Date:</strong> ${new Date(note.createdAt).toLocaleDateString()}
        </div>
        <div class="content">
            ${note.content}
        </div>
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
};

const renderNotes = (searchQuery = '') => {
    let filteredNotes = notes;

    // Apply category filter
    if (currentNoteFilter !== 'all') {
        filteredNotes = filteredNotes.filter(n => n.category === currentNoteFilter);
    }

    // Apply search filter
    if (searchQuery) {
        const terms = searchQuery.toLowerCase().trim().split(/\s+/);
        filteredNotes = filteredNotes.filter(n => {
            const title = (n.title || '').toLowerCase();
            return terms.every(term => title.includes(term));
        });
    }

    notesContainer.innerHTML = '';

    if (filteredNotes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state flex flex-col items-center justify-center py-12 text-text-muted gap-4 text-center" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-notes-medical text-4xl mb-2 opacity-50"></i>
                <p class="font-medium">No notes found. Create your first note!</p>
            </div>
        `;
        return;
    }

    filteredNotes.forEach(note => {
        const dateStr = new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = note.content || '';
        const previewText = tempDiv.innerText.trim() || 'No content';
        
        const noteEl = document.createElement('div');
        noteEl.className = `note-card bg-bg-secondary border border-border rounded-lg p-4 relative transition-all duration-200 flex flex-col gap-3 cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-accent-primary ${note.isPinned ? 'pinned' : ''}`;
        noteEl.style.borderTop = `4px solid ${note.color}`;
        
        const srBadge = note.activeRecall ? `<div class="sr-badge mt-2 text-[0.7rem] bg-accent-primary/10 text-accent-primary py-1 px-2 rounded-full inline-flex items-center gap-1 w-max"><i class="fa-solid fa-brain"></i> Spaced Repetition Active</div>` : '';

        noteEl.innerHTML = `
            <div class="note-header flex justify-between items-start">
                <div class="note-title font-heading text-[1.05rem] font-semibold mr-6 overflow-hidden text-ellipsis line-clamp-2">${note.title}</div>
                <button class="note-pin absolute top-4 right-4 bg-transparent border-none cursor-pointer transition-colors ${note.isPinned ? 'text-warning' : 'text-text-muted hover:text-text-primary'}" onclick="event.stopPropagation(); togglePinNote('${note.id}')" title="Pin Note">
                    <i class="fa-solid fa-thumbtack"></i>
                </button>
            </div>
            <div class="note-content-preview text-[0.85rem] text-text-secondary flex-1 overflow-hidden text-ellipsis line-clamp-3">${previewText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
            <div class="note-footer flex justify-between items-center mt-auto pt-2 border-t border-border flex-wrap gap-y-2">
                <div class="flex items-center gap-2">
                    <span class="note-tag text-[0.7rem] py-0.5 px-2 rounded-full bg-white/5 border border-border uppercase tracking-wider">${note.category}</span>
                    <span class="note-date text-[0.7rem] text-text-muted">${dateStr}</span>
                </div>
                <div class="note-actions flex gap-2">
                    <button class="action-btn download bg-transparent border-none text-text-muted cursor-pointer transition-colors hover:text-text-primary" onclick="event.stopPropagation(); downloadNote('${note.id}')" title="Download Note"><i class="fa-solid fa-download"></i></button>
                    <button class="action-btn edit bg-transparent border-none text-text-muted cursor-pointer transition-colors hover:text-accent-primary" onclick="event.stopPropagation(); editNote('${note.id}')" title="Edit Note"><i class="fa-solid fa-pen"></i></button>
                    <button class="action-btn delete bg-transparent border-none text-text-muted cursor-pointer transition-colors hover:text-danger" onclick="event.stopPropagation(); deleteNote('${note.id}')" title="Delete Note"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
            ${srBadge}
        `;
        noteEl.addEventListener('click', () => openDrawer(note.id));
        notesContainer.appendChild(noteEl);
    });

    if (window.MathJax) {
        MathJax.typesetPromise([notesContainer]).catch((err) => console.log(err.message));
    }
};

saveNoteBtn.addEventListener('click', saveNote);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentNoteFilter = e.target.dataset.filter;
        renderNotes(globalSearch.value);
    });
});


// --- Task Functions ---
const saveTask = () => {
    const title = document.getElementById('task-title').value.trim();
    const type = document.getElementById('task-type').value;
    const deadline = document.getElementById('task-deadline').value;
    const priority = document.getElementById('task-priority').value;
    const resourceInput = document.getElementById('task-resource');
    const resourceLink = resourceInput ? resourceInput.value.trim() : '';

    if (!title) {
        if (window.customAlert) {
            window.customAlert('Missing Description', 'Please enter a description for your task.', 'warning');
        } else if (window.showToast) {
            window.showToast('Please enter a task description', 'warning');
        }
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        title,
        type,
        deadline,
        priority,
        resourceLink,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.push(newTask);
    localStorage.setItem('techprep_tasks', JSON.stringify(tasks));
    
    // Reset form
    document.getElementById('task-title').value = '';
    document.getElementById('task-deadline').value = '';
    if (resourceInput) resourceInput.value = '';

    closeModal('task-modal');
    renderTasks();
    updateProgress();
    renderHeatmap();
};

const toggleTaskStatus = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        localStorage.setItem('techprep_tasks', JSON.stringify(tasks));
        renderTasks();
        updateProgress();
        renderHeatmap();
    }
};

const deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    localStorage.setItem('techprep_tasks', JSON.stringify(tasks));
    renderTasks();
    updateProgress();
    renderHeatmap();
};

const renderHeatmap = () => {
    const heatmapGrid = document.getElementById('heatmap-grid');
    if (!heatmapGrid) return;
    
    heatmapGrid.innerHTML = '';
    
    const today = new Date();
    // Generate array of last 35 days (5 weeks)
    const days = [];
    for (let i = 34; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d);
    }
    
    days.forEach(date => {
        // Format to YYYY-MM-DD to match the HTML5 date input format stored in task.deadline
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateString = `${year}-${month}-${day}`;
        
        // Count daily completed tasks for this specific date
        const completedCount = tasks.filter(t => t.type === 'daily' && t.completed && t.deadline === dateString).length;
        
        const square = document.createElement('div');
        square.className = 'w-3 h-3 rounded-sm transition-colors duration-200';
        
        // Apply Tailwind colors based on completion rate
        if (completedCount === 0) {
            square.classList.add('bg-slate-100', 'dark:bg-slate-800');
        } else if (completedCount === 1) {
            square.classList.add('bg-emerald-200', 'dark:bg-emerald-900/40');
        } else if (completedCount === 2) {
            square.classList.add('bg-emerald-400', 'dark:bg-emerald-700/60');
        } else {
            square.classList.add('bg-emerald-600', 'dark:bg-emerald-500');
        }
        
        // Tooltip title
        const displayDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        square.title = `${displayDate}: ${completedCount} task${completedCount === 1 ? '' : 's'} completed`;
        
        heatmapGrid.appendChild(square);
    });
};

const renderTasks = (searchQuery = '') => {
    let filteredTasks = tasks.filter(t => t.type === currentTaskTab);

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filteredTasks = filteredTasks.filter(t => t.title.toLowerCase().includes(q));
    }

    // Sort: uncompleted first, then by priority (high > medium > low)
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    tasksContainer.innerHTML = '';

    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state flex flex-col items-center justify-center py-10 text-text-muted gap-3 text-center">
                <i class="fa-solid fa-clipboard-check text-4xl mb-2 opacity-50"></i>
                <p class="font-medium">No ${currentTaskTab} tasks. Take a break!</p>
            </div>
        `;
        return;
    }

    filteredTasks.forEach(task => {
        const dateStr = task.deadline ? new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No deadline';
        
        const taskEl = document.createElement('div');
        taskEl.className = `task-item flex items-center gap-4 bg-bg-secondary p-3.5 rounded-lg border border-border transition-all duration-200 hover:border-indigo-500/40 hover:translate-x-0.5 ${task.completed ? 'completed opacity-60' : ''}`;
        
        let prioColorClass = 'text-success';
        if (task.priority === 'high') prioColorClass = 'text-danger';
        if (task.priority === 'medium') prioColorClass = 'text-warning';

        const resourceLinkBadge = task.resourceLink ? `<a href="${task.resourceLink}" target="_blank" rel="noopener noreferrer" title="Open Resource" class="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-100 hover:bg-blue-100 text-slate-500 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-900/30 dark:text-slate-400 transition-colors ml-2" onclick="event.stopPropagation();"><i class="fa-solid fa-external-link-alt text-[0.7rem]"></i></a>` : '';

        taskEl.innerHTML = `
            <input type="checkbox" class="task-checkbox appearance-none w-5 h-5 border-2 border-border rounded cursor-pointer relative transition-all duration-200 shrink-0 checked:bg-success checked:border-success" ${task.completed ? 'checked' : ''} onchange="toggleTaskStatus('${task.id}')">
            <div class="task-content flex flex-col flex-1">
                <div class="task-title flex items-center text-[0.95rem] font-medium ${task.completed ? 'line-through text-text-muted' : ''}">
                    ${task.title}
                    ${resourceLinkBadge}
                </div>
                <div class="task-meta flex gap-4 text-[0.75rem] text-text-muted mt-1">
                    <span class="task-priority flex items-center gap-1 ${prioColorClass}">
                        <i class="fa-solid fa-flag"></i> ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                    <span><i class="fa-regular fa-clock"></i> ${dateStr}</span>
                </div>
            </div>
            <button class="action-btn delete bg-transparent border-none text-text-muted cursor-pointer transition-colors hover:text-danger" onclick="deleteTask('${task.id}')" title="Delete Task">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        tasksContainer.appendChild(taskEl);
    });
};

saveTaskBtn.addEventListener('click', saveTask);

tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tabBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentTaskTab = e.target.dataset.tab;
        renderTasks();
    });
});

const updateProgress = () => {
    const currentTabTasks = tasks.filter(t => t.type === currentTaskTab);
    const total = currentTabTasks.length;
    const completed = currentTabTasks.filter(t => t.completed).length;
    
    let percentage = 0;
    if (total > 0) {
        percentage = Math.round((completed / total) * 100);
    }
    
    progressText.innerText = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;
    
    // Change color based on progress
    if(percentage === 100) {
        progressFill.style.background = 'var(--success)';
    } else {
        progressFill.style.background = 'var(--accent-gradient)';
    }
};

// --- Global Search ---
if (globalSearch) {
    globalSearch.addEventListener('input', (e) => {
        const q = e.target.value;
        renderNotes(q);
    });
}

// --- Data Backup & Restore ---
window.exportData = function() {
    try {
        const data = {
            notes: notes,
            tasks: tasks,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `TechPrepAI_StudyPlanner_Backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    } catch (error) {
        console.error("Export failed:", error);
        if (window.customAlert) window.customAlert('Export Failed', 'Failed to export study planner data.', 'error');
        else if (window.showToast) window.showToast('Failed to export data.', 'error');
    }
};

window.importData = function(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const importedData = JSON.parse(e.target.result);
            
            // Validate schema
            if (!importedData || !Array.isArray(importedData.notes) || !Array.isArray(importedData.tasks)) {
                throw new Error("Invalid schema: Missing notes or tasks array.");
            }
            
            // Overwrite memory
            notes = importedData.notes;
            tasks = importedData.tasks;
            
            // Overwrite LocalStorage
            localStorage.setItem('techprep_notes', JSON.stringify(notes));
            localStorage.setItem('techprep_tasks', JSON.stringify(tasks));
            
            // Re-render UI
            renderNotes();
            renderTasks();
            updateProgress();
            if (typeof renderHeatmap === 'function') renderHeatmap();
            
            if (window.showToast) window.showToast('Data restored successfully!', 'success');
            else if (window.customAlert) window.customAlert('Data Restored', 'Planner notes and tasks restored successfully!', 'success');
        } catch (error) {
            console.error("Import failed:", error);
            if (window.customAlert) window.customAlert('Import Failed', 'Invalid backup file format.', 'error');
            else if (window.showToast) window.showToast('Invalid backup file format.', 'error');
        } finally {
            event.target.value = ''; // Reset input
        }
    };
    
    reader.onerror = () => {
        if (window.customAlert) window.customAlert('Error', 'Error reading backup file.', 'error');
        event.target.value = '';
    };
    
    reader.readAsText(file);
};

// Run Init
initApp();
