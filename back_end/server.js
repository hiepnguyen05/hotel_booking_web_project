const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");


const app = express();

const allowedOrigins = new Set([
	"http://localhost:3000",
	"http://127.0.0.1:3000",
]);

const corsOptions = {
	origin: (origin, callback) => {
		// allow non-browser clients (no origin) and allowed origins
		if (!origin || allowedOrigins.has(origin)) {
			return callback(null, true);
		}
		return callback(new Error("Not allowed by CORS"));
	},
	credentials: true,
	methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
	optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));

// Static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Kết nối MongoDB
mongoose.connect(config.MONGO_URI)
	.then(() => console.log("MongoDB connected"))
	.catch(err => console.error("MongoDB connection error:", err));

// Routes
const authRoutes = require("./src/routes/auth.route");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./src/routes/admin.route");
app.use("/api/admin", adminRoutes);

const adminRoomRoutes = require('./src/routes/adminRoom.route');
app.use('/api/admin/rooms', adminRoomRoutes);

const roomRoutes = require("./src/routes/room.route");
app.use("/api/rooms", roomRoutes);

const bookingRoutes = require("./src/routes/booking.route");
app.use("/api/bookings", bookingRoutes);

const reviewRoutes = require("./src/routes/review.route");
app.use("/api/reviews", reviewRoutes);
// Khởi động server
app.listen(config.PORT, () => {
	console.log(`Server running on port ${config.PORT}`);
});
