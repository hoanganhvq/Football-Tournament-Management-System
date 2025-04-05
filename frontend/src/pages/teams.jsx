import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { SparklesIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { getTeams } from "../api/teamAPI";
import LoadingScreen from './loadingScreen';

const ClubsDetails = () => {
    const navigate = useNavigate();
    const [clubs, setClubs] = useState([]);
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');

    const fetchClubs = async () => {
        setLoading(true);
        try {
            const res = await getTeams();
            console.log("Clubs: ", res);
            setClubs(res);
            setFilteredClubs(res); // Initialize filtered clubs
        } catch (error) {
            console.error("Error fetching clubs:", error);
            setError("Failed to load clubs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    // Auto-filter clubs based on search criteria
    useEffect(() => {
        if (clubs) {
            const filtered = clubs.filter(club => {
                const matchesName = club.name.toLowerCase().includes(searchName.toLowerCase());
                const matchesLocation = club.location.toLowerCase().includes(searchLocation.toLowerCase());
                return matchesName && matchesLocation;
            });
            setFilteredClubs(filtered);
        }
    }, [searchName, searchLocation, clubs]);

    const handleNavigate = (club) => {
        console.log("Club before navigate: ", club);
        navigate(`/club/${club._id}`, { state: { club } });
    };

    if (loading) {
        return <LoadingScreen message="Loading Clubs..." />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8 flex flex-col items-center">
                <div className="relative w-full max-w-5xl mx-auto mb-12">
                    <div className="flex items-center justify-center bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white py-4 px-8 rounded-xl shadow-2xl transform -skew-x-6">
                        <SparklesIcon className="w-8 h-8 text-yellow-300 mr-3 animate-spin-slow" />
                        <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider">Football Clubs</h1>
                    </div>
                </div>
                <div className="text-red-400 text-center bg-gray-800 p-6 rounded-lg shadow-md max-w-lg">
                    <p>{error}</p>
                    <button
                        onClick={fetchClubs}
                        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
            <div className="relative w-full max-w-5xl mx-auto mb-12">
                <div className="flex items-center justify-center bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white py-4 px-8 rounded-xl shadow-2xl transform -skew-x-6">
                    <SparklesIcon className="w-8 h-8 text-yellow-300 mr-3 animate-spin-slow" />
                    <h1 className="text-2xl md:text-3xl font-extrabold uppercase tracking-wider">Football Clubs</h1>
                </div>
            </div>

            {/* Search Interface */}
            <div className="grid justify-center mb-6">
                <div className="flex flex-col md:flex-row gap-4 p-6 bg-slate-800 rounded-xl shadow-lg max-w-4xl w-full">
                    {/* Search by Name */}
                    <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-semibold text-teal-400 mb-1">Club Name</label>
                        <input
                            type="text"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            placeholder="Search by name..."
                            className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
                        />
                    </div>

                    {/* Search by Location */}
                    <div className="flex flex-col w-full md:w-1/2">
                        <label className="text-sm font-semibold text-teal-400 mb-1">Location</label>
                        <input
                            type="text"
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                            placeholder="Search by location..."
                            className="p-2 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-400 w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Clubs List */}
            {filteredClubs.length === 0 ? (
                <div className="text-white text-center">No clubs found matching your criteria.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl mx-auto">
                    {filteredClubs.map((club) => (
                        <div
                            key={club._id}
                            onClick={() => handleNavigate(club)}
                            className="relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:bg-gray-700 cursor-pointer group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                            <div className="relative flex justify-center pt-6">
                                <img
                                    src={club.logo || "https://source.unsplash.com/100x100/?logo,football"}
                                    alt={`${club.name} logo`}
                                    className="w-20 h-20 rounded-full border-2 border-blue-500 shadow-md transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="relative text-center p-6">
                                <h2 className="text-lg font-bold text-blue-400 mb-2 group-hover:text-blue-300 transition-colors duration-300">
                                    {club.name}
                                </h2>
                                <p className="text-sm text-gray-300 italic">{club.location}</p>
                            </div>
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/20 rounded-full -mr farlo

-8 -mt-8 transform rotate-45 group-hover:bg-blue-500/40 transition-colors duration-300"></div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ClubsDetails;