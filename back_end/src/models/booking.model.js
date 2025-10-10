const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true,
        },
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        adultCount: {
            type: Number,
            required: true,
            min: 1,
        },
        childCount: {
            type: Number,
            required: true,
            min: 0,
        },
        roomCount: {
            type: Number,
            required: true,
            min: 1,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0, // Thuế, ví dụ 10% giá phòng
        },
        serviceFee: {
            type: Number,
            default: 0, // Phí dịch vụ, ví dụ 5% giá phòng
        },
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },
        phone: {
            type: String,
            required: true,
            match: [/^\d{10,15}$/, "Please enter a valid phone number"],
        },
        notes: {
            type: String,
            trim: true,
        },
        paymentMethod: {
            type: String,
            enum: ["online"], // Chỉ giữ lại phương thức thanh toán trực tuyến
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        momoTransactionId: {
            type: String,
            trim: true,
        },
        momoReturnUrl: {
            type: String,
            trim: true,
        },
        bookingCode: {
            type: String,
            unique: true,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending",
        },
        cancellationPolicy: {
            type: String,
            default: "Free cancellation up to 48 hours before check-in",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);