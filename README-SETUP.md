# 🚀 FEED Server Setup

## Environment Configuration

Create a `.env` file in the `server` directory with the following variables:

```bash
# Database Configuration (Optional - leave commented for demo mode)
# MONGODB_URI=your_mongodb_connection_string_here

# Server Configuration
PORT=5000
WEBSOCKET_PORT=8080
NODE_ENV=development
```

## Running the Server

1. **Demo Mode (No Database)**: Simply run `npm run dev` - the server will work with mock data
2. **With MongoDB**: Add your `MONGODB_URI` to the `.env` file, then run `npm run dev`

## Demo Mode Features

When running without MongoDB:
- ✅ Server starts successfully
- ✅ WebSocket connections work
- ✅ API endpoints return demo data
- ✅ Real-time mock data generation
- ✅ All frontend features functional

## Environment Variables

- `MONGODB_URI`: Your MongoDB connection string (optional)
- `PORT`: Server port (default: 5000)
- `WEBSOCKET_PORT`: WebSocket server port (default: 8080)
- `NODE_ENV`: Environment mode (development/production) 