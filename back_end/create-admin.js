const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const config = require("./config");

// User model
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isLocked: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

async function createAdminUser() {
    try {
        // Connect to database
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to database");

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ role: "admin" });
        if (existingAdmin) {
            console.log("Admin user already exists:");
            console.log("Username:", existingAdmin.username);
            console.log("Email:", existingAdmin.email);
            
            // Update the admin user with a known password for testing
            const testPassword = await bcrypt.hash("admin123", 10);
            await User.updateOne({ _id: existingAdmin._id }, { password: testPassword });
            console.log("Admin password updated to: admin123");
        } else {
            // Create admin user
            const adminPassword = await bcrypt.hash("admin123", 10);
            const adminUser = new User({
                username: "admin",
                email: "admin@example.com",
                password: adminPassword,
                role: "admin",
                isLocked: false
            });

            await adminUser.save();
            console.log("Admin user created successfully!");
            console.log("Email: admin@example.com");
            console.log("Password: admin123");
        }

        // Create a test user with known password for development
        const existingTestUser = await User.findOne({ email: "test@example.com" });
        if (!existingTestUser) {
            const testPassword = await bcrypt.hash("test123", 10);
            const testUser = new User({
                username: "testuser",
                email: "test@example.com",
                password: testPassword,
                role: "admin", // Make it admin for testing
                isLocked: false
            });

            await testUser.save();
            console.log("\nTest admin user created successfully!");
            console.log("Email: test@example.com");
            console.log("Password: test123");
        } else {
            console.log("\nTest user already exists:");
            console.log("Username:", existingTestUser.username);
            console.log("Email:", existingTestUser.email);
            
            // Update the test user with a known password for testing
            const testPassword = await bcrypt.hash("test123", 10);
            await User.updateOne({ _id: existingTestUser._id }, { password: testPassword });
            console.log("Test user password updated to: test123");
        }
    } catch (error) {
        console.error("Error creating/updating admin user:", error);
    } finally {
        await mongoose.connection.close();
    }
}

createAdminUser();