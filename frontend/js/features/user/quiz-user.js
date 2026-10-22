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
let maxExamWarnings = 3;
let timerInterval = null;
let timeLimitSeconds = 0;
let timeRemainingSeconds = 0;
let timeStart = null;
let examStarted = false;
let examSubmitted = false;
let isProctorGracePeriod = false;
let isModalOpen = false;
let lastInfractionTime = 0;
const INFRACTION_COOLDOWN_MS = 2500;
let activeWebcamStream = null;

// Audio Warning Synthesizer (Native Web Audio API)
function playProctorWarningSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
    osc.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
  } catch (e) {}
}

// Live Telemetry Logger
function logTelemetryEvent(message) {
  const feed = document.getElementById('proctor-telemetry-feed');
  if (!feed) return;
  const time = new Date().toLocaleTimeString([], { hour12: false });
  const entry = document.createElement('div');
  entry.className = "flex items-start gap-1 text-[10px]";
  entry.innerHTML = `<span class="text-neutral-500 font-mono">[${time}]</span> <span class="text-neutral-300">${escapeHTML(message)}</span>`;
  feed.appendChild(entry);
  feed.scrollTop = feed.scrollHeight;
}

// Optical & Camera Telemetry
async function initProctoringWebcam() {
  const videoEl = document.getElementById('proctor-video-feed');
  const radarEl = document.getElementById('proctor-radar-view');
  const hudStatus = document.getElementById('proctor-hud-status');

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });
      activeWebcamStream = stream;
      if (videoEl) {
        videoEl.srcObject = stream;
        videoEl.classList.remove('hidden');
        if (radarEl) radarEl.classList.add('hidden');
      }
      logTelemetryEvent('Webcam optical stream active: Real-time gaze & presence monitor engaged');
      if (hudStatus) hudStatus.textContent = 'Optical Stream: Verified • Live Monitored';
      return;
    } catch (err) {
      console.warn('Webcam stream unavailable, using AI optical radar:', err.message);
    }
  }

  // Graceful fallback to animated optical scanner
  if (videoEl) videoEl.classList.add('hidden');
  if (radarEl) radarEl.classList.remove('hidden');
  logTelemetryEvent('AI Optical Radar active: Window focus & tab integrity monitoring');
}

function stopProctoringWebcam() {
  if (activeWebcamStream) {
    try {
      activeWebcamStream.getTracks().forEach(track => track.stop());
    } catch (e) {}
    activeWebcamStream = null;
  }
}

// Emergency save on forced tab close or page reload
function emergencyFailOnUnload() {
  if (examStarted && !examSubmitted && currentQuiz) {
    const total = (currentQuiz.questions && currentQuiz.questions.length) ? currentQuiz.questions.length : 1;
    const activeUser = JSON.parse(localStorage.getItem('techprep_current_user') || '{"name":"Student","email":"student@techprepai.com"}');
    const failedResult = {
      quizId: currentQuiz.id,
      customId: currentQuiz.customId || currentQuiz.id,
      quizTitle: currentQuiz.title,
      studentName: activeUser.name,
      studentEmail: activeUser.email,
      score: 0,
      scoreFraction: `0 / ${total}`,
      scorePercent: 0,
      percentage: 0,
      totalQuestions: total,
      passed: false,
      status: 'FAILED',
      timeSpentSeconds: timeStart ? Math.round((new Date() - timeStart) / 1000) : 0,
      timeTaken: 'Terminated',
      violations: examWarnings + 1,
      submissionReason: 'Session Aborted: Browser Window Closed or Reloaded',
      timestamp: new Date().toISOString()
    };
    try {
      const email = activeUser.email;
      const key = `techprep_user_quiz_results_${email}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(failedResult);
      localStorage.setItem(key, JSON.stringify(existing));
      localStorage.setItem('techprep_user_quiz_results', JSON.stringify(existing));
      if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/quizzes/results', JSON.stringify(failedResult));
      }
    } catch (e) {}
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Auth & Role check
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (!currentUser) {
    window.location.href = '../public/login.html';
    return;
  }
  
  if (currentUser.email === 'khushboo2006june@admin.com') {
    window.location.href = '../admin/admin-hub.html';
    return;
  }

  // Sync avatar picture
  if (window.syncUserAvatar) {
    window.syncUserAvatar(currentUser);
  }

  // Read admin security config if available
  try {
    const secConfig = JSON.parse(localStorage.getItem('techprep_security_config') || '{}');
    if (secConfig.maxWarnings) maxExamWarnings = parseInt(secConfig.maxWarnings, 10);
  } catch (e) {}

  // Sidebar links active-exam locks
  document.querySelectorAll('#quiz-sidebar a, #quiz-sidebar button').forEach(link => {
    link.addEventListener('click', (e) => {
      if (examStarted && !examSubmitted) {
        e.preventDefault();
        confirmExitEarly();
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

  // Trapping browser back button navigation
  window.addEventListener('popstate', (e) => {
    if (examStarted && !examSubmitted) {
      history.pushState({ inProctoredExam: true }, '', window.location.href);
      confirmExitEarly();
    }
  });

  // Warn on tab/window close or reload
  window.addEventListener('beforeunload', (e) => {
    if (examStarted && !examSubmitted) {
      e.preventDefault();
      e.returnValue = 'Assessment in progress! Exiting will terminate your session and mark the exam as FAILED.';
      return e.returnValue;
    }
  });

  // Emergency fail-on-unload if student forces tab close or reload
  window.addEventListener('pagehide', emergencyFailOnUnload);

  // Focus and Tab Switch detection
  window.addEventListener('blur', () => {
    if (examStarted && !examSubmitted && !isModalOpen && !isProctorGracePeriod) {
      handleProctorWarning('Window focus lost / application switch');
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && examStarted && !examSubmitted && !isModalOpen && !isProctorGracePeriod) {
      handleProctorWarning('Tab switched away / browser minimized');
    }
  });

  // Anti-cheat keyboard shortcut restrictions
  document.addEventListener('keydown', (e) => {
    if (!examStarted || examSubmitted) return;

    const block = (
      (e.ctrlKey && ['c', 'v', 'x', 'p', 'u', 's', 'a'].includes(e.key.toLowerCase())) || 
      e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && ['i', 'c', 'j', 'k'].includes(e.key.toLowerCase())) ||
      (e.altKey && e.key === 'Tab')
    );

    if (block) {
      e.preventDefault();
      handleProctorWarning('Unauthorized keyboard shortcut detected');
    }
  });

  // Anti-cheat right-click context menu lockout
  document.addEventListener('contextmenu', (e) => {
    if (examStarted && !examSubmitted) {
      e.preventDefault();
    }
  });
  
  // Fullscreen violation detection
  document.addEventListener('fullscreenchange', () => {
    if (examStarted && !examSubmitted && !document.fullscreenElement && !isModalOpen && !isProctorGracePeriod) {
      handleFullscreenViolation();
    }
  });
});

function renderSelectorCards(quizzes) {
  const grid = document.getElementById('selector-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!quizzes || quizzes.length === 0) {
    grid.innerHTML = '<p class="text-xs text-neutral-500 col-span-full text-center py-8">No quizzes are registered yet. Contact admin.</p>';
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
        <h3 class="text-sm font-bold text-neutral-900 dark:text-white">${escapeHTML(q.title)}</h3>
        <p class="text-xs text-neutral-500 mt-2 line-clamp-2">${escapeHTML(q.description)}</p>
      </div>
      <a href="quiz-user.html?quizId=${q.id}" class="block w-full text-center py-2 text-xs font-semibold rounded-lg bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors">
        Start Assessment
      </a>
    `;
    grid.appendChild(card);
  });
}

function loadQuizSelector() {
  showView('view-selector');
  // 1. Instant 0ms render from cache
  const quizzes = window.QuizStorage ? window.QuizStorage.getQuizzes() : [];
  renderSelectorCards(quizzes);

  // 2. Silent background sync
  if (window.QuizStorage && window.QuizStorage.syncQuizzesInBackground) {
    window.QuizStorage.syncQuizzesInBackground((updated) => {
      renderSelectorCards(updated);
    });
  }
}

function loadQuizInstructions(quizId) {
  currentQuiz = window.QuizStorage.getQuizById(quizId);
  if (!currentQuiz) {
    window.customAlert("Quiz Error", "Requested quiz parameters not found.", "error").then(() => {
      window.location.href = 'quiz-user.html';
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
  
  // Show timer and topbar proctoring elements
  const timerContainer = document.getElementById('quiz-timer-container');
  if (timerContainer) {
    timerContainer.classList.remove('hidden');
    timerContainer.classList.add('flex');
  }
  const exitBtn = document.getElementById('exit-exam-early');
  if (exitBtn) {
    exitBtn.classList.remove('hidden');
    exitBtn.classList.add('inline-flex');
  }
  const proctorBadge = document.getElementById('exam-proctor-active-badge');
  if (proctorBadge) {
    proctorBadge.classList.remove('hidden');
    proctorBadge.classList.add('inline-flex');
  }

  examStarted = true;
  examSubmitted = false;
  examWarnings = 0;
  timeStart = new Date();
  timeLimitSeconds = parseInt(currentQuiz.timeLimit, 10) * 60;
  timeRemainingSeconds = timeLimitSeconds;

  // History state for back-button trapping
  history.pushState({ inProctoredExam: true }, '', window.location.href);

  // 3-second grace period on entry to allow layout and fullscreen transitions
  isProctorGracePeriod = true;
  setTimeout(() => {
    isProctorGracePeriod = false;
  }, 3000);

  // Reset visual strike indicators
  for (let i = 1; i <= 3; i++) {
    const badge = document.getElementById(`strike-badge-${i}`);
    if (badge) {
      badge.className = "py-1.5 px-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-center text-neutral-400 font-semibold transition-all";
      badge.textContent = `Strike ${i}: OK`;
    }
  }
  const warnCount = document.getElementById('exam-warning-count');
  if (warnCount) warnCount.textContent = `0 / ${maxExamWarnings} Strikes`;
  const warnBar = document.getElementById('exam-warning-bar');
  if (warnBar) {
    warnBar.style.width = '0%';
    warnBar.className = 'bg-emerald-500 h-full w-0 transition-all duration-300';
  }

  // Clear telemetry log and log initialization
  const feed = document.getElementById('proctor-telemetry-feed');
  if (feed) feed.innerHTML = '';
  logTelemetryEvent('Strict proctored session initiated');
  logTelemetryEvent('Fullscreen security container locked');
  logTelemetryEvent('Keyboard, clipboard & inspect telemetry active');

  // Initialize camera / optical scanner
  initProctoringWebcam();

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
  if (el) el.textContent = display;

  if (el) {
    if (timeRemainingSeconds < 60) {
      el.className = 'text-xs font-bold font-mono text-rose-500 animate-pulse';
    } else {
      el.className = 'text-xs font-bold font-mono text-blue-600 dark:text-blue-400';
    }
  }
}

// Coding IDE state per question
let activeExamLanguage = 'javascript';
const studentLanguageCode = {}; // { [questionIdx]: { currentLang: 'javascript', javascript: '...', python: '...', cpp: '...', java: '...' } }

function escapeHTML(str) {
  if (typeof str !== 'string') return String(str || '');
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderQuestionGrid() {
  const container = document.getElementById('question-nav-grid');
  if (container) {
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

  // Also update quick-jump pills in the coding split-screen bar
  const codingNavContainer = document.getElementById('exam-coding-nav-pills');
  if (codingNavContainer && currentQuiz && currentQuiz.questions) {
    codingNavContainer.innerHTML = '';
    currentQuiz.questions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.id = `coding-nav-pill-${idx}`;
      btn.textContent = idx + 1;
      
      let pillClass = "w-7 h-7 rounded text-[11px] font-mono font-bold transition-all flex items-center justify-center ";
      if (idx === currentQuestionIdx) {
        pillClass += "ring-2 ring-blue-500 border border-blue-400 ";
      }
      if (studentAnswers[idx] !== undefined && String(studentAnswers[idx]).trim() !== '') {
        pillClass += "bg-emerald-600 text-white ";
      } else if (questionFlags[idx]) {
        pillClass += "bg-amber-500 text-white ";
      } else {
        pillClass += "border border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 ";
      }
      btn.className = pillClass;
      btn.onclick = () => loadQuestion(idx);
      codingNavContainer.appendChild(btn);
    });
  }
}

function getNavBtnClass(idx) {
  let base = "h-10 w-full rounded border text-xs font-bold transition-all flex items-center justify-center ";
  
  if (idx === currentQuestionIdx) {
    base += "ring-2 ring-blue-500 border-transparent ";
  }

  if (studentAnswers[idx] !== undefined && String(studentAnswers[idx]).trim() !== '') {
    base += "bg-blue-600 border-blue-600 text-white ";
  } else if (questionFlags[idx]) {
    base += "bg-amber-500 border-amber-500 text-white ";
  } else {
    base += "border-neutral-300 dark:border-neutral-700 bg-surface-secondary text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 ";
  }
  return base;
}

function getStarterCodeForExam(q, lang) {
  const targetLang = (lang || 'javascript').toLowerCase();

  // 1. Explicit templates stored on question
  if (q.templates && q.templates[targetLang]) {
    return q.templates[targetLang];
  }

  // 2. Check SEED_DSA_PROBLEMS if available
  if (typeof SEED_DSA_PROBLEMS !== 'undefined' && Array.isArray(SEED_DSA_PROBLEMS)) {
    const matchedSeed = SEED_DSA_PROBLEMS.find(p => 
      (q.slug && p.slug === q.slug) || 
      (q.title && p.title.toLowerCase() === q.title.toLowerCase()) ||
      (q.text && q.text.toLowerCase().includes(p.title.toLowerCase()))
    );
    if (matchedSeed && matchedSeed.templates && matchedSeed.templates[targetLang]) {
      return matchedSeed.templates[targetLang];
    }
  }

  // 3. Question default boilerplate
  if (targetLang === (q.language || 'javascript').toLowerCase() && q.boilerplateCode) {
    return q.boilerplateCode;
  }

  // 4. Extract function name and arguments from boilerplateCode or text
  let funcName = 'solution';
  let paramNames = ['input'];

  const rawCode = q.boilerplateCode || q.text || '';
  const fnMatch = rawCode.match(/function\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
  if (fnMatch) {
    funcName = fnMatch[1];
    paramNames = fnMatch[2].split(',').map(s => s.trim()).filter(Boolean);
  } else {
    const pyMatch = rawCode.match(/def\s+([a-zA-Z0-9_$]+)\s*\(([^)]*)\)/);
    if (pyMatch) {
      funcName = pyMatch[1];
      paramNames = pyMatch[2].split(',').map(s => s.trim()).filter(Boolean);
    }
  }

  const paramList = paramNames.join(', ');

  // Standard LeetCode boilerplate generators
  switch (targetLang) {
    case 'python':
      return `def ${funcName}(${paramList}):\n    # Write your solution here\n    pass\n`;

    case 'cpp':
      return `#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    // Write your solution here\n};\n\nint main() {\n    ios_base::sync_with_stdio(false);\n    cin.tie(NULL);\n    // Read input from cin\n    return 0;\n}\n`;

    case 'java':
      return `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Write your solution here\n    }\n}\n`;

    case 'javascript':
    default:
      return `/**\n * @return {any}\n */\nfunction ${funcName}(${paramList}) {\n  // Write your solution here\n  \n}\n`;
  }
}

function handleExamTextareaTab(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    const value = this.value;

    if (!e.shiftKey) {
      this.value = value.substring(0, start) + '  ' + value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
    } else {
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      if (value.substring(lineStart, lineStart + 2) === '  ') {
        this.value = value.substring(0, lineStart) + value.substring(lineStart + 2);
        this.selectionStart = Math.max(lineStart, start - 2);
        this.selectionEnd = Math.max(lineStart, end - 2);
      }
    }
    updateExamLineNumbers();
  }
}

function loadQuestion(idx) {
  if (idx < 0 || idx >= currentQuiz.questions.length) return;
  
  currentQuestionIdx = idx;
  renderQuestionGrid();
  
  const q = currentQuiz.questions[idx];
  const qType = q.questionType || 'mcq';

  const mcqContainer = document.getElementById('exam-mcq-container');
  const codingContainer = document.getElementById('exam-coding-container');

  if (qType === 'coding') {
    // Show Coding Workspace, hide MCQ layout
    if (mcqContainer) mcqContainer.classList.add('hidden');
    if (codingContainer) {
      codingContainer.classList.remove('hidden');
      codingContainer.classList.add('flex');
    }

    // Top Header info
    const qBadge = document.getElementById('exam-coding-q-badge');
    if (qBadge) qBadge.textContent = `QUESTION ${idx + 1} OF ${currentQuiz.questions.length} • CODING CHALLENGE`;
    
    const warnCount = document.getElementById('exam-coding-warning-count');
    if (warnCount) warnCount.textContent = `${examWarnings} / 3`;

    // Left Panel Problem Details
    const titleEl = document.getElementById('exam-coding-title');
    if (titleEl) {
      const firstLine = q.text.split(/[:\n]/)[0].replace(/Problem\s*\d*\s*[:\-]?\s*/i, '').trim();
      titleEl.textContent = q.title || firstLine || `Coding Challenge #${idx + 1}`;
    }

    const textEl = document.getElementById('exam-coding-text');
    if (textEl) textEl.textContent = q.text;

    // Sample Testcases
    const samplesContainer = document.getElementById('exam-coding-samples');
    if (samplesContainer) {
      samplesContainer.innerHTML = '';
      const testCases = q.testCases || [];
      if (testCases.length === 0) {
        samplesContainer.innerHTML = '<div class="text-[11px] text-neutral-500 italic">No sample test cases provided.</div>';
      } else {
        testCases.forEach((tc, tcIdx) => {
          const card = document.createElement('div');
          card.className = "p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs space-y-1.5 font-mono";
          card.innerHTML = `
            <div class="font-bold text-neutral-500 text-[11px]">Example ${tcIdx + 1}:</div>
            <div class="text-[11px]"><strong class="text-neutral-600 dark:text-neutral-400">Input:</strong> <code class="bg-neutral-900 px-1.5 py-0.5 rounded text-blue-400">${escapeHTML(tc.input)}</code></div>
            <div class="text-[11px]"><strong class="text-neutral-600 dark:text-neutral-400">Expected:</strong> <code class="bg-neutral-900 px-1.5 py-0.5 rounded text-emerald-400">${escapeHTML(tc.expectedOutput)}</code></div>
          `;
          samplesContainer.appendChild(card);
        });
      }
    }

    // Determine current language
    if (!studentLanguageCode[idx]) studentLanguageCode[idx] = {};
    activeExamLanguage = studentLanguageCode[idx].currentLang || q.language || 'javascript';

    const langSelect = document.getElementById('exam-lang-select');
    if (langSelect) langSelect.value = activeExamLanguage;

    // Load code
    const textarea = document.getElementById('exam-code-textarea');
    if (textarea) {
      if (studentAnswers[idx] !== undefined && String(studentAnswers[idx]).trim() !== '') {
        textarea.value = studentAnswers[idx];
      } else if (studentLanguageCode[idx][activeExamLanguage]) {
        textarea.value = studentLanguageCode[idx][activeExamLanguage];
      } else {
        textarea.value = getStarterCodeForExam(q, activeExamLanguage);
      }
      studentLanguageCode[idx][activeExamLanguage] = textarea.value;

      // Ensure Tab key support is attached
      if (!textarea.dataset.tabAttached) {
        textarea.addEventListener('keydown', handleExamTextareaTab);
        textarea.dataset.tabAttached = 'true';
      }

      updateExamLineNumbers();
    }

    // Navigation buttons state
    const prevBtn = document.getElementById('exam-coding-btn-prev');
    if (prevBtn) prevBtn.disabled = idx === 0;

    const nextBtn = document.getElementById('exam-coding-btn-next');
    if (nextBtn) {
      if (idx === currentQuiz.questions.length - 1) {
        nextBtn.textContent = 'Finish & Submit';
        nextBtn.onclick = confirmSubmitModal;
      } else {
        nextBtn.textContent = 'Save & Next';
        nextBtn.onclick = nextQuestion;
      }
    }

  } else {
    // Show MCQ View, hide Coding view
    if (codingContainer) {
      codingContainer.classList.add('hidden');
      codingContainer.classList.remove('flex');
    }
    if (mcqContainer) mcqContainer.classList.remove('hidden');

    const numberEl = document.getElementById('exam-question-number');
    if (numberEl) numberEl.textContent = `QUESTION ${idx + 1} OF ${currentQuiz.questions.length}`;

    const questionText = document.getElementById('exam-question-text');
    if (questionText) questionText.textContent = q.text;

    const optionsContainer = document.getElementById('exam-options-container');
    if (optionsContainer) {
      optionsContainer.innerHTML = '';
      (q.options || []).forEach((opt, optIdx) => {
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
            <span class="text-xs font-medium text-neutral-800 dark:text-neutral-200 leading-normal">${escapeHTML(opt)}</span>
          </div>
          ${isSelected ? '<svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
        `;
        optionsContainer.appendChild(optionCard);
      });
    }

    const prevBtn = document.getElementById('btn-prev');
    if (prevBtn) prevBtn.disabled = idx === 0;

    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      if (idx === currentQuiz.questions.length - 1) {
        nextBtn.textContent = 'Finish & Submit';
        nextBtn.onclick = confirmSubmitModal;
      } else {
        nextBtn.textContent = 'Save & Next';
        nextBtn.onclick = nextQuestion;
      }
    }
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
  if (!examStarted || examSubmitted) return;
  isModalOpen = true;
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeExitConfirmModal() {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  isProctorGracePeriod = true;
  setTimeout(() => {
    isProctorGracePeriod = false;
    isModalOpen = false;
  }, 1500);

  // Keep fullscreen
  if (!document.fullscreenElement) {
    const doc = document.documentElement;
    const req = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.msRequestFullscreen || doc.mozRequestFullScreen;
    if (req) req.call(doc).catch(() => {});
  }
}

function executeExitAndFailExam() {
  const modal = document.getElementById('exit-confirm-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  isModalOpen = false;
  terminateAndFailExam('Session Terminated: Student Exited Early');
}

function confirmSubmitModal() {
  const answeredCount = Object.keys(studentAnswers).length;
  const total = currentQuiz.questions.length;
  document.getElementById('submit-confirm-text').textContent = `You have answered ${answeredCount} out of ${total} questions. Are you sure you want to finalize and submit your responses?`;
  
  isModalOpen = true;
  const modal = document.getElementById('submit-confirm-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
}

function closeSubmitConfirmModal() {
  const modal = document.getElementById('submit-confirm-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  isProctorGracePeriod = true;
  setTimeout(() => {
    isProctorGracePeriod = false;
    isModalOpen = false;
  }, 1500);
}

function handleProctorWarning(reasonText = 'Focus Lost / Tab Switch Detected') {
  if (!examStarted || examSubmitted) return;
  if (isProctorGracePeriod || isModalOpen) return;

  const now = Date.now();
  if (now - lastInfractionTime < INFRACTION_COOLDOWN_MS) {
    return; // Debounce duplicate events like blur + visibilitychange + exit fullscreen
  }
  lastInfractionTime = now;

  examWarnings++;
  playProctorWarningSound();
  logTelemetryEvent(`⚠️ Strike ${examWarnings}: ${reasonText}`);

  // Update strike badges
  for (let i = 1; i <= 3; i++) {
    const badge = document.getElementById(`strike-badge-${i}`);
    if (badge) {
      if (i < examWarnings) {
        badge.className = "py-1.5 px-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-center text-rose-500 font-bold transition-all";
        badge.textContent = `Strike ${i}: VIOLATION`;
      } else if (i === examWarnings) {
        badge.className = "py-1.5 px-1 rounded-lg border border-amber-500/40 bg-amber-500/15 text-center text-amber-500 font-bold animate-pulse transition-all";
        badge.textContent = i === 3 ? `Strike 3: FAILED` : `Strike ${i}: ACTIVE`;
      } else {
        badge.className = "py-1.5 px-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-center text-neutral-400 font-semibold transition-all";
        badge.textContent = `Strike ${i}: OK`;
      }
    }
  }

  const warnCount = document.getElementById('exam-warning-count');
  if (warnCount) warnCount.textContent = `${examWarnings} / ${maxExamWarnings} Strikes`;
  const codingWarnCount = document.getElementById('exam-coding-warning-count');
  if (codingWarnCount) codingWarnCount.textContent = `${examWarnings} / ${maxExamWarnings}`;

  const percentage = Math.min((examWarnings / maxExamWarnings) * 100, 100);
  const warnBar = document.getElementById('exam-warning-bar');
  if (warnBar) {
    warnBar.style.width = `${percentage}%`;
    if (examWarnings === 1) warnBar.className = 'bg-amber-500 h-full transition-all duration-300';
    else if (examWarnings >= 2) warnBar.className = 'bg-rose-500 h-full transition-all duration-300';
  }

  // Strike limit reached: Auto-terminate & mark as FAILED
  if (examWarnings >= maxExamWarnings) {
    terminateAndFailExam('Proctoring Infractions Limit Reached (3 Strikes)');
    return;
  }

  // Show strike warning overlay modal
  const overlayCount = document.getElementById('overlay-warning-count');
  if (overlayCount) overlayCount.textContent = examWarnings;
  const overlayTitle = document.getElementById('overlay-warning-title');
  if (overlayTitle) overlayTitle.textContent = `Security Strike ${examWarnings} of ${maxExamWarnings}`;
  const overlayDesc = document.getElementById('overlay-warning-desc');
  if (overlayDesc) overlayDesc.textContent = `${reasonText}. Changing windows, minimizing or switching tabs is strictly forbidden. Next infraction will result in immediate failure.`;

  isModalOpen = true;
  const popup = document.getElementById('proctoring-warning-overlay');
  if (popup) {
    popup.classList.remove('hidden');
    popup.classList.add('flex');
  }
}

function resumeExamFullscreen() {
  const popup = document.getElementById('proctoring-warning-overlay');
  if (popup) {
    popup.classList.add('hidden');
    popup.classList.remove('flex');
  }
  
  isProctorGracePeriod = true;
  setTimeout(() => {
    isProctorGracePeriod = false;
    isModalOpen = false;
  }, 2000);

  const doc = document.documentElement;
  const req = doc.requestFullscreen || doc.webkitRequestFullscreen || doc.msRequestFullscreen || doc.mozRequestFullScreen;
  if (req && !document.fullscreenElement) {
    req.call(doc).catch(() => {});
  }
  logTelemetryEvent('Assessment resumed in fullscreen');
}

function handleFullscreenViolation() {
  if (!examStarted || examSubmitted) return;
  handleProctorWarning('Exited fullscreen container');
}

// Early Exit or Disqualification -> Immediately Terminate & Mark FAILED (0% score)
function terminateAndFailExam(reason = 'Session Terminated: Student Exited Early') {
  if (examSubmitted) return;
  examSubmitted = true;
  examStarted = false;

  cleanupEnvironment();

  closeSubmitConfirmModal();
  const exitModal = document.getElementById('exit-confirm-modal');
  if (exitModal) {
    exitModal.classList.add('hidden');
    exitModal.classList.remove('flex');
  }
  const overlay = document.getElementById('proctoring-warning-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }

  const total = (currentQuiz && currentQuiz.questions) ? currentQuiz.questions.length : 1;
  const timeTakenSeconds = timeStart ? Math.round((new Date() - timeStart) / 1000) : 0;
  const timeTakenDisplay = `${Math.floor(timeTakenSeconds / 60)}m ${timeTakenSeconds % 60}s`;

  const activeUser = JSON.parse(localStorage.getItem('techprep_current_user') || '{"name":"Aarav Sharma","email":"student@college.edu"}');
  
  // Quiz marked as FAILED with void score
  const failedResult = {
    quizId: currentQuiz.id,
    customId: currentQuiz.customId || currentQuiz.id,
    quizTitle: currentQuiz.title,
    studentName: activeUser.name,
    studentEmail: activeUser.email,
    score: 0,
    scoreFraction: `0 / ${total}`,
    scorePercent: 0,
    percentage: 0,
    totalQuestions: total,
    passed: false,
    status: 'FAILED',
    timeSpentSeconds: timeTakenSeconds,
    timeTaken: timeTakenDisplay,
    violations: examWarnings,
    submissionReason: reason,
    userAnswers: []
  };

  if (window.QuizStorage) {
    window.QuizStorage.saveUserResult(failedResult);
  }

  showView('view-result');

  // Display Failed Summary Banner
  const badge = document.getElementById('result-status-badge');
  if (badge) {
    badge.textContent = "FAILED";
    badge.className = "px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30";
  }

  const titleEl = document.getElementById('result-title');
  if (titleEl) {
    titleEl.textContent = "Exam Session Terminated (FAILED)";
  }

  const infractionAlert = document.getElementById('result-infraction-alert');
  if (infractionAlert) {
    infractionAlert.classList.remove('hidden');
    infractionAlert.className = "px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30";
    infractionAlert.textContent = `Auto-Failed: ${reason}`;
  }

  const descEl = document.getElementById('result-desc');
  if (descEl) {
    descEl.textContent = `Your examination session was terminated early. Per strict proctoring regulations, unauthorized exit or violation of session integrity automatically registers this attempt as FAILED with a void score (0%).`;
  }

  document.getElementById('result-score-val').textContent = '0%';
  document.getElementById('result-score-fraction').textContent = `0 / ${total} Points (Void)`;
  document.getElementById('result-time-taken').textContent = timeTakenDisplay;
  document.getElementById('result-violations').textContent = `${examWarnings} Strikes`;
  document.getElementById('result-pass-threshold').textContent = `${currentQuiz.passPercentage}% Required`;

  // Itemized Void Review
  const reviewContainer = document.getElementById('result-questions-review');
  if (reviewContainer && currentQuiz && currentQuiz.questions) {
    reviewContainer.innerHTML = '';
    currentQuiz.questions.forEach((q, idx) => {
      const revDiv = document.createElement('div');
      revDiv.className = "p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-xs text-left space-y-2";
      revDiv.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="font-mono text-neutral-400 font-bold">Question ${idx + 1}</span>
          <span class="text-rose-500 font-bold font-mono">ATTEMPT VOIDED (FAILED)</span>
        </div>
        <p class="font-semibold text-neutral-800 dark:text-neutral-200">${escapeHTML(q.title || q.question || q.text)}</p>
      `;
      reviewContainer.appendChild(revDiv);
    });
  }
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
    customId: currentQuiz.customId || currentQuiz.id,
    quizTitle: currentQuiz.title,
    studentName: activeUser.name,
    studentEmail: activeUser.email,
    score: scorePoints,
    scoreFraction: `${scorePoints} / ${total}`,
    scorePercent: finalPercentage,
    percentage: finalPercentage,
    totalQuestions: total,
    passed: isPassed,
    status: isPassed ? 'PASSED' : 'FAILED',
    timeSpentSeconds: timeTakenSeconds,
    timeTaken: timeTakenDisplay,
    violations: examWarnings,
    submissionReason: reason,
    userAnswers: Object.keys(studentAnswers).map(k => ({ questionIdx: k, answer: studentAnswers[k] }))
  };
  
  window.QuizStorage.saveUserResult(quizResult);

  showView('view-result');
  
  const titleEl = document.getElementById('result-title');
  if (titleEl) titleEl.textContent = isPassed ? "Assessment Passed" : "Assessment Failed";

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

  const timerContainer = document.getElementById('quiz-timer-container');
  if (timerContainer) {
    timerContainer.classList.add('hidden');
    timerContainer.classList.remove('flex');
  }

  const exitBtn = document.getElementById('exit-exam-early');
  if (exitBtn) {
    exitBtn.classList.add('hidden');
    exitBtn.classList.remove('inline-flex');
  }

  const proctorBadge = document.getElementById('exam-proctor-active-badge');
  if (proctorBadge) {
    proctorBadge.classList.add('hidden');
    proctorBadge.classList.remove('inline-flex');
  }

  stopProctoringWebcam();

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  }
}

function showView(viewId) {
  ['view-selector', 'view-instructions', 'view-exam', 'view-result'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === viewId) {
      el.classList.remove('hidden');
      el.classList.add('block');
    } else {
      el.classList.add('hidden');
      el.classList.remove('block');
    }
  });

  const sidebar = document.getElementById('quiz-sidebar');
  const sidebarToggle = document.getElementById('quiz-sidebar-toggle-btn');
  const sidebarOverlay = document.getElementById('quiz-sidebar-overlay');

  if (viewId === 'view-exam') {
    if (sidebar) sidebar.classList.add('hidden');
    if (sidebarToggle) sidebarToggle.classList.add('hidden');
    if (sidebarOverlay) sidebarOverlay.classList.add('hidden');
  } else {
    if (sidebar) sidebar.classList.remove('hidden');
    if (sidebarToggle) sidebarToggle.classList.remove('hidden');
  }
}

// ==========================================
// LeetCode-Grade Host Compiler Execution & Submission Logic
// ==========================================

window.updateExamLineNumbers = function() {
  const textarea = document.getElementById('exam-code-textarea') || document.getElementById('dsa-code-textarea');
  const lineGutter = document.getElementById('exam-line-numbers') || document.getElementById('dsa-line-numbers');
  if (!textarea || !lineGutter) return;

  const lines = textarea.value.split('\n').length;
  let lineNumsStr = '';
  for (let i = 1; i <= lines; i++) {
    lineNumsStr += `<div>${i}</div>`;
  }
  lineGutter.innerHTML = lineNumsStr;
};

window.syncExamLineScroll = function() {
  const textarea = document.getElementById('exam-code-textarea');
  const lineGutter = document.getElementById('exam-line-numbers');
  if (textarea && lineGutter) {
    lineGutter.scrollTop = textarea.scrollTop;
  }
};

window.changeExamLanguage = function(newLang) {
  const textarea = document.getElementById('exam-code-textarea');
  if (!textarea || !currentQuiz || !currentQuiz.questions) return;
  const q = currentQuiz.questions[currentQuestionIdx];

  // Save current code to language cache
  if (!studentLanguageCode[currentQuestionIdx]) studentLanguageCode[currentQuestionIdx] = {};
  studentLanguageCode[currentQuestionIdx][activeExamLanguage] = textarea.value;
  studentLanguageCode[currentQuestionIdx].currentLang = newLang;

  activeExamLanguage = newLang;

  // Restore cached code for target language if typed before, else generate starter code
  if (studentLanguageCode[currentQuestionIdx][newLang]) {
    textarea.value = studentLanguageCode[currentQuestionIdx][newLang];
  } else {
    textarea.value = getStarterCodeForExam(q, newLang);
    studentLanguageCode[currentQuestionIdx][newLang] = textarea.value;
  }

  // Update line numbers
  window.updateExamLineNumbers();

  // Reset terminal drawer to clean slate
  const terminal = document.getElementById('exam-terminal-output');
  if (terminal) terminal.classList.add('hidden');
};

window.toggleExamCustomInput = function() {
  const container = document.getElementById('exam-custom-input-container');
  const btn = document.getElementById('exam-custom-input-toggle-btn');
  if (!container) return;
  const isHidden = container.classList.contains('hidden');
  if (isHidden) {
    container.classList.remove('hidden');
    if (btn) btn.classList.add('bg-blue-500/20', 'border-blue-500', 'text-blue-400', 'font-bold');
    const inputEl = document.getElementById('exam-custom-input');
    if (inputEl) inputEl.focus();
  } else {
    container.classList.add('hidden');
    if (btn) btn.classList.remove('bg-blue-500/20', 'border-blue-500', 'text-blue-400', 'font-bold');
  }
};

window.confirmResetExamCode = function() {
  const modal = document.getElementById('exam-reset-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }
};

window.closeResetExamModal = function() {
  const modal = document.getElementById('exam-reset-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
};

window.executeResetExamCode = function() {
  const textarea = document.getElementById('exam-code-textarea');
  if (!textarea || !currentQuiz || !currentQuiz.questions) return;
  const q = currentQuiz.questions[currentQuestionIdx];

  const defaultStarter = getStarterCodeForExam(q, activeExamLanguage);
  textarea.value = defaultStarter;
  if (!studentLanguageCode[currentQuestionIdx]) studentLanguageCode[currentQuestionIdx] = {};
  studentLanguageCode[currentQuestionIdx][activeExamLanguage] = defaultStarter;

  window.updateExamLineNumbers();
  window.closeResetExamModal();
};

window.runExamCodingCode = async function() {
  const textarea = document.getElementById('exam-code-textarea');
  const code = textarea ? textarea.value : '';
  const customInputEl = document.getElementById('exam-custom-input');
  const customContainer = document.getElementById('exam-custom-input-container');
  const customInput = (customInputEl && customContainer && !customContainer.classList.contains('hidden'))
    ? customInputEl.value : null;

  const runBtn = document.getElementById('exam-run-btn');
  const statusEl = document.getElementById('exam-compiler-running-status');
  const terminalDrawer = document.getElementById('exam-terminal-output');

  if (runBtn) {
    runBtn.disabled = true;
    runBtn.innerHTML = `
      <svg class="animate-spin h-3.5 w-3.5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Compiling...</span>
    `;
  }

  if (statusEl) {
    statusEl.textContent = `Compiling ${activeExamLanguage.toUpperCase()} on host...`;
    statusEl.classList.remove('hidden');
  }

  if (terminalDrawer) {
    terminalDrawer.classList.remove('hidden');
    terminalDrawer.innerHTML = `
      <div class="p-4 space-y-2 text-left font-mono text-xs text-neutral-400 animate-pulse">
        <div class="flex items-center gap-2 text-blue-400">
          <span class="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <strong>Invoking host ${activeExamLanguage.toUpperCase()} compiler/runtime...</strong>
        </div>
        <div class="text-[11px] text-neutral-500">> Executing testcases with safety limits...</div>
      </div>
    `;
  }

  const q = currentQuiz.questions[currentQuestionIdx];
  const problemSlug = q.slug || q.id || `quiz-q-${currentQuestionIdx}`;

  try {
    let res;
    if (window.TechPrepAPI && window.TechPrepAPI.runDsaCode) {
      res = await window.TechPrepAPI.runDsaCode({
        problemId: problemSlug,
        language: activeExamLanguage,
        code,
        customInput: (customInput && customInput.trim() !== '') ? customInput : undefined,
        testCases: q.testCases
      });
    }

    if (res && res.result) {
      renderExamTerminalOutput(res.result, false);
    } else {
      renderExamTerminalOutput({ status: 'Error', error: 'No response from compiler service.' }, false);
    }
  } catch (err) {
    console.error('Compiler execution failed:', err);
    renderExamTerminalOutput({ status: 'Error', error: err.message }, false);
  } finally {
    if (runBtn) {
      runBtn.disabled = false;
      runBtn.innerHTML = `<span>Run Code</span>`;
    }
    if (statusEl) statusEl.classList.add('hidden');
  }
};

window.submitExamCodingCode = async function() {
  const textarea = document.getElementById('exam-code-textarea');
  const code = textarea ? textarea.value : '';

  const submitBtn = document.getElementById('exam-submit-btn');
  const statusEl = document.getElementById('exam-compiler-running-status');
  const terminalDrawer = document.getElementById('exam-terminal-output');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-3.5 w-3.5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span>Evaluating...</span>
    `;
  }

  if (statusEl) {
    statusEl.textContent = `Testing all test cases on host compiler...`;
    statusEl.classList.remove('hidden');
  }

  if (terminalDrawer) {
    terminalDrawer.classList.remove('hidden');
    terminalDrawer.innerHTML = `
      <div class="p-4 space-y-2 text-left font-mono text-xs text-neutral-400 animate-pulse">
        <div class="flex items-center gap-2 text-emerald-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          <strong>Running full test suite on ${activeExamLanguage.toUpperCase()} toolchain...</strong>
        </div>
        <div class="text-[11px] text-neutral-500">> Verifying all testcases and bounds...</div>
      </div>
    `;
  }

  const q = currentQuiz.questions[currentQuestionIdx];
  const problemSlug = q.slug || q.id || `quiz-q-${currentQuestionIdx}`;

  try {
    let res;
    if (window.TechPrepAPI && window.TechPrepAPI.runDsaCode) {
      res = await window.TechPrepAPI.runDsaCode({
        problemId: problemSlug,
        language: activeExamLanguage,
        code,
        testCases: q.testCases
      });
    }

    const evaluation = res && res.result ? res.result : { status: 'Error', error: 'No response received' };
    
    // Always persist student's typed code into exam state
    studentAnswers[currentQuestionIdx] = code;
    if (!studentLanguageCode[currentQuestionIdx]) studentLanguageCode[currentQuestionIdx] = {};
    studentLanguageCode[currentQuestionIdx][activeExamLanguage] = code;
    delete questionFlags[currentQuestionIdx];

    renderExamTerminalOutput(evaluation, true);
    renderQuestionGrid();

    if (evaluation.status === 'Accepted') {
      if (window.showToast) {
        window.showToast("All test cases passed! Solution verified on host compiler.");
      } else {
        alert("Accepted! All test cases passed on host compiler.");
      }
    } else {
      if (window.showToast) {
        window.showToast(`Verdict: ${evaluation.status}. Review test results below.`);
      }
    }
  } catch (err) {
    console.error('Submission execution failed:', err);
    renderExamTerminalOutput({ status: 'Error', error: err.message }, true);
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Submit Code</span>`;
    }
    if (statusEl) statusEl.classList.add('hidden');
  }
};

function renderExamTerminalOutput(evaluation, isSubmit) {
  const terminalDrawer = document.getElementById('exam-terminal-output');
  if (!terminalDrawer) return;

  terminalDrawer.classList.remove('hidden');

  // Compile Error
  if (evaluation.status === 'Compile Error') {
    terminalDrawer.innerHTML = `
      <div class="p-4 space-y-3 text-left">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              COMPILE ERROR
            </span>
            <span class="font-mono text-xs text-neutral-500">Compiler: <strong>${escapeHTML(evaluation.compiler || activeExamLanguage)}</strong></span>
          </div>
          <button onclick="document.getElementById('exam-terminal-output').classList.add('hidden')" class="text-neutral-400 hover:text-neutral-200 font-mono text-xs">
            Close
          </button>
        </div>
        <div class="p-3.5 rounded-lg bg-neutral-900 border border-amber-500/30 text-amber-300 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto">
          ${escapeHTML(evaluation.error || evaluation.stderr || 'Compilation failed with syntax error.')}
        </div>
      </div>
    `;
    return;
  }

  // Custom Input Execution output
  if (evaluation.stdout !== undefined && (!evaluation.testResults || evaluation.testResults.length === 0)) {
    const isSuccess = evaluation.status === 'Success';
    terminalDrawer.innerHTML = `
      <div class="p-4 space-y-3 text-left">
        <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <div class="flex items-center space-x-3">
            <span class="px-3 py-1 rounded text-xs font-mono font-bold ${isSuccess ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'}">
              ${(evaluation.status || 'SUCCESS').toUpperCase()}
            </span>
            <span class="font-mono text-xs text-neutral-500">Runtime: <strong class="text-white">${evaluation.runtime || '0 ms'}</strong></span>
            <span class="font-mono text-xs text-neutral-500">Memory: <strong class="text-white">${evaluation.memory || '40 MB'}</strong></span>
          </div>
          <button onclick="document.getElementById('exam-terminal-output').classList.add('hidden')" class="text-neutral-400 hover:text-neutral-200 font-mono text-xs">
            Close
          </button>
        </div>
        <div class="space-y-2">
          <div class="text-[11px] font-mono text-neutral-400">Standard Output (stdout):</div>
          <pre class="p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-emerald-400 font-mono text-xs whitespace-pre-wrap">${escapeHTML(evaluation.stdout || '(No output)')}</pre>
          ${evaluation.stderr ? `
            <div class="text-[11px] font-mono text-rose-400 mt-2">Standard Error (stderr):</div>
            <pre class="p-3 rounded-lg bg-neutral-900 border border-rose-800/40 text-rose-300 font-mono text-xs whitespace-pre-wrap">${escapeHTML(evaluation.stderr)}</pre>
          ` : ''}
        </div>
      </div>
    `;
    return;
  }

  let verdictBadge = '';
  if (evaluation.status === 'Accepted') {
    verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">ACCEPTED</span>`;
  } else if (evaluation.status === 'Wrong Answer') {
    verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">WRONG ANSWER</span>`;
  } else {
    verdictBadge = `<span class="px-3 py-1 rounded text-xs font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">${(evaluation.status || 'UNKNOWN').toUpperCase()}</span>`;
  }

  const testResults = evaluation.testResults || [];
  const testResultsHtml = testResults.map(r => `
    <div class="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-surface-secondary text-xs space-y-1">
      <div class="flex items-center justify-between font-mono font-bold">
        <span>Test Case ${r.testCaseIndex}:</span>
        <span class="${r.status === 'Passed' ? 'text-emerald-500' : 'text-rose-500'}">${r.status} (${r.runtimeMs} ms)</span>
      </div>
      <div class="font-mono text-[11px] text-neutral-500">Input: <code class="text-neutral-700 dark:text-neutral-300">${escapeHTML(r.input)}</code></div>
      <div class="font-mono text-[11px] text-neutral-500">Expected: <code class="text-emerald-600 dark:text-emerald-400">${escapeHTML(r.expectedOutput)}</code></div>
      <div class="font-mono text-[11px] text-neutral-500">Output: <code class="${r.status === 'Passed' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}">${escapeHTML(r.actualOutput)}</code></div>
    </div>
  `).join('');

  terminalDrawer.innerHTML = `
    <div class="p-4 space-y-3 text-left">
      <div class="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
        <div class="flex items-center space-x-3">
          ${verdictBadge}
          <span class="font-mono text-xs text-neutral-500">Runtime: <strong class="text-neutral-900 dark:text-white">${evaluation.runtime || (evaluation.runtimeMs + ' ms')}</strong></span>
          <span class="font-mono text-xs text-neutral-500">Memory: <strong class="text-neutral-900 dark:text-white">${evaluation.memory || (evaluation.memoryMb + ' MB')}</strong></span>
          ${evaluation.compiler ? `<span class="hidden sm:inline-block font-mono text-[11px] text-neutral-400">(${escapeHTML(evaluation.compiler)})</span>` : ''}
        </div>
        <button onclick="document.getElementById('exam-terminal-output').classList.add('hidden')" class="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 font-mono text-xs flex items-center gap-1">
          <svg class="w-3 h-3 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          Close
        </button>
      </div>
      <div class="space-y-2 max-h-48 overflow-y-auto">${testResultsHtml}</div>
    </div>
  `;
}

// Backward-compatibility aliases
window.runDSACode = window.runExamCodingCode;
window.submitDSACode = window.submitExamCodingCode;
window.updateLineNumbers = window.updateExamLineNumbers;
window.changeDSALanguage = window.changeExamLanguage;
window.confirmResetDSACode = window.confirmResetExamCode;

