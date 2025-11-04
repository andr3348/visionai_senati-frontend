"use client";

import React from "react";
import WebcamCapture from "@/components/webcam-capture";
import ConnectionStatus from "@/components/connection-status";
import { useEmotion } from "@/hooks/use-emotion";
import { WS_CONFIG } from "@/lib/constants";

const EmotionDetection = () => {
  const {
    prediction,
    isProcessing,
    isConnected,
    isConnecting,
    error,
    sendFrame,
    reconnectionAttempt,
  } = useEmotion();

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
            captureInterval={WS_CONFIG.reconnectInterval}
            isProcessing={isProcessing}
          />
        </div>

        {/* Predictions Section */}
        <div className="w-full lg:w-80 min-h-[200px] lg:min-h-0">
          <div className="bg-slate-50 w-full h-full rounded-lg border border-slate-200 flex flex-col items-center justify-center p-6 gap-4">
            {/* Prediction Display */}
            {prediction ? (
              <div className="text-center space-y-3">
                <div className="space-y-1">
                  <p className="text-4xl font-bold capitalize text-slate-800">
                    {prediction.emotion}
                  </p>
                  <p className="text-sm text-slate-600">
                    Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>

                {/* Confidence Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full transition-all duration-300"
                    style={{
                      width: `${prediction.confidence * 100}%`,
                    }}
                  />
                </div>

                <p className="text-xs text-slate-400">
                  Last updated: {new Date(prediction.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ) : (
              <div className="text-center space-y-2">
                <p className="text-gray-600 font-medium">Waiting for predictions</p>
                <p className="text-xs text-gray-400">
                  Position your face in front of the camera
                </p>
              </div>
            )}

            {/* Status Info */}
            <div className="mt-auto pt-4 border-t border-slate-200 w-full">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <p className="text-slate-500">Connection</p>
                  <p className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-slate-500">Status</p>
                  <p className={`font-medium ${isProcessing ? 'text-blue-600' : 'text-slate-600'}`}>
                    {isProcessing ? 'Processing' : 'Idle'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetection;
