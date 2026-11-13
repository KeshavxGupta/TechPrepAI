import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { build } from 'esbuild';
import { JSDOM, VirtualConsole } from 'jsdom';
import originalSelectors from './original-selectors.json' with { type: 'json' };
import manifest from '../../frontend/src/runtime/pages.json' with { type: 'json' };

let bundle;
before(async () => {
  const pages = [...new Set(Object.values(manifest).map((p) => p.module))];
  const entry = `import React from 'react';import {createRoot} from 'react-dom/client';import {flushSync} from 'react-dom';\n${pages.map((name) => `import ${name} from './frontend/src/pages/${name}.jsx';`).join('\n')}\nconst pages={${pages.join(',')}};window.mountPage=name=>flushSync(()=>createRoot(document.getElementById('root')).render(React.createElement(pages[name])));`;
  const result = await build({
    stdin: { contents: entry, resolveDir: process.cwd(), loader: 'jsx' },
    jsx: 'automatic',
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'silent'
  });
  bundle = result.outputFiles[0].text;
});
const session = {
  name: 'Migration Student',
  email: 'migration@example.test',
  role: 'student',
  token: 'test-token',
  college: 'Engineering College',
  degree: 'BTech',
  branch: 'CSE',
  gradYear: '2027',
  cgpa: '8.5',
  contact: '9000000000',
  dob: '2005-01-01',
  address: 'Test address',
  marks10: '90',
  marks12: '90',
  skills: 'Java, React'
};
async function mount(path, { signedIn = true } = {}) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (error) => {
    // JSDOM cannot navigate or draw canvas; neither is a JavaScript regression.
    if (!/Not implemented: (navigation|HTMLCanvasElement)/.test(error.message))
      errors.push(error.message);
  });
  const dom = new JSDOM(
    '<!doctype html><html class="dark"><body><div id="root"></div></body></html>',
    {
      url: 'http://localhost:4173' + path,
      runScripts: 'dangerously',
      pretendToBeVisual: true,
      virtualConsole: vc
    }
  );
  const w = dom.window;
  w.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  w.scrollTo = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.confirm = () => false;
  w.ResizeObserver = class {
    observe() {}
    disconnect() {}
  };
  // Canvas drawing itself is covered by browser CI; JSDOM has no canvas renderer.
  w.Chart = class {
    constructor(_canvas, config) {
      this.data = config.data;
      this.options = config.options;
    }
    update() {}
    destroy() {}
  };
  w.confetti = () => {};
  w.fetch = async (url, options = {}) => ({
    ok: true,
    status: 200,
    json: async () => ({
      success: true,
      data: [],
      quizzes: [],
      placements: [],
      tasks: [],
      notes: [],
      templates: [],
      problems: [],
      users: [],
      results: [],
      submissions: []
    })
  });
  w.sessionStorage.setItem('techprep_theme', 'dark');
  if (signedIn)
    w.sessionStorage.setItem(
      'techprep_current_user',
      JSON.stringify(
        path.includes('/admin/')
          ? { ...session, email: 'khushboo2006june@admin.com', role: 'admin' }
          : session
      )
    );
  w.eval(bundle);
  const pathname = new URL(w.location.href).pathname;
  const page = manifest[pathname === '/' ? '/index.html' : pathname];
  w.mountPage(page.module);
  for (const id of originalSelectors[pathname] || []) {
    assert.ok(w.document.getElementById(id), `Preserved original selector #${id} on ${pathname}`);
  }
  for (const script of page.scripts) {
    if (script.src) w.eval(await readFile(resolve('frontend/public', script.src.slice(1)), 'utf8'));
    // Optional third-party visual/parsing libraries are exercised in browser CI.
  }
  w.document.dispatchEvent(new w.Event('techprep:ready'));
  if (page.initialize) w[page.initialize]();
  await new Promise((resolve) => setTimeout(resolve, 150));
  return { w, dom, errors };
}
for (const path of Object.keys(manifest).filter(
  (p) => !p.endsWith('/login.html') && !p.endsWith('/signup.html')
)) {
  test(`React markup and controller startup: ${path}`, async () => {
    const { w, dom, errors } = await mount(path);
    try {
      assert.ok(w.document.body.textContent.trim().length > 20);
      assert.equal(
        w.document.querySelectorAll('[id^="component-"]').length,
        0,
        'No unrendered component placeholders'
      );
      assert.deepEqual(errors, []);
    } finally {
      dom.window.close();
    }
  });
}
test('React landing tabs and trace respond to clicks', async () => {
  const { w, dom } = await mount('/', { signedIn: false });
  try {
    const python = [...w.document.querySelectorAll('[role=tab]')].find(
      (n) => n.textContent === 'Python'
    );
    python.click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.match(w.document.querySelector('[role=tabpanel]').textContent, /def two_sum/);
    [...w.document.querySelectorAll('button')]
      .find((n) => n.textContent.includes('Trace example'))
      .click();
    await new Promise((resolve) => setTimeout(resolve, 10));
    assert.match(w.document.querySelector('.tp-terminal').textContent, /Return \[0, 1\]/);
  } finally {
    dom.window.close();
  }
});
test('auth triggers, Escape, query parameters and theme persist', async () => {
  const { w, dom } = await mount('/?modal=login&email=test%40example.test', { signedIn: false });
  try {
    const modal = w.document.getElementById('login-modal');
    assert.ok(!modal.classList.contains('hidden'));
    assert.equal(modal.querySelector('[type=email]').value, 'test@example.test');
    w.document.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.ok(modal.classList.contains('hidden'));
    w.document.querySelector('.open-signup-modal').click();
    assert.ok(!w.document.getElementById('signup-modal').classList.contains('hidden'));
    w.document.querySelector('.tp-theme').click();
    assert.equal(w.sessionStorage.getItem('techprep_theme'), 'light');
  } finally {
    dom.window.close();
  }
});
test('dashboard tab controls still call their existing controllers', async () => {
  const { w, dom } = await mount('/pages/user/dashboard.html');
  try {
    w.document.getElementById('side-btn-history').click();
    assert.ok(!w.document.getElementById('tab-panel-history').classList.contains('hidden'));
    assert.ok(w.document.getElementById('tab-panel-quizzes').classList.contains('hidden'));
    w.document.getElementById('side-btn-profile').click();
    assert.equal(w.document.getElementById('profile-name').value, session.name);
  } finally {
    dom.window.close();
  }
});
test('all 19 entry URLs and first-party controller assets exist in the production output', async () => {
  for (const [url, page] of Object.entries(manifest)) {
    const html = await readFile(resolve('dist', url.slice(1)), 'utf8');
    assert.match(html, /type="module"/);
    assert.doesNotMatch(html, /cdn.tailwindcss.com/);
    for (const script of page.scripts.filter((s) => s.src))
      await readFile(resolve('dist', script.src.slice(1)));
  }
});
test('API requests preserve same-origin paths, bearer headers and update payloads', async () => {
  const { w, dom } = await mount('/pages/user/dashboard.html');
  try {
    const requests = [];
    w.fetch = async (url, options) => {
      requests.push({ url, options });
      return { ok: true, json: async () => ({ success: true, user: session }) };
    };
    await w.TechPrepAPI.updateProfile({ name: 'Updated Student', skills: 'Java' });
    const request = requests.find((r) => r.url === '/api/auth/profile');
    assert.ok(request);
    assert.equal(request.options.method, 'PUT');
    assert.deepEqual(JSON.parse(request.options.body), { name: 'Updated Student', skills: 'Java' });
    assert.equal(request.options.headers.Authorization, 'Bearer test-token');
  } finally {
    dom.window.close();
  }
});
test('login uses backend response, saves the existing session shape, and rejects failures', async () => {
  const { w, dom } = await mount('/', { signedIn: false });
  try {
    let submitted;
    w.fetch = async (url, options) => {
      submitted = { url, body: JSON.parse(options.body) };
      return {
        ok: true,
        json: async () => ({ success: true, user: session, token: 'issued-token' })
      };
    };
    const result = await w.loginUser('  STUDENT@example.test  ', 'password123');
    assert.equal(result.success, true);
    assert.equal(submitted.url, '/api/auth/login');
    assert.deepEqual(submitted.body, { email: 'student@example.test', password: 'password123' });
    assert.equal(
      JSON.parse(w.sessionStorage.getItem('techprep_current_user')).token,
      'issued-token'
    );
    w.sessionStorage.removeItem('techprep_current_user');
    w.fetch = async () => ({
      ok: false,
      status: 401,
      json: async () => ({ success: false, message: 'Invalid credentials' })
    });
    assert.equal((await w.loginUser('student@example.test', 'wrong-password')).success, false);
    assert.equal(w.sessionStorage.getItem('techprep_current_user'), null);
  } finally {
    dom.window.close();
  }
});
test('redesigned home retains useful section anchors and existing support destinations', async () => {
  const { w, dom } = await mount('/', { signedIn: false });
  try {
    for (const id of ['home', 'demo', 'features', 'about', 'faq', 'contact'])
      assert.ok(w.document.getElementById(id));
    assert.ok(w.document.querySelector('a[href="mailto:support@techprep.ai"]'));
    assert.ok(w.document.querySelector('a[href="mailto:tpo@techprep.ai"]'));
  } finally {
    dom.window.close();
  }
});
test('authentication redirects preserve user roles and login query parameters', async () => {
  const { authRedirect } = await import('../../frontend/src/runtime/authRedirect.js');
  assert.equal(
    authRedirect('login', null, '?email=test%40example.test&registered=1'),
    '/index.html?modal=login&email=test%40example.test&registered=1'
  );
  assert.equal(authRedirect('signup', null), '/index.html?modal=signup');
  assert.equal(authRedirect('login', '{broken'), '/index.html?modal=login');
  assert.equal(
    authRedirect('login', JSON.stringify({ role: 'admin' })),
    '/pages/admin/admin-hub.html'
  );
  assert.equal(
    authRedirect('signup', JSON.stringify({ role: 'student' })),
    '/pages/user/dashboard.html'
  );
});
test('every shipped first-party controller is referenced by a page', async () => {
  async function files(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    return (
      await Promise.all(
        entries.map((e) => (e.isDirectory() ? files(`${dir}/${e.name}`) : [`${dir}/${e.name}`]))
      )
    ).flat();
  }
  const referenced = new Set(
    Object.values(manifest).flatMap((p) => p.scripts.filter((s) => s.src).map((s) => s.src))
  );
  for (const path of await files('frontend/public/controllers')) {
    if (path.endsWith('.js'))
      assert.ok(
        referenced.has('/' + path.replace('frontend/public/', '')),
        `Unused controller: ${path}`
      );
  }
});
