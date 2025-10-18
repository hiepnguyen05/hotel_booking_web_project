const Booking = require("../models/booking.model");
const Room = require("../models/room.model");
const MoMoService = require("./momo.service");
const EmailService = require("./email.service");
const User = require("../models/user.model");

class BookingService {
    async createBooking(userId, bookingData) {
        const {
            roomId,
            checkInDate,
            checkOutDate,
            adultCount,
            childCount,
            roomCount,
            fullName,
            email,
            phone,
            notes,
            paymentMethod,
        } = bookingData;

        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error("Room not found");
        }

        // Ensure dates are Date objects and handle timezone properly
        let checkIn, checkOut;

        // If dates are strings without time components, treat them as date-only (no timezone conversion)
        if (typeof checkInDate === 'string' && checkInDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-07' - parse as date in local timezone
            const [year, month, day] = checkInDate.split('-').map(Number);
            checkIn = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkIn = new Date(checkInDate);
        }

        if (typeof checkOutDate === 'string' && checkOutDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-08' - parse as date in local timezone
            const [year, month, day] = checkOutDate.split('-').map(Number);
            checkOut = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkOut = new Date(checkOutDate);
        }

        const msPerDay = 1000 * 60 * 60 * 24;
        const nights = Math.ceil((checkOut - checkIn) / msPerDay);
        if (!Number.isFinite(nights) || nights < 1) {
            throw new Error("Invalid date range");
        }

        // Kiểm tra chồng lấn lịch và tồn kho
        const conflicts = await this.checkAvailability(room._id, checkIn, checkOut);
        if (conflicts.length > 0) {
            throw new Error("Selected dates are not available for this room");
        }

        const totalPrice = room.price * roomCount * nights;
        const bookingCode = `BK${Date.now()}${Math.floor(Math.random() * 10000)
            .toString()
            .padStart(4, "0")}`;

        const booking = new Booking({
            user: userId,
            room: room._id,
            checkInDate: checkIn,
            checkOutDate: checkOut,
            adultCount,
            childCount,
            roomCount,
            totalPrice,
            fullName,
            email,
            phone,
            notes,
            paymentMethod, // Luôn là "online"
            bookingCode,
            status: "pending",
            paymentStatus: "pending", // Luôn là "pending" cho thanh toán trực tuyến
        });

        const savedBooking = await booking.save();
        return savedBooking;
    }

    async checkAvailability(roomId, checkInDate, checkOutDate) {
        // Ensure dates are Date objects and handle timezone properly
        let checkIn, checkOut;

        // If dates are strings without time components, treat them as date-only (no timezone conversion)
        if (typeof checkInDate === 'string' && checkInDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-07' - parse as date in local timezone
            const [year, month, day] = checkInDate.split('-').map(Number);
            checkIn = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkIn = new Date(checkInDate);
        }

        if (typeof checkOutDate === 'string' && checkOutDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-08' - parse as date in local timezone
            const [year, month, day] = checkOutDate.split('-').map(Number);
            checkOut = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkOut = new Date(checkOutDate);
        }

        // Tìm các đặt phòng chồng chéo với khoảng thời gian
        const result = await Booking.find({
            room: roomId,
            status: { $in: ["pending", "confirmed"] },
            $and: [
                { checkInDate: { $lt: checkOut } },
                { checkOutDate: { $gt: checkIn } }
            ]
        });

        return result;
    }

    async checkAvailabilityForRooms(checkInDate, checkOutDate) {
        // Ensure dates are Date objects and handle timezone properly
        let checkIn, checkOut;

        // If dates are strings without time components, treat them as date-only (no timezone conversion)
        if (typeof checkInDate === 'string' && checkInDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-07' - parse as date in local timezone
            const [year, month, day] = checkInDate.split('-').map(Number);
            checkIn = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkIn = new Date(checkInDate);
        }

        if (typeof checkOutDate === 'string' && checkOutDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-08' - parse as date in local timezone
            const [year, month, day] = checkOutDate.split('-').map(Number);
            checkOut = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkOut = new Date(checkOutDate);
        }

        // Tìm các phòng đã đặt trong khoảng thời gian
        const bookings = await Booking.find({
            status: { $in: ["pending", "confirmed"] },
            $and: [
                { checkInDate: { $lt: checkOut } },
                { checkOutDate: { $gt: checkIn } }
            ]
        }).distinct("room");

        return bookings.map((id) => id.toString());
    }

    async getUserBookings(userId) {
        return await Booking.find({ user: userId })
            .populate("room")
            .sort({ createdAt: -1 });
    }

    async cancelBooking(bookingId, userId) {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.user.toString() !== userId.toString()) {
            throw new Error("Unauthorized to cancel this booking");
        }
        if (booking.status === "cancelled") {
            return booking; // idempotent
        }
        const now = new Date();
        if (now >= booking.checkInDate) {
            throw new Error("Cannot cancel after check-in date");
        }
        booking.status = "cancelled";
        // If online and paid, downstream flow should handle refund later
        await booking.save();

        return booking;
    }

    /**
     * Update booking
     * @param {string} bookingId - Booking ID
     * @param {string} userId - User ID
     * @param {Object} data - Booking data to update
     * @returns {Promise<Object>} Updated booking
     */
    async updateBooking(bookingId, userId, data) {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error("Booking not found");
        }
        if (booking.user.toString() !== userId.toString()) {
            throw new Error("Unauthorized to update this booking");
        }
        if (booking.status !== "pending") {
            throw new Error("Only pending bookings can be updated");
        }

        const next = { ...data };
        if (next.checkInDate || next.checkOutDate) {
            const newCheckIn = new Date(next.checkInDate || booking.checkInDate);
            const newCheckOut = new Date(next.checkOutDate || booking.checkOutDate);

            const msPerDay = 1000 * 60 * 60 * 24;
            const nights = Math.ceil((newCheckOut - newCheckIn) / msPerDay);
            if (!Number.isFinite(nights) || nights < 1) {
                throw new Error("Invalid date range");
            }
            // Check overlap against other bookings for the same room
            const conflicts = await Booking.find({
                _id: { $ne: booking._id },
                room: booking.room,
                status: { $in: ["pending", "confirmed"] },
                checkInDate: { $lte: newCheckOut },
                checkOutDate: { $gte: newCheckIn },
            });
            if (conflicts.length > 0) {
                throw new Error("Selected dates are not available for this room");
            }
            booking.checkInDate = newCheckIn;
            booking.checkOutDate = newCheckOut;
            // recompute price if roomCount provided or dates changed
            const roomCount = Number.isFinite(next.roomCount) ? next.roomCount : booking.roomCount;
            booking.roomCount = roomCount;
            // Need room price
            const room = await Room.findById(booking.room);
            const totalPrice = room.price * roomCount * nights;
            booking.totalPrice = totalPrice;
        }

        if (typeof next.adultCount !== "undefined") booking.adultCount = next.adultCount;
        if (typeof next.childCount !== "undefined") booking.childCount = next.childCount;
        if (typeof next.fullName !== "undefined") booking.fullName = next.fullName;
        if (typeof next.email !== "undefined") booking.email = next.email;
        if (typeof next.phone !== "undefined") booking.phone = next.phone;
        if (typeof next.notes !== "undefined") booking.notes = next.notes;

        await booking.save();
        return booking;
    }

    /**
     * Mark booking as completed (checked out)
     * @param {string} bookingId - Booking ID
     * @param {string} userId - User ID (admin)
     * @returns {Promise<Object>} Updated booking
     */
    async completeBooking(bookingId, userId) {
        try {
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }

            // Only admin or the booking owner can mark as completed
            if (booking.user.toString() !== userId.toString()) {
                throw new Error("Unauthorized to complete this booking");
            }

            // Only confirmed bookings can be marked as completed
            if (booking.status !== "confirmed") {
                throw new Error("Only confirmed bookings can be marked as completed");
            }

            // Update status to completed
            booking.status = "completed";
            await booking.save();

            return booking;
        } catch (error) {
            console.error("Complete booking error:", error);
            throw error;
        }
    }

    /**
     * Get completed bookings for a user
     * @param {string} userId - User ID
     * @returns {Promise<Array>} Completed bookings
     */
    async getCompletedBookings(userId) {
        try {
            const bookings = await Booking.find({
                user: userId,
                status: "completed"
            })
                .populate("room")
                .sort({ createdAt: -1 });

            return bookings;
        } catch (error) {
            console.error("Get completed bookings error:", error);
            throw error;
        }
    }

    async processPayment(bookingId, paymentMethod) {
        try {
            const booking = await Booking.findById(bookingId);
            if (!booking) {
                throw new Error("Booking not found");
            }

            // Cập nhật trạng thái thanh toán
            booking.paymentStatus = 'paid';

            // Nếu là thanh toán trực tuyến và booking đang ở trạng thái pending, 
            // thì có thể tự động xác nhận
            if (paymentMethod === 'online' && booking.status === 'pending') {
                booking.status = 'confirmed';
            }

            await booking.save();

            return {
                success: true,
                transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`
            };
        } catch (error) {
            console.error("Process payment error:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create MoMo payment for booking
     * @param {string} bookingId - Booking ID
     * @param {string} returnUrl - URL to redirect after payment (using ngrok for user redirect)
     * @param {string} notifyUrl - URL for server notification (using ngrok for MoMo callback)
     * @param {Object} req - Express request object for ngrok detection
     * @returns {Promise<Object>} Payment response with QR code and payment URL
     */
    async createMoMoPayment(bookingId, returnUrl, notifyUrl, req = null) {
        try {
            console.log('[BOOKING SERVICE] === CREATE MOMO PAYMENT START ===');
            console.log('[BOOKING SERVICE] Input parameters:');
            console.log('[BOOKING SERVICE]   bookingId:', bookingId);
            console.log('[BOOKING SERVICE]   returnUrl:', returnUrl);
            console.log('[BOOKING SERVICE]   notifyUrl:', notifyUrl);
            console.log('[BOOKING SERVICE]   req:', req ? 'Provided' : 'Not provided');

            console.log('[BOOKING SERVICE] Finding booking by ID:', bookingId);
            const booking = await Booking.findById(bookingId).populate('room');
            console.log('[BOOKING SERVICE] Booking found:', booking ? 'Yes' : 'No');

            if (!booking) {
                console.log('[BOOKING SERVICE] Booking not found for ID:', bookingId);
                throw new Error("Booking not found");
            }

            console.log('[BOOKING SERVICE] Booking details:', {
                id: booking._id,
                code: booking.bookingCode,
                room: booking.room ? booking.room.name : 'No room',
                totalPrice: booking.totalPrice
            });

            // Create order info
            const orderInfo = `Thanh toán đặt phòng ${booking.bookingCode} - ${booking.room.name}`;
            console.log('[BOOKING SERVICE] Order info:', orderInfo);

            // Use NGROK URL from environment variables for backend callback
            const NGROK_URL = process.env.NGROK_URL || 'https://braylen-noisiest-biennially.ngrok-free.dev';
            console.log('[BOOKING SERVICE] NGROK_URL from env:', NGROK_URL);

            // For notifyUrl (ipnUrl) - MoMo will send POST request to this URL
            const finalNotifyUrl = `${NGROK_URL}/api/bookings/momo/callback`;

            // For returnUrl (redirectUrl) - MoMo will redirect user to this URL after payment
            let finalReturnUrl = returnUrl;

            // If returnUrl is not provided, use https://hotel-booking-web-project.onrender.com
            if (!returnUrl) {
                finalReturnUrl = `${process.env.FRONTEND_URL || 'https://hotel-booking-web-project.onrender.com'}/payment-result`;
            }

            console.log('[BOOKING SERVICE] Final URLs:');
            console.log('[BOOKING SERVICE]   notifyUrl (ipnUrl):', finalNotifyUrl);
            console.log('[BOOKING SERVICE]   returnUrl (redirectUrl):', finalReturnUrl);

            // Create payment with URLs
            console.log('[BOOKING SERVICE] Calling MoMoService.createPayment with:', {
                orderInfo,
                bookingId,
                totalPrice: booking.totalPrice,
                finalReturnUrl,
                finalNotifyUrl
            });

            const paymentResult = await MoMoService.createPayment(
                orderInfo,
                bookingId,         // orderId - using bookingId as base for unique orderId
                booking.totalPrice,
                finalReturnUrl,    // redirectUrl - where MoMo redirects user after payment
                finalNotifyUrl     // ipnUrl - where MoMo sends payment result
            );

            console.log('[BOOKING SERVICE] MoMo payment result:', JSON.stringify(paymentResult, null, 2));
            
            // Check if payment creation was successful
            if (!paymentResult.success) {
                console.error('[BOOKING SERVICE] Failed to create MoMo payment:', paymentResult.error);
                return paymentResult;
            }
            
            // Save the unique orderId and returnUrl to the booking for later use in callback
            booking.momoOrderId = paymentResult.data.orderId;
            booking.momoRequestId = paymentResult.data.requestId;
            booking.momoReturnUrl = finalReturnUrl;
            await booking.save();
            console.log('[BOOKING SERVICE] Saved MoMo payment info to booking');
            
            console.log('[BOOKING SERVICE] === CREATE MOMO PAYMENT SUCCESS ===');
            return paymentResult;
        } catch (error) {
            console.error("[BOOKING SERVICE] === CREATE MOMO PAYMENT ERROR ===");
            console.error("[BOOKING SERVICE] Create MoMo payment error:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Handle MoMo payment callback
     * @param {Object} callbackData - Data received from MoMo callback
     * @returns {Promise<Object>} Verification result
     */
    async handleMoMoCallback(callbackData) {
        try {
            console.log("=== MOMO CALLBACK SERVICE ===");
            console.log("[SERVICE] Callback data received:", JSON.stringify(callbackData, null, 2));

            // Verify callback signature
            const verificationResult = MoMoService.verifyCallback(callbackData);
            console.log("[SERVICE] Verification result:", JSON.stringify(verificationResult, null, 2));

            if (!verificationResult.isValid) {
                console.error("[SERVICE] Invalid MoMo callback signature");
                return { success: false, error: "Invalid MoMo callback signature" };
            }

            const { orderId, requestId, resultCode, transId } = verificationResult.data;
            console.log(`[SERVICE] Processing callback for orderId: ${orderId}, requestId: ${requestId}, resultCode: ${resultCode}`);

            // Special handling for result code 1006
            if (resultCode === 1006) {
                console.log("[SERVICE] Result code 1006: User denied payment confirmation");
                console.log("[SERVICE] This is not a system error, but user action");
            }

            // Find booking by momoOrderId or by the original booking ID (orderId might contain timestamp)
            // First try to find by momoOrderId
            let booking = await Booking.findOne({ momoOrderId: orderId });
            
            // If not found, try to find by extracting the original booking ID from orderId
            if (!booking) {
                // Extract original booking ID (before the timestamp)
                const originalBookingId = orderId.split('_')[0];
                console.log(`[SERVICE] Trying to find booking by original ID: ${originalBookingId}`);
                booking = await Booking.findById(originalBookingId).populate('room').populate('user');
            }
            
            console.log("[SERVICE] Found booking:", booking ? JSON.stringify(booking, null, 2) : "null");

            if (!booking) {
                console.error("[SERVICE] Booking not found for orderId:", orderId);
                return { success: false, error: "Booking not found" };
            }

            // Update booking status based on payment result
            if (resultCode === 0) {
                console.log("[SERVICE] Payment successful, updating booking status");
                // Payment successful
                booking.paymentStatus = 'paid';
                booking.status = 'confirmed';
                // Save MoMo transaction ID
                booking.momoTransactionId = transId;
                console.log("[SERVICE] Updated booking status to paid and confirmed");

                // Gửi email xác nhận đặt phòng
                if (booking.room) {
                    console.log("[SERVICE] Sending booking confirmation email to:", booking.email);
                    const emailResult = await EmailService.sendBookingConfirmation(booking, booking.room, booking.user);
                    console.log("[SERVICE] Email result:", JSON.stringify(emailResult, null, 2));

                    if (!emailResult.success) {
                        console.error('[SERVICE] Failed to send booking confirmation email:', emailResult.error);
                    } else {
                        console.log('[SERVICE] Booking confirmation email sent successfully');
                    }
                }
            } else if (resultCode === 1006) {
                console.log("[SERVICE] User denied payment, updating booking status");
                // User denied payment
                booking.paymentStatus = 'failed';
                console.log("[SERVICE] Updated booking status to failed due to user denial");
            } else {
                console.log("[SERVICE] Payment failed, updating booking status");
                // Payment failed
                booking.paymentStatus = 'failed';
                console.log("[SERVICE] Updated booking status to failed");
            }

            await booking.save();
            console.log("[SERVICE] Booking updated successfully:", {
                bookingId: booking._id,
                paymentStatus: booking.paymentStatus,
                bookingStatus: booking.status
            });

            return {
                success: true,
                data: {
                  bookingId: booking._id,
                  paymentStatus: booking.paymentStatus,
                  bookingStatus: booking.status
                }
            };
        } catch (error) {
            console.error("[SERVICE] Handle MoMo callback error:", error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get booking by ID
     * @param {string} bookingId - Booking ID
     * @returns {Promise<Object>} Booking object
     */
    async getBookingById(bookingId) {
        try {
            const booking = await Booking.findById(bookingId).populate('room').populate('user');
            return booking;
        } catch (error) {
            console.error("Get booking by ID error:", error);
            throw error;
        }
    }

    /**
     * Update booking
     * @param {string} bookingId - Booking ID
     * @param {string} userId - User ID
     * @param {Object} data - Booking data to update
     * @returns {Promise<Object>} Updated booking
     */
}

// Function to get local IP address that can be accessed from other devices
function getLocalIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();

    console.log('[NETWORK] Detecting network interfaces...');

    // Try to find a suitable IP address
    for (const name of Object.keys(interfaces)) {
        console.log(`[NETWORK] Checking interface: ${name}`);
        for (const iface of interfaces[name]) {
            console.log(`[NETWORK] Interface details:`, iface);
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
                console.log(`[NETWORK] Using local IP for network access: ${iface.address}`);
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
                console.log(`[NETWORK] Using 192.168.x.x IP for network access: ${iface.address}`);
                return iface.address;
            }
        }
    }

    // Fallback to localhost if no suitable IP found
    console.log('[NETWORK] No suitable local IP found, using localhost');
    return 'localhost';
}

// Function to detect if we're using ngrok based on request headers
function isUsingNgrok(req) {
    // Check if request is coming through ngrok
    const host = req.get('host') || '';
    const forwardedHost = req.get('x-forwarded-host') || '';

    console.log('[NGROK] Checking if using ngrok:');
    console.log('[NGROK] Host:', host);
    console.log('[NGROK] Forwarded host:', forwardedHost);

    // Check if host contains ngrok domains
    const isNgrokHost = host.includes('.ngrok.io') ||
        host.includes('.ngrok.app') ||
        host.includes('.ngrok-free.dev') ||
        forwardedHost.includes('.ngrok.io') ||
        forwardedHost.includes('.ngrok.app') ||
        forwardedHost.includes('.ngrok-free.dev');

    console.log('[NGROK] Is ngrok host:', isNgrokHost);
    return isNgrokHost;
}

// Function to get ngrok URL from request
function getNgrokUrl(req) {
    const host = req.get('host') || '';
    const forwardedHost = req.get('x-forwarded-host') || '';
    const protocol = req.get('x-forwarded-proto') || 'https';

    console.log('[NGROK] Getting ngrok URL:');
    console.log('[NGROK] Host:', host);
    console.log('[NGROK] Forwarded host:', forwardedHost);
    console.log('[NGROK] Protocol:', protocol);

    // Prefer forwarded host if available (more reliable with ngrok)
    const ngrokHost = forwardedHost || host;

    if (ngrokHost) {
        const ngrokUrl = `${protocol}://${ngrokHost}`;
        console.log('[NGROK] Constructed ngrok URL:', ngrokUrl);
        return ngrokUrl;
    }

    return null;
}

// Create instance of BookingService
const bookingService = new BookingService();

// Export the service instance
module.exports = bookingService;

// Export the utility functions for testing
module.exports.getLocalIP = getLocalIP;
module.exports.isUsingNgrok = isUsingNgrok;
module.exports.getNgrokUrl = getNgrokUrl;