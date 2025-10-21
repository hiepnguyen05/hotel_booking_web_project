const Room = require("../models/room.model");
const BookingService = require("../services/booking.service");
const fs = require("fs");
const path = require("path");

// Helper function to check if image file exists
function imageExists(imagePath) {
  if (!imagePath) return false;
  
  // Only check local files that start with /uploads/
  if (imagePath.startsWith('/uploads/')) {
    try {
      const fullPath = path.join(__dirname, '../../', imagePath);
      return fs.existsSync(fullPath);
    } catch (err) {
      console.error('Error checking image existence:', err);
      return false;
    }
  }
  
  // For external URLs, assume they exist
  if (imagePath.startsWith('http')) {
    return true;
  }
  
  return false;
}

// Helper function to filter valid images
function filterValidImages(images) {
  if (!Array.isArray(images)) return [];
  
  return images.filter(imagePath => imageExists(imagePath));
}

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

        const filter = { status: "available" }; // Chỉ lấy các phòng có trạng thái "available"
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

        // Filter valid images for each room
        const itemsWithValidImages = items.map(room => {
            const roomObj = room.toObject();
            if (roomObj.images && Array.isArray(roomObj.images)) {
                roomObj.images = filterValidImages(roomObj.images);
            }
            return roomObj;
        });

        return {
            items: itemsWithValidImages,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)) || 1,
            },
        };
    }

    async getById(roomId) {
        const room = await Room.findOne({ _id: roomId, status: "available" });
        if (!room) return null;
        
        // Filter valid images
        const roomObj = room.toObject();
        if (roomObj.images && Array.isArray(roomObj.images)) {
            roomObj.images = filterValidImages(roomObj.images);
        }
        
        return roomObj;
    }

    async createRoom(roomData) {
        const room = new Room(roomData);
        return await room.save();
    }

    async updateRoom(roomId, updateData, imagesToDelete = []) {
        // Nếu có ảnh cần xóa, cập nhật mảng images
        if (imagesToDelete.length > 0) {
            // Lấy phòng hiện tại
            const currentRoom = await Room.findById(roomId);
            if (currentRoom) {
                // Lọc bỏ các ảnh cần xóa
                const updatedImages = currentRoom.images.filter(
                    image => !imagesToDelete.includes(image)
                );

                // Nếu có ảnh mới được thêm vào, kết hợp với ảnh còn lại
                if (updateData.images && updateData.images.length > 0) {
                    updateData.images = [...updatedImages, ...updateData.images];
                } else {
                    // Nếu không có ảnh mới, chỉ giữ lại ảnh còn lại
                    updateData.images = updatedImages;
                }
            }
        } else if (updateData.images) {
            // Nếu không có ảnh cần xóa nhưng có ảnh mới, 
            // chỉ cập nhật với ảnh mới (thay thế hoàn toàn)
            // Đây là hành vi cũ, giữ nguyên để tương thích
        }

        return await Room.findByIdAndUpdate(roomId, updateData, { new: true });
    }

    async deleteRoom(roomId) {
        return await Room.findByIdAndDelete(roomId);
    }

    async searchAvailableRooms(checkInDate, checkOutDate, adultCount, childCount, roomCount) {
        console.log('=== DEBUG ROOM SEARCH ===');
        console.log('Input parameters:', {
            checkInDate,
            checkOutDate,
            adultCount,
            childCount,
            roomCount
        });

        // Ensure dates are Date objects and handle timezone properly
        let checkIn, checkOut;

        // If dates are strings without time components, treat them as date-only (no timezone conversion)
        if (typeof checkInDate === 'string' && checkInDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-08' - parse as date in local timezone
            const [year, month, day] = checkInDate.split('-').map(Number);
            checkIn = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkIn = new Date(checkInDate);
        }

        if (typeof checkOutDate === 'string' && checkOutDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            // Date-only string like '2025-10-09' - parse as date in local timezone
            const [year, month, day] = checkOutDate.split('-').map(Number);
            checkOut = new Date(year, month - 1, day); // Month is 0-indexed
        } else {
            // Full date string or Date object
            checkOut = new Date(checkOutDate);
        }

        console.log('Processed dates:', { checkIn, checkOut });

        const totalGuests = adultCount + childCount;
        console.log('Total guests:', totalGuests);

        // Tìm các phòng có đủ sức chứa và có trạng thái "available"
        const availableRooms = await Room.find({
            capacity: { $gte: totalGuests },
            status: "available"
        }).sort({ createdAt: -1 }); // Sắp xếp theo thời gian tạo để tránh trả về cùng một phòng

        console.log(`Found ${availableRooms.length} rooms with sufficient capacity`);
        console.log('Available rooms before filtering:', availableRooms.map(r => ({
            id: r._id,
            name: r.name,
            status: r.status,
            capacity: r.capacity,
            createdAt: r.createdAt
        })));

        // Lấy danh sách phòng đã được đặt trong khoảng thời gian
        console.log('Calling BookingService.checkAvailabilityForRooms...');
        const bookedRoomIds = await BookingService.checkAvailabilityForRooms(
            checkIn,
            checkOut
        );

        console.log(`Found ${bookedRoomIds.length} booked room IDs:`, bookedRoomIds);

        // Lọc các phòng không nằm trong danh sách đã đặt
        const filteredRooms = availableRooms.filter((room) => {
            const isBooked = bookedRoomIds.includes(room._id.toString());
            console.log(`Room ${room._id} (${room.name}) is booked: ${isBooked}`);
            // Trả về các phòng KHÔNG được đặt (isBooked phải là false)
            return !isBooked;
        });

        console.log(`After filtering, ${filteredRooms.length} rooms remain`);

        // Filter valid images for each room
        const roomsWithValidImages = filteredRooms.map(room => {
            const roomObj = room.toObject();
            if (roomObj.images && Array.isArray(roomObj.images)) {
                roomObj.images = filterValidImages(roomObj.images);
            }
            return roomObj;
        });

        // Sắp xếp lại các phòng theo thời gian tạo (mới nhất trước)
        roomsWithValidImages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Giới hạn số lượng phòng theo roomCount
        const rooms = roomsWithValidImages.slice(0, roomCount);

        console.log(`Returning ${rooms.length} available rooms:`, rooms.map(r => ({
            id: r._id,
            name: r.name,
            createdAt: r.createdAt
        })));
        console.log('=== END DEBUG ROOM SEARCH ===');

        return rooms;
    }
}

module.exports = new RoomService();