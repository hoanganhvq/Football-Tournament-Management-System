import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGroups, createGroup, createGroupMatches } from '../api/groupAPI';
import { updateTournament, getTournamentById } from '../api/tounamentAPI';
import LoadingScreen from '../pages/loadingScreen';

const Ranking = ({ tournament: initialTournament }) => {
    const [tournament, setTournament] = useState(initialTournament);
    const numberOfGroups = tournament.format === "Round Robin" ? 1 : tournament.number_of_group || 1;
    const teams = tournament.teams || [];
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isTableCreated, setIsTableCreated] = useState(false);
    const [isMatchCreated, setIsMatchCreated] = useState(false);
    const [groupedTeams, setGroupedTeams] = useState([]);
    const [groupInfo, setGroupInfo] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const navigate = useNavigate();

    const fetchTournament = async () => {
        setLoading(true);
        setError(null);
        try {
            const updatedTournament = await getTournamentById(initialTournament._id);
            console.log('Fetched tournament:', updatedTournament);
            setTournament(updatedTournament);
            setIsTableCreated(updatedTournament.is_Divided_Group || false);
            setIsMatchCreated(updatedTournament.isGroupMatchesCreated || false);
            if (updatedTournament.is_Divided_Group) {
                await fetchGroups();
            } else {
                setGroupedTeams(Array.from({ length: numberOfGroups }, () => []));
            }
        } catch (error) {
            console.error('Error fetching tournament:', error);
            setError('Failed to load tournament data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const res = await getGroups(tournament._id);
            console.log('Fetched groups:', res);
            if (!res?.groups?.length) {
                setError('No group data available.');
                setGroupedTeams(Array.from({ length: numberOfGroups }, () => []));
                return;
            }
            setGroupInfo(res);
            const mappedGroups = res.groups.map(group =>
                group.teams.map(item => ({
                    ...item.team,
                    matchesPlayed: item.matchesPlayed || 0,
                    wins: item.wins || 0,
                    draws: item.draws || 0,
                    losses: item.losses || 0,
                    goalsFor: item.goalsFor || 0,
                    goalsAgainst: item.goalsAgainst || 0,
                    yellowCards: item.yellowCards || 0,
                    redCards: item.redCards || 0,
                    points: item.points || 0,
                }))
            );
            setGroupedTeams(mappedGroups);
        } catch (error) {
            console.error('Error fetching groups:', error);
            setError('Failed to load group standings. Please try again.');
            setGroupedTeams(Array.from({ length: numberOfGroups }, () => []));
        }
    };

    const markTournamentAsGrouped = async () => {
        try {
            const updated = await updateTournament(tournament._id, {
                is_Divided_Group: true,
                isGroupMatchesCreated: true,
            });
            console.log('Tournament updated:', updated);
            setIsMatchCreated(true);
            setTournament({ ...tournament, is_Divided_Group: true, isGroupMatchesCreated: true });
        } catch (err) {
            console.error('Error updating tournament:', err.response?.data || err);
            setError('Failed to update tournament status.');
        }
    };

    const handleGroupTeams = async () => {
        if (teams.length < 2) {
            setError('Not enough teams to create groups.');
            return;
        }
        const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
        const newGrouped = Array.from({ length: numberOfGroups }, () => []);

        if (tournament.format === "Round Robin") {
            newGrouped[0] = shuffledTeams;
        } else {
            shuffledTeams.forEach((team, index) => {
                newGrouped[index % numberOfGroups].push(team);
            });
        }
        console.log('Shuffled teams:', newGrouped);
        setGroupedTeams(newGrouped);

        try {
            setLoading(true);
            setError(null);
            for (let i = 0; i < newGrouped.length; i++) {
                const groupData = { groupIndex: i, teams: newGrouped[i] };
                await createGroup(tournament._id, groupData);
            }
            await updateTournament(tournament._id, { is_Divided_Group: true });
            setIsTableCreated(true);
            setTournament({ ...tournament, is_Divided_Group: true });
            await fetchGroups();
        } catch (error) {
            console.error('Error creating groups:', error);
            setError('Failed to create groups. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMatches = async () => {
        if (!groupInfo?.groups?.length) {
            setError('No groups available to create matches.');
            return;
        }
        try {
            setLoading(true);
            setError(null);
            await createGroupMatches(groupInfo);
            await markTournamentAsGrouped();
            await fetchGroups();
        } catch (error) {
            console.error('Error creating matches:', error);
            setError('Failed to create matches. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialTournament?._id) return;
        fetchTournament();
        const user = localStorage.getItem('user');
        setCurrentUserId(user ? JSON.parse(user).id : null);
    }, [initialTournament._id]);

    const renderTeamRow = (team, teamIndex, groupIndex) => {
        const isTop1 = teamIndex === 0;
        const medal = ['🥇', '🥈', '🥉'][teamIndex] || '';
        const rankLabel = tournament.format === 'Round Robin'
            ? `#${teamIndex + 1}`
            : `${String.fromCharCode(65 + groupIndex)}${teamIndex + 1}`;
        const barWidth = Math.min(100, (team.points || 0) * 5);

        const handleTeamClick = () => {
            navigate(`/club/${team._id}`);
        };

        return (
            <tr
                key={team._id}
                onClick={handleTeamClick}
                className={`border-b border-gray-700 hover:bg-gray-700/30 transition duration-300 transform hover:scale-101 cursor-pointer ${teamIndex % 2 === 0 ? 'bg-gray-900/10' : ''} ${isTop1 ? 'border-2 border-yellow-400 bg-yellow-200/5' : ''}`}
            >
                <td className="py-4 flex items-center">
                    <span className="text-sm text-gray-400 mr-3">{rankLabel}</span>
                    <img src={team.logo} alt="Team Logo" className="w-8 h-8 mr-3 rounded-full border border-gray-300 shadow-md" />
                    <span className="text-gray-200 font-semibold truncate">
                        {team.name} {medal}
                    </span>
                </td>
                <td className="text-center text-gray-300">{team.matchesPlayed}</td>
                <td className="text-center text-gray-300">{team.wins}</td>
                <td className="text-center text-gray-300">{team.draws}</td>
                <td className="text-center text-gray-300">{team.losses}</td>
                <td className="text-center text-gray-300">{team.goalsFor - team.goalsAgainst}</td>
                <td className="text-center text-yellow-400 font-medium">{team.yellowCards}</td>
                <td className="text-center text-red-500 font-medium">{team.redCards}</td>
                <td className="text-center text-green-400 font-bold relative">
                    {team.points}
                    <div className="h-1 mt-1 bg-green-500/30 rounded overflow-hidden">
                        <div
                            className="h-1 bg-green-400 transition-all duration-500"
                            style={{ width: `${barWidth}%` }}
                        ></div>
                    </div>
                </td>
            </tr>
        );
    };

    const isAdmin = currentUserId === tournament.createdBy;

    if (loading) {
        return <LoadingScreen message="Loading..." />;
    }

    return (
        <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
            <div className="max-w-5xl w-full bg-gray-800 rounded-3xl shadow-2xl p-8 overflow-hidden backdrop-blur-sm">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400 animate-pulse-slow drop-shadow-md">
                    Ranking
                </h2>
                <h3 className="text-2xl font-semibold mb-6 text-center text-gray-300 animate-slide-in">
                    {tournament.format === 'Round Robin' ? 'Ranking' : 'Group Stage'}
                </h3>
                {error && (
                    <div className="text-center mb-6 text-red-500 font-semibold">
                        {error}
                    </div>
                )}
                {!isTableCreated && isAdmin && teams.length > 2 && (
                    <div className="text-center mb-6">
                        <button
                            onClick={handleGroupTeams}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                        >
                            {loading ? 'Creating grouped teams...' : 'Create Grouped Teams'}
                        </button>
                    </div>
                )}
                {isTableCreated && !isMatchCreated && isAdmin && (
                    <div className="text-center mb-6">
                        <button
                            onClick={handleCreateMatches}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
                        >
                            {loading ? 'Creating matches...' : 'Create Matches'}
                        </button>
                    </div>
                )}
                {groupedTeams.length === 0 && !error && (
                    <div className="text-center text-gray-400">
                        No groups created yet.
                    </div>
                )}
                <div className="grid grid-cols-1 gap-8">
                    {groupedTeams.map((group, index) => (
                        group.length > 0 && (
                            <div key={index} className="bg-gray-900/30 p-6 rounded-2xl shadow-lg border border-blue-700 backdrop-blur-sm">
                                <h4 className="text-xl font-semibold mb-5 text-blue-400 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-teal-300 drop-shadow-md">
                                    {tournament.format === 'Round Robin' ? 'Group' : `Group ${String.fromCharCode(65 + index)}`}
                                </h4>
                                <table className="w-full text-white border-collapse">
                                    <thead>
                                        <tr className="text-gray-400 border-b border-gray-700">
                                            <th className="py-3 text-left font-medium">Team</th>
                                            <th className="py-3 text-center font-medium">Matches</th>
                                            <th className="py-3 text-center font-medium">Wins</th>
                                            <th className="py-3 text-center font-medium">Draws</th>
                                            <th className="py-3 text-center font-medium">Losses</th>
                                            <th className="py-3 text-center font-medium">GD</th>
                                            <th className="py-3 text-center font-medium">Yellow Cards</th>
                                            <th className="py-3 text-center font-medium">Red Cards</th>
                                            <th className="py-3 text-center font-medium">Points</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[...group]
                                            .sort((a, b) => {
                                                const pointsA = a.points || 0;
                                                const pointsB = b.points || 0;
                                                const diffA = (a.goalsFor || 0) - (a.goalsAgainst || 0);
                                                const diffB = (b.goalsFor || 0) - (b.goalsAgainst || 0);
                                                const winsA = a.wins || 0;
                                                const winsB = b.wins || 0;

                                                if (pointsB !== pointsA) return pointsB - pointsA;
                                                if (diffB !== diffA) return diffB - diffA;
                                                return winsB - winsA;
                                            })
                                            .map((team, teamIndex) =>
                                                renderTeamRow(team, teamIndex, index)
                                            )}
                                    </tbody>
                                </table>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Ranking;