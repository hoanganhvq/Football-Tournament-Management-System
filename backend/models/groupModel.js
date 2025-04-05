const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament', required: true },
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Match' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    teams: [
        {
            team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
            matchesPlayed: { type: Number, default: 0 },
            wins: { type: Number, default: 0 },
            draws: { type: Number, default: 0 },
            losses: { type: Number, default: 0 },
            goalsFor: { type: Number, default: 0 },
            goalsAgainst: { type: Number, default: 0 },
            yellowCards: { type: Number, default: 0 },
            redCards: { type: Number, default: 0 },
            points: { type: Number, default: 0 },
        }
    ]
});

module.exports = mongoose.model('Group', groupSchema);