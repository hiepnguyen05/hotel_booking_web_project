const express = require("express");
const mongoose = require("mongoose");
const config = require("./config");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const os = require("os");

const app = express();

// Function to get local IP address that can be accessed from other devices
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // Try to find a suitable IP address
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and IPv6 addresses
      if (iface.internal || iface.family !== 'IPv4') {
        continue;
      }
      
      // Skip docker and virtual interfaces that start with 172.16
      if (iface.address.startsWith('172.16')) {
        continue;
      }
      
      // Skip common virtual machine interfaces
      if (iface.address.startsWith('10.') || iface.address.startsWith('192.168.56.')) {
        continue;
      }
      
      // Return the first non-internal IPv4 address that's not a docker/virtual interface
      if (!iface.internal && iface.family === 'IPv4') {
        return iface.address;
      }
    }
  }
  
  // If we didn't find a suitable IP above, try a different approach
  // Look for 192.168.x.x addresses which are common in home networks
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.internal || iface.family !== 'IPv4') {
        continue;
      }
      
      // Look for common local network patterns
      if (iface.address.startsWith('192.168.')) {
        return iface.address;
      }
    }
  }
  
  // Fallback to localhost if no suitable IP found
  return 'localhost';
}

// Enhanced middleware to log access from different devices with more details
app.use((req, res, next) => {
  const clientIP = req.headers['x-forwarded-for'] || 
                  req.connection.remoteAddress || 
                  req.socket.remoteAddress ||
                  (req.connection.socket ? req.connection.socket.remoteAddress : null);
  
  // Get user agent information
  const userAgent = req.headers['user-agent'] || 'Unknown';
  
  // Determine if it's a mobile device
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  
  // Determine device type based on user agent
  let deviceType = 'Desktop';
  if (/mobile/i.test(userAgent)) {
    deviceType = 'Mobile';
  } else if (/tablet|ipad/i.test(userAgent)) {
    deviceType = 'Tablet';
  }
  
  // Log the access with detailed information
  console.log(`[${new Date().toISOString()}] ACCESS LOG:`);
  console.log(`  IP: ${clientIP}`);
  console.log(`  Method: ${req.method}`);
  console.log(`  URL: ${req.originalUrl}`);
  console.log(`  Device Type: ${deviceType}`);
  console.log(`  User Agent: ${userAgent}`);
  console.log('----------------------------------------');
  
  // Add access info to request for potential use in routes
  req.accessInfo = {
    clientIP,
    userAgent,
    deviceType,
    timestamp: new Date().toISOString()
  };
  
  next();
});

// Add a specific middleware for MoMo payment routes to debug them
app.use("/api/bookings/:bookingId/momo-payment", (req, res, next) => {
  console.log('[MOMO DEBUG] MoMo payment route middleware triggered');
  console.log('[MOMO DEBUG] Request method:', req.method);
  console.log('[MOMO DEBUG] Request URL:', req.originalUrl);
  console.log('[MOMO DEBUG] Request params:', req.params);
  console.log('[MOMO DEBUG] Request body:', req.body);
  console.log('[MOMO DEBUG] Request headers:', {
    authorization: req.headers.authorization,
    'content-type': req.headers['content-type']
  });
  next();
});

// Update CORS configuration to allow network access
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173", // Vite default port
  "http://127.0.0.1:5173", // Vite default port
  "https://hotel-booking-web-project-539c.vercel.app", // Vercel deployment
  "https://hotel-booking-web-project.vercel.app" // Vercel deployment (if exists)
];

// Add dynamic origin handling for network access
function getCORSOptions() {
  // Get local IP
  const localIP = getLocalIP();
  
  // Add network origins
  const networkOrigins = [
    `http://${localIP}:3000`,
    `http://${localIP}:5173`
  ];
  
  // Also add the specific IP that's causing the CORS error
  const specificOrigins = [
    "http://192.168.1.119:3000"
  ];
  
  // Combine all allowed origins
  const allAllowedOrigins = [...allowedOrigins, ...networkOrigins, ...specificOrigins];
  
  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in our allowed list
      if (allAllowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Allow any origin in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[CORS] Allowing request from origin: ${origin}`);
        return callback(null, true);
      }
      
      // Block the request
      console.log(`[CORS] Blocking request from origin: ${origin}`);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200
  };
}

app.use(cors(getCORSOptions()));

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

const cancellationRequestRoutes = require("./src/routes/cancellationRequest.route");
app.use("/api/cancellation-requests", cancellationRequestRoutes);

const reviewRoutes = require("./src/routes/review.route");
app.use("/api/reviews", reviewRoutes);

// Khởi động server
const server = app.listen(config.PORT, '0.0.0.0', () => {
	const localIP = getLocalIP();
	console.log(`Server running on port ${config.PORT}`);
	console.log(`Local access: http://localhost:${config.PORT}`);
	console.log(`Network access: http://${localIP}:${config.PORT}`);
	console.log(`Access from other devices on your network using: http://${localIP}:${config.PORT}`);
	
	// Check if we might be accessed via ngrok
	console.log('\n=== NGROK INSTRUCTIONS ===');
	console.log('To use ngrok for external access:');
	console.log('1. Run "npm run ngrok" in another terminal');
	console.log('2. Use the ngrok URL for MoMo callbacks');
	console.log('========================\n');
	
	console.log('----------------------------------------');
	console.log('Access logs will appear below:');
	console.log('----------------------------------------');
});

// Export server instance for potential use in other modules
module.exports = { app, server };