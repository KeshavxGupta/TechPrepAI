// Mobile Sidebar Toggler
window.toggleQuizSidebar = function(forceState) {
  const sidebar = document.getElementById('quiz-sidebar');
  const overlay = document.getElementById('quiz-sidebar-overlay');
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

// Active state tracker variables
let currentQuiz = null;
let currentQuestionIdx = 0;
let studentAnswers = {}; // questionIdx -> selectedIndex
let questionFlags = {};  // questionIdx -> boolean
let examWarnings = 0;
let timerInterval = null;
let timeLimitSeconds = 0;
let timeRemainingSeconds = 0;
let timeStart = null;
let examStarted = false;
let examSubmitted = false;

document.addEventListener('DOMContentLoaded', () => {
  // Auth & Role check
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (!currentUser) {
    window.location.href = '/pages/public/login.html';
    return;
  }
  
  if (currentUser.email === 'khushboo2006june@admin.com') {
    window.location.href = '/pages/admin/admin-hub.html';
    return;
  }

  // Sync avatar picture
  if (window.syncUserAvatar) {
    window.syncUserAvatar(currentUser);
  }

  // Sidebar links active-exam locks
  document.querySelectorAll('#quiz-sidebar a, #quiz-sidebar button').forEach(link => {
    link.addEventListener('click', (e) => {
      if (examStarted && !examSubmitted) {
        e.preventDefault();
        window.customAlert("Assessment In Progress", "Navigation is locked during active proctored assessments. Click 'Exit Environment' in the top bar to abort.", "warning");
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const quizId = params.get('quizId');

  if (quizId) {
    loadQuizInstructions(quizId);
  } else {
    loadQuizSelector();
  }

  window.addEventListener('blur', handleProctorWarning);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      handleProctorWarning();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (!examStarted || examSubmitted) return;

    const block = (
      (e.ctrlKey && ['c', 'v', 'x', 'p', 'u'].includes(e.key.toLowerCase())) || 
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c')
    );

    if (block) {
      e.preventDefault();
      window.customAlert("Action Locked", "Copy, paste, inspect, and other shortcuts are disabled in the examination environment.", "warning");
    }
  });

  document.addEventListener('contextmenu', (e) => {
    if (examStarted && !examSubmitted) {
      e.preventDefault();
    }
  });
  
  document.addEventListener('fullscreenchange', () => {
    if (examStarted && !examSubmitted && !document.fullscreenElement) {
      handleFullscreenViolation();
    }
  });
});

function loadQuizSelector() {
  showView('view-selector');
  const grid = document.getElementById('selector-grid');
  grid.innerHTML = '';
  
  const quizzes = window.QuizStorage.getQuizzes();
  if (quizzes.length === 0) {
    grid.innerHTML = '<p class="text-xs text-neutral-500 col-span-full text-center">No quizzes are registered yet. Contact admin.</p>';
    return;
  }

  quizzes.forEach(q => {
    const qCount = q.questions ? q.questions.length : 0;
    const card = document.createElement('div');
    card.className = "p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-surface-elevated shadow-sm space-y-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all text-left";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between mb-3 text-[10px] text-neutral-400 font-mono">
          <span class="px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-bold">${qCount} Questions</span>
          <span>Time: ${q.timeLimit} Mins</span>
        </div>
        <h3 class="text-sm font-bold text-neutral-900 dark:text-white">${q.title}</h3>
        <p class="text-xs text-neutral-500 mt-2 line-clamp-2">${q.description}</p>
      </div>
      <a href="/pages/user/quiz-user.html?quizId=${q.id}" class="block w-full text-center py-2 text-xs font-semibold rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
        Start Assessment
      </a>
    `;
    grid.appendChild(card);
  });
}

function loadQuizInstructions(quizId) {
  currentQuiz = window.QuizStorage.getQuizById(quizId);
  if (!currentQuiz) {
    window.customAlert("Quiz Error", "Requested quiz parameters not found.", "error").then(() => {
      window.location.href = '/pages/user/quiz-user.html';
    });
    return;
  }

  showView('view-instructions');
  
  document.getElementById('ins-quiz-title').textContent = currentQuiz.title;
  document.getElementById('ins-quiz-desc').textContent = currentQuiz.description;
  document.getElementById('ins-quiz-time').textContent = `Quiz duration: ${currentQuiz.timeLimit} minutes. The exam auto-submits when expired.`;
  document.getElementById('ins-quiz-pass').textContent = `Minimum score: ${currentQuiz.passPercentage}% correct answers required to pass.`;
}

function startExamFullscreen() {
  const doc = document.documentElement;
  const req = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.msRequestFullscreen || doc.mozRequestFullScreen;
  if (req) {
    req.call(doc)
      .then(() => {
        enterActiveExam();
      })
      .catch((err) => {
        console.warn("Fullscreen rejected:", err);
        enterActiveExam();
      });
  } else {
    enterActiveExam();
  }
}

function enterActiveExam() {
  showView('view-exam');
  document.getElementById('quiz-timer-container').classList.remove('hidden');
  document.getElementById('quiz-timer-container').classList.add('flex');
  
  examStarted = true;
  timeStart = new Date();
  timeLimitSeconds = parseInt(currentQuiz.timeLimit) * 60;
  timeRemainingSeconds = timeLimitSeconds;
  
  startCountdownTimer();
  renderQuestionGrid();
  loadQuestion(0);
}

function startCountdownTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemainingSeconds--;
    updateTimerDisplay();

    if (timeRemainingSeconds <= 0) {
      clearInterval(timerInterval);
      submitExam('Time Limit Expired');
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = Math.floor(timeRemainingSeconds / 60);
  const s = timeRemainingSeconds % 60;
  const display = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  
  const el = document.getElementById('quiz-timer');
  el.textContent = display;

  if (timeRemainingSeconds < 60) {
    el.className = 'text-xs font-bold font-mono text-rose-500 animate-pulse';
  } else {
    el.className = 'text-xs font-bold font-mono text-blue-600 dark:text-blue-400';
  }
}

function renderQuestionGrid() {
  const container = document.getElementById('question-nav-grid');
  container.innerHTML = '';
  
  currentQuiz.questions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.id = `nav-btn-${idx}`;
    btn.textContent = idx + 1;
    btn.className = getNavBtnClass(idx);
    btn.onclick = () => loadQuestion(idx);
    container.appendChild(btn);
  });
}

function getNavBtnClass(idx) {
  let base = "h-10 w-full rounded border text-xs font-bold transition-all flex items-center justify-center ";
  
  if (idx === currentQuestionIdx) {
    base += "ring-2 ring-blue-500 border-transparent ";
  }

  if (studentAnswers[idx] !== undefined) {
    base += "bg-blue-600 border-blue-600 text-white ";
  } else if (questionFlags[idx]) {
    base += "bg-amber-500 border-amber-500 text-white ";
  } else {
    base += "border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 ";
  }
  return base;
}

function loadQuestion(idx) {
  if (idx < 0 || idx >= currentQuiz.questions.length) return;
  
  currentQuestionIdx = idx;
  renderQuestionGrid();
  
  const q = currentQuiz.questions[idx];
  const qType = q.questionType || 'mcq';
  
  const numberEl = document.getElementById('exam-question-number');
  numberEl.textContent = `QUESTION ${idx + 1} OF ${currentQuiz.questions.length}`;
  
  const badgeEl = numberEl.nextElementSibling;
  const questionText = document.getElementById('exam-question-text');
  const optionsContainer = document.getElementById('exam-options-container');

  if (qType === 'coding') {
    if (badgeEl) badgeEl.textContent = 'Coding Challenge';
    
    questionText.innerHTML = `
      <div class="mb-4 text-sm font-semibold text-neutral-900 dark:text-white leading-relaxed font-sans">
        ${q.text}
      </div>
      ${q.testCases ? `
      <div class="mb-4 space-y-2">
        <h3 class="text-xs font-bold uppercase text-neutral-500">Test Cases</h3>
        ${q.testCases.map(tc => `
          <div class="p-3 bg-neutral-100 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-800 font-mono text-[11px]">
            <div><span class="text-blue-500">Input:</span> ${tc.input}</div>
            <div><span class="text-green-500">Expected:</span> ${tc.expectedOutput}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    `;
    
    optionsContainer.innerHTML = '<div id="ide-mount-point" class="w-full h-96 min-h-[400px]"></div>';
    
    const mountPoint = document.getElementById('ide-mount-point');
    const ideTemplate = document.getElementById('dsa-ide-template');
    
    if (ideTemplate) {
      mountPoint.appendChild(ideTemplate.content.cloneNode(true));
      
      const editorTextarea = mountPoint.querySelector('#dsa-code-textarea');
      if (editorTextarea) {
        // Load previously saved code if available, otherwise fallback to boilerplate
        editorTextarea.value = studentAnswers[idx] !== undefined ? studentAnswers[idx] : (q.boilerplateCode || '');
      }
      
      const langSelect = mountPoint.querySelector('#dsa-lang-select');
      if (langSelect && q.language) {
        langSelect.value = q.language;
      }
      
      if (typeof window.updateLineNumbers === 'function') {
        window.updateLineNumbers();
      }
    }
  } else {
    if (badgeEl) badgeEl.textContent = 'Single Choice';
    questionText.textContent = q.text;
    optionsContainer.innerHTML = '';

    q.options.forEach((opt, optIdx) => {
      const optionCard = document.createElement('label');
      const isSelected = studentAnswers[idx] === optIdx;

      optionCard.className = `flex items-center justify-between p-4 rounded-xl border cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700 transition-all ${
        isSelected 
          ? 'bg-blue-500/5 dark:bg-blue-500/10 border-blue-500 dark:border-blue-500' 
          : 'bg-surface-secondary border-neutral-200 dark:border-neutral-800'
      }`;

      optionCard.innerHTML = `
        <div class="flex items-center space-x-3.5 pr-2">
          <input type="radio" name="question-option" value="${optIdx}" ${isSelected ? 'checked' : ''} 
            onclick="selectOption(${idx}, ${optIdx})" class="accent-blue-600 w-4 h-4 cursor-pointer">
          <span class="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-normal">${opt}</span>
        </div>
        ${isSelected ? '<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
      `;
      optionsContainer.appendChild(optionCard);
    });
  }

  document.getElementById('btn-prev').disabled = idx === 0;
  
  const nextBtn = document.getElementById('btn-next');
  if (idx === currentQuiz.questions.length - 1) {
    nextBtn.textContent = 'Finish & Submit';
    nextBtn.onclick = confirmSubmitModal;
  } else {
    nextBtn.textContent = 'Save & Next';
    nextBtn.onclick = nextQuestion;
  }
}

function selectOption(qIdx, optIdx) {
  studentAnswers[qIdx] = optIdx;
  delete questionFlags[qIdx];
  loadQuestion(qIdx);
}

function clearAnswerSelection() {
  delete studentAnswers[currentQuestionIdx];
  loadQuestion(currentQuestionIdx);
}

function markForReview() {
  if (questionFlags[currentQuestionIdx]) {
    delete questionFlags[currentQuestionIdx];
  } else {
    questionFlags[currentQuestionIdx] = true;
    delete studentAnswers[currentQuestionIdx];
  }
  loadQuestion(currentQuestionIdx);
}

function prevQuestion() {
  if (currentQuestionIdx > 0) {
    loadQuestion(currentQuestionIdx - 1);
  }
}

function nextQuestion() {
  if (currentQuestionIdx < currentQuiz.questions.length - 1) {
    loadQuestion(currentQuestionIdx + 1);
  }
}

function confirmExitEarly() {
  window.customConfirm("Exit Proctored Session?", "Exiting the assessment environment will invalidate your current session progress and count as a void score. Return to dashboard?").then(approved => {
    if (approved) {
      cleanupEnvironment();
      window.location.href = '/pages/user/dashboard.html';
    }
  });
}

function confirmSubmitModal() {
  const answeredCount = Object.keys(studentAnswers).length;
  const total = currentQuiz.questions.length;
  document.getElementById('submit-confirm-text').textContent = `You have answered ${answeredCount} out of ${total} questions. Are you sure you want to finalize and submit your responses?`;
  
  const modal = document.getElementById('submit-confirm-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeSubmitConfirmModal() {
  document.getElementById('submit-confirm-modal').classList.add('hidden');
  document.getElementById('submit-confirm-modal').classList.remove('flex');
}

function handleProctorWarning() {
  if (!examStarted || examSubmitted) return;

  examWarnings++;
  document.getElementById('exam-warning-count').textContent = `${examWarnings} / 3`;
  
  const percentage = (examWarnings / 3) * 100;
  document.getElementById('exam-warning-bar').style.width = `${percentage}%`;

  if (examWarnings >= 3) {
    submitExam('Proctoring Infractions Limit Reached');
    return;
  }

  document.getElementById('overlay-warning-count').textContent = examWarnings;
  const popup = document.getElementById('proctoring-warning-overlay');
  popup.classList.remove('hidden');
  popup.classList.add('flex');
  
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function resumeExamFullscreen() {
  document.getElementById('proctoring-warning-overlay').classList.add('hidden');
  document.getElementById('proctoring-warning-overlay').classList.remove('flex');
  
  const doc = document.documentElement;
  const req = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.msRequestFullscreen || doc.mozRequestFullScreen;
  if (req) {
    req.call(doc).catch(() => {});
  }
}

function handleFullscreenViolation() {
  if (!examStarted || examSubmitted) return;
  handleProctorWarning();
}

function submitExam(reason = 'Normal Submission') {
  if (examSubmitted) return;
  examSubmitted = true;
  
  cleanupEnvironment();

  closeSubmitConfirmModal();
  document.getElementById('proctoring-warning-overlay').classList.add('hidden');
  document.getElementById('proctoring-warning-overlay').classList.remove('flex');

  let scorePoints = 0;
  const total = currentQuiz.questions.length;
  
  currentQuiz.questions.forEach((q, idx) => {
    const studentAns = studentAnswers[idx];
    const qType = q.questionType || 'mcq';
    
    if (qType === 'coding') {
      if (studentAns !== undefined && studentAns.trim() !== '') {
        scorePoints++;
      }
    } else {
      if (studentAns !== undefined && studentAns === q.correctIndex) {
        scorePoints++;
      }
    }
  });

  const finalPercentage = total ? Math.round((scorePoints / total) * 100) : 0;
  const isPassed = finalPercentage >= parseInt(currentQuiz.passPercentage);
  
  const timeTakenSeconds = Math.round((new Date() - timeStart) / 1000);
  const timeTakenDisplay = `${Math.floor(timeTakenSeconds / 60)}m ${timeTakenSeconds % 60}s`;

  const activeUser = JSON.parse(localStorage.getItem('techprep_current_user') || '{"name":"Aarav Sharma","email":"student@college.edu"}');
  const quizResult = {
    quizId: currentQuiz.id,
    quizTitle: currentQuiz.title,
    studentName: activeUser.name,
    studentEmail: activeUser.email,
    scoreFraction: `${scorePoints} / ${total}`,
    scorePercent: finalPercentage,
    timeTaken: timeTakenDisplay,
    violations: examWarnings,
    status: isPassed ? 'PASSED' : 'FAILED',
    submissionReason: reason
  };
  
  window.QuizStorage.saveUserResult(quizResult);

  showView('view-result');
  
  const badge = document.getElementById('result-status-badge');
  badge.textContent = quizResult.status;
  if (isPassed) {
    badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border border-emerald-500/20";
    document.getElementById('result-desc').textContent = `Congratulations! You successfully cleared the passing bar of ${currentQuiz.passPercentage}%. The technical credentials have been synced to your profile dashboard.`;
  } else {
    badge.className = "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-500 border border-rose-500/20";
    document.getElementById('result-desc').textContent = `You did not satisfy the minimum score of ${currentQuiz.passPercentage}% for this topic. We recommend reviewing DSA topics and attempting again.`;
  }

  const infractionAlert = document.getElementById('result-infraction-alert');
  if (reason === 'Proctoring Infractions Limit Reached') {
    infractionAlert.classList.remove('hidden');
    infractionAlert.textContent = "Auto-submitted: Proctoring limits exceeded";
  } else if (reason === 'Time Limit Expired') {
    infractionAlert.classList.remove('hidden');
    infractionAlert.textContent = "Auto-submitted: Time expired";
  } else {
    infractionAlert.classList.add('hidden');
  }

  document.getElementById('result-score-val').textContent = `${finalPercentage}%`;
  document.getElementById('result-score-fraction').textContent = `${scorePoints} / ${total} Points`;
  document.getElementById('result-time-taken').textContent = timeTakenDisplay;
  document.getElementById('result-violations').textContent = `${examWarnings} Warnings`;
  document.getElementById('result-pass-threshold').textContent = `${currentQuiz.passPercentage}%`;

  const reviewContainer = document.getElementById('result-questions-review');
  reviewContainer.innerHTML = '';

  currentQuiz.questions.forEach((q, idx) => {
    const studentChoice = studentAnswers[idx];
    const qType = q.questionType || 'mcq';
    
    let isCorrect = false;
    if (qType === 'coding') {
      isCorrect = (studentChoice !== undefined && studentChoice.trim() !== '');
    } else {
      isCorrect = (studentChoice !== undefined && studentChoice === q.correctIndex);
    }

    const revDiv = document.createElement('div');
    revDiv.className = `p-5 rounded-xl border text-xs text-left space-y-3 ${
      isCorrect 
        ? 'bg-emerald-500/5 border-emerald-500/20 dark:border-emerald-500/10' 
        : 'bg-rose-500/5 border-rose-500/20 dark:border-rose-500/10'
    }`;

    let statusText = isCorrect 
      ? '<span class="text-emerald-600 dark:text-emerald-500 font-bold font-mono">CORRECT ANSWER</span>'
      : '<span class="text-rose-600 dark:text-rose-500 font-bold font-mono">INCORRECT ANSWER</span>';
    
    if (studentChoice === undefined || (qType === 'coding' && studentChoice.trim() === '')) {
      statusText = '<span class="text-neutral-500 font-bold font-mono">NOT ATTEMPTED</span>';
    }

    let choiceHTML = '';
    if (qType === 'coding') {
      choiceHTML = `
        <div class="space-y-2 mt-2">
          <div class="text-[11px] text-neutral-500 font-semibold">Your Submitted Code:</div>
          ${(studentChoice && studentChoice.trim() !== '') 
            ? `<pre class="p-3 bg-[#1e1e1e] text-green-400 rounded text-[11px] font-mono overflow-x-auto whitespace-pre-wrap border border-neutral-800"><code>${studentChoice.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>` 
            : '<div class="text-[11px] text-rose-500">No code submitted</div>'}
          <div class="text-[11px] mt-2">Expected result: <strong class="text-emerald-600 dark:text-emerald-400">Passed all test cases.</strong></div>
        </div>
      `;
    } else {
      choiceHTML = `
        <div class="space-y-1.5 text-[11px]">
          <div>Your choice: <strong class="${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}">${
            studentChoice !== undefined ? q.options[studentChoice] : 'No response selected'
          }</strong></div>
          
          ${!isCorrect ? `<div>Correct choice: <strong class="text-emerald-600 dark:text-emerald-400">${q.options[q.correctIndex]}</strong></div>` : ''}
        </div>
      `;
    }

    revDiv.innerHTML = `
      <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800/60 pb-2">
        <span class="font-bold text-neutral-500 font-mono">QUESTION #${idx + 1}</span>
        ${statusText}
      </div>
      
      <p class="font-semibold text-neutral-900 dark:text-white leading-relaxed">${q.text}</p>
      
      ${choiceHTML}

      ${q.explanation ? `
        <div class="p-3 bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded font-mono text-[10px] text-neutral-500 mt-2">
          <span class="font-semibold text-neutral-700 dark:text-neutral-300">EXPLANATION:</span> ${q.explanation}
        </div>
      ` : ''}
    `;
    reviewContainer.appendChild(revDiv);
  });
}

function cleanupEnvironment() {
  clearInterval(timerInterval);
  document.getElementById('quiz-timer-container').classList.add('hidden');
  document.getElementById('quiz-timer-container').classList.remove('flex');
  
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function showView(viewId) {
  ['view-selector', 'view-instructions', 'view-exam', 'view-result'].forEach(id => {
    const el = document.getElementById(id);
    if (id === viewId) {
      el.classList.remove('hidden');
      el.classList.add('block');
    } else {
      el.classList.add('hidden');
      el.classList.remove('block');
    }
  });
}

// ==========================================
// IDE Execution & Submission Logic
// ==========================================
window.runDSACode = function() {
  const terminal = document.getElementById('dsa-terminal-output');
  if (!terminal) return false;
  
  // Unhide the terminal drawer
  terminal.classList.remove('hidden');
  terminal.innerHTML = '<div class="p-4 text-neutral-400 font-mono text-xs">Running tests...</div>';

  const userCode = document.getElementById('dsa-code-textarea').value;
  const q = currentQuiz.questions[currentQuestionIdx];

  // Dynamically extract the function name from the user's code 
  // (Assuming standard function declaration e.g., "function sum(a, b)")
  const match = userCode.match(/function\s+([a-zA-Z_$][0-9a-zA-Z_$]*)\s*\(/);
  if (!match) {
    terminal.innerHTML = '<div class="p-4 text-rose-500 font-mono text-xs border-l-4 border-rose-500 bg-rose-500/10">Error: Could not find a valid function declaration to test. Please ensure you declare a function.</div>';
    return false;
  }
  
  const funcName = match[1];
  let allPassed = true;
  let outputHTML = '<div class="p-4 space-y-3">';

  q.testCases.forEach((tc, i) => {
    try {
      // Securely construct the execution context for this specific test case
      const testFn = new Function(`
        ${userCode}
        return ${funcName}(${tc.input});
      `);
      
      const result = testFn();
      
      // Coerce outputs to strings for simple prototype comparison
      const passed = String(result).trim() === String(tc.expectedOutput).trim();
      
      if (!passed) allPassed = false;

      outputHTML += `
        <div class="border ${passed ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'} rounded p-4 text-xs font-mono">
          <div class="font-bold ${passed ? 'text-emerald-500' : 'text-rose-500'} mb-2 flex items-center space-x-2">
            <span>Test Case ${i + 1}: ${passed ? 'PASSED' : 'FAILED'}</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <div class="text-neutral-400 truncate">Input: <span class="text-neutral-200">${tc.input}</span></div>
            <div class="text-neutral-400 truncate">Expected: <span class="text-neutral-200">${tc.expectedOutput}</span></div>
            <div class="text-neutral-400 truncate">Output: <span class="${passed ? 'text-emerald-400' : 'text-rose-400'}">${result !== undefined ? result : 'undefined'}</span></div>
          </div>
        </div>
      `;
    } catch (err) {
      allPassed = false;
      outputHTML += `
        <div class="border border-rose-500/30 bg-rose-500/5 rounded p-4 text-xs font-mono">
          <div class="font-bold text-rose-500 mb-2">Test Case ${i + 1}: ERROR</div>
          <div class="text-rose-400 whitespace-pre-wrap">${err.message}</div>
        </div>
      `;
    }
  });

  outputHTML += '</div>';
  terminal.innerHTML = outputHTML;
  
  return allPassed;
};

window.submitDSACode = function() {
  const allPassed = window.runDSACode();
  
  if (allPassed) {
    const userCode = document.getElementById('dsa-code-textarea').value;
    
    // Save successful code to active session state
    studentAnswers[currentQuestionIdx] = userCode;
    delete questionFlags[currentQuestionIdx]; // Remove review flag if any
    
    // Toast notification mapping for visual feedback
    if (window.showToast) {
      window.showToast("All test cases passed! Code saved.");
    } else {
      // Fallback
      alert("Success! All test cases passed and your code is saved.");
    }

    // Automatically navigate to the next question if available
    if (currentQuestionIdx < currentQuiz.questions.length - 1) {
      nextQuestion();
    } else {
      // Refresh current question to show "Finish & Submit" state
      loadQuestion(currentQuestionIdx);
    }
  } else {
    if (window.showToast) {
      window.showToast("Tests failed. Check the console output.");
    } else {
      alert("Some test cases failed or threw errors. Check the terminal output for details.");
    }
  }
};




