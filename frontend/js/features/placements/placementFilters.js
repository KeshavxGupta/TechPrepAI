/**
 * Placement Drive Filtering & Countdown Utilities
 */
function getDaysRemaining(deadlineStr) {
  if (!deadlineStr) return 0;
  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffTime = deadline - now;
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

function filterPlacements(drives, { query = '', minPackage = 0, status = 'all' }) {
  return (drives || []).filter(drive => {
    const matchesQuery = !query || 
      drive.company.toLowerCase().includes(query.toLowerCase()) || 
      drive.role.toLowerCase().includes(query.toLowerCase());

    const pkgNum = parseFloat(drive.package) || 0;
    const matchesPackage = pkgNum >= minPackage;

    const matchesStatus = status === 'all' || drive.status === status;

    return matchesQuery && matchesPackage && matchesStatus;
  });
}

window.PlacementUtils = { getDaysRemaining, filterPlacements };
