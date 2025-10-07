const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/booking.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const { validateBooking } = require("../validations/booking.validation");

console.log("AuthMiddleware.authenticate:", typeof AuthMiddleware.authenticate);
console.log("validateBooking:", typeof validateBooking);
console.log("BookingController.createBooking:", typeof BookingController.createBooking);

router.post("/", AuthMiddleware.authenticate, validateBooking, BookingController.createBooking);
router.get("/", AuthMiddleware.authenticate, BookingController.getUserBookings);
router.put("/:bookingId/cancel", AuthMiddleware.authenticate, BookingController.cancelBooking);
router.put("/:bookingId", AuthMiddleware.authenticate, validateBooking, BookingController.updateBooking);

module.exports = router;