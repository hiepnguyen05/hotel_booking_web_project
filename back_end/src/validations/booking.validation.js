const Joi = require("joi");

const bookingSchema = Joi.object({
    roomId: Joi.string().required(),
    checkInDate: Joi.date().iso().required(),
    checkOutDate: Joi.date().iso().greater(Joi.ref("checkInDate")).required(),
    adultCount: Joi.number().integer().min(1).required(),
    childCount: Joi.number().integer().min(0).required(),
    roomCount: Joi.number().integer().min(1).required(),
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\d{10,15}$/).required(),
    notes: Joi.string().optional(),
    paymentMethod: Joi.string().valid("online").required(), // Chỉ giữ lại phương thức thanh toán trực tuyến
});

// Schema cho cập nhật đặt phòng (các trường có thể tùy chọn)
const updateBookingSchema = Joi.object({
    checkInDate: Joi.date().iso().optional(),
    checkOutDate: Joi.date().iso().greater(Joi.ref("checkInDate")).optional(),
    adultCount: Joi.number().integer().min(1).optional(),
    childCount: Joi.number().integer().min(0).optional(),
    roomCount: Joi.number().integer().min(1).optional(),
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().pattern(/^\d{10,15}$/).optional(),
    notes: Joi.string().optional(),
});

const validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const updateBooking = (req, res, next) => {
    const { error } = updateBookingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateBooking, updateBooking };