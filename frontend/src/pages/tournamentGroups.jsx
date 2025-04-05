import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDoubleLeftIcon, TrophyIcon, XCircleIcon } from "@heroicons/react/24/solid";
import TournamentCardSkeleton from "../components/TournamentSkeleton";
import LoadingScreen from './loadingScreen';
import { getTournaments, updateTournament } from '../api/tounamentAPI';

const TournamentLabel = () => {
    return (
        <div className="bg-slate-700 text-[15px] mb-7 gap-2 p-2 flex drop-shadow-xl place-items-center place-content-center font-semibold text-slate-300">
            <div className="bg-sky-400 px-3 text-[16px] drop-shadow-lg font-bold text-slate-900 rounded-xl">TOURNAMENTS</div>
        </div>
    );
}

const TournamentDetails = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [error, setError] = useState(null);
    const [tournaments, setTournaments] = useState(null);
    const [filteredTournaments, setFilteredTournaments] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchStatus, setSearchStatus] = useState('');
    const [searchLocation, setSearchLocation] = useState('');

    const fetchTournament = async () => {
        setLoading(true);
        try {
            const res = await getTournaments();
            setTournaments(res);
            setFilteredTournaments(res); // Initialize filtered tournaments
            console.log('Public tournament: ', res);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Not found tournament !');
            } else {
                setError('Something went wrong !');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournament();
    }, []);

    useEffect(() => {
        const updateStatusTournament = async () => {
            if (tournaments && tournaments.length > 0) {
                const now = Date.now();
                const tournamentsToUpdate = tournaments.filter(t => {
                    const startTime = new Date(t.time_start).getTime();
                    return startTime <= now && t.status !== 'Ongoing' && t.status !== "Ended";
                });

                console.log('Tournaments to update:', tournamentsToUpdate);

                for (const tournament of tournamentsToUpdate) {
                    const updatedTournament = { ...tournament, status: 'Ongoing' };
                    try {
                        await updateTournament(tournament._id, updatedTournament);
                        console.log('Updated:', tournament._id);
                    } catch (error) {
                        console.error(error);
                    }
                }

                if (tournamentsToUpdate.length > 0) {
                    fetchTournament();
                }
            }
        };

        updateStatusTournament();
    }, [tournaments]);

    // Filter tournaments based on search criteria
    useEffect(() => {
        if (tournaments) {
            const filtered = tournaments.filter(tournament => {
                const matchesName = tournament.name.toLowerCase().includes(searchName.toLowerCase());
                const matchesStatus = searchStatus ? tournament.status === searchStatus : true;
                const matchesLocation = tournament.location.toLowerCase().includes(searchLocation.toLowerCase());
                return matchesName && matchesStatus && matchesLocation;
            });
            setFilteredTournaments(filtered);
        }
    }, [searchName, searchStatus, searchLocation, tournaments]);

    const handleNavigate = (tournament) => {
        if (tournament.status === 'Upcoming') {
            navigate(`/tournament/${tournament._id}`);
        } else {
            navigate(`/manage-tournaments/${tournament._id}`, { state: { tournament } });
        }
    };

    const getStatusTag = (status) => {
        switch (status) {
            case "Upcoming":
                return <div className="bg-blue-500 text-white px-2 py-1 text-xs font-bold rounded-full">Upcoming</div>;
            case "Ongoing":
                return <div className="bg-green-500 text-white px-2 py-1 text-xs font-bold rounded-full">On going</div>;
            case "Ended":
                return <div className="bg-gray-500 text-white px-2 py-1 text-xs font-bold rounded-full">Ended</div>;
            default:
                return null;
        }
    };

    if (error) {
        return (
            <div>
                <TournamentLabel selectedTournament={selectedTournament} />
                <div className="bg-slate-900 grid grid-rows-6 text-slate-300">
                    <div className="grid justify-center">
                        <div id="error-container" className="transition-all bg-red-200 flex gap-2 p-6 rounded-xl">
                            <XCircleIcon className="h-6 w-6 text-red-500" id="error-svg" />
                            <div id="error-message" className="text-red-500">{error}</div>
                        </div>
                        <div className="p-3">
                            <TournamentCardSkeleton />
                            <TournamentCardSkeleton />
                            <TournamentCardSkeleton />
                            <TournamentCardSkeleton />
                            <TournamentCardSkeleton />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading || !tournaments) {
        return <LoadingScreen message="Loading tournaments..." />;
    }

    return (
        <div className="bg-slate-900 text-slate-300">
            <TournamentLabel />

            {/* Search Interface */}
            <div className="grid justify-center mb-6">
                <div className="flex flex-col md:flex-row gap-4 p-6 bg-slate-800 rounded-xl shadow-lg">
                    {/* Search by Name */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-teal-400 mb-1">Tournament Name</label>
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Search by name..."
                            className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>

                    {/* Search by Status */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-teal-400 mb-1">Status</label>
                        <select
                            value={searchStatus}
                            onChange={(e) => setSearchStatus(e.target.value)}
                            className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        >
                            <option value="">All</option>
                            <option value="Upcoming">Upcoming</option>
                            <option value="Ongoing">Ongoing</option>
                            <option value="Ended">Ended</option>
                        </select>
                    </div>

                    {/* Search by Location */}
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-teal-400 mb-1">Location</label>
                        <input
                            type="text"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            placeholder="Search by location..."
                            className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                    </div>
                </div>
            </div>

            {/* Tournament List */}
            <div className="grid justify-center">
                <div className="grid gap-10 md:grid-cols-3 p-6">
                    {filteredTournaments && filteredTournaments.length > 0 ? (
                        filteredTournaments.map(tournament => (
                            <div
                                key={tournament.id}
                                onClick={() => handleNavigate(tournament)}
                                className="relative w-[320px] h-[400px] text-gray-300 bg-gradient-to-br from-slate-900 to-gray-800 
                                hover:scale-[1.05] hover:shadow-lg hover:shadow-blue-500/30 transition-all ease-out duration-500 
                                p-6 rounded-xl backdrop-blur-lg drop-shadow-lg flex flex-col justify-between cursor-pointer"
                            >
                                {/* Background Icon (Blurred Trophy) */}
                                <TrophyIcon className="absolute w-48 h-48 opacity-5 -top-4 -right-4" />

                                {/* Tournament Banner */}
                                <div className="w-full h-40 rounded-t-xl overflow-hidden">
                                    <img
                                        src={tournament.logo}
                                        alt={tournament.name}
                                        className="w-full h-full object-cover drop-shadow-lg"
                                    />
                                </div>

                                {/* Tournament Status Tag */}
                                <div className="absolute top-3 right-3">{getStatusTag(tournament.status)}</div>

                                {/* Tournament Info */}
                                <div className="text-center mt-4">
                                    <h2 className="text-lg font-semibold text-teal-400">{tournament.name}</h2>

                                    {/* Số đội tham gia */}
                                    <div className="mt-2 flex justify-center">
                                        <div className="bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-2">
                                            <span>👥</span>
                                            <span>{tournament.number_of_teams} Teams</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Location & Time */}
                                <div className="text-center mt-2 text-gray-400 text-sm">
                                    📍 <span className="font-medium text-white">{tournament.location}</span>
                                </div>
                                <div className="text-center text-gray-400 text-sm">
                                    🗓 <span className="font-medium text-white">
                                        {new Date(tournament.time_start).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>

                                {/* Tournament Format */}
                                <div className="text-center mt-2 text-sm font-semibold text-blue-400">
                                    ⚽ {tournament.format}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center text-gray-400">No tournaments found matching your criteria.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TournamentDetails;