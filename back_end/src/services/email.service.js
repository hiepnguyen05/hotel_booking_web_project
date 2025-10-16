const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        // Always use Gmail for production, even in development for testing email functionality
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER || 'khachsanpython@gmail.com',
                pass: process.env.EMAIL_PASS || 'drok yeki wket zgtx' // Updated to the provided password
            }
        });
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
                from: process.env.EMAIL_USER || 'khachsanpython@gmail.com',
                to: to,
                subject: subject,
                html: html
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);

            return { success: true, messageId: info.messageId };
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
                childCount: booking.childCount,
                email: booking.email // Use booking email instead of user email
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

            // Send email to the email provided in the booking form
            console.log('Sending email to:', booking.email);
            const result = await this.sendEmail(
                booking.email, // Use booking email instead of user email
                `Xác Nhận Đặt Phòng Thành Công – Mã đặt: ${booking.bookingCode}`,
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
                to: booking.email || user.email,  // Sử dụng email từ booking nếu có, nếu không thì dùng email của user
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
                to: booking.email || user.email,  // Sử dụng email từ booking nếu có, nếu không thì dùng email của user
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
                to: booking.email || user.email,  // Sử dụng email từ booking nếu có, nếu không thì dùng email của user
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
        // Calculate number of nights
        const checkInDate = new Date(booking.checkInDate);
        const checkOutDate = new Date(booking.checkOutDate);
        const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

        // Format dates
        const formattedCheckInDate = checkInDate.toLocaleDateString('vi-VN');
        const formattedCheckOutDate = checkOutDate.toLocaleDateString('vi-VN');

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
                <h1 style="color: #007bff; margin: 0;">NgocHiepHotel</h1>
                <p style="color: #6c757d; margin: 10px 0 0;">Xác nhận đặt phòng thành công</p>
            </div>
            
            <div style="padding: 20px;">
                <h2>Kính gửi Quý khách ${booking.fullName},</h2>
                
                <p>Chúng tôi xin trân trọng cảm ơn Quý khách đã tin tưởng và lựa chọn NgocHiepHotel cho kỳ nghỉ của mình.</p>
                
                <p>Chúng tôi rất vui mừng thông báo việc đặt phòng của Quý khách đã được xác nhận thành công!</p>
                
                <h3 style="color: #007bff;">Chi Tiết Đặt Phòng</h3>
                
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Mã Đặt Phòng:</strong> ${booking.bookingCode} (Vui lòng cung cấp mã này khi làm thủ tục nhận phòng)</p>
                    <p><strong>Tên Khách:</strong> ${booking.fullName}</p>
                    <p><strong>Ngày Nhận Phòng (Check-in):</strong> ${formattedCheckInDate} lúc 14:00</p>
                    <p><strong>Ngày Trả Phòng (Check-out):</strong> ${formattedCheckOutDate} lúc 12:00</p>
                    <p><strong>Loại Phòng:</strong> ${room.name}</p>
                    <p><strong>Số Lượng Khách:</strong> ${booking.adultCount} Người lớn, ${booking.childCount} Trẻ em</p>
                </div>
                
                <h3 style="color: #007bff;">Chi Phí và Thanh Toán</h3>
                
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Tổng Chi Phí:</strong> ${booking.totalPrice.toLocaleString('vi-VN')} VND</p>
                    <p><strong>Tình trạng Thanh toán:</strong> Đã thanh toán toàn bộ</p>
                    <p><strong>Các dịch vụ bao gồm:</strong> Bữa sáng miễn phí, Sử dụng hồ bơi, WiFi tốc độ cao</p>
                </div>
                
                <h3 style="color: #007bff;">Các Thông Tin Quan Trọng Khác</h3>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Địa chỉ:</strong> 123 Đường Biển, Phường Phú Mỹ, Thành phố Phan Thiết, Bình Thuận</p>
                    <p><strong>Số Điện Thoại Liên Hệ:</strong> 0123 456 789</p>
                    <p><strong>Quy định Hủy phòng:</strong> Miễn phí hủy bỏ trước 48 giờ so với ngày nhận phòng.</p>
                </div>
                
                <p>Quý khách vui lòng mang theo Giấy tờ tùy thân có ảnh (CMND/CCCD hoặc Hộ chiếu) khi làm thủ tục nhận phòng.</p>
                
                <p>Nếu Quý khách có bất kỳ yêu cầu đặc biệt hoặc cần hỗ trợ thêm, vui lòng liên hệ trực tiếp với chúng tôi qua email này hoặc gọi đến số điện thoại trên.</p>
                
                <p>Chúng tôi rất mong được chào đón và phục vụ Quý khách!</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <p>Trân trọng,</p>
                    <p><strong>Bộ phận Đặt phòng NgocHiepHotel</strong></p>
                    <p>Email: hiep20122005@gmail.com</p>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; text-align: center;">
                    <p style="margin: 0;">© 2025 NgocHiepHotel. Tất cả các quyền được bảo lưu.</p>
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
                <h2 style="color: #dc3545;">Xin chào ${booking.fullName || user.username || booking.email},</h2>
                
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
                <h2 style="color: #ffc107;">Xin chào ${booking.fullName || user.username || booking.email},</h2>
                
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
                <h2 style="color: #28a745;">Xin chào ${booking.fullName || user.username || booking.email},</h2>
                
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