import express from "express";
import { 
    register, 
    verifyOTP, 
    login, 
    googleAuth,
    getProfile,
    logout,
    resendOTP 
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/resend-otp", resendOTP);
router.post("/logout", logout);

// Protected routes
router.get("/profile", protect, getProfile);

export default router;