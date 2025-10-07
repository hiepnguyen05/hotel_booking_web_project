const Room = require("../models/room.model");
const BookingService = require("../services/booking.service");

class RoomService {
    async getAllRooms(query = {}) {
        const {
            page = 1,
            limit = 10,
            minPrice,
            maxPrice,
            type,
            amenities,
            sort = "-createdAt",
        } = query;

        const filter = {};
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (type) {
            filter.type = type;
        }
        if (amenities) {
            const list = Array.isArray(amenities)
                ? amenities
                : String(amenities).split(",").map((s) => s.trim()).filter(Boolean);
            if (list.length > 0) {
                filter.amenities = { $all: list };
            }
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [items, total] = await Promise.all([
            Room.find(filter).sort(sort).skip(skip).limit(Number(limit)),
            Room.countDocuments(filter),
        ]);

        return {
            items,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)) || 1,
            },
        };
    }

    async getById(roomId) {
        return await Room.findById(roomId);
    }

    async createRoom(roomData) {
        const room = new Room(roomData);
        return await room.save();
    }

    async updateRoom(roomId, updateData) {
        return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
    }

    async deleteRoom(roomId) {
        return await Room.findByIdAndDelete(roomId);
    }

    async searchAvailableRooms(checkInDate, checkOutDate, adultCount, childCount, roomCount) {
        console.log('Backend searching rooms with params:', {
            checkInDate,
            checkOutDate,
            adultCount,
            childCount,
            roomCount
        });

        const totalGuests = adultCount + childCount;

        // Tìm các phòng có status: "available" và đủ sức chứa
        const availableRooms = await Room.find({
            status: "available",
            capacity: { $gte: totalGuests },
        });

        console.log(`Found ${availableRooms.length} rooms with sufficient capacity`);

        // Lấy danh sách phòng đã được đặt trong khoảng thời gian
        const bookedRoomIds = await BookingService.checkAvailabilityForRooms(
            checkInDate,
            checkOutDate
        );

        console.log(`Found ${bookedRoomIds.length} booked room IDs:`, bookedRoomIds);

        // Lọc các phòng không nằm trong danh sách đã đặt
        const rooms = availableRooms
            .filter((room) => !bookedRoomIds.includes(room._id.toString()))
            .slice(0, roomCount); // Giới hạn số lượng phòng theo roomCount

        console.log(`Returning ${rooms.length} available rooms`);
        return rooms;
    }
}

module.exports = new RoomService();