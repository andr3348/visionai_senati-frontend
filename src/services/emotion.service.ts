import { apiClient } from "@/lib/api-client";
import { PredictionResponse } from "@/types/emotion";

class EmotionService {
  /**
   * Predict emotion from uploaded image file
   * @param file Image file (jpeg, png, etc.)
   * @returns Prediction result with emotion, confidence, model version, and processing time
   */
  async predictEmotion(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<PredictionResponse>(
      "/predict",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  }
}

export const emotionService = new EmotionService();
