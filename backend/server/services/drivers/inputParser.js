/**
 * Universal Stdin & Argument List Parser for DSA Compiler Harnesses
 */
function parseInputArguments(rawInput) {
  if (!rawInput || typeof rawInput !== 'string') return [];
  const clean = rawInput.trim();
  if (!clean) return [];

  // Check multi-line inputs first
  const lines = clean.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return lines.map(line => {
      try { return JSON.parse(line); } catch (e) { return line.replace(/^"|"$/g, ''); }
    });
  }

  // Single line comma-separated input list (e.g. "[2, 7, 11, 15], 9")
  try {
    return JSON.parse('[' + clean + ']');
  } catch (e) {
    try {
      return [JSON.parse(clean)];
    } catch (e2) {
      return [clean.replace(/^"|"$/g, '')];
    }
  }
}

module.exports = { parseInputArguments };
