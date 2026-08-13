/**
 * TechPrep AI - Core Resume Engine & Canva-style Layout System
 */

const RESUME_TEMPLATES_KEY = 'techprep_resume_templates';
const USER_RESUMES_KEY = 'techprep_user_resumes';

// Available Accent Color Palettes (Canva-style options)
const COLOR_PALETTES = [
  { name: 'Sapphire Blue', hex: '#2563eb' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Royal Purple', hex: '#7c3aed' },
  { name: 'Crimson Red', hex: '#e11d48' },
  { name: 'Slate Obsidian', hex: '#0f172a' },
  { name: 'Amber Gold', hex: '#d97706' },
  { name: 'Sky Cyan', hex: '#0284c7' },
  { name: 'Deep Burgundy', hex: '#8d1b3d' }
];

// Seed Canva-style Layout Templates
const SEED_RESUME_TEMPLATES = [
  {
    id: 'tmpl_modern_sidebar',
    title: 'Canva Modern Tech (Sidebar Design)',
    category: 'Software Engineering',
    description: 'Two-column design with accent sidebar for contact & skills, and clean main column for work experience & projects.',
    layoutType: 'modern_sidebar',
    defaultColor: '#2563eb',
    fontFamily: 'Inter, sans-serif'
  },
  {
    id: 'tmpl_minimalist_sv',
    title: 'Silicon Valley Minimalist',
    category: 'Fullstack & Backend',
    description: 'Crisp single-column design with bold section dividers and high-impact metric formatting.',
    layoutType: 'minimalist_sv',
    defaultColor: '#0f172a',
    fontFamily: 'Roboto, sans-serif'
  },
  {
    id: 'tmpl_executive_split',
    title: 'Executive Leader & Lead',
    category: 'Product & Engineering Lead',
    description: 'Hero header banner card with split grid section for executive summaries and career milestones.',
    layoutType: 'executive_split',
    defaultColor: '#059669',
    fontFamily: 'Inter, sans-serif'
  },
  {
    id: 'tmpl_ivy_classic',
    title: 'Ivy League Technical Classic',
    category: 'Academic & Research',
    description: 'Formal serif typography layout with traditional double rule borders and structured publication style.',
    layoutType: 'ivy_classic',
    defaultColor: '#7c3aed',
    fontFamily: 'Georgia, serif'
  }
];

// Data Accessors
function getResumeTemplates() {
  const data = localStorage.getItem(RESUME_TEMPLATES_KEY);
  if (!data) {
    localStorage.setItem(RESUME_TEMPLATES_KEY, JSON.stringify(SEED_RESUME_TEMPLATES));
    return SEED_RESUME_TEMPLATES;
  }
  return JSON.parse(data);
}

function saveResumeTemplates(templates) {
  localStorage.setItem(RESUME_TEMPLATES_KEY, JSON.stringify(templates));
}

function getUserResumes(userEmail) {
  const allResumes = JSON.parse(localStorage.getItem(USER_RESUMES_KEY) || '[]');
  if (!userEmail) return allResumes;
  return allResumes.filter(r => r.userEmail === userEmail);
}

function getAllUserResumes() {
  return JSON.parse(localStorage.getItem(USER_RESUMES_KEY) || '[]');
}

function saveUserResume(resume) {
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  const userEmail = currentUser ? currentUser.email : 'guest@techprepai.com';
  const userName = currentUser ? currentUser.name : 'Guest Student';

  resume.userEmail = userEmail;
  resume.userName = userName;
  resume.lastUpdated = new Date().toISOString();

  const all = getAllUserResumes();
  const idx = all.findIndex(r => r.id === resume.id);
  if (idx !== -1) {
    all[idx] = resume;
  } else {
    if (!resume.id) resume.id = 'res_' + Date.now();
    all.unshift(resume);
  }
  localStorage.setItem(USER_RESUMES_KEY, JSON.stringify(all));
  return resume;
}

function deleteUserResume(resumeId) {
  let all = getAllUserResumes();
  all = all.filter(r => r.id !== resumeId);
  localStorage.setItem(USER_RESUMES_KEY, JSON.stringify(all));
}

// Real-Time ATS Analyzer
function analyzeATSCompatibility(resumeData, jobDescriptionText = '') {
  let score = 75;
  const matchDetails = {
    keywordMatches: [],
    missingKeywords: [],
    formattingHealth: [],
    suggestions: []
  };

  const textBuilder = [];
  if (resumeData.personalInfo) {
    textBuilder.push(resumeData.personalInfo.name || '');
    textBuilder.push(resumeData.personalInfo.summary || '');
  }

  (resumeData.experience || []).forEach(exp => {
    textBuilder.push(exp.jobTitle || '');
    textBuilder.push(exp.company || '');
    textBuilder.push(exp.description || '');
  });

  (resumeData.projects || []).forEach(proj => {
    textBuilder.push(proj.title || '');
    textBuilder.push(proj.techStack || '');
    textBuilder.push(proj.description || '');
  });

  (resumeData.education || []).forEach(edu => {
    textBuilder.push(edu.degree || '');
    textBuilder.push(edu.institution || '');
  });

  if (resumeData.skills) {
    textBuilder.push(resumeData.skills.languages || '');
    textBuilder.push(resumeData.skills.frameworks || '');
    textBuilder.push(resumeData.skills.tools || '');
    textBuilder.push(resumeData.skills.coreCS || '');
  }

  const fullResumeText = textBuilder.join(' ').toLowerCase();

  const coreTechKeywords = [
    'data structures', 'algorithms', 'python', 'javascript', 'react', 'node.js',
    'sql', 'postgresql', 'system design', 'rest api', 'git', 'docker',
    'cloud', 'aws', 'ci/cd', 'agile', 'unit testing', 'object oriented'
  ];

  let matchedCount = 0;
  coreTechKeywords.forEach(kw => {
    if (fullResumeText.includes(kw.toLowerCase())) {
      matchedCount++;
      matchDetails.keywordMatches.push(kw);
    } else {
      matchDetails.missingKeywords.push(kw);
    }
  });

  const keywordRatio = matchedCount / coreTechKeywords.length;
  score = Math.round(50 + keywordRatio * 40);

  if (jobDescriptionText.trim().length > 10) {
    const jdLower = jobDescriptionText.toLowerCase();
    const jdWords = jdLower.split(/\W+/).filter(w => w.length > 3);
    const uniqueJdKeywords = [...new Set(jdWords)];

    let jdMatchCount = 0;
    uniqueJdKeywords.slice(0, 30).forEach(w => {
      if (fullResumeText.includes(w)) {
        jdMatchCount++;
      }
    });

    const jdRatio = jdMatchCount / Math.min(uniqueJdKeywords.length, 30);
    score = Math.round(score * 0.5 + (jdRatio * 50));
  }

  if (resumeData.personalInfo && resumeData.personalInfo.email && resumeData.personalInfo.phone) {
    matchDetails.formattingHealth.push({ label: 'Contact Header Complete', status: true });
    score += 3;
  } else {
    matchDetails.formattingHealth.push({ label: 'Missing Email or Phone', status: false });
    matchDetails.suggestions.push('Add complete contact details (email & phone number) in your header.');
  }

  if (resumeData.experience && resumeData.experience.length >= 1) {
    matchDetails.formattingHealth.push({ label: 'Work Experience Listed', status: true });
    score += 4;
  } else {
    matchDetails.formattingHealth.push({ label: 'No Work Experience Listed', status: false });
    matchDetails.suggestions.push('Include at least 1 internship or work experience entry with metric bullet points.');
  }

  score = Math.min(Math.max(score, 45), 98);

  return {
    score,
    matchDetails,
    lastAnalyzed: new Date().toISOString()
  };
}

function createEmptyResumeData(templateId = 'tmpl_modern_sidebar') {
  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  
  return {
    id: 'res_' + Date.now(),
    title: 'Software Engineer Resume',
    templateId: templateId,
    accentColor: '#2563eb', // Default Blue
    personalInfo: {
      name: currentUser ? currentUser.name : 'Alex Rivera',
      title: 'Full Stack Software Engineer',
      email: currentUser ? currentUser.email : 'alex.rivera@example.com',
      phone: '+1 (555) 019-2834',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alex-rivera',
      github: 'github.com/alexrivera',
      portfolio: 'alexrivera.dev',
      summary: 'Passionate Full Stack Engineer with 2+ years of experience building scalable web applications, microservices, and distributed cloud systems. Proficient in React, Node.js, and SQL optimization.'
    },
    experience: [
      {
        id: 'exp_1',
        jobTitle: 'Software Engineering Intern',
        company: 'CloudScale Systems',
        location: 'San Jose, CA',
        startDate: 'May 2025',
        endDate: 'Aug 2025',
        description: '• Architected RESTful API endpoints in Node.js & Express, improving query latency by 35%.\n• Designed interactive dashboard analytics using React, TypeScript, and Tailwind CSS.\n• Integrated Docker containers into CI/CD pipelines, automating automated test execution.'
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'Distributed Code IDE Sandbox',
        techStack: 'React, Node.js, Docker, WebSockets',
        link: 'github.com/alexrivera/code-ide',
        description: '• Built a real-time collaborative code editor supporting multi-language execution and testcase sandboxing.\n• Implemented WebSocket state synchronization for sub-50ms latency collaboration.'
      }
    ],
    education: [
      {
        id: 'edu_1',
        degree: 'B.S. in Computer Science & Engineering',
        institution: 'California State University',
        location: 'San Francisco, CA',
        gradYear: '2026',
        cgpa: '3.85 / 4.0'
      }
    ],
    skills: {
      languages: 'JavaScript, TypeScript, Python, C++, SQL, HTML5/CSS3',
      frameworks: 'React, Next.js, Node.js, Express, Tailwind CSS, PostgreSQL',
      tools: 'Git, Docker, Linux, AWS S3, Jest, Postman, Vercel',
      coreCS: 'Data Structures, Algorithms, System Design, Object-Oriented Design, REST APIs'
    }
  };
}

(function() {
  getResumeTemplates();
})();
