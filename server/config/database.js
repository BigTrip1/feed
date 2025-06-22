const mongoose = require('mongoose');
const logger = require('../utils/logger');
const config = require('../config');

const connectDatabase = async () => {
    try {
        const MONGODB_URI = config.MONGODB_URI;
        
        // Skip database connection if no URI is provided
        if (!MONGODB_URI) {
            logger.warn('⚠️  No MongoDB URI provided. Running in demo mode without database.');
            return null;
        }
        
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10
        };

        await mongoose.connect(MONGODB_URI, options);
        
        logger.info(`🎯 MongoDB connected: ${MONGODB_URI}`);

        // Handle connection events
        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('📡 MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('🔄 MongoDB reconnected');
        });

        return mongoose.connection;
    } catch (error) {
        logger.warn('⚠️  Database connection failed. Running in demo mode:', error.message);
        return null;
    }
};

module.exports = { connectDatabase }; 