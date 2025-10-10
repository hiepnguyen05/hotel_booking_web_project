const roomService = require("../services/room.service");
const Room = require("../models/room.model");

// Lấy danh sách phòng
exports.list = async (req, res) => {
    try {
        // For admin, we want to show all rooms regardless of status
        const {
            page = 1,
            limit = 10,
            minPrice,
            maxPrice,
            type,
            status, // Add status filter for admin
            amenities,
            sort = "-createdAt",
        } = req.query;

        const filter = {};
        
        // Add filters
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (type) {
            filter.type = type;
        }
        if (status && status !== 'all') {
            filter.status = status;
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

        res.json({
            success: true, 
            data: {
                items,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit)) || 1,
                }
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy chi tiết 1 phòng
exports.get = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        res.json({ success: true, data: room });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};

// Thêm phòng (upload nhiều ảnh)
exports.create = async (req, res) => {
    try {
        const images = req.files ? req.files.map((file) => `/uploads/rooms/${file.filename}`) : [];
        
        // Parse amenities if it's a JSON string
        let amenities = [];
        if (req.body.amenities) {
            try {
                amenities = JSON.parse(req.body.amenities);
            } catch (e) {
                amenities = Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities];
            }
        }
        
        const roomData = { 
            ...req.body, 
            images,
            amenities,
            price: Number(req.body.price),
            capacity: Number(req.body.capacity)
        };
        
        const room = await roomService.createRoom(roomData);
        res.status(201).json({ success: true, data: room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Cập nhật phòng
exports.update = async (req, res) => {
    try {
        let roomData = { ...req.body };
        
        // Handle images
        if (req.files && req.files.length > 0) {
            const images = req.files.map((file) => `/uploads/rooms/${file.filename}`);
            roomData.images = images;
        }
        
        // Parse amenities if it's a JSON string
        if (req.body.amenities) {
            try {
                roomData.amenities = JSON.parse(req.body.amenities);
            } catch (e) {
                roomData.amenities = Array.isArray(req.body.amenities) ? req.body.amenities : [req.body.amenities];
            }
        }
        
        // Convert numeric fields
        if (req.body.price) roomData.price = Number(req.body.price);
        if (req.body.capacity) roomData.capacity = Number(req.body.capacity);
        
        const room = await roomService.updateRoom(req.params.id, roomData);
        res.json({ success: true, data: room });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

// Xóa phòng
exports.remove = async (req, res) => {
    try {
        await roomService.deleteRoom(req.params.id);
        res.json({ success: true, message: "Room deleted" });
    } catch (err) {
        res.status(404).json({ success: false, message: err.message });
    }
};