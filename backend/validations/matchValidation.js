const Joi = require('joi');

const matchValidationSchema = Joi.object({
    team1: Joi.string().hex().length(24).optional().messages({
        'any.required': 'team1 is required',
        'string.hex': 'team1 must be a valid hexadecimal string'
    }),

    team2: Joi.string().hex().length(24).optional().messages({
        'any.required': 'team2 is required',
        'string.hex': 'team2 must be a valid hexadecimal string'
    }),
    matchDate: Joi.date().iso().required().messages({
        'any.required': 'matchDate is required',
        'date.iso': 'matchDate must be a valid ISO 8601 date'
    }),
    matchVenue: Joi.string().required().messages({
        'any.required': 'matchVenue is required'
    }),
    matchTime: Joi.date().required().messages({
        'any.required': 'matchTime is required'
    }),


    tournament: Joi.string().hex().length(24).optional().messages({
        'any.required': 'tournament is required',
        'string.hex': 'tournament must be a valid hexadecimal string'
    }),

    createdAt: Joi.date().iso().optional().messages({
        'date.iso': 'createdAt must be a valid ISO 8601 date'
    })

})

const validateMatch = (req, res, next) =>{
    const {error} = matchValidationSchema.validate(req.body, {abortEarly: false});// Don't stop when meet bug
    if(error){
        return res.status(400).json({error: error.details[0].message});
    }
    next();
}

module.exports = validateMatch;