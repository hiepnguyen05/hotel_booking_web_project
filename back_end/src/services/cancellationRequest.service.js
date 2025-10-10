const CancellationRequest = require("../models/cancellationRequest.model");
const Booking = require("../models/booking.model");
const EmailService = require("./email.service");

class CancellationRequestService {
    /**
     * Create a new cancellation request
     * @param {string} bookingId - Booking ID
     * @param {string} userId - User ID
     * @param {string} reason - Cancellation reason
     * @returns {Promise<Object>} Cancellation request
     */
    async createCancellationRequest(bookingId, userId, reason) {
        try {
            // Check if booking exists and belongs to user
            const booking = await Booking.findOne({ _id: bookingId, user: userId });
            if (!booking) {
                throw new Error("Booking not found or unauthorized");
            }

            // Check if booking can be cancelled
            if (booking.status === "cancelled" || booking.status === "completed") {
                throw new Error("Cannot cancel this booking");
            }

            // Check if there's already a cancellation request for this booking
            const existingRequest = await CancellationRequest.findOne({ booking: bookingId });
            if (existingRequest) {
                throw new Error("Cancellation request already exists for this booking");
            }

            // Create cancellation request
            const cancellationRequest = new CancellationRequest({
                booking: bookingId,
                user: userId,
                reason: reason,
            });

            const savedRequest = await cancellationRequest.save();
            
            // Populate booking and user details
            await savedRequest.populate([
                { path: "booking", populate: [{ path: "user" }, { path: "room" }] },
                { path: "user" }
            ]);

            return savedRequest;
        } catch (error) {
            console.error("Create cancellation request error:", error);
            throw error;
        }
    }

    /**
     * Get all cancellation requests (admin)
     * @returns {Promise<Array>} List of cancellation requests
     */
    async getAllCancellationRequests() {
        try {
            const requests = await CancellationRequest.find()
                .populate([
                    { path: "booking", populate: [{ path: "user" }, { path: "room" }] },
                    { path: "user" }
                ])
                .sort({ createdAt: -1 });
            
            return requests;
        } catch (error) {
            console.error("Get cancellation requests error:", error);
            throw error;
        }
    }

    /**
     * Update cancellation request status (admin)
     * @param {string} requestId - Cancellation request ID
     * @param {string} status - New status
     * @param {string} adminNotes - Admin notes
     * @returns {Promise<Object>} Updated cancellation request
     */
    async updateCancellationRequestStatus(requestId, status, adminNotes) {
        try {
            const allowedStatuses = ["approved", "rejected"];
            if (!allowedStatuses.includes(status)) {
                throw new Error("Invalid status");
            }

            // Find cancellation request
            const cancellationRequest = await CancellationRequest.findById(requestId);
            if (!cancellationRequest) {
                throw new Error("Cancellation request not found");
            }

            // Update status and notes
            cancellationRequest.status = status;
            if (adminNotes) {
                cancellationRequest.adminNotes = adminNotes;
            }

            const updatedRequest = await cancellationRequest.save();
            
            // If approved, update booking status
            if (status === "approved") {
                const booking = await Booking.findById(cancellationRequest.booking);
                if (booking) {
                    booking.status = "cancelled";
                    await booking.save();
                    
                    // Send email notification
                    await updatedRequest.populate([
                        { path: "booking", populate: [{ path: "user" }, { path: "room" }] },
                        { path: "user" }
                    ]);
                    
                    await EmailService.sendBookingCancellationConfirmation(
                        updatedRequest.booking, 
                        updatedRequest.booking.room, 
                        updatedRequest.booking.user
                    );
                }
            } else if (status === "rejected") {
                // Send email notification for rejection
                await updatedRequest.populate([
                    { path: "booking", populate: [{ path: "user" }, { path: "room" }] },
                    { path: "user" }
                ]);
                
                await EmailService.sendBookingCancellationRejection(
                    updatedRequest.booking, 
                    updatedRequest.booking.room, 
                    updatedRequest.booking.user,
                    adminNotes
                );
            }

            // Populate details
            await updatedRequest.populate([
                { path: "booking", populate: [{ path: "user" }, { path: "room" }] },
                { path: "user" }
            ]);

            return updatedRequest;
        } catch (error) {
            console.error("Update cancellation request status error:", error);
            throw error;
        }
    }

    /**
     * Process refund for cancellation request
     * @param {string} requestId - Cancellation request ID
     * @returns {Promise<Object>} Updated cancellation request
     */
    async processRefund(requestId) {
        try {
            // Find cancellation request
            const cancellationRequest = await CancellationRequest.findById(requestId)
                .populate("booking");
                
            if (!cancellationRequest) {
                throw new Error("Cancellation request not found");
            }

            if (cancellationRequest.status !== "approved") {
                throw new Error("Cancellation request must be approved before processing refund");
            }

            // Update refund status to pending
            cancellationRequest.refundStatus = "pending";
            cancellationRequest.refundAmount = cancellationRequest.booking.totalPrice;
            
            const updatedRequest = await cancellationRequest.save();

            // In a real implementation, you would call MoMo refund API here
            // For now, we'll simulate the refund process
            try {
                // Simulate refund processing
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Update refund status to completed
                cancellationRequest.refundStatus = "completed";
                await cancellationRequest.save();
                
                // Send refund confirmation email
                await cancellationRequest.populate([
                    { path: "booking", populate: [{ path: "user" }, { path: "room" }] },
                    { path: "user" }
                ]);
                
                await EmailService.sendRefundConfirmation(
                    cancellationRequest.booking, 
                    cancellationRequest.booking.room, 
                    cancellationRequest.booking.user,
                    cancellationRequest.refundAmount
                );
            } catch (refundError) {
                // Update refund status to failed
                cancellationRequest.refundStatus = "failed";
                await cancellationRequest.save();
                throw refundError;
            }

            // Populate details
            await updatedRequest.populate([
                { path: "booking", populate: [{ path: "user" }, { path: "room" }] },
                { path: "user" }
            ]);

            return updatedRequest;
        } catch (error) {
            console.error("Process refund error:", error);
            throw error;
        }
    }
}

module.exports = new CancellationRequestService();