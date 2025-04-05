// components/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = ({ message = "Loading..." }) => {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-90 flex flex-col justify-center items-center gap-4">
            <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
            <p className="text-slate-200 text-sm font-medium">{message}</p>
        </div>
    );
};

export default LoadingScreen;
