const Round = require('../models/roundModel');

const createRound = async (req, res) => {
    try {
        const { name, roundNumber, tournament } = req.body;
        const round = await Round.create({ name, roundNumber, tournament });
        res.status(201).json(round);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

  
  module.exports = { createRound };