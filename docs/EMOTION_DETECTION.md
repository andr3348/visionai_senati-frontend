# Emotion Detection Feature

## Overview

The Emotion Detection feature uses real-time video streaming combined with face detection and machine learning to identify facial emotions. This document describes the implementation and usage.

## Architecture

### Components Structure

```
src/
├── app/
│   └── emotion-detection/
│       └── page.tsx              # Main page component
├── components/
│   ├── webcam-capture.tsx        # Webcam streaming & face detection
│   └── connection-status.tsx     # WebSocket connection status indicator
├── hooks/
│   ├── use-websocket.ts          # Generic WebSocket hook
│   ├── use-emotion.ts            # Emotion-specific logic hook
│   └── use-face-detection.ts     # Client-side face detection
├── types/
│   └── emotion.ts                # TypeScript type definitions
└── lib/
    └── constants.ts              # Configuration constants
```

## Features

### 1. **Client-Side Face Detection**
- Uses `face-api.js` with TinyFaceDetector model
- Only sends frames when a face is detected
- Reduces bandwidth and backend processing
- Visual indicators for face detection status

### 2. **WebSocket Integration**
- Real-time bidirectional communication with FastAPI backend
- Automatic reconnection with exponential backoff
- Connection state management and visual feedback
- Type-safe message handling

### 3. **Smart Frame Capture**
- Configurable capture interval (default: 1000ms)
- Prevents sending frames while backend is processing
- Base64 JPEG encoding with 80% quality
- Canvas-based frame extraction

### 4. **UX Improvements**
- Real-time connection status banner
- Processing state indicators
- Reconnection attempt visualization with progress bar
- Face detection status badges
- Confidence level display with visual progress bar

## Usage

### Prerequisites

1. **Face Detection Models**: Download and place in `/public/models/`:
   - `tiny_face_detector_model-weights_manifest.json`
   - `tiny_face_detector_model-shard1`

2. **Environment Variables**: Set in `.env.local`:
   ```env
   NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/emotion
   ```

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Navigate to `/emotion-detection` to use the feature.

## Custom Hooks

### `useEmotion()`

Centralized hook for emotion detection logic:

```typescript
const {
  prediction,        // Current emotion prediction
  isProcessing,      // Backend processing state
  isConnected,       // WebSocket connection status
  isConnecting,      // Connection in progress
  error,             // Connection error message
  sendFrame,         // Function to send frame data
  reconnectionAttempt // Current reconnection attempt number
} = useEmotion();
```

### `useFaceDetection()`

Face detection functionality:

```typescript
const {
  detectFace,        // Function to detect face in video element
  isModelLoaded,     // Model loaded successfully
  isLoading,         // Model loading in progress
  error              // Model loading error
} = useFaceDetection();
```

### `useWebSocket<T>()`

Generic WebSocket hook with auto-reconnection:

```typescript
const {
  sendMessage,       // Send data through WebSocket
  isConnected,       // Connection status
  isConnecting,      // Connecting status
  error              // Connection error
} = useWebSocket<MessageType>({
  url,
  onMessage,
  onError,
  reconnectInterval,
  maxReconnectAttempts
});
```

## Backend Integration

### Expected WebSocket Message Format

**Client → Backend (Frame Data)**:
```json
{
  "type": "frame",
  "data": {
    "image": "data:image/jpeg;base64,...",
    "timestamp": 1699123456789
  }
}
```

**Backend → Client (Prediction)**:
```json
{
  "type": "prediction",
  "data": {
    "emotion": "happy",
    "confidence": 0.95,
    "timestamp": 1699123456790
  }
}
```

**Backend → Client (Status)**:
```json
{
  "type": "status",
  "data": "processing"
}
```

**Backend → Client (Error)**:
```json
{
  "type": "error",
  "data": "Error message here"
}
```

## Configuration

### Constants (`src/lib/constants.ts`)

```typescript
// WebSocket Configuration
export const WS_CONFIG = {
  url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/emotion',
  reconnectInterval: 3000,      // 3 seconds
  maxReconnectAttempts: 5,
};

// Frame Capture Configuration
export const CAPTURE_CONFIG = {
  interval: 1000,               // 1 second
  imageFormat: 'image/jpeg',
  imageQuality: 0.8,            // 80%
  videoConstraints: {
    width: 640,
    height: 480,
    facingMode: 'user',
  },
};
```

## Performance Optimizations

1. **Face Detection First**: Only captures and sends frames when a face is detected
2. **Processing Lock**: Prevents sending new frames while backend is processing
3. **Optimized Model**: Uses TinyFaceDetector (lightweight, fast)
4. **Reduced Quality**: JPEG at 80% quality for smaller payload
5. **Configurable Interval**: Adjustable frame capture rate

## Troubleshooting

### Face Detection Not Working
- Ensure models are in `/public/models/` directory
- Check browser console for model loading errors
- Verify model files are not corrupted

### WebSocket Connection Failing
- Verify backend is running on the specified URL
- Check CORS settings on backend
- Ensure `.env.local` has correct `NEXT_PUBLIC_WS_URL`

### No Predictions Received
- Check browser console for WebSocket errors
- Verify backend is sending messages in expected format
- Ensure backend WebSocket endpoint matches client URL

## Future Enhancements

- [ ] Multi-face detection support
- [ ] Emotion history/analytics visualization
- [ ] Adjustable detection sensitivity
- [ ] Screenshot capture of detected emotions
- [ ] Export emotion data as CSV/JSON
- [ ] Real-time emotion trend graphs
