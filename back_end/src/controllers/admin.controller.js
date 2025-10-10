const mongoose = require("mongoose");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const CancellationRequest = require("../models/cancellationRequest.model");

// Lấy danh sách tất cả user
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Cập nhật vai trò (phân quyền)
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["user", "admin"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Xóa user
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Delete user error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// Khóa tài khoản
const lockUser = async (req, res) => {
    try {
        const { id } = req.params;

        // toggle khóa/mở tài khoản
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newStatus = !user.isLocked;

        // update trực tiếp, không gọi save()
        await User.findByIdAndUpdate(
            id,
            { isLocked: newStatus },
            { new: true }
        );

        res.json({
            message: `User account has been ${newStatus ? 'locked' : 'unlocked'}`,
        });
    } catch (error) {
        console.error('Error locking user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Mở khóa tài khoản
const unlockUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isLocked) {
            return res.status(400).json({ message: "User is not locked" });
        }

        user.isLocked = false;
        await user.save();

        return res.json({
            message: "User account has been unlocked",
            user: { id: user._id, username: user.username, isLocked: user.isLocked }
        });
    } catch (err) {
        console.error("Error unlocking user:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// Lấy tất cả bookings (admin)
const getAllBookings = async (req, res) => {
    try {
        const { page = 1, limit = 10, status, from, to, roomId, userEmail } = req.query;
        const filter = {};
        if (status) filter.status = status;
        if (roomId) filter.room = roomId;
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }
        if (userEmail) {
            // join on user by email
            const users = await User.find({ email: new RegExp(userEmail, 'i') }).select('_id');
            filter.user = { $in: users.map(u => u._id) };
        }

        const skip = (Number(page) - 1) * Number(limit);
        const [items, total] = await Promise.all([
            Booking.find(filter)
                .populate('user', 'username email')
                .populate('room')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Booking.countDocuments(filter),
        ]);

        // Get cancellation requests for these bookings
        const bookingIds = items.map(item => item._id);
        const cancellationRequests = await CancellationRequest.find({
            booking: { $in: bookingIds }
        }).select('booking status refundStatus');

        // Add cancellation request info to bookings
        const itemsWithCancellationInfo = items.map(item => {
            const cancellationRequest = cancellationRequests.find(cr => cr.booking.toString() === item._id.toString());
            return {
                ...item.toObject(),
                cancellationRequest: cancellationRequest || null
            };
        });

        return res.json({
            items: itemsWithCancellationInfo,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)) || 1,
            }
        });
    } catch (err) {
        console.error('Get all bookings error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Cập nhật trạng thái booking (admin)
const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const allowed = ['pending', 'confirmed', 'cancelled', 'completed'];
        if (!allowed.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const booking = await Booking.findById(id);
        if (!booking) return res.status(404).json({ message: 'Booking not found' });

        // simple rules: cannot move from cancelled to other; cannot complete before check-in
        if (booking.status === 'cancelled' && status !== 'cancelled') {
            return res.status(400).json({ message: 'Cannot change status of a cancelled booking' });
        }
        if (status === 'completed' && new Date() < booking.checkInDate) {
            return res.status(400).json({ message: 'Cannot complete before check-in' });
        }

        booking.status = status;
        await booking.save();
        return res.json(booking);
    } catch (err) {
        console.error('Update booking status error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Lấy thống kê đặt phòng (admin)
const getBookingStats = async (req, res) => {
    try {
        // Tổng số đặt phòng
        const totalBookings = await Booking.countDocuments();
        
        // Số đặt phòng theo trạng thái
        const statusStats = await Booking.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // Chuyển đổi kết quả thành object
        const statusCounts = statusStats.reduce((acc, stat) => {
            acc[stat._id] = stat.count;
            return acc;
        }, {});
        
        // Tổng doanh thu từ các booking đã thanh toán
        const paidBookings = await Booking.find({ 
            status: { $in: ['confirmed', 'completed'] },
            paymentStatus: 'paid'
        });
        
        const totalRevenue = paidBookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
        
        // Doanh thu theo tháng
        const monthlyRevenue = await Booking.aggregate([
            {
                $match: {
                    status: { $in: ['confirmed', 'completed'] },
                    paymentStatus: 'paid'
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$totalPrice" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": -1, "_id.month": -1 }
            },
            {
                $limit: 12
            }
        ]);
        
        return res.json({
            totalBookings,
            confirmedBookings: statusCounts.confirmed || 0,
            pendingBookings: statusCounts.pending || 0,
            cancelledBookings: statusCounts.cancelled || 0,
            completedBookings: statusCounts.completed || 0,
            totalRevenue,
            monthlyRevenue
        });
    } catch (err) {
        console.error('Get booking stats error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Xử lý thanh toán booking (admin)
const processBookingPayment = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentMethod } = req.body;
        
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        // Cập nhật trạng thái thanh toán
        booking.paymentStatus = 'paid';
        
        // Nếu là thanh toán trực tiếp và booking đang ở trạng thái pending, 
        // thì có thể tự động xác nhận
        if (paymentMethod === 'direct' && booking.status === 'pending') {
            booking.status = 'confirmed';
        }

        await booking.save();
        
        return res.json({
            message: 'Payment processed successfully',
            data: booking
        });
    } catch (err) {
        console.error('Process booking payment error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getAllUsers,
    updateUserRole,
    deleteUser,
    lockUser,
    unlockUser,
    getAllBookings,
    updateBookingStatus,
    getBookingStats,
    processBookingPayment
};
