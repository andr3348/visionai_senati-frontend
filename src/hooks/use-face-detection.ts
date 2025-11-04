import * as faceapi from "face-api.js";
import { useEffect, useState, useCallback } from "react";

interface UseFaceDetectionReturn {
  detectFace: (video: HTMLVideoElement) => Promise<boolean>;
  isModelLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useFaceDetection = (): UseFaceDetectionReturn => {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // load only the tiny face detector for performance
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        
        console.log("Face detection models loaded successfully");
        setIsModelLoaded(true);
      } catch (err) {
        const errorMessage = "Failed to load face detection models";
        console.error(errorMessage, err);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  const detectFace = useCallback(
    async (video: HTMLVideoElement): Promise<boolean> => {
      if (!isModelLoaded || !video) return false;

      try {
        const detection = await faceapi.detectSingleFace(
          video,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 224,
            scoreThreshold: 0.5,
          })
        );

        return !!detection;
      } catch (err) {
        console.error("Face detection error:", err);
        return false;
      }
    },
    [isModelLoaded]
  );

  return {
    detectFace,
    isModelLoaded,
    isLoading,
    error,
  };
};

