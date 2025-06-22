const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cron = require('node-cron');
require('dotenv').config();

const logger = require('./utils/logger');
const { connectDatabase } = require('./config/database');
const tokenRoutes = require('./routes/tokens');
const { broadcastTokenUpdate, startWebSocketServer } = require('./services/websocket');
const { generateLiveTokenData } = require('./services/tokenGenerator');
const { generateMockToken } = require('./services/demoData');

const app = express();
const PORT = process.env.PORT || 5000;
const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8080;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/tokens', tokenRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Initialize server
async function startServer() {
    try {
        // Connect to database (optional)
        const dbConnection = await connectDatabase();
        if (dbConnection) {
            logger.info('✅ Database connected successfully');
        } else {
            logger.info('📊 Running in demo mode without database');
        }

        // Start WebSocket server
        const wss = startWebSocketServer(WEBSOCKET_PORT);
        logger.info(`🔌 WebSocket server running on port ${WEBSOCKET_PORT}`);

        // Start HTTP server
        app.listen(PORT, () => {
            logger.info(`🚀 FEED Server running on port ${PORT}`);
            logger.info(`📊 FEED Analytics Engine: ACTIVATED`);
            if (!process.env.MONGODB_URI) {
                logger.info(`💡 To connect to MongoDB, add MONGODB_URI to your .env file`);
            }
        });

        // Start periodic token data generation only if database is connected
        if (dbConnection) {
            cron.schedule('*/5 * * * * *', async () => {
                try {
                    const tokenData = await generateLiveTokenData();
                    broadcastTokenUpdate(tokenData);
                } catch (error) {
                    logger.error('Error generating token data:', error);
                }
            });
        } else {
            // In demo mode, generate mock data for WebSocket
            cron.schedule('*/3 * * * * *', async () => {
                try {
                    const mockToken = generateMockToken();
                    broadcastTokenUpdate(mockToken);
                } catch (error) {
                    logger.error('Error generating mock data:', error);
                }
            });
        }

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('🛑 Received SIGTERM, shutting down gracefully');
            if (dbConnection) {
                mongoose.connection.close();
            }
            wss.close();
            process.exit(0);
        });

    } catch (error) {
        logger.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer(); 