require('dotenv').config();
const mongoose = require('mongoose');
const config = require('./config');

async function createTestBooking() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Import models
    const Booking = require('./src/models/booking.model');
    const Room = require('./src/models/room.model');
    const User = require('./src/models/user.model');
    
    // Tìm một phòng để đặt
    const room = await Room.findOne({});
    if (!room) {
      console.log('No room found in database');
      mongoose.connection.close();
      return;
    }
    
    // Tìm một user để đặt phòng
    const user = await User.findOne({});
    if (!user) {
      console.log('No user found in database');
      mongoose.connection.close();
      return;
    }
    
    // Tạo booking test
    const testBooking = new Booking({
      user: user._id,
      room: room._id,
      checkInDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Ngày mai
      checkOutDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // Ngày mốt
      adultCount: 2,
      childCount: 0,
      roomCount: 1,
      totalPrice: 100000,
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '0123456789',
      notes: 'Test booking for MoMo payment',
      paymentMethod: 'online',
      bookingCode: `BK${Date.now()}`
    });
    
    const savedBooking = await testBooking.save();
    console.log('Test booking created successfully:');
    console.log('Booking ID:', savedBooking._id);
    console.log('Booking Code:', savedBooking.bookingCode);
    console.log('Total Price:', savedBooking.totalPrice);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating test booking:', error);
    mongoose.connection.close();
  }
}

createTestBooking();