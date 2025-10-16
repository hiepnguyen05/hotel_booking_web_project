const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/booking.controller");
const CancellationRequestController = require("../controllers/cancellationRequest.controller");
const TestController = require("../controllers/test.controller");
const AuthMiddleware = require("../middlewares/auth.middleware");
const { validateBooking } = require("../validations/booking.validation");
const { updateBooking: updateBookingValidation } = require("../validations/booking.validation");

console.log("AuthMiddleware.authenticate:", typeof AuthMiddleware.authenticate);
console.log("validateBooking:", typeof validateBooking);
console.log("BookingController.createBooking:", typeof BookingController.createBooking);

// Network IP route - MUST be defined before parameterized routes
router.get("/network-ip", (req, res) => {
  console.log("[ROUTE DEBUG] Matched /network-ip route");
  const os = require('os');
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
        return res.json({
          ip: iface.address,
          ngrokBackendUrl: process.env.NGROK_BACKEND_URL || null,
          ngrokFrontendUrl: process.env.NGROK_FRONTEND_URL || null
        });
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
        return res.json({
          ip: iface.address,
          ngrokBackendUrl: process.env.NGROK_BACKEND_URL || null,
          ngrokFrontendUrl: process.env.NGROK_FRONTEND_URL || null
        });
      }
    }
  }

  // Fallback to localhost if no suitable IP found
  return res.json({
    ip: 'localhost',
    ngrokBackendUrl: process.env.NGROK_BACKEND_URL || null,
    ngrokFrontendUrl: process.env.NGROK_FRONTEND_URL || null
  });
});

// Static routes for user bookings - MUST be defined before parameterized routes
router.get("/user", AuthMiddleware.authenticate, BookingController.getUserBookings);

// Simple test route
router.get("/test", (req, res) => {
  console.log("[ROUTE DEBUG] Matched /test route");
  res.json({ message: "Test route working", timestamp: new Date().toISOString() });
});

// Test callback route - simple test without redirect
router.post("/test-callback", async (req, res) => {
  try {
    console.log("=== Test Callback Received ===");
    console.log("Request headers:", JSON.stringify(req.headers, null, 2));
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Request URL:", req.originalUrl);
    console.log("Request method:", req.method);

    // Just return a simple success response
    return res.status(200).json({
      status: 200,
      message: "Test callback received successfully",
      data: req.body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test callback error:", error);
    return res.status(200).json({ status: 500, message: error.message, data: null });
  }
});

// Test route for MoMo redirect
router.get("/test-momo-redirect/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    const returnUrl = `${req.protocol}://${req.get('host')}/api/bookings/test`;

    // Create MoMo payment
    const result = await require("../services/booking.service").createMoMoPayment(
      bookingId,
      returnUrl,
      null,
      req
    );

    if (result.success) {
      // Redirect to MoMo payment page
      console.log('[TEST] Redirecting to MoMo payment page:', result.data.payUrl);
      return res.redirect(result.data.payUrl);
    } else {
      return res.status(400).json({
        status: 400,
        message: "Failed to create MoMo payment",
        error: result.error
      });
    }
  } catch (error) {
    console.error("Test MoMo redirect error:", error);
    return res.status(400).json({ status: 400, message: error.message });
  }
});

// Test route
router.get("/test-email", TestController.sendTestEmail);

// Parameterized routes - MUST be defined after static routes
// IMPORTANT: More specific routes should be defined BEFORE less specific ones
// MoMo payment routes (more specific)
router.post("/:bookingId/momo-payment", AuthMiddleware.authenticate, BookingController.createMoMoPayment);

// Other parameterized routes (less specific)
router.post("/", AuthMiddleware.authenticate, validateBooking, BookingController.createBooking);
router.get("/", AuthMiddleware.authenticate, BookingController.getUserBookings);
router.get("/:bookingId", (req, res, next) => {
  console.log(`[ROUTE DEBUG] Matched /:bookingId route with bookingId: ${req.params.bookingId}`);
  // Check if bookingId is "network-ip" or "test" - these should not be processed as booking IDs
  if (req.params.bookingId === "network-ip" || req.params.bookingId === "test") {
    console.log(`[ROUTE DEBUG] Invalid bookingId detected: ${req.params.bookingId}, passing to next route handler`);
    return next();
  }
  // Pass to the actual booking controller
  return BookingController.getBookingById(req, res, next);
}); // Remove auth middleware
router.put("/:bookingId/cancel", AuthMiddleware.authenticate, BookingController.cancelBooking);
router.put("/:bookingId", AuthMiddleware.authenticate, validateBooking, BookingController.updateBooking);
router.post("/:bookingId/payment", AuthMiddleware.authenticate, BookingController.processPayment);

// Cancellation request routes
router.post("/cancellation-requests", AuthMiddleware.authenticate, CancellationRequestController.createCancellationRequest);

// MoMo callback route (static route)
router.post("/momo/callback", BookingController.handleMoMoCallback); // Remove auth middleware for callback

// Test route to verify ngrok URL
router.get("/test-ngrok", (req, res) => {
  const ngrokUrl = process.env.NGROK_URL || 'https://braylen-noisiest-biennially.ngrok-free.dev';

  res.json({
    ngrokUrl: ngrokUrl,
    callbackUrl: `${ngrokUrl}/api/bookings/momo/callback`,
    redirectUrl: `http://localhost:3000/payment-result`
  });
});

// Simple test route for MoMo payment

// Routes for user
router.get("/:id", AuthMiddleware.authenticate, BookingController.getBookingById);
router.put("/:id", AuthMiddleware.authenticate, updateBookingValidation, BookingController.updateBooking);
router.delete("/:id", AuthMiddleware.authenticate, BookingController.cancelBooking);
router.post("/:id/complete", AuthMiddleware.authenticate, BookingController.completeBooking);

// Routes for admin

module.exports = router;