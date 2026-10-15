/**
 * Technical Resume Keyword Extraction & Skill Gap Analysis
 */
const TECH_KEYWORDS = [
  'javascript', 'typescript', 'react', 'node.js', 'express', 'mongodb',
  'python', 'django', 'fastapi', 'java', 'spring boot', 'c++', 'sql',
  'postgresql', 'docker', 'kubernetes', 'aws', 'git', 'rest api', 'graphql',
  'data structures', 'algorithms', 'system design', 'ci/cd', 'redis'
];

function extractKeywords(text) {
  const normalized = (text || '').toLowerCase();
  const matched = [];

  for (const kw of TECH_KEYWORDS) {
    if (normalized.includes(kw)) {
      matched.push(kw);
    }
  }

  return Array.from(new Set(matched));
}

function calculateMatchScore(resumeText, jobDescription) {
  const resumeKws = new Set(extractKeywords(resumeText));
  const jobKws = new Set(extractKeywords(jobDescription));

  if (jobKws.size === 0) return { score: 100, matching: Array.from(resumeKws), missing: [] };

  const matching = [];
  const missing = [];

  jobKws.forEach(kw => {
    if (resumeKws.has(kw)) matching.push(kw);
    else missing.push(kw);
  });

  const score = Math.round((matching.length / jobKws.size) * 100);
  return { score, matching, missing };
}

module.exports = { extractKeywords, calculateMatchScore };
