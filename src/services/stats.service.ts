import { apiClient } from "@/lib/api-client";
import type {
  UserStats,
  UserActivity,
  UserEmotions,
  UserRecentPredictions,
} from "@/types/stats";

export const statsService = {
  /**
   * Get user's overall statistics
   */
  async getUserStats(): Promise<UserStats> {
    const response = await apiClient.get<UserStats>("/stats/me");
    return response.data;
  },

  /**
   * Get user's activity over time
   * @param days - Number of days to fetch (default: 30)
   */
  async getUserActivity(days: number = 30): Promise<UserActivity> {
    const response = await apiClient.get<UserActivity>(
      `/stats/me/activity?days=${days}`
    );
    return response.data;
  },

  /**
   * Get user's emotion distribution
   */
  async getUserEmotions(): Promise<UserEmotions> {
    const response = await apiClient.get<UserEmotions>("/stats/me/emotions");
    return response.data;
  },

  /**
   * Get user's recent predictions
   * @param limit - Number of recent predictions to fetch (default: 10)
   */
  async getUserRecentPredictions(
    limit: number = 10
  ): Promise<UserRecentPredictions> {
    const response = await apiClient.get<UserRecentPredictions>(
      `/stats/me/recent?limit=${limit}`
    );
    return response.data;
  },
};
