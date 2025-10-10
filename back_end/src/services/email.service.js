const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Kiểm tra nếu đang trong môi trường phát triển
        if (process.env.NODE_ENV === 'development') {
            // Sử dụng Ethereal cho môi trường phát triển
            this.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.ETHEREAL_USER || 'j66lqxxpf4r3bpfw@ethereal.email',
                    pass: process.env.ETHEREAL_PASS || 't7FZDf1FQ1KqF8UyWh'
                }
            });
        } else {
            // Sử dụng Gmail cho môi trường production
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER || 'khachsanpython@gmail.com',
                    pass: process.env.EMAIL_PASS || 'Ngochiep2k5@'
                }
            });
        }
    }

    /**
     * Send email
     * @param {string} to - Recipient email address
     * @param {string} subject - Email subject
     * @param {string} html - Email HTML content
     * @returns {Promise<Object>} Email sending result
     */
    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: process.env.NODE_ENV === 'development' 
                    ? process.env.ETHEREAL_USER || 'j66lqxxpf4r3bpfw@ethereal.email'
                    : process.env.EMAIL_USER || 'khachsanpython@gmail.com',
                to: to,
                subject: subject,
                html: html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            
            // Nếu sử dụng Ethereal, in ra URL để xem email
            if (process.env.NODE_ENV === 'development') {
                console.log('Preview URL: ' + nodemailer.getTestMessageUrl(info));
            }
            
            return { success: true, messageId: info.messageId, previewUrl: nodemailer.getTestMessageUrl(info) };
        } catch (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send booking confirmation email
     * @param {Object} booking - Booking object
     * @param {Object} room - Room object
     * @param {Object} user - User object
     * @returns {Promise<Object>} Email sending result
     */
    async sendBookingConfirmation(booking, room, user) {
        try {
            console.log('=== PREPARING BOOKING CONFIRMATION EMAIL ===');
            console.log('Booking data:', {
                id: booking._id,
                code: booking.bookingCode,
                checkIn: booking.checkInDate,
                checkOut: booking.checkOutDate,
                totalPrice: booking.totalPrice,
                adultCount: booking.adultCount,
                childCount: booking.childCount
            });
            
            console.log('Room data:', {
                id: room._id,
                name: room.name,
                price: room.price
            });
            
            console.log('User data:', {
                id: user._id,
                name: user.name,
                email: user.email
            });

            // Create email content
            const emailContent = this.generateBookingConfirmationEmail(booking, room, user);
            console.log('Email content generated successfully');
            
            // Send email
            console.log('Sending email to:', user.email);
            const result = await this.sendEmail(
                user.email,
                'Xác nhận đặt phòng - NgocHiepHotel',
                emailContent
            );
            
            console.log('=== EMAIL SENT SUCCESSFULLY ===');
            console.log('Email result:', result);
            
            return { success: true, data: result };
        } catch (error) {
            console.error('=== EMAIL SENDING FAILED ===');
            console.error('Error sending booking confirmation email:', error);
            console.error('Error stack:', error.stack);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gửi email xác nhận hủy phòng
     * @param {Object} booking - Thông tin đặt phòng
     * @param {Object} room - Thông tin phòng
     * @param {Object} user - Thông tin người dùng
     */
    async sendBookingCancellationConfirmation(booking, room, user) {
        try {
            // Tạo nội dung email
            const mailOptions = {
                from: 'khachsanpython@gmail.com',
                to: user.email,
                subject: `Xác nhận hủy phòng - ${booking.bookingCode}`,
                html: this.generateBookingCancellationEmail(booking, room, user)
            };

            // Gửi email
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Cancellation email sent: ' + info.response);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending cancellation email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gửi email từ chối yêu cầu hủy phòng
     * @param {Object} booking - Thông tin đặt phòng
     * @param {Object} room - Thông tin phòng
     * @param {Object} user - Thông tin người dùng
     * @param {string} reason - Lý do từ chối
     */
    async sendBookingCancellationRejection(booking, room, user, reason) {
        try {
            // Tạo nội dung email
            const mailOptions = {
                from: 'khachsanpython@gmail.com',
                to: user.email,
                subject: `Yêu cầu hủy phòng bị từ chối - ${booking.bookingCode}`,
                html: this.generateBookingCancellationRejectionEmail(booking, room, user, reason)
            };

            // Gửi email
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Cancellation rejection email sent: ' + info.response);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending cancellation rejection email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Gửi email xác nhận hoàn tiền
     * @param {Object} booking - Thông tin đặt phòng
     * @param {Object} room - Thông tin phòng
     * @param {Object} user - Thông tin người dùng
     * @param {number} amount - Số tiền hoàn
     */
    async sendRefundConfirmation(booking, room, user, amount) {
        try {
            // Tạo nội dung email
            const mailOptions = {
                from: 'khachsanpython@gmail.com',
                to: user.email,
                subject: `Xác nhận hoàn tiền - ${booking.bookingCode}`,
                html: this.generateRefundConfirmationEmail(booking, room, user, amount)
            };

            // Gửi email
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Refund email sent: ' + info.response);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Error sending refund email:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Tạo nội dung email xác nhận đặt phòng
     * @param {Object} booking - Thông tin đặt phòng
     * @param {Object} room - Thông tin phòng
     * @param {Object} user - Thông tin người dùng
     */
    generateBookingConfirmationEmail(booking, room, user) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác nhận đặt phòng</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <h1 style="color: #007bff; margin: 0;">Khách Sạn Luxury Beach Resort</h1>
                <p style="color: #6c757d; margin: 10px 0 0;">Xác nhận đặt phòng thành công</p>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color: #28a745;">Xin chào ${user.username || user.email},</h2>
                
                <p>Cảm ơn bạn đã đặt phòng tại Luxury Beach Resort. Đơn hàng của bạn đã được xác nhận thành công.</p>
                
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #007bff;">Thông tin đặt phòng</h3>
                    <p><strong>Mã đặt phòng:</strong> ${booking.bookingCode}</p>
                    <p><strong>Ngày đặt:</strong> ${new Date(booking.createdAt).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Trạng thái thanh toán:</strong> <span style="color: #28a745; font-weight: bold;">Đã thanh toán</span></p>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h3 style="margin-top: 0; color: #856404;">Chi tiết lưu trú</h3>
                    <p><strong>Phòng:</strong> ${room.name}</p>
                    <p><strong>Ngày nhận phòng:</strong> ${new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Ngày trả phòng:</strong> ${new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Số đêm:</strong> ${Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} đêm</p>
                    <p><strong>Số lượng khách:</strong> ${booking.adultCount} người lớn, ${booking.childCount} trẻ em</p>
                    <p><strong>Số phòng:</strong> ${booking.roomCount}</p>
                </div>
                
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="margin-top: 0; color: #155724;">Thanh toán</h3>
                    <p><strong>Tổng tiền:</strong> ${booking.totalPrice.toLocaleString('vi-VN')}₫</p>
                    <p><strong>Phương thức thanh toán:</strong> Thanh toán trực tuyến (MoMo)</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
                    <p><strong>Email:</strong> khachsanpython@gmail.com</p>
                    <p><strong>Điện thoại:</strong> 0123 456 789</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
                    <p style="margin: 0;">© 2025 Luxury Beach Resort. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Tạo nội dung email xác nhận hủy phòng
     * @param {Object} booking - Thông tin đặt phòng
     * @param {Object} room - Thông tin phòng
     * @param {Object} user - Thông tin người dùng
     */
    generateBookingCancellationEmail(booking, room, user) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác nhận hủy phòng</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <h1 style="color: #dc3545; margin: 0;">Khách Sạn Luxury Beach Resort</h1>
                <p style="color: #6c757d; margin: 10px 0 0;">Xác nhận hủy phòng</p>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color: #dc3545;">Xin chào ${user.username || user.email},</h2>
                
                <p>Yêu cầu hủy phòng của bạn đã được xác nhận. Đơn hàng #${booking.bookingCode} đã được hủy thành công.</p>
                
                <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <h3 style="margin-top: 0; color: #dc3545;">Thông tin hủy phòng</h3>
                    <p><strong>Mã đặt phòng:</strong> ${booking.bookingCode}</p>
                    <p><strong>Ngày hủy:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
                    <p><strong>Trạng thái:</strong> <span style="color: #dc3545; font-weight: bold;">Đã hủy</span></p>
                </div>
                
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #007bff;">Chi tiết đặt phòng đã hủy</h3>
                    <p><strong>Phòng:</strong> ${room.name}</p>
                    <p><strong>Ngày nhận phòng:</strong> ${new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Ngày trả phòng:</strong> ${new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Tổng tiền:</strong> ${booking.totalPrice.toLocaleString('vi-VN')}₫</p>
                </div>
                
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="margin-top: 0; color: #155724;">Hoàn tiền</h3>
                    <p>Quá trình hoàn tiền sẽ được xử lý trong vòng 5-7 ngày làm việc. Bạn sẽ nhận được email xác nhận khi hoàn tiền thành công.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
                    <p><strong>Email:</strong> khachsanpython@gmail.com</p>
                    <p><strong>Điện thoại:</strong> 0123 456 789</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
                    <p style="margin: 0;">© 2025 Luxury Beach Resort. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Tạo nội dung email từ chối yêu cầu hủy phòng
     * @param {Object} booking - Thông tin đặt phòng
     * @param {Object} room - Thông tin phòng
     * @param {Object} user - Thông tin người dùng
     * @param {string} reason - Lý do từ chối
     */
    generateBookingCancellationRejectionEmail(booking, room, user, reason) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Yêu cầu hủy phòng bị từ chối</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <h1 style="color: #ffc107; margin: 0;">Khách Sạn Luxury Beach Resort</h1>
                <p style="color: #6c757d; margin: 10px 0 0;">Yêu cầu hủy phòng bị từ chối</p>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color: #ffc107;">Xin chào ${user.username || user.email},</h2>
                
                <p>Chúng tôi rất tiếc phải thông báo rằng yêu cầu hủy phòng của bạn cho đơn hàng #${booking.bookingCode} đã bị từ chối.</p>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h3 style="margin-top: 0; color: #856404;">Thông tin yêu cầu</h3>
                    <p><strong>Mã đặt phòng:</strong> ${booking.bookingCode}</p>
                    <p><strong>Ngày gửi yêu cầu:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
                    <p><strong>Trạng thái:</strong> <span style="color: #ffc107; font-weight: bold;">Bị từ chối</span></p>
                </div>
                
                <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
                    <h3 style="margin-top: 0; color: #dc3545;">Lý do từ chối</h3>
                    <p>${reason || 'Không có lý do cụ thể được cung cấp.'}</p>
                </div>
                
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #007bff;">Chi tiết đặt phòng</h3>
                    <p><strong>Phòng:</strong> ${room.name}</p>
                    <p><strong>Ngày nhận phòng:</strong> ${new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Ngày trả phòng:</strong> ${new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Tổng tiền:</strong> ${booking.totalPrice.toLocaleString('vi-VN')}₫</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
                    <p><strong>Email:</strong> khachsanpython@gmail.com</p>
                    <p><strong>Điện thoại:</strong> 0123 456 789</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
                    <p style="margin: 0;">© 2025 Luxury Beach Resort. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    /**
     * Tạo nội dung email xác nhận hoàn tiền
     * @param {Object} booking - Thông tin đặt phòng
     * @param {Object} room - Thông tin phòng
     * @param {Object} user - Thông tin người dùng
     * @param {number} amount - Số tiền hoàn
     */
    generateRefundConfirmationEmail(booking, room, user, amount) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Xác nhận hoàn tiền</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
                <h1 style="color: #28a745; margin: 0;">Khách Sạn Luxury Beach Resort</h1>
                <p style="color: #6c757d; margin: 10px 0 0;">Xác nhận hoàn tiền</p>
            </div>
            
            <div style="padding: 20px;">
                <h2 style="color: #28a745;">Xin chào ${user.username || user.email},</h2>
                
                <p>Chúng tôi xác nhận rằng quá trình hoàn tiền cho đơn hàng #${booking.bookingCode} đã được hoàn tất.</p>
                
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                    <h3 style="margin-top: 0; color: #155724;">Thông tin hoàn tiền</h3>
                    <p><strong>Mã đặt phòng:</strong> ${booking.bookingCode}</p>
                    <p><strong>Ngày hoàn tiền:</strong> ${new Date().toLocaleDateString('vi-VN')}</p>
                    <p><strong>Số tiền hoàn:</strong> <span style="font-weight: bold;">${amount.toLocaleString('vi-VN')}₫</span></p>
                    <p><strong>Trạng thái:</strong> <span style="color: #28a745; font-weight: bold;">Đã hoàn tiền</span></p>
                </div>
                
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <h3 style="margin-top: 0; color: #007bff;">Chi tiết đặt phòng</h3>
                    <p><strong>Phòng:</strong> ${room.name}</p>
                    <p><strong>Ngày nhận phòng:</strong> ${new Date(booking.checkInDate).toLocaleDateString('vi-VN')}</p>
                    <p><strong>Ngày trả phòng:</strong> ${new Date(booking.checkOutDate).toLocaleDateString('vi-VN')}</p>
                </div>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
                    <h3 style="margin-top: 0; color: #856404;">Lưu ý</h3>
                    <p>Thời gian tiền được chuyển vào tài khoản của bạn có thể mất từ 3-5 ngày làm việc tùy theo ngân hàng.</p>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi:</p>
                    <p><strong>Email:</strong> khachsanpython@gmail.com</p>
                    <p><strong>Điện thoại:</strong> 0123 456 789</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
                    <p style="margin: 0;">© 2025 Luxury Beach Resort. Tất cả các quyền được bảo lưu.</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = new EmailService();