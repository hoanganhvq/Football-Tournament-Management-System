import React, { useState, useEffect } from "react";
import { getMatchesByTournamentId, caculateData, getWinnerAndRunner, getThirdPlace } from '../api/matchAPI'; // Added endTournament import
import LoadingScreen from '../pages/loadingScreen';
import { updateTournament } from "../api/tounamentAPI";

const GeneralNews = ({ tournament }) => {
    const [loading, setLoading] = useState(false);
    const [tournamentStatus, setTournamentStatus] = useState(tournament.status); // Track tournament status locally
    const initialState = {
        totalMatch: 0,
        totalGoal: 0,
        totalYellowCard: 0,
        totalRedCard: 0,
        setData: {},
    };
    const [state, setState] = useState(initialState);
    const [champion1, setChampion] = useState(null);
    const [runnerUp2, setRunnerUp ] = useState(null);
    const [thirdPlace3, setThirdPlace] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await caculateData(tournament._id);
            console.log(res);
            if (res.setData.team1 === null) {
                setState(initialState);
            } else {
                setState({
                    totalMatch: res.totalMatch,
                    totalGoal: res.totalGoals,
                    totalYellowCard: res.totalYellowCard,
                    totalRedCard: res.totalRedCard,
                    setData: res.setData,
                });
            }
        } catch (error) {
            console.log('Error fetching calculate Data: ', error);
        } finally {
            setLoading(false);
        }
    };
    const calculateFinalAndThirdMatch = () => {
        // Validate tournament and teams existence
        if (!tournament?.teams || !Array.isArray(tournament.teams)) {
            throw new Error('Invalid tournament data: teams array is required');
        }
    
        const teamCount = tournament.number_of_team_advances;
        
        if (teamCount < 2 || teamCount > 16 || !Number.isInteger(Math.log2(teamCount))) {
            throw new Error('Team count must be a power of 2 between 2 and 16');
        }
    
        const totalRounds = Math.log2(teamCount);
        const roundNumberFinal = totalRounds; // Final is always the last round
        
        // Third place match is only applicable for 4+ teams and is typically played earlier
    const roundNumberThird = teamCount >= 4 ? totalRounds - 2 : undefined;
        console.log("Du lieu top: ", roundNumberFinal, roundNumberThird, totalRounds, teamCount);
        return {
            roundNumberFinal,
            roundNumberThird,
            totalRounds,
            teamCount
        };
    };
    // const fetchDataEndTournament = async()=>{
    //     setLoading(true);
    //     console.log("Chay ham fetchDataEnd ")
    //     try{
    //         const [_, finalAndThirdMatch] = await Promise.all([
    //             fetchData(),
    //             calculateFinalAndThirdMatch(),
    //         ]);
    //         console.log(finalAndThirdMatch);
    
    //         const [winnerAndRunner, thirdPlace] = await Promise.all([
    //             getWinnerAndRunner(tournament._id, finalAndThirdMatch.roundNumberFinal),
    //             getThirdPlace(tournament._id, finalAndThirdMatch.roundNumberThird),
    //         ]);
         
    //         console.log("The besst: ", winnerAndRunner);
    //         console.log("Third: ", thirdPlace);
            
    //         setChampion(winnerAndRunner.winner);
    //         setRunnerUp(winnerAndRunner.runnerUp);
    //         setThirdPlace(thirdPlace);
 
    //         if (!winnerAndRunner ) {
    //             alert("Cannot end tournament: Champion, Runner-Up, or Third Place is not determined yet.");
    //             return; 
    //         }
    //         return true;
    //     } catch (error) {
    //         console.error("Error ending tournament:", error);
    //         alert("Failed to end the tournament: " + error.message);
    //         throw error; 
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // Function to end the tournament
    const handleEndTournament = async () => {
        setLoading(true);
        try {
            console.log("Data: ", tournament);
           
                const updateStatusData = {
                    ...tournament,
                    status: 'Ended',
                };
                const updatedTournament = await updateTournament(tournament._id, updateStatusData);
                setTournamentStatus("Ended");
                alert("Tournament has been successfully ended!");
    
         
    
        } catch (error) {
            console.error("Error ending tournament:", error);
            alert("Failed to end the tournament: " + error.message);
            throw error; // Re-throw for any additional error handling
        } finally {
            setLoading(false);
        }
    };
   


    useEffect(() => {
        if (!tournament?._id) return;
        fetchData();
        const user = localStorage.getItem('user');
        setCurrentUserId(user ? JSON.parse(user).id : null);
        console.log("Chay useEffect");
    
    }, [tournament._id, tournament.status, tournament.format]);

    if (!state || loading) {
        return <LoadingScreen message="Loading..." />;
    }

    // Helper function to get team logo (assuming team has a logo field, otherwise use name)
    const getTeamLogo = (team) => {
        return <img src={team.logo} alt={team.name || "Team"} className="w-8 h-8 inline-block mr-2" />;
    };

    // Calculate goal per match ratio
    const goalPerMatch = state.totalMatch > 0 ? (state.totalGoal / state.totalMatch).toFixed(2) : 0;
    const isAdmin = tournament.createdBy === currentUserId;
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Schedule and Information */}
            <div className="md:col-span-1 space-y-6">
                {/* General Information */}
                <div className="bg-gray-800 p-5 rounded-2xl shadow-xl">
                    <h3 className="text-xl font-bold text-white mb-4">Information</h3>
                    <div className="space-y-3">
                        <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
                            <p className="text-white">Match Date</p>
                            <p className="text-sm text-gray-400">
                                {new Date(tournament.time_start).toLocaleDateString("en-GB")}
                            </p>
                        </div>
                        <div className="bg-gray-700 p-4 rounded-xl border border-gray-600">
                            <p className="text-white">Location</p>
                            <p className="text-sm text-gray-400">{tournament.location}</p>
                        </div>
                    </div>
                </div>

                {tournamentStatus === "Ongoing" && isAdmin && (
                    <div className="bg-gray-800 p-5 rounded-2xl shadow-xl text-center">
                        <button
                            onClick={handleEndTournament}
                            disabled={loading}
                            className={`w-full py-3 rounded-lg font-semibold text-white transition duration-300 ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
                                }`}
                        >
                            {loading ? "Ending..." : "End Tournament"}
                        </button>
                    </div>
                )}
            </div>

            <div className="md:col-span-3 bg-gray-800 p-6 rounded-2xl shadow-xl space-y-8">
                {/* Title */}
                <h2 className="text-2xl font-bold text-white">📊 Overall Statistics</h2>

                {/* Match Statistics */}
                <section>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">⚽ Matches</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: "Total Goals", value: state.totalGoal, color: "text-blue-500" },
                            { label: "Total Matches", value: state.totalMatch, color: "text-green-500" },
                            { label: "Yellow Cards", value: state.totalYellowCard, color: "text-yellow-500" },
                            { label: "Red Cards", value: state.totalRedCard, color: "text-red-500" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:bg-gray-600 transition">
                                <p className="text-gray-400">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Special Achievements */}
                <section>
                    <h4 className="text-lg font-semibold text-gray-300 mb-4">🏅 Special Achievements</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            {
                                label: "Highest Scoring Match",
                                value: state.setData.team1 && state.setData.team2
                                    ? (
                                        <span>
                                            {getTeamLogo(state.setData.team1)}
                                            <span className="mx-1">{state.setData.scoreTeam1}</span> -
                                            <span className="mx-1">{state.setData.scoreTeam2}</span>
                                            {getTeamLogo(state.setData.team2)}
                                        </span>
                                    )
                                    : "? - ?",
                                color: "text-purple-400"
                            },
                            { label: "Goals per Match", value: goalPerMatch, color: "text-pink-400" },
                            { label: "Total Participants", value: tournament.teams.length * tournament.number_of_member, color: "text-indigo-400" },
                        ].map((stat, i) => (
                            <div key={i} className="bg-gray-700 p-5 rounded-xl border border-gray-600 hover:bg-gray-600 transition">
                                <p className="text-gray-400">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default GeneralNews;