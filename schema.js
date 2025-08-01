const Joi = require('joi');

// Joi schema for listing validation
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string()
            .required()
            .trim()
            .min(1)
            .max(100)
            .messages({
                'string.empty': 'Title is required',
                'string.min': 'Title must not be empty',
                'string.max': 'Title must be less than 100 characters',
                'any.required': 'Title is required'
            }),

        description: Joi.string()
            .required()
            .trim()
            .min(1)
            .max(1000)
            .messages({
                'string.empty': 'Description is required',
                'string.min': 'Description must not be empty',
                'string.max': 'Description must be less than 1000 characters',
                'any.required': 'Description is required'
            }),

        image: Joi.object({
            url: Joi.string()
                .uri()
                .allow('', null)
                .messages({
                    'string.uri': 'Image URL must be a valid URL'
                }),
            filename: Joi.string()
                .allow('', null)
        }).allow(null).optional(),

        price: Joi.number()
            .required()
            .positive()
            .precision(2)
            .messages({
                'number.base': 'Price must be a valid number',
                'number.positive': 'Price must be a positive number',
                'any.required': 'Price is required'
            }),

        location: Joi.string()
            .required()
            .trim()
            .min(1)
            .max(100)
            .messages({
                'string.empty': 'Location is required',
                'string.min': 'Location must not be empty',
                'string.max': 'Location must be less than 100 characters',
                'any.required': 'Location is required'
            }),

        country: Joi.string()
            .required()
            .trim()
            .min(1)
            .max(100)
            .messages({
                'string.empty': 'Country is required',
                'string.min': 'Country must not be empty',
                'string.max': 'Country must be less than 100 characters',
                'any.required': 'Country is required'
            })
    }).required()
});

module.exports = { listingSchema };