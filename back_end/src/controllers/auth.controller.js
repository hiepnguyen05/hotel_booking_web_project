 const User = require("../models/user.model");
 const bcrypt = require("bcryptjs");
 const jwt = require("jsonwebtoken");
 const config = require("../../config");

// Đăng ký tài khoản
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // 2. Kiểm tra username hoặc email đã tồn tại
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        // 3. Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Tạo user mới
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: "user", // mặc định user
            isLocked: false // mặc định chưa bị khóa
        });

        await newUser.save();

        return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Đăng nhập
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Kiểm tra dữ liệu đầu vào
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Tìm user trong DB
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Check nếu tài khoản bị khóa
        if (user.isLocked) {
            return res.status(403).json({ message: "Your account has been locked. Please contact admin." });
        }

        // 4. Kiểm tra mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

 // 5. Tạo JWT token (access + refresh)
 const accessToken = jwt.sign(
     { 
         id: user._id, 
         username: user.username,
         email: user.email,
         role: user.role 
     },
     config.JWT_SECRET,
     { expiresIn: "15m" }
 );

 const refreshToken = jwt.sign(
     { id: user._id },
     config.JWT_SECRET,
     { expiresIn: "7d" }
 );

 user.refreshToken = refreshToken;
 await user.save();

 // 6. Trả về response
 return res.json({
     message: "Login successful",
     accessToken,
     refreshToken,
     user: {
         id: user._id,
         username: user.username,
         email: user.email,
         role: user.role,
         isLocked: user.isLocked
     }
 });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Refresh token
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Missing refreshToken" });
        }

        const payload = jwt.verify(refreshToken, config.JWT_SECRET);

        const user = await User.findById(payload.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        if (user.isLocked) {
            return res.status(403).json({ message: "Your account has been locked. Please contact admin." });
        }

        const accessToken = jwt.sign(
            { 
                id: user._id, 
                username: user.username,
                email: user.email,
                role: user.role 
            },
            config.JWT_SECRET,
            { expiresIn: "15m" }
        );

        return res.json({ accessToken });
    } catch (error) {
        console.error("Refresh error:", error);
        return res.status(401).json({ message: "Invalid or expired refresh token" });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Missing refreshToken" });
        }
        let user = null;
        try {
            const payload = jwt.verify(refreshToken, config.JWT_SECRET);
            user = await User.findById(payload.id);
        } catch (e) {
            // even if invalid, we proceed to respond ok (stateless logout)
        }
        if (user && user.refreshToken === refreshToken) {
            user.refreshToken = null;
            await user.save();
        }
        return res.json({ message: "Logged out" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
