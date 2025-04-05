import {TrophyIcon} from "@heroicons/react/24/solid";
import React from "react";

const TournamentCardSkeleton = () => {
    return (
        <div className="relative w-[320px] h-[320px] bg-slate-800 animate-pulse p-6 rounded-xl flex flex-col justify-between">
            {/* Background Icon placeholder */}
            <div className="absolute w-48 h-48 bg-slate-700 opacity-5 -top-4 -right-4 rounded-full" />

            {/* Status Tag */}
            <div className="absolute top-3 right-3 w-16 h-6 bg-slate-700 rounded-full" />

            {/* Image */}
            <div className="flex justify-center">
                <div className="w-20 h-20 bg-slate-700 rounded-full" />
            </div>

            {/* Tournament Info */}
            <div className="text-center space-y-2">
                <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto" />
                <div className="h-3 bg-slate-700 rounded w-1/2 mx-auto" />
            </div>

            {/* Location & Time */}
            <div className="text-center space-y-1">
                <div className="h-3 bg-slate-700 rounded w-2/3 mx-auto" />
                <div className="h-3 bg-slate-700 rounded w-1/2 mx-auto" />
            </div>

            {/* Format */}
            <div className="text-center">
                <div className="h-3 bg-slate-700 rounded w-2/3 mx-auto" />
            </div>
        </div>
    );
};

export default TournamentCardSkeleton;