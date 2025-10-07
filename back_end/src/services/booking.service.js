const Booking = require("../models/booking.model");
const Room = require("../models/room.model");

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

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
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
            paymentMethod,
            bookingCode,
            status: "pending",
            paymentStatus: paymentMethod === "online" ? "pending" : "pending",
        });
        return await booking.save();
    }

    async checkAvailability(roomId, checkInDate, checkOutDate) {
        console.log('Checking availability for room:', roomId, { checkInDate, checkOutDate });

        // Sửa lại truy vấn để tìm đúng các đặt phòng chồng chéo với khoảng thời gian
        return await Booking.find({
            room: roomId,
            status: { $in: ["pending", "confirmed"] },
            $and: [
                { checkInDate: { $lt: checkOutDate } },
                { checkOutDate: { $gt: checkInDate } }
            ]
        });
    }

    async checkAvailabilityForRooms(checkInDate, checkOutDate) {
        console.log('Checking availability for dates:', { checkInDate, checkOutDate });

        // Sửa lại truy vấn để tìm đúng các phòng đã đặt trong khoảng thời gian
        const bookings = await Booking.find({
            status: { $in: ["pending", "confirmed"] },
            $and: [
                { checkInDate: { $lt: checkOutDate } },
                { checkOutDate: { $gt: checkInDate } }
            ]
        }).distinct("room");

        console.log(`Found ${bookings.length} booked rooms in the date range`);
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
}

module.exports = new BookingService();