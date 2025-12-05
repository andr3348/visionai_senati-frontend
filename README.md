# 🎭 VisionAI SENATI - Emotion Detection Frontend

Real-time facial emotion detection system using Next.js and WebSocket communication with FastAPI backend.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running (FastAPI WebSocket server)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd visionai_senati-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env.local
   
   # Add a .env file and add your backend WebSocket URL
   # Example: NEXT_PUBLIC_WS_URL=wss://your-backend-url.com/ws/emotion
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000/emotion-detection](http://localhost:3000/emotion-detection) to use the emotion detection feature.

## 📋 Features

- 🎥 Real-time webcam capture
- 🔌 WebSocket communication with backend
- 🧠 Live emotion prediction display
- 📊 Confidence scores and metrics
- 🔄 Auto-reconnection on connection loss
- 📱 Responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **State Management**: React Hooks
- **Communication**: Native WebSocket API

## 📁 Project Structure

```
src/
├── app/
│   ├── emotion-detection/    # Emotion detection page
│   └── ...
├── components/
│   ├── webcam-capture.tsx    # Camera component
│   ├── connection-status.tsx # WebSocket status
│   └── ui/                   # UI components
├── hooks/
│   ├── use-websocket.ts      # WebSocket hook
│   └── use-emotion.ts        # Emotion state management
├── lib/
│   └── constants.ts          # App configuration
└── types/
    └── emotion.ts            # TypeScript types
```

## 🔧 Configuration

Edit `src/lib/constants.ts` to customize:
- Frame capture interval (default: 1000ms)
- Image quality (default: 0.8)
- Video resolution (default: 640x480)
- WebSocket reconnection settings

## 🧪 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
