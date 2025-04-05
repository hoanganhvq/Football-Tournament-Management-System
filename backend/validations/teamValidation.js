const Joi = require('joi');

const teamValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Team name dones not blank',
        'string.min': 'Team name must be at least 3 characters long',
        'string.max': 'Team name cannot be more than 50 characters long',
        'any.required': 'Team name is required'
    }),

    logo: Joi.string().optional().required().messages({
        'string.empty': 'Team logo cannot be empty',
    }),

    description: Joi.string().optional().max(255).messages({
        'string.max': 'Team description cannot be more than 255 characters long'
    }),

    location: Joi.string().optional().max(255).messages({
        'string.max': 'Team location cannot be more than 255 characters long'
    }),

    players: Joi.array().items(Joi.string().hex().length(24)).optional().messages({
        'string.hex': 'Invalid player Id format',
        'string.length': 'Invalid player Id format'
    }),

    jersey_color: Joi.array().items(Joi.string().pattern(/^#([A-Fa-f0-9]{6})$/)).optional().messages({
        'string.pattern.base': 'Invalid jersey color format'
    }),
    createdBy: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid user ID format',
        'string.length': 'User ID must be 24 characters long',
        'any.required': 'CreatedBy field is required'
    }),

    createdAt: Joi.date().default(Date.now).messages({
        'date.base': 'Invalid date format'
    })
})

const validateTeam = async(req, res, next)=>{
    const {error} = teamValidationSchema.validate(req.body, {abortEarly: false});// Don't stop when meet bug
    if(error) return res.status(400).json({error: error.details[0].message});
    next();
}

module.exports = validateTeam;