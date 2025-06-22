# 📊 FEED - Advanced Solana Token Analytics Platform

A real-time Solana token analytics platform with live data feeds, advanced filtering, and comprehensive market insights.

## 🚀 Quick Start

### Startup Options

**Recommended (Clean Start):**
```bash
npm run start-clean    # Kills processes + starts with enhanced logging
```

**Alternative Options:**
```bash
npm start              # Kills processes + starts with concurrently
npm run dev            # Alias for start-clean
```

**Individual Services:**
```bash
npm run server         # Start server only
npm run client         # Start client only
```

**Process Management:**
```bash
npm run kill           # Kill all Node.js processes
npm run kill-ports     # Kill processes on specific ports (3000, 5000, 8080)
```

**Database Management:**
```bash
npm run populate       # Populate MongoDB with fresh mock data (155 tokens)
npm run seed           # Legacy seed command
```

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **WebSocket:** ws://localhost:8080

## 📁 Project Structure

```
feed/
├── client/           # React frontend
├── server/           # Express backend + WebSocket
├── scripts/          # Utility scripts
│   └── start-clean.js # Enhanced startup script
└── docs/            # Documentation
```

## 🗄️ Database Configuration

**MongoDB Setup:**
- **Database:** `feed`
- **Collection:** `feeddata`
- **URI:** `mongodb://127.0.0.1:27017/feed`

The system automatically connects to MongoDB if available, otherwise runs in demo mode.

## ✨ Features

- **Real-time Updates:** Live token data via WebSocket
- **Advanced Filtering:** Search, sort, and filter by multiple criteria
- **MongoDB Integration:** Persistent data storage with 155+ mock tokens
- **Responsive Design:** Dark theme with Solana-inspired aesthetics
- **AlphaScore Algorithm:** Advanced token scoring system
- **Category System:** Organized token classification
- **Performance Metrics:** Market cap, volume, price changes
- **Social Integration:** Twitter, Telegram, Discord metrics

## 🛠️ Development

**Setup:**
```bash
npm run setup          # Install all dependencies
```

**Process Management:**
- The startup scripts automatically kill existing processes
- 3-second delay between kill and start for clean initialization
- Graceful shutdown with Ctrl+C

**Logging:**
- Color-coded console output
- Separate SERVER and CLIENT prefixes
- Error handling and deprecation warning filtering

## 📊 Mock Data

The database includes:
- 5 featured Solana tokens (BONK, JUP, WIF, etc.)
- 150+ randomly generated meme tokens
- Realistic market data and social metrics
- Proper risk classifications and categories

Run `npm run populate` to refresh with new mock data anytime.

---

*Built with React, Node.js, MongoDB, and WebSocket for real-time Solana token analytics.* 