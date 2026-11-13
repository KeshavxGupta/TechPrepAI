/**
 * Accessibility Helper for Screen Readers & Focus Management
 */
function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('a11y-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'a11y-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden;';
    document.body.appendChild(announcer);
  }
  announcer.textContent = message;
}

window.announceToScreenReader = announceToScreenReader;
