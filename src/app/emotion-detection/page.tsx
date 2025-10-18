"use client";

import React, { useState } from "react";
import WebcamCapture from "@/components/webcam-capture";

const EmotionDetection = () => {
  const [prediction, setPrediction] = useState<string>("");

  // This function will be called every time a frame is captured
  const handleFrame = (imageData: string) => {
    // TODO: Send imageData to your WebSocket endpoint
    console.log("Frame captured, ready to send to ML model");
    
    // For now, just log it
    // Next step: Implement WebSocket connection here
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 h-full w-full p-4 sm:p-6 lg:p-8">
      {/* Camera Section */}
      <div className="flex-1 flex items-center justify-center min-h-[300px] lg:min-h-0">
        <WebcamCapture 
          onFrame={handleFrame}
          captureInterval={1000} // Capture frame every 1 second
        />
      </div>

      {/* Predictions Section */}
      <div className="w-full lg:w-80 min-h-[200px] lg:min-h-0">
        <div className="bg-slate-50 w-full h-full rounded-lg border border-slate-200 flex items-center justify-center p-4">
          {prediction ? (
            <p className="text-2xl font-bold">{prediction}</p>
          ) : (
            <p className="text-gray-600">Predictions will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionDetection;
