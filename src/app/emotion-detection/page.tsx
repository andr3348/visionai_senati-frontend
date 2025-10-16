"use client";

import { Button } from "@/components/ui/button";
import { Camera, CameraOff } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const EmotionDetection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      // Request access to the user's camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user", // Front camera (selfie)
        },
      });

      // Connect the camera stream to the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing the camera:", error);
      alert("Could not access the camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);

      // Disconnect the stream from the video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    return () => {
      // This function runs when the component is unmounted (user leaves the page)
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]) // Re-run if stream changes

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 h-full w-full p-4 sm:p-6 lg:p-8">
      {/* Camera Section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 min-h-[300px] lg:min-h-0">
        <div className="bg-black w-full h-full max-w-[640px] max-h-[480px] aspect-video rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted
          />
        </div>

        {!isStreaming ? (
          <Button onClick={startCamera} className="flex items-center gap-2">
            <Camera className="size-4" />
            Start Camera
          </Button>
        ) : (
          <Button
            onClick={stopCamera}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <CameraOff className="size-4" />
            Stop Camera
          </Button>
        )}
      </div>

      {/* Predictions Section */}
      <div className="w-full lg:w-80 min-h-[200px] lg:min-h-0">
        <div className="bg-slate-50 w-full h-full rounded-lg border border-slate-200 flex items-center justify-center p-4">
          <p className="text-gray-600">Predictions will go here</p>
        </div>
      </div>
    </div>
  );
};

export default EmotionDetection;
