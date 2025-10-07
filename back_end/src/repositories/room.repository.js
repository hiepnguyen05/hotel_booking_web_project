const Room = require("../models/room.model");
const Booking = require("../models/booking.model");

class RoomRepository {
    async findAll(filter = {}) {
        return Room.find(filter).sort({ createdAt: -1 });
    }

    async findById(id) {
        return Room.findById(id);
    }

    async create(data) {
        const room = new Room(data);
        return room.save();
    }

    async update(id, data) {
        return Room.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return Room.findByIdAndDelete(id);
    }

    async findAvailableRooms(checkInDate, checkOutDate, totalGuests, roomCount) {
        const rooms = await Room.find({
            status: "available",
            capacity: { $gte: Math.ceil(totalGuests / roomCount) },
        });

        const availableRooms = [];
        for (const room of rooms) {
            const isBooked = await Booking.find({
                room: room._id,
                status: { $in: ["pending", "confirmed"] },
                $or: [
                    {
                        checkInDate: { $lte: checkOutDate },
                        checkOutDate: { $gte: checkInDate },
                    },
                ],
            }).countDocuments();

            if (isBooked === 0) {
                availableRooms.push(room);
            }
        }

        return availableRooms;
    }
}

module.exports = new RoomRepository();