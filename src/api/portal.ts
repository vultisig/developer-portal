import { jwtDecode } from "jwt-decode";

import { apiClient } from "@/api/client";
import { toSnakeCase } from "@/utils/functions";
import {
  AuthToken,
  Earning,
  EarningFilters,
  EarningSummary,
  Member,
  MemberInvitation,
  Plugin,
  PluginUpdate,
  PluginProposal,
} from "@/utils/types";

export const createPlugin = async (data: PluginProposal): Promise<void> => {
  return apiClient.post("/plugin-proposals", toSnakeCase(data));
};

export const createTeamInvite = async (
  pluginId: string,
  role: Member["role"],
): Promise<MemberInvitation> => {
  return apiClient.post<MemberInvitation>(`/plugins/${pluginId}/team/invite`, {
    role,
  });
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

export const getEarningSummary = async (): Promise<EarningSummary> => {
  return apiClient.get<EarningSummary>("/earnings/summary");
};

export const getPlugin = async (pluginId: string): Promise<Plugin> => {
  return apiClient.get<Plugin>(`/plugins/${pluginId}`);
};

export const getPlugins = async (): Promise<Plugin[]> => {
  return apiClient.get<Plugin[]>("/plugins");
};

export const getProposals = async (): Promise<PluginProposal[]> => {
  return apiClient.get<PluginProposal[]>("/plugin-proposals");
};

export const getMembers = async (pluginId: string): Promise<Member[]> => {
  return apiClient.get<Member[]>(`/plugins/${pluginId}/team`);
};

export const updatePlugin = async ({
  data,
  pluginId,
  signature,
  signedMessage,
}: {
  data: PluginUpdate;
  pluginId: string;
  signature: string;
  signedMessage: object;
}): Promise<void> => {
  return apiClient.put(`/plugins/${pluginId}`, {
    ...toSnakeCase(data),
    signature,
    signed_message: signedMessage,
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
