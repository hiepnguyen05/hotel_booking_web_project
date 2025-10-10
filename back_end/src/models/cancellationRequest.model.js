const mongoose = require("mongoose");

const cancellationRequestSchema = new mongoose.Schema(
    {
        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reason: {
            type: String,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        refundStatus: {
            type: String,
            enum: ["not_requested", "pending", "completed", "failed"],
            default: "not_requested",
        },
        refundAmount: {
            type: Number,
            default: 0,
        },
        adminNotes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("CancellationRequest", cancellationRequestSchema);