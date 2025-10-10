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

const validateBooking = (req, res, next) => {
    const { error } = bookingSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = { validateBooking };