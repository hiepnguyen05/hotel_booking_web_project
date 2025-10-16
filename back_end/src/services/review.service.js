const Review = require("../models/review.model");
const BookingRepository = require("../repositories/booking.repository");

class ReviewService {
    async createReview(userId, bookingId, reviewData) {
        const { rating, comment } = reviewData;
        const booking = await BookingRepository.findById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.user.toString() !== userId.toString()) {
            throw new Error("Unauthorized to review this booking");
        }
        if (booking.status !== "completed") {
            throw new Error("Booking must be completed to leave a review");
        }

        // Check if user has already reviewed this booking
        const existingReview = await Review.findOne({ user: userId, booking: bookingId });
        if (existingReview) {
            throw new Error("You have already reviewed this booking");
        }

        const review = new Review({
            user: userId,
            booking: bookingId,
            room: booking.room,
            rating,
            comment,
        });
        return review.save();
    }

    async getReviewsByRoom(roomId) {
        return Review.find({ room: roomId }).populate("user", "username");
    }

    /**
     * Check if user has reviewed a booking
     * @param {string} userId - User ID
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Boolean>} True if user has reviewed the booking
     */
    async hasUserReviewedBooking(userId, bookingId) {
        const review = await Review.findOne({ user: userId, booking: bookingId });
        return !!review;
    }
}

module.exports = new ReviewService();