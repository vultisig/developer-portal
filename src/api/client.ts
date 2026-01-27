import axios from "axios";

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

// Request interceptor to add public key header for authenticated requests
apiClient.interceptors.request.use((config) => {
  const publicKey = getVaultId();
  if (publicKey) {
    config.headers["X-Public-Key"] = publicKey;
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
