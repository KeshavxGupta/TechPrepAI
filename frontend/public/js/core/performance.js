/**
 * Frontend Performance Optimization & Critical Preloading
 */
(function() {
  // Preload critical Google Fonts
  const fontLinks = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  fontLinks.forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    }
  });
})();
