/**
 * TechPrep AI - Theme Engine Initialization
 * Prevents Flash of Unstyled Content (FOUC) by checking theme preference early in <head>
 */
(function () {
  try {
    const storedTheme = localStorage.getItem('techprep_theme') || 'system';
    let isDark = false;
    if (storedTheme === 'dark') {
      isDark = true;
    } else if (storedTheme === 'light') {
      isDark = false;
    } else {
      isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  } catch (e) {
    console.warn('Unable to access localStorage for theme:', e);
  }
})();
