import axios from "axios";

import { getToken } from "@/storage/token";
import { getVaultId } from "@/storage/vaultId";

// API base URL - can be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT Bearer token for authenticated requests
apiClient.interceptors.request.use((config) => {
  const vaultId = getVaultId();
  if (vaultId) {
    const token = getToken(vaultId);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || "An error occurred";
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error("Network error - please check your connection"));
    }
    return Promise.reject(error);
  }
);

// Auth API types
export interface AuthRequest {
  message: string;
  signature: string;
  public_key: string;
  chain_code_hex: string;
}

export interface AuthResponse {
  token: string;
  address: string;
}

// Auth API call
export const authenticate = async (data: AuthRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/auth", data);
  return response.data;
};
