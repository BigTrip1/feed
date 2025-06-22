import { useState, useEffect, useRef, useCallback } from 'react';

export type WebSocketState = 'Connecting' | 'Open' | 'Closing' | 'Closed';

interface UseWebSocketReturn {
  lastMessage: MessageEvent | null;
  connectionState: WebSocketState;
  sendMessage: (message: string) => void;
  reconnect: () => void;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);
  const [connectionState, setConnectionState] = useState<WebSocketState>('Connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectInterval = 3000; // 3 seconds

  const connect = useCallback(() => {
    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🔗 WebSocket connected');
        setConnectionState('Open');
        reconnectAttemptsRef.current = 0;
        
        // Send initial subscription message
        ws.send(JSON.stringify({
          type: 'subscribe',
          payload: { channels: ['tokens', 'stats'] }
        }));
      };

      ws.onmessage = (event) => {
        setLastMessage(event);
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', event.code, event.reason);
        setConnectionState('Closed');
        
        // Attempt to reconnect if not a manual close
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          const timeout = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            console.log(`🔄 Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`);
            connect();
          }, reconnectInterval);
          
          reconnectTimeoutRef.current = timeout;
        }
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        setConnectionState('Closed');
      };

      // Set state to connecting
      setConnectionState('Connecting');

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setConnectionState('Closed');
    }
  }, [url]);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(message);
    } else {
      console.warn('WebSocket is not connected. Message not sent:', message);
    }
  }, []);

  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    connect();
  }, [connect]);

  // Initialize connection
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, 'Component unmounting');
      }
    };
  }, [connect]);

  // Heartbeat to keep connection alive
  useEffect(() => {
    if (connectionState === 'Open') {
      const heartbeat = setInterval(() => {
        sendMessage(JSON.stringify({ type: 'ping' }));
      }, 30000); // Send ping every 30 seconds

      return () => clearInterval(heartbeat);
    }
  }, [connectionState, sendMessage]);

  return {
    lastMessage,
    connectionState,
    sendMessage,
    reconnect
  };
}; 