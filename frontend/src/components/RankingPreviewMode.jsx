import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const RankingPreviewMode = ({ tournament }) => {
    const numberOfGroups = tournament.number_of_group;
    const teams = tournament.teams || [];

    const [groups, setGroups] = useState(Array.from({ length: numberOfGroups }, () => []));
    const [unassignedTeams, setUnassignedTeams] = useState(teams);

    const handleDragEnd = (result) => {
        const { source, destination } = result;
        if (!destination) return;

        // Clone groups and unassigned list
        const newGroups = [...groups.map(group => [...group])];
        const newUnassigned = [...unassignedTeams];

        // Identify source & destination lists
        const isSourceUnassigned = source.droppableId === 'unassigned';
        const isDestUnassigned = destination.droppableId === 'unassigned';

        const sourceList = isSourceUnassigned ? newUnassigned : newGroups[+source.droppableId];
        const destList = isDestUnassigned ? newUnassigned : newGroups[+destination.droppableId];

        const [movedItem] = sourceList.splice(source.index, 1);
        destList.splice(destination.index, 0, movedItem);

        // Update state
        setGroups(newGroups);
        setUnassignedTeams(newUnassigned);
    };



    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="min-h-screen bg-gray-900 p-6 flex">
                {/* Groups */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {groups.map((group, groupIndex) => (
                        <Droppable key={groupIndex} droppableId={`${groupIndex}`}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="bg-gray-800/80 rounded-2xl p-4 shadow-md border border-gray-700"
                                >
                                    <h4 className="text-xl font-semibold text-blue-400 mb-3">Bảng {String.fromCharCode(65 + groupIndex)}</h4>
                                    {group.map((team, index) => (
                                        <Draggable key={String(team._id)} draggableId={String(team._id)} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="bg-gray-700/50 p-3 mb-2 rounded-md flex items-center space-x-3"
                                                >
                                                    <span className="text-sm text-blue-400 font-bold w-10">{`${String.fromCharCode(65 + groupIndex)}${index + 1}`}</span>
                                                    <img src={team.logo} className="w-6 h-6 rounded-full" />
                                                    <span className="text-white">{team.name}</span>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}


                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>

                {/* Unassigned team list */}
                <div className="w-64 ml-6 sticky top-6 h-fit">
                    <h4 className="text-lg font-semibold text-white mb-3">Danh sách đội</h4>
                    <Droppable droppableId="unassigned">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="bg-gray-800/70 p-4 rounded-xl shadow-md max-h-[80vh] overflow-auto"
                            >
                                {unassignedTeams.map((team, index) => (
                                    <Draggable key={team._id.toString()} draggableId={team._id.toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-gray-700/50 p-2 mb-2 rounded-md flex items-center space-x-3"
                                            >
                                                {/* <span className="text-sm text-blue-400 font-bold w-10">{`${String.fromCharCode(65 + groupIndex)}${index + 1}`}</span> */}
                                                <img src={team.logo} className="w-6 h-6 rounded-full" />
                                                <span className="text-white">{team.name}</span>
                                            </div>
                                        )}
                                    </Draggable>

                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        </DragDropContext>
    );
};

export default RankingPreviewMode;
