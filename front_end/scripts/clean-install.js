const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  console.log('Cleaning node_modules and package-lock.json...');
  
  // Remove node_modules directory
  if (fs.existsSync('node_modules')) {
    console.log('Removing node_modules directory...');
    fs.rmSync('node_modules', { recursive: true, force: true });
  }
  
  // Remove package-lock.json
  if (fs.existsSync('package-lock.json')) {
    console.log('Removing package-lock.json...');
    fs.unlinkSync('package-lock.json');
  }
  
  // Clean npm cache
  console.log('Cleaning npm cache...');
  execSync('npm cache clean --force', { stdio: 'inherit' });
  
  // Reinstall dependencies
  console.log('Reinstalling dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Clean install completed successfully!');
} catch (error) {
  console.error('Error during clean install:', error.message);
  process.exit(1);
}