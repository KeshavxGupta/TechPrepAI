const USERS_STORAGE_KEY = 'techprep_registered_users';
const CURRENT_USER_KEY = 'techprep_current_user';

// Check profile completeness helper
window.checkProfileCompleteness = function (user) {
  if (!user) return { complete: false, percentage: 0, missing: [] };
  const requiredFields = [
    { key: 'profilePic', label: 'Profile Picture' },
    { key: 'contact', label: 'Contact Number' },
    { key: 'dob', label: 'Date of Birth' },
    { key: 'address', label: 'Address' },
    { key: 'college', label: 'College' },
    { key: 'degree', label: 'Degree' },
    { key: 'branch', label: 'Branch' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'gradYear', label: 'Graduation Year' },
    { key: 'cgpa', label: 'CGPA' },
    { key: 'marks10', label: '10th Marks' },
    { key: 'marks12', label: '12th Marks' },
    { key: 'skills', label: 'Skills' },
    { key: 'leetcode', label: 'Coding Profile Link' },
    { key: 'github', label: 'GitHub Link' },
    { key: 'linkedin', label: 'LinkedIn Link' },
    { key: 'portfolio', label: 'Portfolio Link' }
  ];

  let filledCount = 0;
  const missing = [];
  requiredFields.forEach(f => {
    if (user[f.key] && String(user[f.key]).trim() !== '') {
      filledCount++;
    } else {
      missing.push(f.label);
    }
  });

  const percentage = Math.round((filledCount / requiredFields.length) * 100);
  return {
    complete: percentage === 100,
    percentage: percentage,
    missing: missing
  };
};

// Sync profile pic across multiple views
window.syncUserAvatar = function (user) {
  if (!user) return;
  const userInitialsEls = document.querySelectorAll('#user-avatar-initials');
  userInitialsEls.forEach(el => {
    if (user.profilePic && user.profilePic.trim() !== '') {
      el.innerHTML = `<img src="${user.profilePic}" alt="${user.name}" class="w-full h-full object-cover rounded-full">`;
      el.className = "w-8 h-8 rounded-full flex items-center justify-center font-mono select-none overflow-hidden ring-1 ring-blue-500/30";
    } else {
      const names = user.name.trim().split(' ');
      const initials = names.length > 1
        ? (names[0][0] + names[names.length - 1][0]).toUpperCase()
        : names[0].substring(0, 2).toUpperCase();
      el.textContent = initials;
      el.className = "w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center font-mono select-none";
    }
  });
};

// Define global logout
window.logoutUser = function () {
  storage.remove(CURRENT_USER_KEY);
  window.location.href = '/index.html';
};

function initPasswordVisibilityTogglers() {
  const togglers = document.querySelectorAll('.toggle-password');
  togglers.forEach(btn => {
    const input = btn.parentElement ? btn.parentElement.querySelector('input') : null;
    if (!input) return;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isPwd = input.type === 'password';
      input.type = isPwd ? 'text' : 'password';
      
      if (isPwd) {
        btn.innerHTML = `
          <svg class="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.863 7.863L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        `;
      } else {
        btn.innerHTML = `
          <svg class="w-4 h-4 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        `;
      }
    });
  });
}

function initAuthModals() {
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const loginTriggers = document.querySelectorAll('.open-login-modal');
  const signupTriggers = document.querySelectorAll('.open-signup-modal');
  const closeBtns = document.querySelectorAll('.close-modal-btn');
  const modalBackdrops = document.querySelectorAll('.modal-backdrop');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  loginTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(signupModal);
      openModal(loginModal);
    });
  });

  signupTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal(loginModal);
      openModal(signupModal);
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      closeModal(loginModal);
      closeModal(signupModal);
    });
  });

  modalBackdrops.forEach(backdrop => {
    backdrop.addEventListener('click', () => {
      closeModal(loginModal);
      closeModal(signupModal);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(loginModal);
      closeModal(signupModal);
    }
  });
}

function initAuthSystem() {
  function showAuthFeedback(elementId, message, isError = true) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove('hidden', 'bg-rose-500/10', 'text-rose-600', 'border-rose-500/20', 'bg-emerald-500/10', 'text-emerald-600', 'border-emerald-500/20');

    if (isError) {
      el.classList.add('bg-rose-500/10', 'text-rose-600', 'dark:text-rose-400', 'border', 'border-rose-500/20');
    } else {
      el.classList.add('bg-emerald-500/10', 'text-emerald-600', 'dark:text-emerald-400', 'border', 'border-emerald-500/20');
    }
  }

  // Check index.html URL params for auto-opening modal
  const urlParams = new URLSearchParams(window.location.search);
  const modalParam = urlParams.get('modal');
  const registeredEmail = urlParams.get('email');
  const isRegistered = urlParams.get('registered');

  if (modalParam === 'login') {
    setTimeout(() => {
      const loginModal = document.getElementById('login-modal');
      if (loginModal) {
        loginModal.classList.remove('hidden');
        loginModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        
        const emailField = loginModal.querySelector('input[type="email"]');
        if (emailField && registeredEmail) {
          emailField.value = registeredEmail;
        }
        
        if (isRegistered) {
          window.customAlert('Success', 'Registration successful! Please login below to enter your dashboard.', 'success');
        }
      }
    }, 100);
  } else if (modalParam === 'signup') {
    setTimeout(() => {
      const signupModal = document.getElementById('signup-modal');
      if (signupModal) {
        signupModal.classList.remove('hidden');
        signupModal.classList.add('flex');
        document.body.style.overflow = 'hidden';
      }
    }, 100);
  }

  // Update UI if User is Logged In
  const currentUser = storage.get(CURRENT_USER_KEY, null);
  const welcomeUserEl = document.getElementById('welcome-user-name');
  const userDisplayNameEl = document.getElementById('user-display-name');
  const logoutBtn = document.getElementById('dashboard-logout-btn');

  if (currentUser) {
    const isAdmin = currentUser.email === 'khushboo2006june@admin.com';

    if (welcomeUserEl) welcomeUserEl.textContent = currentUser.name;
    if (userDisplayNameEl) userDisplayNameEl.textContent = currentUser.name;

    syncUserAvatar(currentUser);

    const navAuthContainer = document.getElementById('nav-auth-container');
    const mobileNavAuthContainer = document.getElementById('mobile-nav-auth-container');

    if (navAuthContainer) {
      if (isAdmin) {
        navAuthContainer.innerHTML = `
          <a href="/pages/admin/admin-hub.html" class="px-3.5 py-1.5 text-xs font-semibold rounded-md border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">Admin Console</a>
          <button onclick="logoutUser()" class="px-4 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm">
            Logout
          </button>
        `;
      } else {
        navAuthContainer.innerHTML = `
          <a href="/pages/user/dashboard.html" class="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">
            Dashboard
          </a>
          <button onclick="logoutUser()" class="px-4 py-1.5 text-xs font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm">
            Logout
          </button>
        `;
      }
    }

    if (mobileNavAuthContainer) {
      if (isAdmin) {
        mobileNavAuthContainer.innerHTML = `
          <a href="/pages/admin/admin-hub.html" class="block text-center px-4 py-2 text-sm font-semibold rounded-md border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200">Admin Console</a>
          <button onclick="logoutUser()" class="w-full text-center px-4 py-2 text-sm font-semibold rounded-md border border-rose-500/30 text-rose-600">
            Logout
          </button>
        `;
      } else {
        mobileNavAuthContainer.innerHTML = `
          <a href="/pages/user/dashboard.html" class="block text-center px-4 py-2 text-sm font-semibold rounded-md bg-neutral-900 text-white dark:bg-white dark:text-neutral-950">
            Dashboard
          </a>
          <button onclick="logoutUser()" class="w-full text-center px-4 py-2 text-sm font-semibold rounded-md border border-rose-500/30 text-rose-600">
            Logout
          </button>
        `;
      }
    }

    const loginBtns = document.querySelectorAll('.open-login-modal');
    const signupBtns = document.querySelectorAll('.open-signup-modal');
    loginBtns.forEach(btn => {
      btn.textContent = isAdmin ? 'Admin Console' : 'Dashboard';
      btn.classList.remove('open-login-modal');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = isAdmin ? '/pages/admin/admin-hub.html' : '/pages/user/dashboard.html';
      });
    });
    signupBtns.forEach(btn => {
      btn.style.display = 'none';
    });
  }

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
    });
  }

  // Standalone Signup Form Handler
  const standaloneSignupForm = document.getElementById('standalone-signup-form');
  if (standaloneSignupForm) {
    standaloneSignupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('signup-name');
      const emailInput = document.getElementById('signup-email');
      const passwordInput = document.getElementById('signup-password');
      const confirmPasswordInput = document.getElementById('signup-confirm-password');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
      const password = passwordInput ? passwordInput.value : '';
      const confirmPassword = confirmPasswordInput ? confirmPasswordInput.value : '';

      if (!name || !email || !password) {
        showAuthFeedback('signup-error-msg', 'Please fill in all required fields.');
        return;
      }

      if (confirmPasswordInput && password !== confirmPassword) {
        showAuthFeedback('signup-error-msg', 'Passwords do not match. Please re-enter passwords.');
        return;
      }

      if (password.length < 6) {
        showAuthFeedback('signup-error-msg', 'Password must be at least 6 characters long.');
        return;
      }

      const existingUsers = storage.get(USERS_STORAGE_KEY, []);
      if (existingUsers.some(u => u.email === email) || email === 'khushboo2006june@admin.com') {
        window.customAlert('Registration Error', 'An account with this email is already registered. Please log in.', 'warning');
        showAuthFeedback('signup-error-msg', 'An account with this email is already registered. Please log in.');
        return;
      }

      const newUser = {
        name,
        email,
        password,
        profilePic: '',
        contact: '',
        dob: '',
        address: '',
        college: '',
        degree: '',
        branch: '',
        specialization: '',
        gradYear: '',
        cgpa: '',
        marks10: '',
        marks12: '',
        skills: '',
        leetcode: '',
        github: '',
        linkedin: '',
        portfolio: '',
        suspended: false,
        createdAt: new Date().toISOString()
      };
      existingUsers.push(newUser);
      storage.set(USERS_STORAGE_KEY, existingUsers);

      showAuthFeedback('signup-error-msg', 'Account created successfully! Redirecting to login...', false);

      setTimeout(() => {
        window.location.href = `/pages/public/login.html?email=${encodeURIComponent(email)}&registered=true`;
      }, 700);
    });
  }

  // Standalone Login Form Handler
  const standaloneLoginForm = document.getElementById('standalone-login-form');
  if (standaloneLoginForm) {
    standaloneLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = document.getElementById('login-email');
      const passwordInput = document.getElementById('login-password');

      const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
      const password = passwordInput ? passwordInput.value : '';

      if (!email || !password) {
        showAuthFeedback('login-error-msg', 'Please enter your email and password.');
        return;
      }

      const isAdmin = (email === 'khushboo2006june@admin.com' && password === 'khushboo');
      let matchedUser = null;

      if (isAdmin) {
        matchedUser = {
          name: 'Khushboo (Admin)',
          email: 'khushboo2006june@admin.com',
          role: 'admin',
          profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          college: 'Admin Suite',
          branch: 'Operations',
          cgpa: '10.0'
        };
      } else {
        const users = storage.get(USERS_STORAGE_KEY, []);
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
          if (found.suspended) {
            showAuthFeedback('login-error-msg', 'Your account has been suspended by an administrator. Please contact support.');
            window.customAlert('Account Suspended', 'Your account has been suspended by an administrator. Please contact support.', 'error');
            return;
          }
          matchedUser = found;
        }
      }

      if (matchedUser) {
        storage.set(CURRENT_USER_KEY, matchedUser);
        const redirectTarget = matchedUser.email === 'khushboo2006june@admin.com' ? '/pages/admin/admin-hub.html' : '/pages/user/dashboard.html';
        showAuthFeedback('login-error-msg', 'Login successful! Redirecting...', false);
        setTimeout(() => {
          window.location.href = redirectTarget;
        }, 600);
      } else {
        showAuthFeedback('login-error-msg', 'Invalid email or password. Please check your credentials.');
        window.customAlert('Login Error', 'Invalid email or password. Please check your credentials.', 'error');
      }
    });
  }

  // Modal Login & Signup Handlers (if present in index.html)
  const loginModalForm = document.querySelector('#login-modal form');
  if (loginModalForm) {
    loginModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = loginModalForm.querySelectorAll('input');
      const email = inputs[0] ? inputs[0].value.trim().toLowerCase() : '';
      const password = inputs[1] ? inputs[1].value : '';

      const isAdmin = (email === 'khushboo2006june@admin.com' && password === 'khushboo');
      let matchedUser = null;

      if (isAdmin) {
        matchedUser = {
          name: 'Khushboo (Admin)',
          email: 'khushboo2006june@admin.com',
          role: 'admin',
          profilePic: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
          college: 'Admin Suite',
          branch: 'Operations',
          cgpa: '10.0'
        };
      } else {
        const users = storage.get(USERS_STORAGE_KEY, []);
        const found = users.find(u => u.email === email && u.password === password);
        if (found) {
          if (found.suspended) {
            window.customAlert('Account Suspended', 'Your account has been suspended by an administrator. Please contact support.', 'error');
            return;
          }
          matchedUser = found;
        }
      }

      if (matchedUser) {
        storage.set(CURRENT_USER_KEY, matchedUser);
        window.location.href = matchedUser.email === 'khushboo2006june@admin.com' ? '/pages/admin/admin-hub.html' : '/pages/user/dashboard.html';
      } else {
        window.customAlert('Login Error', 'Invalid email or password.', 'error');
      }
    });
  }

  const signupModalForm = document.querySelector('#signup-modal form');
  if (signupModalForm) {
    signupModalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = signupModalForm.querySelectorAll('input');
      const name = inputs[0] ? inputs[0].value.trim() : 'Student';
      const email = inputs[1] ? inputs[1].value.trim().toLowerCase() : '';
      const password = inputs[2] ? inputs[2].value : '';
      const confirmPassword = inputs[3] ? inputs[3].value : '';

      if (name && email && password) {
        if (password !== confirmPassword) {
          window.customAlert('Registration Error', 'Passwords do not match.', 'warning');
          return;
        }

        const users = storage.get(USERS_STORAGE_KEY, []);
        if (users.some(u => u.email === email) || email === 'khushboo2006june@admin.com') {
          window.customAlert('Registration Error', 'This email is already registered. Please log in.', 'warning');
          return;
        }
        users.push({
          name,
          email,
          password,
          profilePic: '',
          contact: '',
          dob: '',
          address: '',
          college: '',
          degree: '',
          branch: '',
          specialization: '',
          gradYear: '',
          cgpa: '',
          marks10: '',
          marks12: '',
          skills: '',
          leetcode: '',
          github: '',
          linkedin: '',
          portfolio: '',
          suspended: false,
          createdAt: new Date().toISOString()
        });
        storage.set(USERS_STORAGE_KEY, users);

        window.customAlert('Registration Success', 'Registration successful! You can now log in.', 'success');

        const signupModal = document.getElementById('signup-modal');
        if (signupModal) {
          signupModal.classList.add('hidden');
          signupModal.classList.remove('flex');
        }

        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
          loginModal.classList.remove('hidden');
          loginModal.classList.add('flex');
          const loginEmailInput = loginModal.querySelector('input[type="email"]');
          if (loginEmailInput) loginEmailInput.value = email;
          const loginPasswordInput = loginModal.querySelector('input[type="password"]');
          if (loginPasswordInput) loginPasswordInput.focus();
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPasswordVisibilityTogglers();
  initAuthModals();
  initAuthSystem();
});



