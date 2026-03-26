# MERN Authentication App

A full-stack authentication application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring Google OAuth and Email OTP verification.

## 🚀 Features

- 🔐 User Registration with Email/Password
- 📧 Email OTP Verification
- 🔑 User Login with Email/Password
- 🌐 Google OAuth Login/Registration
- 🍪 JWT Authentication with HTTP-only Cookies
- 🛡️ Protected Routes
- 📱 Responsive Modern UI with Tailwind CSS
- 🔄 Session Management

## 🛠️ Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- Axios for API calls
- React Router DOM for routing
- @react-oauth/google for Google OAuth

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email OTP
- Google Auth Library

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Gmail account for OTP emails
- Google Cloud Console account for OAuth

### Environment Setup

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/mern_auth_db
JWT_SECRET=your_super_secret_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
