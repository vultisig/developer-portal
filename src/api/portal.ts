import { jwtDecode } from "jwt-decode";

import { apiClient } from "@/api/client";
import { defaultPageSize } from "@/utils/constants";
import { toSnakeCase } from "@/utils/functions";
import { AuthToken, ListParams, Plugin } from "@/utils/types";

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

export const createPlugin = async (plugin: Plugin): Promise<void> => {
  return apiClient.post("/plugin-proposals", toSnakeCase(plugin));
};

export const getPlugin = async (pluginId: string): Promise<Plugin> => {
  return apiClient.get<Plugin>(`/plugin-proposals/${pluginId}`);
};

export const getPlugins = async ({
  skip = 0,
  take = defaultPageSize,
}: ListParams): Promise<Plugin[]> => {
  return apiClient.get<Plugin[]>("/plugin-proposals", {
    params: { skip, take },
  });
};
