/**
 * TechPrep AI - Core Resume Engine & Multi-Layout ATS System
 * Inspired by Reactive Resume, FlowCV, Resume.io & Canva
 */

const RESUME_TEMPLATES_KEY = 'techprep_resume_templates_v2';
const USER_RESUMES_KEY = 'techprep_user_resumes';

// Available Accent Color Palettes (Curated High-Contrast ATS Colors)
const COLOR_PALETTES = [
  { name: 'Sapphire Blue', hex: '#2563eb' },
  { name: 'Slate Obsidian', hex: '#0f172a' },
  { name: 'Emerald Forest', hex: '#059669' },
  { name: 'Royal Indigo', hex: '#4f46e5' },
  { name: 'Deep Crimson', hex: '#dc2626' },
  { name: 'Teal Modern', hex: '#0d9488' },
  { name: 'Amber Bronze', hex: '#d97706' },
  { name: 'Plum Purple', hex: '#7c3aed' }
];

// Available Typography Options
const FONT_OPTIONS = [
  { id: 'Inter, sans-serif', name: 'Inter (Modern Tech)' },
  { id: 'Roboto, sans-serif', name: 'Roboto (Clean ATS)' },
  { id: "'JetBrains Mono', monospace", name: 'JetBrains Mono (Developer)' },
  { id: 'Georgia, serif', name: 'Georgia (Classic Serif)' },
  { id: "'Outfit', sans-serif', fallback: 'sans-serif'", name: 'Outfit (Sleek Display)' }
];

// 6 Seed High-Impact ATS Resume Templates
const SEED_RESUME_TEMPLATES = [
  {
    id: 'tmpl_silicon_valley',
    title: 'Silicon Valley Standard (ATS #1)',
    category: 'Software Engineering',
    description: 'The gold-standard single-column layout preferred by Google, Meta, and Apple recruiters. Maximum ATS readability.',
    layoutType: 'silicon_valley',
    defaultColor: '#0f172a',
    fontFamily: 'Inter, sans-serif',
    badge: 'Recruiter Favorite'
  },
  {
    id: 'tmpl_modern_sidebar',
    title: 'Modern Tech (Accent Sidebar)',
    category: 'Full Stack & DevOps',
    description: 'Two-column design with a vibrant left accent sidebar for contacts, skills matrix, and education, paired with an open experience column.',
    layoutType: 'modern_sidebar',
    defaultColor: '#2563eb',
    fontFamily: 'Inter, sans-serif',
    badge: 'Popular'
  },
  {
    id: 'tmpl_executive_grid',
    title: 'Executive Lead & Architect',
    category: 'Product & Eng Management',
    description: 'Distinguished header banner card with split two-column competencies, leadership milestones, and metrics callouts.',
    layoutType: 'executive_grid',
    defaultColor: '#4f46e5',
    fontFamily: 'Inter, sans-serif',
    badge: 'Leadership'
  },
  {
    id: 'tmpl_ivy_classic',
    title: 'Ivy League Academic Classic',
    category: 'Research & Science',
    description: 'Formal serif typography layout with traditional double rules and structured publication formatting.',
    layoutType: 'ivy_classic',
    defaultColor: '#0f172a',
    fontFamily: 'Georgia, serif',
    badge: 'Academic'
  },
  {
    id: 'tmpl_terminal_dev',
    title: 'Developer Terminal & Badges',
    category: 'Backend & Systems',
    description: 'Developer aesthetic with monospace accents, skill pill tags, GitHub links, and structured project sections.',
    layoutType: 'terminal_dev',
    defaultColor: '#0d9488',
    fontFamily: "'JetBrains Mono', monospace",
    badge: 'Dev Favorite'
  },
  {
    id: 'tmpl_compact_dense',
    title: 'Compact 1-Page High-Density',
    category: 'College & Internship',
    description: 'Engineered with tight spacing to fit 3+ projects, internships, and full skills onto exactly one single page without spillover.',
    layoutType: 'compact_dense',
    defaultColor: '#059669',
    fontFamily: 'Roboto, sans-serif',
    badge: 'Single Page'
  }
];

// Rich Sample Starter Profiles
const SAMPLE_PROFILES = {
  fullstack: {
    title: 'Full-Stack Software Engineer',
    templateId: 'tmpl_silicon_valley',
    accentColor: '#2563eb',
    fontFamily: 'Inter, sans-serif',
    fontSize: 'medium',
    lineSpacing: 'normal',
    personalInfo: {
      name: 'Alex Rivera',
      title: 'Senior Full-Stack Software Engineer',
      email: 'alex.rivera@techprep.dev',
      phone: '+1 (415) 890-2415',
      location: 'San Francisco, CA',
      linkedin: 'linkedin.com/in/alex-rivera-dev',
      github: 'github.com/alexrivera',
      portfolio: 'https://alexrivera.dev',
      summary: 'Results-driven Full-Stack Engineer with 3+ years of experience architecting distributed cloud systems, real-time microservices, and modern web applications. Reduced API p99 latency by 42% and scaled high-throughput services handling 15M+ daily requests.'
    },
    experience: [
      {
        id: 'exp_1',
        jobTitle: 'Software Engineer II',
        company: 'CloudScale Technologies',
        location: 'San Francisco, CA',
        startDate: 'Jun 2024',
        endDate: 'Present',
        current: true,
        description: '• Architected and deployed a multi-tenant microservices backend using Go, Node.js, and PostgreSQL, reducing endpoint response times by 38% across 10M+ daily transactions.\n• Spearheaded the frontend modernization to React 18, Next.js, and Tailwind CSS, increasing Lighthouse performance score from 64 to 98.\n• Engineered an automated Redis caching layer that decreased database query load by 55% during peak traffic spikes.\n• Mentored 4 junior engineers and instituted CI/CD automated test pipelines with 92% code coverage.'
      },
      {
        id: 'exp_2',
        jobTitle: 'Full-Stack Developer Intern',
        company: 'Nexus Infotech Labs',
        location: 'San Jose, CA',
        startDate: 'May 2023',
        endDate: 'Aug 2023',
        current: false,
        description: '• Built collaborative real-time analytics dashboard with WebSocket connections, decreasing telemetry synchronization latency to <50ms.\n• Implemented OAuth2/JWT role-based authentication system adopted across 8 internal micro-frontends.\n• Authored unit and integration test suites using Jest and Cypress, preventing 20+ critical regression bugs before production deployment.'
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'Distributed Code Sandbox IDE',
        techStack: 'React, TypeScript, Docker, WebSockets, Redis',
        link: 'https://ide.alexrivera.dev',
        github: 'github.com/alexrivera/distributed-ide',
        description: '• Engineered a cloud code compilation sandbox executing Python, C++, and Java code inside isolated Docker containers with 200ms turnaround.\n• Designed bidirectional WebSocket synchronization engine supporting simultaneous multi-user code editing with conflict resolution.\n• Deployed on AWS ECS with auto-scaling, serving 25,000+ monthly active developers with 99.95% uptime.'
      },
      {
        id: 'proj_2',
        title: 'High-Throughput Vector Search Engine',
        techStack: 'Python, FastAPI, pgvector, Docker, Next.js',
        link: 'https://vector.alexrivera.dev',
        github: 'github.com/alexrivera/vector-engine',
        description: '• Built an ultra-fast semantic document search engine indexing 500,000+ technical articles with sub-30ms retrieval latency.\n• Integrated hybrid BM25 + cosine similarity reranking algorithm, boosting top-5 query relevance accuracy by 27%.'
      }
    ],
    skills: {
      languages: 'JavaScript (ES6+), TypeScript, Python, Go, C++, SQL (PostgreSQL), HTML5, CSS3',
      frameworks: 'React, Next.js, Node.js, Express, FastAPI, Tailwind CSS, GraphQL, Redux Toolkit',
      tools: 'Git, Docker, Kubernetes, AWS (S3, EC2, ECS), PostgreSQL, Redis, Jest, GitHub Actions, Linux',
      coreCS: 'Data Structures & Algorithms, System Design, Microservices, Distributed Systems, REST APIs, OOP'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'B.S. in Computer Science & Engineering',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        gradYear: '2024',
        cgpa: '3.88 / 4.0',
        coursework: 'Distributed Systems, Database Architecture, Operating Systems, Algorithm Design'
      }
    ],
    certifications: [
      {
        id: 'cert_1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        year: '2024',
        url: 'aws.amazon.com/verify'
      }
    ],
    achievements: [
      {
        id: 'ach_1',
        title: '1st Place Winner – CalHacks National Hackathon (out of 450+ teams)',
        year: '2023',
        description: 'Engineered an AI-assisted accessibility tool for visually impaired programmers.'
      },
      {
        id: 'ach_2',
        title: 'LeetCode Knight (Top 3.5% Global Ranking, Max Rating 2140)',
        year: '2024',
        description: 'Solved 850+ Data Structures & Algorithms problems across dynamic programming, graphs, and trees.'
      }
    ]
  },

  aiml: {
    title: 'AI / Machine Learning Engineer',
    templateId: 'tmpl_terminal_dev',
    accentColor: '#0d9488',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 'medium',
    lineSpacing: 'normal',
    personalInfo: {
      name: 'Dr. Sophia Chen',
      title: 'Machine Learning & AI Research Engineer',
      email: 'sophia.chen@ai-prep.org',
      phone: '+1 (650) 412-9981',
      location: 'Palo Alto, CA',
      linkedin: 'linkedin.com/in/sophia-chen-ai',
      github: 'github.com/sophiachen-ml',
      portfolio: 'https://sophiachen.ai',
      summary: 'Machine Learning Engineer specialized in Generative AI, Large Language Models (LLMs), and scalable deep learning pipelines. Published researcher with expertise fine-tuning transformer architectures, optimizing model quantization, and deploying low-latency inference systems.'
    },
    experience: [
      {
        id: 'exp_1',
        jobTitle: 'AI Research & Deployment Engineer',
        company: 'Synthetix AI Labs',
        location: 'San Francisco, CA',
        startDate: 'Jan 2024',
        endDate: 'Present',
        current: true,
        description: '• Fine-tuned 7B/13B parameter open-source LLMs using LoRA & QLoRA, achieving 18% higher domain accuracy on legal & medical retrieval benchmarks.\n• Optimized inference latency by 3.4x utilizing vLLM, TensorRT-LLM, and 4-bit AWQ quantization, saving $45K/month in GPU cloud infrastructure.\n• Built end-to-end RAG pipelines incorporating hybrid semantic search and cross-encoder re-ranking for enterprise customers.'
      },
      {
        id: 'exp_2',
        jobTitle: 'Machine Learning Intern',
        company: 'DeepVision Systems',
        location: 'Santa Clara, CA',
        startDate: 'Jun 2023',
        endDate: 'Dec 2023',
        current: false,
        description: '• Trained convolutional neural networks and vision transformers (ViT) for real-time anomaly detection with 99.1% precision.\n• Engineered distributed data ingestion pipelines processing 4TB+ daily video stream data using Apache Spark and PyTorch.'
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'OpenRag: Enterprise Multi-Modal Agent',
        techStack: 'PyTorch, LangChain, ChromaDB, FastAPI, Hugging Face',
        link: 'https://openrag.dev',
        github: 'github.com/sophiachen-ml/openrag',
        description: '• Architected an open-source autonomous agent framework enabling multi-step tool use, code execution, and vector memory retrieval with 1,200+ GitHub stars.\n• Implemented self-reflective query rewriting that reduced hallucination rates by 31% on synthetic test suites.'
      }
    ],
    skills: {
      languages: 'Python, C++, SQL, CUDA, R, Bash',
      frameworks: 'PyTorch, TensorFlow, JAX, Hugging Face Transformers, LangChain, vLLM, DeepSpeed, FastAPI',
      tools: 'Docker, Kubernetes, MLflow, Weights & Biases, Triton Inference Server, AWS SageMaker, GCP Vertex AI',
      coreCS: 'Deep Learning, LLMs, Neural Networks, Computer Vision, NLP, Optimization Theory, Linear Algebra'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'M.S. in Artificial Intelligence & Robotics',
        institution: 'Stanford University',
        location: 'Stanford, CA',
        gradYear: '2024',
        cgpa: '3.95 / 4.0',
        coursework: 'Deep Multi-Task Learning, Reinforcement Learning, Probabilistic Graphical Models'
      }
    ],
    certifications: [
      {
        id: 'cert_1',
        name: 'TensorFlow Advanced ML Specialization',
        issuer: 'DeepLearning.AI',
        year: '2023',
        url: 'coursera.org/verify'
      }
    ],
    achievements: [
      {
        id: 'ach_1',
        title: 'Published Co-Author at NeurIPS 2023 Workshop',
        year: '2023',
        description: 'Co-authored paper on sample-efficient reinforcement learning in sparse-reward environments.'
      }
    ]
  },

  devops: {
    title: 'Cloud & DevOps Engineer',
    templateId: 'tmpl_modern_sidebar',
    accentColor: '#059669',
    fontFamily: 'Inter, sans-serif',
    fontSize: 'medium',
    lineSpacing: 'normal',
    personalInfo: {
      name: 'Marcus Vance',
      title: 'Lead DevOps & Cloud Platform Engineer',
      email: 'marcus.vance@cloudprep.io',
      phone: '+1 (206) 555-0182',
      location: 'Seattle, WA',
      linkedin: 'linkedin.com/in/marcus-vance-cloud',
      github: 'github.com/marcusvance',
      portfolio: 'https://marcusvance.io',
      summary: 'Senior Cloud Platform Engineer with 4+ years of expertise in Kubernetes orchestration, Infrastructure as Code (Terraform), and high-availability multi-region cloud architecture. Proven record of scaling infrastructure to 99.99% uptime while slashing AWS expenditures by 30%.'
    },
    experience: [
      {
        id: 'exp_1',
        jobTitle: 'Cloud Infrastructure Engineer',
        company: 'ScaleGrid Cloud Systems',
        location: 'Seattle, WA',
        startDate: 'Jan 2023',
        endDate: 'Present',
        current: true,
        description: '• Managed multi-region EKS clusters hosting 120+ microservices with zero-downtime rolling upgrades and automated canary deployments.\n• Re-architected Terraform infrastructure blueprints into modular IaC registries, reducing staging environment provisioning time from 4 hours to 8 minutes.\n• Spearheaded GitOps transition using ArgoCD, reducing mean time to recovery (MTTR) by 60% during staging incidents.'
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'Kubernetes Chaos Engineering Suite',
        techStack: 'Go, Kubernetes API, Prometheus, Grafana, Helm',
        link: 'https://chaospilot.io',
        github: 'github.com/marcusvance/k8s-chaos-pilot',
        description: '• Built automated chaos testing tool simulating pod evictions, network partitioning, and memory pressure spikes to evaluate cluster resiliency.'
      }
    ],
    skills: {
      languages: 'Go, Python, Bash, YAML, HCL (Terraform), SQL',
      frameworks: 'Kubernetes, Docker, Terraform, Helm, ArgoCD, Ansible, Prometheus, Grafana',
      tools: 'AWS (EKS, VPC, CloudFront, RDS), GCP, Linux Kernel Tuning, GitHub Actions, Istio Service Mesh',
      coreCS: 'Site Reliability Engineering (SRE), Network Protocols, Distributed Consensus, High Availability'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'B.S. in Computer Engineering',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        gradYear: '2023',
        cgpa: '3.75 / 4.0',
        coursework: 'Computer Networks, Cloud Infrastructure, Operating Systems'
      }
    ],
    certifications: [
      {
        id: 'cert_1',
        name: 'Certified Kubernetes Administrator (CKA)',
        issuer: 'Cloud Native Computing Foundation (CNCF)',
        year: '2024',
        url: 'cncf.io/verify'
      }
    ],
    achievements: [
      {
        id: 'ach_1',
        title: 'AWS Community Builder 2024 (DevOps Category)',
        year: '2024',
        description: 'Recognized for contributing open-source Terraform automation modules.'
      }
    ]
  },

  intern: {
    title: 'CS Student / SDE Intern',
    templateId: 'tmpl_compact_dense',
    accentColor: '#4f46e5',
    fontFamily: 'Roboto, sans-serif',
    fontSize: 'compact',
    lineSpacing: 'compact',
    personalInfo: {
      name: 'Rohan Sharma',
      title: 'Aspiring Software Development Engineer (SDE)',
      email: 'rohan.sharma@campus.edu',
      phone: '+91 98765 43210',
      location: 'Bangalore, India',
      linkedin: 'linkedin.com/in/rohan-sharma-cs',
      github: 'github.com/rohansharma-dev',
      portfolio: 'https://rohansharma.dev',
      summary: 'Enthusiastic Final-Year Computer Science student with strong fundamentals in Data Structures, Algorithms, and Full-Stack development. Solved 600+ problems on LeetCode/CodeChef. Seeking a software engineering role to build robust, user-centric web applications.'
    },
    experience: [
      {
        id: 'exp_1',
        jobTitle: 'Software Engineering Intern',
        company: 'FinTech Innovations India',
        location: 'Bangalore, India',
        startDate: 'Jun 2025',
        endDate: 'Aug 2025',
        current: false,
        description: '• Developed 12 REST API endpoints in Node.js & Express for transaction reconciliations, processing ₹50M+ weekly ledger entries.\n• Created customer transaction search with PostgreSQL indexed queries, improving search speed by 45%.\n• Collaborated with senior engineers to implement automated unit test suites with Jest, achieving 88% branch coverage.'
      }
    ],
    projects: [
      {
        id: 'proj_1',
        title: 'Campus Placement & DSA Practice Hub',
        techStack: 'React, Node.js, Express, MongoDB, Tailwind CSS',
        link: 'https://placement-hub.dev',
        github: 'github.com/rohansharma-dev/campus-hub',
        description: '• Built full-stack platform used by 1,400+ college peers to track company drives, practice technical interview questions, and analyze mock tests.\n• Implemented secure JWT authentication and real-time announcements via Socket.io.'
      },
      {
        id: 'proj_2',
        title: 'Algorithmic Pathfinding Visualizer',
        techStack: 'JavaScript (ES6), HTML5 Canvas, CSS Grid',
        link: 'https://pathfinder.rohansharma.dev',
        github: 'github.com/rohansharma-dev/pathfinding-visualizer',
        description: '• Created interactive visualization of Dijkstra, A*, and BFS/DFS graph traversal algorithms with custom maze generator and animation speed controls.'
      }
    ],
    skills: {
      languages: 'Java, C++, JavaScript, Python, SQL',
      frameworks: 'React, Node.js, Express.js, Tailwind CSS, Bootstrap',
      tools: 'Git, GitHub, VS Code, Postman, MongoDB, PostgreSQL, Linux',
      coreCS: 'Data Structures & Algorithms, Object-Oriented Programming (OOP), DBMS, Computer Networks, Operating Systems'
    },
    education: [
      {
        id: 'edu_1',
        degree: 'B.Tech in Computer Science & Engineering',
        institution: 'National Institute of Technology',
        location: 'Bangalore, India',
        gradYear: '2026',
        cgpa: '8.92 / 10.0',
        coursework: 'Data Structures, Design & Analysis of Algorithms, Database Management Systems, System Design'
      }
    ],
    certifications: [
      {
        id: 'cert_1',
        name: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Coursera / Meta',
        year: '2025',
        url: 'coursera.org/verify'
      }
    ],
    achievements: [
      {
        id: 'ach_1',
        title: 'CodeChef 4-Star Coder (Max Rating 1820)',
        year: '2025',
        description: 'Ranked in top 2% of collegiate contestants in algorithmic coding challenges.'
      },
      {
        id: 'ach_2',
        title: 'Hackathon Finalist – Smart India Hackathon',
        year: '2024',
        description: 'Developed automated document verification system for university admissions.'
      }
    ]
  }
};

// Action Verbs Dictionary for AI Bullet Helper
const ACTION_VERBS_LIBRARY = {
  Engineering: ['Architected', 'Engineered', 'Developed', 'Constructed', 'Implemented', 'Designed', 'Built', 'Authored', 'Synthesized'],
  Optimization: ['Optimized', 'Accelerated', 'Streamlined', 'Refactored', 'Enhanced', 'Minimized', 'Boosted', 'Elevated', 'Consolidated'],
  Leadership: ['Spearheaded', 'Orchestrated', 'Directed', 'Pioneered', 'Mentored', 'Led', 'Established', 'Championed', 'Mobilized'],
  Automation: ['Automated', 'Containerized', 'Deployed', 'Integrated', 'Standardized', 'Configured', 'Scaled', 'Provisioned', 'Instituted']
};

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
  const userEmail = (resume && resume.userEmail) || (currentUser ? currentUser.email : 'guest@techprepai.com');
  const userName = (resume && resume.userName) || (currentUser ? currentUser.name : 'Guest Student');

  resume.userEmail = userEmail;
  resume.userName = userName;
  resume.lastUpdated = new Date().toISOString();

  if (!resume.atsScore) {
    try {
      const analysis = analyzeATSCompatibility(resume);
      resume.atsScore = analysis.score || 85;
    } catch {
      resume.atsScore = 85;
    }
  }

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

// Create Fresh Default Resume with Logged In User Profile Sync
function createEmptyResumeData(templateId = 'tmpl_silicon_valley') {
  const base = JSON.parse(JSON.stringify(SAMPLE_PROFILES.fullstack));
  base.id = 'res_' + Date.now();
  base.templateId = templateId;

  const currentUser = JSON.parse(localStorage.getItem('techprep_current_user') || 'null');
  if (currentUser) {
    base.userEmail = currentUser.email;
    base.userName = currentUser.name;
    base.personalInfo = base.personalInfo || {};
    if (currentUser.name) base.personalInfo.name = currentUser.name;
    if (currentUser.email) base.personalInfo.email = currentUser.email;
    if (currentUser.contact) base.personalInfo.phone = currentUser.contact;
    if (currentUser.address) base.personalInfo.location = currentUser.address;
    if (currentUser.linkedin) base.personalInfo.linkedin = currentUser.linkedin;
    if (currentUser.github) base.personalInfo.github = currentUser.github;
    if (currentUser.portfolio) base.personalInfo.portfolio = currentUser.portfolio;

    if (currentUser.college || currentUser.degree) {
      base.education = [{
        degree: currentUser.degree ? `${currentUser.degree} in ${currentUser.branch || 'Computer Science'}` : 'B.Tech in Computer Science',
        institution: currentUser.college || 'Engineering Institute of Technology',
        gradYear: currentUser.gradYear || '2026',
        cgpa: currentUser.cgpa || '8.8',
        coursework: 'Data Structures & Algorithms, Database Management Systems, Operating Systems'
      }];
    }
  }

  return base;
}

/**
 * Multi-Dimensional Real-Time ATS Compatibility Scoring Engine
 */
function analyzeATSCompatibility(resumeData, jobDescriptionText = '') {
  const matchDetails = {
    keywordMatches: [],
    missingKeywords: [],
    strongVerbsFound: [],
    quantifiersCount: 0,
    categories: {
      contact: { score: 100, max: 15, feedback: [] },
      impact: { score: 0, max: 25, feedback: [] },
      actionVerbs: { score: 0, max: 25, feedback: [] },
      technicalKeywords: { score: 0, max: 20, feedback: [] },
      jobMatch: { score: 15, max: 15, feedback: [] }
    },
    suggestions: []
  };

  if (!resumeData) return { score: 50, matchDetails, lastAnalyzed: new Date().toISOString() };

  // 1. Compile Full Text
  const textChunks = [];
  const bulletPoints = [];
  const info = resumeData.personalInfo || {};

  textChunks.push(info.name || '', info.title || '', info.summary || '', info.location || '');

  (resumeData.experience || []).forEach(exp => {
    textChunks.push(exp.jobTitle || '', exp.company || '', exp.description || '');
    if (exp.description) {
      exp.description.split('\n').forEach(b => bulletPoints.push(b.trim()));
    }
  });

  (resumeData.projects || []).forEach(proj => {
    textChunks.push(proj.title || '', proj.techStack || '', proj.description || '');
    if (proj.description) {
      proj.description.split('\n').forEach(b => bulletPoints.push(b.trim()));
    }
  });

  (resumeData.education || []).forEach(edu => {
    textChunks.push(edu.degree || '', edu.institution || '', edu.coursework || '');
  });

  const skills = resumeData.skills || {};
  textChunks.push(skills.languages || '', skills.frameworks || '', skills.tools || '', skills.coreCS || '');

  (resumeData.certifications || []).forEach(c => textChunks.push(c.name || '', c.issuer || ''));
  (resumeData.achievements || []).forEach(a => textChunks.push(a.title || '', a.description || ''));

  const fullResumeText = textChunks.join(' ').toLowerCase();

  // Dimension A: Contact Completeness (Max 15 pts)
  let contactPts = 15;
  if (!info.name || info.name.length < 3) { contactPts -= 4; matchDetails.categories.contact.feedback.push('Missing Full Name'); }
  if (!info.email || !info.email.includes('@')) { contactPts -= 4; matchDetails.categories.contact.feedback.push('Missing Valid Email'); }
  if (!info.phone || info.phone.length < 7) { contactPts -= 3; matchDetails.categories.contact.feedback.push('Missing Phone Number'); }
  if (!info.linkedin && !info.github) { contactPts -= 4; matchDetails.categories.contact.feedback.push('Add LinkedIn or GitHub URL'); }
  matchDetails.categories.contact.score = Math.max(contactPts, 0);

  // Dimension B: Metric & Quantifier Density (Max 25 pts)
  // Check for metrics (%, $, x, k, numbers)
  const metricRegex = /\b(\d+[\d,.]*|\d+k|\d+m|\d+x|\d+%\s*|\$\d+[\d,.]*|\d+\+)\b/gi;
  let quantifierHits = 0;
  bulletPoints.forEach(b => {
    const matches = b.match(metricRegex);
    if (matches && matches.length > 0) quantifierHits += matches.length;
  });
  matchDetails.quantifiersCount = quantifierHits;

  let impactScore = 0;
  if (quantifierHits >= 6) impactScore = 25;
  else if (quantifierHits >= 4) impactScore = 20;
  else if (quantifierHits >= 2) impactScore = 14;
  else if (quantifierHits >= 1) impactScore = 8;
  else {
    impactScore = 3;
    matchDetails.suggestions.push('Add measurable outcomes (% improvements, latency reductions, user scale) to your bullet points.');
  }
  matchDetails.categories.impact.score = impactScore;

  // Dimension C: Action Verb Strength (Max 25 pts)
  const allActionVerbs = [
    'architected', 'engineered', 'developed', 'spearheaded', 'orchestrated', 'optimized',
    'automated', 'deployed', 'implemented', 'constructed', 'designed', 'built', 'refactored',
    'streamlined', 'pioneered', 'mentored', 'instituted', 'scaled', 'accelerated', 'authored'
  ];
  let verbCount = 0;
  allActionVerbs.forEach(v => {
    if (fullResumeText.includes(v)) {
      verbCount++;
      matchDetails.strongVerbsFound.push(v);
    }
  });

  let verbScore = 0;
  if (verbCount >= 7) verbScore = 25;
  else if (verbCount >= 4) verbScore = 19;
  else if (verbCount >= 2) verbScore = 12;
  else {
    verbScore = 6;
    matchDetails.suggestions.push('Begin your bullet points with high-impact action verbs (e.g., "Architected", "Spearheaded", "Optimized").');
  }
  matchDetails.categories.actionVerbs.score = verbScore;

  // Dimension D: Core Technical Keyword Matches (Max 20 pts)
  const highDemandTech = [
    'python', 'javascript', 'typescript', 'react', 'node.js', 'sql', 'postgresql',
    'docker', 'kubernetes', 'aws', 'git', 'ci/cd', 'data structures', 'algorithms',
    'system design', 'rest api', 'graphql', 'redis', 'microservices', 'unit testing'
  ];

  let matchedTech = 0;
  highDemandTech.forEach(kw => {
    if (fullResumeText.includes(kw)) {
      matchedTech++;
      matchDetails.keywordMatches.push(kw);
    } else {
      matchDetails.missingKeywords.push(kw);
    }
  });

  const techRatio = matchedTech / highDemandTech.length;
  matchDetails.categories.technicalKeywords.score = Math.round(techRatio * 20);

  // Dimension E: Target Job Description Matcher (Max 15 pts)
  if (jobDescriptionText && jobDescriptionText.trim().length > 20) {
    const jdLower = jobDescriptionText.toLowerCase();
    const jdWords = jdLower.split(/[^a-zA-Z0-9#+.]+/).filter(w => w.length > 3);
    const stopWords = new Set(['with', 'have', 'from', 'this', 'that', 'your', 'will', 'about', 'their', 'must', 'should', 'experience', 'years', 'team', 'work', 'working', 'ability']);
    const meaningfulJdWords = [...new Set(jdWords.filter(w => !stopWords.has(w)))];

    let jdHits = 0;
    const topJdWords = meaningfulJdWords.slice(0, 35);
    topJdWords.forEach(w => {
      if (fullResumeText.includes(w)) {
        jdHits++;
      }
    });

    const jdMatchRatio = topJdWords.length > 0 ? (jdHits / topJdWords.length) : 0.8;
    matchDetails.categories.jobMatch.score = Math.round(jdMatchRatio * 15);

    if (jdMatchRatio < 0.5) {
      matchDetails.suggestions.push('Tailor your skills and project bullets to include specific keywords found in the Target Job Description.');
    }
  } else {
    matchDetails.categories.jobMatch.score = 15; // default full if no specific JD provided
  }

  // Calculate Total Weighted Score (0 to 100)
  const totalScore = Math.min(
    Math.max(
      matchDetails.categories.contact.score +
      matchDetails.categories.impact.score +
      matchDetails.categories.actionVerbs.score +
      matchDetails.categories.technicalKeywords.score +
      matchDetails.categories.jobMatch.score,
      35
    ),
    99
  );

  return {
    score: totalScore,
    matchDetails,
    lastAnalyzed: new Date().toISOString()
  };
}

// Helper to convert resume object to Clean Markdown / Plain text
function resumeToMarkdown(resume) {
  if (!resume) return '';
  const info = resume.personalInfo || {};
  const skills = resume.skills || {};

  let md = `# ${info.name || 'Your Name'}\n`;
  md += `**${info.title || ''}** | ${info.email || ''} | ${info.phone || ''} | ${info.location || ''}\n`;
  if (info.linkedin || info.github || info.portfolio) {
    md += `${[info.linkedin, info.github, info.portfolio].filter(Boolean).join(' • ')}\n`;
  }
  md += `\n---\n\n`;

  if (info.summary) {
    md += `## PROFESSIONAL SUMMARY\n${info.summary}\n\n`;
  }

  if (resume.experience && resume.experience.length) {
    md += `## WORK EXPERIENCE\n`;
    resume.experience.forEach(exp => {
      md += `### ${exp.jobTitle} — ${exp.company} (${exp.location || ''})\n`;
      md += `*${exp.startDate} – ${exp.endDate}*\n\n`;
      md += `${exp.description}\n\n`;
    });
  }

  if (resume.projects && resume.projects.length) {
    md += `## TECHNICAL PROJECTS\n`;
    resume.projects.forEach(p => {
      md += `### ${p.title} | *${p.techStack}*\n`;
      if (p.link) md += `Link: ${p.link}\n`;
      md += `${p.description}\n\n`;
    });
  }

  md += `## TECHNICAL SKILLS\n`;
  if (skills.languages) md += `- **Languages**: ${skills.languages}\n`;
  if (skills.frameworks) md += `- **Frameworks & Libraries**: ${skills.frameworks}\n`;
  if (skills.tools) md += `- **Tools & Cloud**: ${skills.tools}\n`;
  if (skills.coreCS) md += `- **Core Computer Science**: ${skills.coreCS}\n\n`;

  if (resume.education && resume.education.length) {
    md += `## EDUCATION\n`;
    resume.education.forEach(edu => {
      md += `### ${edu.degree} — ${edu.institution}\n`;
      md += `*${edu.gradYear}* | CGPA: ${edu.cgpa || 'N/A'}\n`;
      if (edu.coursework) md += `Coursework: ${edu.coursework}\n\n`;
    });
  }

  if (resume.certifications && resume.certifications.length) {
    md += `## CERTIFICATIONS\n`;
    resume.certifications.forEach(c => {
      md += `- **${c.name}** — ${c.issuer} (${c.year})\n`;
    });
    md += `\n`;
  }

  if (resume.achievements && resume.achievements.length) {
    md += `## HONORS & ACHIEVEMENTS\n`;
    resume.achievements.forEach(a => {
      md += `- **${a.title}** (${a.year}): ${a.description}\n`;
    });
    md += `\n`;
  }

  return md;
}

// Global Exports for Browser & Node Contexts
if (typeof window !== 'undefined') {
  window.COLOR_PALETTES = COLOR_PALETTES;
  window.FONT_OPTIONS = FONT_OPTIONS;
  window.SEED_RESUME_TEMPLATES = SEED_RESUME_TEMPLATES;
  window.SAMPLE_PROFILES = SAMPLE_PROFILES;
  window.ACTION_VERBS_LIBRARY = ACTION_VERBS_LIBRARY;
  window.getResumeTemplates = getResumeTemplates;
  window.saveResumeTemplates = saveResumeTemplates;
  window.getUserResumes = getUserResumes;
  window.getAllUserResumes = getAllUserResumes;
  window.saveUserResume = saveUserResume;
  window.deleteUserResume = deleteUserResume;
  window.createEmptyResumeData = createEmptyResumeData;
  window.analyzeATSCompatibility = analyzeATSCompatibility;
  window.resumeToMarkdown = resumeToMarkdown;
}

if (typeof globalThis !== 'undefined') {
  globalThis.COLOR_PALETTES = COLOR_PALETTES;
  globalThis.FONT_OPTIONS = FONT_OPTIONS;
  globalThis.SEED_RESUME_TEMPLATES = SEED_RESUME_TEMPLATES;
  globalThis.SAMPLE_PROFILES = SAMPLE_PROFILES;
  globalThis.ACTION_VERBS_LIBRARY = ACTION_VERBS_LIBRARY;
  globalThis.getResumeTemplates = getResumeTemplates;
  globalThis.saveResumeTemplates = saveResumeTemplates;
  globalThis.getUserResumes = getUserResumes;
  globalThis.getAllUserResumes = getAllUserResumes;
  globalThis.saveUserResume = saveUserResume;
  globalThis.deleteUserResume = deleteUserResume;
  globalThis.createEmptyResumeData = createEmptyResumeData;
  globalThis.analyzeATSCompatibility = analyzeATSCompatibility;
  globalThis.resumeToMarkdown = resumeToMarkdown;
}

// Initializer
(function() {
  getResumeTemplates();
})();

