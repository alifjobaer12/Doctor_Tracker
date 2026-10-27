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
import { Stethoscope } from "lucide-react";
import { PatientsPerDoctor } from "@/types/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientsPerDoctorChartProps {
  data?: PatientsPerDoctor[];
  isLoading?: boolean;
}

export function PatientsPerDoctorChart({ data = [], isLoading = false }: PatientsPerDoctorChartProps) {
  // Format physician names for axis display
  const chartData = React.useMemo(() => {
    return data.map((d) => ({
      ...d,
      displayName: d.name.replace(/^Dr\.\s*/i, ""),
    }));
  }, [data]);

  return (
    <Card className="col-span-1 glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2 text-foreground">
          <Stethoscope className="h-4 w-4 text-primary" />
          Top Physicians by Patient Load
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Physicians with highest clinical patient counts
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-4">
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-lg" />
        ) : chartData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-xs text-muted-foreground">
            No physician patient records available.
          </div>
        ) : (
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/40" />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground text-[11px]"
                />
                <YAxis
                  dataKey="displayName"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  className="fill-foreground text-[11px] font-medium"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as PatientsPerDoctor;
                      return (
                        <div className="rounded-xl border border-border/80 bg-popover/95 backdrop-blur-md p-3 shadow-xl text-xs">
                          <p className="font-semibold text-foreground">{item.name}</p>
                          <p className="text-muted-foreground text-[11px]">{item.specialization}</p>
                          <p className="text-muted-foreground text-[11px]">{item.hospital}</p>
                          <p className="mt-1 font-medium text-foreground">
                            Patients: <strong className="text-primary font-bold">{item.patientsCount}</strong>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="patientsCount"
                  fill="#8b5cf6"
                  radius={[0, 6, 6, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
