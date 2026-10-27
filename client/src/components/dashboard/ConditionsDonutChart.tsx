"use client";

import * as React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Activity } from "lucide-react";
import { ConditionStat } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PALETTE = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#8b5cf6", // Purple
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#64748b", // Slate (Other)
];

interface ConditionsDonutChartProps {
  data?: ConditionStat[];
  isLoading?: boolean;
}

export function ConditionsDonutChart({ data = [], isLoading = false }: ConditionsDonutChartProps) {
  return (
    <Card className="col-span-1 glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2 text-foreground">
          <Activity className="h-4 w-4 text-primary" />
          Clinical Conditions Share
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Proportion of patient admissions by diagnostic condition
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-2">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-lg" />
        ) : data.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-xs text-muted-foreground">
            No diagnostic condition statistics found.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="h-[230px] w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload as ConditionStat;
                        return (
                          <div className="rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-3 shadow-xl text-xs">
                            <p className="font-semibold text-foreground">{item.condition}</p>
                            <p className="text-muted-foreground mt-1">
                              Patients: <strong className="text-foreground">{item.count}</strong> (
                              <span className="text-primary font-bold">{item.percentage}%</span>)
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="condition"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PALETTE[index % PALETTE.length]}
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth={1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 space-y-2 pr-2">
              {data.map((item, index) => (
                <div key={item.condition} className="flex items-center justify-between text-xs p-1 rounded-md hover:bg-muted/40 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                    />
                    <span className="truncate text-muted-foreground font-medium">{item.condition}</span>
                  </div>
                  <span className="font-semibold text-foreground shrink-0 ml-2">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
