// Script to check environment variables
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('==========================');
console.log('NGROK_URL:', process.env.NGROK_URL);
console.log('MOMO_PARTNER_CODE:', process.env.MOMO_PARTNER_CODE);
console.log('MOMO_ACCESS_KEY:', process.env.MOMO_ACCESS_KEY);
console.log('MOMO_SECRET_KEY:', process.env.MOMO_SECRET_KEY);
console.log('MOMO_ENDPOINT:', process.env.MOMO_ENDPOINT);
console.log('==========================');

// Check if NGROK_URL is correct
if (process.env.NGROK_URL && process.env.NGROK_URL.includes('your_ngrok_url_here')) {
  console.log('ERROR: NGROK_URL still contains placeholder value!');
} else if (process.env.NGROK_URL) {
  console.log('SUCCESS: NGROK_URL is properly set');
} else {
  console.log('WARNING: NGROK_URL is not set');
}