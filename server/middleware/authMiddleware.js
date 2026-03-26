import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        // Cookie එකෙන් token එක ගන්න
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // Token එක verify කරන්න
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Userව හොයාගෙන req.userට attach කරන්න
        const user = await User.findById(decoded.id).select("-password -otp -otpExpiry");
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" });
        }
        
        res.status(401).json({ message: "Not authorized, token failed" });
    }
};