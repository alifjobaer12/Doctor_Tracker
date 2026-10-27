"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { authService } from "@/services/auth.service";
import { User, LoginCredentials } from "@/types/auth";

export const AUTH_QUERY_KEY = ["auth", "user"] as const;

export function useCurrentUser() {
  return useQuery<User, AxiosError>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: authService.getMe,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<User, AxiosError<{ message?: string }>, LoginCredentials>({
    mutationFn: (credentials) => authService.login(credentials),
    onSuccess: (user) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, user);
      toast.success(`Welcome back, ${user.name}!`);
      
      const searchParams = new URLSearchParams(window.location.search);
      const next = searchParams.get("next") || "/dashboard";
      router.push(next);
      router.refresh();
    },
    onError: (error) => {
      const message = error.response?.data?.message || "Invalid credentials. Please try again.";
      toast.error(message);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<void, AxiosError>({
    mutationFn: authService.logout,
    onSuccess: () => {
      queryClient.clear();
      toast.info("Logged out successfully");
      router.push("/login");
      router.refresh();
    },
    onError: () => {
      queryClient.clear();
      router.push("/login");
    },
  });
}
