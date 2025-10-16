#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('Starting build process...');

// Function to run a command
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: process.cwd(),
      ...options
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (error) => {
      reject(error);
    });
  });
}

// Main build process
async function build() {
  try {
    // Install dependencies
    console.log('Installing dependencies...');
    await runCommand('npm', ['install']);
    
    // Build the project using the direct path to vite
    console.log('Building project...');
    const vitePath = path.join(__dirname, 'node_modules', 'vite', 'bin', 'vite.js');
    await runCommand('node', [vitePath, 'build']);
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

build();