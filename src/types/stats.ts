export interface UserStats {
  user_id: number;
  username: string;
  total_predictions: number;
  predictions_today: number;
  predictions_this_week: number;
  predictions_this_month: number;
  favorite_emotion: string;
  avg_confidence: number;
  first_prediction_date: string;
  last_prediction_date: string;
}

export interface DailyActivity {
  date: string;
  timestamp: string;
  prediction_count: number;
}

export interface UserActivity {
  period_days: number;
  daily_activity: DailyActivity[];
  total_predictions: number;
}

export interface EmotionStat {
  emotion_name: string;
  count: number;
  percentage: number;
  avg_confidence: number;
}

export interface UserEmotions {
  total_predictions: number;
  emotions: EmotionStat[];
  most_frequent_emotion: string;
}

export interface RecentPrediction {
  predic_id: number;
  emotion_name: string;
  confidence: number;
  timestamp: string;
  processing_time_ms: number;
}

export interface UserRecentPredictions {
  count: number;
  predictions: RecentPrediction[];
}
