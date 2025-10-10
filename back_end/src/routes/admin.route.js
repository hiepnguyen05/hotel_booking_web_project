const express = require("express");
const router = express.Router();
const {
    getAllUsers,
    updateUserRole,
    deleteUser,
    lockUser,
    unlockUser,
    getAllBookings,
    updateBookingStatus,
    getBookingStats,
    processBookingPayment

} = require("../controllers/admin.controller");
const { authenticate, authorizeAdmin } = require("../middlewares/auth.middleware");

// Lấy tất cả user
router.get("/users", authenticate, authorizeAdmin, getAllUsers);

// Cập nhật vai trò user
router.put("/users/:id/role", authenticate, authorizeAdmin, updateUserRole);

// Xóa user
router.delete("/users/:id", authenticate, authorizeAdmin, deleteUser);

// Khóa user
router.put("/users/:id/lock", authenticate, authorizeAdmin, lockUser);

// Mở khóa user
router.put("/users/:id/unlock", authenticate, authorizeAdmin, unlockUser);

// Bookings (admin)
router.get("/bookings", authenticate, authorizeAdmin, getAllBookings);
router.put("/bookings/:id/status", authenticate, authorizeAdmin, updateBookingStatus);
router.post("/bookings/:id/payment", authenticate, authorizeAdmin, processBookingPayment);
router.get("/bookings/stats", authenticate, authorizeAdmin, getBookingStats);

module.exports = router;