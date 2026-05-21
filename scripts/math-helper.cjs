#!/usr/bin/env node
/**
 * P2-3 -- cross-platform launcher for the math-helper Python service.
 *
 * Replaces the hardcoded `.venv\Scripts\python` paths in root package.json that
 * broke Linux + macOS CI. Resolves the platform-correct interpreter and
 * spawns either `install` (create venv + pip install) or `dev` (uvicorn
 * reload server) based on the first argument.
 *
 * Usage:
 *   node scripts/math-helper.cjs install
 *   node scripts/math-helper.cjs dev
 */
const { spawn } = require('node:child_process');
const path = require('node:path');
const fs = require('node:fs');

const APP_DIR = path.resolve(__dirname, '..', 'services', 'math-helper', 'app');
const VENV_DIR = path.join(APP_DIR, '.venv');
const IS_WIN = process.platform === 'win32';

function venvPython() {
  return IS_WIN
    ? path.join(VENV_DIR, 'Scripts', 'python.exe')
    : path.join(VENV_DIR, 'bin', 'python');
}

function run(cmd, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit', shell: false });
    child.on('exit', (code) => (code === 0 ? resolve(undefined) : reject(new Error(`${cmd} exited ${code}`))));
    child.on('error', reject);
  });
}

async function install() {
  // 1. Create venv with the system python (named 'python' on Win, 'python3'
  //    on most *nix). Fall back to 'python' if 'python3' isn't on PATH.
  const sysPython = IS_WIN ? 'python' : (process.env.PYTHON || 'python3');
  if (!fs.existsSync(VENV_DIR)) {
    await run(sysPython, ['-m', 'venv', VENV_DIR], APP_DIR);
  }
  // 2. Pip install requirements using the venv's python (avoids the "which
  //    python is active" guesswork that breaks in CI shells).
  await run(venvPython(), ['-m', 'pip', 'install', '-r', 'requirements.txt'], APP_DIR);
}

async function dev() {
  if (!fs.existsSync(venvPython())) {
    console.error(`venv not found at ${VENV_DIR}. Run: npm run math-helper:install`);
    process.exit(1);
  }
  await run(
    venvPython(),
    ['-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8000', '--env-file', '.env'],
    APP_DIR,
  );
}

const mode = process.argv[2];
if (mode === 'install') install().catch((e) => { console.error(e); process.exit(1); });
else if (mode === 'dev') dev().catch((e) => { console.error(e); process.exit(1); });
else { console.error('Usage: node scripts/math-helper.cjs <install|dev>'); process.exit(1); }
