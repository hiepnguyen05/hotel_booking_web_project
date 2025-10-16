const mongoose = require('mongoose');
const Room = require('./src/models/room.model');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hotel_booking')
    .then(() => {
        console.log('Connected to MongoDB');

        // Find all rooms and log their images
        Room.find({}).then(rooms => {
            console.log(`Found ${rooms.length} rooms:`);
            rooms.forEach((room, index) => {
                console.log(`\nRoom ${index + 1}: ${room.name}`);
                console.log(`ID: ${room._id}`);
                console.log(`Images:`, room.images);
                console.log(`Image count: ${room.images ? room.images.length : 0}`);
            });

            // Close connection
            mongoose.connection.close();
        }).catch(err => {
            console.error('Error fetching rooms:', err);
            mongoose.connection.close();
        });
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });