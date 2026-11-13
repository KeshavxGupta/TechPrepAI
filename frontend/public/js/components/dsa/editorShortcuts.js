/**
 * Global Keyboard Shortcuts Manager for Code Workspaces
 */
(function() {
  document.addEventListener('keydown', function(e) {
    // Ctrl + Enter or Cmd + Enter -> Run Code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !e.shiftKey) {
      const runBtn = document.getElementById('exam-run-btn') || document.getElementById('dsa-run-btn');
      if (runBtn && !runBtn.disabled) {
        e.preventDefault();
        runBtn.click();
      }
    }

    // Ctrl + Shift + Enter or Cmd + Shift + Enter -> Submit Code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && e.shiftKey) {
      const submitBtn = document.getElementById('exam-submit-btn') || document.getElementById('dsa-submit-btn');
      if (submitBtn && !submitBtn.disabled) {
        e.preventDefault();
        submitBtn.click();
      }
    }
  });
})();
