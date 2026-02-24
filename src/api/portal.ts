import { jwtDecode } from "jwt-decode";

import { apiClient } from "@/api/client";
import { toSnakeCase } from "@/utils/functions";
import { AuthToken, Plugin, Transaction } from "@/utils/types";

export const createPlugin = async (plugin: Plugin): Promise<void> => {
  return apiClient.post("/plugin-proposals", toSnakeCase(plugin));
};

export const delAuthToken = async (token: string): Promise<void> => {
  const { token_id } = jwtDecode<{ token_id: string }>(token);

  return apiClient.del(`/auth/tokens/${token_id}`);
};

export const getAuthToken = async (data: {
  chainCodeHex: string;
  message: string;
  publicKey: string;
  signature: string;
}): Promise<AuthToken> => {
  const { token } = await apiClient.post<{ token: string }>(
    "/auth",
    toSnakeCase(data),
  );

  return { accessToken: token, refreshToken: token };
};

export const getPlugin = async (pluginId: string): Promise<Plugin> => {
  return apiClient.get<Plugin>(`/plugin-proposals/${pluginId}`);
};

export const getPlugins = async (): Promise<Plugin[]> => {
  return apiClient.get<Plugin[]>("/plugin-proposals");
};

export const getEarnings = async ({
  pluginId,
}: {
  pluginId?: string;
}): Promise<Transaction[]> => {
  return apiClient.get<Transaction[]>("/earnings", {
    params: { pluginId },
  });
};

export const validatePluginId = async (pluginId: string): Promise<boolean> => {
  try {
    const { available } = await apiClient.get<{ available: boolean }>(
      `/plugin-proposals/validate/${pluginId}`,
    );

    return available;
  } catch {
    return false;
  }
};
