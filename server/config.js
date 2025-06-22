// Configuration settings for FEED server
module.exports = {
    // MongoDB Configuration
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feed',
    
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // WebSocket Configuration
    WEBSOCKET_PORT: process.env.WEBSOCKET_PORT || 8080,
    
    // CORS Configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
    
    // API Configuration
    API_VERSION: process.env.API_VERSION || 'v1',
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
}; 