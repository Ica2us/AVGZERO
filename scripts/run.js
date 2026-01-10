#!/usr/bin/env node

/**
 * Cross-platform script runner for AVG Game Engine
 * Automatically detects OS and runs appropriate script (.bat for Windows, .sh for Unix)
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const isWindows = process.platform === 'win32';
const scriptName = process.argv[2];

if (!scriptName) {
    console.error('Usage: node run.js <script_name>');
    console.error('Available scripts: build, build_wasm, build_web, dev_server, clean, deploy');
    process.exit(1);
}

const scriptsDir = path.join(__dirname);
const extension = isWindows ? '.bat' : '.sh';
const scriptPath = path.join(scriptsDir, scriptName + extension);

// Check if script exists
if (!fs.existsSync(scriptPath)) {
    console.error(`Script not found: ${scriptPath}`);
    process.exit(1);
}

console.log(`Running: ${scriptName} (${isWindows ? 'Windows' : 'Unix'})`);
console.log('----------------------------------------');

let child;

if (isWindows) {
    // Windows: run .bat file
    child = spawn('cmd.exe', ['/c', scriptPath], {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..'),
        shell: true
    });
} else {
    // Unix: run .sh file
    child = spawn('bash', [scriptPath], {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
    });
}

child.on('error', (err) => {
    console.error('Failed to start script:', err.message);
    process.exit(1);
});

child.on('close', (code) => {
    process.exit(code || 0);
});
