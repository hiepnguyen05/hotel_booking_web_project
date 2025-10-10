const mongoose = require("mongoose");
const config = require("./config");

// Room model
const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["single", "double", "suite", "deluxe"], required: true },
    bedType: { type: String, enum: ["single", "double", "queen", "king"], required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true },
    size: { type: String },
    images: [{ type: String }],
    amenities: [{ type: String }],
    status: { type: String, enum: ["available", "booked", "maintenance"], default: "available" },
}, { timestamps: true });

const Room = mongoose.model("Room", roomSchema);

async function createTestRooms() {
    try {
        // Connect to database
        await mongoose.connect(config.MONGO_URI);
        console.log("Connected to database");

        // Check if rooms already exist
        const existingRooms = await Room.countDocuments();
        if (existingRooms > 0) {
            console.log(`Database already contains ${existingRooms} rooms.`);
            return;
        }

        // Create test rooms
        const testRooms = [
            {
                name: "Phòng Deluxe Biển",
                type: "deluxe",
                bedType: "king",
                description: "Phòng deluxe với view biển tuyệt đẹp, đầy đủ tiện nghi hiện đại.",
                price: 1500000,
                capacity: 4,
                size: "40m²",
                images: ["/uploads/rooms/deluxe-sea-view.jpg"],
                amenities: ["WiFi miễn phí", "TV màn hình phẳng", "Máy lạnh", "Tủ lạnh", "Ban công"],
                status: "available"
            },
            {
                name: "Phòng Suite Tổng Thống",
                type: "suite",
                bedType: "king",
                description: "Phòng suite sang trọng với không gian rộng rãi, bồn tắm jacuzzi riêng.",
                price: 3000000,
                capacity: 6,
                size: "80m²",
                images: ["/uploads/rooms/presidential-suite.jpg"],
                amenities: ["WiFi miễn phí", "TV màn hình phẳng", "Máy lạnh", "Tủ lạnh", "Bồn tắm jacuzzi", "Dịch vụ phòng 24/7", "Ban công"],
                status: "available"
            },
            {
                name: "Phòng Đôi Tiêu Chuẩn",
                type: "double",
                bedType: "double",
                description: "Phòng đôi tiện nghi, phù hợp cho cặp đôi hoặc gia đình nhỏ.",
                price: 800000,
                capacity: 2,
                size: "25m²",
                images: ["/uploads/rooms/double-standard.jpg"],
                amenities: ["WiFi miễn phí", "TV màn hình phẳng", "Máy lạnh", "Bàn làm việc"],
                status: "available"
            },
            {
                name: "Phòng Đơn Tiết Kiệm",
                type: "single",
                bedType: "single",
                description: "Phòng đơn giá rẻ, tiện nghi cơ bản cho khách du lịch.",
                price: 800000,
                capacity: 1,
                size: "20m²",
                images: ["/uploads/rooms/single-budget.jpg"],
                amenities: ["WiFi miễn phí", "TV truyền hình cáp", "Máy lạnh"],
                status: "available"
            },
            {
                name: "Phòng Gia Đình",
                type: "deluxe",
                bedType: "queen",
                description: "Phòng rộng rãi phù hợp cho gia đình, có 2 giường queen size.",
                price: 1200000,
                capacity: 4,
                size: "35m²",
                images: ["/uploads/rooms/family-room.jpg"],
                amenities: ["WiFi miễn phí", "TV màn hình phẳng", "Máy lạnh", "Tủ lạnh", "Khu vực chơi trẻ em"],
                status: "available"
            }
        ];

        // Insert rooms
        const insertedRooms = await Room.insertMany(testRooms);
        console.log(`Created ${insertedRooms.length} test rooms successfully!`);
        
        // Display created rooms
        insertedRooms.forEach((room, index) => {
            console.log(`${index + 1}. ${room.name} - ${room.type} - ${room.price.toLocaleString('vi-VN')}₫/đêm`);
        });

    } catch (error) {
        console.error("Error creating test rooms:", error);
    } finally {
        await mongoose.connection.close();
    }
}

createTestRooms();