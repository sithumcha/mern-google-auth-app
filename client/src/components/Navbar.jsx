import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    
                    {/* Brand Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-extrabold tracking-tight font-display bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                                Auth<span className="text-indigo-400">X</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                                MERN • Google • OTP
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link 
                            to="/" 
                            className={`text-sm font-medium transition-all duration-200 px-3 py-2 rounded-lg ${
                                isActive("/") ? "text-indigo-400 bg-indigo-500/10" : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                            }`}
                        >
                            Home
                        </Link>
                        
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link 
                                    to="/profile" 
                                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-full border transition-all ${
                                        isActive("/profile") 
                                            ? "border-indigo-500/50 bg-indigo-500/10 text-indigo-300" 
                                            : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:text-white"
                                    }`}
                                >
                                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                    </div>
                                    <span className="text-sm font-medium max-w-[140px] truncate">{user.name}</span>
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                </Link>

                                <button
                                    onClick={logout}
                                    className="flex items-center space-x-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 px-3.5 py-2 rounded-lg transition-all duration-200"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link 
                                    to="/login" 
                                    className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-lg hover:bg-slate-800/60 transition-all duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-sm shadow-lg shadow-indigo-500/25"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 transition-all duration-300 group-hover:opacity-90"></span>
                                    <span className="relative block px-5 py-2.5 bg-slate-950 rounded-[11px] text-white group-hover:bg-opacity-80 transition-all duration-300">
                                        Get Started →
                                    </span>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Mobile Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-slate-900/95 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
                    <Link 
                        to="/" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-3 py-2 rounded-md text-base font-medium text-slate-200 hover:bg-slate-800"
                    >
                        Home
                    </Link>
                    {user ? (
                        <>
                            <Link 
                                to="/profile" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-3 py-2 rounded-md text-base font-medium text-indigo-400 bg-indigo-500/10"
                            >
                                Profile ({user.name})
                            </Link>
                            <button
                                onClick={() => { logout(); setMobileMenuOpen(false); }}
                                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-rose-400 hover:bg-rose-500/10"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <div className="pt-2 space-y-2">
                            <Link 
                                to="/login" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center px-4 py-2.5 rounded-lg text-slate-200 border border-slate-700"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center px-4 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold shadow-lg"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}