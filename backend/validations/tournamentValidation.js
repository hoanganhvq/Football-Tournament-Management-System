const Joi = require('joi');

const tournamentValidationSchema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Tournament name cannot be blank',
        'string.min': 'Tournament name must be at least 3 characters long',
        'string.max': 'Tournament name cannot be more than 100 characters long',
        'any.required': 'Tournament name is required'
    }),

    logo: Joi.string().optional().pattern(/\.(jpg|jpeg|png|gif)$/i).messages({
        'string.pattern.base': 'Invalid logo format. Only JPG, JPEG, PNG, and GIF are allowed'
    }),

    time_start: Joi.date().greater('now').required().messages({
        'date.base': 'Invalid date format',
        'date.greater': 'Start time must be in the future',
        'any.required': 'Start time is required'
    }),

    location: Joi.string().min(3).max(255).required().messages({
        'string.empty': 'Location cannot be blank',
        'string.min': 'Location must be at least 3 characters long',
        'string.max': 'Location cannot be more than 255 characters long',
        'any.required': 'Location is required'
    }),

    description: Joi.string().min(10).max(500).required().messages({
        'string.empty': 'Description cannot be blank',
        'string.min': 'Description must be at least 10 characters long',
        'string.max': 'Description cannot be more than 500 characters long',
        'any.required': 'Description is required'
    }),

    format: Joi.string().valid("Group Stage", "Round-Robin").required().messages({
        'any.only': 'Format must be either "Group Stage" or "Round-Robin"',
        'any.required': 'Tournament format is required'
    }),

    number_of_group: Joi.number().integer().min(1).required().messages({
        'number.base': 'Number of groups must be a valid number',
        'number.min': 'There must be at least 1 group', 
    }),
    is_Divided_Group: Joi.boolean().required().messages({
        'any.required': 'is_Divided_Group is required'
    }),

    number_of_member: Joi.number().integer().min(5).max(50).required().messages({
        'number.base': 'Number of members must be a valid number',
        'number.min': 'Each team must have at least 5 members',
        'number.max': 'Each team cannot have more than 50 members',
        'any.required': 'Number of members is required'
    }),

    number_of_rounds: Joi.number().integer().min(1).required().messages({
        'number.base': 'Number of rounds must be a valid number',
        'number.min': 'There must be at least 1 round',
        'any.required': 'Number of rounds is required'
    }),

    number_of_team_advances: Joi.number().integer().min(1).optional().messages({
        'number.base': 'Number of advancing teams must be a valid number',
        'number.min': 'At least one team must advance'
    }),

    number_of_teams: Joi.number().integer().min(2).required().messages({
        'number.base': 'Number of teams must be a valid number',
        'number.min': 'There must be at least 2 teams in the tournament',
        'any.required': 'Number of teams is required'
    }),

    teams: Joi.array().items(Joi.string().hex().length(24)).optional().messages({
        'string.hex': 'Invalid team ID format',
        'string.length': 'Team ID must be 24 characters long'
    }),
    status: Joi.string()
    .valid('Upcoming', 'Ongoing', 'Ended')
    .optional()
    .messages({
      'any.only': 'Status must be Upcoming, Ongoing, or Ended',
    }),

    createdBy: Joi.string().hex().length(24).required().messages({
        'string.hex': 'Invalid user ID format',
        'string.length': 'User ID must be 24 characters long',
        'any.required': 'CreatedBy field is required'
    }),

    createdAt: Joi.date().default(Date.now).messages({
        'date.base': 'Invalid date format'
    })
});

const validateTournament = (req, res, next) => {
    const { error } = tournamentValidationSchema.validate(req.body, { abortEarly: false }); // Validate all errors
    if (error) {
        return res.status(400).json({ error: error.details.map(err => err.message) });
    }
    
    next();
};

module.exports = validateTournament;
