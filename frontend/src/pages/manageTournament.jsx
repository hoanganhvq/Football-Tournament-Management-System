import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import GeneralNews from '../components/generalNews';
import Ranking from '../components/ranking';
import GroupStage from '../components/groupStage';
import KnockoutStage from '../components/knockoutStage';


const ManageTournament = () => {
    const [activeTab, setActiveTab] = useState('general');
    const { id } = useParams(); // Get id from URL
    const location = useLocation(); // Get state from navigation
    const { tournament } = location.state || {}; // Get tournament info from state
    console.log("Manage: ", tournament);

    // Check if tournament data is missing
    if (!tournament) {
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4 text-white animate-pulse">Error: Tournament information not found</h1>
                <h1 className="text-2xl font-bold mb-4 text-white animate-pulse">ID: {id}</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-6 flex items-center justify-center">
            <div className="max-w-5xl w-full bg-gray-800/90 rounded-3xl shadow-2xl p-8 overflow-hidden backdrop-blur-sm transform transition-all duration-500 hover:shadow-4xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-t-3xl mb-6 animate-pulse-slow">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center uppercase tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-white/80 to-sky-200 animate-gradient">
                        {tournament.name}
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 border-b border-gray-700 mb-6">
                    <button
                        className={`py-3 px-6 rounded-t-xl font-semibold transition duration-300 transform ${activeTab === 'general' ? 'bg-blue-500 text-white shadow-md scale-105' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 hover:scale-102'}`}
                        onClick={() => setActiveTab('general')}
                    >
                        General
                    </button>
                    {tournament.format === "Group Stage" && (
                        <>
                            <button
                                className={`py-3 px-6 rounded-t-xl font-semibold transition duration-300 transform ${activeTab === 'group-stage' ? 'bg-teal-500 text-white shadow-md scale-105' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 hover:scale-102'}`}
                                onClick={() => setActiveTab('group-stage')}
                            >
                                Group Stage
                            </button>
                            <button
                                className={`py-3 px-6 rounded-t-xl font-semibold transition duration-300 transform ${activeTab === 'knockout-stage' ? 'bg-pink-500 text-white shadow-md scale-105' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 hover:scale-102'}`}
                                onClick={() => setActiveTab('knockout-stage')}
                            >
                                Knockout Stage
                            </button>
                        </>
                    )}
                    {tournament.format === "Round Robin" && (
                        <button
                            className={`py-3 px-6 rounded-t-xl font-semibold transition duration-300 transform ${activeTab === 'schedule' ? 'bg-green-500 text-white shadow-md scale-105' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 hover:scale-102'}`}
                            onClick={() => setActiveTab('schedule')}
                        >
                            Schedule
                        </button>
                    )}
                    <button
                        className={`py-3 px-6 rounded-t-xl font-semibold transition duration-300 transform ${activeTab === 'ranking' ? 'bg-purple-500 text-white shadow-md scale-105' : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-200 hover:scale-102'}`}
                        onClick={() => setActiveTab('ranking')}
                    >
                        Ranking
                    </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px] animate-fade-in">
                    {activeTab === 'general' && (
                        <GeneralNews tournament={tournament} teams={tournament.teams}/>
                    )}
                    {activeTab === 'schedule' && (
                        <GroupStage tournament={tournament} />
                    )}
                    {activeTab === 'group-stage' && (
                        <GroupStage tournament={tournament} />
                    )}
                    {activeTab === 'knockout-stage' && (
                        <KnockoutStage tournament={tournament} teams={tournament.teams} />
                    )}
                    {activeTab === 'ranking' && (
                        <Ranking tournament={tournament} />
                    )}
                </div>
            </div>
        </div>
    );
};

// Animation keyframes
const styles = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulseSlow {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
    }
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
    }
    .animate-pulse-slow {
        animation: pulseSlow 4s infinite ease-in-out;
    }
    .animate-gradient {
        background-size: 200% 200%;
        animation: gradient 10s ease infinite;
    }
`;

if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default ManageTournament;