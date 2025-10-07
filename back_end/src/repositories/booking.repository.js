const Booking = require("../models/booking.model");

class BookingRepository {
    async createBooking(data) {
        const booking = new Booking(data);
        return booking.save();
    }

    async findById(id) {
        return Booking.findById(id).populate("user", "username email").populate("room", "name type bedType price amenities");
    }

    async getBookingsByUser(userId) {
        return Booking.find({ user: userId })
            .populate("user", "username email")
            .populate("room", "name type bedType price amenities")
            .sort({ createdAt: -1 });
    }

    async checkRoomAvailability(roomId, checkInDate, checkOutDate) {
        const isBooked = await Booking.find({
            room: roomId,
            status: { $in: ["pending", "confirmed"] },
            $or: [
                {
                    checkInDate: { $lte: checkOutDate },
                    checkOutDate: { $gte: checkInDate },
                },
            ],
        }).countDocuments();
        return isBooked === 0;
    }

    async updateBookingStatus(bookingId, status) {
        return Booking.findByIdAndUpdate(bookingId, { status }, { new: true });
    }

    async update(bookingId, data) {
        return Booking.findByIdAndUpdate(bookingId, data, { new: true });
    }
}

module.exports = new BookingRepository();