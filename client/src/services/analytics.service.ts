import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import {
  SummaryStats,
  TimelineDataPoint,
  PatientsPerDoctor,
  ConditionStat,
  SpecializationStat,
} from "@/types/analytics";

export const analyticsService = {
  async getSummary(): Promise<SummaryStats> {
    const response = await apiClient.get<ApiResponse<SummaryStats>>("/analytics/summary");
    return response.data.data;
  },

  async getPatientsPerDoctor(limit = 10): Promise<PatientsPerDoctor[]> {
    const response = await apiClient.get<ApiResponse<PatientsPerDoctor[]>>(
      "/analytics/patients-per-doctor",
      { params: { limit } }
    );
    return response.data.data;
  },

  async getTimeline(range: "7d" | "30d" | "90d" | "12m" = "30d"): Promise<TimelineDataPoint[]> {
    const response = await apiClient.get<ApiResponse<TimelineDataPoint[]>>(
      "/analytics/timeline",
      { params: { range } }
    );
    return response.data.data;
  },

  async getConditions(): Promise<ConditionStat[]> {
    const response = await apiClient.get<ApiResponse<ConditionStat[]>>("/analytics/conditions");
    return response.data.data;
  },

  async getSpecializations(): Promise<SpecializationStat[]> {
    const response = await apiClient.get<ApiResponse<SpecializationStat[]>>("/analytics/specializations");
    return response.data.data;
  },
};
