import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Profile() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login");
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="card overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 -mt-8 -mx-8 mb-6">
                        <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                                <span className="text-3xl font-bold text-blue-600">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div className="ml-6">
                                <h1 className="text-2xl font-bold text-white">
                                    {user.name}
                                </h1>
                                <p className="text-blue-100">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Profile Details
                            </h2>
                            
                            <div className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                                <div className="flex items-center p-4">
                                    <span className="w-32 text-gray-600">User ID:</span>
                                    <span className="text-gray-900 font-mono text-sm">
                                        {user.id}
                                    </span>
                                </div>
                                
                                <div className="flex items-center p-4">
                                    <span className="w-32 text-gray-600">Name:</span>
                                    <span className="text-gray-900">{user.name}</span>
                                </div>
                                
                                <div className="flex items-center p-4">
                                    <span className="w-32 text-gray-600">Email:</span>
                                    <span className="text-gray-900">{user.email}</span>
                                </div>
                                
                                <div className="flex items-center p-4">
                                    <span className="w-32 text-gray-600">Status:</span>
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        {user.isVerified ? "Verified" : "Not Verified"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="pt-6 border-t border-gray-200">
                            <button
                                onClick={logout}
                                className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}