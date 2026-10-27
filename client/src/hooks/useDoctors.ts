"use client";

import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { doctorService } from "@/services/doctor.service";
import { Doctor, DoctorFilters, DoctorQueryParams } from "@/types/doctor";
import { DoctorFormValues } from "@/schemas/doctor.schema";

export const DOCTORS_QUERY_KEY = ["doctors"] as const;

export function useDoctors(params?: DoctorQueryParams) {
  return useQuery({
    queryKey: [...DOCTORS_QUERY_KEY, params],
    queryFn: () => doctorService.getDoctors(params),
    placeholderData: keepPreviousData,
  });
}

export function useDoctor(id: string) {
  return useQuery<Doctor, AxiosError>({
    queryKey: [...DOCTORS_QUERY_KEY, id],
    queryFn: () => doctorService.getDoctorById(id),
    enabled: Boolean(id),
  });
}

export function useDoctorFilters() {
  return useQuery<DoctorFilters>({
    queryKey: [...DOCTORS_QUERY_KEY, "filters"],
    queryFn: doctorService.getDoctorFilters,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();

  return useMutation<Doctor, AxiosError<{ message?: string }>, DoctorFormValues>({
    mutationFn: doctorService.createDoctor,
    onSuccess: (newDoctor) => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      toast.success(`Doctor ${newDoctor.name} added successfully!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add doctor");
    },
  });
}

export function useUpdateDoctor() {
  const queryClient = useQueryClient();

  return useMutation<Doctor, AxiosError<{ message?: string }>, { id: string; data: Partial<DoctorFormValues> }>({
    mutationFn: ({ id, data }) => doctorService.updateDoctor(id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      toast.success(`Doctor ${updated.name} updated successfully!`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update doctor");
    },
  });
}

export function useDeleteDoctor() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string; errors?: Array<{ field?: string; message: string }> }>, { id: string; cascade?: boolean }>({
    mutationFn: ({ id, cascade }) => doctorService.deleteDoctor(id, cascade),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Doctor deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete doctor");
    },
  });
}
