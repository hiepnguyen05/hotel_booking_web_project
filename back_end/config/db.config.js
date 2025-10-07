require("dotenv").config();

module.exports = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/booking_hotel",
};
