import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { Doctor, DoctorFilters, DoctorQueryParams } from "@/types/doctor";
import { DoctorFormValues } from "@/schemas/doctor.schema";

export const doctorService = {
  async getDoctors(params?: DoctorQueryParams): Promise<{ data: Doctor[]; meta: ApiResponse<unknown>["meta"] }> {
    const response = await apiClient.get<ApiResponse<Doctor[]>>("/doctors", { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async getDoctorById(id: string): Promise<Doctor> {
    const response = await apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);
    return response.data.data;
  },

  async createDoctor(data: DoctorFormValues): Promise<Doctor> {
    const response = await apiClient.post<ApiResponse<Doctor>>("/doctors", data);
    return response.data.data;
  },

  async updateDoctor(id: string, data: Partial<DoctorFormValues>): Promise<Doctor> {
    const response = await apiClient.patch<ApiResponse<Doctor>>(`/doctors/${id}`, data);
    return response.data.data;
  },

  async deleteDoctor(id: string, cascade = false): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/doctors/${id}`, {
      params: cascade ? { cascade: true } : {},
    });
  },

  async getDoctorFilters(): Promise<DoctorFilters> {
    const response = await apiClient.get<ApiResponse<DoctorFilters>>("/doctors/filters");
    return response.data.data;
  },
};
