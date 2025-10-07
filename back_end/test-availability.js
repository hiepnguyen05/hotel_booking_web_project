const axios = require('axios');

// Test the room availability endpoint
async function testRoomAvailability() {
  try {
    // Replace with an actual room ID from your database
    const roomId = '6701a2b3c4d5e6f7g8h9i0j1'; // This is a placeholder ID
    
    // Test dates
    const checkInDate = '2025-10-10';
    const checkOutDate = '2025-10-15';
    
    const url = `http://localhost:5000/api/rooms/${roomId}/availability?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`;
    
    console.log(`Testing URL: ${url}`);
    
    const response = await axios.get(url);
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('Error testing room availability:', error.response ? error.response.data : error.message);
  }
}

testRoomAvailability();