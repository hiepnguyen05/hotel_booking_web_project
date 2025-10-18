require("dotenv").config();

// Log NGROK_URL for debugging
console.log('[SERVER CONFIG] NGROK_URL from env:', process.env.NGROK_URL);

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hotel_booking",
    JWT_SECRET: process.env.JWT_SECRET || "supersecretkey",
};