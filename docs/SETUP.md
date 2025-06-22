# 🌌 FEED Setup Guide

Welcome to **FEED** - the ultimate real-time Solana token analytics platform!

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd feed

# Install all dependencies
npm run setup
```

### 2. Environment Configuration

Create environment files:

**Server (`server/.env`):**
```env
PORT=5000
WEBSOCKET_PORT=8080
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/feedDB
MONGODB_NAME=feedDB
LOG_LEVEL=info
```

**Client (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_WS_URL=ws://localhost:8080
REACT_APP_VERSION=1.0.0
```

### 3. Database Setup

```bash
# Start MongoDB service
# On Windows:
net start MongoDB

# On macOS/Linux:
sudo systemctl start mongod

# Seed the database with sample data
cd server
npm run seed
```

### 4. Start Development

```bash
# Start both client and server
npm run dev

# Or start individually:
npm run server:dev  # Backend only
npm run client:dev  # Frontend only
```

## 🏗️ Project Structure

```
feed/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── styles/        # Theme and styling
│   │   ├── types/         # TypeScript definitions
│   │   └── App.tsx        # Main App component
│   └── public/
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── utils/             # Utilities
│   └── index.js           # Server entry point
├── scripts/               # Development scripts
└── docs/                  # Documentation
```

## 🔧 Development Commands

```bash
# Install dependencies
npm run setup

# Start development environment
npm run dev

# Start backend only
npm run server:dev

# Start frontend only
npm run client:dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
cd server && npm run seed

# Run tests
npm test
```

## 🌐 Endpoints

### Frontend
- **Main App**: http://localhost:3000

### Backend
- **API Base**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **WebSocket**: ws://localhost:8080

### API Routes
- `GET /api/tokens` - Get all tokens with filtering
- `GET /api/tokens/trending` - Get trending tokens
- `GET /api/tokens/stats` - Get market statistics
- `GET /api/tokens/categories` - Get available categories

## 🔌 WebSocket Events

### Client → Server
```json
{
  "type": "subscribe",
  "payload": { "channels": ["tokens", "stats"] }
}
```

### Server → Client
```json
{
  "type": "token_update",
  "data": { /* token data */ },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🎨 Features

- **Real-time Token Feed**: Live streaming of Solana token data
- **Advanced Filtering**: Search, category, market cap, and performance filters
- **Color-coded Performance**: Visual indicators for gains and losses
  - **FeedScore Algorithm**: Advanced scoring system for token analysis
- **Responsive Design**: Mobile-friendly dark theme
- **WebSocket Integration**: Low-latency real-time updates
- **Modern UI**: Smooth animations and micro-interactions

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Styled Components** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Axios** for HTTP requests
- **Custom WebSocket Hook** for real-time data

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **WebSocket (ws)** for real-time communication
- **Winston** for logging
- **Node-cron** for scheduled tasks
- **Helmet** for security

## 🔍 Troubleshooting

### Common Issues

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
mongosh --eval "db.runCommand('ping')"

# Start MongoDB service
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod
```

**Port Already in Use:**
```bash
# Kill process on port 5000
npx kill-port 5000

# Kill process on port 3000
npx kill-port 3000
```

**Dependencies Issues:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Deployment

### Production Build
```bash
# Build the client
cd client && npm run build

# Start production server
cd server && npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/feedDB
CORS_ORIGIN=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with precision for real-time Solana analytics** 📊 