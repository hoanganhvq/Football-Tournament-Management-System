const Joi = require('joi');

const groupValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).messages({
        'string.empty': 'Group name does not blank',
        'string.min': 'Group name must be at least 3 characters long',
        'string.max': 'Group name cannot be more than 50 characters long',
    }),
    matches: Joi.array().items(Joi.string().hex().length(24)).messages({
        'string.hex': 'Invalid match ID format',
        'string.length': 'Match ID must be 24 characters long'
    }),

    createdAt: Joi.date().default(Date.now).messages({
        'date.base': 'Invalid date format'
    }),
    teams: Joi.array().items(
        Joi.object({
            team: Joi.string().hex().length(24).required().messages({
                'string.hex': 'Invalid team ID format',
                'string.length': 'Team ID must be 24 characters long',
                'any.required': 'Team ID is required'
            }),
            matchesPlayed: Joi.number().min(0).default(0),
            wins: Joi.number().min(0).default(0),
            draws: Joi.number().min(0).default(0),
            losses: Joi.number().min(0).default(0),
            goalsFor: Joi.number().min(0).default(0),
            goalsAgainst: Joi.number().min(0).default(0),
            goalDifference: Joi.number().default(0),
            yellowCards: Joi.number().min(0).default(0),
            redCards: Joi.number().min(0).default(0),
            points: Joi.number().min(0).default(0)
        })
    ).required().messages({
        'array.base': 'Teams must be an array',
        'any.required': 'Teams field is required'
    })
});

const validateGroup = (req, res, next) => {
    const { error, value } = groupValidationSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });
    next();
};

module.exports = validateGroup;
