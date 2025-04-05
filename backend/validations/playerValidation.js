const Joi = require('joi');

// Define playerSchema
const playerValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.empty': 'Player name dones not blank',
        'string.min': 'Player name must be at least 3 characters long',
        'string.max': 'Player name cannot be more than 50 characters long',
        'any.required': 'Player name is required'
    }),

    avatar: Joi.string().required().messages({
        'string.empty': 'Player avatar dones not blank',
        'any.required': 'Player avatar is required'
    }),

    position: Joi.string().required().valid('Goalkeeper' ,'Defender','Midfielder', 'Forward').messages({
        'any.required': 'Player position is required',
        'any.only': 'Player position must be either Goalkeeper, Defender, Midfielder, or Forward'
    }),

    number: Joi.number().min(1).max(99).required().messages({
        'number.empty': 'Player number does not blank',
        'number.min': 'Player number must be at least 1',
        'number.max': 'Player number cannot be more than 99',
        'any.required': 'Player number is required'
    }),

    team: Joi.string().hex().length(24).optional().messages({
        'string.hex': 'Invalid team ID',
        'string.length': 'Invalid team ID length'
    }),
    birthDate: Joi.date().iso().optional().messages({
        'date.iso': 'Invalid date format'
    }),
    isCaptain: Joi.boolean().optional().messages({
        'boolean.base': 'Invalid isCaptain format'
    }),
    goals: Joi.number().optional().messages({
        'number.base': 'Invalid goals format'
    })
})


const validatePlayer = (req, res, next) => {
    const {error} = playerValidationSchema.validate(req.body,{abortEarly: false});
    if(error){
        return res.status(400).json({message: error.details[0].message});
    }
    next();
}

module.exports = validatePlayer;