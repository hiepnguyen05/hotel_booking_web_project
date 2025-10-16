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
// This is now handled by adding it as an explicit dependency, 
// but we'll keep this as a fallback
try {
  console.log('Verifying rollup native module installation...');
  // Try to require the module to see if it's available
  require('@rollup/rollup-linux-x64-gnu');
  console.log('Rollup native module is available');
} catch (e) {
  console.log('Rollup native module not found, attempting to install...');
  try {
    execSync('npm install @rollup/rollup-linux-x64-gnu --no-save', { stdio: 'inherit' });
    console.log('Rollup native module installed successfully');
  } catch (installError) {
    console.log('Rollup native module install skipped (may not be needed on this platform):', installError.message);
  }
}