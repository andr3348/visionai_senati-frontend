"use client";

import { useQuery } from "@tanstack/react-query";
import { statsService } from "@/services/stats.service";
import { useAuth } from "@/contexts/auth.context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  Activity,
  BarChart3,
  Calendar,
  Heart,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export default function AnalyticsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch all stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["userStats"],
    queryFn: () => statsService.getUserStats(),
    enabled: isAuthenticated,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["userActivity"],
    queryFn: () => statsService.getUserActivity(30),
    enabled: isAuthenticated,
  });

  const { data: emotions, isLoading: emotionsLoading } = useQuery({
    queryKey: ["userEmotions"],
    queryFn: () => statsService.getUserEmotions(),
    enabled: isAuthenticated,
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ["userRecent"],
    queryFn: () => statsService.getUserRecentPredictions(10),
    enabled: isAuthenticated,
  });

  // Chart configs
  const activityChartConfig = {
    predictions: {
      label: "Predictions",
      color: "hsl(var(--chart-1))",
    },
  };

  const emotionsChartConfig = {
    happy: { label: "Happy", color: "hsl(var(--emotion-happy))" },
    sad: { label: "Sad", color: "hsl(var(--emotion-sad))" },
    angry: { label: "Angry", color: "hsl(var(--emotion-angry))" },
    neutral: { label: "Neutral", color: "hsl(var(--emotion-neutral))" },
    surprise: { label: "Surprise", color: "hsl(var(--emotion-surprise))" },
    fear: { label: "Fear", color: "hsl(var(--emotion-fear))" },
    disgust: { label: "Disgust", color: "hsl(var(--emotion-disgust))" },
  } as Record<string, { label: string; color: string }>;

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
            Please log in to view your analytics dashboard.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const isLoading =
    statsLoading || activityLoading || emotionsLoading || recentLoading;

  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">
          Track your emotion detection activity and insights
        </p>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Predictions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.total_predictions.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.predictions_today} today
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {stats?.predictions_this_week.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.predictions_this_month} this month
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Favorite Emotion
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold capitalize">
                  {stats?.favorite_emotion}
                </div>
                <p className="text-xs text-muted-foreground">Most detected</p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Confidence
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-8 w-20" />
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {((stats?.avg_confidence || 0) * 100).toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Accuracy rate</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Over Time</CardTitle>
          <CardDescription>
            Daily prediction activity for the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activityLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : activity?.daily_activity && activity.daily_activity.length > 0 ? (
            <ChartContainer
              config={activityChartConfig}
              className="h-[300px] w-full"
            >
              <AreaChart
                data={activity.daily_activity}
                margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="fillActivity" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-predictions)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-predictions)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Area
                  dataKey="prediction_count"
                  type="natural"
                  fill="url(#fillActivity)"
                  fillOpacity={0.4}
                  stroke="var(--color-predictions)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-muted-foreground">
              No activity data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emotions Distribution */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Emotion Distribution</CardTitle>
            <CardDescription>Breakdown of detected emotions</CardDescription>
          </CardHeader>
          <CardContent>
            {emotionsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : emotions?.emotions && emotions.emotions.length > 0 ? (
              <ChartContainer
                config={emotionsChartConfig}
                className="h-[300px] w-full"
              >
                <PieChart>
                  <Pie
                    data={emotions.emotions}
                    dataKey="count"
                    nameKey="emotion_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ emotion_name, percentage }) =>
                      `${emotion_name}: ${percentage.toFixed(1)}%`
                    }
                  >
                    {emotions.emotions.map((entry) => {
                      const emotionKey = entry.emotion_name.toLowerCase();
                      const color = emotionsChartConfig[emotionKey]?.color || "hsl(var(--chart-1))";
                      return (
                        <Cell
                          key={`cell-${entry.emotion_name}`}
                          fill={color}
                        />
                      );
                    })}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No emotion data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emotion Counts</CardTitle>
            <CardDescription>Total detections per emotion</CardDescription>
          </CardHeader>
          <CardContent>
            {emotionsLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : emotions?.emotions && emotions.emotions.length > 0 ? (
              <ChartContainer
                config={emotionsChartConfig}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={emotions.emotions}
                  margin={{ left: 12, right: 12, top: 12, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="emotion_name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {emotions.emotions.map((entry) => {
                      const emotionKey = entry.emotion_name.toLowerCase();
                      const color = emotionsChartConfig[emotionKey]?.color || "hsl(var(--chart-1))";
                      return (
                        <Cell
                          key={`cell-${entry.emotion_name}`}
                          fill={color}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No emotion data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Predictions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>Your latest emotion detections</CardDescription>
        </CardHeader>
        <CardContent>
          {recentLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recent?.predictions && recent.predictions.length > 0 ? (
            <div className="space-y-2">
              {recent.predictions.map((prediction) => (
                <div
                  key={prediction.predic_id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-2xl">
                      {getEmotionEmoji(prediction.emotion_name)}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {prediction.emotion_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(prediction.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {prediction.processing_time_ms}ms
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">No predictions yet</p>
              <Link href={ROUTES.liveEmotionDetection}>
                <Button>Start Detecting Emotions</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function for emotion emojis
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
