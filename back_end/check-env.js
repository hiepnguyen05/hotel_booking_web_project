// Script to check environment variables
require('dotenv').config();

console.log('Environment Variables Check:');
console.log('==========================');
console.log('NGROK_URL:', process.env.NGROK_URL);
console.log('MOMO_PARTNER_CODE:', process.env.MOMO_PARTNER_CODE);
console.log('MOMO_ACCESS_KEY:', process.env.MOMO_ACCESS_KEY);
console.log('MOMO_SECRET_KEY:', process.env.MOMO_SECRET_KEY);
console.log('MOMO_ENDPOINT:', process.env.MOMO_ENDPOINT);
console.log('MONGO_URI:', process.env.MONGO_URI);
console.log('==========================');

// Check if NGROK_URL is correct
if (process.env.NGROK_URL && process.env.NGROK_URL.includes('your_ngrok_url_here')) {
  console.log('ERROR: NGROK_URL still contains placeholder value!');
} else if (process.env.NGROK_URL) {
  console.log('SUCCESS: NGROK_URL is properly set');
} else {
  console.log('WARNING: NGROK_URL is not set');
}

// Check if MONGO_URI is correct
if (process.env.MONGO_URI && process.env.MONGO_URI.includes('your_mongo_uri_here')) {
  console.log('ERROR: MONGO_URI still contains placeholder value!');
} else if (process.env.MONGO_URI) {
  console.log('SUCCESS: MONGO_URI is properly set');
  
  // Additional checks for MongoDB URI format
  if (process.env.MONGO_URI.startsWith('mongodb+srv://')) {
    console.log('SUCCESS: MONGO_URI uses correct Atlas format');
  } else if (process.env.MONGO_URI.startsWith('mongodb://')) {
    console.log('INFO: MONGO_URI uses local MongoDB format');
  } else {
    console.log('ERROR: MONGO_URI has invalid scheme');
  }
} else {
  console.log('WARNING: MONGO_URI is not set');
}