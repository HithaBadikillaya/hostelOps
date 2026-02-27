import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-slate-100 px-8 py-5 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-3 group">
                    <div className="bg-[#5d4037] w-9 h-9 flex items-center justify-center transition-all">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <span className="text-sm font-bold text-black uppercase tracking-widest">HostelOps</span>
                </Link>

                {user && (
                    <div className="flex items-center space-x-8">
                        <div className="hidden md:flex items-center space-x-4">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#5d4037]">
                                {user.role}
                            </span>
                            <span className="nav-link text-slate-400">{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="nav-link text-slate-400 hover:text-[#5d4037]"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
