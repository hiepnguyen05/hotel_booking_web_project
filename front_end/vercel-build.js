const { execSync } = require('child_process');

try {
  console.log('Running Vercel build for Vite project...');
  
  // Install dependencies first
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  // Run vite build directly using node_modules
  console.log('Running vite build...');
  execSync('node node_modules/vite/bin/vite.js build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}