"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { emotionService } from "@/services/emotion.service";
import { PredictionResponse } from "@/types/emotion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Upload, Image as ImageIcon, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth.context";

export default function EmotionDetectionPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);

  const { mutate: predictEmotion, isPending, isError, error } = useMutation({
    mutationFn: (file: File) => emotionService.predictEmotion(file),
    onSuccess: (data) => {
      setPrediction(data);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPrediction(null);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      predictEmotion(selectedFile);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-full p-4 sm:p-6">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            Please log in to use emotion detection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Emotion Detection</h1>
        <p className="text-muted-foreground">
          Upload an image to detect the emotion using our AI model
        </p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
          <CardDescription>
            Select an image file (JPEG, PNG, etc.) containing a face
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 sm:p-12">
            {previewUrl ? (
              <div className="w-full max-w-md space-y-4">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-auto rounded-lg"
                />
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full"
                >
                  Choose Different Image
                </Button>
              </div>
            ) : (
              <>
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to select an image file
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button asChild variant="outline">
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      Select Image
                    </span>
                  </Button>
                </label>
              </>
            )}
          </div>

          {selectedFile && !prediction && (
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleSubmit}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? "Analyzing..." : "Detect Emotion"}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          )}

          {isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                  ? error.message
                  : "Failed to predict emotion. Please try again."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Prediction Results */}
      {isPending && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzing...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>
      )}

      {prediction && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <CardTitle>Prediction Results</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Detected Emotion
                </p>
                <p className="text-2xl font-bold capitalize">
                  {prediction.emotion_name}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Confidence
                </p>
                <p className="text-2xl font-bold">
                  {(prediction.confidence * 100).toFixed(2)}%
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Model Version
                </p>
                <p className="text-lg font-semibold">
                  {prediction.model_version_tag}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Processing Time
                </p>
                <p className="text-lg font-semibold">
                  {prediction.processing_time_ms}ms
                </p>
              </div>
            </div>

            <Button onClick={handleReset} className="w-full sm:w-auto">
              Analyze Another Image
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
