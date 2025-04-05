const Group = require('../models/groupModel');
const Match = require('../models/matchModel');
const mongoose = require('mongoose');

//Get all groups of tournament
const getGroupsbyTournament = async (req, res) => {
    const { id } = req.params;
    try {
        const groups = await Group.find({ tournament: id }).populate('teams.team');
        res.status(200).json({ groups });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const createGroupMatches= async (req, res) => {
  try {
    const groups = req.body.groups.groups;
    console.log("Received body: ", JSON.stringify(req.body, null, 2));

    const createdMatches = [];

    for (const group of groups) {
      const { _id: groupId, tournament, teams } = group;

      // Duyệt tất cả cặp đội trong bảng (vòng tròn 1 lượt)
      for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
          const team1 = teams[i].team._id;
          const team2 = teams[j].team._id;

          // Tạo trận đấu (có thể gán ngày giờ và sân mặc định hoặc random)
          const match = new Match({
            group: groupId,
            team1,
            team2,
            matchDate: new Date(), // Bạn có thể thay bằng logic phân bổ lịch
            matchTime: new Date(), // Hoặc chỉ dùng matchDate nếu không tách riêng giờ
            matchVenue: 'Sân vận động trung lập',
            tournament,
            type: 'Group Stage',
          });

          await match.save();
          createdMatches.push(match);
        }
      }
    }

    res.status(201).json({
      message: 'Tạo trận đấu thành công',
      totalMatches: createdMatches.length,
      matches: createdMatches,
    });

  } catch (error) {
    console.error('Error creating matches from groups:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




//Add Group

const addGroup = async (req, res) => {
    const { id } = req.params;
    const { groupIndex, teams } = req.body;


    try {
        if (!id) {
            return res.status(400).json({ error: "Missing tournament ID" });
        }

        const groupName = String.fromCharCode(65 + groupIndex); // 'A', 'B', etc.

        const groupTeams = teams.map(team => ({
            team: team._id || team,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            yellowCards: 0,
            redCards: 0,
            points: 0
        }));

        const newGroup = new Group({
            name: `Bảng ${groupName}`,
            tournament: id,
            teams: groupTeams
        });

        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);

    } catch (error) {
        console.error(' Error creating group:', error);
        res.status(500).json({ error: 'Internal server error', detail: error.message });
    }
};


const updateGroup = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedGroup = await Group.findByIdAndUpdate(id, req.body, { new: true });
        
        res.status(200).json(updatedGroup);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




module.exports = { getGroupsbyTournament, addGroup, updateGroup, createGroupMatches };
