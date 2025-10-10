const EmailService = require("../services/email.service");

class TestController {
    async sendTestEmail(req, res) {
        try {
            // Dữ liệu test
            const testBooking = {
                bookingCode: 'BK123456',
                createdAt: new Date(),
                checkInDate: new Date(),
                checkOutDate: new Date(Date.now() + 86400000 * 2), // 2 ngày sau
                adultCount: 2,
                childCount: 1,
                roomCount: 1,
                totalPrice: 2000000,
                status: 'confirmed',
                paymentStatus: 'paid'
            };

            const testRoom = {
                name: 'Phòng Deluxe Biển'
            };

            const testUser = {
                username: 'Nguyen Van A',
                email: 'khachsanpython@gmail.com' // Gửi email test đến chính email của khách sạn
            };

            // Gửi email test
            const result = await EmailService.sendBookingConfirmation(testBooking, testRoom, testUser);
            
            if (result.success) {
                return res.status(200).json({
                    message: "Test email sent successfully",
                    messageId: result.messageId
                });
            } else {
                return res.status(400).json({
                    message: "Failed to send test email",
                    error: result.error
                });
            }
        } catch (error) {
            console.error("Send test email error:", error);
            return res.status(500).json({
                message: "Server error",
                error: error.message
            });
        }
    }
}

module.exports = new TestController();