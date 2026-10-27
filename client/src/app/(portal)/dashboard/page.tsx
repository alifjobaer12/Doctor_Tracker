"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { RefreshCw } from "lucide-react";
import {
  useSummaryStats,
  usePatientsPerDoctor,
  useTimeline,
  useConditionsAnalytics,
  useSpecializationsAnalytics,
} from "@/hooks/useAnalytics";
import { StatCards } from "@/components/dashboard/StatCards";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamic imports for chart components per performance guidelines in docs/08 & docs/09
const TimelineChart = dynamic(
  () => import("@/components/dashboard/TimelineChart").then((mod) => mod.TimelineChart),
  { ssr: false, loading: () => <Skeleton className="h-[340px] w-full rounded-lg" /> }
);

const PatientsPerDoctorChart = dynamic(
  () => import("@/components/dashboard/PatientsPerDoctorChart").then((mod) => mod.PatientsPerDoctorChart),
  { ssr: false, loading: () => <Skeleton className="h-[340px] w-full rounded-lg" /> }
);

const ConditionsDonutChart = dynamic(
  () => import("@/components/dashboard/ConditionsDonutChart").then((mod) => mod.ConditionsDonutChart),
  { ssr: false, loading: () => <Skeleton className="h-[340px] w-full rounded-lg" /> }
);

const SpecializationsBarChart = dynamic(
  () => import("@/components/dashboard/SpecializationsBarChart").then((mod) => mod.SpecializationsBarChart),
  { ssr: false, loading: () => <Skeleton className="h-[340px] w-full rounded-lg" /> }
);

export default function DashboardPage() {
  const [timelineRange, setTimelineRange] = React.useState<"7d" | "30d" | "90d" | "12m">("30d");

  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch: refetchSummary,
    isRefetching,
  } = useSummaryStats();

  const { data: patientsPerDoctor, isLoading: isPatientsPerDoctorLoading, refetch: refetchPPD } =
    usePatientsPerDoctor(10);

  const { data: timelineData, isLoading: isTimelineLoading, refetch: refetchTimeline } =
    useTimeline(timelineRange);

  const { data: conditions, isLoading: isConditionsLoading, refetch: refetchConditions } =
    useConditionsAnalytics();

  const { data: specializations, isLoading: isSpecializationsLoading, refetch: refetchSpecs } =
    useSpecializationsAnalytics();

  const handleRefreshAll = () => {
    refetchSummary();
    refetchPPD();
    refetchTimeline();
    refetchConditions();
    refetchSpecs();
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clinical Analytics Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Executive insights on hospital capacity, admissions timeline, and physician workloads.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefreshAll}
          disabled={isRefetching}
          className="gap-2 self-start sm:self-auto h-8 text-xs text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefetching ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {/* KPI Stat Cards */}
      <StatCards stats={summary} isLoading={isSummaryLoading} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline (Full width across 2 columns) */}
        <TimelineChart
          data={timelineData}
          isLoading={isTimelineLoading}
          range={timelineRange}
          onRangeChange={setTimelineRange}
        />

        {/* Patients Per Doctor (Column 1) */}
        <PatientsPerDoctorChart
          data={patientsPerDoctor}
          isLoading={isPatientsPerDoctorLoading}
        />

        {/* Conditions Donut (Column 2) */}
        <ConditionsDonutChart
          data={conditions}
          isLoading={isConditionsLoading}
        />

        {/* Specializations Bar Chart (Full width across 2 columns) */}
        <SpecializationsBarChart
          data={specializations}
          isLoading={isSpecializationsLoading}
        />
      </div>
    </div>
  );
}
