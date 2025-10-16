const BookingService = require("../services/booking.service");
const { formatResponse } = require("../utils/formatResponse");

class BookingController {
  async createBooking(req, res) {
    try {
      const userId = req.user._id;
      const booking = await BookingService.createBooking(userId, req.body);
      return formatResponse(res, 201, "Booking created successfully", booking);
    } catch (error) {
      console.error("Create booking error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  async getUserBookings(req, res) {
    try {
      const userId = req.user._id;
      const bookings = await BookingService.getUserBookings(userId);
      return formatResponse(res, 200, "Bookings retrieved successfully", bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  async cancelBooking(req, res) {
    try {
      const userId = req.user._id;
      const { bookingId } = req.params;
      const booking = await BookingService.cancelBooking(bookingId, userId);
      return formatResponse(res, 200, "Booking cancelled successfully", booking);
    } catch (error) {
      console.error("Cancel booking error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  async updateBooking(req, res) {
    try {
      const userId = req.user._id;
      const { bookingId } = req.params;
      const booking = await BookingService.updateBooking(bookingId, userId, req.body);
      return formatResponse(res, 200, "Booking updated successfully", booking);
    } catch (error) {
      console.error("Update booking error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  async processPayment(req, res) {
    try {
      const { bookingId } = req.params;
      const { paymentMethod } = req.body;

      // Gọi service để xử lý thanh toán
      const result = await BookingService.processPayment(bookingId, paymentMethod);

      if (result.success) {
        return formatResponse(res, 200, "Payment processed successfully", { transactionId: result.transactionId });
      } else {
        return formatResponse(res, 400, "Payment processing failed");
      }
    } catch (error) {
      console.error("Process payment error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  /**
   * Get booking by ID
   */
  async getBookingById(req, res) {
    try {
      const { bookingId } = req.params;

      // Debug log to see what bookingId is being received
      console.log(`[DEBUG] getBookingById called with bookingId: ${bookingId}`);

      // Check if bookingId is "network-ip" or "test" - these should not be processed as booking IDs
      if (bookingId === "network-ip" || bookingId === "test") {
        console.log(`[DEBUG] Invalid bookingId detected: ${bookingId}`);
        return formatResponse(res, 400, `Invalid booking ID: ${bookingId}`);
      }

      // Get booking by ID
      const booking = await BookingService.getBookingById(bookingId);

      if (!booking) {
        return formatResponse(res, 404, "Booking not found");
      }

      // Kiểm tra quyền truy cập
      // Nếu có token, kiểm tra xem user có quyền truy cập booking này không
      // Nếu không có token, chỉ trả về thông tin cơ bản cho polling
      if (req.user) {
        // Nếu có user authenticated, kiểm tra quyền
        if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          return formatResponse(res, 403, "Unauthorized to access this booking");
        }
        // Nếu user được xác thực, trả về đầy đủ thông tin
        return formatResponse(res, 200, "Booking retrieved successfully", booking);
      } else {
        // Nếu không có user authenticated (polling từ frontend), trả về thông tin cần thiết cho hiển thị
        // nhưng vẫn đảm bảo an toàn thông tin
        const basicBookingInfo = {
          _id: booking._id,
          bookingCode: booking.bookingCode,
          user: booking.user,
          room: booking.room,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          adultCount: booking.adultCount,
          childCount: booking.childCount,
          roomCount: booking.roomCount,
          totalPrice: booking.totalPrice,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          notes: booking.notes,
          paymentMethod: booking.paymentMethod,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          momoTransactionId: booking.momoTransactionId,
          phone: booking.phone,
          email: booking.email,
          fullName: booking.fullName
        };
        return formatResponse(res, 200, "Booking retrieved successfully", basicBookingInfo);
      }
    } catch (error) {
      console.error("Get booking by ID error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  /**
   * Create MoMo payment for booking and return payUrl
   */
  async createMoMoPayment(req, res) {
    try {
      console.log('[CONTROLLER] createMoMoPayment called');
      console.log('[CONTROLLER] Request params:', req.params);
      console.log('[CONTROLLER] Request body:', req.body);
      console.log('[CONTROLLER] Request headers:', {
        authorization: req.headers.authorization,
        'content-type': req.headers['content-type']
      });
      console.log('[CONTROLLER] User from auth middleware:', req.user);

      const { bookingId } = req.params;
      const { returnUrl } = req.body;

      // Validate input
      if (!bookingId || !returnUrl) {
        console.log('[CONTROLLER] Missing required parameters:', { bookingId, returnUrl });
        return formatResponse(res, 400, "Missing required parameters");
      }

      // Check if user is authenticated
      if (!req.user) {
        console.log('[CONTROLLER] User not authenticated');
        return formatResponse(res, 401, "User not authenticated");
      }

      console.log('[CONTROLLER] Creating MoMo payment for booking:', bookingId);

      // Create MoMo payment, passing the request object for ngrok detection
      const result = await BookingService.createMoMoPayment(bookingId, returnUrl, null, req);

      console.log('[CONTROLLER] MoMo payment creation result:', result);

      if (result.success) {
        // Return payUrl to frontend instead of redirecting
        console.log('[CONTROLLER] Returning MoMo payUrl to frontend:', result.data.payUrl);
        return formatResponse(res, 200, "MoMo payment created successfully", {
          payUrl: result.data.payUrl
        });
      } else {
        console.error('[CONTROLLER] Failed to create MoMo payment:', result.error);
        return formatResponse(res, 400, "Failed to create MoMo payment", { error: result.error });
      }
    } catch (error) {
      console.error("[CONTROLLER] Create MoMo payment error:", error);
      return formatResponse(res, 500, error.message);
    }
  }

  /**
   * Handle MoMo payment callback
   */
  async handleMoMoCallback(req, res) {
    try {
      console.log("=== MoMo Callback Received ===");
      console.log("Request URL:", req.originalUrl);
      console.log("Request method:", req.method);
      console.log("Request headers:", JSON.stringify(req.headers, null, 2));
      console.log("Request body:", JSON.stringify(req.body, null, 2));

      const callbackData = req.body;

      // Log specific callback data
      console.log("[CALLBACK] Processing callback data:");
      console.log("  - partnerCode:", callbackData.partnerCode);
      console.log("  - orderId:", callbackData.orderId);
      console.log("  - requestId:", callbackData.requestId);
      console.log("  - amount:", callbackData.amount);
      console.log("  - resultCode:", callbackData.resultCode);
      console.log("  - transId:", callbackData.transId);
      console.log("  - message:", callbackData.message);

      // Handle MoMo callback
      const result = await BookingService.handleMoMoCallback(callbackData);
      console.log("[CALLBACK] BookingService result:", result);

      if (!result.success) {
        console.error("[CALLBACK] BookingService failed:", result.error || result);
        // Respond with 200 so MoMo doesn't retry infinitely
        return res.status(200).json({
          status: 400,
          message: "Failed to process payment",
          data: null,
          timestamp: new Date().toISOString()
        });
      }

      // Redirect to payment result page with all MoMo parameters
      // This will allow the frontend to display the same information
      const paymentResultUrl = `http://localhost:3000/payment-result?${new URLSearchParams(callbackData).toString()}`;
      console.log("[CALLBACK] Redirecting to payment result page:", paymentResultUrl);
      return res.redirect(302, paymentResultUrl);

    } catch (error) {
      console.error("[CALLBACK] Handle MoMo callback error:", error);
      // Always return 200 to MoMo to prevent retries, but with proper JSON format
      return res.status(200).json({
        status: 500,
        message: error.message,
        data: null,
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get completed bookings for user
   */
  async getCompletedBookings(req, res) {
    try {
      const userId = req.user._id;
      const bookings = await BookingService.getCompletedBookings(userId);
      return formatResponse(res, 200, "Completed bookings retrieved successfully", bookings);
    } catch (error) {
      console.error("Get completed bookings error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  /**
   * Check booking payment status
   */
  async checkBookingPaymentStatus(req, res) {
    try {
      const { bookingId } = req.params;

      // Find booking by ID and populate necessary fields
      const booking = await BookingService.getBookingById(bookingId);

      if (!booking) {
        return formatResponse(res, 404, "Booking not found");
      }

      // Return the full booking object
      return formatResponse(res, 200, "Booking payment status retrieved successfully", booking);
    } catch (error) {
      console.error("Check booking payment status error:", error);
      return formatResponse(res, 400, error.message);
    }
  }

  /**
   * Mark booking as completed (checked out)
   */
  async completeBooking(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const booking = await BookingService.completeBooking(id, userId);
      return formatResponse(res, 200, "Booking marked as completed successfully", booking);
    } catch (error) {
      console.error("Complete booking error:", error);
      return formatResponse(res, 400, error.message);
    }
  }
}

module.exports = new BookingController();