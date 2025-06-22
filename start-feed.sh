#!/bin/bash

echo ""
echo "========================================"
echo "   🚀 Starting FEED - Solana Analytics"
echo "========================================"
echo ""

echo "🔄 Killing any existing Node processes..."
pkill -f node || echo "No Node processes to kill"
sleep 2

echo "📊 Starting FEED Server..."
cd server
node index.js &
SERVER_PID=$!
cd ..

echo "⏳ Waiting for server to initialize..."
sleep 5

echo "⚛️  Starting React Client..."
cd client
npm start &
CLIENT_PID=$!
cd ..

echo ""
echo "✅ FEED is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔗 API:      http://localhost:5000"
echo "📡 WebSocket: ws://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for both processes
wait $SERVER_PID $CLIENT_PID 