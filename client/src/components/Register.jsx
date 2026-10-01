import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendStatus, setResendStatus] = useState("");
    
    const { register, verifyOTP, resendOTP, googleLogin, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setLocalError("");
        if (error) clearError();
    };

    // Calculate password strength (0 to 4)
    const getPasswordStrength = () => {
        const pass = formData.password;
        if (!pass) return 0;
        let score = 0;
        if (pass.length >= 6) score += 1;
        if (pass.length >= 10) score += 1;
        if (/[A-Z]/.test(pass)) score += 1;
        if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
        return score;
    };

    const strengthScore = getPasswordStrength();
    const strengthLabels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
    const strengthColors = ["bg-slate-700", "bg-rose-500", "bg-amber-500", "bg-indigo-500", "bg-emerald-500"];

    const validateForm = () => {
        if (!formData.name.trim()) {
            setLocalError("Please enter your full name");
            return false;
        }
        if (!formData.email.trim()) {
            setLocalError("Please enter your email address");
            return false;
        }
        if (formData.password.length < 6) {
            setLocalError("Password must be at least 6 characters");
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setLocalError("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.password);
            setStep(2);
        } catch (err) {
            console.error("Registration failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (!otp.trim() || otp.length < 6) {
            setLocalError("Please enter the complete 6-digit OTP code");
            return;
        }

        setLoading(true);
        try {
            await verifyOTP(formData.email, otp);
            navigate("/profile");
        } catch (err) {
            console.error("OTP verification failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        setResendStatus("");
        try {
            await resendOTP(formData.email);
            setResendStatus("New OTP has been sent to your email!");
        } catch (err) {
            console.error("Resend OTP failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        try {
            await googleLogin(credentialResponse.credential);
            navigate("/profile");
        } catch (err) {
            console.error("Google login failed:", err);
        } finally {
            setLoading(false);
        }
    };

    const displayError = localError || error;

    return (
        <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 overflow-hidden">
            
            {/* Ambient Lights */}
            <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-lg relative z-10">
                
                {/* Step Progress Bar Header */}
                <div className="mb-6 flex items-center justify-center space-x-4">
                    <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${step === 1 ? 'text-indigo-400' : 'text-emerald-400'}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-emerald-500 text-white'}`}>
                            {step === 1 ? '1' : '✓'}
                        </span>
                        <span>Account</span>
                    </div>

                    <div className={`w-12 h-0.5 ${step === 2 ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>

                    <div className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-wider ${step === 2 ? 'text-indigo-400' : 'text-slate-500'}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                            2
                        </span>
                        <span>OTP Verification</span>
                    </div>
                </div>

                <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800/80 shadow-2xl backdrop-blur-2xl">
                    
                    {displayError && (
                        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start space-x-3 text-rose-300 text-sm">
                            <svg className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium leading-relaxed">{displayError}</span>
                        </div>
                    )}

                    {step === 1 ? (
                        <>
                            {/* Step 1: Form Header */}
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
                                    Create AuthX Account
                                </h2>
                                <p className="text-slate-400 text-sm mt-1.5 font-medium">
                                    Get started with email verification and Google OAuth
                                </p>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="glass-input"
                                        placeholder="Sithum Chanuka"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="glass-input"
                                        placeholder="sithum@example.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="glass-input pr-11"
                                            placeholder="••••••••"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                                        >
                                            {showPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Strength meter */}
                                    {formData.password && (
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center justify-between text-[11px]">
                                                <span className="text-slate-400 font-medium">Strength:</span>
                                                <span className="font-bold text-slate-300">{strengthLabels[strengthScore]}</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex space-x-1 p-0.5">
                                                {[1, 2, 3, 4].map((barIndex) => (
                                                    <div 
                                                        key={barIndex}
                                                        className={`h-full flex-1 rounded-full transition-all duration-300 ${
                                                            strengthScore >= barIndex ? strengthColors[strengthScore] : 'bg-slate-800'
                                                        }`}
                                                    ></div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="glass-input pr-11"
                                            placeholder="••••••••"
                                            required
                                            disabled={loading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59" /></svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3.5 mt-4 text-sm uppercase tracking-wider font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Generating OTP...</span>
                                        </div>
                                    ) : (
                                        "Continue to Verification →"
                                    )}
                                </button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                                <div className="relative flex justify-center text-xs uppercase tracking-wider font-semibold">
                                    <span className="px-3 bg-slate-900 text-slate-400">Or register with</span>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => console.log("Google Login Failed")}
                                    theme="filled_blue"
                                    size="large"
                                    shape="pill"
                                    text="signup_with"
                                    width="100%"
                                />
                            </div>

                            <p className="mt-6 text-center text-sm text-slate-400">
                                Already have an account?{" "}
                                <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 underline underline-offset-4">
                                    Sign In
                                </Link>
                            </p>
                        </>
                    ) : (
                        <>
                            {/* Step 2: OTP Verification Header */}
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
                                    Verify Email OTP
                                </h2>
                                <p className="text-slate-400 text-sm mt-1.5 font-medium">
                                    We sent a 6-digit code to: <br />
                                    <span className="text-cyan-400 font-semibold">{formData.email}</span>
                                </p>
                            </div>

                            {resendStatus && (
                                <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs text-center font-medium">
                                    {resendStatus}
                                </div>
                            )}

                            <form onSubmit={handleVerifyOTP} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 text-center">
                                        Enter 6-Digit OTP Code
                                    </label>
                                    <input
                                        type="text"
                                        maxLength="6"
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(e.target.value.replace(/\D/g, ""));
                                            setLocalError("");
                                        }}
                                        className="glass-input text-center text-2xl font-mono tracking-[0.5em] font-bold py-3.5"
                                        placeholder="000000"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-3.5 text-sm uppercase tracking-wider font-bold shadow-lg shadow-indigo-500/25 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            <span>Verifying Code...</span>
                                        </div>
                                    ) : (
                                        "Verify & Complete Registration"
                                    )}
                                </button>
                            </form>

                            <div className="mt-6 flex items-center justify-between text-xs font-medium">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    ← Back to Details
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={loading}
                                    className="text-indigo-400 hover:text-indigo-300 font-bold underline"
                                >
                                    Resend OTP Code
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}