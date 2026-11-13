window.addEventListener('offline', () => {
  console.warn('Network connection lost.');
});
window.addEventListener('online', () => {
  console.log('Network connection restored.');
});
