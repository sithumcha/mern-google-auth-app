export const generateOTP = () => {
    // 6-digit OTP එකක් generate කරන්න
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// OTP expiry time එක 10 minutes
export const OTP_EXPIRY_TIME = 10 * 60 * 1000;