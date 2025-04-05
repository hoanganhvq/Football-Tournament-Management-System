import React from "react";
import { getTeamByUserId, addPlayerIntoTeam } from "../api/teamAPI";
import { deletePlayer, updatePlayer } from "../api/playerAPI";
import LoadingScreen from "./loadingScreen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImageTournamentAndPlayer } from "../api/imageAPI";

const ManagePlayers = () => {
  const navigate = useNavigate();
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    position: "",
    number: "",
    avatar: null, // File object
    avatarPreview: "", // Base64 để preview
    goals: 0,
  });
  const [error, setError] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editedPlayer, setEditedPlayer] = useState(null);
  const [players, setPlayers] = useState([]);
  const positions = ["Goalkeeper", "Defender", "Midfielder", "Forward"];
  const [loading, setLoading] = useState(false);
  const [team, setTeam] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Token: ", token);
      const res = await getTeamByUserId(token);
      if (!res) {
        setPlayers([]);
        return;
      }
      setTeam(res[0]);
      setPlayers(res[0].players);
    } catch (error) {
      console.error("Error fetching players: ", error);
      setPlayers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, []);

  const handleAddPlayer = async () => {
    if (!newPlayer.name || !newPlayer.position || !newPlayer.number) {
      setError(" Please fill in all required fields!");
      return;
    }
    const numberAsInt = parseInt(newPlayer.number, 10);
    if (players.some((player) => parseInt(player.number, 10) === numberAsInt)) {
      setError(" Jersey number already exists!");
      return;
    }

    setIsCreating(true);
    try {
      const teamId = team._id;
      let playerData = { ...newPlayer, number: numberAsInt };

      if (newPlayer.avatar) {
        const id = `player_${Date.now()}`;
        const avatarUrl = await uploadImageTournamentAndPlayer(id, newPlayer.avatar);
        playerData.avatar = avatarUrl;
      } else {
        playerData.avatar = "https://res.cloudinary.com/dnuqb888u/image/upload/v1742676178/defaultUser_wyeok8.jpg";
      }

      console.log("Player data to add: ", playerData);
      console.log("Team ID: ", teamId);
      const { avatarPreview, ...rest } = playerData;
      await addPlayerIntoTeam(teamId, rest);
      await fetchPlayers();
      setNewPlayer({ name: "", position: "", number: "", avatar: null, avatarPreview: "", goals: 0 });
      setError("");
    } catch (error) {
      console.error("Error adding player: ", error);
      setError(" Failed to add player. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditPlayer = (index, field, value) => {
    setEditedPlayer({
      ...editedPlayer,
      [field]: field === "number" ? parseInt(value, 10) : value,
    });
  };

  const handleDeletePlayer = async (index) => {
    try {
      const playerId = players[index]._id;
      await deletePlayer(playerId);
      await fetchPlayers();
    } catch (error) {
      console.error("Error deleting player: ", error);
      setError(" Failed to delete player. Please try again.");
    }
  };

  const handleInputChange = (e, field) => {
    const value = field === "number" ? e.target.value : e.target.value;
    setNewPlayer({ ...newPlayer, [field]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewPlayer({ ...newPlayer, avatar: file, avatarPreview: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedPlayer({ ...editedPlayer, avatar: file, avatarPreview: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setNewPlayer({ ...newPlayer, avatar: null, avatarPreview: "" });
  };

  const startEditing = (index) => {
    if (!players[index]) {
      setError(" Invalid player data!");
      return;
    }
    setEditingIndex(index);
    setEditedPlayer({ ...players[index], avatar: null, avatarPreview: players[index].avatar });
  };

  const saveEdit = async (index) => {
    if (!editedPlayer) {
      setError(" No player data to save!");
      return;
    }
    if (!editedPlayer.name || !editedPlayer.position || !editedPlayer.number) {
      setError(" Please fill in all required fields!");
      return;
    }
    const numberAsInt = parseInt(editedPlayer.number, 10);
    if (
      players.some(
        (player, i) =>
          parseInt(player.number, 10) === numberAsInt && i !== index
      )
    ) {
      setError(" Jersey number already exists!");
      return;
    }
    setIsUpdating(true);
    try {
      const { _id, __v, avatarPreview, ...dataToUpdate } = editedPlayer;
      let updatedData = { ...dataToUpdate, number: numberAsInt };

      if (editedPlayer.avatar instanceof File) {
        const id = `player_${Date.now()}`;
        const avatarUrl = await uploadImageTournamentAndPlayer(id, editedPlayer.avatar);
        updatedData.avatar = avatarUrl;
      } else {
        updatedData.avatar = editedPlayer.avatarPreview || "https://res.cloudinary.com/dnuqb888u/image/upload/v1742676178/defaultUser_wyeok8.jpg";
      }

      console.log("Data to update: ", updatedData);
      await updatePlayer(_id, updatedData);
      await fetchPlayers();
      setEditingIndex(null);
      setEditedPlayer(null);
      setError("");
    } catch (error) {
      console.error("Error updating player: ", error);
      setError("⚠️ Failed to update player. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditedPlayer(null);
    setError("");
  };

  if (loading) {
    return <LoadingScreen message="Loading..." />;
  }
  if (!team) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-3xl font-bold mb-6">You have no team</h2>
          <p className="text-gray-400 text-lg mb-8">
            It looks like you haven’t created a team yet. Start by creating one!
          </p>
          <button
            onClick={() => navigate("/new-club")}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Create Your Club
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 p-8 flex items-center justify-center">
      <div className="w-full max-w-6xl bg-gray-800 p-10 rounded-3xl shadow-2xl border border-gray-700">
        <h1 className="text-5xl font-extrabold text-center text-white drop-shadow-lg mb-10">
          {team.name}
        </h1>

        {/* Player List */}
        <h2 className="text-3xl font-semibold text-gray-300 mb-8">📋 Player List</h2>
        {players.length === 0 ? (
          <p className="text-gray-300 text-center text-lg">No players added yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {players.map((player, index) => (
              <div
                key={index}
                className="bg-gray-700 p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-600"
              >
                <div className="relative flex justify-center mb-4">
                  {editingIndex === index ? (
                    <div className="relative group">
                      <label htmlFor={`edit-avatar-${index}`} className="cursor-pointer">
                        <img
                          src={editedPlayer.avatarPreview || "https://via.placeholder.com/100"}
                          alt={player.name}
                          className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-inner hover:opacity-75 transition-all duration-300" // Tăng kích thước lên w-24 h-24
                        />
                        <span className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                          Change Avatar
                        </span>
                      </label>
                      <input
                        id={`edit-avatar-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  ) : (
                    <img
                      src={player.avatar || "https://via.placeholder.com/100"}
                      alt={player.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-600 shadow-inner" // Tăng kích thước lên w-24 h-24
                    />
                  )}
                  <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-md">
                    {player.position || "N/A"}
                  </span>
                  {editingIndex === index && (
                    <button
                      onClick={() => handleDeletePlayer(index)}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                      aria-label={`Delete ${player.name}`}
                    >
                      ❌
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {editingIndex === index ? (
                    <>
                      <input
                        type="text"
                        value={editedPlayer.name}
                        onChange={(e) => handleEditPlayer(index, "name", e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        placeholder="Player Name"
                      />
                      <select
                        value={editedPlayer.position}
                        onChange={(e) => handleEditPlayer(index, "position", e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                      >
                        <option value="" disabled>
                          Select Position
                        </option>
                        {positions.map((pos) => (
                          <option key={pos} value={pos}>
                            {pos}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={editedPlayer.number}
                        onChange={(e) => handleEditPlayer(index, "number", e.target.value)}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                        placeholder="Jersey Number"
                      />
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        value={player.name}
                        disabled
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all opacity-75 text-sm"
                        placeholder="Player Name"
                      />
                      <input
                        type="number"
                        value={player.number}
                        disabled
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-all opacity-75 text-sm"
                        placeholder="Jersey Number"
                      />
                    </>
                  )}
                </div>
                <div className="mt-4 flex justify-between gap-3">
                  {editingIndex === index ? (
                    <>
                      <button
                        onClick={() => saveEdit(index)}
                        className={`flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg ${isUpdating ? 'animate-pulse' : 'hover:from-blue-600 hover:to-purple-700'}`}
                      >
                        {isUpdating ? (
                          <span className="flex items-center justify-center gap-3">
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save"
                        )}
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow-md transition-all duration-300 text-sm"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => startEditing(index)}
                      className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-300 text-sm"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Player */}
        <h3 className="text-2xl font-semibold text-gray-300 mt-12 mb-6">➕ Add New Player</h3>
        <div className="bg-gray-700 p-8 rounded-xl border border-gray-600 shadow-inner">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <input
              type="text"
              value={newPlayer.name}
              onChange={(e) => handleInputChange(e, "name")}
              className="p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Player Name *"
            />
            <select
              value={newPlayer.position}
              onChange={(e) => handleInputChange(e, "position")}
              className="p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            >
              <option value="" disabled>
                Select Position *
              </option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
            <input
              type="number"
              value={newPlayer.number}
              onChange={(e) => handleInputChange(e, "number")}
              className="p-4 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              placeholder="Jersey Number *"
            />
            <div className="relative group">
              <label
                htmlFor="avatar-upload"
                className="flex items-center justify-between w-full p-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-pointer hover:bg-gray-600 hover:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400 transition-all duration-300 shadow-sm"
              >
                <span className="flex items-center gap-3">
                  <span className="bg-blue-500/20 p-2 rounded-full text-gray-300 group-hover:text-blue-400 transition-all">
                    📷
                  </span>
                  <span className="truncate">
                    {newPlayer.avatar ? "Image Selected" : "Upload Player Avatar (optional)"}
                  </span>
                </span>
                <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md group-hover:bg-blue-600 transition-all">
                  Choose File
                </span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {newPlayer.avatarPreview && (
            <div className="mt-6 flex justify-center relative">
              <img
                src={newPlayer.avatarPreview}
                alt="Preview"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-md" // Tăng kích thước lên w-32 h-32
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-transform hover:scale-110"
                aria-label="Remove Image"
              >
                ❌
              </button>
            </div>
          )}
        </div>
        <button
          type="button"
          disabled={isCreating}
          onClick={handleAddPlayer}
          className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 shadow-lg transform hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg ${isCreating ? "animate-pulse" : "hover:from-blue-600 hover:to-purple-700"
            }`}
        >
          {isCreating ? (
            <span className="flex items-center justify-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adding Player...
            </span>
          ) : (
            "Add Player"
          )}
        </button>

        {error && (
          <p className="text-red-400 text-center mt-6 bg-red-500/10 p-4 rounded-lg border border-red-500/30">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default ManagePlayers;