const ReviewService = require("../services/review.service");
const { formatResponse } = require("../utils/formatResponse");

class ReviewController {
    async createReview(req, res) {
        try {
            const userId = req.user._id;
            const { bookingId, rating, comment } = req.body;
            const review = await ReviewService.createReview(userId, bookingId, { rating, comment });
            return formatResponse(res, 201, "Review created successfully", review);
        } catch (error) {
            console.error("Create review error:", error);
            return formatResponse(res, 400, error.message);
        }
    }

    async getReviewsByRoom(req, res) {
        try {
            const { roomId } = req.params;
            const reviews = await ReviewService.getReviewsByRoom(roomId);
            return formatResponse(res, 200, "Reviews retrieved successfully", reviews);
        } catch (error) {
            console.error("Get reviews error:", error);
            return formatResponse(res, 400, error.message);
        }
    }
}

module.exports = new ReviewController();