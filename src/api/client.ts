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

type UnauthorizedHandler = () => Promise<string>;

let unauthorizedHandler: UnauthorizedHandler | null = null;
let isRefreshing = false;
let failedRequestsQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

export const setUnauthorizedHandler = (handler: UnauthorizedHandler) => {
  unauthorizedHandler = handler;
};

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && unauthorizedHandler) {
      if (!isRefreshing) {
        isRefreshing = true;
        unauthorizedHandler()
          .then((newToken) => {
            failedRequestsQueue.forEach(({ resolve }) => resolve(newToken));
            failedRequestsQueue = [];
            isRefreshing = false;
          })
          .catch((err) => {
            failedRequestsQueue.forEach(({ reject }) => reject(err));
            failedRequestsQueue = [];
            isRefreshing = false;
          });
      }

      return new Promise<string>((resolve, reject) => {
        failedRequestsQueue.push({ resolve, reject });
      }).then((token) => {
        error.config.headers["Authorization"] = `Bearer ${token}`;
        return apiClient(error.config);
      });
    }

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
