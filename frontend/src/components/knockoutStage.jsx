import React, { useState, useEffect, useRef } from "react";
import {
  getMatchesByTournamentId,
  createMatches,
  updateMatch,
} from "../api/matchAPI";

const KnockoutStage = ({ tournament, teams }) => {
  console.log("tournament: ", tournament);
  console.log("teams: ", teams);

  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingMatchId, setEditingMatchId] = useState(null);
  const [editForm, setEditForm] = useState({
    team1: "",
    team2: "",
    scoreTeam1: "",
    scoreTeam2: "",
    penaltyTeam1: "",
    penaltyTeam2: "",
    matchVenue: "",
    matchDate: "",
    matchTime: "",
    status: "Scheduled",
  });

  const hasRun = useRef(false);

  const initializePlaceholderRounds = (teamCount) => {
    const roundConfig = {
      16: [8, 4, 2, 1, 1],
      8: [4, 2, 1, 1],
      4: [2, 1, 1],
      2: [1, 1],
    }[teamCount] || [1];

    const roundNames = ["Vòng 1/8", "Tứ kết", "Bán kết", "Chung kết", "Trận tranh hạng ba"];
    const startIndex = { 16: 0, 8: 1, 4: 2, 2: 3 }[teamCount] || 3;

    const rounds = [];
    let matchIndex = 0;

    roundConfig.forEach((matchCount, index) => {
      const roundMatches = Array.from({ length: matchCount }, (_, i) => {
        matchIndex++;
        return {
          _id: `placeholder-${index + 1}-${i}`,
          team1: null,
          team2: null,
          scoreTeam1: null,
          scoreTeam2: null,
          penaltyTeam1: null,
          penaltyTeam2: null,
          matchDate: null,
          matchTime: null,
          matchVenue: "Chưa xác định",
          round: index === roundConfig.length - 1 && teamCount >= 4 ? 0 : index + 1,
          tournament: tournament._id,
          status: "Scheduled",
          createdAt: new Date(),
          type: "Knockout",
        };
      });
      rounds.push({
        name: roundNames[startIndex + index],
        roundNumber: index === roundConfig.length - 1 && teamCount >= 4 ? 0 : index + 1,
        matches: roundMatches,
      });
    });

    return rounds;
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const setupKnockoutStage = async () => {
      const teamCount = tournament.number_of_team_advances || 16;
      setRounds(initializePlaceholderRounds(teamCount));
      setLoading(true);

      try {
        const allMatches = await getMatchesByTournamentId(tournament._id);
        const knockoutMatches = allMatches.filter(
          (match) => match.type === "Knockout" && match.round >= 0
        );
        const totalExpectedMatches = getTotalMatches(teamCount);
        let matches = knockoutMatches;

        console.log("Existing knockout matches:", knockoutMatches.length);
        console.log("Total expected matches:", totalExpectedMatches);

        if (knockoutMatches.length < totalExpectedMatches) {
          matches = await generateKnockoutMatches(
            teamCount,
            tournament._id,
            totalExpectedMatches - knockoutMatches.length
          );
        }
        const updatedRounds = organizeMatchesIntoRounds(matches, teamCount);
        setRounds(updatedRounds);
      } catch (error) {
        console.error("Error setting up knockout stage:", error);
      } finally {
        setLoading(false);
      }
    };

    setupKnockoutStage();
    const user = localStorage.getItem("user");
    setCurrentUserId(user ? JSON.parse(user).id : null);
  }, [tournament._id, tournament.number_of_team_advances]);

  const getTotalMatches = (teamCount) => {
    return teamCount;
  };

  const generateKnockoutMatches = async (teamCount, tournamentId, missingMatchesCount) => {
    const roundConfig = {
      16: [8, 4, 2, 1, 1],
      8: [4, 2, 1, 1],
      4: [2, 1, 1],
      2: [1, 1],
    }[teamCount] || [1];

    const newMatches = [];
    let remainingMatches = missingMatchesCount;

    for (let i = 0; i < roundConfig.length && remainingMatches > 0; i++) {
      const matchesInRound = Math.min(roundConfig[i], remainingMatches);
      for (let j = 0; j < matchesInRound; j++) {
        newMatches.push({
          tournament: tournamentId,
          round: i === roundConfig.length - 1 && teamCount >= 4 ? 0 : i + 1,
          matchVenue: "Chưa xác định",
          status: "Scheduled",
          team1: null,
          team2: null,
          scoreTeam1: null,
          scoreTeam2: null,
          penaltyTeam1: null,
          penaltyTeam2: null,
          matchDate: null,
          matchTime: null,
          type: "Knockout",
        });
        remainingMatches--;
      }
    }

    console.log("New matches to create:", newMatches.length);

    try {
      if (newMatches.length > 0) {
        const createdMatches = await createMatches(newMatches);
        const allMatches = await getMatchesByTournamentId(tournamentId);
        return allMatches
          .filter((match) => match.type === "Knockout" && match.round >= 0)
          .slice(0, teamCount);
      }
      return (await getMatchesByTournamentId(tournamentId))
        .filter((match) => match.type === "Knockout" && match.round >= 0)
        .slice(0, teamCount);
    } catch (error) {
      console.error("Failed to create matches via API:", error);
      return newMatches;
    }
  };

  const organizeMatchesIntoRounds = (matches, teamCount) => {
    const roundConfig = {
      16: [8, 4, 2, 1, 1],
      8: [4, 2, 1, 1],
      4: [2, 1, 1],
      2: [1, 1],
    }[teamCount] || [1];

    const roundNames = ["Vòng 1/8", "Tứ kết", "Bán kết", "Trận tranh hạng ba", "Chung kết"];
    const startIndex = { 16: 0, 8: 1, 4: 2, 2: 3 }[teamCount] || 3;

    const rounds = [];
    let matchIndex = 0;

    roundConfig.forEach((matchCount, index) => {
      const roundNumber = index === roundConfig.length - 1 && teamCount >= 4 ? 0 : index + 1;
      const roundMatches = matches
        .filter((match) => match.round === roundNumber)
        .slice(0, matchCount);
      if (roundMatches.length > 0) {
        rounds.push({
          name: roundNames[startIndex + index],
          roundNumber,
          matches: roundMatches,
        });
      }
      matchIndex += matchCount;
    });

    return rounds;
  };

  const isAdmin = currentUserId && currentUserId === tournament.createdBy?.toString();

  const handleEditClick = (match) => {
    setEditingMatchId(match._id);
    setEditForm({
      team1: match.team1?._id || match.team1 || "",
      team2: match.team2?._id || match.team2 || "",
      scoreTeam1: match.scoreTeam1 || "",
      scoreTeam2: match.scoreTeam2 || "",
      penaltyTeam1: match.penaltyTeam1 || "",
      penaltyTeam2: match.penaltyTeam2 || "",
      matchVenue: match.matchVenue || "Chưa xác định",
      matchDate: match.matchDate ? new Date(match.matchDate).toISOString().split("T")[0] : "",
      matchTime: match.matchTime ? new Date(match.matchTime).toISOString().substr(11, 5) : "",
      status: match.status || "Scheduled",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const updatedMatch = {
        team1: editForm.team1 || null,
        team2: editForm.team2 || null,
        scoreTeam1: editForm.scoreTeam1 ? parseInt(editForm.scoreTeam1) : null,
        scoreTeam2: editForm.scoreTeam2 ? parseInt(editForm.scoreTeam2) : null,
        penaltyTeam1: editForm.penaltyTeam1 ? parseInt(editForm.penaltyTeam1) : null,
        penaltyTeam2: editForm.penaltyTeam2 ? parseInt(editForm.penaltyTeam2) : null,
        matchVenue: editForm.matchVenue || "Chưa xác định",
        matchDate: editForm.matchDate ? `${editForm.matchDate}T00:00:00Z` : null,
        matchTime: editForm.matchTime
          ? new Date(`1970-01-01T${editForm.matchTime}:00Z`).toISOString()
          : null,
        status: editForm.status,
      };
      await updateMatch(editingMatchId, updatedMatch);
      const refreshedMatches = await getMatchesByTournamentId(tournament._id);
      setRounds(
        organizeMatchesIntoRounds(
          refreshedMatches
            .filter((m) => m.type === "Knockout" && m.round >= 0)
            .slice(0, tournament.number_of_team_advances || 16),
          tournament.number_of_team_advances || 16
        )
      );
      setEditingMatchId(null);
    } catch (error) {
      console.error("Error saving match:", error);
      alert("Không thể lưu trận đấu. Vui lòng thử lại.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa xác định";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getTeamName = (teamIdOrObject) => {
    if (!teamIdOrObject) return "TBD";
    if (typeof teamIdOrObject === "string") {
      const team = teams.find((t) => t._id === teamIdOrObject);
      return team ? team.name : "TBD";
    }
    if (typeof teamIdOrObject === "object" && teamIdOrObject.name) {
      return teamIdOrObject.name;
    }
    return "TBD";
  };

  const availableTeamsForTeam1 = teams.filter(
    (team) => !editForm.team2 || team._id !== editForm.team2
  );

  const availableTeamsForTeam2 = teams.filter(
    (team) => !editForm.team1 || team._id !== editForm.team1
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-white text-center mb-8">Knockout Stage</h1>
      {loading && <div className="text-center text-white mb-4">Đang tải dữ liệu...</div>}
      <div className="flex overflow-x-auto space-x-6 max-w-6xl mx-auto">
        {rounds.map((round) => (
          <div key={round.roundNumber} className="flex-shrink-0 w-72">
            <h2 className="text-xl font-semibold text-white mb-4 text-center border-b-2 border-blue-500 pb-2">
              {round.name}
            </h2>
            <div className="space-y-6">
              {round.matches.map((match) => (
                <div
                  key={match._id}
                  className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white truncate w-1/3">{getTeamName(match.team1)}</span>
                    <div className="flex flex-col items-center">
                      <span className="text-blue-400 font-bold">
                        {match.scoreTeam1 !== null ? match.scoreTeam1 : "-"}
                      </span>
                      {match.penaltyTeam1 !== null && (
                        <span className="text-blue-300 text-sm">({match.penaltyTeam1})</span>
                      )}
                    </div>
                    <span className="text-gray-400">vs</span>
                    <div className="flex flex-col items-center">
                      <span className="text-blue-400 font-bold">
                        {match.scoreTeam2 !== null ? match.scoreTeam2 : "-"}
                      </span>
                      {match.penaltyTeam2 !== null && (
                        <span className="text-blue-300 text-sm">({match.penaltyTeam2})</span>
                      )}
                    </div>
                    <span className="text-white truncate w-1/3">{getTeamName(match.team2)}</span>
                  </div>
                  <div className="text-center text-gray-400 text-sm mt-2">
                    <p>Sân: {match.matchVenue}</p>
                    <p>
                      {formatDate(match.matchDate)} -{" "}
                      {match.matchTime
                        ? new Date(match.matchTime).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Chưa xác định"}
                    </p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleEditClick(match)}
                      className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition-colors"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {editingMatchId && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all duration-300 scale-100 hover:scale-105">
            <h3 className="text-2xl font-bold text-white text-center mb-6 border-b border-gray-700 pb-2">
              Chỉnh sửa trận đấu
            </h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-300">Đội 1</label>
                <select
                  name="team1"
                  value={editForm.team1}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Chọn đội</option>
                  {availableTeamsForTeam1.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Đội 2</label>
                <select
                  name="team2"
                  value={editForm.team2}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Chọn đội</option>
                  {availableTeamsForTeam2.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Tỷ số</label>
                <div className="flex space-x-3 mt-1">
                  <input
                    name="scoreTeam1"
                    type="number"
                    value={editForm.scoreTeam1}
                    onChange={handleEditChange}
                    className="w-1/2 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                  <input
                    name="scoreTeam2"
                    type="number"
                    value={editForm.scoreTeam2}
                    onChange={handleEditChange}
                    className="w-1/2 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Tỷ số penalty (nếu có)</label>
                <div className="flex space-x-3 mt-1">
                  <input
                    name="penaltyTeam1"
                    type="number"
                    value={editForm.penaltyTeam1}
                    onChange={handleEditChange}
                    className="w-1/2 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Penalty Đội 1"
                  />
                  <input
                    name="penaltyTeam2"
                    type="number"
                    value={editForm.penaltyTeam2}
                    onChange={handleEditChange}
                    className="w-1/2 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Penalty Đội 2"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Địa điểm</label>
                <input
                  name="matchVenue"
                  value={editForm.matchVenue}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Chưa xác định"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Ngày (dd/mm/yyyy)</label>
                <input
                  name="matchDate"
                  type="date"
                  value={editForm.matchDate}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Giờ</label>
                <input
                  name="matchTime"
                  type="time"
                  value={editForm.matchTime}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Trạng thái</label>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full mt-1 p-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Finished">Finished</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setEditingMatchId(null)}
                className="bg-red-600 text-white py-2 px-5 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="bg-green-600 text-white py-2 px-5 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnockoutStage;