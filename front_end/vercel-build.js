const { execSync } = require('child_process');

try {
  console.log('Running Vercel build for Vite project...');
  
  // Run vite build directly
  execSync('npx vite build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}