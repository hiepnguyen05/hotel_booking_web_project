const express = require("express");
const router = express.Router();
const ReviewController = require("../controllers/review.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

router.post("/", AuthMiddleware.authenticate, ReviewController.createReview);
router.get("/room/:roomId", ReviewController.getReviewsByRoom);

module.exports = router;