# 🔐 AuthX — Next-Gen MERN Authentication System

An enterprise-grade **MERN Stack Authentication Platform** featuring **Google OAuth 2.0 Integration**, **6-Digit Email OTP Verification**, **HTTP-Only JWT Cookie Sessions**, and a modern **Dark Glassmorphic UI/UX**.

![Tech Stack](https://img.shields.io/badge/Stack-MERN%20(MongoDB%2C%20Express%2C%20React%2019%2C%20Node.js)-6366f1?style=for-the-badge)
![UI](https://img.shields.io/badge/Design-Glassmorphism%20%2B%20TailwindCSS%20v4-38bdf8?style=for-the-badge)
![Security](https://img.shields.io/badge/Security-HTTP--Only%20JWT%20%2B%20Bcrypt-emerald?style=for-the-badge)

---

## ✨ Features

- 🔑 **Google OAuth 2.0 Sign-In**: 1-click Google authentication with automated user creation and account linking.
- 📩 **6-Digit Email OTP Verification**: Real-time SMTP verification via Nodemailer with 10-minute expiring OTP codes.
- 🛡️ **HTTP-Only Cookie JWT**: Secure session handling protected against XSS and CSRF attacks.
- 🔐 **Password Hashing**: Bcrypt salted hashing with 10 rounds.
- 📊 **Real-Time Password Strength Meter**: Interactive strength score feedback (Weak to Very Strong).
- 🎨 **Dark Glassmorphic UI/UX**: Built with React 19, TailwindCSS v4, Google Fonts (*Plus Jakarta Sans* & *Outfit*), and custom ambient mesh lighting.
- 🚀 **Full Security Audit & Config Separation**: Credentials stored strictly in environment variables.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 19** with Vite 7
- **Tailwind CSS v4** (Glassmorphic Styling)
- **@react-oauth/google** (Google OAuth SDK)
- **React Router DOM v7** (Protected Routes)
- **Axios** (API Requests with Credentials)

### **Backend**
- **Node.js** & **Express.js v5**
- **MongoDB** & **Mongoose v9**
- **JSONWebToken (JWT)** & **Cookie Parser**
- **Nodemailer** (Email Transporter)
- **Google Auth Library** (`OAuth2Client` Token Validation)
- **BcryptJS** (Password Encryption)

---

## 📂 Project Structure

```text
OTP/
├── client/                      # React 19 Frontend Application
│   ├── src/
│   │   ├── components/          # UI Components (Navbar, Login, Register, Profile)
│   │   ├── context/             # AuthContext State Management
│   │   ├── App.jsx              # Main Routes & Landing Hero Page
│   │   ├── index.css            # Tailwind & Glassmorphism Design Tokens
│   │   └── main.jsx             # React Entry Point
│   ├── .env.example             # Frontend Env Template
│   ├── package.json             # Frontend Dependencies
│   └── vite.config.js           # Vite Configuration
│
└── server/                      # Express.js Backend API
    ├── controllers/             # Auth Logic (register, login, verifyOTP, googleAuth)
    ├── middleware/              # Auth Protection Middleware (`protect`)
    ├── models/                  # Mongoose User Schema
    ├── routes/                  # API Endpoint Routes (`/api/auth`)
    ├── utils/                   # Helpers (sendEmail, generateOTP)
    ├── .env.example             # Backend Env Template
    ├── package.json             # Backend Dependencies
    └── server.js                # Express Server Entrypoint
```

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Running locally or MongoDB Atlas URI)
- [Google Cloud Console Project](https://console.cloud.google.com/) (OAuth 2.0 Client ID)

---

### 1️⃣ Setup Environment Configuration Files

1. Create a `.env` file in the `server` directory by referencing `server/.env.example`.
2. Create a `.env.local` file in the `client` directory by referencing `client/.env.example`.

---

### 2️⃣ Install Dependencies & Run Applications

#### Launch Backend Server:
```bash
cd server
npm install
npm run dev
```
*(Server runs on http://localhost:5000)*

#### Launch Frontend Client:
```bash
cd client
npm install
npm run dev
```
*(Client runs on http://localhost:5173 or http://localhost:5174)*

---

## 📡 API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user & dispatch 6-digit OTP | ❌ No |
| `POST` | `/api/auth/verify-otp` | Verify 6-digit email OTP & issue JWT cookie | ❌ No |
| `POST` | `/api/auth/login` | Email/password sign-in | ❌ No |
| `POST` | `/api/auth/google` | Google OAuth token verification & login | ❌ No |
| `POST` | `/api/auth/resend-otp` | Resend fresh 10-min OTP to user email | ❌ No |
| `GET` | `/api/auth/profile` | Retrieve authenticated user profile | ✅ Yes (JWT Cookie) |
| `POST` | `/api/auth/logout` | Clear JWT session cookie | ❌ No |

---

## 🛡️ Security Features

1. **Strict Zero Hardcoded Credentials**: All secrets, client IDs, and SMTP passwords are read exclusively from environment variables.
2. **HTTP-Only Cookies**: JWT tokens are transmitted via `httpOnly` cookies with `sameSite: "lax"` protection.
3. **Password Security**: Passwords are salted and hashed using `bcryptjs` before database storage.
4. **Automatic Account Link**: Email/password users linking Google OAuth are verified automatically.

---

## 📄 License
This project is open-source under the [ISC License](LICENSE).
