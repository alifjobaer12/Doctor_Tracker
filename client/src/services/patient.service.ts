import { apiClient } from "@/lib/axios";
import { ApiResponse } from "@/types/auth";
import { Patient, PatientFilters, PatientQueryParams } from "@/types/patient";
import { PatientFormValues } from "@/schemas/patient.schema";

export const patientService = {
  async getPatients(params?: PatientQueryParams): Promise<{ data: Patient[]; meta: ApiResponse<unknown>["meta"] }> {
    const response = await apiClient.get<ApiResponse<Patient[]>>("/patients", { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async getPatientById(id: string): Promise<Patient> {
    const response = await apiClient.get<ApiResponse<Patient>>(`/patients/${id}`);
    return response.data.data;
  },

  async createPatient(data: PatientFormValues): Promise<Patient> {
    const response = await apiClient.post<ApiResponse<Patient>>("/patients", data);
    return response.data.data;
  },

  async updatePatient(id: string, data: Partial<PatientFormValues>): Promise<Patient> {
    const response = await apiClient.patch<ApiResponse<Patient>>(`/patients/${id}`, data);
    return response.data.data;
  },

  async deletePatient(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/patients/${id}`);
  },

  async getPatientFilters(): Promise<PatientFilters> {
    const response = await apiClient.get<ApiResponse<PatientFilters>>("/patients/filters");
    return response.data.data;
  },

  // Doctor-scoped endpoints
  async getDoctorPatients(
    doctorId: string,
    params?: Omit<PatientQueryParams, "doctor">
  ): Promise<{ data: Patient[]; meta: ApiResponse<unknown>["meta"] }> {
    const response = await apiClient.get<ApiResponse<Patient[]>>(`/doctors/${doctorId}/patients`, { params });
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  },

  async createDoctorPatient(doctorId: string, data: Omit<PatientFormValues, "doctor">): Promise<Patient> {
    const response = await apiClient.post<ApiResponse<Patient>>(`/doctors/${doctorId}/patients`, data);
    return response.data.data;
  },

  async deleteDoctorPatient(doctorId: string, patientId: string): Promise<void> {
    await apiClient.delete<ApiResponse<unknown>>(`/doctors/${doctorId}/patients/${patientId}`);
  },
};
