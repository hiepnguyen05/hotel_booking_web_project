const BookingService = require("../services/booking.service");
const { formatResponse } = require("../utils/formatResponse");

class BookingController {
    async createBooking(req, res) {
        try {
            const userId = req.user._id;
            const booking = await BookingService.createBooking(userId, req.body);
            return formatResponse(res, 201, "Booking created successfully", booking);
        } catch (error) {
            console.error("Create booking error:", error);
            return formatResponse(res, 400, error.message);
        }
    }

    async getUserBookings(req, res) {
        try {
            const userId = req.user._id;
            const bookings = await BookingService.getUserBookings(userId);
            return formatResponse(res, 200, "Bookings retrieved successfully", bookings);
        } catch (error) {
            console.error("Get bookings error:", error);
            return formatResponse(res, 400, error.message);
        }
    }

    async cancelBooking(req, res) {
        try {
            const userId = req.user._id;
            const { bookingId } = req.params;
            const booking = await BookingService.cancelBooking(bookingId, userId);
            return formatResponse(res, 200, "Booking cancelled successfully", booking);
        } catch (error) {
            console.error("Cancel booking error:", error);
            return formatResponse(res, 400, error.message);
        }
    }

    async updateBooking(req, res) {
        try {
            const userId = req.user._id;
            const { bookingId } = req.params;
            const booking = await BookingService.updateBooking(bookingId, userId, req.body);
            return formatResponse(res, 200, "Booking updated successfully", booking);
        } catch (error) {
            console.error("Update booking error:", error);
            return formatResponse(res, 400, error.message);
        }
    }
}

module.exports = new BookingController();