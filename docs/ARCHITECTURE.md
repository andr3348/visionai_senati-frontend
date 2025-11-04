# Data Flow Architecture

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Emotion Detection Page                          │
│                     (emotion-detection/page.tsx)                        │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────┐   │
│  │                    useEmotion() Hook                            │   │
│  │  • Manages WebSocket connection                                │   │
│  │  • Parses incoming messages                                    │   │
│  │  • Tracks prediction state                                     │   │
│  │  • Handles reconnection logic                                  │   │
│  └────────────────────────────────────────────────────────────────┘   │
│         │                              │                               │
│         │ sendFrame()                  │ prediction, status            │
│         ▼                              ▼                               │
│  ┌─────────────────┐          ┌─────────────────┐                     │
│  │ WebcamCapture   │          │ ConnectionStatus│                     │
│  │   Component     │          │    Component     │                     │
│  └─────────────────┘          └─────────────────┘                     │
└─────────────────────────────────────────────────────────────────────────┘

                                    │
                                    │ WebSocket
                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                       useWebSocket() Hook                                │
│  • Generic WebSocket manager                                            │
│  • Auto-reconnection with backoff                                       │
│  • Type-safe message passing                                            │
│  • Connection state tracking                                            │
└─────────────────────────────────────────────────────────────────────────┘

                                    │
                                    ▼

                        WebSocket Connection (wss://)
                                    │
                                    ▼

┌─────────────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend (Python)                             │
│                                                                          │
│  WebSocket Endpoint: /ws/emotion                                        │
│  • Receives base64 image frames                                         │
│  • Decodes image data                                                   │
│  • Runs through emotion detection model                                │
│  • Returns prediction with confidence                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Detailed Data Flow

### 1. Camera Initialization
```
User clicks "Start Camera"
    ↓
WebcamCapture requests camera access
    ↓
useFaceDetection loads models from /public/models/
    ↓
Camera stream starts
    ↓
Status indicators update: "Recording" + "Loading AI Model..."
    ↓
Models loaded → Status: "No Face"
```

### 2. Frame Capture with Face Detection
```
Every 1 second (configurable):
    ↓
captureFrame() called
    ↓
useFaceDetection.detectFace(video)
    ↓
┌─────────────────────────────────┐
│ Is face detected?               │
│                                 │
│  NO → Skip frame                │
│       Update status: "No Face"  │
│       Return early              │
│                                 │
│  YES → Continue                 │
│        Update status:           │
│        "Face Detected"          │
└─────────────────────────────────┘
    ↓
Canvas draws current video frame
    ↓
Convert to base64 JPEG (80% quality)
    ↓
Call onFrame(imageData)
    ↓
Trigger sendFrame in page component
```

### 3. Sending Frame to Backend
```
sendFrame(imageData) called
    ↓
┌─────────────────────────────────┐
│ Check conditions:               │
│  • Is WebSocket connected?      │
│  • Is backend processing?       │
│                                 │
│  NO → Return early              │
│  YES → Continue                 │
└─────────────────────────────────┘
    ↓
Create payload:
{
  type: "frame",
  data: {
    image: "data:image/jpeg;base64,...",
    timestamp: 1699123456789
  }
}
    ↓
useWebSocket.sendMessage(payload)
    ↓
Set isProcessing = true
    ↓
Status indicator: "Processing..."
```

### 4. Receiving Prediction
```
Backend processes frame
    ↓
Sends WebSocket message:
{
  type: "prediction",
  data: {
    emotion: "happy",
    confidence: 0.95,
    timestamp: 1699123456790
  }
}
    ↓
useWebSocket receives message
    ↓
onMessage callback in useEmotion
    ↓
handleMessage() parses message.type
    ↓
Switch on message type:
  • "prediction" → Update prediction state
                 → Set isProcessing = false
  • "status"     → Update processing state
  • "error"      → Log error, set isProcessing = false
    ↓
UI updates with new prediction
    ↓
Display emotion + confidence bar
    ↓
Status: "Idle" (ready for next frame)
```

### 5. Reconnection Flow
```
WebSocket connection lost
    ↓
useWebSocket detects disconnect (onclose event)
    ↓
Check reconnection attempts < maxAttempts (5)
    ↓
Set isConnecting = true
    ↓
ConnectionStatus shows "Reconnecting... (1/5)"
    ↓
Progress bar animates: 20% filled
    ↓
Wait 3 seconds (reconnectInterval)
    ↓
Attempt reconnection
    ↓
┌─────────────────────────────────┐
│ Connection successful?          │
│                                 │
│  YES → Reset attempt counter    │
│        Status: "Connected"      │
│                                 │
│  NO → Increment attempt counter │
│       Retry with backoff        │
└─────────────────────────────────┘
    ↓
If max attempts reached:
    Status: "Connection Failed"
    Show error message
```

## State Management

### Component State
```
┌─────────────────────────────────┐
│  emotion-detection/page.tsx     │
│  • No local state               │
│  • All state from useEmotion    │
└─────────────────────────────────┘
         │
         │ uses
         ▼
┌─────────────────────────────────┐
│       useEmotion() Hook         │
│  • prediction                   │
│  • isProcessing                 │
│  • isConnected                  │
│  • isConnecting                 │
│  • error                        │
│  • reconnectionAttempt          │
└─────────────────────────────────┘
         │
         │ uses
         ▼
┌─────────────────────────────────┐
│     useWebSocket() Hook         │
│  • isConnected                  │
│  • isConnecting                 │
│  • error                        │
│  • WebSocket instance           │
│  • reconnect attempts           │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   WebcamCapture Component       │
│  • isStreaming                  │
│  • stream                       │
│  • error                        │
│  • hasFace                      │
│  • Uses useFaceDetection        │
└─────────────────────────────────┘
         │
         │ uses
         ▼
┌─────────────────────────────────┐
│   useFaceDetection() Hook       │
│  • isModelLoaded                │
│  • isLoading                    │
│  • error                        │
│  • detectFace function          │
└─────────────────────────────────┘
```

## Performance Optimizations

### Frame Filtering Pipeline
```
Frame captured every 1 second
    ↓
┌──────────────────────────┐
│ Optimization Layer 1:    │
│ Face Detection           │
│ • Skip if no face        │
│ • ~50% reduction         │
└──────────────────────────┘
    ↓
┌──────────────────────────┐
│ Optimization Layer 2:    │
│ Processing Lock          │
│ • Skip if processing     │
│ • Prevents queue buildup │
└──────────────────────────┘
    ↓
┌──────────────────────────┐
│ Optimization Layer 3:    │
│ Connection Check         │
│ • Skip if disconnected   │
│ • Saves bandwidth        │
└──────────────────────────┘
    ↓
Frame sent to backend
(Only ~30-40% of captured frames)
```

## Type Safety Flow

```typescript
// Type-safe message passing

FrameData (Client)
    ↓
JSON.stringify()
    ↓
WebSocket.send()
    ↓
[Network]
    ↓
Backend receives
    ↓
Process with ML model
    ↓
EmotionPrediction created
    ↓
JSON.stringify()
    ↓
WebSocket.send()
    ↓
[Network]
    ↓
WebSocket.onmessage
    ↓
JSON.parse() as T
    ↓
Type guard: message.type
    ↓
TypeScript knows exact type
    ↓
Safe property access
```

---

This architecture ensures:
- ✅ Type safety throughout
- ✅ Efficient bandwidth usage
- ✅ Automatic error recovery
- ✅ Clear separation of concerns
- ✅ Maintainable codebase
