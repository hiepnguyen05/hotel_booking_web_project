const roomService = require("../services/room.service");

// Lấy danh sách phòng
exports.list = async (req, res) => {
    try {
        const rooms = await roomService.getAllRooms(req.query);
        res.json({ success: true, data: rooms });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Lấy chi tiết 1 phòng
exports.get = async (req, res) => {
    try {
        const room = await roomService.getById(req.params.id);
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
