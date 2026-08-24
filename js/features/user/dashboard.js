// Mobile Sidebar Toggler
window.toggleUserSidebar = function(forceState) {
  const sidebar = document.getElementById('user-sidebar');
  const overlay = document.getElementById('user-sidebar-overlay');
  if (!sidebar || !overlay) return;
  const isClosed = sidebar.classList.contains('-translate-x-full');
  const shouldOpen = forceState !== undefined ? forceState : isClosed;

  if (shouldOpen) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.remove('hidden');
  } else {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
  }
};

// Tab switching controller
function switchDashboardTab(tabName) {
  const panels = ['quizzes', 'history', 'profile'];
  
  panels.forEach(p => {
    const panelEl = document.getElementById(`tab-panel-${p}`);
    const sideBtn = document.getElementById(`side-btn-${p}`);
    
    if (p === tabName) {
      if (panelEl) {
        panelEl.classList.remove('hidden');
        panelEl.classList.add('block');
      }
      if (sideBtn) {
        sideBtn.className = "flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white w-full text-xs font-semibold";
      }
    } else {
      if (panelEl) {
        panelEl.classList.add('hidden');
        panelEl.classList.remove('block');
      }
      if (sideBtn) {
        sideBtn.className = "flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 w-full text-xs font-semibold";
      }
    }
  });

  if (tabName === 'history') {
    renderHistoryLogs();
  } else if (tabName === 'profile') {
    loadProfileForm();
  }
}

function loadProfileForm() {
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (!currentUser) return;
  
  document.getElementById('profile-name').value = currentUser.name || '';
  document.getElementById('profile-email').value = currentUser.email || '';
  document.getElementById('profile-pic-url').value = currentUser.profilePic || '';
  document.getElementById('profile-contact').value = currentUser.contact || '';
  document.getElementById('profile-dob').value = currentUser.dob || '';
  document.getElementById('profile-address').value = currentUser.address || '';
  document.getElementById('profile-college').value = currentUser.college || '';
  document.getElementById('profile-degree').value = currentUser.degree || '';
  document.getElementById('profile-branch').value = currentUser.branch || '';
  document.getElementById('profile-specialization').value = currentUser.specialization || '';
  document.getElementById('profile-grad-year').value = currentUser.gradYear || '';
  document.getElementById('profile-cgpa').value = currentUser.cgpa || '';
  document.getElementById('profile-marks10').value = currentUser.marks10 || '';
  document.getElementById('profile-marks12').value = currentUser.marks12 || '';
  document.getElementById('profile-skills').value = currentUser.skills || '';
  document.getElementById('profile-leetcode').value = currentUser.leetcode || '';
  document.getElementById('profile-github').value = currentUser.github || '';
  document.getElementById('profile-linkedin').value = currentUser.linkedin || '';
  document.getElementById('profile-portfolio').value = currentUser.portfolio || '';
  
  updateProfilePreview(currentUser);
  renderProfileCompleteness(currentUser);
  
  document.getElementById('profile-success-msg').classList.add('hidden');
}

function updateProfilePreview(user) {
  const preview = document.getElementById('profile-preview-container');
  if (!preview) return;
  
  if (user.profilePic && user.profilePic.trim() !== '') {
    preview.innerHTML = `<img src="${user.profilePic}" alt="Avatar" class="w-full h-full object-cover">`;
  } else {
    const names = (user.name || 'P').trim().split(' ');
    const initials = names.length > 1 
      ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
    preview.textContent = initials;
  }
}

function renderProfileCompleteness(user) {
  if (!window.checkProfileCompleteness) return;
  const status = window.checkProfileCompleteness(user);
  
  document.getElementById('completeness-percentage').textContent = `${status.percentage}%`;
  document.getElementById('completeness-bar').style.width = `${status.percentage}%`;
  
  const alertBox = document.getElementById('profile-warning-alert');
  if (status.percentage < 100) {
    alertBox.classList.remove('hidden');
    document.getElementById('profile-missing-fields').textContent = status.missing.join(', ');
  } else {
    alertBox.classList.add('hidden');
  }
}

// File upload FileReader hook
document.addEventListener('DOMContentLoaded', () => {
  const picFile = document.getElementById('profile-pic-file');
  if (picFile) {
    picFile.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64Str = evt.target.result;
        document.getElementById('profile-pic-url').value = base64Str;
        document.getElementById('profile-preview-container').innerHTML = `<img src="${base64Str}" alt="Avatar" class="w-full h-full object-cover">`;
      };
      reader.readAsDataURL(file);
    });
  }

  const picUrl = document.getElementById('profile-pic-url');
  if (picUrl) {
    picUrl.addEventListener('input', function(e) {
      const url = e.target.value.trim();
      const preview = document.getElementById('profile-preview-container');
      if (url !== '') {
        preview.innerHTML = `<img src="${url}" alt="Avatar" class="w-full h-full object-cover">`;
      } else {
        preview.textContent = 'P';
      }
    });
  }

  const editForm = document.getElementById('profile-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('profile-name').value.trim();
      const email = document.getElementById('profile-email').value.trim().toLowerCase();
      
      if (!name || !email) {
        window.customAlert("Validation Error", "Name and Email are required.", "warning");
        return;
      }
      
      const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
      if (!currentUser) return;
      
      const oldEmail = currentUser.email;
      
      currentUser.name = name;
      currentUser.email = email;
      currentUser.profilePic = document.getElementById('profile-pic-url').value.trim();
      currentUser.contact = document.getElementById('profile-contact').value.trim();
      currentUser.dob = document.getElementById('profile-dob').value;
      currentUser.address = document.getElementById('profile-address').value.trim();
      currentUser.college = document.getElementById('profile-college').value.trim();
      currentUser.degree = document.getElementById('profile-degree').value.trim();
      currentUser.branch = document.getElementById('profile-branch').value.trim();
      currentUser.specialization = document.getElementById('profile-specialization').value.trim();
      currentUser.gradYear = document.getElementById('profile-grad-year').value.trim();
      currentUser.cgpa = document.getElementById('profile-cgpa').value.trim();
      currentUser.marks10 = document.getElementById('profile-marks10').value.trim();
      currentUser.marks12 = document.getElementById('profile-marks12').value.trim();
      currentUser.skills = document.getElementById('profile-skills').value.trim();
      currentUser.leetcode = document.getElementById('profile-leetcode').value.trim();
      currentUser.github = document.getElementById('profile-github').value.trim();
      currentUser.linkedin = document.getElementById('profile-linkedin').value.trim();
      currentUser.portfolio = document.getElementById('profile-portfolio').value.trim();
      
      localStorage.setItem('techprep_current_user', JSON.stringify(currentUser));
      
      const users = JSON.parse(localStorage.getItem('techprep_registered_users') || '[]');
      const userIdx = users.findIndex(u => (u.email || '').toLowerCase() === (oldEmail || '').toLowerCase());
      if (userIdx > -1) {
        users[userIdx].name = name;
        users[userIdx].email = email;
        users[userIdx].profilePic = currentUser.profilePic;
        users[userIdx].contact = currentUser.contact;
        users[userIdx].dob = currentUser.dob;
        users[userIdx].address = currentUser.address;
        users[userIdx].college = currentUser.college;
        users[userIdx].degree = currentUser.degree;
        users[userIdx].branch = currentUser.branch;
        users[userIdx].specialization = currentUser.specialization;
        users[userIdx].gradYear = currentUser.gradYear;
        users[userIdx].cgpa = currentUser.cgpa;
        users[userIdx].marks10 = currentUser.marks10;
        users[userIdx].marks12 = currentUser.marks12;
        users[userIdx].skills = currentUser.skills;
        users[userIdx].leetcode = currentUser.leetcode;
        users[userIdx].github = currentUser.github;
        users[userIdx].linkedin = currentUser.linkedin;
        users[userIdx].portfolio = currentUser.portfolio;
      } else {
        users.push({
          ...currentUser,
          name,
          email,
          suspended: false,
          createdAt: new Date().toISOString()
        });
      }
      localStorage.setItem('techprep_registered_users', JSON.stringify(users));
      
      document.getElementById('welcome-user-name').textContent = name;
      document.getElementById('user-display-name').textContent = name;
      if (window.syncUserAvatar) {
        window.syncUserAvatar(currentUser);
      }
      
      renderProfileCompleteness(currentUser);
      
      const msg = document.getElementById('profile-success-msg');
      msg.classList.remove('hidden');
      setTimeout(() => {
        msg.classList.add('hidden');
      }, 3000);
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (!currentUser) {
    window.location.href = '../public/login.html';
    return;
  }
  
  if (currentUser.email === 'khushboo2006june@admin.com') {
    window.location.href = '../admin/admin-hub.html';
    return;
  }

  loadStudentPortal();

  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  if (tabParam) {
    switchDashboardTab(tabParam);
  } else {
    switchDashboardTab('quizzes');
  }
});

function loadStudentPortal() {
  const quizzes = window.QuizStorage.getQuizzes();
  const results = window.QuizStorage.getUserResults();

  const totalTaken = results.length;
  let totalPercentage = 0;
  let highestPercentage = 0;
  let totalWarningsCount = 0;

  results.forEach(res => {
    totalPercentage += parseInt(res.scorePercent || 0);
    if (res.scorePercent > highestPercentage) {
      highestPercentage = res.scorePercent;
    }
    totalWarningsCount += parseInt(res.violations || 0);
  });

  const avgPercentage = totalTaken ? Math.round(totalPercentage / totalTaken) : 0;

  document.getElementById('stat-completed').textContent = totalTaken;
  document.getElementById('stat-avg-score').textContent = avgPercentage + '%';
  document.getElementById('stat-high-score').textContent = highestPercentage + '%';
  document.getElementById('stat-violations').textContent = totalWarningsCount;

  const grid = document.getElementById('available-quizzes-grid');
  grid.innerHTML = '';

  if (quizzes.length === 0) {
    grid.innerHTML = '<p class="text-xs text-neutral-500 text-center col-span-full py-8">No quizzes have been created yet. Open Admin console.</p>';
    return;
  }

  quizzes.forEach(q => {
    const qCount = q.questions ? q.questions.length : 0;
    
    const matchedAttempts = results.filter(r => r.quizId === q.id);
    let statusBadgeHTML = '';
    let buttonText = 'Start Assessment';
    
    if (matchedAttempts.length > 0) {
      matchedAttempts.sort((a,b) => b.scorePercent - a.scorePercent);
      const bestScore = matchedAttempts[0].scorePercent;
      const passed = bestScore >= q.passPercentage;

      statusBadgeHTML = `
        <span class="px-2 py-0.5 rounded text-[9px] font-semibold border ${
          passed 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        }">
          Best: ${bestScore}% (${passed ? 'Passed' : 'Failed'})
        </span>
      `;
      buttonText = 'Re-Attempt Quiz';
    }

    const card = document.createElement('div');
    card.className = "flex flex-col justify-between p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-left";
    
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold uppercase">
            ${qCount} Questions
          </span>
          <div class="flex items-center space-x-1.5 text-xs text-neutral-500 font-mono">
            <span>Time: ${q.timeLimit}m</span>
          </div>
        </div>
        
        <h3 class="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-1">${q.title}</h3>
        <p class="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">${q.description}</p>
        
        <div class="mt-4 flex items-center justify-between">
          <span class="text-[10px] text-neutral-400 font-mono">Pass: ${q.passPercentage}%</span>
          ${statusBadgeHTML}
        </div>
      </div>
      
      <a href="quiz-user.html?quizId=${q.id}" class="mt-6 block w-full text-center py-2 text-xs font-semibold rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm">
        ${buttonText}
      </a>
    `;
    grid.appendChild(card);
  });
}

function renderHistoryLogs() {
  const results = window.QuizStorage.getUserResults();
  const tbody = document.getElementById('history-table-body');
  const emptyMsg = document.getElementById('history-empty');

  tbody.innerHTML = '';
  if (results.length === 0) {
    emptyMsg.classList.remove('hidden');
    return;
  }
  emptyMsg.classList.add('hidden');

  const reversed = [...results].reverse();

  reversed.forEach(res => {
    const tr = document.createElement('tr');
    tr.className = "hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors";
    
    const dateStr = new Date(res.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    const passed = res.status === 'PASSED';
    
    tr.innerHTML = `
      <td class="py-3.5 px-4 font-mono text-neutral-500">${dateStr}</td>
      <td class="py-3.5 px-4 font-semibold text-neutral-900 dark:text-white">${res.quizTitle}</td>
      <td class="py-3.5 px-4 font-mono font-semibold text-neutral-800 dark:text-neutral-200">${res.scorePercent}% (${res.scoreFraction})</td>
      <td class="py-3.5 px-4 font-mono text-amber-500 font-bold">${res.violations || 0}</td>
      <td class="py-3.5 px-4">
        <span class="px-2 py-0.5 rounded text-[10px] font-semibold border ${
          passed 
            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
        }">
          ${res.status}
        </span>
      </td>
      <td class="py-3.5 px-4 text-neutral-400 font-mono italic">${res.submissionReason || 'Normal'}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  if (tabParam && ['quizzes', 'history', 'profile'].includes(tabParam)) {
    switchDashboardTab(tabParam);
  }
});



