const mongoose = require('mongoose');

const playerSchema  = new mongoose.Schema({
    name: {type: String, required: true},
    avatar: {type: String, default: "defaultPlayer.jpg"},
    position: {type: String, required: true},
    number: {type: Number, required: true},
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'Team'},
    birthDate: { type: Date },
    isCaptain: { type: Boolean, default: false },
    goal:{type: Number, default: 0}

})

module.exports = mongoose.model('Player', playerSchema);