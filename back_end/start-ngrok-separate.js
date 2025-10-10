#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting separate ngrok tunnels for backend and frontend...');

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
    console.log('ngrok is installed, starting tunnels...');
    
    // Start ngrok tunnel for backend (port 5000)
    console.log('Starting ngrok tunnel for backend (port 5000)...');
    const backendNgrok = spawn('ngrok', ['http', '5000'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Start ngrok tunnel for frontend (port 3000)
    console.log('Starting ngrok tunnel for frontend (port 3000)...');
    const frontendNgrok = spawn('ngrok', ['http', '3000'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    // Handle backend ngrok output
    backendNgrok.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[Backend]', output);
      
      // Look for the ngrok URL
      const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.(io|app|free\.dev)/);
      if (urlMatch) {
        const backendUrl = urlMatch[0];
        console.log(`\n=== BACKEND NGROK TUNNEL ACTIVE ===`);
        console.log(`Backend URL: ${backendUrl}`);
        console.log(`MoMo callback URL: ${backendUrl}/api/bookings/momo/callback`);
        console.log(`====================================\n`);
        
        // Update .env file with NGROK_BACKEND_URL
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
          
          fs.writeFile(envPath, updatedData, 'utf8', (err) => {
            if (err) {
              console.error('Error updating .env file:', err);
            } else {
              console.log('Updated NGROK_BACKEND_URL in .env file');
            }
          });
        });
      }
    });
    
    // Handle frontend ngrok output
    frontendNgrok.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('[Frontend]', output);
      
      // Look for the ngrok URL
      const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.(io|app|free\.dev)/);
      if (urlMatch) {
        const frontendUrl = urlMatch[0];
        console.log(`\n=== FRONTEND NGROK TUNNEL ACTIVE ===`);
        console.log(`Frontend URL: ${frontendUrl}`);
        console.log(`MoMo redirect URL: ${frontendUrl}/payment-result`);
        console.log(`=====================================\n`);
        
        // Update .env file with NGROK_FRONTEND_URL
        const envPath = path.join(__dirname, '.env');
        fs.readFile(envPath, 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading .env file:', err);
            return;
          }
          
          let updatedData = data;
          
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
              console.log('Updated NGROK_FRONTEND_URL in .env file');
            }
          });
        });
      }
    });
    
    backendNgrok.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      console.error('[Backend] ngrok error:', errorOutput);
      
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
    
    frontendNgrok.stderr.on('data', (data) => {
      const errorOutput = data.toString();
      console.error('[Frontend] ngrok error:', errorOutput);
      
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
    
    backendNgrok.on('close', (code) => {
      console.log('[Backend] ngrok process exited with code', code);
    });
    
    frontendNgrok.on('close', (code) => {
      console.log('[Frontend] ngrok process exited with code', code);
    });
    
    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\nShutting down ngrok tunnels...');
      backendNgrok.kill();
      frontendNgrok.kill();
      process.exit(0);
    });
    
  } else {
    console.error('Error checking ngrok installation');
    process.exit(1);
  }
});