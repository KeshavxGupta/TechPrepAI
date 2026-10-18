const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findBinary(candidates, defaultCmd) {
  for (const p of candidates) {
    if (p && fs.existsSync(p)) {
      return p;
    }
  }
  // Try finding in PATH
  try {
    const isWin = process.platform === 'win32';
    const whereCmd = isWin ? `where.exe ${defaultCmd}` : `which ${defaultCmd}`;
    const result = execSync(whereCmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    const firstLine = result.split(/\r?\n/)[0];
    if (firstLine && fs.existsSync(firstLine)) {
      return firstLine;
    }
  } catch {
    // Ignore and fallback
  }
  return defaultCmd;
}

// Host-specific discovered paths
const JAVA_CANDIDATES = [
  'C:\\Users\\hp\\AppData\\Local\\Programs\\Eclipse Adoptium\\jdk-21.0.9.10-hotspot\\bin\\java.exe',
  'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.9.10-hotspot\\bin\\java.exe',
  'C:\\Program Files\\Java\\jdk-21\\bin\\java.exe'
];

const JAVAC_CANDIDATES = [
  'C:\\Users\\hp\\AppData\\Local\\Programs\\Eclipse Adoptium\\jdk-21.0.9.10-hotspot\\bin\\javac.exe',
  'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.9.10-hotspot\\bin\\javac.exe',
  'C:\\Program Files\\Java\\jdk-21\\bin\\javac.exe'
];

const GPP_CANDIDATES = [
  'C:\\msys64\\ucrt64\\bin\\g++.exe',
  'C:\\msys64\\mingw64\\bin\\g++.exe',
  'C:\\MinGW\\bin\\g++.exe'
];

const PYTHON_CANDIDATES = [
  'C:\\msys64\\ucrt64\\bin\\python.exe',
  'C:\\Windows\\py.exe',
  'C:\\Python312\\python.exe',
  'C:\\Python311\\python.exe'
];

const NODE_CANDIDATES = [
  'C:\\Program Files\\nodejs\\node.exe',
  process.execPath
];

const compilerConfig = {
  compilers: {
    java: {
      name: 'Java 21 (Temurin OpenJDK)',
      compilerPath: findBinary(JAVAC_CANDIDATES, 'javac'),
      runnerPath: findBinary(JAVA_CANDIDATES, 'java'),
      ext: '.java',
      isCompiled: true
    },
    cpp: {
      name: 'C++ 20 (GCC/G++ 14.2)',
      compilerPath: findBinary(GPP_CANDIDATES, 'g++'),
      ext: '.cpp',
      isCompiled: true
    },
    python: {
      name: 'Python 3.12',
      runnerPath: findBinary(PYTHON_CANDIDATES, 'python'),
      ext: '.py',
      isCompiled: false
    },
    javascript: {
      name: 'JavaScript (Node.js 22)',
      runnerPath: findBinary(NODE_CANDIDATES, 'node'),
      ext: '.js',
      isCompiled: false
    }
  },
  timeoutMs: 6000,
  maxOutputLength: 20000,
  tempDir: path.join(__dirname, '..', 'temp', 'executions')
};

// Ensure temp executions directory exists
try {
  if (!fs.existsSync(compilerConfig.tempDir)) {
    fs.mkdirSync(compilerConfig.tempDir, { recursive: true });
  }
} catch (e) {
  console.error('[CompilerConfig] Failed creating tempDir:', e.message);
}

module.exports = compilerConfig;
