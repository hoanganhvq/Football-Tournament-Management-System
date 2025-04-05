const Match = require('../models/matchModel');
const Group = require('../models/groupModel');
const mongoose = require('mongoose');

//Create new match
const createMatch = async (req, res) => {
  const match = new Match(req.body);
  try {
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
const createMatchRound = async (req, res) => {
  const { matches } = req.body;
  try {
    const createdMatch = await Match.insertMany(matches);
    res.status(201).json(createdMatch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//Get all matches
const getMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    if (matches.length === 0) {
      return res.status(404).json({ message: 'No matches found' });
    }

    res.status(200).json(matches)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


//Get match by ID
const getMatchById = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid match ID' });
  }
  try {
    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Update match
const updateMatchForRound = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid Team ID' });
  }

  try {
    const existingMatch = await Match.findById(id);
    if (!existingMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    const matchData = { ...req.body };
    const { scoreTeam1, scoreTeam2, penaltyTeam1, penaltyTeam2} = matchData;

    let winner = null;
    if (scoreTeam1 > scoreTeam2) {
      winner = existingMatch.team1;
    } else if (scoreTeam2 > scoreTeam1) {
      winner = existingMatch.team2;
    } else if (penaltyTeam1 > penaltyTeam2) {
      winner = existingMatch.team1;
    } else if (penaltyTeam2 > penaltyTeam1) {
      winner = existingMatch.team2;
    }
    matchData.winner = winner ? winner._id : null;

    // Cập nhật trận đấu
   await Match.findByIdAndUpdate(
      id,
      matchData,
      { new: true }
    ).populate('team1 team2 group');
    res.status(200).json({ message: 'Match Update successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}



const updateMatch2 = async (req, res) => {
  const { id } = req.params;

  try {
    // Tìm trận đấu hiện tại
    const existingMatch = await Match.findById(id);
    if (!existingMatch) {
      return res.status(404).json({ message: 'Match not found' });
    }

    // Xác định đội thắng dựa trên dữ liệu mới từ req.body
    const matchData = { ...req.body };
    const { scoreTeam1, scoreTeam2, penaltyTeam1, penaltyTeam2, yellowCardsTeam1, yellowCardsTeam2, redCardsTeam1, redCardsTeam2 } = matchData;

    let winner = null;
    if (scoreTeam1 > scoreTeam2) {
      winner = existingMatch.team1;
    } else if (scoreTeam2 > scoreTeam1) {
      winner = existingMatch.team2;
    } else if (penaltyTeam1 > penaltyTeam2) {
      winner = existingMatch.team1;
    } else if (penaltyTeam2 > penaltyTeam1) {
      winner = existingMatch.team2;
    }
    matchData.winner = winner ? winner._id : null;

    // Cập nhật trận đấu
    const updatedMatch = await Match.findByIdAndUpdate(
      id,
      matchData,
      { new: true }
    ).populate('team1 team2 group');

    // Tìm group liên quan
    const group = await Group.findById(updatedMatch.group);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Cập nhật stats cho team1 và team2
    const team1Stats = group.teams.find(t => t.team.toString() === updatedMatch.team1._id.toString());
    const team2Stats = group.teams.find(t => t.team.toString() === updatedMatch.team2._id.toString());

    if (team1Stats && team2Stats) {
      if (existingMatch.status !== 'Finished' && updatedMatch.status === 'Finished') {
        team1Stats.matchesPlayed += 1;
        team2Stats.matchesPlayed += 1;

        if (winner && winner._id.toString() === updatedMatch.team1._id.toString()) {
          team1Stats.wins += 1;
          team2Stats.losses += 1;
          team1Stats.points += 3;
        } else if (winner && winner._id.toString() === updatedMatch.team2._id.toString()) {
          team2Stats.wins += 1;
          team1Stats.losses += 1;
          team2Stats.points += 3;
        } else {
          team1Stats.draws += 1;
          team2Stats.draws += 1;
          team1Stats.points += 1;
          team2Stats.points += 1;
        }
      }

      team1Stats.goalsFor = (scoreTeam1 || 0);
      team1Stats.goalsAgainst = (scoreTeam2 || 0);
      team2Stats.goalsFor = (scoreTeam2 || 0);
      team2Stats.goalsAgainst = (scoreTeam1 || 0);

      team1Stats.yellowCards = (yellowCardsTeam1 || 0);
      team1Stats.redCards = (redCardsTeam1 || 0);
      team2Stats.yellowCards = (yellowCardsTeam2 || 0);
      team2Stats.redCards = (redCardsTeam2 || 0);


      group.updatedAt = new Date();
      await group.save();
    }

    res.status(200).json(updatedMatch);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to update match' });
  }
};

//Delete Match
const deleteMatch = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid Team ID' });
  }
  try {
    await Match.findByIdAndDelete(id);
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const getMatchesByTournamentId = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'Invalid tournament ID' });
  }
  try {
    const match = await Match.find({ tournament: id }).populate('team1').populate('team2').populate('group');
    res.status(200).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const calculateAllForMatch = async (req, res) => {
  const { id } = req.params; // Tournament id
  try {
    const totalMatch = await Match.countDocuments({ tournament: id });
    const matches = await Match.find({ tournament: id })
      .populate('team1')
      .populate('team2');

    const totalGoals = matches.reduce((total, match) =>
      total + match.scoreTeam1 + match.scoreTeam2, 0);
    const totalYellowCard = matches.reduce((total, match) =>
      total + match.yellowCardsTeam1 + match.yellowCardsTeam2, 0);
    const totalRedCard = matches.reduce((total, match) =>
      total + match.redCardsTeam1 + match.redCardsTeam2, 0);

    let max = 0;
    const setData = {
      team1: null,
      team2: null,
      scoreTeam1: 0,
      scoreTeam2: 0
    };

    for (const match of matches) {
      const total = match.scoreTeam1 + match.scoreTeam2;
      if (total >= max) {
        setData.team1 = match.team1;
        setData.team2 = match.team2;
        setData.scoreTeam1 = match.scoreTeam1;
        setData.scoreTeam2 = match.scoreTeam2;
        max = total;
      }
    }
    const state = {
      totalMatch,
      totalGoals,
      totalYellowCard,
      totalRedCard,
      setData
    };

    res.status(200).json(state);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Export winner of the final
const getWinnerAndRunner = async (req, res) => {
  const { id } = req.params;
  const { round } = req.body;
  console.log('Req Body Final: ', req.body);
  try {
      if (!id || round === undefined) {
          return res.status(400).json({ message: "Tournament ID and round number are required" });
      }

      const matches = await Match.find({ tournament: id, round })
          .populate('team1 team2 winner')
          .lean();

      if (!matches?.length) {
          return res.status(404).json({ 
              message: `No matches found for tournament ${id} in round ${round}` 
          });
      }

      const finalMatch = matches[0];

      if (!finalMatch.winner) {
          return res.status(404).json({ 
              message: "Winner not determined for this match" 
          });
      }

      const exportData = {
          winner: finalMatch.winner,
          runnerUp: finalMatch.winner.toString() === finalMatch.team1?.toString()
              ? finalMatch.team2
              : finalMatch.team1,
      };

      return res.status(200).json({ 
          message: "Success", 
          data: exportData 
      });
  } catch (error) {
      console.error('Error in getWinnerAndRunner:', error);
      return res.status(500).json({ 
          message: "Server error", 
          error: error.message 
      });
  }
};

const getThirdPlace = async (req, res) => {
  const { id } = req.params;
  const {round}  = req.body;
  console.log('Req body: ', req.body);
  try {
      if (!id || round === undefined) {
          return res.status(400).json({ 
              message: "Tournament ID and round number are required" 
          });
      }

      const matches = await Match.find({ tournament: id, round })
          .populate('team1 team2 winner')
          .lean();

      if (!matches?.length) {
          return res.status(404).json({ 
              message: `No matches found for tournament ${id} in round ${round}` 
          });
      }

      const thirdPlaceMatch = matches[0];

      if (!thirdPlaceMatch.winner) {
          return res.status(404).json({ 
              message: "Third place not determined for this match" 
          });
      }

      return res.status(200).json(thirdPlaceMatch.winner);
  } catch (error) {
      console.error('Error in getThirdPlace:', error);
      return res.status(500).json({ 
          message: "Server error", 
          error: error.message 
      });
  }
};



module.exports = {getWinnerAndRunner,getThirdPlace, calculateAllForMatch, createMatchRound, createMatch, getMatches, getMatchById, updateMatchForRound, updateMatch2, deleteMatch, getMatchesByTournamentId };
