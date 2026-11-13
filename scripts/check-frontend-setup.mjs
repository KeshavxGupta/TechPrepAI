import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const frontend = resolve(dirname(fileURLToPath(import.meta.url)), '../frontend');
// Assert Vite's actual dependency, including nested installs, uses the WASM build.
const frontendRequire = createRequire(resolve(frontend, 'package.json'));
const viteRequire = createRequire(frontendRequire.resolve('vite/package.json'));
assert.equal(
  viteRequire('rollup/package.json').name,
  '@rollup/wasm-node',
  'Vite must not load a native Rollup addon'
);

const backend = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ source: 'frontend-setup-test', path: req.url }));
});
await new Promise((done) => backend.listen(0, '127.0.0.1', done));

const vite = spawn(
  process.execPath,
  [resolve(frontend, 'node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '0'],
  {
    cwd: frontend,
    env: {
      ...process.env,
      API_PROXY_TARGET: `http://127.0.0.1:${backend.address().port}`,
      NO_COLOR: '1'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  }
);
let output = '';
let spawnError;
vite.on('error', (error) => {
  spawnError = error;
});
vite.stdout.on('data', (chunk) => {
  output += chunk;
});
vite.stderr.on('data', (chunk) => {
  output += chunk;
});
try {
  let url;
  const deadline = Date.now() + 30000;
  while (Date.now() < deadline) {
    if (spawnError) throw spawnError;
    if (vite.exitCode !== null) throw new Error(`Vite exited with ${vite.exitCode}: ${output}`);
    url = output.match(/http:\/\/127\.0\.0\.1:\d+\//)?.[0];
    if (url) break;
    await delay(50);
  }
  assert.ok(url, `Frontend did not start: ${output}`);
  for (const path of [
    '',
    'pages/public/docs.html',
    'pages/user/dashboard.html',
    'src/main.jsx',
    'src/pages/IndexPage.jsx'
  ]) {
    const response = await fetch(new URL(path, url));
    assert.equal(response.status, 200, `Development asset ${path}`);
    assert.doesNotMatch(await response.text(), /Internal Server Error/);
  }
  const styles = await (
    await fetch(new URL('src/styles/utilities.css', url), { headers: { Accept: 'text/css' } })
  ).text();
  assert.match(
    styles,
    /display:\s*flex/,
    'Tailwind scans frontend sources from the frontend directory'
  );
  assert.doesNotMatch(styles, /@tailwind/, 'Tailwind directives are compiled');
  const health = await (await fetch(new URL('api/health', url))).json();
  assert.deepEqual(health, { source: 'frontend-setup-test', path: '/api/health' });
  console.log(
    'Frontend-directory startup, React transforms, nested URLs, compiled styles and API proxy passed.'
  );
} finally {
  vite.kill('SIGTERM');
  await new Promise((done) => backend.close(done));
}
