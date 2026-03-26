import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            // Password එක required වෙන්නේ Google login නොවන usersට විතරයි
            return !this.googleId;
        },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // GoogleId නැති usersට null allow කරන්න
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },
}, {
    timestamps: true,
});

export default mongoose.model("User", userSchema);