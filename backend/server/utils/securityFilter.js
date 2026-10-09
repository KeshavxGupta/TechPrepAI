/**
 * Static security heuristic scanner for untrusted code execution
 */
const FORBIDDEN_PATTERNS = {
  javascript: [
    /child_process/i,
    /process\.binding/i,
    /process\.exit/i,
    /require\(['"]fs['"]\)/i,
    /require\(['"]net['"]\)/i,
    /require\(['"]http['"]\)/i
  ],
  python: [
    /import\s+os\b/i,
    /import\s+subprocess\b/i,
    /import\s+sys\s*;\s*sys\.exit/i,
    /__import__\(['"]os['"]\)/i,
    /shutil\./i
  ],
  cpp: [
    /#include\s*<windows\.h>/i,
    /#include\s*<sys\/socket\.h>/i,
    /system\s*\(/i,
    /fork\s*\(/i
  ],
  java: [
    /Runtime\.getRuntime\(\)/i,
    /ProcessBuilder/i,
    /System\.exit/i
  ]
};

function scanCodeForVulnerabilities(code, language) {
  const langKey = (language || 'javascript').toLowerCase();
  const patterns = FORBIDDEN_PATTERNS[langKey] || [];

  for (const pattern of patterns) {
    if (pattern.test(code)) {
      return {
        safe: false,
        reason: `Prohibited pattern detected matching security heuristic: ${pattern.toString()}`
      };
    }
  }

  return { safe: true };
}

module.exports = { scanCodeForVulnerabilities };
