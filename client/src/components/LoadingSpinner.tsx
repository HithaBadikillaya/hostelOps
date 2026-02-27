import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] animate-in fade-in duration-500">
            <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-[3px] border-slate-100 border-t-slate-900 border-r-slate-900 shadow-sm"></div>
                <div className="absolute inset-0 blur-sm animate-pulse rounded-full border border-slate-900 opacity-20"></div>
            </div>
            <p className="mt-6 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Loading Interface</p>
        </div>
    );
};

export default LoadingSpinner;
