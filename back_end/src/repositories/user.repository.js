const User = require("../models/user.model");

class UserRepository {
    async createUser(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async findByEmail(email) {
        return await User.findOne({ email });
    }

    async findByUsername(username) {
        return await User.findOne({ username });
    }
}

module.exports = new UserRepository();
