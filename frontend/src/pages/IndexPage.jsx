import { useState } from 'react';
import IndexModals from '../components/IndexModals.jsx';

const tools = [
  {
    n: '01',
    label: 'DSA LAB',
    title: 'Understand the pattern.\nThen solve the problem.',
    text: 'A focused code workspace with test cases, submissions, and complexity analysis. Practice with intent.',
    href: '/pages/user/dsa-ide.html',
    action: 'Open DSA lab',
    type: 'code'
  },
  {
    n: '02',
    label: 'RESUME STUDIO',
    title: 'Your work deserves\na sharper introduction.',
    text: 'Build your resume, refine the details, and check how your skills match a job description.',
    href: '/pages/user/resume-builder.html',
    action: 'Build your resume',
    type: 'resume'
  },
  {
    n: '03',
    label: 'PLACEMENT RADAR',
    title: 'Keep the next opportunity\nin your line of sight.',
    text: 'Organize applications and follow each opportunity from your first step to the final outcome.',
    href: '/pages/user/placements.html',
    action: 'Track opportunities',
    type: 'radar'
  }
];
const faqs = [
  [
    'Where should I start?',
    'Start with the DSA lab if you want coding practice. Use the planner to organize your preparation, or the resume studio to prepare an application. Sign in to access your saved work.'
  ],
  [
    'Can I keep track of my preparation?',
    'Your dashboard brings together quizzes and performance history. The planner helps you organize tasks and notes alongside your practice.'
  ],
  [
    'What does the resume studio do?',
    'Create and edit a resume, choose a template, and compare it with a job description using the ATS analysis tools. Review every suggestion before applying it.'
  ],
  [
    'Is there an admin workspace?',
    'Yes. Authorized administrators can manage quizzes, problems, resume templates, users, and placement content through the admin console.'
  ]
];
function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
function Brand() {
  return (
    <a className="tp-brand" href="/" aria-label="TechPrep AI home">
      <span className="tp-mark" aria-hidden="true">
        t<span>p</span>
        <i />
      </span>
      <span>
        techprep<span className="tp-ai"> / AI</span>
      </span>
    </a>
  );
}
function Header() {
  const [open, setOpen] = useState(false);
  const toggleTheme = () => document.querySelector('.theme-toggle-btn')?.click();
  return (
    <header className="tp-header">
      <div className="tp-nav">
        <Brand />
        <nav className="tp-desktop-links" aria-label="Main navigation">
          <a href="#workspace">Workspace</a>
          <a href="/pages/public/dsa-sheets.html">DSA roadmap</a>
          <a href="/pages/public/docs.html">Documentation</a>
        </nav>
        <div className="tp-nav-actions">
          <button
            className="tp-theme"
            onClick={toggleTheme}
            aria-label="Toggle light and dark theme"
          >
            ◐
          </button>
          <button className="theme-toggle-btn" hidden aria-hidden="true" tabIndex={-1} />
          <AuthLinks />
          <button
            className="tp-menu"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close −' : 'Menu +'}
          </button>
        </div>
      </div>
      {open && (
        <nav className="tp-mobile-links" aria-label="Mobile navigation">
          <a href="#workspace" onClick={() => setOpen(false)}>
            Workspace
          </a>
          <a href="/pages/public/dsa-sheets.html">DSA roadmap</a>
          <a href="/pages/public/docs.html">Documentation</a>
        </nav>
      )}
    </header>
  );
}
// This island is never rerendered by the menu or theme controls. The existing
// auth controller updates its children after reading the saved session.
function AuthLinks() {
  return (
    <div id="nav-auth-container" className="tp-auth-links">
      <a className="tp-login open-login-modal" href="/?modal=login">
        Sign in
      </a>
      <a className="tp-button tp-button-small open-signup-modal" href="/?modal=signup">
        Get started <Arrow />
      </a>
    </div>
  );
}
function CodeWorkbench() {
  const [tab, setTab] = useState('Java');
  const [show, setShow] = useState(false);
  const examples = {
    Java: [
      'int[] twoSum(int[] nums, int target) {',
      '  Map<Integer, Integer> seen = new HashMap<>();',
      '  for (int i = 0; i < nums.length; i++) {',
      '    int complement = target - nums[i];',
      '    if (seen.containsKey(complement))',
      '      return new int[]{seen.get(complement), i};',
      '    seen.put(nums[i], i);',
      '  }',
      '  return new int[]{};',
      '}'
    ],
    Python: [
      'def two_sum(nums, target):',
      '    seen = {}',
      '    for i, value in enumerate(nums):',
      '        complement = target - value',
      '        if complement in seen:',
      '            return [seen[complement], i]',
      '        seen[value] = i',
      '    return []'
    ],
    JavaScript: [
      'function twoSum(nums, target) {',
      '  const seen = new Map();',
      '  for (let i = 0; i < nums.length; i++) {',
      '    const complement = target - nums[i];',
      '    if (seen.has(complement))',
      '      return [seen.get(complement), i];',
      '    seen.set(nums[i], i);',
      '  }',
      '  return [];',
      '}'
    ]
  };
  return (
    <div className="tp-workbench">
      <div className="tp-window-bar">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>practice / two-sum</span>
        <span className="tp-live">EXAMPLE</span>
      </div>
      <div className="tp-editor-head">
        <div>
          <span className="tp-number">#001</span>
          <h2>Two Sum</h2>
        </div>
        <span className="tp-easy">Easy</span>
      </div>
      <div className="tp-code-tabs" role="tablist" aria-label="Example language">
        {Object.keys(examples).map((lang) => (
          <button
            id={`example-tab-${lang}`}
            role="tab"
            aria-selected={tab === lang}
            aria-controls="example-code"
            key={lang}
            onClick={() => {
              setTab(lang);
              setShow(false);
            }}
          >
            {lang}
          </button>
        ))}
      </div>
      <div
        id="example-code"
        role="tabpanel"
        aria-labelledby={`example-tab-${tab}`}
        className="tp-code"
      >
        <ol>
          {examples[tab].map((line, i) => (
            <li key={i}>
              <code>{line || ' '}</code>
            </li>
          ))}
        </ol>
      </div>
      <div className="tp-code-bottom">
        <span>
          Time <b>O(n)</b>
          <span className="tp-separator">/</span>Space <b>O(n)</b>
        </span>
        <button onClick={() => setShow(!show)} aria-expanded={show}>
          {show ? 'Hide walkthrough' : 'Trace example'} <span aria-hidden="true">▷</span>
        </button>
      </div>
      <div className="tp-terminal" aria-live="polite">
        {show ? (
          <>
            <span className="tp-terminal-success">✓</span>
            <div>
              <strong>[2, 7, 11, 15] → target 9</strong>
              <p>Store 2 at index 0. For 7, find complement 2. Return [0, 1].</p>
            </div>
          </>
        ) : (
          <>
            <span className="tp-terminal-prompt">›_</span>
            <div>
              <strong>Read. Trace. Understand.</strong>
              <p>Explore the example, then run your own code in the DSA lab.</p>
            </div>
          </>
        )}
      </div>
      <a className="tp-editor-link" href="/pages/user/dsa-ide.html">
        Continue in the full editor <Arrow />
      </a>
    </div>
  );
}
function FeatureVisual({ type }) {
  if (type === 'code')
    return (
      <div className="tp-feature-code" aria-hidden="true">
        <span>
          01 <i>observe</i>(pattern);
        </span>
        <span>
          02 <i>build</i>(intuition);
        </span>
        <span>
          03 <i>solve</i>(problem);<b>▌</b>
        </span>
      </div>
    );
  if (type === 'resume')
    return (
      <div className="tp-resume-visual" aria-hidden="true">
        <div>
          <strong>YOUR NEXT CHAPTER</strong>
          <span />
          <span />
          <small>EXPERIENCE</small>
          <span />
          <span />
          <small>PROJECTS & SKILLS</small>
          <span />
        </div>
        <b>↗</b>
      </div>
    );
  return (
    <div className="tp-pipeline" aria-hidden="true">
      <span>
        <i />
        Applied <b>01</b>
      </span>
      <span>
        <i />
        Interview <b>02</b>
      </span>
      <span>
        <i />
        Offer <b>03</b>
      </span>
    </div>
  );
}
export default function IndexPage() {
  return (
    <>
      <a href="#main" className="tp-skip">
        Skip to content
      </a>
      <Header />
      <main id="main" className="tp-landing">
        <section className="tp-hero">
          <div className="tp-hero-copy">
            <div className="tp-eyebrow">
              <span className="tp-status-dot" /> THE ENGINEERING PREP WORKSPACE
            </div>
            <h1>
              Less scattered.
              <br />
              More <span>prepared.</span>
              <i aria-hidden="true">_</i>
            </h1>
            <p className="tp-intro">
              Your next chapter starts with the work.
              <br className="tp-desktop-break" /> Code, build your resume, and move every
              application forward — in one focused workspace.
            </p>
            <div className="tp-hero-actions">
              <a className="tp-button open-signup-modal" href="/?modal=signup">
                Enter your workspace <Arrow />
              </a>
              <a className="tp-text-link" href="#workspace">
                Explore the tools <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="tp-hero-note">
              <span>BUILT FOR THE PROCESS</span>
              <span>One problem. One improvement. Every day.</span>
            </div>
          </div>
          <div className="tp-hero-editor">
            <div className="tp-coordinate" aria-hidden="true">
              WORKSPACE_01 / THINK IN PATTERNS
            </div>
            <CodeWorkbench />
            <div className="tp-editor-caption">
              <span className="tp-status-dot" /> A little more clarity with every attempt.
            </div>
          </div>
        </section>
        <div className="tp-index-strip">
          <span>YOUR PREPARATION, CONNECTED</span>
          <a href="/pages/user/dsa-ide.html">Code practice</a>
          <b>/</b>
          <a href="/pages/user/quiz-user.html">Technical quizzes</a>
          <b>/</b>
          <a href="/pages/user/resume-builder.html">Resume studio</a>
          <b>/</b>
          <a href="/pages/user/placements.html">Placement tracker</a>
        </div>
        <section id="workspace" className="tp-section">
          <div className="tp-section-heading">
            <div>
              <p className="tp-eyebrow">01 / YOUR TOOLKIT</p>
              <h2>
                Different skills.
                <br />
                One direction.
              </h2>
            </div>
            <p>
              From the first practice problem to your next interview.
              <br />
              Give every part of your preparation a place.
            </p>
          </div>
          <div className="tp-tools">
            {tools.map((tool) => (
              <article className="tp-tool" key={tool.n}>
                <div className="tp-tool-top">
                  <span>{tool.label}</span>
                  <b>{tool.n}</b>
                </div>
                <FeatureVisual type={tool.type} />
                <h3>{tool.title}</h3>
                <p>{tool.text}</p>
                <a href={tool.href}>
                  {tool.action} <Arrow />
                </a>
              </article>
            ))}
          </div>
        </section>
        <section className="tp-plan-section">
          <div className="tp-plan-copy">
            <p className="tp-eyebrow">02 / BUILD A RHYTHM</p>
            <h2>
              Big goals.
              <br />
              <span>Smaller next steps.</span>
            </h2>
            <p>
              Turn a list of things to learn into something you can act on. Plan your study
              sessions, keep notes, and make room for consistent practice.
            </p>
            <a className="tp-button tp-button-outline" href="/pages/user/planner.html">
              Open your planner <Arrow />
            </a>
          </div>
          <div className="tp-plan-board">
            <div className="tp-plan-label">
              <span>YOUR NEXT SESSION</span>
              <span>///</span>
            </div>
            <div className="tp-plan-row">
              <span className="tp-plan-check">✓</span>
              <div>
                <strong>Revisit the fundamentals</strong>
                <small>Build the foundation</small>
              </div>
              <span>01</span>
            </div>
            <div className="tp-plan-row tp-plan-active">
              <span className="tp-plan-check">→</span>
              <div>
                <strong>Practice a new pattern</strong>
                <small>Connect the dots</small>
              </div>
              <span>02</span>
            </div>
            <div className="tp-plan-row">
              <span className="tp-plan-check">·</span>
              <div>
                <strong>Reflect. Refine. Repeat.</strong>
                <small>Make the learning stick</small>
              </div>
              <span>03</span>
            </div>
            <div className="tp-plan-foot">
              AN EXAMPLE ROUTINE <span>PROGRESS IS A PRACTICE ↗</span>
            </div>
          </div>
        </section>
        <section className="tp-section tp-faq">
          <div>
            <p className="tp-eyebrow">03 / GOOD QUESTIONS</p>
            <h2>
              A few things
              <br />
              to know.
            </h2>
            <a className="tp-text-link" href="/pages/public/docs.html">
              Read the documentation <Arrow />
            </a>
          </div>
          <div>
            {faqs.map(([q, a], i) => (
              <details key={q}>
                <summary>
                  <span className="tp-faq-index">0{i + 1}</span>
                  {q}
                  <span className="tp-faq-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="tp-final-cta">
          <div>
            <p className="tp-eyebrow">READY WHEN YOU ARE</p>
            <h2>
              Your future self
              <br />
              will thank you.
            </h2>
          </div>
          <a className="tp-button open-signup-modal" href="/?modal=signup">
            Make your next move <Arrow />
          </a>
          <span className="tp-cta-cross" aria-hidden="true">
            +
          </span>
        </section>
      </main>
      <footer className="tp-footer">
        <div>
          <Brand />
          <p>A focused space for what comes next.</p>
        </div>
        <nav aria-label="Footer navigation">
          <a href="/pages/public/docs.html">Docs</a>
          <a href="/pages/public/privacy.html">Privacy</a>
          <a href="/pages/public/terms.html">Terms</a>
          <a href="/pages/public/security.html">Security</a>
          <a href="/pages/public/partners.html">Partners</a>
        </nav>
        <span>© {new Date().getFullYear()} TechPrep AI</span>
      </footer>
      <IndexModals />
    </>
  );
}
