import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#fcfcfd] text-slate-900 w-full flex flex-col">
            <Navbar />
            <main className="flex-1 w-full flex flex-col pt-10 px-6 pb-20 w-full max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
