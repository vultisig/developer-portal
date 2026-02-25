import { jwtDecode } from "jwt-decode";

import { apiClient } from "@/api/client";
import { toSnakeCase } from "@/utils/functions";
import {
  AuthToken,
  Earning,
  EarningFilters,
  Member,
  Plugin,
  Proposal,
} from "@/utils/types";

export const createProposal = async (proposal: Proposal): Promise<void> => {
  return apiClient.post("/plugin-proposals", toSnakeCase(proposal));
};

export const delAuthToken = async (token: string): Promise<void> => {
  const { token_id } = jwtDecode<{ token_id: string }>(token);

  return apiClient.del(`/auth/tokens/${token_id}`);
};

// export const delMember = async (
//   pluginId: string,
//   address: string,
// ): Promise<string> => {
//   const { message } = await apiClient.del<{ message: string }>(
//     `/plugins/${pluginId}/team/${encodeURIComponent(address)}`,
//   );

//   return message;
// };

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

export const getEarnings = async (
  params: EarningFilters,
): Promise<Earning[]> => {
  return apiClient.get<Earning[]>("/earnings", { params });
};

export const getPlugin = async (pluginId: string): Promise<Plugin> => {
  return apiClient.get<Plugin>(`/plugins/${pluginId}`);
};

export const getPlugins = async (): Promise<Plugin[]> => {
  return apiClient.get<Plugin[]>("/plugins");
};

export const getProposal = async (pluginId: string): Promise<Proposal> => {
  return apiClient.get<Proposal>(`/plugin-proposals/${pluginId}`);
};

export const getProposals = async (): Promise<Proposal[]> => {
  return apiClient.get<Proposal[]>("/plugin-proposals");
};

export const getMembers = async (pluginId: string): Promise<Member[]> => {
  return apiClient.get<Member[]>(`/plugins/${pluginId}/team`);
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
