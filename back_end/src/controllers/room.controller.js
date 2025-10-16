const RoomService = require("../services/room.service");
const BookingService = require("../services/booking.service");
const { formatResponse } = require("../utils/formatResponse");
const fs = require("fs");
const path = require("path");

class RoomController {
    async getAll(req, res) {
        try {
            const result = await RoomService.getAllRooms(req.query);
            return formatResponse(res, 200, "Rooms retrieved successfully", result);
        } catch (error) {
            return formatResponse(res, 500, error.message);
        }
    }

    async getRoomDetails(req, res) {
        try {
            const room = await RoomService.getById(req.params.roomId);
            if (!room) {
                return formatResponse(res, 404, "Room not found or not available");
            }
            return formatResponse(res, 200, "Room details retrieved successfully", room);
        } catch (error) {
            return formatResponse(res, 500, error.message);
        }
    }

    async checkRoomAvailability(req, res) {
        try {
            const { roomId } = req.params;
            const { checkInDate, checkOutDate } = req.query;

            // Kiểm tra các tham số bắt buộc
            if (!checkInDate || !checkOutDate) {
                return formatResponse(res, 400, "Missing required query parameters: checkInDate, checkOutDate");
            }

            // Kiểm tra định dạng ngày
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            if (isNaN(checkIn) || isNaN(checkOut) || checkIn >= checkOut) {
                return formatResponse(res, 400, "Invalid checkInDate or checkOutDate");
            }

            // Kiểm tra phòng có tồn tại không
            const room = await RoomService.getById(roomId);
            if (!room) {
                return formatResponse(res, 404, "Room not found");
            }

            // Kiểm tra tình trạng phòng (nếu không phải available thì không khả dụng)
            if (room.status !== "available") {
                return formatResponse(res, 200, "Room availability checked", { available: false });
            }

            // Kiểm tra xem phòng có được đặt trong khoảng thời gian này không
            const conflicts = await BookingService.checkAvailability(roomId, checkIn, checkOut);
            
            // Nếu không có xung đột thì phòng khả dụng
            const isAvailable = conflicts.length === 0;
            
            return formatResponse(res, 200, "Room availability checked", { available: isAvailable });
        } catch (error) {
            console.error('Check room availability error:', error);
            return formatResponse(res, 500, error.message);
        }
    }

    async create(req, res) {
        try {
            const {
                name,
                type,
                bedType,
                description,
                capacity,
                price,
                amenities,
                status,
            } = req.body;

            // Kiểm tra các trường bắt buộc
            if (!name || !type || !bedType || !capacity || !price) {
                return formatResponse(res, 400, "Missing required fields: name, type, bedType, capacity, price");
            }

            // Kiểm tra định dạng số
            const parsedCapacity = parseInt(capacity);
            const parsedPrice = parseFloat(price);
            if (isNaN(parsedCapacity) || parsedCapacity < 1) {
                return formatResponse(res, 400, "Capacity must be a positive integer");
            }
            if (isNaN(parsedPrice) || parsedPrice < 0) {
                return formatResponse(res, 400, "Price must be a non-negative number");
            }

            // Kiểm tra và parse amenities
            let parsedAmenities = [];
            if (amenities) {
                try {
                    parsedAmenities = JSON.parse(amenities);
                    if (!Array.isArray(parsedAmenities)) {
                        return formatResponse(res, 400, "Amenities must be a JSON array");
                    }
                } catch (error) {
                    return formatResponse(res, 400, "Invalid amenities format. Must be a JSON array.");
                }
            }

            // Kiểm tra type, bedType, status thuộc enum
            const validTypes = ["single", "double", "suite", "deluxe"];
            const validBedTypes = ["single", "double", "queen", "king"];
            const validStatuses = ["available", "booked", "maintenance"];
            if (!validTypes.includes(type)) {
                return formatResponse(res, 400, `Type must be one of: ${validTypes.join(", ")}`);
            }
            if (!validBedTypes.includes(bedType)) {
                return formatResponse(res, 400, `BedType must be one of: ${validBedTypes.join(", ")}`);
            }
            if (status && !validStatuses.includes(status)) {
                return formatResponse(res, 400, `Status must be one of: ${validStatuses.join(", ")}`);
            }

            // Xử lý danh sách ảnh
            const images = req.files
                ? req.files.map((file) => `/uploads/rooms/${file.filename}`)
                : [];

            // Tạo dữ liệu phòng
            const roomData = {
                name,
                type,
                bedType,
                description,
                capacity: parsedCapacity,
                price: parsedPrice,
                amenities: parsedAmenities,
                images,
                status: status || "available",
            };

            const room = await RoomService.createRoom(roomData);
            return formatResponse(res, 201, "Room created successfully", room);
        } catch (error) {
            return formatResponse(res, 500, error.message);
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const {
                name,
                type,
                bedType,
                description,
                capacity,
                price,
                amenities,
                status,
                imagesToRemove,
            } = req.body;

            // Kiểm tra các trường nếu được cung cấp
            const roomData = {};
            if (name) roomData.name = name;
            if (type) {
                const validTypes = ["single", "double", "suite", "deluxe"];
                if (!validTypes.includes(type)) {
                    return formatResponse(res, 400, `Type must be one of: ${validTypes.join(", ")}`);
                }
                roomData.type = type;
            }
            if (bedType) {
                const validBedTypes = ["single", "double", "queen", "king"];
                if (!validBedTypes.includes(bedType)) {
                    return formatResponse(res, 400, `BedType must be one of: ${validBedTypes.join(", ")}`);
                }
                roomData.bedType = bedType;
            }
            if (description) roomData.description = description;
            if (capacity) {
                const parsedCapacity = parseInt(capacity);
                if (isNaN(parsedCapacity) || parsedCapacity < 1) {
                    return formatResponse(res, 400, "Capacity must be a positive integer");
                }
                roomData.capacity = parsedCapacity;
            }
            if (price) {
                const parsedPrice = parseFloat(price);
                if (isNaN(parsedPrice) || parsedPrice < 0) {
                    return formatResponse(res, 400, "Price must be a non-negative number");
                }
                roomData.price = parsedPrice;
            }
            if (amenities) {
                try {
                    const parsedAmenities = JSON.parse(amenities);
                    if (!Array.isArray(parsedAmenities)) {
                        return formatResponse(res, 400, "Amenities must be a JSON array");
                    }
                    roomData.amenities = parsedAmenities;
                } catch (error) {
                    return formatResponse(res, 400, "Invalid amenities format. Must be a JSON array.");
                }
            }
            if (status) {
                const validStatuses = ["available", "booked", "maintenance"];
                if (!validStatuses.includes(status)) {
                    return formatResponse(res, 400, `Status must be one of: ${validStatuses.join(", ")}`);
                }
                roomData.status = status;
            }
            
            // Xử lý ảnh mới được upload
            if (req.files && req.files.length > 0) {
                const newImages = req.files.map((file) => `/uploads/rooms/${file.filename}`);
                roomData.images = newImages;
            }
            
            // Xử lý ảnh cần xóa
            let imagesToDelete = [];
            if (imagesToRemove) {
                try {
                    imagesToDelete = JSON.parse(imagesToRemove);
                    if (!Array.isArray(imagesToDelete)) {
                        imagesToDelete = [];
                    }
                } catch (error) {
                    imagesToDelete = [];
                }
            }

            const room = await RoomService.updateRoom(id, roomData, imagesToDelete);
            if (!room) {
                return formatResponse(res, 404, "Room not found");
            }
            
            // Xóa các file ảnh khỏi hệ thống file nếu có
            if (imagesToDelete.length > 0) {
                imagesToDelete.forEach(imagePath => {
                    // Chỉ xóa file nếu đường dẫn bắt đầu với /uploads/rooms/
                    if (imagePath.startsWith('/uploads/rooms/')) {
                        const fullPath = path.join(__dirname, '../../', imagePath);
                        fs.unlink(fullPath, (err) => {
                            if (err) {
                                console.error('Error deleting file:', fullPath, err);
                            } else {
                                console.log('Successfully deleted file:', fullPath);
                            }
                        });
                    }
                });
            }
            
            return formatResponse(res, 200, "Room updated successfully", room);
        } catch (error) {
            return formatResponse(res, 500, error.message);
        }
    }

    async delete(req, res) {
        try {
            const room = await RoomService.deleteRoom(req.params.id);
            if (!room) {
                return formatResponse(res, 404, "Room not found");
            }
            return formatResponse(res, 200, "Room deleted successfully", room);
        } catch (error) {
            return formatResponse(res, 500, error.message);
        }
    }

    async searchAvailableRooms(req, res) {
        try {
            console.log('=== SEARCH AVAILABLE ROOMS CONTROLLER ===');
            console.log('Request query:', req.query);
            console.log('Request headers:', req.headers);
            
            const { checkInDate, checkOutDate, adultCount, childCount, roomCount } = req.query;

            // Kiểm tra các trường bắt buộc
            if (!checkInDate || !checkOutDate || !adultCount || !roomCount) {
                console.log('Missing required parameters');
                return formatResponse(
                    res,
                    400,
                    `Missing required query parameters: ${!checkInDate ? "checkInDate" :
                        !checkOutDate ? "checkOutDate" :
                            !adultCount ? "adultCount" :
                                "roomCount"
                    }`
                );
            }

            // Kiểm tra định dạng số
            const parsedAdultCount = parseInt(adultCount);
            const parsedChildCount = parseInt(childCount) || 0;
            const parsedRoomCount = parseInt(roomCount);
            if (isNaN(parsedAdultCount) || parsedAdultCount < 1) {
                console.log('Invalid adultCount');
                return formatResponse(res, 400, "adultCount must be a positive integer");
            }
            if (isNaN(parsedChildCount) || parsedChildCount < 0) {
                console.log('Invalid childCount');
                return formatResponse(res, 400, "childCount must be a non-negative integer");
            }
            if (isNaN(parsedRoomCount) || parsedRoomCount < 1) {
                console.log('Invalid roomCount');
                return formatResponse(res, 400, "roomCount must be a positive integer");
            }

            // Kiểm tra định dạng ngày
            const checkIn = new Date(checkInDate);
            const checkOut = new Date(checkOutDate);
            if (isNaN(checkIn) || isNaN(checkOut) || checkIn >= checkOut) {
                console.log('Invalid dates');
                return formatResponse(res, 400, "Invalid checkInDate or checkOutDate");
            }

            console.log('Calling RoomService.searchAvailableRooms with parameters:', {
                checkIn,
                checkOut,
                adultCount: parsedAdultCount,
                childCount: parsedChildCount,
                roomCount: parsedRoomCount
            });

            // Tìm phòng khả dụng
            const rooms = await RoomService.searchAvailableRooms(
                checkIn,
                checkOut,
                parsedAdultCount,
                parsedChildCount,
                parsedRoomCount
            );

            console.log('Rooms found:', rooms.length);
            // Trả về mảng rooms trực tiếp thay vì bọc trong object
            return formatResponse(res, 200, "Available rooms retrieved successfully", rooms);
        } catch (error) {
            console.error('=== SEARCH AVAILABLE ROOMS ERROR ===');
            console.error('Error details:', error);
            console.error('Error stack:', error.stack);
            return formatResponse(res, 500, error.message);
        }
    }
}

module.exports = new RoomController();