import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 w-full flex flex-col">
            <Navbar />
            <main className="flex-1 w-full flex flex-col pt-6 px-4 pb-12 w-full max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
