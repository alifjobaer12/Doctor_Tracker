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
    <Card className="col-span-1 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold tracking-tight flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-primary" />
          Top Physicians by Patient Load
        </CardTitle>
        <CardDescription className="text-xs">
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
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis
                  type="number"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  dataKey="displayName"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  tick={{ fontSize: 11, fill: "hsl(var(--foreground))" }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as PatientsPerDoctor;
                      return (
                        <div className="rounded-lg border bg-popover p-2.5 shadow-md text-xs">
                          <p className="font-semibold text-popover-foreground">{item.name}</p>
                          <p className="text-muted-foreground text-[11px]">{item.specialization}</p>
                          <p className="text-muted-foreground text-[11px]">{item.hospital}</p>
                          <p className="mt-1 font-medium">
                            Patients: <strong className="text-primary">{item.patientsCount}</strong>
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
                  radius={[0, 4, 4, 0]}
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
