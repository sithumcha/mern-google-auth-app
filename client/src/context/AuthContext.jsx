import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Axios setup
    useEffect(() => {
        axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        axios.defaults.withCredentials = true;
    }, []);

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await axios.get("/auth/profile");
                setUser(data.user);
            } catch (error) {
                console.log("Not authenticated");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Register with email/password
    const register = async (name, email, password) => {
        try {
            setError(null);
            const { data } = await axios.post("/auth/register", { name, email, password });
            return data;
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
            throw error;
        }
    };

    // Verify OTP
    const verifyOTP = async (email, otp) => {
        try {
            setError(null);
            const { data } = await axios.post("/auth/verify-otp", { email, otp });
            setUser(data.user);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || "OTP verification failed");
            throw error;
        }
    };

    // Login with email/password
    const login = async (email, password) => {
        try {
            setError(null);
            const { data } = await axios.post("/auth/login", { email, password });
            setUser(data.user);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || "Login failed");
            throw error;
        }
    };

    // Google Login
    const googleLogin = async (credential) => {
        try {
            setError(null);
            const { data } = await axios.post("/auth/google", { credential });
            setUser(data.user);
            return data;
        } catch (error) {
            setError(error.response?.data?.message || "Google login failed");
            throw error;
        }
    };

    // Resend OTP
    const resendOTP = async (email) => {
        try {
            setError(null);
            const { data } = await axios.post("/auth/resend-otp", { email });
            return data;
        } catch (error) {
            setError(error.response?.data?.message || "Failed to resend OTP");
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            setError(null);
            await axios.post("/auth/logout");
            setUser(null);
        } catch (error) {
            setError(error.response?.data?.message || "Logout failed");
            throw error;
        }
    };

    const clearError = () => setError(null);

    const value = {
        user,
        loading,
        error,
        register,
        verifyOTP,
        login,
        googleLogin,
        resendOTP,
        logout,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};