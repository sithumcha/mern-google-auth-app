import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateOTP, OTP_EXPIRY_TIME } from "../utils/generateOTP.js";
import { sendEmail } from "../utils/sendEmail.js";
import { OAuth2Client } from "google-auth-library";

// Initialize Google OAuth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// JWT Token generate කරන function එක
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token එක දින 7ක් වලංගු
    });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // User ඉන්නවද කියලා check කරන්න
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Password එක hash කරන්න
        const hashedPassword = await bcrypt.hash(password, 10);

        // OTP generate කරන්න
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY_TIME);

        // User අලුතෙන් හදන්න
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
        });

        // Verification email එක send කරන්න
        await sendEmail({
            to: email,
            subject: "Email Verification OTP - MERN Auth App",
            text: `Your OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Welcome to MERN Auth App!</h2>
                    <p>Thank you for registering. Please verify your email address using the OTP below:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in <strong>10 minutes</strong>.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        res.status(201).json({
            message: "User registered successfully. Please verify your email with OTP.",
            email: user.email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Verify email with OTP
// @route   POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validation
        if (!email || !otp) {
            return res.status(400).json({ message: "Please provide email and OTP" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // OTP එක check කරන්න
        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // OTP expiry check කරන්න
        if (user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Userව verify කරලා OTP clear කරන්න
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // JWT token එක generate කරන්න
        const token = generateToken(user._id);

        // HTTP-only cookie එකේ token එක set කරන්න
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // HTTPS වලදී පමණක් send වෙන්න
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            message: "Email verified successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide email and password" });
        }

        // Userව හොයාගන්න (password field එකත් include කරලා)
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Password එක check කරන්න (Google usersට password නැතුව ඇති)
        if (!user.password) {
            return res.status(401).json({ message: "This account uses Google login. Please login with Google." });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Email verifiedද කියලා check කරන්න
        if (!user.isVerified) {
            return res.status(401).json({ message: "Please verify your email first" });
        }

        // JWT token එක generate කරන්න
        const token = generateToken(user._id);

        // HTTP-only cookie එකේ token එක set කරන්න
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Google OAuth login/register
// @route   POST /api/auth/google
export const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body; // Client එකෙන් එවන Google token එක

        if (!credential) {
            return res.status(400).json({ message: "No credential provided" });
        }

        // Token එක verify කරන්න
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        // User ඉන්නවද කියලා check කරන්න
        let user = await User.findOne({ email });

        if (!user) {
            // අලුත් user කෙනෙක් නම් create කරන්න
            user = await User.create({
                name,
                email,
                googleId,
                isVerified: true, // Google users automatically verified
            });
        } else if (!user.googleId) {
            // දැනටමත් email එකෙන් ඉන්න user කෙනෙක් Google සමඟ link කරන්න
            user.googleId = googleId;
            user.isVerified = true;
            await user.save();
        }

        // JWT token එක generate කරන්න
        const token = generateToken(user._id);

        // HTTP-only cookie එකේ token එක set කරන්න
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Google login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
            },
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ message: "Google authentication failed" });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
export const getProfile = async (req, res) => {
    try {
        // req.user එක protect middleware එකෙන් එනවා
        const user = await User.findById(req.user.id).select("-password -otp -otpExpiry");
        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Logout user
// @route   POST /api/auth/logout
export const logout = async (req, res) => {
    try {
        // Cookie එක clear කරන්න
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0),
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide email" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // අලුත් OTP එකක් generate කරන්න
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + OTP_EXPIRY_TIME);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        // නැවත email එක send කරන්න
        await sendEmail({
            to: email,
            subject: "New OTP for Email Verification - MERN Auth App",
            text: `Your new OTP for email verification is: ${otp}. This OTP will expire in 10 minutes.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New OTP Requested</h2>
                    <p>Here is your new OTP for email verification:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
                        ${otp}
                    </div>
                    <p>This OTP will expire in <strong>10 minutes</strong>.</p>
                </div>
            `,
        });

        res.status(200).json({ message: "New OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};