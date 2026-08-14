/**
 * TechPrep AI - Theme Engine Initialization
 * Prevents Flash of Unstyled Content (FOUC) by checking theme preference early in <head>
 */
(function () {
  try {
    const user = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
    const themeKey = user && user.email ? `techprep_theme_${user.email}` : 'techprep_theme';
    const storedTheme = localStorage.getItem(themeKey) || 'system';
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



