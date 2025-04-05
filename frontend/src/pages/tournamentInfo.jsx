import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarAlt, FaUsers, FaClock, FaArrowLeft, FaTrophy, FaInfoCircle, FaMapMarkerAlt } from "react-icons/fa";
import { getTournamentById, addTeamToTournament } from "../api/tounamentAPI";
import { getTeamsById } from "../api/teamAPI";
import { getMe } from "../api/userAPI";
import LoadingScreen from "./loadingScreen";

const TournamentInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [timeLeft, setTimeLeft] = useState({});
  const [timerReady, setTimerReady] = useState(false);
  const [myTeam, setMyTeam] = useState(null);
  const [isTeamRegistered, setIsTeamRegistered] = useState(false);

  const fetchTournament = async () => {
    setLoading(true);
    try {
      const res = await getTournamentById(id);
      setTournament(res);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const user = await getMe();
      setMyTeam(user.team);
    } catch (error) {
      console.log('Error', error);
    }
  };

  const fetchTeamAttending = async () => {
    setLoading(true);
    try {
      const res = await getTeamsById(tournament.teams);
      setTeams(res.teams);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addTeam = async (teamData) => {
    try {
      await addTeamToTournament(teamData);
      alert("Register success");
      setIsTeamRegistered(true);
      fetchTournament();
      fetchTeamAttending();
    } catch (error) {
      console.log('Error', error);
      if (error.response?.data?.message === "Team is already registered in this tournament") {
        alert("Your team already register!");
        setIsTeamRegistered(true);
      } else {
        alert("Don't have any slot. See you later !")
      }
    }
  };

  const handleRegister = () => {
    if (!myTeam) {
      alert("Please create team first!");
      navigate("/new-club");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn đăng ký giải đấu này không?")) {
      const teamData = {
        teamId: myTeam,
        tournamentId: tournament._id,
      };
      addTeam(teamData);
      console.log('teamData: ', teamData);
    }
  };

  const calculateTimeLeft = () => {
    const countdownDate = new Date(tournament.time_start).getTime();
    const difference = countdownDate - new Date().getTime();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return {};
  };

  useEffect(() => {
    fetchTournament();
    fetchUser();
  }, []);

  useEffect(() => {
    if (tournament && tournament.teams?.length > 0) {
      fetchTeamAttending();
    }
  }, [tournament]);

  useEffect(() => {
    if (tournament?.time_start) {
      setTimeLeft(calculateTimeLeft());
      setTimerReady(true);
    }
    if (tournament?.teams && myTeam) {
      const isRegistered = tournament.teams.some(t => t.toString() === myTeam);
      setIsTeamRegistered(isRegistered);
    }
  }, [tournament, myTeam]);

  useEffect(() => {
    if (!timerReady) return;
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, timerReady]);

  const timerComponents = Object.keys(timeLeft).map((interval) => (
    <div key={interval} className="flex flex-col items-center">
      <span className="text-4xl font-extrabold text-blue-400 animate-pulse">
        {timeLeft[interval] || 0}
      </span>
      <span className="text-xs uppercase text-gray-300 tracking-wider">
        {interval === "days" ? "Ngày" : interval === "hours" ? "Giờ" : interval === "minutes" ? "Phút" : "Giây"}
      </span>
    </div>
  ));

  if (loading || !tournament) {
    return <LoadingScreen message="Đang tải thông tin giải đấu..." />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-gray-800/90 rounded-2xl shadow-xl overflow-hidden border border-gray-700/50 backdrop-blur-lg animate-fadeIn">
        {/* Header */}
        <div className="relative text-center bg-gray-800">
          <img
            src={tournament.logo}
            alt="Tournament Banner"
            className="w-full h-80 object-cover border-b-4 border-blue-500 shadow-xl" // Tăng h-64 lên h-80
          />
          <h1 className="mt-6 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 uppercase tracking-tight py-4">
            {tournament.name}
          </h1>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 p-3 bg-blue-500/80 rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <FaArrowLeft size={20} />
          </button>
        </div>

        {/* Countdown & Register */}
        <div className="p-8">
          <div className="bg-gray-700/70 rounded-2xl p-6 shadow-xl border border-gray-600/30">
            <p className="text-center text-gray-200 mb-4">
              Hạn đăng ký:{" "}
              <span className="font-semibold text-blue-400">
                {new Date(tournament.time_start).toLocaleDateString("vi-VN")}
              </span>
            </p>
            <div className="flex justify-center gap-6 mb-6">
              {timerComponents.length ? (
                timerComponents
              ) : (
                <span className="text-blue-400 font-bold text-xl">Giải đấu đã bắt đầu!</span>
              )}
            </div>
            {!isTeamRegistered && (
              <button
                onClick={handleRegister}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-md"
              >
                Đăng Ký Ngay
              </button>
            )}
            {isTeamRegistered && (
              <p className="text-center text-blue-400 font-semibold">
                Đội của bạn đã đăng ký giải đấu này!
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-4 mt-8 border-b border-gray-600/50">
            <button
              onClick={() => setActiveTab("details")}
              className={`py-3 px-8 rounded-t-xl font-medium transition-all duration-300 ${activeTab === "details"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-blue-500/50"
                }`}
            >
              <FaInfoCircle className="inline mr-2" /> Thông Tin
            </button>
            <button
              onClick={() => setActiveTab("teams")}
              className={`py-3 px-8 rounded-t-xl font-medium transition-all duration-300 ${activeTab === "teams"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-blue-500/50"
                }`}
            >
              <FaUsers className="inline mr-2" /> Đội Tham Gia
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "details" ? (
              <div className="space-y-6 animate-slideUp">
                <div className="bg-gray-700/70 p-6 rounded-2xl shadow-md border border-gray-600/20">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">Chi Tiết Giải Đấu</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-200">
                    <p><FaCalendarAlt className="inline mr-2 text-blue-400" />Ngày: {new Date(tournament.time_start).toLocaleDateString("vi-VN")}</p>
                    <p><FaUsers className="inline mr-2 text-blue-400" />Số đội: {tournament.number_of_teams}</p>
                    <p><FaMapMarkerAlt className="inline mr-2 text-blue-400" />Địa điểm: {tournament.location}</p>
                    <p><FaTrophy className="inline mr-2 text-blue-400" />Thể thức: {tournament.format}</p>
                  </div>
                </div>
                <div className="bg-gray-700/70 p-6 rounded-2xl shadow-md border border-gray-600/20">
                  <h2 className="text-2xl font-bold text-blue-400 mb-4">Mô Tả</h2>
                  <p className="text-gray-200 leading-relaxed">{tournament.description}</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-700/70 rounded-2xl shadow-md overflow-hidden border border-gray-600/20 animate-slideUp">
                <table className="w-full text-left">
                  <thead className="bg-blue-500 text-white">
                    <tr>
                      <th className="px-6 py-4">Tên Đội</th>
                      <th className="px-6 py-4 text-center">Thành Viên</th>
                      <th className="px-6 py-4">Liên Hệ</th>
                      <th className="px-6 py-4 text-center">SĐT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, index) => (
                      <tr
                        key={index}
                        className="border-t border-gray-600/30 hover:bg-blue-500/20 transition-all duration-200"
                      >
                        <td className="px-6 py-4 text-gray-200 flex items-center gap-2">
                          {team.logo && <img src={team.logo} alt="Team Logo" className="w-8 h-8 rounded-full" />}
                          {team.name}
                        </td>
                        <td className="px-6 py-4 text-center text-gray-200">{team.members}</td>
                        <td className="px-6 py-4 text-gray-200">{team.contact_person_name}</td>
                        <td className="px-6 py-4 text-center text-gray-200">{team.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentInformation;