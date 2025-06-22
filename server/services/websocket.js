const WebSocket = require('ws');
const logger = require('../utils/logger');

let wss = null;
let clients = new Set();

// Initialize WebSocket server
function startWebSocketServer(port) {
    wss = new WebSocket.Server({ 
        port,
        perMessageDeflate: false,
        maxPayload: 1024 * 1024 // 1MB max payload
    });

    wss.on('connection', (ws, request) => {
        const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        ws.clientId = clientId;
        clients.add(ws);

        logger.info(`🔗 Client connected: ${clientId} (Total: ${clients.size})`);

        // Send welcome message
        ws.send(JSON.stringify({
            type: 'connection',
            message: 'Connected to FEED WebSocket',
            clientId,
            timestamp: new Date().toISOString()
        }));

        // Handle client messages
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                handleClientMessage(ws, data);
            } catch (error) {
                logger.error(`Error parsing client message: ${error.message}`);
                ws.send(JSON.stringify({
                    type: 'error',
                    message: 'Invalid JSON format'
                }));
            }
        });

        // Handle client disconnect
        ws.on('close', (code, reason) => {
            clients.delete(ws);
            logger.info(`🔌 Client disconnected: ${clientId} (Code: ${code}, Reason: ${reason}) (Total: ${clients.size})`);
        });

        // Handle errors
        ws.on('error', (error) => {
            logger.error(`WebSocket error for ${clientId}:`, error);
            clients.delete(ws);
        });

        // Ping-pong for connection health
        ws.isAlive = true;
        ws.on('pong', () => {
            ws.isAlive = true;
        });
    });

    // Heartbeat to detect broken connections
    const interval = setInterval(() => {
        wss.clients.forEach((ws) => {
            if (ws.isAlive === false) {
                clients.delete(ws);
                return ws.terminate();
            }
            
            ws.isAlive = false;
            ws.ping();
        });
    }, 30000); // 30 seconds

    wss.on('close', () => {
        clearInterval(interval);
    });

    logger.info(`🚀 WebSocket server started on port ${port}`);
    return wss;
}

// Handle client messages
function handleClientMessage(ws, data) {
    const { type, payload } = data;

    switch (type) {
        case 'subscribe':
            handleSubscription(ws, payload);
            break;
        case 'unsubscribe':
            handleUnsubscription(ws, payload);
            break;
        case 'ping':
            ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
            break;
        default:
            logger.warn(`Unknown message type: ${type}`);
            ws.send(JSON.stringify({
                type: 'error',
                message: `Unknown message type: ${type}`
            }));
    }
}

// Handle subscription requests
function handleSubscription(ws, payload) {
    const { channels } = payload;
    
    if (!ws.subscriptions) {
        ws.subscriptions = new Set();
    }
    
    channels.forEach(channel => {
        ws.subscriptions.add(channel);
        logger.info(`📡 Client ${ws.clientId} subscribed to: ${channel}`);
    });

    ws.send(JSON.stringify({
        type: 'subscription_confirmed',
        channels: Array.from(ws.subscriptions),
        timestamp: new Date().toISOString()
    }));
}

// Handle unsubscription requests
function handleUnsubscription(ws, payload) {
    const { channels } = payload;
    
    if (ws.subscriptions) {
        channels.forEach(channel => {
            ws.subscriptions.delete(channel);
            logger.info(`📡 Client ${ws.clientId} unsubscribed from: ${channel}`);
        });
    }

    ws.send(JSON.stringify({
        type: 'unsubscription_confirmed',
        channels: channels,
        timestamp: new Date().toISOString()
    }));
}

// Broadcast token update to all connected clients
function broadcastTokenUpdate(tokenData) {
    if (!wss || clients.size === 0) {
        return;
    }

    const message = JSON.stringify({
        type: 'token_update',
        data: tokenData,
        timestamp: new Date().toISOString()
    });

    let successCount = 0;
    let errorCount = 0;

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                // Check if client is subscribed to token updates
                if (!client.subscriptions || client.subscriptions.has('tokens') || client.subscriptions.size === 0) {
                    client.send(message);
                    successCount++;
                }
            } catch (error) {
                logger.error(`Error sending to client ${client.clientId}:`, error);
                errorCount++;
                clients.delete(client);
            }
        } else {
            clients.delete(client);
        }
    });

    if (successCount > 0) {
        logger.debug(`📤 Broadcasted token update to ${successCount} clients (${errorCount} errors)`);
    }
}

// Broadcast market statistics
function broadcastMarketStats(stats) {
    if (!wss || clients.size === 0) {
        return;
    }

    const message = JSON.stringify({
        type: 'market_stats',
        data: stats,
        timestamp: new Date().toISOString()
    });

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            try {
                if (!client.subscriptions || client.subscriptions.has('stats')) {
                    client.send(message);
                }
            } catch (error) {
                logger.error(`Error sending stats to client ${client.clientId}:`, error);
                clients.delete(client);
            }
        }
    });
}

// Get connection statistics
function getConnectionStats() {
    return {
        totalConnections: clients.size,
        activeConnections: Array.from(clients).filter(client => 
            client.readyState === WebSocket.OPEN
        ).length,
        timestamp: new Date().toISOString()
    };
}

module.exports = {
    startWebSocketServer,
    broadcastTokenUpdate,
    broadcastMarketStats,
    getConnectionStats
}; 