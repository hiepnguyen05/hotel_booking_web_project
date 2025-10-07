const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Đăng ký
router.post("/register", authController.register);

// Đăng nhập
router.post("/login", authController.login);

// Refresh token
router.post("/refresh", authController.refresh);

// Đăng xuất
router.post("/logout", authController.logout);

module.exports = router;
