import React, { useState } from 'react';

const DivideGroups = ({ teams }) => {
    const [groups, setGroups] = useState([]);

    const divideTeamsIntoGroups = () => {
        const shuffled = [...teams].sort(() => Math.random() - 0.5);
        const totalTeams = shuffled.length;
        const groupCount = Math.ceil(totalTeams / 4); // Tối đa 4 đội 1 bảng
        const baseSize = Math.floor(totalTeams / groupCount);
        const remainder = totalTeams % groupCount;

        const newGroups = [];
        let start = 0;

        for (let i = 0; i < groupCount; i++) {
            const size = i < remainder ? baseSize + 1 : baseSize;
            const group = shuffled.slice(start, start + size);
            newGroups.push(group);
            start += size;
        }

        setGroups(newGroups);
    };

    return (
        <div className="text-white">
            <h2 className="text-xl font-bold mb-4">Danh sách đội tham gia: {teams.length}</h2>
            <button 
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded mb-6"
                onClick={divideTeamsIntoGroups}
            >
                Tự động chia bảng
            </button>

            {groups.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groups.map((group, idx) => (
                        <div key={idx} className="bg-gray-700 p-4 rounded-xl shadow-md">
                            <h3 className="text-lg font-bold mb-3">Bảng {String.fromCharCode(65 + idx)}</h3>
                            <ul className="space-y-2">
                                {group.map((team, index) => (
                                    <li key={team._id || index} className="flex items-center space-x-3">
                                        <img src={team.logo || "https://via.placeholder.com/20"} alt="Logo" className="w-6 h-6 rounded-full" />
                                        <span>{team.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DivideGroups;
