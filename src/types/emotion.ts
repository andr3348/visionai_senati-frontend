export interface EmotionPrediction {
  emotion: string;
  confidence: number;
  timestamp: number;
}

export interface WebSocketMessage {
  type: 'prediction' | 'error' | 'status';
  data: EmotionPrediction | string;
}

export interface FrameData {
  image: string; // base64 encoded image
  timestamp: number;
}

// Emotion labels that the model can predict
export const EMOTION_LABELS = [
  'angry',
  'disgust',
  'fear',
  'happy',
  'neutral',
  'sad',
  'surprise',
] as const;

export type EmotionLabel = typeof EMOTION_LABELS[number];

