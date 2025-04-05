const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the book collection
const tournamentSchema = new Schema({
    name: {type: String, required: true},
    logo:{type: String, default: 'defaultTournament.jpg'},
    time_start: {type: Date, required: true, default: Date.now},
    location: {type: String, required: true},
    description:{type: String, required: true},
    format:{type: String, enum: ["Group Stage", "Round Robin"], required: true},
    number_of_member:{type:Number,required: true},
    number_of_team_advances:{type:Number},
    number_of_teams: {type:Number, required: true, default: 1},
    number_of_group:{type: Number, required: true, default:1},
    is_Divided_Group:{type: Boolean, required: false, default: false},
    isGroupMatchesCreated:{type: Boolean, required: false, default: false},
    teams:[{type: mongoose.Schema.Types.ObjectId,ref:'Team'}],
    status: {
        type: String,
        enum: ['Upcoming', 'Ongoing', 'Ended'],
        default: 'Upcoming',
      },
    createdBy: {type: mongoose.Schema.Types.ObjectId,ref:'User'},
    createdAt:{type: Date, required: true, default: Date.now},
    
})

module.exports = mongoose.model('Tournament', tournamentSchema);