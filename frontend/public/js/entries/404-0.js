(function () {
      const storedTheme = (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('techprep_theme')) || 'system';
      let isDark = false;
      if (storedTheme === 'dark') isDark = true;
      else if (storedTheme === 'light') isDark = false;
      else isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isDark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    })();
