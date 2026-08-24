// Mobile Sidebar Toggler
window.toggleAdminSidebar = function(forceState) {
  const sidebar = document.getElementById('admin-sidebar');
  const overlay = document.getElementById('admin-sidebar-overlay');
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

// Bulk Importers & File Parsers
function handleBulkImport(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  const extension = file.name.split('.').pop().toLowerCase();

  if (extension === 'xlsx' || extension === 'xls' || extension === 'csv') {
    reader.onload = function (e) {
      parseExcelCSV(e.target.result, extension);
    };
    reader.readAsArrayBuffer(file);
  } else if (extension === 'docx') {
    reader.onload = function (e) {
      parseWordDOCX(e.target.result);
    };
    reader.readAsArrayBuffer(file);
  } else if (extension === 'txt') {
    reader.onload = function (e) {
      parseAikenText(e.target.result);
    };
    reader.readAsText(file);
  } else {
    window.customAlert("Format Error", "Unsupported file format. Please upload XLSX, XLS, CSV, DOCX, or TXT.", "error");
  }

  input.value = '';
}

function parseExcelCSV(arrayBuffer, fileType) {
  try {
    const data = new Uint8Array(arrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (jsonData.length <= 1) {
      window.customAlert("Import Error", "Selected spreadsheet has insufficient rows. Ensure header row + content rows exist.", "error");
      return;
    }

    const headers = jsonData[0].map(h => String(h || '').trim().toLowerCase());
    
    let qIdx = headers.findIndex(h => h.includes('question') || h.includes('ques'));
    let aIdx = headers.findIndex(h => h === 'a' || h.includes('option a') || h.includes('choice a'));
    let bIdx = headers.findIndex(h => h === 'b' || h.includes('option b') || h.includes('choice b'));
    let cIdx = headers.findIndex(h => h === 'c' || h.includes('option c') || h.includes('choice c'));
    let dIdx = headers.findIndex(h => h === 'd' || h.includes('option d') || h.includes('choice d'));
    let correctIdx = headers.findIndex(h => h.includes('correct') || h.includes('answer'));
    let expIdx = headers.findIndex(h => h.includes('explain') || h.includes('reason'));

    if (qIdx === -1) qIdx = 0;
    if (aIdx === -1) aIdx = 1;
    if (bIdx === -1) bIdx = 2;
    if (cIdx === -1) cIdx = 3;
    if (dIdx === -1) dIdx = 4;
    if (correctIdx === -1) correctIdx = 5;
    if (expIdx === -1) expIdx = 6;

    let importCount = 0;

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0 || !row[qIdx]) continue;

      const questionText = String(row[qIdx] || '').trim();
      const optA = String(row[aIdx] || '').trim();
      const optB = String(row[bIdx] || '').trim();
      const optC = String(row[cIdx] || '').trim();
      const optD = String(row[dIdx] || '').trim();
      const explanation = expIdx < row.length ? String(row[expIdx] || '').trim() : '';

      const correctVal = String(row[correctIdx] || '').trim().toUpperCase();
      let correctOptionIndex = 0;
      if (correctVal === 'A' || correctVal === '0') correctOptionIndex = 0;
      else if (correctVal === 'B' || correctVal === '1') correctOptionIndex = 1;
      else if (correctVal === 'C' || correctVal === '2') correctOptionIndex = 2;
      else if (correctVal === 'D' || correctVal === '3') correctOptionIndex = 3;
      else {
        if (correctVal.toLowerCase() === optA.toLowerCase()) correctOptionIndex = 0;
        else if (correctVal.toLowerCase() === optB.toLowerCase()) correctOptionIndex = 1;
        else if (correctVal.toLowerCase() === optC.toLowerCase()) correctOptionIndex = 2;
        else if (correctVal.toLowerCase() === optD.toLowerCase()) correctOptionIndex = 3;
      }

      if (questionText && optA && optB) {
        addQuestionDOM({
          text: questionText,
          options: [optA, optB, optC || 'N/A', optD || 'N/A'],
          correctIndex: correctOptionIndex,
          explanation: explanation
        });
        importCount++;
      }
    }

    showToast(`Successfully imported ${importCount} questions from spreadsheet!`);
  } catch (error) {
    console.error("XLSX parsing failed:", error);
    window.customAlert("Import Error", "Failed to parse Excel/CSV document. Verify file structures.", "error");
  }
}

function parseWordDOCX(arrayBuffer) {
  mammoth.extractRawText({ arrayBuffer: arrayBuffer })
    .then(function (result) {
      const text = result.value;
      parseAikenText(text);
    })
    .catch(function (err) {
      console.error(err);
      window.customAlert("Import Error", "Failed to extract text from Word document.", "error");
    });
}

function parseAikenText(text) {
  try {
    const lines = text.split(/\r?\n/).map(line => line.trim()).filter(line => line.length > 0);
    
    let currentQuestion = null;
    let options = [];
    let correctIndex = -1;
    let explanation = '';
    let importCount = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const ansMatch = line.match(/^ANSWER:\s*([A-D0-9])/i);
      if (ansMatch) {
        const letter = ansMatch[1].toUpperCase();
        if (letter === 'A' || letter === '0') correctIndex = 0;
        else if (letter === 'B' || letter === '1') correctIndex = 1;
        else if (letter === 'C' || letter === '2') correctIndex = 2;
        else if (letter === 'D' || letter === '3') correctIndex = 3;

        if (i + 1 < lines.length && lines[i + 1].toUpperCase().startsWith('EXPLANATION:')) {
          explanation = lines[i + 1].substring('EXPLANATION:'.length).trim();
          i++;
        }

        if (currentQuestion && options.length >= 2 && correctIndex > -1) {
          while (options.length < 4) {
            options.push('N/A');
          }
          addQuestionDOM({
            text: currentQuestion,
            options: options.slice(0, 4),
            correctIndex: correctIndex,
            explanation: explanation
          });
          importCount++;
        }

        currentQuestion = null;
        options = [];
        correctIndex = -1;
        explanation = '';
        continue;
      }

      const optMatch = line.match(/^([A-D])[\.\)]\s*(.+)/i);
      if (optMatch) {
        const letter = optMatch[1].toUpperCase();
        const textValue = optMatch[2].trim();
        const idx = letter.charCodeAt(0) - 65;
        options[idx] = textValue;
        continue;
      }

      if (!currentQuestion) {
        currentQuestion = line;
      } else {
        if (options.length === 0) {
          currentQuestion += '\n' + line;
        } else {
          currentQuestion = line;
          options = [];
          correctIndex = -1;
          explanation = '';
        }
      }
    }

    if (importCount > 0) {
      showToast(`Successfully imported ${importCount} questions from file!`);
    } else {
      window.customAlert("Import Failed", "No valid Aiken format questions detected in the file.", "error");
    }
  } catch (error) {
    console.error("Text parsing failed:", error);
    window.customAlert("Import Failed", "Failed to parse text document. Check format.", "error");
  }
}

// Seed/Load Core variables
let quizzes = [];
let activeQuizId = null;

document.addEventListener('DOMContentLoaded', () => {
  // Access protection check
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (!currentUser || currentUser.email !== 'khushboo2006june@admin.com') {
    window.customAlert("Access Denied", "Unauthorized Access. Admin Console requires administrator credentials.", "error").then(() => {
      window.location.href = '../../index.html';
    });
    return;
  }
  loadQuizzes();
  switchAdminTab('quizzes');
  
  // Sync initials on load
  if (window.syncUserAvatar) {
    window.syncUserAvatar(currentUser);
  }
});

function loadQuizzes() {
  quizzes = window.QuizStorage.getQuizzes();
  renderQuizzes();
  updateDashboardStats();
}

function updateDashboardStats() {
  const totalQuizzes = quizzes.length;
  let totalQuestions = 0;
  let totalTime = 0;
  let totalPass = 0;

  quizzes.forEach(q => {
    totalQuestions += (q.questions ? q.questions.length : 0);
    totalTime += parseInt(q.timeLimit || 0);
    totalPass += parseInt(q.passPercentage || 0);
  });

  const avgTime = totalQuizzes ? Math.round(totalTime / totalQuizzes) : 0;
  const avgPass = totalQuizzes ? Math.round(totalPass / totalQuizzes) : 0;

  document.getElementById('stat-total-quizzes').textContent = totalQuizzes;
  document.getElementById('stat-total-questions').textContent = totalQuestions;
  document.getElementById('stat-avg-duration').textContent = avgTime + 'm';
  document.getElementById('stat-avg-pass').textContent = avgPass + '%';
}

// Render Quizzes Grid
function renderQuizzes() {
  const query = document.getElementById('search-quiz').value.toLowerCase().trim();
  const grid = document.getElementById('quizzes-grid');
  const emptyState = document.getElementById('empty-state');
  
  grid.innerHTML = '';
  
  const filtered = quizzes.filter(q => 
    q.title.toLowerCase().includes(query) || 
    q.description.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  
  emptyState.classList.add('hidden');

  filtered.forEach(q => {
    const questionsCount = q.questions ? q.questions.length : 0;
    
    const card = document.createElement('div');
    card.className = "flex flex-col justify-between p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm hover:border-neutral-300 dark:hover:border-neutral-700 transition-all";
    
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold uppercase">
            ${questionsCount} Questions
          </span>
          <div class="flex items-center space-x-1.5 text-xs text-neutral-500 font-mono">
            <span>Duration: ${q.timeLimit}m</span>
          </div>
        </div>
        
        <h3 class="text-sm font-bold text-neutral-900 dark:text-white leading-snug line-clamp-1">${q.title}</h3>
        <p class="text-xs text-neutral-500 mt-2 line-clamp-2 leading-relaxed">${q.description}</p>
        
        <div class="mt-4 flex items-center space-x-2 text-[10px] text-neutral-400 font-mono">
          <span>Pass Bound: <strong>${q.passPercentage}%</strong></span>
        </div>
      </div>
      
      <div class="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800/60 flex items-center justify-end gap-2 text-xs">
        <button onclick="editQuiz('${q.id}')" class="px-3 py-1.5 rounded font-medium border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all">
          Edit
        </button>
        <button onclick="confirmDelete('${q.id}', '${q.title.replace(/'/g, "\\'")}')" class="px-3 py-1.5 rounded font-medium border border-transparent text-rose-600 hover:bg-rose-500/10 transition-all">
          Delete
        </button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// Modal Control functions
function openQuizModal(title = "Create New Quiz") {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-error-banner').classList.add('hidden');
  
  const modal = document.getElementById('quiz-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
  document.body.style.overflow = 'hidden';
}

function closeQuizModal() {
  const modal = document.getElementById('quiz-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  document.body.style.overflow = '';
  
  // Clear forms
  document.getElementById('form-quiz-id').value = '';
  document.getElementById('form-quiz-title').value = '';
  document.getElementById('form-quiz-desc').value = '';
  document.getElementById('form-quiz-time').value = '';
  document.getElementById('form-quiz-pass').value = '';
  document.getElementById('form-questions-container').innerHTML = '';
}

// Add Dynamic Question inside Modal Form
function addQuestionDOM(questionData = null) {
  const container = document.getElementById('form-questions-container');
  const questionCount = container.children.length + 1;
  
  const qText = questionData ? questionData.text : '';
  const opts = questionData ? questionData.options : ['', '', '', ''];
  const correctIdx = questionData ? questionData.correctIndex : 0;
  const explanation = questionData ? questionData.explanation : '';
  
  const qDiv = document.createElement('div');
  qDiv.className = "question-form-card p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary space-y-3 relative";
  
  qDiv.innerHTML = `
    <button type="button" onclick="this.closest('.question-form-card').remove(); reorderQuestionIndices();" 
      class="absolute top-4 right-4 text-xs text-rose-500 hover:underline font-semibold">
      Remove
    </button>
    
    <div>
      <span class="text-xs font-bold text-neutral-500 font-mono block mb-1">Question #${questionCount}</span>
      <textarea placeholder="Type the question content here..." required
        class="question-text-input w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">${qText}</textarea>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1">Option A</label>
        <input type="text" placeholder="First option choice" value="${opts[0]}" required
          class="option-a-input w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
      </div>
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1">Option B</label>
        <input type="text" placeholder="Second option choice" value="${opts[1]}" required
          class="option-b-input w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
      </div>
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1">Option C</label>
        <input type="text" placeholder="Third option choice" value="${opts[2]}" required
          class="option-c-input w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
      </div>
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1">Option D</label>
        <input type="text" placeholder="Fourth option choice" value="${opts[3]}" required
          class="option-d-input w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1">Correct Answer</label>
        <select class="correct-index-select w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
          <option value="0" ${correctIdx === 0 ? 'selected' : ''}>Option A</option>
          <option value="1" ${correctIdx === 1 ? 'selected' : ''}>Option B</option>
          <option value="2" ${correctIdx === 2 ? 'selected' : ''}>Option C</option>
          <option value="3" ${correctIdx === 3 ? 'selected' : ''}>Option D</option>
        </select>
      </div>
      <div class="md:col-span-2">
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1">Explanation (Optional)</label>
        <input type="text" placeholder="Add educational context for correct answer..." value="${explanation}"
          class="explanation-input w-full p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-neutral-900 dark:text-white">
      </div>
    </div>
  `;
  container.appendChild(qDiv);
}

function reorderQuestionIndices() {
  const cards = document.querySelectorAll('.question-form-card');
  cards.forEach((card, idx) => {
    const span = card.querySelector('span');
    if (span) span.textContent = `Question #${idx + 1}`;
  });
}

// Edit Quiz Callback
function editQuiz(id) {
  const quiz = window.QuizStorage.getQuizById(id);
  if (!quiz) return;

  openQuizModal("Edit Quiz Settings");
  
  document.getElementById('form-quiz-id').value = quiz.id;
  document.getElementById('form-quiz-title').value = quiz.title;
  document.getElementById('form-quiz-desc').value = quiz.description;
  document.getElementById('form-quiz-time').value = quiz.timeLimit;
  document.getElementById('form-quiz-pass').value = quiz.passPercentage;
  
  if (quiz.questions && quiz.questions.length > 0) {
    quiz.questions.forEach(q => addQuestionDOM(q));
  } else {
    addQuestionDOM(); // Seed one empty question card
  }
}

// Save Quiz Callback
function saveQuizForm() {
  const errorBanner = document.getElementById('modal-error-banner');
  errorBanner.classList.add('hidden');

  const id = document.getElementById('form-quiz-id').value || 'quiz_' + Date.now();
  const title = document.getElementById('form-quiz-title').value.trim();
  const description = document.getElementById('form-quiz-desc').value.trim();
  const timeLimit = parseInt(document.getElementById('form-quiz-time').value);
  const passPercentage = parseInt(document.getElementById('form-quiz-pass').value);

  if (!title || !description || isNaN(timeLimit) || isNaN(passPercentage)) {
    showModalError("Please fill out all quiz parameter fields.");
    return;
  }

  const qCards = document.querySelectorAll('.question-form-card');
  if (qCards.length === 0) {
    showModalError("Please include at least one question inside the quiz inventory.");
    return;
  }

  const questionsList = [];
  let questionsValid = true;

  qCards.forEach(card => {
    const text = card.querySelector('.question-text-input').value.trim();
    const optA = card.querySelector('.option-a-input').value.trim();
    const optB = card.querySelector('.option-b-input').value.trim();
    const optC = card.querySelector('.option-c-input').value.trim();
    const optD = card.querySelector('.option-d-input').value.trim();
    const correctIndex = parseInt(card.querySelector('.correct-index-select').value);
    const explanation = card.querySelector('.explanation-input').value.trim();

    if (!text || !optA || !optB || !optC || !optD) {
      questionsValid = false;
      return;
    }

    questionsList.push({
      text,
      options: [optA, optB, optC, optD],
      correctIndex,
      explanation
    });
  });

  if (!questionsValid) {
    showModalError("Please write questions and all option choices completely.");
    return;
  }

  const updatedQuiz = {
    id,
    title,
    description,
    timeLimit,
    passPercentage,
    questions: questionsList
  };

  const success = window.QuizStorage.saveQuiz(updatedQuiz);
  if (success) {
    showToast(id.startsWith('quiz_') && !document.getElementById('form-quiz-id').value ? "Quiz created successfully!" : "Quiz updated successfully!");
    closeQuizModal();
    loadQuizzes();
  } else {
    showModalError("Write access failed. Check localStorage limits.");
  }
}

function showModalError(msg) {
  const banner = document.getElementById('modal-error-banner');
  banner.textContent = msg;
  banner.classList.remove('hidden');
}

// Delete Quiz Functions
let pendingDeleteId = null;
function confirmDelete(id, title) {
  pendingDeleteId = id;
  document.getElementById('delete-quiz-name').textContent = title;
  
  const modal = document.getElementById('delete-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeDeleteModal() {
  document.getElementById('delete-modal').classList.add('hidden');
  document.getElementById('delete-modal').classList.remove('flex');
  pendingDeleteId = null;
}

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
  if (pendingDeleteId) {
    window.QuizStorage.deleteQuiz(pendingDeleteId);
    showToast("Quiz deleted successfully.");
    closeDeleteModal();
    loadQuizzes();
  }
});

// Reset Quizzes to Default Seeds
function resetQuizzes() {
  window.customConfirm("Reset Assessment Seeds?", "Resetting will replace all custom quizzes and restore default seed quizzes. Proceed?").then(approved => {
    if (approved) {
      window.QuizStorage.resetAllQuizzes();
      showToast("Default seed quizzes restored.");
      loadQuizzes();
    }
  });
}

// Toast Alert Helper
function showToast(msg) {
  const toast = document.getElementById('toast-notification');
  if (!toast) {
    console.log(msg);
    return;
  }
  const msgEl = document.getElementById('toast-message');
  if (msgEl) msgEl.textContent = msg;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 50);

  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 300);
  }, 3000);
}
window.showToast = showToast;
window.showToastNotification = showToast;

// Tab switching controller
function switchAdminTab(tabName) {
  const panels = ['quizzes', 'placements', 'users', 'profile', 'site-mgmt'];
  
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

  if (tabName === 'placements') {
    renderAdminPlacements();
  } else if (tabName === 'users') {
    renderUsers();
  } else if (tabName === 'profile') {
    loadAdminProfileForm();
  } else if (tabName === 'site-mgmt') {
    initSiteManagement();
  }
}

// ============================================================
// PLACEMENT DRIVES MANAGEMENT (Admin Exclusive)
// ============================================================

const DEFAULT_SAMPLE_DRIVES = [
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

function getPlacementsData() {
  const storedStr = localStorage.getItem('techprep_placements');
  if (storedStr === null) {
    localStorage.setItem('techprep_placements', JSON.stringify(DEFAULT_SAMPLE_DRIVES));
    return [...DEFAULT_SAMPLE_DRIVES];
  }
  try {
    const parsed = JSON.parse(storedStr);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch {
    return [];
  }
}

function renderAdminPlacements() {
  const container = document.getElementById('admin-placement-list-container');
  if (!container) return;

  const placements = getPlacementsData();
  const searchInput = document.getElementById('admin-placement-search');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const filterSelect = document.getElementById('admin-placement-status-filter');
  const statusFilter = filterSelect ? filterSelect.value : 'all';

  // Calculate Metrics
  const totalDrives = placements.length;
  const openDrives = placements.filter(p => ['applied', 'assessment', 'interview', 'wishlist'].includes(p.status)).length;
  
  const packages = placements.map(p => parseFloat(p.package) || 0).filter(pkg => pkg > 0);
  const highestPkg = packages.length > 0 ? Math.max(...packages) : 0;
  const avgPkg = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0;

  const statTotal = document.getElementById('admin-stat-total-drives');
  if (statTotal) statTotal.textContent = totalDrives;

  const statOpen = document.getElementById('admin-stat-open-drives');
  if (statOpen) statOpen.textContent = openDrives;

  const statHighest = document.getElementById('admin-stat-highest-package');
  if (statHighest) statHighest.textContent = `₹${highestPkg} LPA`;

  const statAvg = document.getElementById('admin-stat-avg-package');
  if (statAvg) statAvg.textContent = `₹${avgPkg} LPA`;

  // Filter Placements
  const filtered = placements.filter(p => {
    const matchesQuery = !query || 
      (p.company && p.company.toLowerCase().includes(query)) ||
      (p.role && p.role.toLowerCase().includes(query)) ||
      (p.eligibility && p.eligibility.toLowerCase().includes(query)) ||
      (p.location && p.location.toLowerCase().includes(query)) ||
      (p.notes && p.notes.toLowerCase().includes(query));

    const matchesStatus = (statusFilter === 'all') || (p.status === statusFilter);

    return matchesQuery && matchesStatus;
  });

  const badgeCount = document.getElementById('admin-placement-count-badge');
  if (badgeCount) {
    badgeCount.textContent = `Showing ${filtered.length} of ${totalDrives} drives`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full text-center py-16 p-8 rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-surface-elevated">
        <svg class="w-12 h-12 text-neutral-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
        </svg>
        <h4 class="text-base font-bold text-neutral-800 dark:text-neutral-200">No placement drives found</h4>
        <p class="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">Try adjusting your search criteria or click "+ Add Placement Drive" to publish a new opening.</p>
        <button onclick="openAdminPlacementModal()" class="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Publish First Drive
        </button>
      </div>
    `;
    return;
  }

  const statusBadges = {
    wishlist: { label: 'Wishlist / Announced', bg: 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700' },
    applied: { label: 'Applied / Open', bg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50' },
    assessment: { label: 'Assessment (OA)', bg: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/50' },
    interview: { label: 'Interview Round', bg: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/50' },
    selected: { label: 'Offer / Selected', bg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50' },
    rejected: { label: 'Closed / Rejected', bg: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800/50' }
  };

  container.innerHTML = filtered.map(p => {
    const badge = statusBadges[p.status] || statusBadges.applied;
    const initial = (p.company || 'C').charAt(0).toUpperCase();

    const formattedDeadline = p.deadline ? new Date(p.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No deadline';
    const formattedInterview = p.interviewDate ? new Date(p.interviewDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

    return `
      <div class="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated hover:border-blue-500/40 hover:shadow-md transition-all flex flex-col justify-between group">
        <div>
          <!-- Company & Status Header -->
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-extrabold text-neutral-700 dark:text-neutral-300 shrink-0 font-mono shadow-sm">
                ${initial}
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-sm text-neutral-900 dark:text-white truncate">${p.company}</h3>
                <p class="text-xs text-neutral-500 truncate">${p.location || 'Pan India / Remote'}</p>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${badge.bg}">
              ${badge.label}
            </span>
          </div>

          <!-- Role & Package -->
          <div class="mb-3">
            <h4 class="font-bold text-sm text-neutral-900 dark:text-white line-clamp-1">${p.role}</h4>
            <div class="flex items-center gap-2 mt-1.5 flex-wrap">
              <span class="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                ${p.package} LPA
              </span>
              ${p.eligibility ? `
                <span class="text-[11px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-700/60 truncate max-w-[180px]" title="${p.eligibility}">
                  ${p.eligibility}
                </span>
              ` : ''}
            </div>
          </div>

          <!-- Dates -->
          <div class="space-y-1 text-xs text-neutral-500 mb-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
            <div class="flex items-center justify-between text-[11px]">
              <span class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg> Deadline:</span>
              <span class="font-medium text-neutral-800 dark:text-neutral-200">${formattedDeadline}</span>
            </div>
            ${formattedInterview ? `
              <div class="flex items-center justify-between text-[11px]">
                <span class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> Interview:</span>
                <span class="font-medium text-amber-700 dark:text-amber-300">${formattedInterview}</span>
              </div>
            ` : ''}
          </div>

          <!-- Notes / Syllabus -->
          ${p.notes ? `
            <p class="text-[11px] text-neutral-600 dark:text-neutral-400 line-clamp-2 italic bg-surface-secondary p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 mb-4">
              "${p.notes}"
            </p>
          ` : ''}
        </div>

        <!-- Action Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800 gap-2">
          ${p.link ? `
            <a href="${p.link}" target="_blank" rel="noopener noreferrer" 
              class="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors inline-flex items-center gap-1">
              <span>Portal Link</span>
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
            </a>
          ` : '<div></div>'}

          <div class="flex items-center gap-1.5">
            <button onclick="event.stopPropagation(); openAdminPlacementModal('${p.id}')" 
              class="px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
              <span>Edit</span>
            </button>
            <button onclick="event.stopPropagation(); deleteAdminPlacement('${p.id}')" 
              class="p-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 transition-colors" title="Delete Drive">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

window.openAdminPlacementModal = function(id = null) {
  const overlay = document.getElementById('admin-placement-modal-overlay');
  const titleEl = document.getElementById('admin-placement-modal-title');
  const saveBtn = document.getElementById('admin-save-placement-btn');
  const errorBanner = document.getElementById('admin-placement-error-banner');

  if (!overlay) return;
  if (errorBanner) errorBanner.classList.add('hidden');

  if (id) {
    const placements = getPlacementsData();
    const drive = placements.find(p => String(p.id) === String(id));
    if (drive) {
      document.getElementById('admin-placement-id').value = drive.id;
      document.getElementById('admin-placement-company').value = drive.company || '';
      document.getElementById('admin-placement-role').value = drive.role || '';
      document.getElementById('admin-placement-package').value = drive.package || '';
      document.getElementById('admin-placement-eligibility').value = drive.eligibility || '';
      document.getElementById('admin-placement-location').value = drive.location || '';
      document.getElementById('admin-placement-status').value = drive.status || 'applied';
      document.getElementById('admin-placement-deadline').value = drive.deadline || '';
      document.getElementById('admin-placement-interview-date').value = drive.interviewDate || '';
      document.getElementById('admin-placement-link').value = drive.link || '';
      document.getElementById('admin-placement-notes').value = drive.notes || '';

      if (titleEl) titleEl.innerHTML = `<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> Edit Placement Drive`;
      if (saveBtn) saveBtn.textContent = 'Update Drive';
    }
  } else {
    document.getElementById('admin-placement-id').value = '';
    document.getElementById('admin-placement-company').value = '';
    document.getElementById('admin-placement-role').value = '';
    document.getElementById('admin-placement-package').value = '';
    document.getElementById('admin-placement-eligibility').value = '';
    document.getElementById('admin-placement-location').value = '';
    document.getElementById('admin-placement-status').value = 'applied';
    document.getElementById('admin-placement-deadline').value = '';
    document.getElementById('admin-placement-interview-date').value = '';
    document.getElementById('admin-placement-link').value = '';
    document.getElementById('admin-placement-notes').value = '';

    if (titleEl) titleEl.innerHTML = `<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg> Add Placement Drive`;
    if (saveBtn) saveBtn.textContent = 'Publish Drive';
  }

  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
};

window.closeAdminPlacementModal = function() {
  const overlay = document.getElementById('admin-placement-modal-overlay');
  if (!overlay) return;

  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
};

window.saveAdminPlacement = function() {
  const id = document.getElementById('admin-placement-id').value;
  const company = document.getElementById('admin-placement-company').value.trim();
  const role = document.getElementById('admin-placement-role').value.trim();
  const pkg = document.getElementById('admin-placement-package').value.trim();
  const eligibility = document.getElementById('admin-placement-eligibility').value.trim();
  const location = document.getElementById('admin-placement-location').value.trim();
  const status = document.getElementById('admin-placement-status').value;
  const deadline = document.getElementById('admin-placement-deadline').value;
  const interviewDate = document.getElementById('admin-placement-interview-date').value;
  const link = document.getElementById('admin-placement-link').value.trim();
  const notes = document.getElementById('admin-placement-notes').value.trim();
  const errorBanner = document.getElementById('admin-placement-error-banner');

  if (!company || !role || !pkg) {
    if (errorBanner) {
      errorBanner.textContent = "Please provide Company Name, Job Role, and Package (LPA).";
      errorBanner.classList.remove('hidden');
    }
    showToast("Please fill in all required fields.");
    return;
  }

  let placements = getPlacementsData();

  if (id) {
    // Update existing drive
    const idx = placements.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      placements[idx] = {
        ...placements[idx],
        company,
        role,
        package: pkg,
        eligibility,
        location,
        status,
        deadline,
        interviewDate,
        link,
        notes,
        statusUpdatedAt: new Date().toISOString()
      };
      showToast("Placement drive updated successfully!");
    }
  } else {
    // Create new drive
    const newDrive = {
      id: `drive-${Date.now()}`,
      company,
      role,
      package: pkg,
      eligibility,
      location,
      status,
      deadline,
      interviewDate,
      link,
      notes,
      isArchived: false,
      createdAt: new Date().toISOString(),
      appliedDate: new Date().toISOString().split('T')[0],
      statusUpdatedAt: new Date().toISOString()
    };
    placements.unshift(newDrive);
    showToast("New placement drive published successfully!");
  }

  localStorage.setItem('techprep_placements', JSON.stringify(placements));
  closeAdminPlacementModal();
  renderAdminPlacements();
};

window.deleteAdminPlacement = function(id) {
  const doDelete = () => {
    let placements = getPlacementsData();
    placements = placements.filter(p => String(p.id) !== String(id));
    localStorage.setItem('techprep_placements', JSON.stringify(placements));

    if (window.showToast) window.showToast("Placement drive deleted successfully", "success");
    renderAdminPlacements();
  };

  if (window.customConfirm) {
    window.customConfirm("Delete Placement Drive", "Are you sure you want to delete this placement drive?").then(yes => {
      if (yes) doDelete();
    });
  } else {
    doDelete();
  }
};

window.exportAdminPlacements = function() {
  const placements = getPlacementsData();
  const dataStr = JSON.stringify(placements, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `TechPrepAI_Placement_Drives_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  showToast("Placement drives exported (.json)");
};

window.importAdminPlacements = function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!Array.isArray(data)) {
        throw new Error("Invalid format: expected array of placement drives.");
      }
      localStorage.setItem('techprep_placements', JSON.stringify(data));
      renderAdminPlacements();
      showToast("Placement drives imported successfully!");
    } catch {
      showToast("Import failed: Invalid JSON schema");
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
};

// Expose functions to window
window.renderAdminPlacements = renderAdminPlacements;

// User Directory Operations
function renderUsers() {
  const users = JSON.parse(localStorage.getItem('techprep_registered_users') || '[]');
  const searchQuery = document.getElementById('user-search').value.trim().toLowerCase();
  
  const students = users.filter(u => u.email !== 'khushboo2006june@admin.com');
  
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery) || 
    s.email.toLowerCase().includes(searchQuery)
  );

  document.getElementById('user-results-count').textContent = `Showing ${filtered.length} of ${students.length} users`;

  const listContainer = document.getElementById('user-list-container');
  listContainer.innerHTML = '';

  if (filtered.length === 0) {
    listContainer.innerHTML = '<p class="text-xs text-neutral-500 py-8 text-center bg-surface-secondary border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl">No matching students found.</p>';
    renderUsersMetrics(students);
    return;
  }

  filtered.forEach((student, index) => {
    const completeness = window.checkProfileCompleteness ? window.checkProfileCompleteness(student) : { percentage: 0 };
    const attempts = JSON.parse(localStorage.getItem('techprep_user_quiz_results_' + student.email) || '[]');

    const card = document.createElement('div');
    card.className = "p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4 text-left transition-all hover:border-neutral-300 dark:hover:border-neutral-700";
    
    const avatarHTML = student.profilePic 
      ? `<img src="${student.profilePic}" alt="${student.name}" class="w-10 h-10 rounded-full object-cover">`
      : `<div class="w-10 h-10 rounded-full bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold font-mono text-sm">${student.name.substring(0,2).toUpperCase()}</div>`;

    const suspendedBadge = student.suspended 
      ? `<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono tracking-wider border bg-rose-500/10 text-rose-600 border-rose-500/20">Suspended</span>`
      : `<span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono tracking-wider border bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Active</span>`;

    card.innerHTML = `
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center space-x-3.5">
          ${avatarHTML}
          <div>
            <h3 class="text-sm font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
              ${student.name}
              ${suspendedBadge}
            </h3>
            <p class="text-xs text-neutral-500 mt-0.5">${student.email}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <div class="text-right font-sans">
            <span class="text-[10px] font-bold text-neutral-400 font-mono uppercase block">Completeness</span>
            <span class="text-xs font-bold text-blue-600 dark:text-blue-400">${completeness.percentage}%</span>
          </div>
          <button onclick="toggleDetails('detail-${index}')" class="p-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            View Details
          </button>
        </div>
      </div>

      <!-- Expanded Profile Details Container -->
      <div id="detail-${index}" class="hidden pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          <!-- Basic Contact & Links -->
          <div class="space-y-2">
            <h4 class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Contact & Links</h4>
            <div class="space-y-1 text-xs">
              <div>Contact: <strong class="text-neutral-900 dark:text-white">${student.contact || 'N/A'}</strong></div>
              <div>DOB: <strong class="text-neutral-900 dark:text-white">${student.dob || 'N/A'}</strong></div>
              <div>Address: <strong class="text-neutral-900 dark:text-white">${student.address || 'N/A'}</strong></div>
              <div class="flex space-x-2.5 mt-2.5 text-[10px] font-mono">
                ${student.leetcode ? `<a href="${student.leetcode}" target="_blank" class="text-blue-500 hover:underline">Coding Profile</a>` : ''}
                ${student.github ? `<a href="${student.github}" target="_blank" class="text-blue-500 hover:underline">GitHub</a>` : ''}
                ${student.linkedin ? `<a href="${student.linkedin}" target="_blank" class="text-blue-500 hover:underline">LinkedIn</a>` : ''}
                ${student.portfolio ? `<a href="${student.portfolio}" target="_blank" class="text-blue-500 hover:underline">Portfolio</a>` : ''}
              </div>
            </div>
          </div>

          <!-- Academic credentials -->
          <div class="space-y-2">
            <h4 class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Academics</h4>
            <div class="space-y-1 text-xs">
              <div>College: <strong class="text-neutral-900 dark:text-white">${student.college || 'N/A'}</strong></div>
              <div>Degree: <strong class="text-neutral-900 dark:text-white">${student.degree || 'N/A'} (${student.gradYear || 'N/A'})</strong></div>
              <div>Branch: <strong class="text-neutral-900 dark:text-white">${student.branch || 'N/A'}</strong></div>
              <div>CGPA: <strong class="text-blue-600 dark:text-blue-400 font-mono">${student.cgpa || 'N/A'}</strong></div>
              <div>10th / 12th: <strong class="text-neutral-900 dark:text-white font-mono">${student.marks10 ? student.marks10 + '%' : 'N/A'} / ${student.marks12 ? student.marks12 + '%' : 'N/A'}</strong></div>
            </div>
          </div>

          <!-- Skills & Profile Control actions -->
          <div class="space-y-3">
            <div class="space-y-1">
              <h4 class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Skills</h4>
              <p class="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">${student.skills || 'No skills added yet.'}</p>
            </div>

            <div class="space-y-1">
              <h4 class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Date Registered</h4>
              <p class="text-xs font-mono text-neutral-500">${student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>

        </div>

        <!-- Quiz Attempts list -->
        <div class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/60">
          <h4 class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Attempt History (${attempts.length} attempts)</h4>
          ${attempts.length === 0 
            ? '<p class="text-[10px] text-neutral-500 font-mono italic">No quiz attempts recorded yet.</p>'
            : `
            <div class="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800/60 text-[10px]">
              <table class="w-full text-left">
                <thead>
                  <tr class="bg-surface-secondary/70 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono">
                    <th class="p-2 font-semibold">Date</th>
                    <th class="p-2 font-semibold">Quiz</th>
                    <th class="p-2 font-semibold">Score</th>
                    <th class="p-2 font-semibold">Warnings</th>
                    <th class="p-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/40">
                  ${attempts.map(att => `
                    <tr>
                      <td class="p-2 text-neutral-500">${new Date(att.timestamp).toLocaleDateString()}</td>
                      <td class="p-2 font-semibold">${att.quizTitle}</td>
                      <td class="p-2 font-mono">${att.scorePercent}%</td>
                      <td class="p-2 text-amber-500 font-semibold font-mono">${att.violations || 0}</td>
                      <td class="p-2 font-semibold ${att.status === 'PASSED' ? 'text-emerald-500' : 'text-rose-500'}">${att.status}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>

        <!-- DSA IDE Submissions & Solved Activity (User-Wise) -->
        <div class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/60">
          <div class="flex items-center justify-between">
            <h4 class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
              DSA Code IDE Activity (${(JSON.parse(localStorage.getItem('techprep_dsa_progress_' + student.email) || '{"solved":[]}').solved || []).length} Solved Problems)
            </h4>
          </div>
          ${(() => {
            const allSubs = JSON.parse(localStorage.getItem('techprep_dsa_submissions') || '[]');
            const userSubs = allSubs.filter(s => s.userEmail === student.email);
            if (!userSubs.length) return '<p class="text-[10px] text-neutral-500 font-mono italic">No DSA IDE code submissions recorded yet for this student.</p>';
            
            return `
              <div class="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800/60 text-[10px]">
                <table class="w-full text-left">
                  <thead>
                    <tr class="bg-surface-secondary/70 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono">
                      <th class="p-2 font-semibold">Date</th>
                      <th class="p-2 font-semibold">Problem Title</th>
                      <th class="p-2 font-semibold">Difficulty</th>
                      <th class="p-2 font-semibold">Language</th>
                      <th class="p-2 font-semibold">Runtime</th>
                      <th class="p-2 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/40">
                    ${userSubs.slice(0, 10).map(s => `
                      <tr>
                        <td class="p-2 text-neutral-500">${new Date(s.timestamp).toLocaleDateString()} ${new Date(s.timestamp).toLocaleTimeString()}</td>
                        <td class="p-2 font-semibold">${s.problemTitle || 'DSA Problem'}</td>
                        <td class="p-2 font-mono">${s.difficulty || 'Easy'}</td>
                        <td class="p-2 font-mono uppercase text-blue-500">${s.language || 'js'}</td>
                        <td class="p-2 font-mono">${s.runtimeMs || 12} ms</td>
                        <td class="p-2 font-semibold ${s.status === 'Accepted' ? 'text-emerald-500' : 'text-rose-500'}">${s.status}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>`;
          })()}
        <!-- Campus Placement Applications & Pipeline Status (User-Wise) -->
        <div class="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800/60">
          ${(() => {
            const userPlacements = JSON.parse(localStorage.getItem('techprep_user_placements_' + student.email) || '[]');
            return `
              <div class="flex items-center justify-between">
                <h4 class="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">
                  Placement Applications (${userPlacements.length} Total)
                </h4>
              </div>
              ${userPlacements.length === 0 
                ? '<p class="text-[10px] text-neutral-500 font-mono italic">No placement applications tracked yet for this student.</p>'
                : `
                <div class="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800/60 text-[10px]">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="bg-surface-secondary/70 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 font-mono">
                        <th class="p-2 font-semibold">Company</th>
                        <th class="p-2 font-semibold">Role</th>
                        <th class="p-2 font-semibold">CTC</th>
                        <th class="p-2 font-semibold">Status</th>
                        <th class="p-2 font-semibold">Applied Date</th>
                        <th class="p-2 font-semibold">Interview Date</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-neutral-200 dark:divide-neutral-800/40">
                      ${userPlacements.map(p => `
                        <tr>
                          <td class="p-2 font-semibold text-neutral-900 dark:text-white">${escapeHTML(p.company || 'Company')}</td>
                          <td class="p-2">${escapeHTML(p.role || 'N/A')}</td>
                          <td class="p-2 font-mono text-emerald-600 dark:text-emerald-400">${p.package ? p.package + ' LPA' : 'N/A'}</td>
                          <td class="p-2">
                            <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono tracking-wider ${
                              p.status === 'selected' ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' :
                              p.status === 'interview' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                              p.status === 'assessment' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' :
                              p.status === 'rejected' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' :
                              'bg-blue-500/10 text-blue-600 border border-blue-500/20'
                            }">
                              ${escapeHTML(p.status || 'applied')}
                            </span>
                          </td>
                          <td class="p-2 text-neutral-500 font-mono">${p.appliedDate ? new Date(p.appliedDate).toLocaleDateString() : 'N/A'}</td>
                          <td class="p-2 text-neutral-500 font-mono">${p.interviewDate ? new Date(p.interviewDate).toLocaleDateString() : '—'}</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                </div>
              `}
            `;
          })()}
        </div>

        <!-- Administrative actions row -->
        <div class="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg mt-4">
          <div class="flex items-center gap-2 w-full sm:w-auto">
            <input type="password" id="reset-pwd-${index}" placeholder="New password"
              class="p-2 rounded border border-neutral-300 dark:border-neutral-700 bg-surface-primary text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500 w-36">
            <button onclick="handleAdminResetPassword('${student.email}', 'reset-pwd-${index}')" class="px-3.5 py-2 rounded bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:opacity-90 font-semibold transition-colors">
              Reset Password
            </button>
          </div>

          <button onclick="toggleUserSuspension('${student.email}')" 
            class="px-4 py-2 rounded font-semibold transition-colors w-full sm:w-auto border ${
              student.suspended 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-rose-600/10 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-500/20'
            }">
            ${student.suspended ? 'Activate Account' : 'Suspend Account'}
          </button>
        </div>

      </div>
    `;
    listContainer.appendChild(card);
  });

  renderUsersMetrics(students);
}

function toggleDetails(id) {
  const detail = document.getElementById(id);
  if (detail) {
    detail.classList.toggle('hidden');
  }
}

// Telemetry Statistics Calculators & CSS charts rendering
function renderUsersMetrics(students) {
  let completeCount = 0;
  let incompleteCount = 0;
  let activeCount = 0;
  let suspendedCount = 0;
  let totalCgpa = 0;
  let cgpaUsers = 0;

  students.forEach(s => {
    const check = window.checkProfileCompleteness ? window.checkProfileCompleteness(s) : { complete: false };
    if (check.complete) completeCount++;
    else incompleteCount++;

    if (s.suspended) suspendedCount++;
    else activeCount++;

    if (s.cgpa && !isNaN(parseFloat(s.cgpa))) {
      totalCgpa += parseFloat(s.cgpa);
      cgpaUsers++;
    }
  });

  const totalStudents = students.length || 1;
  const completePct = Math.round((completeCount / totalStudents) * 100);
  const incompletePct = Math.round((incompleteCount / totalStudents) * 100);
  const activePct = Math.round((activeCount / totalStudents) * 100);
  const suspendedPct = Math.round((suspendedCount / totalStudents) * 100);

  document.getElementById('chart-complete-count').textContent = completeCount;
  document.getElementById('chart-complete-bar').style.width = `${completePct}%`;
  
  document.getElementById('chart-incomplete-count').textContent = incompleteCount;
  document.getElementById('chart-incomplete-bar').style.width = `${incompletePct}%`;

  document.getElementById('chart-active-count').textContent = activeCount;
  document.getElementById('chart-active-bar').style.width = `${activePct}%`;

  document.getElementById('chart-suspended-count').textContent = suspendedCount;
  document.getElementById('chart-suspended-bar').style.width = `${suspendedPct}%`;

  const avgCgpa = cgpaUsers ? (totalCgpa / cgpaUsers).toFixed(2) : '0.00';
  document.getElementById('metrics-avg-cgpa').textContent = avgCgpa;

  let totalAttemptsCount = 0;
  const users = JSON.parse(localStorage.getItem('techprep_registered_users') || '[]');
  users.forEach(u => {
    const userAttempts = JSON.parse(localStorage.getItem('techprep_user_quiz_results_' + u.email) || '[]');
    totalAttemptsCount += userAttempts.length;
  });
  const guestAttempts = JSON.parse(localStorage.getItem('techprep_user_quiz_results_guest') || '[]');
  totalAttemptsCount += guestAttempts.length;
  
  document.getElementById('metrics-total-attempts').textContent = totalAttemptsCount;
}

// Administrative suspension toggler
function toggleUserSuspension(email) {
  const users = JSON.parse(localStorage.getItem('techprep_registered_users') || '[]');
  const userIdx = users.findIndex(u => u.email === email);
  if (userIdx > -1) {
    const isSuspended = !!users[userIdx].suspended;
    users[userIdx].suspended = !isSuspended;
    localStorage.setItem('techprep_registered_users', JSON.stringify(users));
    showToast(isSuspended ? "Account activated successfully." : "Account suspended successfully.");
    renderUsers();
  }
}

// Administrative password resetter
function handleAdminResetPassword(email, inputId) {
  const pwdInput = document.getElementById(inputId);
  const newPwd = pwdInput ? pwdInput.value : '';
  if (!newPwd || newPwd.length < 6) {
    window.customAlert("Validation Error", "Please enter a valid password (at least 6 characters).", "warning");
    return;
  }

  const users = JSON.parse(localStorage.getItem('techprep_registered_users') || '[]');
  const userIdx = users.findIndex(u => u.email === email);
  if (userIdx > -1) {
    users[userIdx].password = newPwd;
    localStorage.setItem('techprep_registered_users', JSON.stringify(users));
    showToast("Password updated successfully.");
    pwdInput.value = '';
  }
}

// Admin profile settings page controller
function loadAdminProfileForm() {
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (!currentUser) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('admin-profile-name', currentUser.name);
  setVal('admin-profile-email', currentUser.email);
  setVal('admin-profile-pic-data', currentUser.profilePic);
  setVal('admin-profile-contact', currentUser.contact);
  setVal('admin-profile-dob', currentUser.dob);
  setVal('admin-profile-address', currentUser.address);
  setVal('admin-profile-college', currentUser.college);
  setVal('admin-profile-degree', currentUser.degree);
  setVal('admin-profile-branch', currentUser.branch);
  setVal('admin-profile-specialization', currentUser.specialization);

  const preview = document.getElementById('admin-profile-preview-container');
  if (preview) {
    if (currentUser.profilePic && currentUser.profilePic.trim() !== '') {
      preview.innerHTML = `<img src="${currentUser.profilePic}" alt="Avatar" class="w-full h-full object-cover">`;
    } else {
      preview.textContent = currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'A';
    }
  }
  const msg = document.getElementById('admin-profile-success-msg');
  if (msg) msg.classList.add('hidden');
}

// FileReader listener & Auth Guard for admin profile pic
document.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (!currentUser || currentUser.email !== 'khushboo2006june@admin.com') {
    window.location.href = '../public/login.html';
    return;
  }

  const fileInput = document.getElementById('admin-profile-pic-file');
  if (fileInput) {
    fileInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64Str = evt.target.result;
        const picInput = document.getElementById('admin-profile-pic-data');
        if (picInput) picInput.value = base64Str;
        const preview = document.getElementById('admin-profile-preview-container');
        if (preview) preview.innerHTML = `<img src="${base64Str}" alt="Avatar" class="w-full h-full object-cover">`;
      };
      reader.readAsDataURL(file);
    });
  }

  const editForm = document.getElementById('admin-profile-edit-form');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
      };

      const name = getVal('admin-profile-name');
      const pic = getVal('admin-profile-pic-data');
      const contact = getVal('admin-profile-contact');
      const dob = document.getElementById('admin-profile-dob') ? document.getElementById('admin-profile-dob').value : '';
      const address = getVal('admin-profile-address');
      const college = getVal('admin-profile-college');
      const degree = getVal('admin-profile-degree');
      const branch = getVal('admin-profile-branch');
      const specialization = getVal('admin-profile-specialization');

      if (!name) {
        window.customAlert("Validation Error", "Admin Display Name is required.", "warning");
        return;
      }

      const user = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
      if (!user) return;

      user.name = name;
      user.profilePic = pic;
      user.contact = contact;
      user.dob = dob;
      user.address = address;
      user.college = college;
      user.degree = degree;
      user.branch = branch;
      user.specialization = specialization;

      localStorage.setItem('techprep_current_user', JSON.stringify(user));

      if (window.syncUserAvatar) {
        window.syncUserAvatar(user);
      }

      const msg = document.getElementById('admin-profile-success-msg');
      if (msg) {
        msg.classList.remove('hidden');
        setTimeout(() => {
          msg.classList.add('hidden');
        }, 3000);
      }

      logSystemEvent('SUCCESS', 'Admin updated profile details');
    });
  }

  // Auto-init default logs & FAQs if empty
  initDefaultSiteMgmtData();
});

/* ==========================================================================
   SITE MANAGEMENT CONSOLE CONTROLLER & LOGIC
   ========================================================================== */

function initDefaultSiteMgmtData() {
  if (!localStorage.getItem('techprep_faqs')) {
    const defaultFAQs = [
      {
        id: 'faq_1',
        category: 'Platform Access',
        question: 'Is TechPrep AI free for engineering students?',
        answer: 'Yes! TechPrep AI offers a comprehensive free tier that includes access to the core 350 DSA roadmap, 5 ATS resume scans per month, and campus placement application tracking. Advanced features are unlocked with TechPrep Pro.'
      },
      {
        id: 'faq_2',
        category: 'ATS Resume',
        question: 'How does the ATS Resume Scoring engine work?',
        answer: 'Our ATS engine simulates parsing algorithms used by Enterprise ATS software (Workday, Greenhouse, Lever). It extracts technical skills, verifies bullet structure impact, measures keyword density against job descriptions, and checks for unparseable columns or tables.'
      },
      {
        id: 'faq_3',
        category: 'Placement',
        question: 'Can I track college campus placement eligibility?',
        answer: 'Absolutely. You can input your branch, CGPA, and backlog history to filter companies that meet your specific college placement office eligibility rules.'
      },
      {
        id: 'faq_4',
        category: 'DSA Practice',
        question: 'How is the DSA roadmap structured?',
        answer: 'The DSA roadmap is grouped by pattern rather than topic order. It covers Arrays, Strings, Hashing, Two Pointers, Sliding Window, Stacks/Queues, Trees, Graphs, Heap/Priority Queue, and Dynamic Programming with complexity analysis.'
      }
    ];
    localStorage.setItem('techprep_faqs', JSON.stringify(defaultFAQs));
  }

  if (!localStorage.getItem('techprep_audit_logs')) {
    const defaultLogs = [
      { timestamp: new Date().toISOString(), level: 'INFO', message: 'System initialized TechPrep AI Admin Console', performer: 'System Engine' },
      { timestamp: new Date(Date.now() - 3600000).toISOString(), level: 'SUCCESS', message: 'Admin Khushboo logged into Admin Hub', performer: 'Khushboo (Admin)' },
      { timestamp: new Date(Date.now() - 7200000).toISOString(), level: 'INFO', message: 'Default seed quizzes synchronized', performer: 'System Engine' }
    ];
    localStorage.setItem('techprep_audit_logs', JSON.stringify(defaultLogs));
  }
}

function initSiteManagement() {
  switchSiteMgmtSubTab('faq');
}

function switchSiteMgmtSubTab(subName) {
  const subs = ['faq', 'db', 'security', 'logs'];
  
  subs.forEach(s => {
    const panelEl = document.getElementById(`site-sub-panel-${s}`);
    const btnEl = document.getElementById(`site-sub-btn-${s}`);

    if (s === subName) {
      if (panelEl) {
        panelEl.classList.remove('hidden');
        panelEl.classList.add('block');
      }
      if (btnEl) {
        btnEl.className = "px-4 py-2 rounded-lg font-semibold transition-all bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-sm";
      }
    } else {
      if (panelEl) {
        panelEl.classList.add('hidden');
        panelEl.classList.remove('block');
      }
      if (btnEl) {
        btnEl.className = "px-4 py-2 rounded-lg font-semibold transition-all text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800";
      }
    }
  });

  if (subName === 'faq') {
    renderAdminFAQs();
  } else if (subName === 'db') {
    updateDBTelemetry();
  } else if (subName === 'security') {
    loadSecuritySettings();
  } else if (subName === 'logs') {
    renderAuditLogs();
  }
}

/* --- 1. FAQ MANAGER --- */
function getFAQs() {
  const raw = localStorage.getItem('techprep_faqs');
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {}
  }
  // Default seed FAQs
  const defaultFAQs = [
    { id: 'faq_1', category: 'Platform Overview', question: 'How does TechPrep AI prepare students for tier-1 tech placements?', answer: 'TechPrep AI integrates real-time ATS resume auditing, structured DSA sheet roadmaps with in-browser execution, adaptive technical quizzes with instant grading, and campus placement tracking pipelines.' },
    { id: 'faq_2', category: 'ATS Resume Studio', question: 'What makes the TechPrep AI ATS Resume Builder compliant with applicant tracking systems?', answer: 'Our templates use single-column ATS-standard HTML/CSS hierarchy, standard section headers, quantified metrics checking, and high-impact action verbs.' },
    { id: 'faq_3', category: 'DSA Practice', question: 'Can I execute code directly in the DSA IDE without installing local compilers?', answer: 'Yes! The in-browser DSA IDE executes JavaScript, Python, C++, and Java code with real-time test case verification and complexity benchmarks.' },
    { id: 'faq_4', category: 'Placements Tracker', question: 'How does the Placement Tracker isolate student data?', answer: 'Every student account manages their own personal application pipeline (Wishlist, Applied, OA, Interview, Offer) under isolated storage keys.' },
    { id: 'faq_5', category: 'Account & Security', question: 'How do I access the Admin Console?', answer: 'Administrators log in using verified credentials (khushboo2006june@admin.com / khushboo) to access user management, placement drives, quiz authoring, and site configuration.' },
    { id: 'faq_6', category: 'Technical Quizzes', question: 'Are quiz results saved across student sessions?', answer: 'Yes, full quiz performance history, time spent, question breakdowns, and pass/fail certificates are saved in user session storage.' }
  ];
  localStorage.setItem('techprep_faqs', JSON.stringify(defaultFAQs));
  return defaultFAQs;
}

function saveFAQs(faqs) {
  localStorage.setItem('techprep_faqs', JSON.stringify(faqs));
}

function renderAdminFAQs() {
  const container = document.getElementById('admin-faq-list');
  if (!container) return;

  const faqs = getFAQs();
  const search = (document.getElementById('faq-search-input')?.value || '').trim().toLowerCase();

  const filtered = faqs.filter(f => 
    f.category.toLowerCase().includes(search) || 
    f.question.toLowerCase().includes(search) || 
    f.answer.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="text-center py-12 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-xl bg-surface-secondary">
        <p class="text-xs text-neutral-500">No FAQs match your search criteria.</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(f => `
    <div class="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated space-y-3 shadow-sm">
      <div class="flex items-center justify-between">
        <span class="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          ${escapeHTML(f.category || 'General')}
        </span>
        <div class="flex items-center space-x-2">
          <button onclick="openFAQModal('${f.id}')" class="px-2.5 py-1 text-xs rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors font-medium">
            Edit
          </button>
          <button onclick="deleteFAQ('${f.id}')" class="px-2.5 py-1 text-xs rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-colors font-medium">
            Delete
          </button>
        </div>
      </div>
      <h3 class="font-bold text-sm text-neutral-900 dark:text-white">${escapeHTML(f.question)}</h3>
      <p class="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">${escapeHTML(f.answer)}</p>
    </div>
  `).join('');
}

function openFAQModal(faqId) {
  const modal = document.getElementById('faq-modal');
  const title = document.getElementById('faq-modal-title');
  const idInput = document.getElementById('faq-form-id');
  const catInput = document.getElementById('faq-form-category');
  const qInput = document.getElementById('faq-form-question');
  const aInput = document.getElementById('faq-form-answer');

  if (!modal) return;

  if (faqId) {
    const faqs = getFAQs();
    const faq = faqs.find(f => f.id === faqId);
    if (faq) {
      if (title) title.textContent = 'Edit FAQ Entry';
      if (idInput) idInput.value = faq.id;
      if (catInput) catInput.value = faq.category || 'General';
      if (qInput) qInput.value = faq.question;
      if (aInput) aInput.value = faq.answer;
    }
  } else {
    if (title) title.textContent = 'Add FAQ Entry';
    if (idInput) idInput.value = '';
    if (catInput) catInput.value = 'General';
    if (qInput) qInput.value = '';
    if (aInput) aInput.value = '';
  }

  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeFAQModal() {
  const modal = document.getElementById('faq-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

function saveFAQForm(e) {
  e.preventDefault();
  const id = document.getElementById('faq-form-id').value;
  const category = document.getElementById('faq-form-category').value.trim();
  const question = document.getElementById('faq-form-question').value.trim();
  const answer = document.getElementById('faq-form-answer').value.trim();

  if (!question || !answer) {
    window.customAlert("Validation Error", "Question and Answer cannot be empty.", "warning");
    return;
  }

  let faqs = getFAQs();
  if (id) {
    const idx = faqs.findIndex(f => f.id === id);
    if (idx !== -1) {
      faqs[idx] = { id, category, question, answer };
      logSystemEvent('SUCCESS', `Updated FAQ entry: "${question.substring(0, 30)}..."`);
    }
  } else {
    const newId = 'faq_' + Date.now();
    faqs.push({ id: newId, category, question, answer });
    logSystemEvent('SUCCESS', `Created new FAQ entry: "${question.substring(0, 30)}..."`);
  }

  saveFAQs(faqs);
  closeFAQModal();
  renderAdminFAQs();
  showToastNotification("FAQ updated successfully");
}

function deleteFAQ(faqId) {
  const doDelete = () => {
    let faqs = getFAQs();
    const faq = faqs.find(f => f.id === faqId);
    faqs = faqs.filter(f => f.id !== faqId);
    saveFAQs(faqs);
    renderAdminFAQs();
    if (window.showToast) window.showToast("FAQ deleted", "success");
    logSystemEvent('WARNING', `Deleted FAQ: "${faq ? faq.question.substring(0, 30) : faqId}"`);
  };

  if (window.customConfirm) {
    window.customConfirm("Delete FAQ", "Are you sure you want to delete this FAQ entry?").then(yes => {
      if (yes) doDelete();
    });
  } else {
    doDelete();
  }
}

/* --- 2. DATABASE BACKUP & RESTORE --- */
function updateDBTelemetry() {
  const quizzes = getQuizzes();
  const users = JSON.parse(localStorage.getItem('techprep_registered_users') || '[]');
  const attempts = JSON.parse(localStorage.getItem('techprep_attempt_history') || '[]');
  const faqs = getFAQs();
  const logs = getAuditLogs();

  const totalRecords = quizzes.length + users.length + attempts.length + faqs.length + logs.length;
  
  let jsonString = '';
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('techprep_')) {
      jsonString += localStorage.getItem(k) || '';
    }
  }
  const bytes = new Blob([jsonString]).size;
  const kb = (bytes / 1024).toFixed(1);

  const recordsEl = document.getElementById('db-total-records');
  const sizeEl = document.getElementById('db-storage-size');

  if (recordsEl) recordsEl.textContent = totalRecords.toString();
  if (sizeEl) sizeEl.textContent = `${kb} KB`;
}

function exportDatabaseBackup() {
  const backupData = {
    version: '1.0',
    exportTimestamp: new Date().toISOString(),
    quizzes: getQuizzes(),
    users: JSON.parse(localStorage.getItem('techprep_registered_users') || '[]'),
    attempts: JSON.parse(localStorage.getItem('techprep_attempt_history') || '[]'),
    faqs: getFAQs(),
    securityConfig: JSON.parse(localStorage.getItem('techprep_security_config') || '{}'),
    auditLogs: getAuditLogs()
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `techprep_db_backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  if (window.showToast) window.showToast("Database backup exported successfully", "success");
  logSystemEvent('SUCCESS', 'Exported full JSON database backup');
}

function importDatabaseBackup(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.quizzes || !Array.isArray(data.quizzes)) {
        if (window.customAlert) window.customAlert("Restore Error", "Invalid backup file schema: missing quizzes collection.", "error");
        return;
      }

      const doRestore = () => {
        if (data.quizzes) saveQuizzes(data.quizzes);
        if (data.users) localStorage.setItem('techprep_registered_users', JSON.stringify(data.users));
        if (data.attempts) localStorage.setItem('techprep_attempt_history', JSON.stringify(data.attempts));
        if (data.faqs) saveFAQs(data.faqs);
        if (data.securityConfig) localStorage.setItem('techprep_security_config', JSON.stringify(data.securityConfig));
        if (data.auditLogs) localStorage.setItem('techprep_audit_logs', JSON.stringify(data.auditLogs));

        updateDBTelemetry();
        if (window.showToast) window.showToast("Database restored successfully", "success");
        logSystemEvent('SUCCESS', `Restored database from JSON file (${file.name})`);
      };

      if (window.customConfirm) {
        window.customConfirm("Restore Database", `Restore database from backup (${data.quizzes.length} quizzes, ${data.users ? data.users.length : 0} users)? This will replace current site data.`).then(yes => {
          if (yes) doRestore();
        });
      } else {
        doRestore();
      }
    } catch (err) {
      if (window.customAlert) window.customAlert("Restore Error", "Failed to parse JSON backup file: " + err.message, "error");
    }
  };
  reader.readAsText(file);
  input.value = '';
}

function confirmResetDatabase() {
  const doReset = () => {
    localStorage.removeItem('techprep_quizzes');
    localStorage.removeItem('techprep_attempt_history');
    localStorage.removeItem('techprep_faqs');
    localStorage.removeItem('techprep_audit_logs');
    
    initDefaultSiteMgmtData();
    updateDBTelemetry();
    if (window.showToast) window.showToast("Database reset to factory seeds", "warning");
    logSystemEvent('WARNING', 'Performed full factory database reset');
  };

  if (window.customConfirm) {
    window.customConfirm("Reset Database", "DANGER: Are you sure you want to reset the database to factory defaults? All custom quizzes, student history, and logs will be reset.").then(yes => {
      if (yes) doReset();
    });
  } else {
    doReset();
  }
}

/* --- 3. SECURITY SETTINGS --- */
function loadSecuritySettings() {
  const config = JSON.parse(localStorage.getItem('techprep_security_config') || '{}');
  
  const warnInput = document.getElementById('sec-max-warnings');
  const modeSelect = document.getElementById('sec-penalty-mode');
  const timeoutSelect = document.getElementById('sec-session-timeout');
  const twoFACheck = document.getElementById('sec-2fa-toggle');

  if (warnInput) warnInput.value = config.maxWarnings || 3;
  if (modeSelect) modeSelect.value = config.penaltyMode || 'auto-submit';
  if (timeoutSelect) timeoutSelect.value = config.sessionTimeout || '60';
  if (twoFACheck) twoFACheck.checked = config.enable2FA || false;
}

function saveSecuritySettings(e) {
  e.preventDefault();
  const maxWarnings = parseInt(document.getElementById('sec-max-warnings').value, 10) || 3;
  const penaltyMode = document.getElementById('sec-penalty-mode').value;
  const sessionTimeout = document.getElementById('sec-session-timeout').value;
  const enable2FA = document.getElementById('sec-2fa-toggle').checked;

  const config = { maxWarnings, penaltyMode, sessionTimeout, enable2FA };
  localStorage.setItem('techprep_security_config', JSON.stringify(config));

  const status = document.getElementById('sec-save-status');
  if (status) {
    status.classList.remove('hidden');
    setTimeout(() => status.classList.add('hidden'), 3000);
  }

  showToastNotification("Security settings updated");
  logSystemEvent('SUCCESS', `Updated security settings (Max Warnings: ${maxWarnings}, Mode: ${penaltyMode})`);
}

function changeAdminPassword(e) {
  e.preventDefault();
  const newPass = document.getElementById('admin-new-pass').value;
  const confirmPass = document.getElementById('admin-confirm-pass').value;

  if (newPass !== confirmPass) {
    window.customAlert("Password Mismatch", "New password and confirmation password do not match.", "error");
    return;
  }

  if (newPass.length < 6) {
    window.customAlert("Security Warning", "Password must be at least 6 characters long.", "warning");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (currentUser) {
    currentUser.password = newPass;
    localStorage.setItem('techprep_current_user', JSON.stringify(currentUser));

    const users = JSON.parse(localStorage.getItem('techprep_registered_users') || '[]');
    const adminIdx = users.findIndex(u => u.email === 'khushboo2006june@admin.com');
    if (adminIdx !== -1) {
      users[adminIdx].password = newPass;
      localStorage.setItem('techprep_registered_users', JSON.stringify(users));
    }
  }

  document.getElementById('admin-password-change-form').reset();
  showToastNotification("Admin password updated successfully");
  logSystemEvent('SUCCESS', 'Admin changed account password');
}

/* --- 4. SYSTEM AUDIT LOGS --- */
function getAuditLogs() {
  return JSON.parse(localStorage.getItem('techprep_audit_logs') || '[]');
}

function logSystemEvent(level, message, performer) {
  const logs = getAuditLogs();
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  const activeUser = performer || (currentUser ? `${currentUser.name} (${currentUser.role || 'Admin'})` : 'System Engine');

  const newLog = {
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    message,
    performer: activeUser
  };

  logs.unshift(newLog); // newest first
  if (logs.length > 200) logs.pop(); // keep last 200 logs
  localStorage.setItem('techprep_audit_logs', JSON.stringify(logs));
}

function renderAuditLogs() {
  const container = document.getElementById('audit-logs-table-body');
  if (!container) return;

  const logs = getAuditLogs();
  const filterLevel = (document.getElementById('log-filter-level')?.value || 'ALL').toUpperCase();
  const searchQuery = (document.getElementById('log-search-input')?.value || '').trim().toLowerCase();

  const filtered = logs.filter(l => {
    const matchesLevel = filterLevel === 'ALL' || l.level === filterLevel;
    const matchesSearch = l.message.toLowerCase().includes(searchQuery) || l.performer.toLowerCase().includes(searchQuery);
    return matchesLevel && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="4" class="text-center py-8 text-neutral-500 font-mono">No audit logs matching search filters.</td>
      </tr>`;
    return;
  }

  container.innerHTML = filtered.map(l => {
    let levelBadgeClass = "bg-neutral-500/10 text-neutral-500 border-neutral-500/20";
    if (l.level === 'SUCCESS') levelBadgeClass = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    else if (l.level === 'INFO') levelBadgeClass = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    else if (l.level === 'WARNING') levelBadgeClass = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    else if (l.level === 'ERROR') levelBadgeClass = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";

    const formattedDate = new Date(l.timestamp).toLocaleString();

    return `
      <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
        <td class="py-3 px-4 font-mono text-[11px] text-neutral-500">${escapeHTML(formattedDate)}</td>
        <td class="py-3 px-4">
          <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${levelBadgeClass}">
            ${escapeHTML(l.level)}
          </span>
        </td>
        <td class="py-3 px-4 font-semibold text-neutral-800 dark:text-neutral-200">${escapeHTML(l.message)}</td>
        <td class="py-3 px-4 font-mono text-[11px] text-neutral-500">${escapeHTML(l.performer)}</td>
      </tr>`;
  }).join('');
}

function exportAuditLogsCSV() {
  const logs = getAuditLogs();
  let csvContent = "data:text/csv;charset=utf-8,TIMESTAMP,LEVEL,PERFORMER,MESSAGE\n";
  
  logs.forEach(l => {
    const row = `"${l.timestamp}","${l.level}","${l.performer.replace(/"/g, '""')}","${l.message.replace(/"/g, '""')}"`;
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `techprep_audit_logs_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();

  showToastNotification("Audit logs exported to CSV");
}

function clearAuditLogs() {
  if (window.customConfirm) {
    window.customConfirm("Clear System Logs", "Are you sure you want to clear all system audit logs?").then(approved => {
      if (approved) {
        localStorage.setItem('techprep_audit_logs', JSON.stringify([]));
        renderAuditLogs();
        showToastNotification("Audit logs cleared");
      }
    });
  } else {
    localStorage.setItem('techprep_audit_logs', JSON.stringify([]));
    renderAuditLogs();
    showToastNotification("Audit logs cleared");
  }
}

/* --- 5. ADMIN TAB SWITCHER & NAVIGATION --- */
window.switchAdminTab = function(tabName) {
  const tabs = ['quizzes', 'placements', 'users', 'profile', 'site-mgmt'];
  tabs.forEach(t => {
    const panel = document.getElementById(`tab-panel-${t}`);
    const btn = document.getElementById(`side-btn-${t}`);
    if (t === tabName) {
      if (panel) {
        panel.classList.remove('hidden');
        panel.classList.add('block');
      }
      if (btn) {
        btn.className = "flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white";
      }
    } else {
      if (panel) {
        panel.classList.add('hidden');
        panel.classList.remove('block');
      }
      if (btn) {
        btn.className = "flex items-center space-x-2.5 px-3 py-2.5 rounded-lg text-left transition-all w-full text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800";
      }
    }
  });

  if (tabName === 'quizzes') {
    loadQuizzes();
  } else if (tabName === 'placements') {
    renderAdminPlacements();
  } else if (tabName === 'users') {
    renderUsers();
  } else if (tabName === 'profile') {
    loadAdminProfileForm();
  } else if (tabName === 'site-mgmt') {
    switchSiteMgmtSubTab('faq');
  }
};

/* --- 6. ADMIN PROFILE MANAGEMENT & AVATAR PERSISTENCE --- */
function loadAdminProfileForm() {
  const adminData = (window.storage && window.storage.get('techprep_admin_profile')) || 
                    (window.storage && window.storage.get('techprep_current_user')) || {
    name: 'Khushboo (Admin)',
    email: 'khushboo2006june@admin.com',
    role: 'admin',
    profilePic: ''
  };

  const nameEl = document.getElementById('admin-profile-name');
  const emailEl = document.getElementById('admin-profile-email');
  const contactEl = document.getElementById('admin-profile-contact');
  const dobEl = document.getElementById('admin-profile-dob');
  const addressEl = document.getElementById('admin-profile-address');
  const collegeEl = document.getElementById('admin-profile-college');
  const degreeEl = document.getElementById('admin-profile-degree');
  const branchEl = document.getElementById('admin-profile-branch');
  const specEl = document.getElementById('admin-profile-specialization');
  const preview = document.getElementById('admin-profile-preview-container');
  const picDataEl = document.getElementById('admin-profile-pic-data');

  if (nameEl) nameEl.value = adminData.name || 'Khushboo (Admin)';
  if (emailEl) emailEl.value = adminData.email || 'khushboo2006june@admin.com';
  if (contactEl) contactEl.value = adminData.contact || '';
  if (dobEl) dobEl.value = adminData.dob || '';
  if (addressEl) addressEl.value = adminData.address || '';
  if (collegeEl) collegeEl.value = adminData.college || '';
  if (degreeEl) degreeEl.value = adminData.degree || '';
  if (branchEl) branchEl.value = adminData.branch || '';
  if (specEl) specEl.value = adminData.specialization || '';
  if (picDataEl) picDataEl.value = adminData.profilePic || '';

  if (preview) {
    if (adminData.profilePic) {
      preview.innerHTML = `<img src="${adminData.profilePic}" alt="Admin Profile" class="w-full h-full object-cover">`;
    } else {
      preview.textContent = 'KA';
    }
  }
}

function initAdminProfileHandlers() {
  const fileInput = document.getElementById('admin-profile-pic-file');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        window.customAlert('File Too Large', 'Please upload a profile image smaller than 2MB.', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        const base64 = evt.target.result;
        const picDataEl = document.getElementById('admin-profile-pic-data');
        if (picDataEl) picDataEl.value = base64;
        const preview = document.getElementById('admin-profile-preview-container');
        if (preview) preview.innerHTML = `<img src="${base64}" alt="Admin Preview" class="w-full h-full object-cover">`;
      };
      reader.readAsDataURL(file);
    });
  }

  const form = document.getElementById('admin-profile-edit-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = (window.storage && window.storage.get('techprep_admin_profile')) || 
                      (window.storage && window.storage.get('techprep_current_user')) || {};
      const updated = {
        ...current,
        name: document.getElementById('admin-profile-name')?.value || 'Khushboo (Admin)',
        email: 'khushboo2006june@admin.com',
        role: 'admin',
        contact: document.getElementById('admin-profile-contact')?.value || '',
        dob: document.getElementById('admin-profile-dob')?.value || '',
        address: document.getElementById('admin-profile-address')?.value || '',
        college: document.getElementById('admin-profile-college')?.value || '',
        degree: document.getElementById('admin-profile-degree')?.value || '',
        branch: document.getElementById('admin-profile-branch')?.value || '',
        specialization: document.getElementById('admin-profile-specialization')?.value || '',
        profilePic: document.getElementById('admin-profile-pic-data')?.value || current.profilePic || ''
      };

      if (window.storage) {
        window.storage.set('techprep_admin_profile', updated);
        window.storage.set('techprep_current_user', updated);
      } else {
        localStorage.setItem('techprep_admin_profile', JSON.stringify(updated));
        localStorage.setItem('techprep_current_user', JSON.stringify(updated));
      }

      if (window.syncUserAvatar) {
        window.syncUserAvatar(updated);
      }

      const successMsg = document.getElementById('admin-profile-success-msg');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        setTimeout(() => successMsg.classList.add('hidden'), 3500);
      }

      showToastNotification('Admin profile updated successfully');
      logSystemEvent('SUCCESS', 'Admin updated profile details');
    });
  }
}

// Global function exports for onclick references
window.openFAQModal = openFAQModal;
window.closeFAQModal = closeFAQModal;
window.saveFAQForm = saveFAQForm;
window.deleteFAQ = deleteFAQ;
window.renderAdminFAQs = renderAdminFAQs;
window.switchSiteMgmtSubTab = switchSiteMgmtSubTab;
window.exportDatabaseBackup = exportDatabaseBackup;
window.importDatabaseBackup = importDatabaseBackup;
window.confirmResetDatabase = confirmResetDatabase;
window.saveSecuritySettings = saveSecuritySettings;
window.changeAdminPassword = changeAdminPassword;
window.renderAuditLogs = renderAuditLogs;
window.exportAuditLogsCSV = exportAuditLogsCSV;
window.clearAuditLogs = clearAuditLogs;
window.loadAdminProfileForm = loadAdminProfileForm;

document.addEventListener('DOMContentLoaded', () => {
  initAdminProfileHandlers();
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');
  if (tabParam && ['quizzes', 'placements', 'users', 'profile', 'site-mgmt'].includes(tabParam)) {
    window.switchAdminTab(tabParam);
  }
});





