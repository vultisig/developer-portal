import { EarningTransaction, InviteInfo, Plugin, PluginApiKey, PluginPricing, TeamMember, TeamMemberRole } from "@/utils/types";

import { apiClient } from "./client";

// Plugin API response types (from backend)
type PluginApiResponse = {
  id: string;
  title: string;
  description: string;
  server_endpoint: string;
  category: string;
  created_at: string;
  updated_at: string;
  logo_url?: string;
  thumbnail_url?: string;
};

// Transform backend plugin response to frontend type
const transformPlugin = (p: PluginApiResponse): Plugin => ({
  id: p.id,
  title: p.title,
  description: p.description,
  serverEndpoint: p.server_endpoint,
  category: p.category,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
  logoUrl: p.logo_url,
  thumbnailUrl: p.thumbnail_url,
});

// Plugin API functions
export const getPlugins = async (): Promise<Plugin[]> => {
  const response = await apiClient.get<PluginApiResponse[]>("/plugins");
  return response.data.map(transformPlugin);
};

export const getPlugin = async (id: string): Promise<Plugin | undefined> => {
  try {
    const response = await apiClient.get<PluginApiResponse>(`/plugins/${id}`);
    return transformPlugin(response.data);
  } catch (error) {
    if ((error as Error).message === "plugin not found") {
      return undefined;
    }
    throw error;
  }
};

export type PluginUpdateData = Partial<Plugin> & {
  signature?: string;
  signedMessage?: object;
};

export const updatePlugin = async (id: string, data: PluginUpdateData): Promise<Plugin> => {
  const response = await apiClient.put<PluginApiResponse>(`/plugins/${id}`, {
    title: data.title,
    description: data.description,
    server_endpoint: data.serverEndpoint,
    signature: data.signature,
    signed_message: data.signedMessage,
  });
  return transformPlugin(response.data);
};

export const getPluginPricings = async (pluginId: string): Promise<PluginPricing[]> => {
  const response = await apiClient.get<PluginPricing[]>(`/plugins/${pluginId}/pricings`);
  return response.data;
};

export const getPluginApiKeys = async (pluginId: string): Promise<PluginApiKey[]> => {
  const response = await apiClient.get<PluginApiKey[]>(`/plugins/${pluginId}/api-keys`);
  return response.data;
};

// API Key management types
export type CreateApiKeyRequest = {
  expiresAt?: string; // RFC3339 format, optional
};

export type CreateApiKeyResponse = PluginApiKey; // Full key returned only on creation

export type UpdateApiKeyRequest = {
  status: number; // 0 = disabled, 1 = enabled
};

// Create a new API key for a plugin
export const createPluginApiKey = async (
  pluginId: string,
  data: CreateApiKeyRequest
): Promise<CreateApiKeyResponse> => {
  const response = await apiClient.post<CreateApiKeyResponse>(
    `/plugins/${pluginId}/api-keys`,
    data
  );
  return response.data;
};

// Update API key status (enable/disable)
export const updatePluginApiKeyStatus = async (
  pluginId: string,
  keyId: string,
  status: number
): Promise<PluginApiKey> => {
  const response = await apiClient.put<PluginApiKey>(
    `/plugins/${pluginId}/api-keys/${keyId}`,
    { status }
  );
  return response.data;
};

// Delete (expire) an API key
export const deletePluginApiKey = async (
  pluginId: string,
  keyId: string
): Promise<PluginApiKey> => {
  const response = await apiClient.delete<PluginApiKey>(
    `/plugins/${pluginId}/api-keys/${keyId}`
  );
  return response.data;
};

// Earnings API types
export type EarningsFilters = {
  pluginId?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  type?: string;
  page?: number;
  limit?: number;
};

export type EarningsResponse = {
  data: EarningTransaction[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const getEarnings = async (filters?: EarningsFilters): Promise<EarningsResponse> => {
  const params = new URLSearchParams();

  if (filters?.pluginId) {
    params.append("pluginId", filters.pluginId);
  }
  if (filters?.dateFrom) {
    params.append("dateFrom", filters.dateFrom);
  }
  if (filters?.dateTo) {
    params.append("dateTo", filters.dateTo);
  }

  params.append("page", String(filters?.page ?? 1));
  params.append("limit", String(filters?.limit ?? 10));

  const response = await apiClient.get<EarningsResponse>("/earnings", { params });

  let results = response.data.data;

  if (filters?.status) {
    results = results.filter(e => e.status === filters.status);
  }

  if (filters?.type) {
    results = results.filter(e => e.type === filters.type);
  }

  return {
    ...response.data,
    data: results,
  };
};

export const getEarningsSummary = async (): Promise<{
  totalEarnings: number;
  totalTransactions: number;
  earningsByPlugin: Record<string, number>;
}> => {
  const response = await apiClient.get<{
    totalEarnings: number;
    totalTransactions: number;
    earningsByPlugin: Record<string, number>;
  }>("/earnings/summary");
  return response.data;
};

// Get user's role for a plugin
export type MyRoleResponse = {
  role: TeamMemberRole;
  canEdit: boolean;
};

export const getMyPluginRole = async (pluginId: string): Promise<MyRoleResponse> => {
  const response = await apiClient.get<MyRoleResponse>(`/plugins/${pluginId}/my-role`);
  return response.data;
};

// Team Management API functions

// Get team members for a plugin (admin only)
export const getTeamMembers = async (pluginId: string): Promise<TeamMember[]> => {
  const response = await apiClient.get<TeamMember[]>(`/plugins/${pluginId}/team`);
  return response.data;
};

// Create an invite link for a new team member
export type CreateInviteRequest = {
  role: TeamMemberRole;
};

export type CreateInviteResponse = {
  link: string;
  expiresAt: string;
  role: TeamMemberRole;
};

export const createTeamInvite = async (
  pluginId: string,
  data: CreateInviteRequest
): Promise<CreateInviteResponse> => {
  const response = await apiClient.post<CreateInviteResponse>(
    `/plugins/${pluginId}/team/invite`,
    data
  );
  return response.data;
};

// Validate an invite link (public endpoint, no auth required)
export const validateInvite = async (data: string, sig: string): Promise<InviteInfo> => {
  const response = await apiClient.get<InviteInfo>("/invite/validate", {
    params: { data, sig },
  });
  return response.data;
};

// Accept an invite
export type AcceptInviteRequest = {
  data: string;
  signature: string;
};

export const acceptTeamInvite = async (
  pluginId: string,
  data: AcceptInviteRequest
): Promise<{ message: string; role: string }> => {
  const response = await apiClient.post<{ message: string; role: string }>(
    `/plugins/${pluginId}/team/accept`,
    data
  );
  return response.data;
};

// Remove a team member (admin only)
export const removeTeamMember = async (
  pluginId: string,
  publicKey: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/plugins/${pluginId}/team/${encodeURIComponent(publicKey)}`
  );
  return response.data;
};

// Kill Switch API types
export type KillSwitchStatus = {
  pluginId: string;
  keygenEnabled: boolean;
  keysignEnabled: boolean;
};

// Get kill switch status (staff only)
export const getKillSwitch = async (pluginId: string): Promise<KillSwitchStatus> => {
  const response = await apiClient.get<KillSwitchStatus>(
    `/plugins/${pluginId}/kill-switch`
  );
  return response.data;
};

// Set kill switch status (staff only)
export type SetKillSwitchRequest = {
  keygenEnabled?: boolean;
  keysignEnabled?: boolean;
};

export const setKillSwitch = async (
  pluginId: string,
  data: SetKillSwitchRequest
): Promise<KillSwitchStatus> => {
  const response = await apiClient.put<KillSwitchStatus>(
    `/plugins/${pluginId}/kill-switch`,
    data
  );
  return response.data;
};
