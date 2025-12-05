export const ROUTES = {
    home: '/',
    liveEmotionDetection: '/live-emotion-detection',
    emotionDetection: '/emotion-detection',
    analytics: '/analytics',
};

// WebSocket Configuration
export const WS_CONFIG = {
    url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws/emotion',
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
};

// Frame Capture Configuration
export const CAPTURE_CONFIG = {
    interval: 1000, // Capture frame every 1 second
    imageFormat: 'image/jpeg' as const,
    imageQuality: 0.8,
    videoConstraints: {
        width: 640,
        height: 480,
        facingMode: 'user' as const,
    },
};
