const express = require("express");
const router = express.Router();
const multer = require("multer");
const RoomController = require("../controllers/room.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");

// Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/rooms/"); // Thư mục lưu ảnh
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});
const upload = multer({ storage: storage });

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
    upload.array("images", 5), // Cho phép upload tối đa 5 ảnh
    RoomController.create
);

// PUT: cập nhật phòng
router.put("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin, RoomController.update);

// DELETE: xóa phòng
router.delete("/:id", AuthMiddleware.authenticate, AuthMiddleware.authorizeAdmin, RoomController.delete);

module.exports = router;