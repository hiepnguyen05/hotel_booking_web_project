const CancellationRequestService = require("../services/cancellationRequest.service");
const { formatResponse } = require("../utils/formatResponse");

class CancellationRequestController {
    /**
     * Create cancellation request (user)
     */
    async createCancellationRequest(req, res) {
        try {
            const { bookingId, reason } = req.body;
            const userId = req.user._id;
            
            const cancellationRequest = await CancellationRequestService.createCancellationRequest(
                bookingId, 
                userId, 
                reason
            );
            
            return formatResponse(res, 201, "Cancellation request created successfully", cancellationRequest);
        } catch (error) {
            console.error("Create cancellation request error:", error);
            return formatResponse(res, 400, error.message);
        }
    }

    /**
     * Get all cancellation requests (admin)
     */
    async getAllCancellationRequests(req, res) {
        try {
            const cancellationRequests = await CancellationRequestService.getAllCancellationRequests();
            return formatResponse(res, 200, "Cancellation requests retrieved successfully", cancellationRequests);
        } catch (error) {
            console.error("Get cancellation requests error:", error);
            return formatResponse(res, 400, error.message);
        }
    }

    /**
     * Update cancellation request status (admin)
     */
    async updateCancellationRequestStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, adminNotes } = req.body;
            
            const cancellationRequest = await CancellationRequestService.updateCancellationRequestStatus(
                id, 
                status, 
                adminNotes
            );
            
            return formatResponse(res, 200, "Cancellation request updated successfully", cancellationRequest);
        } catch (error) {
            console.error("Update cancellation request status error:", error);
            return formatResponse(res, 400, error.message);
        }
    }

    /**
     * Process refund for cancellation request (admin)
     */
    async processRefund(req, res) {
        try {
            const { id } = req.params;
            
            const cancellationRequest = await CancellationRequestService.processRefund(id);
            
            return formatResponse(res, 200, "Refund processed successfully", cancellationRequest);
        } catch (error) {
            console.error("Process refund error:", error);
            return formatResponse(res, 400, error.message);
        }
    }
}

module.exports = new CancellationRequestController();