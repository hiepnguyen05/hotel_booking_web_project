const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/user.repository");

class AuthService {
    async register({ username, email, password }) {
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userRepository.createUser({
            username,
            email,
            password: hashedPassword,
            role: "user", // mặc định
        });

        return { id: newUser._id, username: newUser.username, email: newUser.email };
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return { token, user: { id: user._id, username: user.username, role: user.role } };
    }
}

module.exports = new AuthService();
