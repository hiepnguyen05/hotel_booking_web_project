// Post-install script to handle platform-specific dependencies
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Running postinstall script...');

// Fix vite binary permissions
try {
  const vitePath = './node_modules/.bin/vite';
  if (fs.existsSync(vitePath)) {
    fs.chmodSync(vitePath, 0o755);
    console.log('Vite binary permissions fixed');
  } else {
    console.log('Vite binary not found');
  }
} catch (e) {
  console.log('Failed to set permissions:', e.message);
}

// Install rollup native module for Linux (needed on Vercel)
try {
  console.log('Installing rollup native module for Linux...');
  execSync('npm install @rollup/rollup-linux-x64-gnu --no-save', { stdio: 'inherit' });
  console.log('Rollup native module installed successfully');
} catch (e) {
  console.log('Rollup native module install skipped (may not be needed on this platform):', e.message);
}