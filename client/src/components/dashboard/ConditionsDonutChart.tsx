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
    <Card className="col-span-1 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Clinical Conditions Share
        </CardTitle>
        <CardDescription className="text-xs">
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
                          <div className="rounded-lg border bg-popover p-2.5 shadow-md text-xs">
                            <p className="font-semibold text-popover-foreground">{item.condition}</p>
                            <p className="text-muted-foreground mt-0.5">
                              Patients: <strong className="text-foreground">{item.count}</strong> (
                              {item.percentage}%)
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
                    paddingAngle={3}
                  >
                    {data.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PALETTE[index % PALETTE.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full sm:w-1/2 space-y-1.5 pr-2">
              {data.map((item, index) => (
                <div key={item.condition} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                    />
                    <span className="truncate text-muted-foreground">{item.condition}</span>
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
