import { useCallback, useEffect, useRef, useState } from "react";

interface UseWebSocketOptions<T = unknown> {
  url: string;
  onMessage?: (data: T) => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  autoConnect?: boolean;
}

interface UseWebSocketReturn {
  sendMessage: (data: unknown) => void;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
}

export const useWebSocket = <T = unknown>({
  url,
  onMessage,
  onError,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  autoConnect = true,
}: UseWebSocketOptions<T>): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const intentionalDisconnectRef = useRef(false);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    intentionalDisconnectRef.current = false;
    setIsConnecting(true);
    setError(null);

    try {
      const ws = new WebSocket(url);

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as T;
          onMessage?.(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("Connection error occurred");
        onError?.(event);
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);
        setIsConnecting(false);

        // Only attempt to reconnect if disconnect was not intentional
        if (!intentionalDisconnectRef.current && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          console.log(
            `Reconnecting... Attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts}`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval);
        } else if (intentionalDisconnectRef.current) {
          console.log("Connection closed intentionally");
          reconnectAttemptsRef.current = 0;
        } else {
          setError("Max reconnection attempts reached");
        }
      };
      wsRef.current = ws;
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      setError("Failed to establish connection");
      setIsConnecting(false);
    }
  }, [url, onMessage, onError, reconnectInterval, maxReconnectAttempts]);

  const disconnect = useCallback(() => {
    intentionalDisconnectRef.current = true;
    reconnectAttemptsRef.current = 0;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = undefined;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setError(null);
  }, []);

  const sendMessage = useCallback((data: unknown) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn("WebSocket is not connected");
    }
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connect, autoConnect]);

  return {
    sendMessage,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
  };
};
