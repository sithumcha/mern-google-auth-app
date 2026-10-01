import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Profile() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="relative w-16 h-16 mx-auto">
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-slate-400 font-medium text-sm animate-pulse">Loading Profile...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const handleCopyId = () => {
        if (user.id) {
            navigator.clipboard.writeText(user.id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative min-h-[calc(100vh-80px)] py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto relative z-10 space-y-8">
                
                {/* Main Profile Header Card */}
                <div className="glass-card rounded-3xl p-8 border border-slate-800/80 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-indigo-500/10 via-cyan-500/5 to-transparent pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
                        
                        {/* Avatar */}
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-1 shadow-xl shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
                                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-3xl font-extrabold text-white font-display">
                                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                            </div>
                            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white text-[10px] shadow">
                                ✓
                            </span>
                        </div>

                        {/* User Title & Info */}
                        <div className="text-center sm:text-left flex-1 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-white tracking-tight font-display">
                                        {user.name}
                                    </h1>
                                    <p className="text-slate-400 font-medium text-sm">
                                        {user.email}
                                    </p>
                                </div>

                                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-center sm:self-auto shadow-inner">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    <span>Verified Account</span>
                                </div>
                            </div>

                            <p className="text-slate-400 text-xs pt-1">
                                Secure MERN Session • Protection Active
                            </p>
                        </div>

                    </div>
                </div>

                {/* Grid Details & Security Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left 2 Cols: Details Table */}
                    <div className="md:col-span-2 glass-card rounded-3xl p-6 sm:p-8 space-y-6">
                        <h2 className="text-xl font-bold text-white font-display flex items-center space-x-2">
                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Account Details</span>
                        </h2>

                        <div className="divide-y divide-slate-800/80 rounded-2xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
                            
                            {/* User ID */}
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">User ID</span>
                                    <span className="text-sm font-mono text-slate-200">{user.id}</span>
                                </div>
                                <button
                                    onClick={handleCopyId}
                                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-semibold transition-colors"
                                >
                                    {copied ? "Copied! ✓" : "Copy ID"}
                                </button>
                            </div>

                            {/* Full Name */}
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</span>
                                    <span className="text-sm font-medium text-slate-200">{user.name}</span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</span>
                                    <span className="text-sm font-medium text-slate-200">{user.email}</span>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="p-4 flex items-center justify-between">
                                <div>
                                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Security Verification</span>
                                    <span className="text-sm font-medium text-emerald-400 flex items-center space-x-1.5 mt-0.5">
                                        <span>OTP / Google OAuth Verified</span>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Right 1 Col: Security Audit Card */}
                    <div className="glass-card rounded-3xl p-6 space-y-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-white font-display mb-4 flex items-center space-x-2">
                                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Security Summary</span>
                            </h3>

                            <div className="space-y-3 text-xs">
                                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                                    <span className="text-slate-400">JWT Cookie</span>
                                    <span className="text-emerald-400 font-bold">HTTP-Only</span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                                    <span className="text-slate-400">Password Hashing</span>
                                    <span className="text-indigo-400 font-bold">Bcrypt (10 Salt)</span>
                                </div>

                                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                                    <span className="text-slate-400">Database</span>
                                    <span className="text-cyan-400 font-bold">MongoDB Local</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={logout}
                            className="w-full py-3.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 font-bold text-sm transition-all duration-200 flex items-center justify-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out of Session</span>
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
}