const express = require("express");
const router = express.Router();
const controller = require("../controllers/adminRoom.controller");
const { authenticate, authorizeAdmin } = require("../middlewares/auth.middleware");
const multer = require("multer");
const path = require("path");

// Cấu hình lưu ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/rooms");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Các route quản lý phòng
router.get("/", authenticate, authorizeAdmin, controller.list);
router.get("/:id", authenticate, authorizeAdmin, controller.get);
router.post("/", authenticate, authorizeAdmin, upload.array("images", 10), controller.create);
router.put("/:id", authenticate, authorizeAdmin, upload.array("images", 10), controller.update);
router.delete("/:id", authenticate, authorizeAdmin, controller.remove);

module.exports = router;
