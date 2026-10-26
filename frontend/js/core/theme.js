/**
 * TechPrep AI - Theme Engine Initialization
 * Prevents Flash of Unstyled Content (FOUC) by checking theme preference early in <head>
 */
(function () {
  try {
    let storedTheme = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('techprep_theme') : null;
    if (!storedTheme) {
      storedTheme = 'system';
    }

    let isDark = false;
    if (storedTheme === 'dark') {
      isDark = true;
    } else if (storedTheme === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  } catch (e) {
    console.warn('Unable to access theme:', e);
  }
})();
