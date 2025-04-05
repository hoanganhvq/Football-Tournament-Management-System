const Team = require('../models/teamModel');
const Player = require('../models/playerModel');
const Match = require('../models/matchModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
// get all teams
const getTeams = async (req, res) => {
  console.log("get teams"); // Fixed typo
  try {
    const teams = await Team.find().populate('createdBy').populate('players');
    res.set('Cache-Control', 'no-store'); // Prevents caching entirely
    return res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//getTeamById
const getTeamById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid Team ID' });
  }
  try {
    const team = await Team.findById(id).populate('createdBy').populate('players');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    return res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//Get A lot of teams by Id array
const getTeamsById = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.some(id => !mongoose.Types.ObjectId.isValid(id))) {
    return res.status(400).json({ error: 'Invalid IDs' });
  }
  try {

    const teams = await Team.find({ _id: { $in: ids } }).populate('createdBy');
    if (teams.length === 0) {
      return res.status(404).json({ message: "Team not found" });
    }
    return res.status(200).json({ teams });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//createTeam
const createTeam = async (req, res) => {
  const userId = req.user._id;

  console.log('Received payload:', req.body);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log("user", user);
    if (user.team) {
      return res.status(409).json({ message: 'User already has a team' });
    }
    // Tạo team mới
    const team = new Team(req.body);
    const savedTeam = await team.save();
    user.team = savedTeam._id;
    await user.save();

    res.status(201).json(savedTeam); // Trả về team đã lưu thay vì team gốc
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// update team
const updateTeam = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid Team ID' });
  }

  try {
    await Team.findByIdAndUpdate(id, req.body);
    res.status(200).json({ message: 'Team updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// delete team
const deleteTeam = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid Team ID' });
  }
  try {
    await Team.findByIdAndDelete(id);
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//addPlayer 
const addPlayerIntoTeam = async (req, res) => {
  console.log("here");
  const { id } = req.params;
  const { playerData } = req.body;
  console.log("playerData", playerData);
  try {
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const player = new Player(playerData);

    const savedPlayer = await player.save();
    team.members += 1;
    team.players.push(savedPlayer._id);
    await team.save();
    res.status(201).json(savedPlayer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const toReckonTeam = async (req, res) => {
  const { id } = req.params; // Team's id

  try {
    // Find all matches where the team is either team1 or team2
    const matches = await Match.find({
      $or: [{ team1: id }, { team2: id }]
    }).populate('team1').populate('team2');

    if (!matches || matches.length === 0) {
      return res.status(404).json({ message: 'No matches found for this team' });
    }

    // Calculate wins
    const winMatch = matches.filter(match => match.winner.toString() === id);

    const lossMatch = matches.filter(match =>
      match.winner &&
      match.winner.toString() !== id &&
      (match.team1._id.toString() === id || match.team2._id.toString() === id)
    );

    // Calculate winning rate (handle division by zero)
    const totalMatches = winMatch.length + lossMatch.length;
    const winningRate = totalMatches > 0
      ? (winMatch.length / totalMatches) * 100
      : 0;

    // Calculate goals against
    const goalsAgainstScore = matches.reduce((total, match) => {
      if (match.team1._id.toString() === id) {
        return total + (match.scoreTeam2 || 0);
      } else {
        return total + (match.scoreTeam1 || 0);
      }
    }, 0);

    // Calculate goals for
    const goalsForScore = matches.reduce((total, match) => {
      if (match.team1._id.toString() === id) {
        return total + (match.scoreTeam1 || 0);
      } else {
        return total + (match.scoreTeam2 || 0);
      }
    }, 0);

    // Calculate yellow cards
    const numberOfYellowCard = matches.reduce((total, match) => {
      if (match.team1._id.toString() === id) {
        return total + (match.yellowCardsTeam1 || 0);
      } else {
        return total + (match.yellowCardsTeam2 || 0);
      }
    }, 0);

    // Calculate red cards
    const numberOfRedCard = matches.reduce((total, match) => {
      if (match.team1._id.toString() === id) {
        return total + (match.redCardsTeam1 || 0);
      } else {
        return total + (match.redCardsTeam2 || 0);
      }
    }, 0);

    const statistic = {
      wins: winMatch.length,
      losses: lossMatch.length,
      totalMatches: matches.length,
      winningRate: Number(winningRate.toFixed(2)), // Round to 2 decimal places
      goalsFor: goalsForScore,
      goalsAgainst: goalsAgainstScore,
      yellowCards: numberOfYellowCard,
      redCards: numberOfRedCard,
    };
    res.status(200).json(statistic);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to reckon team statistics'
    });
  }

  // {
  //   "success": true,
  //   "data": {
  //     "wins": 5,
  //     "losses": 3,
  //     "totalMatches": 10,
  //     "winningRate": 62.50,
  //     "goalsFor": 15,
  //     "goalsAgainst": 10,
  //     "yellowCards": 8,
  //     "redCards": 2,
  //     "matches": [/* array of match objects */]
  //   }
  // }

};
const getTeamByUserId = async(req, res)=>{
  const userId = req.user._id;
  try{
    const teams = await Team.find({createdBy: userId}).populate('players');
    console.log("teams: ", teams);
    res.status(200).json(teams);
  }catch(error){
    res.status(500).json({message: error.message});
  }
}
module.exports = { getTeamByUserId, toReckonTeam, addPlayerIntoTeam, getTeams, createTeam, getTeamById, updateTeam, deleteTeam, getTeamsById };