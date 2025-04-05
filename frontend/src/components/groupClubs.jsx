import React, { useState, useEffect } from 'react';

function GroupTableSkeleton() {
    return (
        <div className="animate-pulse grid w-80 justify-center m-2 p-3 px-5 mb-4 bg-slate-950 rounded-lg hover:ring-1 hover:ring-blue-600 ease-in duration-300 hover:bg-slate-900 transition-all">
            <table className="">
                <caption className="font-bold p-1 mt-1.5 mb-[0.20rem]">
                    <div className="h-4 w-20 bg-slate-700 rounded"></div>
                </caption>
                <thead>
                    <tr className="text-[10px]">
                        <th></th>
                        <th className="p-1 pr-5 pb-2 text-left">CLUBNAME</th>
                        <th className="p-1 pb-2 text-center">P</th>
                        <th className="p-1 pb-2 text-center">W</th>
                        <th className="p-1 pb-2 text-center">L</th>
                        <th className="p-1 pb-2 text-center">D</th>
                        <th className="p-1 pb-2 text-center">GA</th>
                        <th className="p-1 pb-2 text-center">GD</th>
                        <th className="p-1 pb-2 text-center">Pts</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(4)].map((_, index) => (
                        <tr key={index} className="text-[12px] text-slate-400">
                            <td>
                                <div className="rounded-full bg-slate-700 -ml-2 h-3 w-3 mr-1.5"></div>
                            </td>
                            <td className="pr-3 text-slate-500 dark:text-slate-400 text-left">
                                <div className="h-2 w-16 bg-slate-700 rounded"></div>
                            </td>
                            <td className="px-2 py-1 text-center">0</td>
                            <td className="px-2 py-1 text-center">0</td>
                            <td className="px-2 py-1 text-center">0</td>
                            <td className="px-2 py-1 text-center">0</td>
                            <td className="px-2 py-1 text-center">0</td>
                            <td className="px-2 py-1 text-center">0</td>
                            <td className="px-2 py-1 text-center">0</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const GroupTable = ({ tournamentId, groupId, groupName }) => {
    const [groupclubs, setGroupclubs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Simulate fetching data
        const fakeData = [
            {
                pk: 1,
                club_name: {
                    club_name: 'Team A',
                    club_image: 'https://via.placeholder.com/50',
                },
                played: 3,
                wins: 2,
                lose: 1,
                draw: 0,
                ga: 5,
                gd: 3,
                points: 6,
            },
            {
                pk: 2,
                club_name: {
                    club_name: 'Team B',
                    club_image: 'https://via.placeholder.com/50',
                },
                played: 3,
                wins: 1,
                lose: 1,
                draw: 1,
                ga: 4,
                gd: 1,
                points: 4,
            },
            {
                pk: 3,
                club_name: {
                    club_name: 'Team C',
                    club_image: 'https://via.placeholder.com/50',
                },
                played: 3,
                wins: 1,
                lose: 2,
                draw: 0,
                ga: 3,
                gd: -1,
                points: 3,
            },
            {
                pk: 4,
                club_name: {
                    club_name: 'Team D',
                    club_image: 'https://via.placeholder.com/50',
                },
                played: 3,
                wins: 0,
                lose: 3,
                draw: 0,
                ga: 1,
                gd: -3,
                points: 0,
            },
        ];

        setTimeout(() => {
            setGroupclubs(fakeData);
            setLoading(false);
        }, 1000); // Simulate network delay
    }, [tournamentId, groupId]);

    return (
        <div>
            {loading && <GroupTableSkeleton />}

            {!loading && (
                <div className="grid w-80 justify-center m-2 p-3 px-5 mb-4 bg-slate-950 rounded-lg hover:ring-1 hover:ring-blue-600 ease-in duration-300 hover:bg-slate-900 transition-all">
                    <table className="">
                        <caption className="font-bold p-1">GROUP {groupName}</caption>
                        <thead>
                            <tr className="text-[10px]">
                                <th></th>
                                <th className="p-1 pr-5 pb-2 text-left">CLUBNAME</th>
                                <th className="p-1 pb-2 text-center">P</th>
                                <th className="p-1 pb-2 text-center">W</th>
                                <th className="p-1 pb-2 text-center">L</th>
                                <th className="p-1 pb-2 text-center">D</th>
                                <th className="p-1 pb-2 text-center">GA</th>
                                <th className="p-1 pb-2 text-center">GD</th>
                                <th className="p-1 pb-2 text-center">Pts</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupclubs.map(groupclub => (
                                <tr key={groupclub.pk} className="text-[12px] text-slate-400">
                                    <td>
                                        <img className="w-5 h-5 grid justify-self-end place-content-center drop-shadow-md shadow-blue-50" src={groupclub.club_name.club_image} alt="Club logo" />
                                    </td>
                                    <td className="pr-3 text-slate-500 dark:text-slate-400 text-left">{groupclub.club_name.club_name}</td>
                                    <td className="px-2 py-1 text-center">{groupclub.played}</td>
                                    <td className="px-2 py-1 text-center">{groupclub.wins}</td>
                                    <td className="px-2 py-1 text-center">{groupclub.lose}</td>
                                    <td className="px-2 py-1 text-center">{groupclub.draw}</td>
                                    <td className="px-2 py-1 text-center">{groupclub.ga}</td>
                                    <td className="px-2 py-1 text-center">{groupclub.gd}</td>
                                    <td className="px-2 py-1 text-center">{groupclub.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GroupTable;