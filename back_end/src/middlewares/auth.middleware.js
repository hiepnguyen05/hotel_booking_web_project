const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../models/user.model");

// Middleware xác thực token
const authenticate = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, config.JWT_SECRET);
        // Lấy user từ DB (bỏ password)
        req.user = await User.findById(decoded.id).select("-password");
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: "Invalid or expired token" });
    }
};

// Middleware kiểm tra quyền admin
const authorizeAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ success: false, message: "Require admin role" });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin };