#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting ngrok for backend development...');

// Check if ngrok is installed
const ngrokCheck = spawn('ngrok', ['version'], { stdio: 'pipe' });

ngrokCheck.on('error', (error) => {
  console.error('Error: ngrok is not installed or not in PATH');
  console.log('Please install ngrok first:');
  console.log('  npm install -g ngrok');
  process.exit(1);
});

ngrokCheck.on('close', (code) => {
  if (code === 0) {
    console.log('ngrok is installed, starting tunnel...');
    
    // Create ngrok config file
    const configContent = `
version: "2"
tunnels:
  backend:
    addr: 5000
    proto: http
  frontend:
    addr: 3000
    proto: http
`;
    
    const configPath = path.join(__dirname, 'ngrok-multi.yml');
    fs.writeFileSync(configPath, configContent);
    
    // Start ngrok tunnel for both ports 5000 (backend) and 3000 (frontend)
    const ngrok = spawn('ngrok', ['start', '--all', '--config', configPath], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    ngrok.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      // Look for the ngrok URLs
      const urlMatches = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.(io|app|free\.dev)/g);
      if (urlMatches && urlMatches.length >= 2) {
        const backendUrl = urlMatches[0];
        const frontendUrl = urlMatches[1];
        
        console.log(`\n=== NGROK TUNNELS ACTIVE ===`);
        console.log(`Backend URL: ${backendUrl}`);
        console.log(`Frontend URL: ${frontendUrl}`);
        console.log(`MoMo callback URL: ${backendUrl}/api/bookings/momo/callback`);
        console.log(`MoMo redirect URL: ${frontendUrl}/payment-result`);
        console.log(`===========================\n`);
        
        // Update .env file with NGROK_URL
        const envPath = path.join(__dirname, '.env');
        fs.readFile(envPath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading .env file:', err);
            return;
          }
          
          let updatedData = data;
          
          // Update or add NGROK_BACKEND_URL
          if (updatedData.includes('NGROK_BACKEND_URL=')) {
            updatedData = updatedData.replace(/NGROK_BACKEND_URL=.*/, `NGROK_BACKEND_URL=${backendUrl}`);
          } else {
            updatedData += `\nNGROK_BACKEND_URL=${backendUrl}`;
          }
          
          // Update or add NGROK_FRONTEND_URL
          if (updatedData.includes('NGROK_FRONTEND_URL=')) {
            updatedData = updatedData.replace(/NGROK_FRONTEND_URL=.*/, `NGROK_FRONTEND_URL=${frontendUrl}`);
          } else {
            updatedData += `\nNGROK_FRONTEND_URL=${frontendUrl}`;
          }
          
          fs.writeFile(envPath, updatedData, 'utf8', (err) => {
            if (err) {
              console.error('Error updating .env file:', err);
            } else {
              console.log('Updated NGROK URLs in .env file');
            }
          });
        });
      }
    });
    
    ngrok.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      console.error(`ngrok error: ${errorOutput}`);
      
      // Handle specific ngrok errors
      if (errorOutput.includes('ERR_NGROK_334') || errorOutput.includes('already online')) {
        console.log('\n=== NGROK ERROR SOLUTION ===');
        console.log('The endpoint is already online. Please stop all existing ngrok processes first.');
        console.log('You can:');
        console.log('1. Kill all ngrok processes: taskkill /f /im ngrok.exe (Windows) or pkill ngrok (Linux/Mac)');
        console.log('2. Or wait a few minutes for the existing tunnel to expire');
        console.log('============================\n');
      }
    });
    
    ngrok.on('close', (code) => {
      console.log(`ngrok process exited with code ${code}`);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\nShutting down ngrok...');
      ngrok.kill();
      process.exit(0);
    });
    
  } else {
    console.error('Error checking ngrok installation');
    process.exit(1);
  }
});