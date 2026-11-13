// Each URL owns one React root. Existing feature controllers can mutate their
// mounted work areas, so the page root deliberately does not rerender afterwards.
// New interactive UI uses isolated React components and hooks.
export function loadClassicScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.append(script);
  });
}
async function loadVendor(url) {
  if (url.includes('marked')) window.marked = await import('marked');
  else if (url.includes('chart.js')) window.Chart = (await import('chart.js/auto')).default;
  else if (url.includes('canvas-confetti'))
    window.confetti = (await import('canvas-confetti')).default;
  else if (url.includes('mammoth'))
    window.mammoth = (await import('mammoth/mammoth.browser.js')).default;
  else if (url.includes('xlsx')) window.XLSX = await import('xlsx');
  else if (url.includes('mathjax')) {
    window.MathJax = {
      tex: {
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)']
        ],
        displayMath: [
          ['$$', '$$'],
          ['\\[', '\\]']
        ]
      },
      startup: { typeset: false }
    };
    // Math typesetting is an enhancement; a CDN outage must not disable the planner.
    loadClassicScript(url).catch((error) => console.warn('Math typesetting unavailable:', error));
  } else throw new Error(`Unconfigured dependency: ${url}`);
}
export async function startControllers(scripts, initialize) {
  for (const script of scripts) {
    if (script.vendor) await loadVendor(script.vendor);
    else await loadClassicScript(script.src);
  }
  document.dispatchEvent(new Event('techprep:ready'));
  if (initialize) {
    if (typeof window[initialize] !== 'function')
      throw new Error(`Missing initializer: ${initialize}`);
    window[initialize]();
  }
  document.documentElement.dataset.appReady = 'true';
}
export function showStartupError(error) {
  console.error(error);
  const notice = document.createElement('div');
  notice.className = 'startup-error';
  notice.setAttribute('role', 'alert');
  notice.append('Some tools could not start. Check your connection and reload. ');
  const retry = document.createElement('button');
  retry.textContent = 'Reload';
  retry.onclick = () => location.reload();
  notice.append(retry);
  document.body.append(notice);
}
