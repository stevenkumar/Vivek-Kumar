#!/bin/bash
# Portfolio Project - Local Setup & Testing Script (Unix/macOS/Linux)

set -e

echo "============================================"
echo "Portfolio Project - Local Setup"
echo "============================================"
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo "✅ npm version: $(npm --version)"
echo ""

echo "============================================"
echo "Installing Dependencies"
echo "============================================"
echo ""

echo "📦 Installing root dependencies..."
npm install

echo "📦 Installing frontend dependencies..."
(cd frontend && npm install)

echo "📦 Installing backend dependencies..."
(cd backend && npm install)

echo ""
echo "✅ All dependencies installed!"
echo ""

echo "============================================"
echo "Ready to Start Development!"
echo "============================================"
echo ""
echo "Run both frontend and backend together:"
echo "   npm run dev:all"
echo ""
echo "📱 Frontend Development Server: http://localhost:5173"
echo "🖥️  Backend Server: http://localhost:5000"
echo ""
