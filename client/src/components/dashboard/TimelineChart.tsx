"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";
import { TimelineDataPoint } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TimelineChartProps {
  data?: TimelineDataPoint[];
  isLoading?: boolean;
  range: "7d" | "30d" | "90d" | "12m";
  onRangeChange: (range: "7d" | "30d" | "90d" | "12m") => void;
}

export function TimelineChart({
  data = [],
  isLoading = false,
  range,
  onRangeChange,
}: TimelineChartProps) {
  const rangeOptions: Array<{ label: string; value: "7d" | "30d" | "90d" | "12m" }> = [
    { label: "7D", value: "7d" },
    { label: "30D", value: "30d" },
    { label: "90D", value: "90d" },
    { label: "12M", value: "12m" },
  ];

  return (
    <Card className="col-span-1 lg:col-span-2 glass-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-3">
        <div>
          <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2 text-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            Patient Admission Trends
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Historical patient intake volume over selected timeframe
          </CardDescription>
        </div>

        <div className="flex items-center rounded-lg border border-border/60 bg-muted/30 p-1 self-start sm:self-auto backdrop-blur-xs">
          {rangeOptions.map((opt) => (
            <Button
              key={opt.value}
              variant={range === opt.value ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onRangeChange(opt.value)}
              className="h-7 px-2.5 text-xs font-medium"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-lg" />
        ) : data.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-xs text-muted-foreground">
            No admission timeline records found for this period.
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="patientTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="fill-muted-foreground text-[11px]"
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="fill-muted-foreground text-[11px]"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as TimelineDataPoint;
                      return (
                        <div className="rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-3 shadow-xl text-xs">
                          <p className="font-semibold text-foreground">{item.label}</p>
                          <p className="text-muted-foreground mt-1">
                            Admissions: <strong className="text-primary font-bold">{item.count}</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#patientTrendGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
