// Post-install script to handle platform-specific dependencies
const fs = require('fs');

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

console.log('Postinstall script completed');
