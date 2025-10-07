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
}

module.exports = new ReviewService();