"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";

export const ANALYTICS_QUERY_KEY = ["analytics"] as const;

export function useSummaryStats() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "summary"],
    queryFn: analyticsService.getSummary,
    staleTime: 60 * 1000,
  });
}

export function usePatientsPerDoctor(limit = 10) {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "patients-per-doctor", limit],
    queryFn: () => analyticsService.getPatientsPerDoctor(limit),
    staleTime: 60 * 1000,
  });
}

export function useTimeline(range: "7d" | "30d" | "90d" | "12m" = "30d") {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "timeline", range],
    queryFn: () => analyticsService.getTimeline(range),
    staleTime: 60 * 1000,
  });
}

export function useConditionsAnalytics() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "conditions"],
    queryFn: analyticsService.getConditions,
    staleTime: 60 * 1000,
  });
}

export function useSpecializationsAnalytics() {
  return useQuery({
    queryKey: [...ANALYTICS_QUERY_KEY, "specializations"],
    queryFn: analyticsService.getSpecializations,
    staleTime: 60 * 1000,
  });
}
