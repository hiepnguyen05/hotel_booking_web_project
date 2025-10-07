const Joi = require('joi');

const basePriceSchema = Joi.object({
    currency: Joi.string().max(10).optional(),
    basePrice: Joi.number().min(0).required(),
    cleaningFee: Joi.number().min(0).optional(),
    seasonal: Joi.array().items(
        Joi.object({
            startDate: Joi.date().required(),
            endDate: Joi.date().required(),
            price: Joi.number().min(0).required()
        })
    ).optional()
});

const createRoomSchema = Joi.object({
    hotel: Joi.string().optional().allow(null, ''),
    roomNumber: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().optional().allow(''),
    type: Joi.string().valid('single', 'double', 'twin', 'suite', 'deluxe', 'family', 'villa', 'studio').required(),
    bedConfiguration: Joi.object({
        bedType: Joi.string().valid('single', 'double', 'queen', 'king', 'twin').optional(),
        beds: Joi.number().min(1).optional()
    }).optional(),
    maxGuests: Joi.number().min(1).required(),
    sizeSqm: Joi.number().min(0).optional(),
    amenities: Joi.array().items(Joi.string()).optional(),
    images: Joi.array().items(Joi.object({ url: Joi.string().uri().required(), alt: Joi.string().optional(), order: Joi.number().optional() })).optional(),
    inventory: Joi.number().min(0).optional(),
    pricing: basePriceSchema.required(),
    policies: Joi.object().optional(),
    status: Joi.string().valid('available', 'booked', 'maintenance', 'blocked').optional(),
    tags: Joi.array().items(Joi.string()).optional()
});

const updateRoomSchema = createRoomSchema.fork(['roomNumber', 'title', 'type', 'maxGuests', 'pricing'], (s) => s.optional());

module.exports = {
    createRoomSchema,
    updateRoomSchema
};
