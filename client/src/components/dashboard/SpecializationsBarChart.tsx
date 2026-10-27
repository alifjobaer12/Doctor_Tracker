"use client";

import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Building } from "lucide-react";
import { SpecializationStat } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SpecializationsBarChartProps {
  data?: SpecializationStat[];
  isLoading?: boolean;
}

export function SpecializationsBarChart({
  data = [],
  isLoading = false,
}: SpecializationsBarChartProps) {
  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
          <Building className="h-4 w-4 text-primary" />
          Physician Specialization Distribution
        </CardTitle>
        <CardDescription className="text-xs">
          Headcount of certified doctors across clinical departments
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading ? (
          <Skeleton className="h-[260px] w-full rounded-lg" />
        ) : data.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground">
            No specialization statistics found.
          </div>
        ) : (
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  dataKey="specialization"
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  tickMargin={8}
                  tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as SpecializationStat;
                      return (
                        <div className="rounded-lg border bg-popover p-2.5 shadow-md text-xs">
                          <p className="font-semibold text-popover-foreground">{item.specialization}</p>
                          <p className="text-muted-foreground mt-0.5">
                            Physicians: <strong className="text-primary">{item.count}</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="count"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
