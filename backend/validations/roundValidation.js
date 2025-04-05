const Joi = require('joi');

const roundValidation  = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Round name does not blank',
        'string.min': 'Round name must be at least 3 characters long',
        'string.max': 'Round name cannot be more than 50 characters long',
        'any.required': 'Round name is required'
    }),

    matches: Joi.array().items(Joi.string().hex().length(24)).messages({
        'string.hex': 'Invalid match ID format',
        'string.length': 'Match ID must be 24 characters long'
    }),
    tournament: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid tournament ID format',
        'string.length': 'Tournament ID must be 24 characters long',
        'any.required': 'Tournament ID is required'
    }),
    createdAt: Joi.date().default(Date.now).messages({
        'date.base': 'Invalid date format'
    })
})

const validateRound = (req, res, next) => {
    const { error } = roundValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

module.exports = validateRound; 