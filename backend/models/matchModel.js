const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    matchDate: { type: Date },
    matchTime: { type: Date },
    scoreTeam1: { type: Number, default: 0 },
    scoreTeam2: { type: Number, default: 0 },
    matchVenue: { type: String, required: true },
    penaltyTeam1: { type: Number, default: 0 },
    penaltyTeam2: { type: Number, default: 0 },
    yellowCardsTeam1: { type: Number, default: 0 },
    yellowCardsTeam2: { type: Number, default: 0 },
    redCardsTeam1: { type: Number, default: 0 },
    redCardsTeam2: { type: Number, default: 0 },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    status: {
        type: String,
        enum: ['Scheduled', 'Finished', 'Cancelled'],
        default: 'Scheduled',
      },
    tournament: { type: mongoose.Schema.Types.ObjectId, ref: 'Tournament' },
    createdAt: { type: Date, required: true, default: Date.now },
    round: { type: Number },
    type:{type: String, enum:['Group Stage', 'Knockout']},
})

module.exports = mongoose.model('Match', matchSchema);

