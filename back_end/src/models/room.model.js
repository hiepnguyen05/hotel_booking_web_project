const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            enum: ["single", "double", "suite", "deluxe"],
            required: true,
        },
        bedType: {
            type: String,
            enum: ["single", "double", "queen", "king"],
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        description: {
            type: String,
            trim: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        amenities: {
            type: [String],
            default: [],
        },
        images: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["available", "booked", "maintenance"],
            default: "available",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);