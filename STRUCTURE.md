# Project Structure Guide

This project is organized into a clean **Frontend** (React + Vite) and **Backend** (Express + Nodemailer) structure without database overhead.

## 📁 Folder Structure

```
Vivek-Kumar/
│
├── 📂 frontend/                 # React + Vite frontend application
│   ├── src/                     # React source code
│   │   ├── components/          # React components
│   │   │   ├── layout/          # Header, Footer
│   │   │   ├── sections/        # Hero, About, Projects, Photos, Contact
│   │   │   ├── timeline/        # MasterPortfolioTimeline
│   │   │   └── ui/              # PencilCursor, ProfileModal, DownloadCV, etc.
│   │   ├── assets/              # Static assets
│   │   ├── data/                # Static frontend data
│   │   ├── hooks/               # Custom React hooks (useMedia)
│   │   ├── lib/                 # Utility helpers
│   │   ├── App.jsx              # Main App component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles & theme tokens
│   ├── public/                  # Static files served directly (images, PDF)
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration & backend proxy
│   └── index.html               # HTML template
│
├── 📂 backend/                  # Express.js backend API
│   ├── api/
│   │   ├── index.js             # Main server entry file
│   │   ├── controllers/         # Contact, Projects, Media handlers
│   │   ├── routes/              # Express API routes (/api/contact, /api/projects, /api/media)
│   │   ├── middleware/          # Express error handling middleware
│   │   ├── utils/               # Nodemailer email dispatcher
│   │   └── data/                # JSON data stores (projects.json, photos.json)
│   ├── package.json             # Backend dependencies
│   └── .env.example             # Backend environment template
│
├── api/                         # Vercel serverless function entry point
├── package.json                 # Root package.json (dev orchestration)
├── vercel.json                  # Vercel deployment configuration
└── STRUCTURE.md                 # Project architecture documentation
```

## 🚀 Running the Project

### Option 1: Run Frontend & Backend Concurrently
```bash
npm run dev:all
```

### Option 2: Run Separately
```bash
# Frontend
npm run dev

# Backend
npm run backend:dev
```

## 📧 Contact Form & Nodemailer
When a user submits the contact form:
1. Client makes a `POST /api/contact` request.
2. Backend validates the payload (`name`, `email`, `number`, `message`).
3. Nodemailer formats and dispatches a responsive HTML notification email directly to your inbox (`EMAIL_TO`).
4. Includes `replyTo` so clicking Reply responds directly to the inquiry sender.
