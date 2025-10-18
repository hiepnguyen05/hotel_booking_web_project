// Start ngrok for both frontend and backend
const ngrok = require('ngrok');

async function startNgrok() {
  try {
    console.log('Starting ngrok tunnels...');
    
    // Start backend tunnel (port 5000)
    const backendUrl = await ngrok.connect({
      addr: 5000,
      subdomain: 'braylen-noisiest-biennially' // Use the specific subdomain
    });
    
    console.log('Backend ngrok tunnel started:');
    console.log('Public URL:', backendUrl);
    console.log('Use this URL for MoMo callback (ipnUrl)');
    
    // Update the NGROK_URL in environment
    process.env.NGROK_URL = backendUrl;
    console.log('Updated NGROK_URL to:', backendUrl);
    
    console.log('\n=== NGROK TUNNEL STARTED ===');
    console.log('Backend (API):', backendUrl);
    console.log('Use this URL for MoMo callback (ipnUrl)');
    console.log('Press Ctrl+C to stop ngrok tunnel');
    
    // Keep the process running
    process.stdin.resume();
    
  } catch (error) {
    console.error('Error starting ngrok:', error.message);
    
    // If tunnel already exists, try to get the existing URL
    if (error.body && error.body.details && error.body.details.err.includes('already exists')) {
      console.log('Tunnel already exists. Please use the existing URL:');
      console.log('Backend URL: https://braylen-noisiest-biennially.ngrok-free.dev');
    }
  }
}

startNgrok();