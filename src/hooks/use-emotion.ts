import { useState, useCallback } from 'react';
import { useWebSocket } from './use-websocket';
import { WS_CONFIG } from '@/lib/constants';
import type { WebSocketMessage, EmotionPrediction, FrameData } from '@/types/emotion';

interface UseEmotionReturn {
  prediction: EmotionPrediction | null;
  isProcessing: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sendFrame: (imageData: string) => void;
  reconnectionAttempt: number;
}

export const useEmotion = (): UseEmotionReturn => {
  const [prediction, setPrediction] = useState<EmotionPrediction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);

  // Handle incoming WebSocket messages
  const handleMessage = useCallback((message: WebSocketMessage) => {
    if (!message) return;

    switch (message.type) {
      case 'prediction':
        // Backend sent emotion prediction
        setPrediction(message.data as EmotionPrediction);
        setIsProcessing(false);
        break;

      case 'status':
        // Backend status update (e.g., 'processing', 'idle')
        const status = String(message.data);
        setIsProcessing(status === 'processing');
        break;

      case 'error':
        // Backend error occurred
        console.error('Backend error:', message.data);
        setIsProcessing(false);
        break;

      default:
        console.warn('Unknown message type:', message);
    }
  }, []);

  // Handle WebSocket errors
  const handleError = useCallback((error: Event) => {
    console.error('WebSocket error:', error);
    setIsProcessing(false);
  }, []);

  const { sendMessage, isConnected, isConnecting, error } = useWebSocket<WebSocketMessage>({
    url: WS_CONFIG.url,
    onMessage: handleMessage,
    onError: handleError,
    reconnectInterval: WS_CONFIG.reconnectInterval,
    maxReconnectAttempts: WS_CONFIG.maxReconnectAttempts,
  });

  // Track reconnection attempts
  useState(() => {
    if (!isConnected && !isConnecting && error) {
      setReconnectionAttempt((prev) => prev + 1);
    } else if (isConnected) {
      setReconnectionAttempt(0);
    }
  });

  // Send frame to backend
  const sendFrame = useCallback(
    (imageData: string) => {
      // Only send if connected and not currently processing
      if (!isConnected || isProcessing) {
        return;
      }

      const frameData: FrameData = {
        image: imageData,
        timestamp: Date.now(),
      };

      const payload = {
        type: 'frame' as const,
        data: frameData,
      };

      sendMessage(payload);
      setIsProcessing(true);
    },
    [isConnected, isProcessing, sendMessage]
  );

  return {
    prediction,
    isProcessing,
    isConnected,
    isConnecting,
    error,
    sendFrame,
    reconnectionAttempt,
  };
};
