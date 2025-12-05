export interface EmotionPrediction {
  emotion_name: string;
  confidence: number;
  model_version_tag: string;
  processing_time_ms: number;
  timestamp: string;
}

// Response from /api/v1/predict endpoint (file upload)
export interface PredictionResponse {
  emotion_name: string;
  confidence: number;
  model_version_tag: string;
  processing_time_ms: number;
}

export interface WebSocketMessage {
  type: 'prediction' | 'error' | 'status';
  status: 'success' | 'error';
  emotion_name?: string;
  confidence?: number;
  model_version_tag?: string;
  processing_time_ms?: number;
  timestamp?: string;
  message?: string; // For error messages
}

export interface FrameData {
  command: 'predict';
  image: string; // base64 encoded image
}

// Emotion labels that the model can predict
export const EMOTION_LABELS = [
  "angry",
  "disgust",
  "fear",
  "happy",
  "neutral",
  "sad",
  "surprise",
] as const;

export type EmotionLabel = (typeof EMOTION_LABELS)[number];
