const winston = require('winston');
const path = require('path');

// Define log levels
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

// Define colors for each level
const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

// Tell winston about the colors
winston.addColors(colors);

// Custom format for console output
const consoleFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let log = `${timestamp} [${level}]: ${message}`;
        
        // Add metadata if present
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }
        
        return log;
    })
);

// Custom format for file output
const fileFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logs directory if it doesn't exist
const fs = require('fs');
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    defaultMeta: { 
        service: 'feed-server',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    },
    transports: [
        // Console transport
        new winston.transports.Console({
            format: consoleFormat,
            handleExceptions: true,
            handleRejections: true
        }),
        
        // File transport for all logs
        new winston.transports.File({
            filename: path.join(logsDir, 'app.log'),
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            handleExceptions: true,
            handleRejections: true
        }),
        
        // File transport for errors only
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            format: fileFormat,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            handleExceptions: true,
            handleRejections: true
        })
    ],
    exitOnError: false
});

// Create a stream object for Morgan HTTP logging
logger.stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};

// Custom methods for specific use cases
logger.token = (action, tokenName, details = {}) => {
    logger.info(`🎯 TOKEN ${action.toUpperCase()}: ${tokenName}`, details);
};

logger.websocket = (action, clientId, details = {}) => {
    logger.info(`🔌 WEBSOCKET ${action.toUpperCase()}: ${clientId}`, details);
};

logger.database = (action, collection, details = {}) => {
    logger.info(`💾 DATABASE ${action.toUpperCase()}: ${collection}`, details);
};

logger.api = (method, endpoint, status, duration, details = {}) => {
    const logLevel = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info';
    logger[logLevel](`🌐 API ${method} ${endpoint} - ${status} (${duration}ms)`, details);
};

// Performance monitoring
logger.performance = (operation, duration, details = {}) => {
    const level = duration > 1000 ? 'warn' : 'debug';
    logger[level](`⚡ PERFORMANCE: ${operation} took ${duration}ms`, details);
};

// FEED specific logging
logger.feed = (message, score, details = {}) => {
  logger.info(`📊 FEED: ${message} (Score: ${score})`, details);
};

module.exports = logger; 