const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/room.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

console.log("AuthMiddleware.authenticate:", typeof AuthMiddleware.authenticate);
console.log("RoomController.searchAvailableRooms:", typeof RoomController.searchAvailableRooms);

// GET: danh sách phòng
router.get("/", RoomController.getAll);

// GET: tìm kiếm phòng khả dụng (public)
router.get("/available", RoomController.searchAvailableRooms);

// GET: kiểm tra phòng cụ thể có khả dụng (public)
router.get("/:roomId/availability", RoomController.checkRoomAvailability);

// GET: chi tiết phòng (public)
router.get("/:roomId", RoomController.getRoomDetails);

// POST: thêm phòng với upload nhiều ảnh
router.post(
    "/",
    AuthMiddleware.authenticate,
    AuthMiddleware.authorizeAdmin,
    upload.array("images", 10), // Cho phép upload tối đa 10 ảnh
    RoomController.create
);

// PUT: cập nhật phòng
router.put(
    "/:id",
    AuthMiddleware.authenticate,
    AuthMiddleware.authorizeAdmin,
    upload.array("images", 10), // Cho phép upload tối đa 10 ảnh
    RoomController.update
);

// DELETE: xóa phòng
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin, RoomController.delete);

module.exports = router;