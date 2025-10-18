require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const config = require('./config');
const User = require('./src/models/user.model');

async function createUser() {
  try {
    // Kết nối MongoDB
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Kiểm tra xem user đã tồn tại chưa
    const existingUser = await User.findOne({ email: 'hiep20122005@gmail.com' });
    if (existingUser) {
      console.log('User already exists:', existingUser);
      mongoose.connection.close();
      return;
    }
    
    // Tạo user mới
    const hashedPassword = await bcrypt.hash('123456', 10); // Mật khẩu mặc định
    const newUser = new User({
      username: 'Hiệp Nguyễn',
      email: 'hiep20122005@gmail.com',
      password: hashedPassword,
      role: 'user'
    });
    
    const savedUser = await newUser.save();
    console.log('User created successfully:', {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role
    });
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error creating user:', error);
    mongoose.connection.close();
  }
}

createUser();