import axios, { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

import { getVaults, setVaults } from "@/storage/vaults";
import { portalApiUrl } from "@/utils/constants";
import { toCamelCase, toSnakeCase } from "@/utils/functions";
import { AuthToken } from "@/utils/types";

class TokenManager {
  private refreshPromise: Promise<AuthToken> | null = null;

  private isExpired(token: string): boolean {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);

      return exp < dayjs().unix();
    } catch {
      return true;
    }
  }

  async check(token: AuthToken): Promise<AuthToken | null> {
    const { accessToken, refreshToken } = token;

    const isAccessTokenExpired = this.isExpired(accessToken);

    if (isAccessTokenExpired) {
      const isRefreshTokenExpired = this.isExpired(refreshToken);

      if (isRefreshTokenExpired) return null;

      const newToken = await this.refresh(refreshToken).catch(() => null);

      return newToken;
    } else {
      return token;
    }
  }

  async refresh(refreshToken: string): Promise<AuthToken> {
    // If a refresh is already happening, wait for it
    if (this.refreshPromise) return this.refreshPromise;

    // Start a new refresh
    this.refreshPromise = axios
      .post<AuthToken>(
        `${portalApiUrl}/auth/refresh`,
        toSnakeCase({ refreshToken }),
        { headers: { accept: "application/json" } },
      )
      .then((res) => toCamelCase(res.data))
      .finally(() => {
        // Reset so future refreshes can happen
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }
}

const api = axios.create({
  baseURL: portalApiUrl,
  headers: { "Content-Type": "application/json" },
});
const tokenManager = new TokenManager();
let onUnauthorized: (() => void) | null = null;

api.interceptors.request.use(
  async (config) => {
    const vaults = getVaults();
    const [vault, ...rest] = vaults;

    if (!vault) return config;

    const { accessToken, refreshToken } = vault;

    const token = await tokenManager.check({ accessToken, refreshToken });

    if (!token) return config;

    setVaults([{ ...vault, ...token }, ...rest]);

    return {
      ...config,
      headers: config.headers.setAuthorization(`Bearer ${token.accessToken}`),
    };
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401 && onUnauthorized) onUnauthorized();

      const message =
        error.response.data?.error?.message || "An error occurred";

      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error("Network error - please check your connection"),
      );
    }

    return Promise.reject(error);
  },
);

const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const { data } = await api.delete<T>(url, config);

  return toCamelCase(data);
};

const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const { data } = await api.get<T>(url, config);

  return toCamelCase(data);
};

const post = async <T>(
  url: string,
  data?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.post<T>(url, data, config);

  return toCamelCase(response.data);
};

const put = async <T>(
  url: string,
  data?: Record<string, unknown>,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response = await api.put<T>(url, data, config);

  return toCamelCase(response.data);
};

export const apiClient = {
  del,
  get,
  post,
  put,
  tokenManager,
};

export const setUnauthorizedHandler = (fn: () => void) => {
  onUnauthorized = fn;
};
