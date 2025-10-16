const jwt = require("jsonwebtoken");
const config = require("../../config");
const User = require("../models/user.model");

// Middleware xác thực token
const authenticate = async (req, res, next) => {
    console.log('[AUTH MIDDLEWARE] authenticate called');
    console.log('[AUTH MIDDLEWARE] Request headers:', req.headers);
    
    const authHeader = req.headers["authorization"];
    console.log('[AUTH MIDDLEWARE] Authorization header:', authHeader);
    
    const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>
    console.log('[AUTH MIDDLEWARE] Extracted token:', token);
    
    if (!token) {
        console.log('[AUTH MIDDLEWARE] No token provided');
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        // Giải mã token
        console.log('[AUTH MIDDLEWARE] Verifying token with secret:', config.JWT_SECRET);
        const decoded = jwt.verify(token, config.JWT_SECRET);
        console.log('[AUTH MIDDLEWARE] Decoded token:', decoded);
        
        // Lấy user từ DB (bỏ password)
        req.user = await User.findById(decoded.id).select("-password");
        console.log('[AUTH MIDDLEWARE] User found:', req.user ? 'Yes' : 'No');
        
        if (!req.user) {
            console.log('[AUTH MIDDLEWARE] User not found in database');
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        console.log('[AUTH MIDDLEWARE] Authentication successful, proceeding to next middleware');
        next();
    } catch (err) {
        console.error('[AUTH MIDDLEWARE] Token verification error:', err);
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