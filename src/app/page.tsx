"use client";

import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/lib/constants";
import { ArrowUpRight, Eye } from "lucide-react";
import Link from "next/link";
import { ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function Home() {
  const chartData = [
    {
      date: "2025-12-01",
      timestamp: "2025-12-01T23:59:59.000Z",
      total_predictions: 12500,
      unique_users: 650,
      avg_confidence: 0.79,
    },
    {
      date: "2025-12-02",
      timestamp: "2025-12-02T23:59:59.000Z",
      total_predictions: 15800,
      unique_users: 780,
      avg_confidence: 0.82,
    },
    {
      date: "2025-12-03",
      timestamp: "2025-12-03T23:59:59.000Z",
      total_predictions: 11200,
      unique_users: 590,
      avg_confidence: 0.75,
    },
    {
      date: "2025-12-04",
      timestamp: "2025-12-04T23:59:59.000Z",
      total_predictions: 18900,
      unique_users: 910,
      avg_confidence: 0.85,
    },
    {
      date: "2025-12-05",
      timestamp: "2025-12-05T23:59:59.000Z",
      total_predictions: 14200,
      unique_users: 720,
      avg_confidence: 0.81,
    },
    {
      date: "2025-12-06",
      timestamp: "2025-12-06T23:59:59.000Z",
      total_predictions: 9800,
      unique_users: 510,
      avg_confidence: 0.77,
    },
    {
      date: "2025-12-07",
      timestamp: "2025-12-07T23:59:59.000Z",
      total_predictions: 22100,
      unique_users: 1050,
      avg_confidence: 0.9,
    },
    {
      date: "2025-12-08",
      timestamp: "2025-12-08T23:59:59.000Z",
      total_predictions: 17600,
      unique_users: 880,
      avg_confidence: 0.84,
    },
    {
      date: "2025-12-09",
      timestamp: "2025-12-09T23:59:59.000Z",
      total_predictions: 13300,
      unique_users: 680,
      avg_confidence: 0.78,
    },
    {
      date: "2025-12-10",
      timestamp: "2025-12-10T23:59:59.000Z",
      total_predictions: 20500,
      unique_users: 990,
      avg_confidence: 0.86,
    },
  ];

  const chartConfig = {
    predictions: {
      label: "Predictions",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <div className="relative flex flex-col items-center h-full justify-center overflow-hidden">
      {/* Background Chart */}
      <div className="absolute inset-0 w-full h-full opacity-10 dark:opacity-20 pointer-events-none">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillPredictions" x1="0" y1="0" x2="0" y2="1">
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
            />
            <Area
              dataKey="total_predictions"
              type="natural"
              fill="url(#fillPredictions)"
              fillOpacity={0.4}
              stroke="var(--color-predictions)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-[90%] gap-4">
        <div className="flex flex-col items-center gap-2 sm:flex-row">
          <h1 className="text-5xl font-normal text-center">
            Welcome to VisionAI
          </h1>
          <Eye className="size-12" />
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Your DL-powered online model to predict human emotions.
        </p>
        <Separator className="w-full" />
        <Link
          href={ROUTES.liveEmotionDetection}
          className="flex items-center justify-center gap-1 mt-8 underline hover:text-accent-foreground transition"
        >
          Get Started
          <ArrowUpRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
