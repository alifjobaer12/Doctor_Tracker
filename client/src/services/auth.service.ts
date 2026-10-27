import { apiClient } from "@/lib/axios";
import { User, LoginCredentials, ApiResponse } from "@/types/auth";

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    const response = await apiClient.post<ApiResponse<{ user: User }>>("/auth/login", credentials);
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse<{ message: string }>>("/auth/logout");
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>("/auth/me");
    return response.data.data.user;
  },
};
