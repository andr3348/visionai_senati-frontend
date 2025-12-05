"use client";

import React from "react";
import WebcamCapture from "@/components/webcam-capture";
import ConnectionStatus from "@/components/connection-status";
import { useEmotion } from "@/hooks/use-emotion";
import { WS_CONFIG, CAPTURE_CONFIG } from "@/lib/constants";
import { useAuth } from "@/contexts/auth.context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const EmotionDetection = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const {
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
    connect,
    disconnect,
  } = useEmotion();

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to use the real-time emotion detection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 h-full w-full p-4 sm:p-6 lg:p-8">
      {/* Connection Status Banner */}
      <ConnectionStatus
        isConnected={isConnected}
        isConnecting={isConnecting}
        error={error}
        reconnectionAttempt={reconnectionAttempt}
        maxAttempts={WS_CONFIG.maxReconnectAttempts}
      />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 flex-1">
        {/* Camera Section */}
        <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-0">
          <WebcamCapture
            onFrame={sendFrame}
            captureInterval={CAPTURE_CONFIG.interval}
            isProcessing={isProcessing}
            isConnected={isConnected}
            onStart={connect}
            onStop={() => {
              disconnect();
              resetPrediction();
            }}
          />
        </div>

        {/* Predictions Section */}
        <div className="w-full lg:w-80 min-h-[200px] lg:min-h-0">
          <div className="bg-card border-border w-full h-full rounded-lg border flex flex-col p-6 gap-4">
            {/* Prediction Display */}
            {prediction ? (
              <div className="flex-1 flex flex-col justify-center text-center space-y-4">
                {/* Emotion Emoji */}
                <div className="text-6xl animate-in fade-in zoom-in duration-300">
                  {getEmotionEmoji(prediction.emotion_name)}
                </div>

                {/* Emotion Name */}
                <div className="space-y-1">
                  <h2 className="text-3xl font-bold capitalize">
                    {prediction.emotion_name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Confidence Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${prediction.confidence * 100}%`,
                    }}
                  />
                </div>

                {/* Metadata */}
                <div className="pt-2 space-y-1.5 text-xs text-muted-foreground">
                  {processingTimeMs !== null && (
                    <div className="flex justify-between items-center">
                      <span>Processing Time:</span>
                      <span className="font-mono font-semibold">
                        {processingTimeMs}ms
                      </span>
                    </div>
                  )}
                  {modelVersion && (
                    <div className="flex justify-between items-center">
                      <span>Model Version:</span>
                      <span className="font-mono font-semibold">
                        {modelVersion}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span>Last Updated:</span>
                    <span className="font-mono">
                      {new Date(prediction.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
                <div className="text-muted-foreground text-5xl">🤔</div>
                <div>
                  <p className="text-foreground font-medium">
                    Waiting for prediction...
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Position your face in front of the camera
                  </p>
                </div>
              </div>
            )}

            {/* Status Info */}
            <div className="pt-4 border-t border-border w-full">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span className="text-muted-foreground font-medium">
                    {isConnected ? "Connected" : "Disconnected"}
                  </span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isProcessing
                        ? "bg-blue-500 animate-pulse"
                        : "bg-muted"
                    }`}
                  />
                  <span className="text-muted-foreground font-medium">
                    {isProcessing ? "Processing" : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get emoji for emotion
function getEmotionEmoji(emotion: string): string {
  const emojiMap: Record<string, string> = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    surprise: "😮",
    fear: "😨",
    disgust: "🤢",
    neutral: "😐",
  };
  return emojiMap[emotion.toLowerCase()] || "🤔";
}

export default EmotionDetection;
