const Joi = require('joi');

const listingSchema = Joi.object(
    {title: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.object({
        url: Joi.string().uri().allow(''),
        filename: Joi.string()
    }).optional(),
    price: Joi.number().required(),
    location: Joi.string(),
    country: Joi.string()
    }
);


const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),  // Allow rating (1 to 5)
    comment: Joi.string().min(3).max(500).required() // Allow comment
});

module.exports = { listingSchema , reviewSchema};
