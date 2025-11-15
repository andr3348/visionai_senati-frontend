import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { AlertCircle, Camera, CameraOff } from "lucide-react";

interface WebcamCaptureProps {
  onFrame?: (imageData: string) => void;
  captureInterval?: number;
  isProcessing?: boolean; // Indicates if backend is processing a frame
  onStop?: () => void; // Called when camera is stopped
}

export default function WebcamCapture({
  onFrame,
  captureInterval = 1000,
  isProcessing = false,
  onStop,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  const startCamera = async () => {
    try {
      setError("");

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);

        // Wait for video to be ready before starting frame capture
        videoRef.current.onloadedmetadata = () => {
          // Start capturing frames if callback is provided
          if (onFrame) {
            startFrameCapture();
          }
        };
      }
    } catch (error) {
      const errorMessage = "Could not access camera";
      setError(errorMessage);
      console.error("Camera access error:", error);
    }
  };

  const stopCamera = () => {
    // Stop frame capture
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);
    }

    // Reset prediction state
    if (onStop) {
      onStop();
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureFrame = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !onFrame) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Set canvas size to match video dimensions (640x480)
    canvas.width = 640;
    canvas.height = 480;

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64 image data
    const imageData = canvas.toDataURL("image/jpeg", 0.8);

    // Send frame to parent component (backend will handle face detection)
    onFrame(imageData);
  }, [onFrame]);

  const startFrameCapture = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Capture frames at specified interval
    intervalRef.current = setInterval(() => {
      void captureFrame();
    }, captureInterval);
  }, [captureInterval, captureFrame]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 w-full h-full max-w-[640px] max-h-[480px] aspect-video">
        <div className="bg-red-50 w-full h-full rounded-lg border border-red-200 flex flex-col items-center justify-center p-6 gap-4">
          <AlertCircle className="size-12 text-red-500" />
          <p className="text-red-600 text-center">{error}</p>
          <Button onClick={startCamera} variant="outline" className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Video container */}
      <div className="bg-slate-100 outline w-full h-full max-w-[640px] max-h-[480px] aspect-video rounded-lg overflow-hidden relative">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          autoPlay
          playsInline
          muted
        />
        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Placeholder when camera is off */}
        {!isStreaming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="size-16 text-slate-300" />
          </div>
        )}

        {/* Status Indicators */}
        {isStreaming && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Recording Status */}
            <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white text-xs font-medium">
                Recording
              </span>
            </div>

            {/* Processing Status */}
            {isProcessing && (
              <div className="bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-white text-xs font-medium">
                  Processing...
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
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
  );
}
