import { useState, useCallback, useEffect } from 'react';
import { useWebSocket } from './use-websocket';
import type { WebSocketMessage, EmotionPrediction } from '@/types/emotion';
import { getAccessToken } from '@/lib/api-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'wss://58g786gw-8000.brs.devtunnels.ms';

interface UseEmotionReturn {
  prediction: EmotionPrediction | null;
  isProcessing: boolean;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sendFrame: (imageData: string) => void;
  resetPrediction: () => void;
  reconnectionAttempt: number;
  processingTimeMs: number | null;
  modelVersion: string | null;
}

export const useEmotion = (): UseEmotionReturn => {
  const [prediction, setPrediction] = useState<EmotionPrediction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);
  const [modelVersion, setModelVersion] = useState<string | null>(null);

  const handleMessage = useCallback((data: WebSocketMessage) => {
    console.log('Received WebSocket message:', data);

    if (data.type === 'prediction' && data.status === 'success') {
      // Update prediction
      const newPrediction: EmotionPrediction = {
        emotion_name: data.emotion_name || 'unknown',
        confidence: data.confidence || 0,
        model_version_tag: data.model_version_tag || 'unknown',
        processing_time_ms: data.processing_time_ms || 0,
        timestamp: data.timestamp || new Date().toISOString(),
      };

      setPrediction(newPrediction);
      setProcessingTimeMs(data.processing_time_ms || null);
      setModelVersion(data.model_version_tag || null);
      setIsProcessing(false);
    } else if (data.type === 'error' || data.status === 'error') {
      // Backend handles face detection - may return 'no_face_detected' or other errors
      console.error('Backend error:', data.message || 'Unknown error');
      setIsProcessing(false);
    }
  }, []);

  const handleError = useCallback((event: Event) => {
    console.error('WebSocket error:', event);
    setIsProcessing(false);
  }, []);

  const { sendMessage, isConnected, isConnecting, error } = useWebSocket<WebSocketMessage>({
    url: WS_URL,
    onMessage: handleMessage,
    onError: handleError,
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
  });

  // Track reconnection attempts
  useEffect(() => {
    if (isConnecting && !isConnected) {
      setReconnectionAttempt((prev) => prev + 1);
    } else if (isConnected) {
      setReconnectionAttempt(0);
    }
  }, [isConnecting, isConnected]);

  const sendFrame = useCallback(
    (imageData: string) => {
      if (!isConnected) {
        console.warn('Cannot send frame: WebSocket not connected');
        return;
      }

      if (isProcessing) {
        console.warn('Cannot send frame: Previous frame still processing');
        return;
      }

      // Get access token for authentication
      const token = getAccessToken();
      if (!token) {
        console.error('Cannot send frame: No authentication token');
        return;
      }

      // Remove the data URL prefix if present
      const base64Image = imageData.replace(/^data:image\/\w+;base64,/, '');

      // Send frame with the command structure and token
      sendMessage({
        command: 'predict',
        image: base64Image,
        token: token,
      });

      setIsProcessing(true);
      console.log('Frame sent to backend');
    },
    [sendMessage, isConnected, isProcessing]
  );

  const resetPrediction = useCallback(() => {
    setPrediction(null);
    setIsProcessing(false);
    setProcessingTimeMs(null);
    setModelVersion(null);
  }, []);

  return {
    prediction,
    isProcessing,
    isConnected,
    isConnecting,
    error,
    sendFrame,
    resetPrediction,
    reconnectionAttempt,
    processingTimeMs,
    modelVersion,
  };
};
