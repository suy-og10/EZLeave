#!/bin/bash

echo "🚀 Starting EZLeave Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running (optional check)
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB not found in PATH. Make sure MongoDB is installed and running."
fi

echo "📦 Installing backend dependencies..."
cd server
npm install

echo "📦 Installing frontend dependencies..."
cd ../client
npm install

echo "🌱 Seeding sample data..."
cd ../server
node seedData.js

echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "1. Open a terminal and run: cd server && npm run dev"
echo "2. Open another terminal and run: cd client && npm start"
echo ""
echo "Demo credentials:"
echo "Admin: admin@EZLeave.com / password123"
echo "HR: hr@EZLeave.com / password123"
echo "Employee: employee@EZLeave.com / password123"
echo ""
echo "Application will be available at http://localhost:3000"
