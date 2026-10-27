"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { patientService } from "@/services/patient.service";
import { Patient, PatientFilters, PatientQueryParams } from "@/types/patient";
import { PatientFormValues } from "@/schemas/patient.schema";
import { DOCTORS_QUERY_KEY } from "./useDoctors";

export const PATIENTS_QUERY_KEY = ["patients"] as const;

export function usePatients(params?: PatientQueryParams) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, params],
    queryFn: () => patientService.getPatients(params),
    placeholderData: keepPreviousData,
  });
}

export function usePatient(id: string) {
  return useQuery<Patient, AxiosError>({
    queryKey: [...PATIENTS_QUERY_KEY, id],
    queryFn: () => patientService.getPatientById(id),
    enabled: Boolean(id),
  });
}

export function useDoctorPatients(doctorId: string, params?: Omit<PatientQueryParams, "doctor">) {
  return useQuery({
    queryKey: [...PATIENTS_QUERY_KEY, "doctor", doctorId, params],
    queryFn: () => patientService.getDoctorPatients(doctorId, params),
    enabled: Boolean(doctorId),
    placeholderData: keepPreviousData,
  });
}

export function usePatientFilters() {
  return useQuery<PatientFilters>({
    queryKey: [...PATIENTS_QUERY_KEY, "filters"],
    queryFn: patientService.getPatientFilters,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation<Patient, AxiosError<{ message?: string }>, PatientFormValues>({
    mutationFn: patientService.createPatient,
    onSuccess: (newPatient) => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      toast.success(`Patient ${newPatient.name} added successfully!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add patient");
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation<Patient, AxiosError<{ message?: string }>, { id: string; data: Partial<PatientFormValues> }>({
    mutationFn: ({ id, data }) => patientService.updatePatient(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      toast.success(`Patient ${updated.name} updated successfully!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update patient");
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, string>({
    mutationFn: patientService.deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      toast.success("Patient removed successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove patient");
    },
  });
}

export function useDeleteDoctorPatient() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, { doctorId: string; patientId: string }>({
    mutationFn: ({ doctorId, patientId }) => patientService.deleteDoctorPatient(doctorId, patientId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      toast.success("Patient removed from doctor's list");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to remove patient from doctor");
    },
  });
}
