const Joi = require("joi");

// Joi schema for listing validation
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s\-',\.#\/&!()]+$/)
      .custom((value, helpers) => {
        // Reject if purely numeric
        if (/^\d+$/.test(value.trim())) {
          return helpers.error("title.purelyNumeric");
        }
        // Must contain at least one letter
        if (!/[a-zA-Z]/.test(value)) {
          return helpers.error("title.noLetters");
        }
        return value;
      })
      .messages({
        "string.empty": "Title is required",
        "string.min": "Title must not be empty",
        "string.max": "Title must be less than 100 characters",
        "string.pattern.base":
          "Title can contain letters, numbers, spaces, and common punctuation",
        "title.purelyNumeric":
          "Title cannot be just numbers - must describe the property",
        "title.noLetters":
          "Title must contain at least some letters to describe the property",
        "any.required": "Title is required",
      }),

    description: Joi.string().required().trim().min(1).max(1000).messages({
      "string.empty": "Description is required",
      "string.min": "Description must not be empty",
      "string.max": "Description must be less than 1000 characters",
      "any.required": "Description is required",
    }),

    // Image field - file upload is handled separately by middleware
    image: Joi.any().optional(),

    price: Joi.number().required().positive().precision(2).messages({
      "number.base": "Price must be a valid number",
      "number.positive": "Price must be a positive number",
      "any.required": "Price is required",
    }),

    location: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s\-',\.#\/]+$/)
      .custom((value, helpers) => {
        // Only reject if it's purely numeric (like "123" or "456")
        if (/^\d+$/.test(value.trim())) {
          return helpers.error("location.purelyNumeric");
        }
        // Must contain at least one letter
        if (!/[a-zA-Z]/.test(value)) {
          return helpers.error("location.noLetters");
        }
        return value;
      })
      .messages({
        "string.empty": "Location is required",
        "string.min": "Location must not be empty",
        "string.max": "Location must be less than 100 characters",
        "string.pattern.base":
          "Location can contain letters, numbers, spaces, hyphens, apostrophes, commas, periods, # and /",
        "location.purelyNumeric":
          "Location cannot be just numbers - must include street name or area",
        "location.noLetters": "Location must contain at least some letters",
        "any.required": "Location is required",
      }),

    country: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z\s\-',\.]+$/)
      .custom((value, helpers) => {
        // Additional check: reject if it's purely numeric (even as string)
        if (/^\d+$/.test(value.trim())) {
          return helpers.error("country.numeric");
        }
        // Reject if it contains any digits
        if (/\d/.test(value)) {
          return helpers.error("country.containsNumbers");
        }
        return value;
      })
      .messages({
        "string.empty": "Country is required",
        "string.min": "Country must not be empty",
        "string.max": "Country must be less than 100 characters",
        "string.pattern.base":
          "Country must contain only letters, spaces, hyphens, apostrophes, commas, and periods",
        "country.numeric": "Country cannot be just numbers",
        "country.containsNumbers": "Country cannot contain any numbers",
        "any.required": "Country is required",
      }),
    category: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconic-cities",
        "mountains",
        "castle",
        "pools",
        "camping",
        "farmhouse",
        "arctic",
        "boats",
        "deserts"
      )
      .required(),
  }).required(),
});

// Schema for updating listings where image is optional
module.exports.listingUpdateSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s\-',\.#\/&!()]+$/)
      .custom((value, helpers) => {
        // Reject if purely numeric
        if (/^\d+$/.test(value.trim())) {
          return helpers.error("title.purelyNumeric");
        }
        // Must contain at least one letter
        if (!/[a-zA-Z]/.test(value)) {
          return helpers.error("title.noLetters");
        }
        return value;
      })
      .messages({
        "string.empty": "Title is required",
        "string.min": "Title must not be empty",
        "string.max": "Title must be less than 100 characters",
        "string.pattern.base":
          "Title can contain letters, numbers, spaces, and common punctuation",
        "title.purelyNumeric":
          "Title cannot be just numbers - must describe the property",
        "title.noLetters":
          "Title must contain at least some letters to describe the property",
        "any.required": "Title is required",
      }),

    description: Joi.string().required().trim().min(1).max(1000).messages({
      "string.empty": "Description is required",
      "string.min": "Description must not be empty",
      "string.max": "Description must be less than 1000 characters",
      "any.required": "Description is required",
    }),

    // Image is optional for updates
    image: Joi.any().optional(),

    price: Joi.number().required().positive().precision(2).messages({
      "number.base": "Price must be a valid number",
      "number.positive": "Price must be a positive number",
      "any.required": "Price is required",
    }),

    location: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z0-9\s\-',\.#\/]+$/)
      .custom((value, helpers) => {
        // Only reject if it's purely numeric (like "123" or "456")
        if (/^\d+$/.test(value.trim())) {
          return helpers.error("location.purelyNumeric");
        }
        // Must contain at least one letter
        if (!/[a-zA-Z]/.test(value)) {
          return helpers.error("location.noLetters");
        }
        return value;
      })
      .messages({
        "string.empty": "Location is required",
        "string.min": "Location must not be empty",
        "string.max": "Location must be less than 100 characters",
        "string.pattern.base":
          "Location can contain letters, numbers, spaces, hyphens, apostrophes, commas, periods, # and /",
        "location.purelyNumeric":
          "Location cannot be just numbers - must include street name or area",
        "location.noLetters": "Location must contain at least some letters",
        "any.required": "Location is required",
      }),

    country: Joi.string()
      .required()
      .trim()
      .min(1)
      .max(100)
      .pattern(/^[a-zA-Z\s\-',\.]+$/)
      .custom((value, helpers) => {
        // Additional check: reject if it's purely numeric (even as string)
        if (/^\d+$/.test(value.trim())) {
          return helpers.error("country.numeric");
        }
        // Reject if it contains any digits
        if (/\d/.test(value)) {
          return helpers.error("country.containsNumbers");
        }
        return value;
      })
      .messages({
        "string.empty": "Country is required",
        "string.min": "Country must not be empty",
        "string.max": "Country must be less than 100 characters",
        "string.pattern.base":
          "Country must contain only letters, spaces, hyphens, apostrophes, commas, and periods",
        "country.numeric": "Country cannot be just numbers",
        "country.containsNumbers": "Country cannot contain any numbers",
        "any.required": "Country is required",
      }),

    category: Joi.string()
      .valid(
        "trending",
        "rooms",
        "iconic-cities",
        "mountains",
        "castle",
        "pools",
        "camping",
        "farmhouse",
        "arctic",
        "boats",
        "deserts"
      )
      .required(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      "number.base": "Rating must be a number",
      "number.min": "Rating must be at least 1",
      "number.max": "Rating must be at most 5",
      "any.required": "Rating is required",
    }),
    comment: Joi.string().required().trim().min(1).max(1000).messages({
      "string.empty": "Comment is required",
      "string.min": "Comment must not be empty",
      "string.max": "Comment must be less than 1000 characters",
      "any.required": "Comment is required",
    }),
  }).required(),
});
