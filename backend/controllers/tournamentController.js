const Tournament = require('../models/tournamentModel');
const Team = require('../models/teamModel');
const mongoose = require('mongoose');

//Get all tournament 
const getTournaments = async (req, res) => {
    try {
        const tournaments = await Tournament.find().populate('teams');
        if (tournaments.length === 0) {
            return res.status(404).json({ message: 'Not found tournament' });
        }
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Get Tournament by ID
const getTournamentById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid Tournament Id' })
    }
    try {
        const tournament = await Tournament.findById(id);
        if (!tournament) {
            return res.status(404).json({ message: 'Not found tournament' });
        }

        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


//Create tournament
const createTournament = async (req, res) => {
    const tournament = new Tournament(req.body);
    console.log("Tournament: ", tournament);
    try {
        await tournament.save();
        res.status(201).json(tournament);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//updateTournament 
const updateTournament = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid Tournament Id' })
    }
    try {
        await Tournament.findByIdAndUpdate(id, req.body);
        res.status(200).json({ message: 'Tournament updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

//Delete Tournament 
const deleteTournament = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ message: 'Invalid Tournament Id' })
    }
    try {
        await Tournament.findByIdAndDelete(id);
        res.status(200).json({ message: 'Tournament deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getTournamentByUser = async (req, res) => {
    try {
        console.log("User ID controller:", req.user._id); // Log để debug
        const userId = req.user._id; // Lấy ID của user từ middleware auth
        const tournaments = await Tournament.find({ createdBy: userId }).populate('teams'); // Tìm các Tournament được tạo bởi user và populate trường Team
        res.status(200).json(tournaments); // Trả về danh sách Tournament
    } catch (error) {
        res.status(500).json({ message: error.message }); // Xử lý lỗi
    }
};

const addTeamToTournament = async (req, res) => {
    try {
        const { tournamentId, teamId } = req.body

        if (!tournamentId || !teamId) {
            return res.status(400).json({ message: 'Tournament ID and Team ID are required' });
        }
        const tournament = await Tournament.findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }

        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        } 
        if (tournament.teams.some(t => t.toString() === teamId)) {
            return res.status(400).json({ message: 'Team is already registered in this tournament' });
        }

        // Check team limit
        if (tournament.teams.length >= tournament.number_of_teams) {
            return res.status(400).json({ message: 'Tournament has reached its team limit' });
        }
        tournament.teams.push(teamId);
        await tournament.save();

        res.status(200).json({
            status: 'success',
            message: 'Team added to tournament successfully',
            tournament: {
                _id: tournament._id,
                name: tournament.name,
                teams: tournament.teams,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


// const caculatePlayer = async(req, res)=>{
//     const {id} = req.params;
//     try{
//         const tournament = Tourname
//     }catch(erorr){

//     }
// }
module.exports = { getTournaments, addTeamToTournament, getTournamentById, createTournament, updateTournament, deleteTournament, getTournamentByUser };